const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getImageKitAuth } = require("../controllers/uploadController");

const router = express.Router();

router.get("/imagekit-auth", protect, getImageKitAuth);

module.exports = router;
