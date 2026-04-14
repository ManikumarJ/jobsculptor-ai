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
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import analyzeRoutes from "./routes/resumeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

import { startCronJobs } from "./utils/cronJobs.js";

// =========================
// INIT
// =========================
connectDB();
startCronJobs();

const app = express();

// =========================
// ALLOWED ORIGINS
// =========================
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://jobsculptor-71c9eno03-manikumarjs-projects.vercel.app"
];

// =========================
// CORS (FINAL FIX)
// =========================
app.use(cors({
    origin: function (origin, callback) {
        // allow Postman / server-to-server
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.log("❌ Blocked by CORS:", origin);

        // IMPORTANT: DO NOT FAIL REQUEST (prevents login breaking)
        return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// IMPORTANT: handle preflight properly
app.options(/.*/, cors());

// =========================
// MIDDLEWARE ORDER (IMPORTANT)
// =========================
app.use(express.json());

// =========================
// TEST ROUTE
// =========================
app.get("/", (req, res) => {
    res.send("JobSculptor API is running 🚀");
});

// =========================
// ROUTES
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/notifications", notificationRoutes);

// =========================
// ERROR HANDLER (SAFE)
// =========================
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({
        message: "Internal Server Error"
    });
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});