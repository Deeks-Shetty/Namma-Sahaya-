import { GoogleGenAI, ThinkingLevel } from "@google/genai";

// Lazy initialization of the Gemini client
let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export async function generateResponse(prompt: string, language: string): Promise<string> {
  try {
    const client = getGeminiClient();
    const systemInstruction = `You are a helpful assistant for an app called "Namma Sahaya" (Our Help). 
    You are helpful, warm, and knowledgeable about everyday life, especially in the context of Karnataka, India.
    The user is currently using the app in ${language} mode.
    Please reply primarily in the requested language (${language}), but you can use English terms if they are more commonly understood.
    If the user asks in Tulu, reply in Tulu (using Kannada script if possible, or clear transliteration).
    Keep responses concise and practical.`;

    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      }
    });

    return response.text || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error generating response:", error);
    return "Sorry, something went wrong. Please try again.";
  }
}

export type AIMode = 'fast' | 'balanced' | 'thinking';

export async function* generateResponseStream(prompt: string, language: string, mode: AIMode = 'balanced'): AsyncGenerator<string, void, unknown> {
  try {
    const client = getGeminiClient();
    const systemInstruction = `You are a helpful assistant for an app called "Namma Sahaya" (Our Help). 
    You are helpful, warm, and knowledgeable about everyday life, especially in the context of Karnataka, India.
    The user is currently using the app in ${language} mode.
    Please reply primarily in the requested language (${language}), but you can use English terms if they are more commonly understood.
    If the user asks in Tulu, reply in Tulu (using Kannada script if possible, or clear transliteration).
    Keep responses concise and practical.`;

    let modelName = "gemini-3.1-pro-preview";
    let thinkingConfig: any = undefined;

    if (mode === 'fast') {
      modelName = "gemini-flash-lite-latest"; // gemini-2.5-flash-lite alias
    } else if (mode === 'thinking') {
      modelName = "gemini-3.1-pro-preview";
      thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    } else {
      // balanced / standard
      modelName = "gemini-3.1-pro-preview";
    }

    const config: any = {
      systemInstruction: systemInstruction,
      tools: [{ googleSearch: {} }],
    };

    if (thinkingConfig) {
      config.thinkingConfig = thinkingConfig;
    }

    const response = await client.models.generateContentStream({
      model: modelName,
      contents: prompt,
      config: config
    });

    for await (const chunk of response) {
      const text = chunk.text;
      if (text) yield text;
    }
  } catch (error) {
    console.error("Error generating response stream:", error);
    yield "Sorry, something went wrong. Please try again.";
  }
}

export async function getWeather(city: string, language: string): Promise<string> {
  try {
    const client = getGeminiClient();
    const prompt = `What is the current real-time weather in ${city}? 
    Provide the temperature, condition (e.g., Sunny, Rain), and humidity.
    Reply in ${language}. Keep it short and clear.`;

    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      }
    });

    return response.text || "Unable to fetch weather.";
  } catch (error) {
    console.error("Error fetching weather:", error);
    return "Sorry, could not get weather info. Please try again.";
  }
}
