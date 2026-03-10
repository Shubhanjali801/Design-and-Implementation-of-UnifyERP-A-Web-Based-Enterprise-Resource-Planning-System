const express = require("express");
const { register, login } = require("../controllers/auth.controller");

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", register);

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post("/login", login);

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
// router.get("/profile", auth, getProfile); // TODO: Implement profile endpoint

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
// router.put("/profile", auth, updateProfile); // TODO: Implement profile update

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
// router.put("/change-password", auth, changePassword); // TODO: Implement password change

module.exports = router;