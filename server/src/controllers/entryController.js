const AppError = require("../utils/AppError");
const LearningEntry = require("../models/LearningEntry");
const asyncHandler = require("../utils/asyncHandler");

const createEntry = asyncHandler(async (req, res) => {
  const { topic, description, studyDurationMinutes, difficulty, learningDate } =
    req.body;

  const entry = await LearningEntry.create({
    user: req.user._id,
    topic,
    description,
    studyDurationMinutes,
    difficulty,
    ...(learningDate && { learningDate }),
  });

  res.status(201).json({
    success: true,
    message: "Learning entry created successfully.",
    data: {
      entry: {
        id: entry._id,
        topic: entry.topic,
        description: entry.description,
        studyDurationMinutes: entry.studyDurationMinutes,
        difficulty: entry.difficulty,
        learningDate: entry.learningDate,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      },
    },
  });
});

const getEntries = asyncHandler(async (req, res) => {
  const entries = await LearningEntry.find({
    user: req.user._id,
  }).sort({ learningDate: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Learning entries fetched successfully.",
    results: entries.length,
    data: {
      entries,
    },
  });
});

const getEntryById = asyncHandler(async (req, res) => {
  const entry = await LearningEntry.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!entry) {
    throw new AppError("Learning entry not found.", 404);
  }

  res.status(200).json({
    success: true,
    message: "Learning entry fetched successfully.",
    data: {
      entry,
    },
  });
});

const updateEntry = asyncHandler(async (req, res) => {
  const entry = await LearningEntry.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!entry) {
    throw new AppError("Learning entry not found.", 404);
  }

  const allowedFields = [
    "topic",
    "description",
    "studyDurationMinutes",
    "difficulty",
    "learningDate",
  ];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      entry[field] = req.body[field];
    }
  }

  await entry.save();

  res.status(200).json({
    success: true,
    message: "Learning entry updated successfully.",
    data: {
      entry,
    },
  });
});

const deleteEntry = asyncHandler(async (req, res) => {
  const entry = await LearningEntry.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!entry) {
    throw new AppError("Learning entry not found.", 404);
  }

  res.status(200).json({
    success: true,
    message: "Learning entry deleted successfully.",
    data: null,
  });
});

module.exports = {
  createEntry,
  getEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
};
