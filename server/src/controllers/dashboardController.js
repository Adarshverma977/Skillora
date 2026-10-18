const LearningEntry = require("../models/LearningEntry");
const asyncHandler = require("../utils/asyncHandler");

const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [summary, difficultyBreakdown, recentEntries] = await Promise.all([
    LearningEntry.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          totalStudyMinutes: {
            $sum: "$studyDurationMinutes",
          },
          averageStudyMinutes: {
            $avg: "$studyDurationMinutes",
          },
        },
      },
    ]),

    LearningEntry.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]),

    LearningEntry.find({
      user: userId,
    })
      .sort({ learningDate: -1, createdAt: -1 })
      .limit(5)
      .select("topic studyDurationMinutes difficulty learningDate")
      .lean(),
  ]);

  const totals = summary[0] || {
    totalEntries: 0,
    totalStudyMinutes: 0,
    averageStudyMinutes: 0,
  };

  res.status(200).json({
    success: true,
    message: "Dashboard statistics fetched successfully.",
    data: {
      overview: {
        totalEntries: totals.totalEntries,
        totalStudyMinutes: totals.totalStudyMinutes,
        totalStudyHours: Number((totals.totalStudyMinutes / 60).toFixed(2)),
        averageStudyMinutes: Math.round(totals.averageStudyMinutes),
      },
      difficultyBreakdown,
      recentEntries,
    },
  });
});

const getDailyStudyTrends = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const timeZone = "Asia/Kolkata";

  // Get today's date in India
  const indiaDateString = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const [year, month, day] = indiaDateString.split("-").map(Number);

  // India midnight represented as UTC timestamps
  const endDate = new Date(Date.UTC(year, month - 1, day) - 330 * 60 * 1000);

  const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Fetch and group entries by Indian calendar date
  const trends = await LearningEntry.aggregate([
    {
      $match: {
        user: userId,
        learningDate: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$learningDate",
            timezone: timeZone,
          },
        },
        totalStudyMinutes: {
          $sum: "$studyDurationMinutes",
        },
        totalEntries: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  const trendMap = new Map(trends.map((trend) => [trend._id, trend]));

  const dailyTrends = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(`${indiaDateString}T00:00:00+05:30`);

    date.setUTCDate(date.getUTCDate() - (6 - i));

    const dateKey = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);

    const trend = trendMap.get(dateKey);

    dailyTrends.push({
      date: dateKey,
      totalStudyMinutes: trend?.totalStudyMinutes ?? 0,
      totalEntries: trend?.totalEntries ?? 0,
    });
  }

  res.status(200).json({
    success: true,
    message: "Daily study trends fetched successfully.",
    data: {
      startDate,
      endDate,
      trends: dailyTrends,
    },
  });
});

module.exports = {
  getDashboardStats,
  getDailyStudyTrends,
};
