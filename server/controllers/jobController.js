// controllers/jobController.js
import Job from '../models/Job.js';

// Get all jobs for logged-in user
export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// Get a single job
export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ msg: 'Job not found' });
        if (job.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        res.json(job);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// Create a new job
export const createJob = async (req, res) => {
    const jobData = { ...req.body, userId: req.user.id };
    try {
        const job = await new Job(jobData).save();
        res.json(job);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// Update a job
export const updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ msg: 'Job not found' });
        if (job.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        const updateData = { ...req.body };
        // Reset reminderSent if interviewDate is changed
        if (updateData.interviewDate) {
            const newDate = new Date(updateData.interviewDate).toISOString();
            const oldDate = job.interviewDate ? new Date(job.interviewDate).toISOString() : null;
            if (newDate !== oldDate) {
                updateData.reminderSent = false;
            }
        }

        job = await Job.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
        res.json(job);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// Delete a job
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ msg: 'Job not found' });
        if (job.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await Job.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Job deleted' });
    } catch (error) {
        res.status(500).send('Server error');
    }
};