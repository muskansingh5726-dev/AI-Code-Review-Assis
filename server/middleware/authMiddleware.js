
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("[Auth] Missing or invalid Authorization header");

      return res.status(401).json({
        success: false,
        message: "Please log in to continue.",
      });
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("[Auth] JWT_SECRET is not configured");

      return res.status(500).json({
        success: false,
        message: "Server authentication is not configured.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("[Auth] Token verification failed:", error.name);

    let message = "Invalid login session. Please log in again.";

    if (error.name === "TokenExpiredError") {
      message = "Your login session has expired. Please log in again.";
    }

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

export default authMiddleware;
