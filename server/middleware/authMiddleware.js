const { verifyToken } = require("../config/jwt");
const User = require("../models/User");

// Middleware to protect routes that require authentication
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = verifyToken(token);

      if (!decoded || !decoded.id) {
        return res
          .status(401)
          .json({ message: "Not authorized, token failed" });
      }
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user._id = req.user._id || decoded.id;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res
        .status(401)
        .json({ message: "Not authorized, token invalid or expired" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to authorize based on user roles
const authorize = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ message: "User role not available for authorization" });
    }
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: `Role (${req.user.role}) is not authorized to access this route`,
        });
    }
    next();
  };
};

// Example: Check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, authorize, isAdmin };
