import UsersModel from "../models/users.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { userName, email, age } = req.body;

    // Check if the email already exists
    const existingUser = await UsersModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create a new user if the email doesn't exist
    const newUser = new UsersModel({ userName, email, age });
    const savedUser = await newUser.save();
    
    res.status(201).json({ message: "User created successfully", data: savedUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to create user", error: error.message });
  }
};

// Log in and generate a JWT token
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UsersModel.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, // Include user role in the token
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Fetch all users (only accessible by admins)
export const getAllUsers = async (req, res) => {
  try {
    const users = await UsersModel.find(); // Fetch all users

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found", data: [] });
    }

    res.status(200).json({ message: "Users fetched successfully", data: users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};
