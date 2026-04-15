import cron from 'node-cron';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import webpush from 'web-push';
import dotenv from 'dotenv';
dotenv.config();

export const startCronJobs = () => {
    // Ensures VAPID details are set if they haven't been from notificationRoutes.js depending on import order.
    if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
        webpush.setVapidDetails(
            'mailto:test@example.com',
            process.env.VAPID_PUBLIC_KEY,
            process.env.VAPID_PRIVATE_KEY
        );
    }

    cron.schedule('* * * * *', async () => {
        try {
            console.log(`[CRON] Checking for upcoming job interviews...`);

            const now = new Date();
            const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

            const upcomingInterviews = await Job.find({
                interviewDate: {
                    $gte: oneHourAgo,
                    $lte: next24Hours
                },
                reminderSent: false,
            }).populate('userId');

            if (upcomingInterviews.length > 0) {
                console.log(`[CRON] Found ${upcomingInterviews.length} upcoming interviews to send reminders for.`);

                for (const item of upcomingInterviews) {
                    const user = item.userId;

                    if (!user) {
                        console.log(`[CRON] User for Job ${item._id} not found. Skipping.`);
                        continue;
                    }

                    // ATOMIC LOCK: Try to set reminderSent = true to prevent double execution if multiple servers run the cron (e.g. Render + Local)
                    const job = await Job.findOneAndUpdate(
                        { _id: item._id, reminderSent: false },
                        { $set: { reminderSent: true } },
                        { new: true }
                    );

                    if (!job) {
                        console.log(`[CRON] Job ${item._id} already processed by another worker. Skipping.`);
                        continue; // Another instance raced and already processed this!
                    }

                    const notificationTitle = `Upcoming Interview: ${job.companyName}`;
                    const notificationBody = `Reminder: You have an interview for ${job.jobTitle} on ${new Date(job.interviewDate).toLocaleString()}`;

                    // Always write to DB history
                    try {
                        const newNotification = new Notification({
                            userId: user._id,
                            title: notificationTitle,
                            body: notificationBody,
                            jobId: job._id
                        });
                        await newNotification.save();
                        console.log(`[CRON] DB Notification log saved for User ${user.email} (Job ${job._id})`);
                    } catch (dbErr) {
                        console.error(`[CRON] Failed to save DB Notification log:`, dbErr);
                    }

                    // Attempt physical Web Push ONLY if subscription exists
                    if (user.pushSubscription) {
                        const payload = JSON.stringify({
                            title: notificationTitle,
                            body: notificationBody,
                        });

                        try {
                            await webpush.sendNotification(user.pushSubscription, payload);
                            console.log(`[CRON] Push Notification sent to ${user.email} for Job ${job._id}`);
                        } catch (pushError) {
                            console.error(`[CRON] Failed to send push to ${user.email}:`, pushError);
                            // If subscription is invalid (status 410 or 404), remove it
                            if (pushError.statusCode === 410 || pushError.statusCode === 404) {
                                await User.findByIdAndUpdate(user._id, { pushSubscription: null });
                                console.log(`[CRON] Removed invalid push subscription for ${user.email}`);
                            }
                        }
                        console.log(`[CRON] User ${user.email} has no push config. Skipping Web-Push, but history logged.`);
                    }
                }
            } else {
                console.log(`[CRON] No upcoming interviews requiring reminders right now.`);
            }
        } catch (error) {
            console.error(`[CRON] Error checking for reminders:`, error);
        }
    });

    console.log('[CRON] Job Push Notification scheduler initialized.');
};
