import { GoogleGenAI } from "@google/genai";
import { Chain, BulkItem } from '../types';

export const analyzeTransaction = async (chain: Chain, sender: string, items: BulkItem[]): Promise<string> => {

  // Access the key via Vite's environment variable
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    return "AI Analysis Unavailable: API Key not configured in .env file.";
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    I am about to execute a bulk blockchain transaction on the ${chain} network.
    Sender: ${sender}
    Recipients: ${JSON.stringify(items)}
    
    Please analyze this for potential safety issues (e.g., suspicious memos, unusually high amounts, common scams). 
    Provide a very brief, 2-sentence summary confirming if it looks safe or if caution is advised.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Analysis complete: No specific warnings.";
  } catch (error: any) {
    console.error("Gemini Error:", error);

    // Check for specific error codes related to restrictions
    if (error.message?.includes('403') || error.status === 403) {
      return "Access Denied: Please check API Key restrictions in Google Cloud Console.";
    }

    return "AI service temporarily unavailable.";
  }
};