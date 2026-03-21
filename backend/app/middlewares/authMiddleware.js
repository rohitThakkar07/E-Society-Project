const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  let token = req.headers.authorization;

  // 1. Reject if no token is provided
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided."
    });
  }

  // 2. Support both "Bearer <token>" and raw token formats
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    // 3. Verify and decode
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // 4. Return proper success: false JSON
    res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;