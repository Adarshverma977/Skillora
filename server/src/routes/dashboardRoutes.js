const express = require("express");

const {
  getDashboardStats,
  getDailyStudyTrends,
} = require("../controllers/dashboardController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/stats", protect, getDashboardStats);

router.get("/trends", protect, getDailyStudyTrends);

module.exports = router;
