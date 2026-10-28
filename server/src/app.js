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

// Allowed frontend origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://skillora-learn.vercel.app",
  "https://skillora-nine-omega.vercel.app",
  "http://localhost:5173",
].filter(Boolean);

// Global middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Skillora API is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/entries", entryRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/uploads", uploadRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
