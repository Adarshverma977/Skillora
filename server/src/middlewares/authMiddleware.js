const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authentication required. Please log in.", 401);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new AppError("Invalid authentication token.", 401);
  }

  if (!process.env.JWT_SECRET) {
    throw new AppError("Authentication service is not configured.", 500);
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError("Your session has expired. Please log in again.", 401);
    }

    throw new AppError("Invalid authentication token.", 401);
  }

  const user = await User.findById(decoded.sub);

  if (!user) {
    throw new AppError(
      "The account associated with this token no longer exists.",
      401,
    );
  }

  if (!user.isEmailVerified) {
    throw new AppError("Please verify your email before continuing.", 403);
  }

  req.user = user;
  next();
});

module.exports = { protect };
