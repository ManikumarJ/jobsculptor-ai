// models/Job.js
import mongoose from 'mongoose';

// Define how a Job document looks
const JobSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String },
    jobLink: { type: String },
    matchScore: { type: Number, default: 0 }, // AI match score
    matchedSkills: { type: [String], default: [] }, // Skills found in resume & job
    missingSkills: { type: [String], default: [] }, // Skills missing in resume
    notes: { type: String },
    status: { type: String, default: 'Saved' },
    interviewDate: { type: Date },
    reminderSent: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Job', JobSchema);