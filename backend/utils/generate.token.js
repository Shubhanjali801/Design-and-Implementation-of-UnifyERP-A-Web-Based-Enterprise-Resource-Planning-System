const jwt = require("jsonwebtoken");

/**
 * Generate JWT access token
 * @param {string} id - User ID
 * @param {string} role - User role
 * @param {string} expiresIn - Token expiration time (default: "1d")
 * @returns {string} JWT token
 * @throws {Error} If JWT_SECRET is not configured
 */
const generateToken = (id, role, expiresIn = "1d") => {
  // Validate inputs
  if (!id || !role) {
    throw new Error("User ID and role are required for token generation");
  }

  // Check if JWT_SECRET is configured
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not configured");
  }

  // Create token payload
  const payload = {
    id,
    role,
    iat: Math.floor(Date.now() / 1000), // Issued at time
  };

  // Sign and return token
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
    issuer: "UnifyERP",
    audience: "unifyerp-users"
  });
};

/**
 * Generate refresh token (longer expiration)
 * @param {string} id - User ID
 * @returns {string} Refresh token
 */
const generateRefreshToken = (id) => {
  if (!id) {
    throw new Error("User ID is required for refresh token generation");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not configured");
  }

  const payload = {
    id,
    type: "refresh",
    iat: Math.floor(Date.now() / 1000),
  };

  // Refresh tokens last 30 days
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
    issuer: "UnifyERP",
    audience: "unifyerp-refresh"
  });
};

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 * @throws {Error} If token is invalid
 */
const verifyToken = (token) => {
  if (!token) {
    throw new Error("Token is required");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not configured");
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "UnifyERP",
      audience: ["unifyerp-users", "unifyerp-refresh"]
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    } else {
      throw new Error("Token verification failed");
    }
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken
};