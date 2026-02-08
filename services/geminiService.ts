
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Speed-optimized defaults
const FLASH_MODEL = 'gemini-3-flash-preview';
const PRO_MODEL = 'gemini-3-pro-preview';
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';

const SYSTEM_INSTRUCTION = `
You are ThinkPath AI, a guided reasoning and understanding-first learning platform.
Tagline: "Understand first. Answer later."

Your purpose is to help learners build conceptual clarity. 
You act as a disciplined mentor. 

CORE RULES:
- Never give final answers immediately.
- Guide using questions and reasoning steps.
- Be concise and efficient in your explanations.
`;

export class GeminiTutorService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async transcribeAudio(base64Audio: string, mimeType: string) {
    const audioPart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Audio
      },
    };
    const textPart = {
      text: "Transcribe the following audio. Return ONLY the transcribed text."
    };
    
    try {
      const response = await this.ai.models.generateContent({
        model: FLASH_MODEL, // Use Flash for instant transcription
        contents: { parts: [audioPart, textPart] },
      });
      return response.text || "";
    } catch (error) {
      console.error("Transcription Error:", error);
      throw error;
    }
  }

  async analyzeProblem(field: string, problem: string, imageData?: string, enhancedThinking: boolean = false) {
    const textPart = {
      text: `
        Analyze this ${field} problem.
        Problem: "${problem}"

        Break this down into 3-5 progressive reasoning blocks.
        For each, provide: 1. Guided reasoning explanation 2. A specific "Understanding Check" question.
        
        Return JSON: { 'steps': [{explanation, checkQuestion}], 'finalSolution': string }
      `
    };

    const parts: any[] = [textPart];
    if (imageData) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageData.split(',')[1] || imageData
        }
      });
    }

    try {
      // Logic: Use Pro for "Enhanced" deep thinking, Flash for "Fast" standard processing
      const response = await this.ai.models.generateContent({
        model: enhancedThinking ? PRO_MODEL : FLASH_MODEL,
        contents: { parts },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          // Disable thinking for Flash to be "Fast", max for Pro to be "Deep"
          thinkingConfig: { thinkingBudget: enhancedThinking ? 32768 : 0 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    explanation: { type: Type.STRING },
                    checkQuestion: { type: Type.STRING }
                  },
                  required: ["explanation", "checkQuestion"]
                }
              },
              finalSolution: { type: Type.STRING }
            },
            required: ["steps", "finalSolution"]
          }
        },
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      throw error;
    }
  }

  async validateUnderstanding(stepContext: string, question: string, userAnswer: string) {
    const prompt = `
      Evaluate this learner's response for the following concept.
      Context: ${stepContext}
      Question: ${question}
      User Answer: "${userAnswer}"

      Return JSON: { 'isCorrect': boolean, 'feedback': string, 'hint'?: string }
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: FLASH_MODEL, // Always use Flash for instant feedback
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingBudget: 0 }, // Instant response
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isCorrect: { type: Type.BOOLEAN },
              feedback: { type: Type.STRING },
              hint: { type: Type.STRING }
            },
            required: ["isCorrect", "feedback"]
          }
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Validation Error:", error);
      throw error;
    }
  }

  async generateSpeech(text: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: TTS_MODEL,
        contents: [{ parts: [{ text: `Read clearly: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });
      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (error) {
      console.error("TTS Error:", error);
      return null;
    }
  }

  createChatSession() {
    return this.ai.chats.create({
      model: FLASH_MODEL, // Use Flash for snappy chat responses
      config: {
        systemInstruction: "You are ThinkPath Assistant. Help users navigate the app or answer general questions. Be minimal, helpful, and extremely fast.",
        thinkingConfig: { thinkingBudget: 0 } // No thinking delay
      },
    });
  }
}

export const tutorService = new GeminiTutorService();
