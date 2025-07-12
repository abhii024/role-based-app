import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// 👇 Virtual field for comments
postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
});

// 👇 Enable virtuals in `toJSON` and `toObject`
postSchema.set('toObject', { virtuals: true });
postSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Post', postSchema);
