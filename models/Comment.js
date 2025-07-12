import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: String,
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);
