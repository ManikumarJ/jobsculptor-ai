import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' } // Optional foreign key if linking to a specific Job
});

export default mongoose.model('Notification', NotificationSchema);
