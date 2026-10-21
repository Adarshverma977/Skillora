const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const entryRoutes = require("./routes/entryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

// Global middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/v1/dashboard", dashboardRoutes);

// Health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Skillora API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/entries", entryRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/uploads", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
