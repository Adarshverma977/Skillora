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
  const { page, limit, search, difficulty, sort, fromDate, toDate } = req.query;

  // 1. Only fetch the logged-in user's entries.
  const filter = {
    user: req.user._id,
  };

  // 2. Filter by difficulty.
  if (difficulty) {
    filter.difficulty = difficulty;
  }

  // 3. Search in topic and description.
  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    filter.$or = [
      { topic: { $regex: escapedSearch, $options: "i" } },
      { description: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  // 4. Filter by learning date.
  if (fromDate || toDate) {
    const dateFilter = {};

    if (fromDate) {
      const startDate = new Date(`${fromDate}T00:00:00.000Z`);

      if (
        Number.isNaN(startDate.getTime()) ||
        startDate.toISOString().slice(0, 10) !== fromDate
      ) {
        throw new AppError("Invalid fromDate value.", 400);
      }

      dateFilter.$gte = startDate;
    }

    if (toDate) {
      const endDate = new Date(`${toDate}T00:00:00.000Z`);

      if (
        Number.isNaN(endDate.getTime()) ||
        endDate.toISOString().slice(0, 10) !== toDate
      ) {
        throw new AppError("Invalid toDate value.", 400);
      }

      // Exclusive upper boundary includes the entire end date.
      endDate.setUTCDate(endDate.getUTCDate() + 1);
      dateFilter.$lt = endDate;
    }

    filter.learningDate = dateFilter;
  }

  // 5. Pagination.
  const currentPage = Number(page);
  const pageSize = Number(limit);
  const skip = (currentPage - 1) * pageSize;

  // 6. Sorting.
  const sortOrder =
    sort === "oldest"
      ? { learningDate: 1, createdAt: 1 }
      : { learningDate: -1, createdAt: -1 };

  // 7. Fetch entries and count using the same combined filter.
  const [entries, totalEntries] = await Promise.all([
    LearningEntry.find(filter)
      .sort(sortOrder)
      .skip(skip)
      .limit(pageSize)
      .lean(),

    LearningEntry.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalEntries / pageSize);

  // 8. Response.
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

  // Calculate the last 7 calendar days.
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const startDate = new Date(today);
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - 6);

  const [overall, difficultyCounts, weeklyData, recentEntries] =
    await Promise.all([
      // Overall statistics and normalized unique topics.
      LearningEntry.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalEntries: { $sum: 1 },
            totalStudyMinutes: {
              $sum: "$studyDurationMinutes",
            },
            uniqueTopics: {
              $addToSet: {
                $toLower: {
                  $trim: { input: "$topic" },
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalEntries: 1,
            totalStudyMinutes: 1,
            uniqueTopicsCount: { $size: "$uniqueTopics" },
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
            learningDate: {
              $gte: startDate,
              $lte: today,
            },
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
            studyMinutes: {
              $sum: "$studyDurationMinutes",
            },
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

  // Fill days without entries with zero values.
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
    uniqueTopicsCount: 0,
  };

  const totalEntries = stats.totalEntries;
  const totalStudyMinutes = stats.totalStudyMinutes;

  const averageSessionMinutes =
    totalEntries > 0
      ? Number((totalStudyMinutes / totalEntries).toFixed(2))
      : 0;

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
        totalEntries,
        totalStudyMinutes,
        totalStudyHours: Number((totalStudyMinutes / 60).toFixed(2)),
        averageSessionMinutes,
        uniqueTopics: stats.uniqueTopicsCount,
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
