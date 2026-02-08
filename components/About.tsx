import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="py-24 max-w-5xl mx-auto space-y-24">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-neutral-100 tracking-tight">The Art of Reasoning.</h2>
        <p className="text-neutral-400 text-base leading-relaxed">
          ThinkPath was founded on a simple observation: in an age of instant gratification, logic is being forgotten. We built a platform that enforces intellectual struggle as the path to true mastery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-neutral-900 border border-neutral-800 p-10 rounded-2xl space-y-6">
          <h3 className="text-xl font-semibold text-neutral-100">Foundational growth.</h3>
          <p className="text-neutral-400 leading-relaxed text-sm">
            We don't solve your problems. We help you deconstruct them. By verifying your understanding at every logic block, we ensure you never move forward with gaps in your mental models.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-10 rounded-2xl space-y-6">
          <h3 className="text-xl font-semibold text-neutral-100">Inference as a service.</h3>
          <p className="text-neutral-400 leading-relaxed text-sm">
            Utilizing Gemini 3 Pro's advanced reasoning capabilities, ThinkPath acts as a disciplined tutor. It recognizes when you're guessing and gently redirects you toward first principles.
          </p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 md:p-20 text-center space-y-8">
        <h3 className="text-2xl font-semibold text-neutral-100 italic">"Understanding is the only shortcut."</h3>
        <p className="text-neutral-500 max-w-2xl mx-auto text-base">
          Our core architecture is built to protect the integrity of the learning process. We believe that if you can't explain it simply, you don't understand it well enough.
        </p>
        <div className="flex justify-center gap-16 pt-4">
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-neutral-100 tracking-tight">98%</div>
            <div className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest">Retention Rate</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-neutral-100 tracking-tight">500k+</div>
            <div className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest">Logic Validated</div>
          </div>
        </div>
      </div>
    </div>
  );
};