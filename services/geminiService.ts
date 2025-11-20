import { GoogleGenAI, Type } from "@google/genai";
import { JobApplication, InterviewPrepResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateInterviewPrep = async (job: JobApplication): Promise<InterviewPrepResponse> => {
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    I have applied for a job. Help me prepare for the interview.
    
    Company: ${job.company}
    Position: ${job.position}
    Requirements: ${job.requirements}
    
    Please provide:
    1. 3 Technical questions tailored to these requirements.
    2. 2 Behavioral questions.
    3. 2 Short actionable tips for this specific role.
    
    Return the response as JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            technicalQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of technical questions"
            },
            behavioralQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of behavioral questions"
            },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of preparation tips"
            }
          },
          required: ["technicalQuestions", "behavioralQuestions", "tips"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as InterviewPrepResponse;
    } else {
      throw new Error("No response from Gemini");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const analyzeSalary = async (requirements: string, position: string, location: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on the following position "${position}" in "${location}" and these requirements: "${requirements.substring(0, 500)}...", estimate a realistic salary range in USD/EUR. Keep it very brief (e.g., "$80k - $100k").`
    });
    return response.text || "Salary estimate unavailable";
  } catch (e) {
    return "Estimate unavailable";
  }
}