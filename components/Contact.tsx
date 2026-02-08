
import React, { useState } from 'react';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-24 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-semibold text-neutral-100 tracking-tight">Get in touch.</h2>
            <p className="text-neutral-400 text-base leading-relaxed">
              For methodology questions or partnership inquiries, reach out to our team.
            </p>
          </div>

          <div className="space-y-10">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">General</p>
              <p className="text-sm font-medium text-neutral-200">mentor@thinkpath.ai</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {submitted ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-16 text-center animate-in zoom-in duration-300">
              <h3 className="text-xl font-semibold text-neutral-100 mb-2">Message Dispatched.</h3>
              <p className="text-neutral-500 text-sm">We'll follow up shortly.</p>
              <button onClick={() => setSubmitted(false)} className="mt-10 text-indigo-500 font-bold hover:underline text-[10px] uppercase tracking-widest">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-10 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Identity</label>
                  <input required type="text" placeholder="Jane Doe" className="w-full bg-black border border-neutral-700 rounded-lg px-5 py-4 text-sm text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all placeholder:text-neutral-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Email</label>
                  <input required type="email" placeholder="jane@example.com" className="w-full bg-black border border-neutral-700 rounded-lg px-5 py-4 text-sm text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all placeholder:text-neutral-800" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Message</label>
                <textarea required placeholder="How can we assist?" className="w-full h-40 bg-black border border-neutral-700 rounded-xl px-6 py-5 text-sm text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all resize-none placeholder:text-neutral-800"></textarea>
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full text-xs uppercase tracking-widest transition-all">Dispatch Message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
