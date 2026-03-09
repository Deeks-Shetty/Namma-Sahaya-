import { useState, useEffect } from 'react';
import { getGeminiClient } from '../services/gemini';

const ICON_KEY = 'namma_sahaya_app_icon';

export function useAppIcon() {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedIcon = localStorage.getItem(ICON_KEY);
    if (savedIcon) {
      setIconUrl(savedIcon);
    } else {
      generateIcon();
    }
  }, []);

  const generateIcon = async () => {
    setIsLoading(true);
    try {
      const client = getGeminiClient();
      const prompt = "A modern, minimalist app icon for 'Namma Sahaya' (Our Help), featuring a helping hand or a friendly robot assistant, with a warm color palette (olive green, orange, white). Flat design, vector style, rounded square shape.";
      
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        }
      });

      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const base64Image = `data:image/png;base64,${part.inlineData.data}`;
            localStorage.setItem(ICON_KEY, base64Image);
            setIconUrl(base64Image);
            return;
          }
        }
      }
    } catch (error) {
      console.error("Error generating icon:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { iconUrl, isLoading, regenerate: generateIcon };
}
