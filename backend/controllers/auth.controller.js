const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/generate.token");


// Register : 
// Input validation, duplicate check, password hashing, role assignment
// Returns user data without password
exports.register = async (req, res) => {
  try {
    const { name, email, password, role = "sales", employeeId, department, phone } = req.body;

    // Basic input validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ msg: "Password must be at least 8 characters long" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Check if employeeId already exists (if provided)
    if (employeeId) {
      const existingEmployeeId = await User.findOne({ employeeId: employeeId.toUpperCase() });
      if (existingEmployeeId) {
        return res.status(400).json({ msg: "Employee ID already exists" });
      }
    }

    // Create user (password hashing is handled by pre-save middleware)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // Will be hashed by pre-save middleware
      role,
      employeeId: employeeId ? employeeId.toUpperCase().trim() : undefined,
      department: department ? department.trim() : undefined,
      phone: phone ? phone.trim() : undefined
    });

    // Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      department: user.department,
      phone: user.phone,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    res.status(201).json({
      msg: "User registered successfully",
      user: userResponse
    });

  } catch (error) {
    console.error("Registration error:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        msg: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }

    res.status(500).json({ msg: "Server error during registration" });
  }
};

// Login : 
// Input validation, user lookup, password verification
// Returns JWT token + safe user data
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    // Find user (includes password for authentication)
    const user = await User.findForAuth(email.toLowerCase());
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        msg: "Account is temporarily locked due to too many failed login attempts"
      });
    }

    // Check password using model method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Increment login attempts
      await user.incLoginAttempts();
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Reset login attempts and update last login on successful authentication
    await user.resetLoginAttempts();

    // Generate token
    const token = generateToken(user._id, user.role);

    // Return user data without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      department: user.department,
      phone: user.phone,
      lastLogin: user.lastLogin
    };

    res.json({
      msg: "Login successful!",
      token,
      user: userResponse
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error during login" });
  }
};