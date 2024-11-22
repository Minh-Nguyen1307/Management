import express from "express";
import { createUser, getAllUsers, loginUser } from "../controllers/userController.js";
import { apiKeyAuth } from "../middleware/apiKeyAuth.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

// Route to create a new user (both user and admin can do this)
router.post("/api/users", apiKeyAuth, authenticate, authorize(["user", "admin"]), createUser);

// Route to log in a user and get a JWT (no API key required here)
router.post("/api/users/login", loginUser);

// Route to fetch all users (only accessible by admin)
router.get("/api/users", apiKeyAuth, authenticate, authorize(["admin"]), getAllUsers);

export default router;

