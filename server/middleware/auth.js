import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authenticate = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers["authorization"]?.split(" ")[1];  // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify the JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Attach the decoded user information (ID, role) to the request object
    req.user = decoded;  // Now you can access user ID and role via req.user
    next();  // Proceed to the next middleware or route handler
  });
};
