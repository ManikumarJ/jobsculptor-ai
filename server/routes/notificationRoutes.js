import express from 'express';
import webpush from 'web-push';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Configure web-push with VAPID keys
webpush.setVapidDetails(
    'mailto:test@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// Middleware to mock auth for now (or use real auth if available).
// Assuming we have access to req.user... Wait, jobTracker uses JWT. We must use authMiddleware.
import auth from '../middleware/authMiddleware.js';

router.post('/subscribe', auth, async (req, res) => {
    try {
        const subscription = req.body;

        // Save subscription in DB
        await User.findByIdAndUpdate(req.user.id, { pushSubscription: subscription });
        res.status(201).json({});
    } catch (error) {
        console.error("Error saving subscription:", error);
        res.status(500).json({ error: 'Failed to subscribe' });
    }
});

router.get('/vapidPublicKey', (req, res) => {
    res.send(process.env.VAPID_PUBLIC_KEY);
});

// GET all notifications for a user
router.get('/', auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(10); // Get latest 10 notifications
        res.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// PUT mark all user notifications as read
router.put('/read-all', auth, async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user.id, isRead: false },
            { $set: { isRead: true } }
        );
        res.json({ msg: 'All notifications marked as read' });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;
