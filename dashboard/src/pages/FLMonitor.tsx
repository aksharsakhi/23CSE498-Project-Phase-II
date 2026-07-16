import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Network, 
  Server, 
  Database, 
  RefreshCw, 
  ArrowDownUp, 
  Play, 
  Pause 
} from 'lucide-react';

export const FLMonitor: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  // Simulated node stats
  const nodes = [
    { name: 'Hospital A (Client 0)', data: '92,613 samples', status: 'Active (Consensus)', lag: '42ms' },
    { name: 'Hospital B (Client 1)', data: '151,916 samples', status: 'Active (Consensus)', lag: '38ms' },
    { name: 'Hospital C (Client 2)', data: '233,140 samples', status: 'CSSP Selective Head Adapt', lag: 'N/A (Bypassed)' }
  ];

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">Federated Learning Monitor</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Live parameter aggregation pipeline showing consensus loops and communication status</p>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center gap-2 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md ${
            isPlaying ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isPlaying ? 'Pause Workflow' : 'Play Live Loop'}
        </button>
      </div>

      {/* Animation Canvas */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Floating background grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>

        <div className="w-full max-w-3xl flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
          
          {/* Hospital Nodes (Left Side) */}
          <div className="flex flex-col gap-8 w-full md:w-64">
            {nodes.map((node, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="bg-slate-800/80 backdrop-blur-md border border-slate-700 p-4 rounded-xl flex items-center gap-3.5 relative"
              >
                <div className="p-3 bg-blue-950 text-blue-400 rounded-lg">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white leading-tight">{node.name}</h4>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{node.data}</span>
                  <span className={`text-[9px] font-bold mt-1 inline-block ${
                    node.status.includes('CSSP') ? 'text-amber-400' : 'text-emerald-400'
                  }`}>{node.status}</span>
                </div>

                {/* Animated sliding packet towards server */}
                {isPlaying && (
                  <motion.div
                    initial={{ x: 0, opacity: 0 }}
                    animate={{ 
                      x: [0, 200, 200, 0], 
                      opacity: [0, 1, 1, 0] 
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      delay: i * 1.2,
                      ease: 'easeInOut'
                    }}
                    className="absolute right-0 h-2.5 w-2.5 bg-blue-500 rounded-full shadow-lg shadow-blue-400/50 hidden md:block"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Central Connecting Hub */}
          <div className="flex items-center justify-center shrink-0">
            <div className="h-16 w-16 bg-blue-950/50 border border-blue-500/30 rounded-full flex items-center justify-center animate-pulse">
              <ArrowDownUp className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          {/* Central Federated Server (Right Side) */}
          <div className="w-full md:w-64">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-slate-800/80 backdrop-blur-md border border-slate-700 p-6 rounded-2xl flex flex-col items-center text-center space-y-4 relative"
            >
              <div className="p-4 bg-blue-600/10 text-blue-400 rounded-2xl border border-blue-500/20">
                <Server className="h-10 w-10 animate-bounce" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white leading-tight">Central Aggregation Server</h3>
                <span className="text-[10px] text-slate-400 mt-1 block">FPDAF Global Aggregator v1.0.4</span>
              </div>
              <div className="bg-slate-900 border border-slate-700/60 px-4 py-2 rounded-xl text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                FedAvg Aggregation Active
              </div>

              {/* Animated sliding packet from server back to clients */}
              {isPlaying && (
                <motion.div
                  initial={{ x: 0, opacity: 0 }}
                  animate={{ 
                    x: [0, -200, -200, 0], 
                    opacity: [0, 1, 1, 0] 
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    delay: 2,
                    ease: 'easeInOut'
                  }}
                  className="absolute left-0 h-2.5 w-2.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-400/50 hidden md:block"
                />
              )}
            </motion.div>
          </div>

        </div>

        {/* Dynamic loop label */}
        <div className="mt-8 text-center text-xs text-slate-400 font-medium">
          🔄 Consensus Loop: local epochs training → send weights → FedAvg aggregation → update global parameter weights.
        </div>
      </div>

      {/* Network telemetry stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-slate-400 block font-medium">Total Comm Rounds</span>
          <h3 className="font-black text-2xl text-slate-800 dark:text-white">10 / 10</h3>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-slate-400 block font-medium">Node Participation</span>
          <h3 className="font-black text-2xl text-slate-800 dark:text-white">100% (3/3 nodes)</h3>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-slate-400 block font-medium">CSSP Bypasses Saved</span>
          <h3 className="font-black text-2xl text-emerald-500">38% Bandwidth</h3>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-slate-400 block font-medium">Aggregation Latency</span>
          <h3 className="font-black text-2xl text-slate-800 dark:text-white">1.8s avg</h3>
        </div>
      </div>
    </div>
  );
};
