import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pushSubscription: { type: Object, default: null }, // Stores Web Push Sub
    jobColumns: { type: [String], default: ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'] }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);