const rateLimit = require("express-rate-limit");

const resendVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many verification requests. Please try again after 15 minutes.",
  },
});

module.exports = resendVerificationLimiter;
