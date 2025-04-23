require("dotenv").config(); // Load env vars

const express = require("express");
const cors = require("cors");
const dbConnection = require("./db");
const locationRoutes = require("./routes/locationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const SERVER_PORT = process.env.PORT || 8081;

// Connect to MongoDB
dbConnection();

// CORS setup
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Public routes
app.use("/api/users", userRoutes);

// Protected routes (if needed you can apply middleware inside those files)
app.use("/api/locations", locationRoutes);
app.use("/api/reviews", reviewRoutes);

// Test root route
app.get("/", (req, res) => {
  res.send("✅ Demeter backend is running.");
});

app.listen(SERVER_PORT, () => {
  console.log(`🌱 Demeter backend running on port ${SERVER_PORT}`);
});
