import React, { useState } from 'react';

const sections = [
  {
    id: 'user-types',
    title: 'User Architecture',
    content: `ThinkPath AI employs a tiered authorization system to manage user identity and logic protection.`,
    bullets: [
      'Guest: Trial mode only. Single path limit.',
      'Registered: Profile established. Historical paths secured but inactive.',
      'Authorized: Full persistent access. JWT verified session.'
    ]
  },
  {
    id: 'session-logic',
    title: 'Stateless Sessions',
    content: `We use JWT for high-scale, zero-latency verification. Your state is preserved locally and signed by our vault.`,
    bullets: [
      'Stateless Auth: Signature based verification.',
      'Expiry: Tokens refresh every 24 hours.',
      'Vaulting: AES-256 equivalent hashing on all inputs.'
    ]
  }
];

export const Documentation: React.FC = () => {
  const [activeId, setActiveId] = useState('user-types');

  return (
    <div className="py-24 max-w-6xl mx-auto space-y-24">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-semibold text-neutral-100 tracking-tight">System Documentation.</h2>
        <p className="text-neutral-500 text-sm max-w-xl mx-auto">High-level overview of our security and reasoning infrastructure.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-24">
        <aside className="lg:w-64 shrink-0 space-y-4">
          <h3 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest px-1 mb-6">Manifesto</h3>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={`w-full text-left py-2 px-1 text-sm transition-colors border-b border-transparent ${activeId === s.id ? 'text-neutral-100 border-indigo-600 font-semibold' : 'text-neutral-500 hover:text-neutral-200'}`}
            >
              {s.title}
            </button>
          ))}
        </aside>

        <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-12 space-y-12 animate-in fade-in duration-300">
          {sections.map(s => (
            <div key={s.id} className={`${activeId === s.id ? 'block' : 'hidden'} space-y-8`}>
               <h2 className="text-xl font-semibold text-neutral-100 tracking-tight">{s.title}</h2>
               <p className="text-neutral-400 leading-relaxed text-sm font-normal">{s.content}</p>
               <ul className="space-y-4">
                 {s.bullets.map((b, i) => (
                   <li key={i} className="flex items-start gap-4 text-neutral-500 text-sm">
                     <div className="w-1 h-1 bg-indigo-500 rounded-full mt-2 shrink-0" />
                     <span>{b}</span>
                   </li>
                 ))}
               </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};