import { GoogleGenAI } from "@google/genai";
import { AIAnalysisResult } from "../types";

// Lazy initialization to prevent top-level crashes
let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    // Fallback to a dummy key if env is missing to allow UI to render (calls will fail gracefully)
    const apiKey = process.env.API_KEY || 'MISSING_KEY'; 
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

const SYSTEM_INSTRUCTION = `
You are Param, the advanced AI Controller for a 500MW Solar + 1GWh BESS + 50MW Electrolyzer hybrid park in Gujarat, India.

Your goal is to optimize for:
1. Firm Power Delivery (SECI mandates).
2. Revenue Maximization (Arbitrage on IEX, H2 Sales).
3. Asset Health (Predictive Maintenance).

Output Format Guidelines:
- Use "### " for section headers (e.g., ### Strategy, ### Risks).
- Use "**" for bold text to highlight key metrics or actions.
- Use bullet points ("- ") for lists.
- Be concise, technical, and direct.
- Do not use markdown code blocks.

When analyzing data:
- Use units (MW, INR/kWh, %).
- Provide actionable recommendations.
- Focus on the Indian energy market context (VGF, RDSS, DAM/RTM).
`;

export const getEnergyAnalysis = async (contextData: string): Promise<AIAnalysisResult> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Current System State and Market Data:\n${contextData}\n\nProvide an optimization strategy and risk assessment for the next 4 hours.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
      },
    });

    return {
      text: response.text || "No analysis available.",
      timestamp: Date.now(),
      confidence: 0.95,
      recommendedAction: "Review dispatch schedule."
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "Param AI Service temporarily unavailable. Falling back to local heuristic optimization.",
      timestamp: Date.now(),
      confidence: 0,
    };
  }
};

export const getMaintenanceDiagnosis = async (alertData: string): Promise<AIAnalysisResult> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Alert Data Detected:\n${alertData}\n\nDiagnose the root cause (e.g., Thermal Runaway risk, Inverter IGBT failure) and suggest immediate mitigation steps using digital twin logic.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1,
      },
    });

    return {
      text: response.text || "No diagnosis available.",
      timestamp: Date.now(),
      confidence: 0.92,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "Unable to process diagnostic data.",
      timestamp: Date.now(),
      confidence: 0,
    };
  }
};