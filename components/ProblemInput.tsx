
import React, { useState, useRef } from 'react';
import { Field } from '../types';
import { VoiceButton } from './VoiceButton';

interface ProblemInputProps {
  onSubmit: (field: Field, problem: string, imageData?: string, enhancedThinking?: boolean) => void;
  isLoading: boolean;
  isMinimal?: boolean;
}

const fields: Field[] = ['Mathematics', 'Physics', 'Computer Science', 'Chemistry', 'Philosophy', 'General'];

export const ProblemInput: React.FC<ProblemInputProps> = ({ onSubmit, isLoading, isMinimal = false }) => {
  const [selectedField, setSelectedField] = useState<Field>('Mathematics');
  const [problem, setProblem] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [enhancedThinking, setEnhancedThinking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (problem.trim()) {
      onSubmit(selectedField, problem, imagePreview || undefined, enhancedThinking);
    }
  };

  const handleTranscription = (text: string) => {
    setProblem(prev => prev ? `${prev} ${text}` : text);
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all ${isMinimal ? '' : 'p-2'}`}>
      <div className="bg-neutral-900 border border-white/[0.08] backdrop-blur-3xl rounded-[48px] p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="flex flex-col items-center space-y-8">
            <div className="flex flex-wrap justify-center gap-2">
              {fields.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSelectedField(f)}
                  className={`py-2.5 px-6 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    selectedField === f 
                      ? 'bg-white border-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                      : 'bg-white/[0.03] border-white/5 text-neutral-500 hover:text-white hover:border-white/20'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="w-full relative group">
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="What logic block shall we deconstruct today?"
                className="w-full h-40 bg-transparent text-center text-2xl md:text-3xl font-medium text-white placeholder:text-neutral-800 focus:outline-none resize-none px-4 scroll-smooth"
                required
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-brand-primary/30 rounded-full group-focus-within:w-48 group-focus-within:bg-brand-primary transition-all duration-700"></div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative group">
                      <img src={imagePreview} className="w-20 h-20 object-cover rounded-[24px] border border-white/20" />
                      <button 
                        type="button" 
                        onClick={handleClearImage}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <i className="fa-solid fa-times text-[10px]"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-3 px-6 py-4 rounded-[24px] bg-white/[0.03] border border-white/5 text-neutral-400 hover:text-white transition-all group"
                      >
                        <i className="fa-solid fa-image text-lg group-hover:scale-110 transition-transform"></i>
                        <span className="text-xs font-bold uppercase tracking-widest">Rough Work</span>
                      </button>
                      <VoiceButton onTranscription={handleTranscription} variant="full" />
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
               </div>

               {/* Enhanced Thinking Toggle */}
               <button
                  type="button"
                  onClick={() => setEnhancedThinking(!enhancedThinking)}
                  className={`flex items-center gap-3 px-5 py-4 rounded-[24px] border transition-all ${
                    enhancedThinking 
                      ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                      : 'bg-white/[0.03] border-white/5 text-neutral-600 hover:text-neutral-400'
                  }`}
               >
                 <div className="relative">
                    <i className={`fa-solid fa-brain ${enhancedThinking ? 'animate-pulse' : ''}`}></i>
                    {enhancedThinking && <i className="fa-solid fa-sparkle absolute -top-2 -right-2 text-[8px]"></i>}
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest">Deep Reason</span>
                 <div className={`w-8 h-4 rounded-full relative transition-colors ${enhancedThinking ? 'bg-brand-primary' : 'bg-neutral-800'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-300 ease-in-out ${enhancedThinking ? 'translate-x-4' : 'translate-x-0'}`}></div>
                 </div>
               </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || !problem.trim()}
              className="px-10 py-5 bg-brand-primary hover:bg-blue-500 disabled:opacity-20 text-white font-bold rounded-[28px] transition-all shadow-xl shadow-brand-primary/30 flex items-center space-x-4 text-sm uppercase tracking-widest min-w-[240px] justify-center"
            >
              {isLoading ? (
                <i className="fa-solid fa-circle-notch animate-spin"></i>
              ) : (
                <>
                  <span>Initiate Path</span>
                  <i className="fa-solid fa-bolt-lightning text-xs"></i>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
