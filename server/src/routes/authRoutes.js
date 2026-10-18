const express = require("express");
const { register, verifyEmailHandler, login, logout, forgotPasswordHandler, resetPasswordHandler, getMe } = require("../controllers/authController");
const validateRequest = require("../middlewares/validateRequest");
const { registerSchema, verifyEmailSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require("../validators/authValidators");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);

router.post(
  "/verify-email",
  validateRequest(verifyEmailSchema),
  verifyEmailHandler,
);

router.post("/login", validateRequest(loginSchema), login);

router.post("/logout", logout);

router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  forgotPasswordHandler,
);

router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  resetPasswordHandler,
);

router.get("/me", protect, getMe);

module.exports = router;
