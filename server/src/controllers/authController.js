const bcrypt = require("bcrypt");

const User = require("../models/User");

const AppError = require("../utils/AppError");

const asyncHandler = require("../utils/asyncHandler");

const {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} = require("../services/authService");


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

const updateProfile = asyncHandler(async (req, res) => {
  const user = req.user;

  if (req.body.name !== undefined) {
    user.name = req.body.name;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        profilePhoto: user.profilePhoto,
      },
    },
  });
});


const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select(
    "+password +tokenVersion",
  );

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isCurrentPasswordValid) {
    throw new AppError("Current password is incorrect.", 400);
  }

  user.password = newPassword;

  // Invalidate all previously issued JWT tokens.
  user.tokenVersion = (user.tokenVersion ?? 0) + 1;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully. Please log in again.",
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
  updateProfile,
  changePassword,
};
