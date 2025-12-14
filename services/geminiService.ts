import { GoogleGenerativeAI } from "@google/generative-ai";
import { Chain, BulkItem } from '../types';

export const analyzeTransaction = async (chain: Chain, sender: string, items: BulkItem[], promptPrefix: string = "Please analyze this for potential safety issues"): Promise<string> => {

  // Access the key via Vite's environment variable
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    return "AI Analysis Unavailable: API Key not configured in .env file.";
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const prompt = `
    ${promptPrefix}
    Network: ${chain}
    Sender: ${sender}
    Recipients: ${JSON.stringify(items)}
    
    Provide a very brief, 2-sentence summary.
  `;

  // Try multiple models in order of preference/speed
  const models = ["gemini-2.5-flash", "gemini-2.5-flash-latest", "gemini-pro"];
  let lastError = null;

  for (const modelName of models) {
    try {
      console.log(`Attempting AI analysis with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text || "Analysis complete: No specific warnings.";
    } catch (error: any) {
      console.warn(`Model ${modelName} failed:`, error.message);
      lastError = error;

      // If permission denied, stop trying (Key issue)
      if (error.message?.includes('403') || error.status === 403) {
        return "Access Denied: Please check API Key restrictions in Google Cloud Console.";
      }
    }
  }

  // If all failed
  let debugMsg = "";
  try {
    const listResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const listData = await listResp.json();
    if (listData.models) {
      const modelNames = listData.models.map((m: any) => m.name).join(', ');
      console.log("DEBUG Available Models:", modelNames);
      debugMsg = ` (Available: ${modelNames})`;
    } else if (listData.error) {
      debugMsg = ` (API Error: ${listData.error.message})`;
    }
  } catch (e) {
    debugMsg = " (Could not list models)";
  }

  return `AI Service Error: Could not connect to any model. Last error: ${lastError?.message || 'Unknown'}.${debugMsg}`;

};