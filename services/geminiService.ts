
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ClientData } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const extractDocumentDetails = async (files: File[]): Promise<ClientData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const fileParts = await Promise.all(
    files.map(async (file) => {
      const base64 = await fileToBase64(file);
      return {
        inlineData: {
          data: base64.split(",")[1],
          mimeType: file.type,
        },
      };
    })
  );

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: {
        parts: [
          ...fileParts,
          { text: "Extract document details as JSON. Priority 1: Full Name must be GIVEN SURNAME. Priority 2: Region MUST match exactly one from the provided REGION_LIST." },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    let text = response.text || "";
    // Clean potential markdown blocks
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    if (!text) {
      throw new Error("Empty response from AI engine.");
    }

    const data = JSON.parse(text);
    return data;
  } catch (err: any) {
    console.error("Gemini Extraction Error:", err);
    throw new Error(err.message || "Could not extract details. Ensure scans are high-quality and well-lit.");
  }
};
