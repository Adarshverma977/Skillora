const asyncHandler = require("../utils/asyncHandler");
const { registerUser } = require("../services/authService");

const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: result.message,
  });
});

module.exports = {
  register,
};
