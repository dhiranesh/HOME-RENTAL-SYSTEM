const User = require("../models/User");
const { generateToken } = require("../config/jwt");
const asyncHandler = require("express-async-handler"); // For handling async errors without try-catch

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields (name, email, password)");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const user = await User.create({
    name,
    email,
    password, // Password will be hashed by the pre-save hook in User model
    role: role || "user", // Default to 'user' if role is not provided
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }
    if (!user.password) {
      res.status(500);
      throw new Error("Account error - please contact support");
    }
    const isPasswordMatch = await user.matchPassword(password);
    if (isPasswordMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401); // Unauthorized
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    if (!res.statusCode || res.statusCode === 200) {
      res.status(500);
    }
    throw error;
  }
});

// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private (requires token)
const getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized, user not found");
  }
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
});

// @desc    Logout user
// @route   GET /api/auth/logout (or POST)
// @access  Private (if you want to ensure a user is logged in to log out)
const logoutUser = asyncHandler(async (req, res) => {
  // For JWT, logout is typically handled on the client-side by removing the token.
  // If you store tokens in a database for blacklisting, you would do that here.
  // For cookie-based sessions, you would clear the cookie.
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict",
  });
  res.status(200).json({ message: "User logged out successfully" });
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
const updateDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    // Add other updatable fields as necessary

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id, updatedUser.role), // Optionally re-issue token
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    res.status(400);
    throw new Error("Please provide old and new passwords");
  }

  const user = await User.findById(req.user.id);

  if (user && (await user.matchPassword(oldPassword))) {
    user.password = newPassword; // The pre-save hook in User model will hash it
    await user.save();
    res.json({ message: "Password updated successfully" });
  } else {
    res.status(401);
    throw new Error("Invalid old password or user not found");
  }
});

// @desc    Forgot password - Generate token and send email (implementation detail)
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  // 1. Get user by email
  // 2. Generate a reset token (save hashed version to DB, set expiry)
  // 3. Send email with reset link
  res.status(200).json({ message: "Password reset email sent (placeholder)" });
});

// @desc    Reset password using token
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // 1. Get token from params, new password from body
  // 2. Find user by token (ensure token is valid and not expired)
  // 3. Update password, clear reset token fields
  res.status(200).json({ message: "Password has been reset (placeholder)" });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser, // Added
  getMe,
  updateDetails, // Added
  updatePassword, // Added
  forgotPassword, // Added
  resetPassword, // Added
};
