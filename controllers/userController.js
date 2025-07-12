import User from "../models/User.js";
import mongoose from "mongoose";

class UserController {
  // Get all unverified users
  static async getUnverifiedUsers(req, res) {
    try {
      const users = await User.find({ isVerified: false }).select("-password"); // 👈 exclude password
      res.json(users);
    } catch (error) {
      console.error("Error fetching unverified users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Verify a user by ID
  static async verifyUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndUpdate(
        id,
        { isVerified: true },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "User verified successfully",
        name: user.name, // ✅ return only name
      });
    } catch (err) {
      res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    }
  }
}

export default UserController;
