
import React from 'react';

export const Methodology: React.FC = () => {
  return (
    <div className="py-24 max-w-5xl mx-auto px-6 space-y-24 animate-in fade-in duration-700">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h4 className="text-brand-primary font-black text-[10px] md:text-[12px] uppercase tracking-[0.5em]">The Framework</h4>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">Understand first. <br /><span className="text-neutral-800 text-3xl md:text-5xl">Answer later.</span></h2>
        <p className="text-neutral-400 text-lg leading-relaxed">
          ThinkPath isn't a calculator or a simple chatbot. It is a pedagogical engine designed to mirror the Socratic method, ensuring that learning happens through active logical deconstruction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-neutral-900/50 border border-white/5 p-10 rounded-[40px] space-y-6">
          <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
            <i className="fa-solid fa-puzzle-piece text-xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-white">Deconstruction</h3>
          <p className="text-neutral-500 leading-relaxed text-sm">
            We break monolithic problems into 4-6 distinct logic hurdles. Each hurdle represents a conceptual bridge that must be crossed before the final solution is accessible.
          </p>
        </div>
        
        <div className="bg-neutral-900/50 border border-white/5 p-10 rounded-[40px] space-y-6">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
            <i className="fa-solid fa-microscope text-xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-white">Verification</h3>
          <p className="text-neutral-500 leading-relaxed text-sm">
            The reasoning engine doesn't just look for keywords. It analyzes the *logic path* you provide in response to Socratic checks, identifying conceptual gaps in real-time.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-brand-primary/5 to-transparent border border-white/5 rounded-[48px] p-12 md:p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
          <i className="fa-solid fa-brain text-neutral-900 text-[120px] opacity-20"></i>
        </div>
        <div className="relative z-10 max-w-2xl space-y-8">
          <h3 className="text-3xl font-black text-white">The Struggle is the Shortcut.</h3>
          <p className="text-neutral-400 text-base leading-relaxed">
            Cognitive science tells us that retention is a function of effort. By forcing you to explain the "why" behind every "what," ThinkPath creates deeper neural encoding than passive reading or instant answers ever could.
          </p>
          <ul className="space-y-4">
            {[
              "First Principles Thinking: Stripping problems to their base logic.",
              "Error Signal Analysis: Learning from logic breaks, not just binary results.",
              "Directed Socratic Dialogue: AI-guided conceptual redirects."
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-white text-sm font-bold tracking-tight">
                <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
