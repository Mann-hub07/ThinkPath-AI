
import React, { useState, useRef, useEffect } from 'react';
import { Field, SavedSession } from '../types';
import { ProblemInput } from './ProblemInput';
import { ReasoningBoard } from './ReasoningBoard';

interface WorkspaceProps {
  session: SavedSession | null;
  isLoading: boolean;
  error: string | null;
  onStart: (field: Field, problem: string, imageData?: string) => void;
  onUpdateProgress: (index: number) => void;
  activeField: Field;
  onReset: () => void;
}

const NeuralLoader: React.FC = () => {
  const [stage, setStage] = useState(0);
  const statusMessages = [
    { title: "DECONSTRUCTING SYNTAX", detail: "Breaking down complex problem parameters..." },
    { title: "MAPPING LOGIC NODES", detail: "Identifying conceptual bridge requirements..." },
    { title: "INITIALIZING MENTOR PROTOCOL", detail: "Configuring Socratic reasoning steps..." },
    { title: "FINALIZING PATHWAY", detail: "Optimizing for first-principles clarity..." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((s) => (s + 1) % statusMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto w-full flex flex-col items-center animate-in fade-in zoom-in duration-700">
      <div className="relative w-32 h-32 mb-12">
        {/* Orbiting Ring */}
        <div className="absolute inset-0 border-[3px] border-brand-primary/10 border-t-brand-primary rounded-full animate-spin-slow"></div>
        {/* Inner Pulsing Core */}
        <div className="absolute inset-4 bg-brand-primary/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-brand-primary/20">
          <div className="relative">
            <i className="fa-solid fa-brain text-4xl text-brand-primary animate-neural-pulse"></i>
            <div className="absolute -inset-4 bg-brand-primary/20 blur-xl rounded-full"></div>
          </div>
        </div>
        {/* Scanning Line Effect */}
        <div className="scanning-line"></div>
      </div>
      
      <div className="text-center space-y-4 w-full">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] animate-pulse">
            System Analysis in Progress
          </p>
          <h3 className="text-xl font-black text-white tracking-tight">
            {statusMessages[stage].title}
          </h3>
          <p className="text-neutral-500 text-sm font-medium">
            {statusMessages[stage].detail}
          </p>
        </div>

        {/* Multi-segmented Progress Bar */}
        <div className="flex gap-1.5 justify-center pt-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-1 w-12 bg-neutral-900 rounded-full overflow-hidden relative">
              {i === stage && (
                <div className="absolute inset-0 bg-brand-primary animate-[shimmer_2.5s_infinite_linear]"></div>
              )}
              {i < stage && <div className="absolute inset-0 bg-brand-primary/40"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Workspace: React.FC<WorkspaceProps> = ({ 
  session, isLoading, error, onStart, onUpdateProgress, activeField, onReset 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session, isLoading, error]);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <NeuralLoader />
          </div>
        ) : session ? (
          <div className="max-w-4xl mx-auto w-full animate-in fade-in duration-300">
            <ReasoningBoard 
              field={session.field}
              problem={session.problem}
              steps={session.steps}
              finalSolution={session.finalSolution}
              initialStepIndex={session.currentStepIndex}
              onReset={onReset}
              onSaveProgress={onUpdateProgress}
              isWorkspaceMode={true}
            />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-8 animate-in fade-in duration-500">
             <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-[32px] flex items-center justify-center text-indigo-500 shadow-2xl relative group">
                <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <i className="fa-solid fa-terminal text-3xl relative z-10"></i>
             </div>
             <div className="space-y-4">
                <h2 className="text-3xl font-black text-white tracking-tight">Logic Node Ready: <span className="text-indigo-400">{activeField}</span></h2>
                <p className="text-neutral-500 text-lg leading-relaxed max-w-lg mx-auto font-medium">
                  Initialize a reasoning path by entering your problem statement below. Use rough work attachments for deep visual analysis.
                </p>
             </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="max-w-4xl mx-auto w-full flex justify-center">
             <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-3xl text-sm font-bold flex items-center gap-4 animate-in slide-in-from-bottom-4">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>{error}</span>
             </div>
          </div>
        )}
      </div>

      <div className="shrink-0 p-6 md:p-10 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent">
        <div className="max-w-4xl mx-auto w-full">
          {!session && !isLoading && (
            <div className="animate-in slide-in-from-bottom-12 duration-700">
              <ProblemInput onSubmit={onStart} isLoading={isLoading} isMinimal={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
