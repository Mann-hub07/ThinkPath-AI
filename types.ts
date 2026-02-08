
export type Field = 'Mathematics' | 'Physics' | 'Computer Science' | 'Chemistry' | 'Philosophy' | 'General';

export interface ReasoningStep {
  explanation: string;
  checkQuestion: string;
}

export interface SessionState {
  field: Field;
  problem: string;
  imageData?: string; // base64 string
  steps: ReasoningStep[];
  finalSolution: string;
  enhancedThinking?: boolean;
}

export interface GeminiAnalysisResponse {
  steps: ReasoningStep[];
  finalSolution: string;
}

export interface SavedSession extends SessionState {
  id: string;
  timestamp: number;
  currentStepIndex: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  token?: string;
}

export interface AuthResponse {
  user?: User;
  error?: string;
  retryAfter?: number;
}