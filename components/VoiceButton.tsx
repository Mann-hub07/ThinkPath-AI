
import React, { useState, useRef } from 'react';
import { tutorService } from '../services/geminiService';

interface VoiceButtonProps {
  onTranscription: (text: string) => void;
  className?: string;
  variant?: 'minimal' | 'full';
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ onTranscription, className, variant = 'minimal' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setIsTranscribing(true);
        try {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64 = (reader.result as string).split(',')[1];
            const text = await tutorService.transcribeAudio(base64, 'audio/webm');
            if (text) onTranscription(text);
          };
        } catch (error) {
          console.error("Transcription error:", error);
        } finally {
          setIsTranscribing(false);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access denied:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  if (variant === 'full') {
    return (
      <button
        type="button"
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        className={`flex items-center space-x-3 px-6 py-4 rounded-[24px] border transition-all group ${
          isRecording 
            ? 'bg-red-500/10 border-red-500/30 text-red-500' 
            : isTranscribing 
            ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary animate-pulse'
            : 'bg-white/[0.03] border-white/5 text-neutral-400 hover:text-white'
        } ${className}`}
      >
        {isTranscribing ? (
          <i className="fa-solid fa-circle-notch animate-spin text-lg"></i>
        ) : (
          <i className={`fa-solid ${isRecording ? 'fa-microphone-lines' : 'fa-microphone'} text-lg group-hover:scale-110 transition-transform`}></i>
        )}
        <span className="text-xs font-bold uppercase tracking-widest">
          {isRecording ? 'Release to Send' : isTranscribing ? 'Reasoning...' : 'Voice Note'}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onMouseDown={startRecording}
      onMouseUp={stopRecording}
      onTouchStart={startRecording}
      onTouchEnd={stopRecording}
      className={`relative flex items-center justify-center transition-all ${className} ${
        isRecording ? 'scale-110 text-red-500' : isTranscribing ? 'animate-pulse text-brand-primary' : ''
      }`}
      title="Hold to record"
    >
      {isTranscribing ? (
        <i className="fa-solid fa-circle-notch animate-spin"></i>
      ) : (
        <i className={`fa-solid ${isRecording ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
      )}
      {isRecording && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
      )}
    </button>
  );
};
