const { z } = require("zod");

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),
});

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required")
    .max(72, "Password cannot exceed 72 characters"),
});

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .transform((value) => value.toLowerCase()),
});

const resendVerificationEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .transform((value) => value.toLowerCase()),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),
});

const verifyEmailSchema = z.object({
  token: z.string().trim().min(1, "Verification token is required"),
});

const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters")
      .max(50, "Name cannot exceed 50 characters")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

  const changePasswordSchema = z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),

      newPassword: z
        .string()
        .min(8, "New password must contain at least 8 characters")
        .max(128, "New password cannot exceed 128 characters"),
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: "New password must differ from current password",
      path: ["newPassword"],
    });

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resendVerificationEmailSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  updateProfileSchema,
  changePasswordSchema,
};
