import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

async function generateIcon() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set");
      process.exit(1);
    }

    const client = new GoogleGenAI({ apiKey });
    
    console.log("Generating app icon...");
    const prompt = "A modern, minimalist app icon for 'Namma Sahaya' (Our Help), featuring a helping hand or a friendly robot assistant, with a warm color palette (olive green, orange, white). Flat design, vector style, rounded square shape.";
    
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const buffer = Buffer.from(part.inlineData.data, 'base64');
          const publicDir = path.join(process.cwd(), 'public');
          
          if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir);
          }
          
          fs.writeFileSync(path.join(publicDir, 'icon.png'), buffer);
          console.log("Icon generated and saved to public/icon.png");
          return;
        }
      }
    }
    
    console.error("No image data found in response");
  } catch (error) {
    console.error("Error generating icon:", error);
    process.exit(1);
  }
}

generateIcon();
