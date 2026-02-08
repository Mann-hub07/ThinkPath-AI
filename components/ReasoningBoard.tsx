
import React, { useState } from 'react';
import { tutorService } from '../services/geminiService';
import { Field } from '../types';
import { VoiceButton } from './VoiceButton';

interface Step {
  explanation: string;
  checkQuestion: string;
}

interface ReasoningBoardProps {
  field: Field;
  problem: string;
  imageData?: string;
  steps: Step[];
  finalSolution: string;
  initialStepIndex?: number;
  onReset: () => void;
  onSaveProgress: (index: number) => void;
  isWorkspaceMode?: boolean;
}

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const ReasoningBoard: React.FC<ReasoningBoardProps> = ({ 
  field, problem, steps, finalSolution, initialStepIndex = 0, onReset, onSaveProgress, isWorkspaceMode = false
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string; hint?: string; reExplanation?: string; } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isFinalReveal, setIsFinalReveal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showFullProblem, setShowFullProblem] = useState(false);

  const step = steps[currentStepIndex];

  const handleValidate = async () => {
    if (!userAnswer.trim() || isValidating) return;
    setIsValidating(true);
    try {
      const result = await tutorService.validateUnderstanding(step.explanation, step.checkQuestion, userAnswer);
      setFeedback(result);
    } finally {
      setIsValidating(false);
    }
  };

  const nextStep = () => {
    setFeedback(null);
    setUserAnswer('');
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      onSaveProgress(currentStepIndex + 1);
    } else {
      setIsFinalReveal(true);
      onSaveProgress(steps.length);
    }
  };

  const handleTTS = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const base64 = await tutorService.generateSpeech(text);
      if (base64) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const bytes = decodeBase64(base64);
        const buffer = await decodeAudioData(bytes, audioCtx, 24000, 1);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      }
    } catch (error) {
      console.error(error);
      setIsSpeaking(false);
    }
  };

  const handleTranscription = (text: string) => {
    setUserAnswer(prev => prev ? `${prev} ${text}` : text);
  };

  return (
    <div className={`mx-auto space-y-8 pb-24 ${isWorkspaceMode ? 'w-full' : 'max-w-6xl'}`}>
      {/* Session Summary Header */}
      {!isWorkspaceMode && (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-blue-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Active Reasoning Path • {field}</h2>
              <div className="flex items-center space-x-3">
                <p className={`text-slate-200 font-medium italic text-sm ${showFullProblem ? '' : 'truncate max-w-xl'}`}>
                  "{problem}"
                </p>
                <button onClick={() => setShowFullProblem(!showFullProblem)} className="text-blue-400 text-[10px] font-bold uppercase hover:underline">
                  {showFullProblem ? 'Collapse' : 'Expand'}
                </button>
              </div>
            </div>
            <button onClick={onReset} className="px-4 py-2 text-xs font-bold uppercase tracking-widest border border-slate-700 rounded-xl text-slate-500 hover:text-white hover:bg-slate-700 transition-all">
              Reset Path
            </button>
          </div>
        </div>
      )}

      {/* Progress Track */}
      <div className="flex items-center justify-between px-4">
        {steps.map((_, idx) => (
          <div key={idx} className="flex flex-1 items-center last:flex-none">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs border-2 transition-all ${
              idx < currentStepIndex ? 'bg-green-600 border-green-500 text-white' :
              idx === currentStepIndex ? 'bg-blue-600 border-blue-500 text-white animate-pulse shadow-lg shadow-blue-500/20' :
              'bg-slate-900 border-slate-700 text-slate-600'
            }`}>
              {idx < currentStepIndex ? <i className="fa-solid fa-check"></i> : idx + 1}
            </div>
            {idx < steps.length - 1 && (
              <div className={`h-1 flex-1 mx-3 rounded-full transition-all ${
                idx < currentStepIndex ? 'bg-green-600' : 'bg-slate-800'
              }`} />
            )}
          </div>
        ))}
        <div className="ml-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all ${
            isFinalReveal ? 'bg-yellow-600 border-yellow-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-600'
          }`}>
            <i className="fa-solid fa-flag-checkered"></i>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${isWorkspaceMode ? 'gap-6' : 'lg:grid-cols-2 gap-8'}`}>
        {/* Left Side: Reasoning Context */}
        <div className="space-y-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 shadow-xl relative overflow-hidden group min-h-[400px]">
            <div className="flex justify-between items-start mb-6">
              <div className="inline-block bg-blue-600/20 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Reasoning Block {currentStepIndex + 1}
              </div>
              <button 
                onClick={() => handleTTS(step.explanation)}
                className={`text-slate-500 hover:text-white transition-all ${isSpeaking ? 'animate-pulse text-blue-400' : ''}`}
              >
                <i className="fa-solid fa-volume-high text-sm"></i>
              </button>
            </div>
            <h3 className="text-2xl font-bold mb-6 text-white leading-tight">Guided Logic</h3>
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-base space-y-4">
              {step.explanation.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>
          </div>

          {isFinalReveal && (
            <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-indigo-500/30 rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="inline-block bg-yellow-600/20 text-yellow-400 text-[10px] font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
                Breakthrough Unlocked
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">The Path to Clarity</h3>
              <div className="text-slate-200 text-base leading-relaxed font-medium prose prose-invert">
                {finalSolution}
              </div>
              {!isWorkspaceMode && (
                <button onClick={onReset} className="mt-8 px-6 py-3 bg-white text-slate-950 font-bold uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all text-xs">
                  Initiate New Mentor Session
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Understanding Verification */}
        {!isFinalReveal && (
          <div className="space-y-6">
            <div className={`bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl ${isWorkspaceMode ? '' : 'sticky top-24'}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white">
                    <i className="fa-solid fa-brain text-xs"></i>
                  </div>
                  <h4 className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Understanding Check</h4>
                </div>
                <div className="flex items-center gap-3">
                  {isValidating && (
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-ping"></div>
                      <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest">Verifying Logic...</span>
                    </div>
                  )}
                  <VoiceButton onTranscription={handleTranscription} className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 text-neutral-500 hover:text-white transition-all" />
                </div>
              </div>
              
              <p className="text-lg font-bold text-slate-200 mb-8 leading-snug">
                {step.checkQuestion}
              </p>

              {!feedback?.isCorrect ? (
                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Describe your reasoning path here..."
                      disabled={isValidating}
                      className="w-full h-40 bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none placeholder:text-slate-600 text-sm disabled:opacity-50"
                    />
                    {isValidating && (
                      <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">AI Assessing Logic</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleValidate}
                    disabled={isValidating || !userAnswer.trim()}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-blue-500/20 text-xs relative overflow-hidden group"
                  >
                    {isValidating ? (
                      <div className="flex items-center justify-center gap-3">
                        <i className="fa-solid fa-circle-notch animate-spin"></i>
                        <span>Processing Inference</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <span>Verify Logic</span>
                        <i className="fa-solid fa-bolt-lightning text-[10px] group-hover:scale-125 transition-transform"></i>
                      </div>
                    )}
                  </button>
                </div>
              ) : (
                <div className="animate-in zoom-in duration-300">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-green-400 mb-6 flex items-start space-x-4">
                    <i className="fa-solid fa-circle-check mt-1"></i>
                    <div>
                      <p className="font-bold mb-1 uppercase tracking-widest text-[10px]">Logical Clarity Confirmed</p>
                      <p className="text-sm leading-relaxed">{feedback.text}</p>
                    </div>
                  </div>
                  <button
                    onClick={nextStep}
                    className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-green-600/20 text-xs flex items-center justify-center space-x-3"
                  >
                    <span>Advance to Next Concept</span>
                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </button>
                </div>
              )}

              {feedback && !feedback.isCorrect && (
                <div className="mt-4 p-5 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400 text-xs space-y-3 animate-in shake duration-500">
                  <div className="flex items-start space-x-3">
                    <i className="fa-solid fa-circle-exclamation mt-1"></i>
                    <p className="font-bold">Logic Break Detected</p>
                  </div>
                  <p className="text-neutral-500 font-medium leading-relaxed italic">{feedback.text}</p>
                  {feedback.hint && (
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                      <p className="text-white/60 font-bold uppercase tracking-[0.1em] text-[8px] mb-1">Mentor Hint</p>
                      <p className="text-neutral-300 italic">{feedback.hint}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-4 bg-slate-800/20 border border-slate-700/50 rounded-2xl flex items-center space-x-4">
               <div className="bg-slate-700 h-10 w-10 rounded-full flex items-center justify-center text-slate-500">
                 <i className="fa-solid fa-lightbulb text-sm"></i>
               </div>
               <p className="text-xs text-slate-500 italic">
                 Focus on explaining the *why*. ThinkPath AI values your struggle toward reasoning more than correct numeric output.
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
