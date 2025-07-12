import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import AuthController from "../controllers/authController.js";
import UserController from "../controllers/userController.js";
import PostController from "../controllers/postController.js";
import CommentController from '../controllers/commentController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();
// Auth
router.post("/register", upload.none(), AuthController.register);
router.post("/login", upload.none(), AuthController.login);

// User (Admin only)
router.get('/users/unverified', protect, isAdmin, upload.none(), UserController.getUnverifiedUsers);
router.put('/users/verify/:id', protect, isAdmin, upload.none(), UserController.verifyUser);

// Posts
router.post("/posts", protect, upload.none(), PostController.createPost);
router.get("/posts", protect, upload.none(),  PostController.getPosts);
router.put("/posts/:id",protect, upload.none(), PostController.updatePost);
router.delete("/posts/:id", protect, upload.none(), PostController.deletePost);

// Comments
router.post('/comments', protect, upload.none(), CommentController.addComment);

export default router;
