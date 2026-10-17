const express = require("express");
const { register } = require("../controllers/authController");
const validateRequest = require("../middlewares/validateRequest");
const { registerSchema } = require("../validators/authValidators");

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);

module.exports = router;
