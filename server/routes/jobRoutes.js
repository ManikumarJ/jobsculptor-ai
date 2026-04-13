// routes/jobRoutes.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getJobs, getJobById, createJob, updateJob, deleteJob } from '../controllers/jobController.js';

const router = express.Router();

router.get('/', authMiddleware, getJobs);
router.get('/:id', authMiddleware, getJobById);
router.post('/', authMiddleware, createJob);
router.put('/:id', authMiddleware, updateJob);
router.delete('/:id', authMiddleware, deleteJob);

export default router;