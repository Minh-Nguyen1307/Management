import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors"; // To handle cross-origin requests
mongoose.connect(
  "mongodb+srv://minhnguyen1307s2:0V9Y6nID4K75w3l0@management.byc0z.mongodb.net/?retryWrites=true&w=majority&appName=Management"
);
dotenv.config();

// Initialize express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// CORS setup if you are using different front-end and back-end domains
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed", err));

// Use user routes
app.use(userRoutes);

// Start the server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
