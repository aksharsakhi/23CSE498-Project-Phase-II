import os
import sys
import json
import torch
import numpy as np
from torch.utils.data import Dataset, DataLoader

# Add parent directory to sys.path to enable correct imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from federated.utils.helpers import set_seed, load_config, setup_logging, get_device, split_non_iid_dataset
from federated.evaluation.evaluator import FederatedEvaluator
from baseline.models.lstm import CentralizedLSTM

class InMemorySepsisDataset(Dataset):
    """Simple in-memory PyTorch Dataset wrapper."""
    def __init__(self, data_dict: dict):
        self.features = data_dict['features'].float()
        self.labels = data_dict['labels'].float()
        
    def __len__(self) -> int:
        return self.features.shape[0]
        
    def __getitem__(self, idx: int):
        return self.features[idx], self.labels[idx]

def run_model_inference(model, test_loader, device):
    """Helper to run inference and gather outputs."""
    model.eval()
    all_targets = []
    all_probs = []
    with torch.no_grad():
        for features, targets in test_loader:
            features = features.to(device)
            logits = model(features)
            probs = torch.sigmoid(logits)
            
            all_targets.extend(targets.numpy())
            all_probs.extend(probs.cpu().numpy())
    return np.array(all_targets), np.array(all_probs)

def main():
    # 1. Setup paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    config_path = os.path.join(base_dir, "configs", "config.yaml")
    
    # Load configuration settings
    config = load_config(config_path)
    
    # 2. Setup Logging and Seeds
    log_dir = os.path.join(os.path.dirname(base_dir), config['paths']['log_dir'])
    logger = setup_logging(log_dir, log_filename="evaluate.log")
    
    logger.info("=== Initialize Federated Four-Way Evaluation (FedAvg vs FedProx vs Ditto vs Centralized) ===")
    
    set_seed(config['seed'])
    logger.info(f"Random seed set to: {config['seed']}.")
    
    # 3. Setup Computational Device
    device = get_device(config['device'])
    logger.info(f"Compute device allocated: {device}")
    
    # 4. Load Global Test Dataset
    data_dir = os.path.join(os.path.dirname(base_dir), config['paths']['data_dir'])
    test_path = os.path.join(data_dir, "test.pt")
    
    logger.info(f"Loading global test dataset from: {test_path}")
    global_test = torch.load(test_path)
    test_dataset = InMemorySepsisDataset(global_test)
    logger.info(f"Loaded test dataset: {len(test_dataset)} samples.")
    
    # 5. Create DataLoader
    batch_size = config['local_training']['batch_size']
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)
    
    # 6. Initialize LSTM Model Shells
    model_fedavg = CentralizedLSTM(
        input_dim=config['model']['input_dim'],
        hidden_dim=config['model']['hidden_dim'],
        num_layers=config['model']['num_layers'],
        dropout=config['model']['dropout'],
        output_dim=config['model']['output_dim']
    ).to(device)
    
    model_fedprox = CentralizedLSTM(
        input_dim=config['model']['input_dim'],
        hidden_dim=config['model']['hidden_dim'],
        num_layers=config['model']['num_layers'],
        dropout=config['model']['dropout'],
        output_dim=config['model']['output_dim']
    ).to(device)
    
    model_ditto_glob = CentralizedLSTM(
        input_dim=config['model']['input_dim'],
        hidden_dim=config['model']['hidden_dim'],
        num_layers=config['model']['num_layers'],
        dropout=config['model']['dropout'],
        output_dim=config['model']['output_dim']
    ).to(device)
    
    model_ditto_pers = CentralizedLSTM(
        input_dim=config['model']['input_dim'],
        hidden_dim=config['model']['hidden_dim'],
        num_layers=config['model']['num_layers'],
        dropout=config['model']['dropout'],
        output_dim=config['model']['output_dim']
    ).to(device)
    
    checkpoint_dir = os.path.join(os.path.dirname(base_dir), config['paths']['checkpoint_dir'])
    
    # Load FedAvg model
    best_fedavg_path = os.path.join(checkpoint_dir, "best_global_model.pt")
    if os.path.exists(best_fedavg_path):
        logger.info(f"Loading best FedAvg global model: {best_fedavg_path}")
        ckpt_fedavg = torch.load(best_fedavg_path, map_location=device)
        model_fedavg.load_state_dict(ckpt_fedavg['model_state_dict'])
        has_fedavg = True
    else:
        logger.warning(f"FedAvg model checkpoint not found at: {best_fedavg_path}.")
        has_fedavg = False
        
    # Load FedProx model
    best_fedprox_path = os.path.join(checkpoint_dir, "best_fedprox_model.pt")
    if os.path.exists(best_fedprox_path):
        logger.info(f"Loading best FedProx global model: {best_fedprox_path}")
        ckpt_fedprox = torch.load(best_fedprox_path, map_location=device)
        model_fedprox.load_state_dict(ckpt_fedprox['model_state_dict'])
        has_fedprox = True
    else:
        logger.warning(f"FedProx model checkpoint not found at: {best_fedprox_path}.")
        has_fedprox = False
        
    # Load Ditto Global consensus model
    best_ditto_glob_path = os.path.join(checkpoint_dir, "best_ditto_global_model.pt")
    if os.path.exists(best_ditto_glob_path):
        logger.info(f"Loading best Ditto global consensus model: {best_ditto_glob_path}")
        ckpt_ditto_glob = torch.load(best_ditto_glob_path, map_location=device)
        model_ditto_glob.load_state_dict(ckpt_ditto_glob['model_state_dict'])
        has_ditto_glob = True
    else:
        logger.warning(f"Ditto Global model checkpoint not found at: {best_ditto_glob_path}.")
        has_ditto_glob = False
        
    # 7. Run Inference for Global Models
    y_true_global = None
    y_probs_fedavg = None
    y_probs_fedprox = None
    y_probs_ditto_glob = None
    
    if has_fedavg:
        logger.info("Running FedAvg inference...")
        y_true_global, y_probs_fedavg = run_model_inference(model_fedavg, test_loader, device)
        fedavg_metrics = FederatedEvaluator.compute_metrics(y_true_global, y_probs_fedavg)
    else:
        fedavg_metrics = None
        
    if has_fedprox:
        logger.info("Running FedProx inference...")
        y_true_global, y_probs_fedprox = run_model_inference(model_fedprox, test_loader, device)
        fedprox_metrics = FederatedEvaluator.compute_metrics(y_true_global, y_probs_fedprox)
    else:
        fedprox_metrics = None
        
    if has_ditto_glob:
        logger.info("Running Ditto Global inference...")
        y_true_global, y_probs_ditto_glob = run_model_inference(model_ditto_glob, test_loader, device)
        ditto_glob_metrics = FederatedEvaluator.compute_metrics(y_true_global, y_probs_ditto_glob)
    else:
        ditto_glob_metrics = None
        
    # 8. Run Inference for Ditto Personalized Models
    # Split the global test set into same Non-IID client splits for personalized evaluation
    scaler_path = os.path.join(data_dir, "scaler.pkl")
    metadata_path = os.path.join(data_dir, "preprocessing_metadata.json")
    with open(metadata_path, 'r') as f:
        meta_json = json.load(f)
    feature_columns = meta_json['feature_columns']
    
    logger.info("Partitioning test dataset for client-specific personalization evaluation...")
    test_splits = split_non_iid_dataset(global_test, scaler_path, feature_columns)
    
    y_true_pers_concat = []
    y_probs_pers_concat = []
    has_ditto_pers = True
    
    for i in range(config['federated']['num_clients']):
        client_test_path = os.path.join(checkpoint_dir, f"client_{i}_personalized_model.pt")
        if not os.path.exists(client_test_path):
            logger.warning(f"Client {i} personalized checkpoint not found at: {client_test_path}. Skipping Ditto Personalized evaluation.")
            has_ditto_pers = False
            break
            
        logger.info(f"Loading client {i} personalized weights...")
        ckpt = torch.load(client_test_path, map_location=device)
        model_ditto_pers.load_state_dict(ckpt['personalized_weights'])
        
        client_test_dataset = InMemorySepsisDataset(test_splits[i])
        client_test_loader = DataLoader(client_test_dataset, batch_size=batch_size, shuffle=False)
        
        c_targets, c_probs = run_model_inference(model_ditto_pers, client_test_loader, device)
        y_true_pers_concat.extend(c_targets)
        y_probs_pers_concat.extend(c_probs)
        
    if has_ditto_pers:
        y_true_pers_concat = np.array(y_true_pers_concat)
        y_probs_pers_concat = np.array(y_probs_pers_concat)
        ditto_pers_metrics = FederatedEvaluator.compute_metrics(y_true_pers_concat, y_probs_pers_concat)
        logger.info("Ditto Personalized model evaluation completed across clients.")
    else:
        ditto_pers_metrics = None
        
    # 9. Compute and Save JSON metrics reports
    results_dir = os.path.join(os.path.dirname(base_dir), config['paths']['results_dir'])
    os.makedirs(results_dir, exist_ok=True)
    
    if ditto_glob_metrics:
        with open(os.path.join(results_dir, "test_metrics_ditto_global.json"), 'w') as f:
            json.dump(ditto_glob_metrics, f, indent=4)
    if ditto_pers_metrics:
        with open(os.path.join(results_dir, "test_metrics_ditto_personalized.json"), 'w') as f:
            json.dump(ditto_pers_metrics, f, indent=4)
            
    # Load Centralized Baseline Metrics
    cent_results_dir = os.path.join(os.path.dirname(base_dir), config['paths']['centralized_results_dir'])
    centralized_metrics_path = os.path.join(cent_results_dir, "test_metrics.json")
    
    # Compile 4-way comparison report
    dummy_metrics = {
        'accuracy': 0.0, 'precision': 0.0, 'recall': 0.0, 'f1_score': 0.0, 'auroc': 0.0,
        'confusion_matrix': {'tp': 0, 'fp': 0, 'tn': 0, 'fn': 0}
    }
    
    comparison_save_path = os.path.join(results_dir, "four_way_comparison.json")
    comparison = FederatedEvaluator.save_four_way_comparison_report(
        fedavg_metrics=fedavg_metrics if fedavg_metrics else dummy_metrics,
        fedprox_metrics=fedprox_metrics if fedprox_metrics else dummy_metrics,
        ditto_glob_metrics=ditto_glob_metrics if ditto_glob_metrics else dummy_metrics,
        ditto_pers_metrics=ditto_pers_metrics if ditto_pers_metrics else dummy_metrics,
        centralized_metrics_path=centralized_metrics_path,
        save_path=comparison_save_path
    )
    logger.info(f"Saved four-way comparative metrics JSON to: {comparison_save_path}")
    
    # 10. Generate Overlay plots
    if has_fedavg and has_fedprox and has_ditto_glob and has_ditto_pers:
        FederatedEvaluator.generate_four_way_comparison_plots(
            y_true_global=y_true_global,
            y_probs_fedavg=y_probs_fedavg,
            y_probs_fedprox=y_probs_fedprox,
            y_probs_ditto_global=y_probs_ditto_glob,
            y_true_local_concat=y_true_pers_concat,
            y_probs_ditto_pers_concat=y_probs_pers_concat,
            centralized_metrics_path=centralized_metrics_path,
            save_dir=results_dir
        )
        logger.info(f"Four-way comparative overlays and matrices saved under: {results_dir}")
        
    # Log comparative metrics to console
    logger.info("=== Four-Way Test Performance Summary ===")
    logger.info("  Metric             |  Centralized  |    FedAvg     |    FedProx    | Ditto Global  | Ditto Pers.   | Diff (Pers-Avg)")
    logger.info("  -------------------|---------------|---------------|---------------|---------------|---------------|----------------")
    
    metrics_list = ['accuracy', 'precision', 'recall', 'f1_score', 'auroc']
    for m in metrics_list:
        val_cent = comparison['centralized'][metrics_list.index(m)] if 'centralized' in comparison else 0.0
        val_fed = comparison['fedavg'][metrics_list.index(m)]
        val_prox = comparison['fedprox'][metrics_list.index(m)]
        val_d_glob = comparison['ditto_global'][metrics_list.index(m)]
        val_d_pers = comparison['ditto_personalized'][metrics_list.index(m)]
        val_diff = val_d_pers - val_fed
        
        str_cent = f"{val_cent*100:.2f}%" if m != 'f1_score' and m != 'auroc' else f"{val_cent:.4f}"
        str_fed = f"{val_fed*100:.2f}%" if m != 'f1_score' and m != 'auroc' else f"{val_fed:.4f}"
        str_prox = f"{val_prox*100:.2f}%" if m != 'f1_score' and m != 'auroc' else f"{val_prox:.4f}"
        str_d_glob = f"{val_d_glob*100:.2f}%" if m != 'f1_score' and m != 'auroc' else f"{val_d_glob:.4f}"
        str_d_pers = f"{val_d_pers*100:.2f}%" if m != 'f1_score' and m != 'auroc' else f"{val_d_pers:.4f}"
        str_diff = f"{val_diff*100:+.2f}%" if m != 'f1_score' and m != 'auroc' else f"{val_diff:+.4f}"
        
        logger.info(f"  {m.capitalize():18s} | {str_cent:13s} | {str_fed:13s} | {str_prox:13s} | {str_d_glob:13s} | {str_d_pers:13s} | {str_diff:14s}")
        
    logger.info("=== Federated Testing Evaluation Completed Successfully ===")

if __name__ == "__main__":
    main()
