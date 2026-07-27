import React, { useState } from 'react';
import { HeartPulse, Key, User, ShieldAlert, Award, Sparkles } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (role: 'Doctor' | 'Admin', name: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [role, setRole] = useState<'Doctor' | 'Admin'>('Doctor');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickLogin = (presetRole: 'Doctor' | 'Admin', name: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(presetRole, name);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and security key.');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'Doctor') {
        onLoginSuccess('Doctor', `Dr. ${username}`);
      } else {
        onLoginSuccess('Admin', `Admin ${username}`);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#080e1a] flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/10 rounded-full blur-3 Keb opacity-70 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="h-14 w-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4 shadow-xl shadow-teal-500/10">
            <HeartPulse className="h-8 w-8 animate-pulse text-teal-500" />
          </div>
          <h1 className="font-bold text-2xl text-slate-800 dark:text-white tracking-tight">FPDAF CDSS Workstation</h1>
          <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-widest mt-1">
            Clinical AI Early-Warning Sepsis Forecasting
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 dark:bg-[#0d1829]/90 backdrop-blur-xl border border-slate-200 dark:border-[#1a2744] rounded-2xl shadow-2xl p-6 space-y-5">
          {/* Quick Demo Presets */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-teal-400" /> Instant Demo Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('Doctor', 'Dr. Akshar Sakhi')}
                className="p-2.5 rounded-xl border border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 text-teal-600 dark:text-teal-400 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Award className="h-3.5 w-3.5 text-teal-500" /> Dr. Akshar Sakhi
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">ICU Specialist (Doctor)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('Admin', 'Admin Administrator')}
                className="p-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-500" /> FL Administrator
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">CUSUM & Network Admin</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-[#1a2744]"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Or Manual Login</span>
            <div className="flex-grow border-t border-slate-200 dark:border-[#1a2744]"></div>
          </div>

          {/* Role Toggle */}
          <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-[#0a1323] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setRole('Doctor')}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                role === 'Doctor'
                  ? 'bg-white dark:bg-[#152238] text-teal-600 dark:text-teal-400 shadow-md'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Award className="h-3.5 w-3.5" /> Clinician
            </button>
            <button
              type="button"
              onClick={() => setRole('Admin')}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                role === 'Admin'
                  ? 'bg-white dark:bg-[#152238] text-teal-600 dark:text-teal-400 shadow-md'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" /> Administrator
            </button>
          </div>

          {/* Manual Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs p-3 rounded-xl font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                {role === 'Doctor' ? 'Clinician Username' : 'Node Security ID'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={role === 'Doctor' ? "e.g. Dr. Sakhi" : "e.g. Hospital-A-Node"}
                  className="w-full bg-slate-50 dark:bg-[#0a1323] border border-slate-200 dark:border-[#1a2744] rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Security Authorization Token
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 dark:bg-[#0a1323] border border-slate-200 dark:border-[#1a2744] rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-teal-600/20 transition-all text-xs disabled:opacity-50"
            >
              {isLoading ? 'Authenticating Clinical Workspace...' : 'Launch Clinical Workstation'}
            </button>
          </form>
        </div>

        <div className="text-center text-[10px] text-slate-400 font-medium">
          🛡️ HIPAA & DPDPA Compliant Local Edge-AI Architecture
        </div>
      </div>
    </div>
  );
};

