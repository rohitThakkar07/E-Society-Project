const jwt = require("jsonwebtoken");
const User = require("../db/models/userModel");
const { assertResidentOrGuardProfileActive } = require("../../utils/profileAccess");

const authMiddleware = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided."
    });
  }

  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    // 1. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Fetch full user to get 'profileId' and 'role'
    // Controllers like getMyMaintenance depend on req.user.profileId
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found."
      });
    }

    if (user.status === "Inactive") {
      return res.status(403).json({
        success: false,
        message: "Account is inactive. Contact admin.",
      });
    }
    const normalizedRole = String(user.role || "").trim().toLowerCase();
    user.role = normalizedRole;

    const profileCheck = await assertResidentOrGuardProfileActive(user);
    if (!profileCheck.ok) {
      return res.status(profileCheck.status || 403).json({
        success: false,
        message: profileCheck.message,
      });
    }

    // 3. Attach full user object to the request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;