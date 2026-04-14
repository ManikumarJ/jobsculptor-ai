// import dotenv from 'dotenv';
// dotenv.config();

// import express from 'express';
// import cors from 'cors';
// import connectDB from './config/db.js';

// import authRoutes from './routes/authRoutes.js';
// import jobRoutes from './routes/jobRoutes.js';
// import analyzeRoutes from './routes/resumeRoutes.js'
// import notificationRoutes from './routes/notificationRoutes.js'
// import { startCronJobs } from './utils/cronJobs.js';

// connectDB();

// startCronJobs();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/jobs', jobRoutes);
// app.use('/api/analyze', analyzeRoutes);
// app.use('/api/notifications', notificationRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// //  http://localhost:5000/api/analyze/analyze
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import analyzeRoutes from './routes/resumeRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

import { startCronJobs } from './utils/cronJobs.js';

connectDB();
startCronJobs();

const app = express();


// 🔥 CORS CONFIG (FIXED)
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        process.env.CLIENT_URL // for Vercel later
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
};

// ✅ Apply CORS FIRST
app.use(cors(corsOptions));

// ✅ Handle preflight requests (VERY IMPORTANT)
app.options("*", cors(corsOptions));

// ✅ Body parser
app.use(express.json());


// ✅ Test route
app.get("/", (req, res) => {
    res.send("JobSculptor API is running");
});


// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/notifications', notificationRoutes);


// ✅ Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});