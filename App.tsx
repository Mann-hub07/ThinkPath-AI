
import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { ProblemInput } from './components/ProblemInput';
import { ReasoningBoard } from './components/ReasoningBoard';
import { Blog } from './components/Blog';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Documentation } from './components/Documentation';
import { ChatBot } from './components/ChatBot';
import { Auth } from './components/Auth';
import { Methodology } from './components/Methodology';
import { Security } from './components/Security';
import { Privacy } from './components/Privacy';
import { Legal } from './components/Legal';
import { Sidebar } from './components/Sidebar';
import { Workspace } from './components/Workspace';
import { Field, User, SavedSession } from './types';
import { tutorService } from './services/geminiService';

const FeatureCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="p-12 rounded-[44px] bg-neutral-900/40 border border-white/[0.04] hover:border-brand-primary/20 hover:bg-neutral-900/60 transition-all duration-700 group">
    <div className="w-16 h-16 bg-brand-primary/10 rounded-[20px] flex items-center justify-center text-brand-primary mb-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner">
      <i className={`fa-solid ${icon} text-3xl`}></i>
    </div>
    <h3 className="text-2xl font-extrabold text-white mb-5 tracking-tight flex items-center gap-3">
      <span className="opacity-40 group-hover:opacity-100 transition-opacity">
        <i className={`fa-solid ${icon} text-sm`}></i>
      </span>
      {title}
    </h3>
    <p className="text-neutral-500 leading-relaxed text-base font-medium">{desc}</p>
  </div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.04] group">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-8 flex justify-between items-center text-left hover:text-white transition-all duration-300"
      >
        <span className="text-xl font-bold text-neutral-200 tracking-tight group-hover:translate-x-1 transition-transform">{question}</span>
        <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] transition-all ${isOpen ? 'rotate-180 bg-white text-black border-white' : 'text-neutral-500'}`}>
          <i className="fa-solid fa-chevron-down"></i>
        </div>
      </button>
      {isOpen && (
        <div className="pb-8 animate-in slide-in-from-top-2 duration-500">
          <p className="text-lg text-neutral-500 leading-relaxed max-w-2xl">{answer}</p>
        </div>
      )}
    </div>
  );
};

type AppView = 'landing' | 'reasoning' | 'blog' | 'about' | 'contact' | 'documentation' | 'login' | 'signup' | 'methodology' | 'security' | 'privacy' | 'legal';

const SESSION_STORAGE_KEY = 'thinkpath_saved_sessions_v1';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [activeField, setActiveField] = useState<Field>('General');
  
  // Session Persistence State
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Load sessions from local storage
  useEffect(() => {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) {
      try {
        setSessions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse sessions", e);
      }
    }
  }, []);

  // Save sessions to local storage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const startAnalysis = async (field: Field, problem: string, imageData?: string, enhancedThinking: boolean = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tutorService.analyzeProblem(field, problem, imageData, enhancedThinking);
      
      const newSession: SavedSession = {
        id: crypto.randomUUID(),
        field,
        problem,
        imageData,
        steps: data.steps,
        finalSolution: data.finalSolution,
        timestamp: Date.now(),
        currentStepIndex: 0,
        enhancedThinking
      };

      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
      setView('reasoning');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError("Logical deconstruction failed. The system requires a clearer prompt to begin reasoning.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSessionProgress = (stepIndex: number) => {
    if (!activeSessionId) return;
    setSessions(prev => prev.map(s => 
      s.id === activeSessionId ? { ...s, currentStepIndex: stepIndex } : s
    ));
  };

  const handleReset = () => {
    setView('landing');
    setActiveSessionId(null);
    setError(null);
    setIsMobileMenuOpen(false);
  };

  const navigateTo = (newView: AppView) => {
    setView(newView);
    setIsMobileMenuOpen(false);
    if (newView !== 'reasoning') {
        setActiveSessionId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthComplete = (u: User) => {
    setUser(u);
    setView('landing');
  };

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  return (
    <div className="min-h-screen selection:bg-brand-primary/30 flex flex-col bg-neutral-950 text-slate-100">
      {/* Navigation (Only show if not in reasoning workspace) */}
      {view !== 'reasoning' && (
        <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${scrolled ? 'bg-neutral-950/80 backdrop-blur-2xl border-b border-white/[0.04] py-5' : 'bg-transparent py-8'}`}>
          <div className="max-w-[1440px] mx-auto flex justify-between items-center px-6 md:px-12">
            <div className="flex items-center space-x-4 cursor-pointer group" onClick={handleReset}>
              <div className="relative">
                <div className="absolute inset-0 bg-brand-primary blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-brand-primary w-11 h-11 rounded-[14px] flex items-center justify-center text-white shadow-xl shadow-brand-primary/20 transition-all duration-500 group-hover:rotate-6">
                  <i className="fa-solid fa-route text-xl"></i>
                </div>
              </div>
              <span className="text-xl md:text-2xl font-black tracking-tighter text-white">ThinkPath</span>
            </div>
            
            {/* Desktop Links */}
            <div className="hidden lg:flex items-center space-x-12">
              {[
                { id: 'landing', label: 'Home' },
                { id: 'about', label: 'About' },
                { id: 'blog', label: 'Journal' },
                { id: 'contact', label: 'Contact' }
              ].map((v) => (
                <button 
                  key={v.id}
                  onClick={() => navigateTo(v.id as any)} 
                  className={`text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-300 ${view === v.id ? 'text-white' : 'text-neutral-600 hover:text-white'}`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4 md:space-x-6">
              {!user ? (
                <>
                  <button 
                    onClick={() => navigateTo('login')}
                    className={`hidden md:block text-[10px] font-bold uppercase tracking-[0.2em] transition-all px-2 ${
                      view === 'login' ? 'text-white' : 'text-neutral-600 hover:text-white'
                    }`}
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => navigateTo('signup')}
                    className="hidden sm:block px-6 md:px-8 py-3 md:py-4 bg-white text-black rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-neutral-200 transition-all active:scale-95"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary font-bold text-xs">
                    {user.name[0]}
                  </div>
                  <button 
                    onClick={() => setUser(null)}
                    className="hidden md:block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600 hover:text-white transition-all"
                  >
                    Logout
                  </button>
                </div>
              )}
              
              {/* Mobile Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-11 h-11 rounded-[14px] bg-neutral-900 border border-white/5 flex items-center justify-center text-white text-lg z-[70]"
              >
                <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'}`}></i>
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[55] bg-neutral-950/95 backdrop-blur-3xl lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col h-full pt-40 px-12 space-y-8">
          {[
            { id: 'landing', label: 'Home' },
            { id: 'about', label: 'About' },
            { id: 'blog', label: 'Journal' },
            { id: 'contact', label: 'Contact' },
            { id: 'login', label: 'Login' }
          ].map((v, i) => (
            <button 
              key={v.id}
              onClick={() => navigateTo(v.id as any)}
              className={`text-4xl font-black tracking-tighter text-left transition-all duration-500 delay-[${i * 100}ms] ${
                view === v.id ? 'text-brand-primary translate-x-4' : 'text-neutral-700 hover:text-white'
              } ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            >
              {v.label}
            </button>
          ))}
          
          <div className="pt-12 border-t border-white/5 mt-auto pb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600 mb-6">System Protocol</p>
            <button 
              onClick={() => navigateTo('signup')}
              className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-[0.2em] text-sm"
            >
              Initialize Identity
            </button>
          </div>
        </div>
      </div>

      <main className={`flex-grow ${view === 'reasoning' ? 'pt-0 flex' : 'pt-24'}`}>
        {error && view !== 'reasoning' && (
          <div className="max-w-3xl mx-auto mt-12 bg-red-500/5 border border-red-500/20 text-red-400 p-6 rounded-3xl flex items-center space-x-4 mx-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <i className="fa-solid fa-triangle-exclamation text-xl"></i>
            <span className="font-bold tracking-tight">{error}</span>
          </div>
        )}

        {view === 'landing' && (
          <div className="animate-in fade-in duration-1000">
            <Hero onStart={() => document.getElementById('input-section')?.scrollIntoView({ behavior: 'smooth' })} />
            
            <section id="input-section" className="py-20 md:py-40 px-6">
              <ProblemInput onSubmit={startAnalysis} isLoading={isLoading} />
            </section>

            {/* Feature Grid */}
            <section className="py-20 md:py-40 px-6 md:px-12 max-w-[1440px] mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32 space-y-6">
                <h4 className="text-brand-primary font-black text-[10px] md:text-[12px] uppercase tracking-[0.4em]">The Method</h4>
                <h2 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-[1.1]">The end of <br /><span className="text-neutral-800">passive learning.</span></h2>
                <p className="text-lg md:text-xl text-neutral-500 font-medium max-w-xl mx-auto">Our reasoning engine forces cognitive engagement, creating lasting neural pathways for complex logic.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
                <FeatureCard 
                  icon="fa-layer-group" 
                  title="Logic Blocks" 
                  desc="We deconstruct monolith problems into distinct logic hurdles, ensuring baseline mastery at every step." 
                />
                <FeatureCard 
                  icon="fa-lock" 
                  title="Vault Protection" 
                  desc="Answers are locked behind reasoning checkpoints. No shortcuts, no surface-level knowledge." 
                />
                <FeatureCard 
                  icon="fa-chalkboard-user" 
                  title="Directed Socratic" 
                  desc="The mentor recognizes specific logic breaks in your rough work and provides conceptual redirects." 
                />
              </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 md:py-48 px-6 md:px-12 max-w-4xl mx-auto">
              <div className="text-center mb-16 md:mb-24 space-y-6">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Common Questions.</h2>
                <p className="text-lg text-neutral-500 font-medium">Deep dive into the ThinkPath framework.</p>
              </div>
              <div className="space-y-4">
                <FAQItem question="Why can't I just see the answer?" answer="Because answers without reasoning are forgotten instantly. ThinkPath is built to ensure you actually OWN the knowledge, not just rent the solution." />
                <FAQItem question="How accurate is the Visual Rough Work analysis?" answer="Leveraging Gemini 3 Pro Vision, we can identify errors in handwriting, logic flows, and diagrammatic reasoning with over 94% accuracy." />
                <FAQItem question="What if I get stuck on a reasoning block?" answer="The mentor will provide progressive hints that stimulate your memory or conceptual understanding without giving away the breakthrough." />
                <FAQItem question="Is this only for students?" answer="No. Engineers, philosophers, and data scientists use ThinkPath to sharpen their first-principles thinking in complex domains." />
              </div>
            </section>
          </div>
        )}

        {view === 'blog' && <Blog />}
        {view === 'about' && <About />}
        {view === 'contact' && <Contact />}
        {view === 'documentation' && <Documentation />}
        {view === 'methodology' && <Methodology />}
        {view === 'security' && <Security />}
        {view === 'privacy' && <Privacy />}
        {view === 'legal' && <Legal />}
        
        {(view === 'login' || view === 'signup') && (
          <div className="py-12 md:py-24">
            <Auth 
              initialMode={view} 
              onAuthComplete={handleAuthComplete} 
              onClose={() => setView('landing')} 
              isFullScreen={true}
            />
          </div>
        )}

        {view === 'reasoning' && (
          <div className="flex w-full h-screen overflow-hidden animate-in fade-in duration-700">
            <Sidebar 
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                activeField={activeField}
                onFieldChange={setActiveField}
                sessions={sessions}
                currentSessionId={activeSessionId || undefined}
                onSelectSession={(s) => { setActiveSessionId(s.id); setView('reasoning'); }}
                onNewSession={() => { setActiveSessionId(null); setView('reasoning'); }}
                onGoHome={handleReset}
                user={user}
                onLogout={() => setUser(null)}
                onLogin={() => navigateTo('login')}
            />
            <Workspace 
                session={activeSession}
                isLoading={isLoading}
                error={error}
                onStart={startAnalysis}
                onUpdateProgress={updateSessionProgress}
                activeField={activeField}
                onReset={handleReset}
            />
          </div>
        )}
      </main>

      {view !== 'reasoning' && (
        <footer className="border-t border-white/[0.04] py-8 md:py-10 px-6 md:px-12 bg-neutral-950 mt-8">
            <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between gap-8 md:gap-12">
            <div className="space-y-4 md:space-y-6 max-w-md">
                <div className="flex items-center space-x-3">
                <div className="bg-brand-primary w-9 h-9 rounded-[12px] flex items-center justify-center text-white">
                    <i className="fa-solid fa-route text-lg"></i>
                </div>
                <span className="text-xl font-black tracking-tighter text-white">ThinkPath</span>
                </div>
                <p className="text-neutral-500 text-sm leading-relaxed font-medium">
                Reinventing the cognitive struggle. We build the mentors that the future of intelligence deserves.
                </p>
                <div className="flex space-x-5">
                <a href="https://github.com/Mann-hub07" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-white transition-all text-lg"><i className="fa-brands fa-github"></i></a>
                <a href="#" className="text-neutral-600 hover:text-white transition-all text-lg"><i className="fa-brands fa-x-twitter"></i></a>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-16">
                <div className="space-y-3 md:space-y-4">
                <h5 className="text-white font-black text-[9px] uppercase tracking-[0.3em]">System</h5>
                <ul className="space-y-2 text-xs font-bold text-neutral-600">
                    <li><button onClick={() => navigateTo('documentation')} className="hover:text-white transition-all tracking-wider text-left uppercase text-[8px]">Docs</button></li>
                    <li><button onClick={() => navigateTo('methodology')} className="hover:text-white transition-all tracking-wider text-left uppercase text-[8px]">Method</button></li>
                </ul>
                </div>
                <div className="space-y-3 md:space-y-4">
                <h5 className="text-white font-black text-[9px] uppercase tracking-[0.3em]">Safety</h5>
                <ul className="space-y-2 text-xs font-bold text-neutral-600">
                    <li><button onClick={() => navigateTo('security')} className="hover:text-white transition-all tracking-wider text-left uppercase text-[8px]">Security</button></li>
                    <li><button onClick={() => navigateTo('privacy')} className="hover:text-white transition-all tracking-wider text-left uppercase text-[8px]">Privacy</button></li>
                </ul>
                </div>
                <div className="space-y-3 md:space-y-4">
                <h5 className="text-white font-black text-[9px] uppercase tracking-[0.3em]">Company</h5>
                <ul className="space-y-2 text-xs font-bold text-neutral-600">
                    <li><button onClick={() => navigateTo('about')} className="hover:text-white transition-all tracking-wider text-left uppercase text-[8px]">About</button></li>
                    <li><button onClick={() => navigateTo('blog')} className="hover:text-white transition-all tracking-wider text-left uppercase text-[8px]">Journal</button></li>
                    <li><button onClick={() => navigateTo('legal')} className="hover:text-white transition-all tracking-wider text-left uppercase text-[8px]">Legal</button></li>
                </ul>
                </div>
            </div>
            </div>
            <div className="max-w-[1440px] mx-auto pt-8 md:pt-10 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8 border-t border-white/[0.04] mt-8 md:mt-10">
            <div className="text-neutral-700 text-[8px] font-black uppercase tracking-[0.4em] text-center md:text-left">
                © 2026 THINKPATH INC • ALL RIGHTS RESERVED
            </div>
            <div className="text-neutral-500 text-[9px] font-bold tracking-widest flex items-center gap-2">
                Made with love ❤️ in India
            </div>
            <div className="flex gap-6 md:gap-10 text-[8px] font-black text-neutral-700 uppercase tracking-[0.3em]">
                <button onClick={() => navigateTo('legal')} className="hover:text-white transition-all uppercase">Terms</button>
                <button onClick={() => navigateTo('privacy')} className="hover:text-white transition-all uppercase">Privacy</button>
            </div>
            </div>
        </footer>
      )}
      <ChatBot />
    </div>
  );
};

export default App;
