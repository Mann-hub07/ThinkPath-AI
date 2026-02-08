import React from 'react';
import { SavedSession } from '../types';

interface ContextPanelProps {
  isOpen: boolean;
  session: SavedSession | null;
  onToggle: () => void;
}

export const ContextPanel: React.FC<ContextPanelProps> = ({ isOpen, session, onToggle }) => {
  if (!isOpen) return null;

  return (
    <aside className="w-80 bg-neutral-900 border-l border-neutral-800 flex flex-col shrink-0 animate-in slide-in-from-right duration-200">
      <div className="p-6 flex items-center justify-between border-b border-neutral-800 shrink-0">
        <h3 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Context & Support</h3>
        <button onClick={onToggle} className="text-neutral-500 hover:text-neutral-100">
          <i className="fa-solid fa-xmark text-xs"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10">
        {/* Visual Reference */}
        {session?.imageData && (
          <div className="space-y-4">
            <h4 className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Visual Input Analysis</h4>
            <div className="rounded-xl border border-neutral-800 overflow-hidden group relative">
              <img src={session.imageData} className="w-full h-40 object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
              <div className="absolute inset-0 bg-neutral-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                 <span className="text-[10px] text-white font-bold bg-black/60 px-3 py-1 rounded-full uppercase tracking-widest">Expand Analysis</span>
              </div>
            </div>
            <p className="text-[11px] text-neutral-600 leading-relaxed italic">
              📌 System has indexed rough work. Indicators added to reasoning blocks where relevant.
            </p>
          </div>
        )}

        {/* References */}
        <div className="space-y-4">
          <h4 className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Quick Reference</h4>
          <div className="space-y-3">
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
              <p className="text-xs font-bold text-neutral-200">⚠️ Critical Path</p>
              <p className="text-[10px] text-neutral-500 leading-relaxed">System prioritizes conceptual deconstruction over solution generation.</p>
            </div>
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
              <p className="text-xs font-bold text-neutral-200">🔍 Hint Protocol</p>
              <p className="text-[10px] text-neutral-500 leading-relaxed">Unlock hints only when mental models feel fractured. Shortcuts lead to surface understanding.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Context - Future extension */}
        {!session && (
          <div className="h-full flex items-center justify-center text-center px-4">
            <p className="text-[10px] text-neutral-700 uppercase tracking-widest font-bold">Inquiry Pending...</p>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-neutral-800 shrink-0">
         <p className="text-[10px] text-neutral-600 font-medium leading-relaxed italic">
           ThinkPath AI mentor is powered by Gemini 3 Pro reasoning engine.
         </p>
      </div>
    </aside>
  );
};