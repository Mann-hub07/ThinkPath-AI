
import React from 'react';
import { Field, SavedSession, User } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeField: Field;
  onFieldChange: (field: Field) => void;
  sessions: SavedSession[];
  currentSessionId?: string;
  onSelectSession: (session: SavedSession) => void;
  onNewSession: () => void;
  user: User | null;
  onLogout: () => void;
  onLogin: () => void;
  onGoHome: () => void;
}

const fieldIcons: Record<Field, string> = {
  'Mathematics': 'fa-calculator',
  'Physics': 'fa-atom',
  'Computer Science': 'fa-code',
  'Chemistry': 'fa-flask-vial',
  'Philosophy': 'fa-landmark',
  'General': 'fa-lightbulb'
};

const fields: Field[] = ['Mathematics', 'Physics', 'Computer Science', 'Chemistry', 'Philosophy', 'General'];

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, onToggle, activeField, onFieldChange, sessions, currentSessionId, onSelectSession, onNewSession, user, onLogout, onLogin, onGoHome
}) => {
  if (!isOpen) {
    return (
      <div className="fixed top-6 left-6 z-[80] flex flex-col gap-3">
        <button 
          onClick={onToggle}
          className="w-12 h-12 bg-neutral-900 border border-white/5 rounded-2xl flex items-center justify-center text-neutral-500 hover:text-white transition-all hover:bg-neutral-800"
        >
          <i className="fa-solid fa-bars-staggered"></i>
        </button>
        <button 
          onClick={onGoHome}
          className="w-12 h-12 bg-neutral-900 border border-white/5 rounded-2xl flex items-center justify-center text-neutral-500 hover:text-brand-primary transition-all hover:bg-neutral-800"
        >
          <i className="fa-solid fa-house-user"></i>
        </button>
      </div>
    );
  }

  return (
    <aside className="w-[320px] bg-neutral-950 border-r border-white/[0.04] flex flex-col shrink-0 animate-in slide-in-from-left duration-500 z-[80]">
      {/* Brand & New Path */}
      <div className="p-8 space-y-8 border-b border-white/[0.02] shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={onGoHome}>
            <div className="bg-brand-primary w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm shadow-lg shadow-brand-primary/20 group-hover:rotate-6 transition-all">
              <i className="fa-solid fa-route"></i>
            </div>
            <span className="text-lg font-black tracking-tighter text-white">ThinkPath</span>
          </div>
          <button onClick={onToggle} className="w-9 h-9 rounded-xl bg-white/[0.02] flex items-center justify-center text-neutral-600 hover:text-white transition-all">
            <i className="fa-solid fa-chevron-left text-xs"></i>
          </button>
        </div>

        <button onClick={onNewSession} className="w-full flex items-center gap-4 p-4 rounded-3xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all group">
          <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-plus"></i>
          </div>
          <div className="text-left">
            <span className="block text-sm font-bold text-white">New Path</span>
            <span className="block text-[10px] text-neutral-600 font-bold uppercase tracking-widest">Start reasoning</span>
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
        {/* Subject Selector */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-neutral-700 uppercase tracking-[0.4em] px-2">Subjects</h3>
          <div className="grid grid-cols-1 gap-1">
            {fields.map(f => (
              <button
                key={f}
                onClick={() => { onFieldChange(f); onNewSession(); }}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-[11px] font-bold tracking-wider transition-all border ${
                  activeField === f && !currentSessionId 
                    ? 'bg-white border-white text-black shadow-xl' 
                    : 'text-neutral-500 hover:text-white hover:bg-white/[0.03] border-transparent'
                }`}
              >
                <i className={`fa-solid ${fieldIcons[f]} text-sm w-5 text-center`}></i>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black text-neutral-700 uppercase tracking-[0.4em]">History</h3>
            <span className="text-[9px] font-bold text-neutral-800">{sessions.length} sessions</span>
          </div>
          <div className="space-y-2">
            {sessions.length > 0 ? (
              sessions.map(s => (
                <button
                  key={s.id}
                  onClick={() => onSelectSession(s)}
                  className={`w-full text-left p-4 rounded-3xl transition-all group border ${
                    currentSessionId === s.id 
                      ? 'bg-neutral-900 border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]' 
                      : 'border-transparent hover:bg-white/[0.02] hover:border-white/[0.05]'
                  }`}
                >
                  <p className={`text-[12px] font-bold truncate leading-tight mb-2 ${currentSessionId === s.id ? 'text-white' : 'text-neutral-500'}`}>
                    {s.problem}
                  </p>
                  <div className="flex items-center gap-3">
                    <i className={`fa-solid ${fieldIcons[s.field]} text-[9px] text-neutral-600`}></i>
                    <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">{s.field}</span>
                    <div className="w-0.5 h-0.5 rounded-full bg-neutral-800"></div>
                    <span className="text-[9px] font-black text-neutral-700 uppercase tracking-widest">
                        {new Date(s.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  {currentSessionId === s.id && (
                    <div className="mt-3 h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                          style={{ width: `${(s.currentStepIndex / s.steps.length) * 100}%` }}
                        ></div>
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center bg-white/[0.01] border border-dashed border-white/[0.05] rounded-3xl">
                <p className="text-[10px] text-neutral-800 uppercase tracking-[0.2em] font-black">No history yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="p-6 border-t border-white/[0.02] shrink-0 space-y-4">
        <button 
          onClick={onGoHome}
          className="w-full py-3 flex items-center justify-center gap-3 text-[10px] font-black text-neutral-600 uppercase tracking-widest hover:text-white transition-all"
        >
          <i className="fa-solid fa-house"></i>
          Return Home
        </button>

        {user ? (
          <div className="flex items-center justify-between bg-neutral-900/40 border border-white/[0.03] p-4 rounded-3xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-primary/20 text-brand-primary rounded-2xl flex items-center justify-center text-xs font-black">
                {user.name[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-[12px] font-black text-white truncate">{user.name}</p>
                <button onClick={onLogout} className="text-[9px] font-black text-neutral-600 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-power-off text-[8px]"></i>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={onLogin}
            className="w-full py-5 bg-white text-black rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-neutral-200 transition-all active:scale-95"
          >
            Sign In
          </button>
        )}
      </div>
    </aside>
  );
};
