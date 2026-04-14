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

// =============================
// ✅ FIXED CORS CONFIG
// =============================
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.CLIENT_URL // Vercel frontend URL
];

// IMPORTANT: fallback safety
const corsOptions = {
    origin: function (origin, callback) {
        // allow REST tools like Postman (no origin)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error("Not allowed by CORS: " + origin));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

// =============================
// ✅ APPLY CORS PROPERLY
// =============================
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // 🔥 FIX preflight issue

app.use(express.json());

// =============================
// TEST ROUTE
// =============================
app.get("/", (req, res) => {
    res.send("JobSculptor API is running");
});

// =============================
// ROUTES
// =============================
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/notifications', notificationRoutes);

// =============================
// SERVER START
// =============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});