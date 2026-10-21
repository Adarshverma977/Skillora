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
  const { page, limit, search, difficulty, sort } = req.query;

  // 1. Logged-in user ki entries only
  const filter = {
    user: req.user._id,
  };

  // 2. Difficulty filter
  if (difficulty) {
    filter.difficulty = difficulty;
  }

  // 3. Search in topic and description
  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    filter.$or = [
      { topic: { $regex: escapedSearch, $options: "i" } },
      { description: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  // 4. Pagination
  const currentPage = Number(page);
  const pageSize = Number(limit);
  const skip = (currentPage - 1) * pageSize;

  // 5. Sorting
  const sortOrder =
    sort === "oldest"
      ? { learningDate: 1, createdAt: 1 }
      : { learningDate: -1, createdAt: -1 };

  // 6. Fetch entries and total count
  const [entries, totalEntries] = await Promise.all([
    LearningEntry.find(filter)
      .sort(sortOrder)
      .skip(skip)
      .limit(pageSize)
      .lean(),

    LearningEntry.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalEntries / pageSize);

  // 7. Response
  res.status(200).json({
    success: true,
    message: "Learning entries fetched successfully.",
    results: entries.length,
    pagination: {
      currentPage,
      pageSize,
      totalEntries,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
    data: {
      entries,
    },
  });
});

const getEntryAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Use the server's local calendar date for the 7-day window.
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const startDate = new Date(today);
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - 6);

  const [overall, difficultyCounts, weeklyData, recentEntries] =
    await Promise.all([
      // Overall statistics for this user.
      LearningEntry.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalEntries: { $sum: 1 },
            totalStudyMinutes: { $sum: "$studyDurationMinutes" },
          },
        },
      ]),

      // Difficulty breakdown.
      LearningEntry.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: "$difficulty",
            count: { $sum: 1 },
          },
        },
      ]),

      // Daily study duration over the last 7 calendar days.
      LearningEntry.aggregate([
        {
          $match: {
            user: userId,
            learningDate: { $gte: startDate, $lte: today },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$learningDate",
              },
            },
            studyMinutes: { $sum: "$studyDurationMinutes" },
            entriesCount: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Latest learning entries.
      LearningEntry.find({ user: userId })
        .sort({ learningDate: -1, createdAt: -1 })
        .limit(5)
        .select("topic difficulty studyDurationMinutes learningDate")
        .lean(),
    ]);

  // Fill dates with no study entries with zero minutes.
  const weeklyStudy = [];
  const weeklyMap = new Map(weeklyData.map((item) => [item._id, item]));

  for (let i = 0; i < 7; i += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const dateKey = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    const dayData = weeklyMap.get(dateKey);

    weeklyStudy.push({
      date: dateKey,
      studyMinutes: dayData?.studyMinutes || 0,
      entriesCount: dayData?.entriesCount || 0,
    });
  }

  const stats = overall[0] || {
    totalEntries: 0,
    totalStudyMinutes: 0,
  };

  const difficultyBreakdown = {
    Easy: 0,
    Medium: 0,
    Hard: 0,
  };

  difficultyCounts.forEach(({ _id, count }) => {
    if (Object.prototype.hasOwnProperty.call(difficultyBreakdown, _id)) {
      difficultyBreakdown[_id] = count;
    }
  });

  res.status(200).json({
    success: true,
    message: "Learning analytics fetched successfully.",
    data: {
      overview: {
        totalEntries: stats.totalEntries,
        totalStudyMinutes: stats.totalStudyMinutes,
        totalStudyHours: Number((stats.totalStudyMinutes / 60).toFixed(2)),
      },
      difficultyBreakdown,
      weeklyStudy,
      recentEntries,
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
  getEntryAnalytics,
  getEntryById,
  updateEntry,
  deleteEntry,
};
