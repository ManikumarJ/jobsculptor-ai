import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Remove deprecated options
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Stop server if DB fails
  }
};

export default connectDB;