import express from 'express';
import { registerUser, loginUser, getUser, updateColumns } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', authMiddleware, getUser);
router.put('/columns', authMiddleware, updateColumns);


export default router;

// http://localhost:5000/api/auth/register
// http://localhost:5000/api/auth/login
// http://localhost:5000/api/auth/