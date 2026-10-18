const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateSecureToken, hashToken } = require("../utils/tokenUtils");
const { sendEmail } = require("./emailService");
const resetPasswordEmail = require("../templates/resetPasswordEmail");
const verificationEmail = require("../templates/verificationEmail");
const AppError = require("../utils/AppError");

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Unable to register with this email address", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const { token, tokenHash } = generateSecureToken();

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isEmailVerified: false,
    emailVerificationTokenHash: tokenHash,
    emailVerificationExpires: new Date(Date.now() + 15 * 60 * 1000),
  });

  const clientUrl = process.env.CLIENT_URL;

  if (!clientUrl) {
    await User.findByIdAndDelete(user._id);
    throw new AppError("Email verification is not configured", 500);
  }

  const verificationUrl = new URL("/verify-email", clientUrl);
  verificationUrl.searchParams.set("token", token);

  const emailContent = verificationEmail({
    name: user.name,
    verificationUrl: verificationUrl.toString(),
  });

  try {
    await sendEmail({
      to: user.email,
      ...emailContent,
    });
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw new AppError(
      "Unable to send verification email. Please try again.",
      503,
    );
  }

  return {
    message:
      "Registration successful. Please check your email to verify your account.",
  };
};

const verifyEmail = async (token) => {
  const tokenHash = hashToken(token);

  const user = await User.findOne({
    emailVerificationTokenHash: tokenHash,
    emailVerificationExpires: { $gt: new Date() },
  }).select("+emailVerificationTokenHash +emailVerificationExpires");

  if (!user) {
    throw new AppError("Verification link is invalid or has expired.", 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationTokenHash = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  return {
    message: "Email verified successfully. You can now log in.",
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (!user.isEmailVerified) {
    throw new AppError("Please verify your email before logging in.", 403);
  }

  if (!process.env.JWT_SECRET) {
    throw new AppError("Authentication is not configured.", 500);
  }

  const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    },
  };
};

const logoutUser = async () => {
  return {
    message: "Logout successful.",
  };
};


const forgotPassword = async ({ email }) => {
  const genericMessage =
    "If an account exists with this email, password reset instructions will be sent.";

  const user = await User.findOne({ email });

  // Return the same message for unknown emails.
  if (!user) {
    return { message: genericMessage };
  }

  const { token, tokenHash } = generateSecureToken();

  user.passwordResetTokenHash = tokenHash;
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);

  await user.save();

  const clientUrl = process.env.CLIENT_URL;

  if (!clientUrl) {
    throw new AppError("Password reset is not configured.", 500);
  }

  const resetUrl = new URL("/reset-password", clientUrl);
  resetUrl.searchParams.set("token", token);

  const emailContent = resetPasswordEmail({
    name: user.name,
    resetUrl: resetUrl.toString(),
  });

  try {
    await sendEmail({
      to: user.email,
      ...emailContent,
    });
  } catch (error) {
    // Do not leave a usable reset token after email delivery fails.
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    throw new AppError(
      "Unable to send password reset email. Please try again.",
      503,
    );
  }

  return { message: genericMessage };
};

const resetPassword = async ({ token, password }) => {
  const tokenHash = hashToken(token);

  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpires: { $gt: new Date() },
  }).select("+passwordResetTokenHash +passwordResetExpires +password");

  if (!user) {
    throw new AppError("Password reset link is invalid or has expired.", 400);
  }

  const isSamePassword = await bcrypt.compare(password, user.password);

  if (isSamePassword) {
    throw new AppError(
      "New password must be different from your current password.",
      400,
    );
  }

  user.password = await bcrypt.hash(password, 12);

  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  return {
    message: "Password reset successful. You can now log in.",
  };
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
};
