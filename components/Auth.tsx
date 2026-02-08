
import React, { useState } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthProps {
  onAuthComplete: (user: User) => void;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  isFullScreen?: boolean;
}

// Fixed CardWrapper by moving it outside and explicitly typing children and props
// This avoids issues with local component inference and improves performance
const CardWrapper: React.FC<{ children: React.ReactNode; isFullScreen: boolean }> = ({ children, isFullScreen }) => {
  if (isFullScreen) {
    return (
      <div className="flex flex-col items-center justify-center px-6 animate-in fade-in duration-1000 min-h-[60vh]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
        <div className="w-full max-w-[440px] relative z-10">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-neutral-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-[440px] animate-in zoom-in-95 duration-500">
        {children}
      </div>
    </div>
  );
};

export const Auth: React.FC<AuthProps> = ({ onAuthComplete, onClose, initialMode = 'login', isFullScreen = false }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (mode === 'signup') {
        const res = await authService.signup(name, email, password);
        if (res.error) setError(res.error);
        else if (res.user) onAuthComplete(res.user);
      } else {
        const res = await authService.login(email, password);
        if (res.error) setError(res.error);
        else if (res.user) onAuthComplete(res.user);
      }
    } catch (err) {
      setError("An unexpected authentication error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardWrapper isFullScreen={isFullScreen}>
      <div className="bg-neutral-900/40 border border-white/[0.06] rounded-[48px] p-10 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/20 blur-[60px] rounded-full"></div>
        
        <div className="relative z-10 space-y-10">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-brand-primary rounded-[20px] flex items-center justify-center text-white mx-auto shadow-2xl shadow-brand-primary/30 mb-8">
              <i className={`fa-solid ${mode === 'signup' ? 'fa-user-plus' : 'fa-lock-open'} text-2xl`}></i>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              {mode === 'signup' ? 'Create Identity.' : 'Authorized Entry.'}
            </h2>
            <p className="text-neutral-500 text-sm font-medium">
              {mode === 'signup' 
                ? 'Join the elite reasoning network today.' 
                : 'Secure access to your logic vaults.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs flex items-center gap-3 animate-in shake duration-500">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span className="font-bold tracking-tight">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] ml-4">Full Name</label>
                <div className="relative group">
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-neutral-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-neutral-800"
                  />
                  <div className="absolute inset-y-0 right-6 flex items-center text-neutral-800 group-focus-within:text-brand-primary/50 transition-colors">
                    <i className="fa-solid fa-signature"></i>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] ml-4">Email Address</label>
              <div className="relative group">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-neutral-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-neutral-800"
                />
                <div className="absolute inset-y-0 right-6 flex items-center text-neutral-800 group-focus-within:text-brand-primary/50 transition-colors">
                  <i className="fa-solid fa-envelope"></i>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-4 mr-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Password</label>
                {mode === 'login' && (
                  <button type="button" className="text-[9px] font-black text-brand-primary/60 uppercase tracking-widest hover:text-brand-primary transition-colors">Forgot?</button>
                )}
              </div>
              <div className="relative group">
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-neutral-800"
                />
                <div className="absolute inset-y-0 right-6 flex items-center text-neutral-800 group-focus-within:text-brand-primary/50 transition-colors">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-white/5 hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3"
              >
                {isLoading ? (
                  <i className="fa-solid fa-circle-notch animate-spin text-lg"></i>
                ) : (
                  <>
                    <span>{mode === 'signup' ? 'Create Account' : 'Initialize Session'}</span>
                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="pt-8 text-center">
            <p className="text-neutral-600 text-[11px] font-bold uppercase tracking-widest">
              {mode === 'signup' ? 'Already a member?' : 'New to ThinkPath?'}
              <button 
                onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                className="ml-2 text-white hover:text-brand-primary transition-colors"
              >
                {mode === 'signup' ? 'Login' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {!isFullScreen && (
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-500 hover:text-white transition-all border border-white/5"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        )}
      </div>
    </CardWrapper>
  );
};
