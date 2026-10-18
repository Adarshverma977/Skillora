const asyncHandler = require("../utils/asyncHandler");

const { registerUser, verifyEmail, loginUser, logoutUser, forgotPassword, resetPassword } = require("../services/authService");

const User = require("../models/User");

const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: result.message,
  });
});

const verifyEmailHandler = asyncHandler(async (req, res) => {
  const result = await verifyEmail(req.body.token);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: {
      token: result.token,
      user: result.user,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  const result = await logoutUser();

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

const forgotPasswordHandler = asyncHandler(async (req, res) => {
  const result = await forgotPassword(req.body);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

const resetPasswordHandler = asyncHandler(async (req, res) => {
  const result = await resetPassword(req.body);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "User profile fetched successfully.",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      profilePhoto: user.profilePhoto,
      createdAt: user.createdAt,
    },
  });
});

module.exports = {
  register,
  verifyEmailHandler,
  login,
  logout,
  forgotPasswordHandler,
  resetPasswordHandler,
  getMe,
};
