const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generateSecureToken } = require("../utils/tokenUtils");
const { sendEmail } = require("./emailService");
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

module.exports = {
  registerUser,
};
