import Post from "../models/Post.js";
import mongoose from "mongoose";
import Comment from "../models/Comment.js";
class PostController {
  // Create a new post
  static async createPost(req, res) {
    try {
      const { title, content } = req.body;

      if (!title || !content) {
        return res
          .status(400)
          .json({ message: "Title and content are required" });
      }

      const post = await Post.create({
        title,
        content,
        author: req.user._id,
      });

      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get all posts
  static async getPosts(req, res) {
    try {
      const posts = await Post.find()
        .populate("author", "name") // Post author
        .populate({
          path: "comments", // Virtual field
          populate: {
            path: "author", // Comment author
            select: "name",
          },
        });

      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts with comments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update a post
  static async updatePost(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const isOwner = post.author.toString() === req.user._id.toString();
      if (!isOwner) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      post.title = req.body.title || post.title;
      post.content = req.body.content || post.content;

      await post.save();
      res.json(post);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete a post
  static async deletePost(req, res) {
    try {
      const { id } = req.params;

      // Validate post ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      // Check if post exists
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Authorization check
      const isOwner = post.author.toString() === req.user._id.toString();
      if (!isOwner) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Delete the post
      await post.deleteOne();

      // 🔥 Delete all associated comments
      await Comment.deleteMany({ post: id });

      res.json({ message: "Post deleted" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default PostController;
