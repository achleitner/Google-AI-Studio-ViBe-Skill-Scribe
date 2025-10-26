
import { GoogleGenAI, Type } from "@google/genai";
import type { Solution } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    explanation: {
      type: Type.STRING,
      description: "A simple, clear explanation of why the user's problem is happening, identifying the core concept they are missing.",
    },
    solution: {
      type: Type.OBJECT,
      properties: {
        language: {
          type: Type.STRING,
          description: "The programming or formula language of the solution (e.g., 'python', 'excel_formula', 'css', 'sql').",
        },
        code: {
          type: Type.STRING,
          description: "The exact code snippet, formula, or query to solve the user's problem, with explanatory comments.",
        },
      },
      required: ['language', 'code'],
    },
    microLesson: {
      type: Type.ARRAY,
      description: "A personalized 3-step micro-lesson to teach the user the underlying concept.",
      items: {
        type: Type.OBJECT,
        properties: {
          step: { type: Type.INTEGER, description: "The step number (1, 2, or 3)." },
          title: { type: Type.STRING, description: "The title of the lesson step." },
          content: { type: Type.STRING, description: "The educational content for this step." },
        },
        required: ['step', 'title', 'content'],
      },
    },
  },
  required: ['explanation', 'solution', 'microLesson'],
};

export async function solveProblem(
  prompt: string,
  imageBase64: string,
  imageMimeType: string
): Promise<Solution> {
  const model = 'gemini-2.5-flash';

  const systemInstruction = `You are SkillScribe, an expert AI mentor. Your task is to analyze the user's uploaded image and text prompt to solve their technical problem.
  1.  Explain the core problem or concept they are struggling with in simple terms.
  2.  Provide the exact code, formula, or snippet to solve their specific problem. The code should be well-commented.
  3.  Generate a personalized, 3-step micro-lesson that teaches the fundamental skill involved.
  You MUST respond ONLY with a valid JSON object that adheres to the provided schema. Do not include any markdown formatting or any text outside of the JSON structure.`;

  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType: imageMimeType,
    },
  };

  const textPart = {
    text: `User's Problem: "${prompt}"`,
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedJson = JSON.parse(jsonString);

    // Basic validation
    if (!parsedJson.explanation || !parsedJson.solution || !parsedJson.microLesson) {
        throw new Error("Invalid response structure from AI.");
    }

    return parsedJson as Solution;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("The AI model failed to generate a valid response. Please try again.");
  }
}
