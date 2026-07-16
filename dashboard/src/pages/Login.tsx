import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Key, User, ShieldAlert, Award } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (role: 'Doctor' | 'Admin', name: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [role, setRole] = useState<'Doctor' | 'Admin'>('Doctor');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and security key.');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate clinical auth check
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'Doctor') {
        onLoginSuccess('Doctor', `Dr. ${username}`);
      } else {
        onLoginSuccess('Admin', `Admin ${username}`);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center px-4 transition-colors">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-8"
      >
        {/* Clinician Brand */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
            <Activity className="h-7 w-7 animate-pulse" />
          </div>
          <h1 className="font-extrabold text-2xl text-slate-800 dark:text-white leading-tight">FPDAF CDSS</h1>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1.5">ICU Sepsis Forecasting Platform</p>
        </div>

        {/* Credentials Tab Toggle */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setRole('Doctor')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              role === 'Doctor'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Award className="h-4 w-4" />
            Doctor Portal
          </button>
          <button
            type="button"
            onClick={() => setRole('Admin')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              role === 'Admin'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            Hospital Admin
          </button>
        </div>

        {/* Form panel */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs p-3.5 rounded-xl font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {role === 'Doctor' ? 'Attending Username' : 'Node ID / Admin'}
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={role === 'Doctor' ? "e.g., AksharSakhi" : "e.g., Hospital-A"}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Security Access Key
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isLoading ? 'Verifying Credentials...' : 'Authenticate Clinician'}
          </button>
        </form>
      </motion.div>
      <div className="mt-8 text-center text-xs text-slate-400 max-w-sm leading-normal">
        🔒 Encrypted HIPAA-compliant clinical workspace. By signing in, you agree to Node privacy aggregation logs.
      </div>
    </div>
  );
};
