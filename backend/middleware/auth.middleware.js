const { verifyToken } = require("../utils/generate.token");

/**
 * JWT Authentication Middleware
 * Verifies JWT tokens from Authorization header
 * Expected format: "Bearer <token>" or just "<token>"
 */
module.exports = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    // Extract token (support both "Bearer <token>" and "<token>" formats)
    let token;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token format."
      });
    }

    // Verify token using utility function
    const decoded = verifyToken(token);

    // Validate decoded token structure
    if (!decoded.id || !decoded.role) {
      console.warn("Invalid token payload structure");
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token."
      });
    }

    // Attach user info to request object
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    // Continue to next middleware
    next();

  } catch (error) {
    console.error("JWT verification error:", error.message);

    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token has expired."
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token."
      });
    } else if (error.name === "NotBeforeError") {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token not active yet."
      });
    } else {
      // Generic error for other cases
      return res.status(401).json({
        success: false,
        message: "Access denied. Authentication failed."
      });
    }
  }
};