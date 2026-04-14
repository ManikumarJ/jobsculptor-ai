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
// FRONTEND ORIGIN (ONLY ONE)
// =========================
const FRONTEND_URL =
    "https://jobsculptor-71c9eno03-manikumarjs-projects.vercel.app";

// =========================
// CORS (FINAL FIX)
// =========================
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// IMPORTANT: handle preflight properly
app.options("*", cors());

// =========================
// MIDDLEWARE ORDER (VERY IMPORTANT)
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
// ERROR HANDLER
// =========================
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});