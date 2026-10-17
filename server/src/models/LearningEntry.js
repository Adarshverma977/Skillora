const mongoose = require("mongoose");

const learningEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Entry must belong to a user"],
      index: true,
    },

    topic: {
      type: String,
      required: [true, "Topic is required"],
      trim: true,
      minlength: [2, "Topic must contain at least 2 characters"],
      maxlength: [100, "Topic cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },

    studyDurationMinutes: {
      type: Number,
      required: [true, "Study duration is required"],
      min: [1, "Study duration must be at least 1 minute"],
      max: [1440, "Study duration cannot exceed 1440 minutes"],
      validate: {
        validator: Number.isInteger,
        message: "Study duration must be a whole number",
      },
    },

    difficulty: {
      type: String,
      enum: {
        values: ["Easy", "Medium", "Hard"],
        message: "Difficulty must be Easy, Medium, or Hard",
      },
      required: [true, "Difficulty is required"],
    },

    learningDate: {
      type: Date,
      required: [true, "Learning date is required"],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Useful indexes for a user's journal and filters.
learningEntrySchema.index({ user: 1, learningDate: -1 });
learningEntrySchema.index({
  user: 1,
  difficulty: 1,
  learningDate: -1,
});

module.exports = mongoose.model("LearningEntry", learningEntrySchema);
