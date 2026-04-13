import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { GoogleGenAI } = require('@google/genai');

const run = async () => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const res = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Respond with JSON: {"ok": true}',
            config: { responseMimeType: 'application/json' }
        });
        console.log('SUCCESS:', res.text);
    } catch (err) {
        console.error('ERROR OBJECT:', err);
    }
}
run();
