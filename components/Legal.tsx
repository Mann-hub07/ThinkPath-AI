
import React from 'react';

export const Legal: React.FC = () => {
  return (
    <div className="py-24 max-w-4xl mx-auto px-6 space-y-20 animate-in fade-in duration-700">
      <div className="space-y-6 border-b border-white/5 pb-12">
        <h4 className="text-brand-primary font-black text-[10px] uppercase tracking-[0.5em]">Legal Framework</h4>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Terms of Service</h2>
        <p className="text-neutral-400 text-lg font-medium">Please read these terms carefully before initializing your reasoning paths.</p>
      </div>

      <div className="space-y-16">
        <section className="space-y-6">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
            1. Acceptance of Protocol
          </h3>
          <p className="text-neutral-500 text-sm leading-relaxed">
            By accessing or using the ThinkPath AI platform ("the Service"), you agree to be bound by these Terms of Service. Our reasoning engine is designed as a pedagogical tool. While we strive for accuracy, ThinkPath AI is provided "as is" and we do not guarantee specific academic or professional outcomes.
          </p>
        </section>

        <section className="space-y-6">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
            2. User Identity and Vaults
          </h3>
          <p className="text-neutral-500 text-sm leading-relaxed">
            Users are responsible for maintaining the security of their authorized accounts and "logic vaults." Any activity occurring under an account is the responsibility of the account holder. ThinkPath employs stateless JWT verification to ensure session integrity but relies on user-side security for password management.
          </p>
        </section>

        <section className="space-y-6">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
            3. Intellectual Sovereignty
          </h3>
          <p className="text-neutral-500 text-sm leading-relaxed">
            You retain all rights to the original problem statements and rough work you upload to the Service. ThinkPath retains all rights, title, and interest in and to the reasoning engine, the Socratic methodology, and the proprietary AI-generated logic blocks used to facilitate your learning journey.
          </p>
        </section>

        <section className="space-y-6">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
            4. Prohibited Conduct
          </h3>
          <p className="text-neutral-500 text-sm leading-relaxed">
            The Service is intended for intellectual growth and conceptual deconstruction. You agree not to use the Service for:
          </p>
          <ul className="space-y-3 pl-6">
            <li className="text-neutral-600 text-xs flex items-center gap-3">
              <i className="fa-solid fa-minus text-[8px]"></i>
              Automated academic dishonesty or plagiarism.
            </li>
            <li className="text-neutral-600 text-xs flex items-center gap-3">
              <i className="fa-solid fa-minus text-[8px]"></i>
              Reverse engineering the reasoning engine or its prompts.
            </li>
            <li className="text-neutral-600 text-xs flex items-center gap-3">
              <i className="fa-solid fa-minus text-[8px]"></i>
              Generation of harmful, illegal, or malicious content.
            </li>
          </ul>
        </section>

        <section className="space-y-6">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
            5. Limitation of Liability
          </h3>
          <p className="text-neutral-500 text-sm leading-relaxed">
            The reasoning engine is powered by advanced LLMs (Gemini 3 Pro). Users acknowledge that AI can occasionally produce inaccuracies or logical hallucinations. ThinkPath Inc. shall not be liable for any indirect, incidental, or consequential damages arising from the use of the Service.
          </p>
        </section>

        <section className="space-y-6">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
            6. Governing Law
          </h3>
          <p className="text-neutral-500 text-sm leading-relaxed">
            These terms are governed by applicable laws, without regard to conflict of law principles. Any disputes arising from these terms shall be resolved in the appropriate judicial forums.
          </p>
        </section>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-[0.4em]">Last Updated: December 2024</p>
          <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-[0.4em]">ThinkPath Inc.</p>
        </div>
      </div>
    </div>
  );
};
