import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Basic validation
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });

      await newUser.save();

      res.status(201).json({
        message: "Registered successfully. Await admin verification.",
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Basic validation
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const user = await User.findOne({ email });
      console.log("user",user);
      if (!user || !user.isVerified) {
        return res
          .status(403)
          .json({ message: "Not verified or user not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.json({ token, message: "login successfully" });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default AuthController;
