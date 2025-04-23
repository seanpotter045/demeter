require("dotenv").config(); // Load env vars first

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

// ✅ Define allowed frontend URL for CORS
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";

const corsOptions = {
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // optional, useful if you're using cookies
};

// ✅ Apply CORS middleware
app.use(cors(corsOptions));

// ✅ Middleware for JSON requests
app.use(express.json());

// ✅ Routes
app.use("/api/locations", locationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("✅ Demeter backend is running.");
});

// ✅ Start server
app.listen(SERVER_PORT, () => {
  console.log(`🌱 Demeter backend running on port ${SERVER_PORT}`);
});
