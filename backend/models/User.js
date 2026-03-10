const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  // Basic User Information
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [50, "Name cannot exceed 50 characters"],
    minlength: [2, "Name must be at least 2 characters long"]
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [100, "Email cannot exceed 100 characters"],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address"
    ]
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false // Don't include password in queries by default
  },

  role: {
    type: String,
    enum: {
      values: ["admin", "sales", "purchase", "inventory"],
      message: "Role must be one of: admin, sales, purchase, inventory"
    },
    default: "sales"
  },

  // Additional ERP User Fields
  employeeId: {
    type: String,
    unique: true,
    sparse: true, // Allows null values but enforces uniqueness for non-null
    trim: true,
    uppercase: true,
    maxlength: [20, "Employee ID cannot exceed 20 characters"]
  },

  department: {
    type: String,
    trim: true,
    maxlength: [50, "Department cannot exceed 50 characters"]
  },

  phone: {
    type: String,
    trim: true,
    maxlength: [15, "Phone number cannot exceed 15 characters"],
    match: [/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"]
  },

  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for account lock status
userSchema.virtual("isLocked").get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ employeeId: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
userSchema.pre("save", async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = {
      lockUntil: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
    };
  }

  return this.updateOne(updates);
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  });
};

// Static method to find user for authentication
userSchema.statics.findForAuth = function(email) {
  return this.findOne({ email, isActive: true }).select("+password");
};

module.exports = mongoose.model("User", userSchema);