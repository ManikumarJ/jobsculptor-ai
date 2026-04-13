import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { GoogleGenAI } = require('@google/genai');

let ai;

export const calculateJobMatch = async (resumeText, jobDescription) => {
  if (!ai) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY, // Use your .env key here
    });
  }
  const prompt = `
Compare this RESUME with JOB DESCRIPTION.
Return JSON: { matchedSkills: [], missingSkills: [], matchScore: 0 }
RESUME: ${resumeText}
JOB DESCRIPTION: ${jobDescription}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    try {
      return JSON.parse(response.text);
    } catch (jsonError) {
      console.error('Failed to parse AI JSON:', response.text);
      return { matchedSkills: [], missingSkills: [], matchScore: 0 };
    }
  } catch (err) {
    console.error('GenAI API error:', err);
    throw new Error(`AI analysis failed. Reason: ${err.message}`);
  }
};