import torch
import torch.nn as nn
import torch.nn.functional as F

class MultiHeadTemporalAttention(nn.Module):
    """
    Multi-Head Temporal Attention pooling mechanism.
    Projects LSTM hidden states into queries, keys, and values across multiple heads,
    computes attention maps, and outputs a combined representation.
    """
    def __init__(self, hidden_dim: int, num_heads: int = 4):
        super(MultiHeadTemporalAttention, self).__init__()
        self.num_heads = num_heads
        self.head_dim = hidden_dim // num_heads
        assert hidden_dim % num_heads == 0, "hidden_dim must be divisible by num_heads"
        
        self.q_proj = nn.Linear(hidden_dim, hidden_dim, bias=False)
        self.k_proj = nn.Linear(hidden_dim, hidden_dim, bias=False)
        self.v_proj = nn.Linear(hidden_dim, hidden_dim, bias=False)
        self.out_proj = nn.Linear(hidden_dim, hidden_dim)
        
    def forward(self, x: torch.Tensor, return_attention: bool = False):
        # x shape: (batch_size, seq_len, hidden_dim)
        batch_size, seq_len, hidden_dim = x.size()
        
        # Project queries, keys, values and reshape for multi-head processing
        q = self.q_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim).transpose(1, 2)
        k = self.k_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim).transpose(1, 2)
        v = self.v_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim).transpose(1, 2)
        
        # Scaled dot-product attention scores
        # scores shape: (batch_size, num_heads, seq_len, seq_len)
        scores = torch.matmul(q, k.transpose(-2, -1)) / (self.head_dim ** 0.5)
        attn_weights = F.softmax(scores, dim=-1)
        
        # Weighted context shape: (batch_size, num_heads, seq_len, head_dim)
        context = torch.matmul(attn_weights, v)
        context = context.transpose(1, 2).contiguous().view(batch_size, seq_len, hidden_dim)
        
        # Pool across sequence length dimension to get sequence representation (mean pooling)
        pooled_context = torch.mean(context, dim=1)
        pooled_context = self.out_proj(pooled_context)
        
        if return_attention:
            # Average attention weights across heads and sequence dimensions
            # Yields a temporal weight of shape (batch_size, seq_len, 1)
            avg_attn = torch.mean(attn_weights, dim=1)  # (batch_size, seq_len, seq_len)
            temporal_weights = torch.mean(avg_attn, dim=1).unsqueeze(-1)  # (batch_size, seq_len, 1)
            return pooled_context, temporal_weights
            
        return pooled_context

class PersonalizedAttentionLSTM(nn.Module):
    """
    Upgraded Proposed FPDAF model architecture.
    Combines a base Bidirectional LSTM feature extractor (shared backbone) with a 
    Multi-Head Temporal Attention mechanism and a personalized classification head.
    """
    def __init__(
        self, 
        input_dim: int = 40, 
        hidden_dim: int = 64, 
        num_layers: int = 2, 
        dropout: float = 0.3,
        output_dim: int = 1
    ):
        super(PersonalizedAttentionLSTM, self).__init__()
        
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers
        
        # Bidirectional LSTM layer (Shared Backbone parameter weights)
        self.lstm = nn.LSTM(
            input_size=input_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0.0,
            bidirectional=True
        )
        
        # Multi-Head Temporal Self-Attention pooling (Shared backbone parameter weights)
        self.attention = MultiHeadTemporalAttention(hidden_dim=hidden_dim * 2, num_heads=4)
        
        # Fully Connected Classification Head (Personalized head weights)
        self.classifier = nn.Sequential(
            nn.Linear(hidden_dim * 2, hidden_dim),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim, output_dim)
        )
        
    def forward(self, x: torch.Tensor, return_attention: bool = False):
        # lstm_out shape: (batch_size, sequence_length, hidden_dim * 2)
        lstm_out, _ = self.lstm(x)
        
        if return_attention:
            context, attn_weights = self.attention(lstm_out, return_attention=True)
            logits = self.classifier(context)
            return logits, attn_weights
            
        context = self.attention(lstm_out, return_attention=False)
        logits = self.classifier(context)
        return logits
