
import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="py-24 max-w-4xl mx-auto px-6 space-y-20 animate-in fade-in duration-700">
      <div className="space-y-6">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Privacy Protocol.</h2>
        <p className="text-neutral-400 text-lg font-medium leading-relaxed">
          ThinkPath operates on a principle of cognitive sovereignty. You own your reasoning, and we protect its journey.
        </p>
      </div>

      <div className="space-y-12">
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-white tracking-tight">Data Handling</h3>
          <p className="text-neutral-500 text-sm leading-relaxed">
            When you interact with the reasoning engine, your inputs are processed locally and only transmitted to the Gemini 3 Pro model via encrypted TLS channels. We do not sell your logic paths or personal identity to third-party advertisers.
          </p>
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-bold text-white tracking-tight">Identity & Vaulting</h3>
          <p className="text-neutral-500 text-sm leading-relaxed">
            User accounts are identified by an email and name, hashed before storage. Your passwords never touch our servers in plain text. We utilize local vaulting to ensure that your session history remains under your control.
          </p>
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-bold text-white tracking-tight">Third-Party Services</h3>
          <p className="text-neutral-500 text-sm leading-relaxed">
            We utilize the Gemini API for our reasoning core. While data is sent to the model for inference, it is handled according to enterprise safety standards and is not used to train the base model without explicit institutional consent.
          </p>
        </section>

        <div className="pt-12 border-t border-white/5">
          <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-[0.4em]">Last Updated: December 2024</p>
        </div>
      </div>
    </div>
  );
};
