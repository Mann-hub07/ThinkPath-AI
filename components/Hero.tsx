
import React from 'react';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative pt-24 pb-16 px-6 text-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="inline-flex items-center space-x-2 bg-neutral-900 border border-white/5 rounded-full px-4 py-1.5 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-neutral-400 text-xs font-bold uppercase tracking-[0.2em]">Guided Reasoning Engine v3.0</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold mb-8 tracking-tight text-white leading-[1.05]">
          Master logic <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            3x faster with AI.
          </span>
        </h1>
        
        <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
          The first AI mentor that forces you to think. ThinkPath doesn't just give answers—it builds the neural pathways for true problem solving.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button 
            onClick={onStart}
            className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-neutral-200 transition-all flex items-center space-x-3 text-lg group shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            <span>Start Reasoning</span>
            <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
          </button>
          <button className="px-8 py-4 bg-neutral-900 border border-white/5 text-white font-bold rounded-2xl hover:bg-neutral-800 transition-all text-lg">
            View Methodology
          </button>
        </div>

        {/* Mock Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-white/5 bg-white/[0.02] rounded-3xl backdrop-blur-sm">
          <div className="space-y-1">
            <h4 className="text-3xl font-bold text-white">3x</h4>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Mastery Velocity</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-bold text-white">98%</h4>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Concept Retention</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-bold text-white">200ms</h4>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Inference Speed</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-bold text-white">1.2M+</h4>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Logic Nodes Mapped</p>
          </div>
        </div>
      </div>
    </div>
  );
};
