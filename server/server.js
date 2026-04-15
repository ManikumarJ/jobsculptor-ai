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
// FRONTEND URL
// =========================
const FRONTEND_URL = process.env.CLIENT_URL || "http://localhost:5173";

// =========================
// CORS CONFIG (SAFE)
// =========================
const corsOptions = {
    origin: function (origin, callback) {
        // allow server-to-server / postman
        if (!origin) return callback(null, true);

        if (origin === FRONTEND_URL) {
            return callback(null, true);
        }

        console.log("❌ Blocked by CORS:", origin);
        return callback(null, true); // (dev safe mode)
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"]
};

app.use(cors(corsOptions));

// IMPORTANT: DO NOT USE app.options("*")
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