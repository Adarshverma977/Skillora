const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/v1/users/me
const getMyProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select(
    "name email profilePhoto isEmailVerified createdAt",
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    data: { user },
  });
});

// PATCH /api/v1/users/me
const updateMyProfile = asyncHandler(async (req, res, next) => {
  const allowedFields = ["name", "profilePhoto"];
  const updates = {};

  for (const field of Object.keys(req.body)) {
    if (!allowedFields.includes(field)) {
      return next(new AppError(`You cannot update the "${field}" field`, 400));
    }
  }

  if (Object.prototype.hasOwnProperty.call(req.body, "name")) {
    if (
      typeof req.body.name !== "string" ||
      req.body.name.trim().length < 2 ||
      req.body.name.trim().length > 50
    ) {
      return next(
        new AppError("Name must be between 2 and 50 characters", 400),
      );
    }

    updates.name = req.body.name.trim();
  }

  if (Object.prototype.hasOwnProperty.call(req.body, "profilePhoto")) {
    const photo = req.body.profilePhoto;

    if (
      photo !== null &&
      (typeof photo !== "string" ||
        photo.trim().length === 0 ||
        photo.trim().length > 2048)
    ) {
      return next(
        new AppError("Profile photo must be a valid URL string or null", 400),
      );
    }

    if (typeof photo === "string") {
      try {
        const parsedUrl = new URL(photo.trim());

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        return next(
          new AppError("Profile photo must be a valid HTTP or HTTPS URL", 400),
        );
      }

      updates.profilePhoto = photo.trim();
    } else {
      updates.profilePhoto = null;
    }
  }

  if (Object.keys(updates).length === 0) {
    return next(new AppError("Provide at least one field to update", 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: updates },
    {
      new: true,
      runValidators: true,
    },
  ).select("name email profilePhoto isEmailVerified createdAt");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: { user },
  });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
};
