
import React, { useState, useRef, useEffect } from 'react';
import { tutorService } from '../services/geminiService';
import { VoiceButton } from './VoiceButton';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasBriefed, setHasBriefed] = useState(false);
  const [hasSeenNotification, setHasSeenNotification] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Automatic briefing on mount
  useEffect(() => {
    const briefTimer = setTimeout(() => {
      if (!hasBriefed) {
        // Initialize session if not already done
        if (!chatSessionRef.current) {
          chatSessionRef.current = tutorService.createChatSession();
        }
        
        // Add greeting message
        const welcomeMessage = "Greetings. I am the ThinkPath Reasoning Engine. My protocol is simple: I don't just provide answers—I help you deconstruct complexity through first-principles logic. Shall we initiate a reasoning path today?";
        
        setMessages([{ role: 'model', text: welcomeMessage }]);
        setHasBriefed(true);
      }
    }, 1500);

    return () => clearTimeout(briefTimer);
  }, [hasBriefed]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    if (!isOpen) {
      if (!chatSessionRef.current) {
        chatSessionRef.current = tutorService.createChatSession();
      }
      setHasSeenNotification(true);
    }
    setIsOpen(!isOpen);
  };

  const sendMessage = async (e: React.FormEvent | string) => {
    if (typeof e !== 'string') e.preventDefault();
    const userMessage = typeof e === 'string' ? e : input.trim();
    if (!userMessage || isLoading) return;

    if (typeof e !== 'string') setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { role: 'model', text: result.text }]);
      // If chat is closed and a new message arrives, we show notification again
      if (!isOpen) {
        setHasSeenNotification(false);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "System connection interrupted. Re-synchronizing logic vault..." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscription = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end font-sans">
      {isOpen && (
        <div className="w-[400px] h-[640px] bg-neutral-950/90 border border-white/10 rounded-[44px] shadow-[0_32px_64px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden mb-6 animate-in slide-in-from-bottom-8 duration-500 backdrop-blur-3xl">
          {/* Header */}
          <div className="px-8 py-7 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-brand-primary/40 blur-lg rounded-2xl group-hover:bg-brand-primary/60 transition-all duration-500"></div>
                <div className="relative w-11 h-11 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center text-white shadow-lg">
                   <div className="relative">
                     <i className="fa-solid fa-brain text-lg"></i>
                     <i className="fa-solid fa-sparkle absolute -top-1 -right-2 text-[10px] text-white animate-pulse"></i>
                   </div>
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-sm font-extrabold text-white tracking-tight">Logic Assistant</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-[0.2em]">Deep Thinking Mode</span>
                </div>
              </div>
            </div>
            <button onClick={toggleChat} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/10 transition-all">
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-grow p-8 overflow-y-auto space-y-8 scroll-smooth">
            {messages.length === 0 && !isLoading && (
              <div className="text-center py-16 space-y-8">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-brand-primary/10 blur-2xl rounded-full"></div>
                  <div className="relative w-20 h-20 bg-neutral-900 border border-white/10 rounded-[32px] flex items-center justify-center mx-auto text-brand-primary shadow-2xl">
                    <i className="fa-solid fa-microchip text-4xl"></i>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-white font-extrabold text-2xl tracking-tight">How shall we reason?</p>
                  <p className="text-sm text-neutral-500 max-w-[240px] mx-auto leading-relaxed font-medium">
                    Ask about specific logic blocks, methodology, or request a conceptual deep-dive.
                  </p>
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[88%] px-6 py-4 rounded-[28px] text-[14px] leading-relaxed font-medium ${
                  m.role === 'user' 
                    ? 'bg-brand-primary text-white rounded-tr-none shadow-[0_8px_24px_rgba(59,130,246,0.3)]' 
                    : 'bg-neutral-900/50 text-neutral-300 rounded-tl-none border border-white/10 shadow-inner backdrop-blur-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-900/50 px-6 py-4 rounded-[28px] rounded-tl-none border border-white/10 flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-brand-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-brand-primary/30 rounded-full animate-bounce"></div>
                  <span className="text-[9px] font-black text-brand-primary ml-2 uppercase tracking-widest">Assistant is thinking</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-8 bg-white/[0.01] border-t border-white/5 flex gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message the mentor..."
                className="w-full bg-neutral-950 border border-white/10 rounded-[24px] px-6 py-4 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-neutral-700 font-medium pr-12"
              />
              <VoiceButton 
                onTranscription={handleTranscription} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-14 h-14 bg-white text-black rounded-[24px] flex items-center justify-center disabled:opacity-20 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
            >
              <i className="fa-solid fa-arrow-up-long"></i>
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={toggleChat}
        className={`w-20 h-20 rounded-[32px] flex items-center justify-center shadow-[0_24px_48px_rgba(0,0,0,0.5)] transition-all duration-700 group relative ${
          isOpen 
          ? 'bg-white text-black rotate-90' 
          : 'bg-neutral-900 border border-white/10 text-white hover:rounded-[24px]'
        }`}
      >
        {!isOpen && (
          <>
            <div className="absolute inset-0 bg-brand-primary/20 rounded-[32px] blur-2xl group-hover:bg-brand-primary/40 transition-all duration-700"></div>
            {/* Notification Dot */}
            {messages.length > 0 && !hasSeenNotification && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary rounded-full border-4 border-neutral-950 flex items-center justify-center z-20">
                 <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              </div>
            )}
          </>
        )}
        <div className="relative z-10 flex flex-col items-center">
          {isOpen ? (
            <i className="fa-solid fa-xmark text-3xl"></i>
          ) : (
            <div className="relative">
              <i className="fa-solid fa-brain text-3xl group-hover:scale-110 transition-transform duration-500"></i>
              <i className="fa-solid fa-star absolute -top-1 -right-2 text-[10px] text-brand-primary group-hover:rotate-45 transition-transform duration-700"></i>
            </div>
          )}
        </div>
      </button>

      {/* Visual Briefing notification */}
      {!isOpen && messages.length > 0 && !hasSeenNotification && (
        <div 
          onClick={toggleChat}
          className="absolute bottom-24 right-0 max-w-[200px] bg-neutral-900 border border-white/10 p-4 rounded-3xl shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-1000 cursor-pointer hover:bg-neutral-800 transition-colors"
        >
          <div className="flex justify-between items-start mb-1">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">New Message</p>
            <button onClick={(e) => { e.stopPropagation(); setHasSeenNotification(true); }} className="text-neutral-600 hover:text-white">
              <i className="fa-solid fa-xmark text-[8px]"></i>
            </button>
          </div>
          <p className="text-[11px] text-white leading-relaxed line-clamp-2">
            {messages[messages.length - 1].text}
          </p>
        </div>
      )}
    </div>
  );
};
