import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

class CommentController {
  static async addComment(req, res) {
    try {
      const { postId, content } = req.body;

      // Basic validation
      if (!postId || !content) {
        return res
          .status(400)
          .json({ message: "postId and content are required" });
      }

      // Check for valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid postId" });
      }

      // 🔍 Check if Post with this ID exists
      const postExists = await Post.findById(postId);
      if (!postExists) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Create Comment
      const comment = await Comment.create({
        post: postId,
        content,
        author: req.user._id,
      });

      res.status(201).json(comment);
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default CommentController;
