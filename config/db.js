import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/User.js'; // make sure path is correct

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // 🔐 Auto-create admin if not exists
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      const adminUser = new User({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully');
    } else {
      console.log('ℹ️ Admin already exists');
    }

  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

export default connectDB;
