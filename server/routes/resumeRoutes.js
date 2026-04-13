
// backend/routes/resumeRoutes.js
import express from 'express';
import multer from 'multer';
import authMiddleware from '../middleware/authMiddleware.js';
import { analyzeResume } from '../controllers/resumeController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/analyze
router.post('/', authMiddleware, upload.single('resume'), analyzeResume);

export default router;