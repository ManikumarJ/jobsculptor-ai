import { extractTextFromPDF } from '../utils/resumeParser.js';
import { calculateJobMatch } from '../utils/matchCalculator.js';

export const analyzeResume = async (req, res) => {
    if (!req.file) return res.status(400).json({ msg: 'Upload a PDF file' });
    const { jobDescription } = req.body;
    if (!jobDescription) return res.status(400).json({ msg: 'Provide a job description' });

    try {
        const resumeText = await extractTextFromPDF(req.file.buffer);

        let aiResult;
        try {
            aiResult = await calculateJobMatch(resumeText, jobDescription);
        } catch (err) {
            console.error('AI Calculation Error:', err);
            return res.status(500).json({ msg: err.message });
        }

        res.json({
            ...aiResult,
            resumeTextSample: resumeText.slice(0, 200) + '...'
        });
    } catch (error) {
        console.error('Resume Analysis Error:', error); // ← log PDF parsing or other errors
        res.status(500).json({ msg: error.message || 'Error analyzing resume' });
    }
};