
import React from 'react';

export const Security: React.FC = () => {
  return (
    <div className="py-24 max-w-5xl mx-auto px-6 space-y-24 animate-in fade-in duration-700">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h4 className="text-emerald-500 font-black text-[10px] md:text-[12px] uppercase tracking-[0.5em]">Defense Grade</h4>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">Stateless. <br /><span className="text-neutral-800 text-3xl md:text-5xl">Vaulted. Secure.</span></h2>
        <p className="text-neutral-400 text-lg leading-relaxed">
          ThinkPath is built on a stateless zero-knowledge architecture. Your logic and identity are protected through advanced cryptographic standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: 'fa-fingerprint', title: 'JWT Auth', desc: 'Stateless session management via signed tokens.' },
          { icon: 'fa-key', title: 'SHA-256', desc: 'Identity vaulting using industry-standard hashing.' },
          { icon: 'fa-shield-halved', title: 'TLS 1.3', desc: 'Every reasoning path is encrypted in transit.' }
        ].map((feat, i) => (
          <div key={i} className="bg-neutral-900/40 border border-white/5 p-8 rounded-[32px] space-y-4 text-center">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto">
              <i className={`fa-solid ${feat.icon} text-xl`}></i>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">{feat.title}</h3>
            <p className="text-neutral-600 text-xs leading-relaxed font-medium">{feat.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-neutral-900/60 border border-white/5 rounded-[40px] p-10 md:p-16">
        <h3 className="text-2xl font-black text-white mb-10 tracking-tight">Security Protocols</h3>
        <div className="space-y-8">
          {[
            { label: 'Input Sanitization', text: 'All problem statements and rough work undergo deep sanitization to prevent prompt injection and cross-site scripting.' },
            { label: 'Brute Force Protection', text: 'Identity verification is protected by progressive cooldowns and rate-limiting at the cryptographic edge.' },
            { label: 'Data Minimization', text: 'We only store the data necessary to maintain your reasoning history. No persistent session cookies or invasive tracking.' }
          ].map((item, i) => (
            <div key={i} className="flex gap-8 group">
              <div className="text-emerald-500 font-mono text-sm opacity-50 group-hover:opacity-100 transition-opacity">0{i+1}</div>
              <div className="space-y-2">
                <h4 className="text-white font-bold text-base tracking-tight">{item.label}</h4>
                <p className="text-neutral-500 text-sm leading-relaxed max-w-2xl">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
