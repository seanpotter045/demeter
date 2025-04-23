const express = require("express");
const cors = require("cors");
const dbConnection = require("./db");
const locationRoutes = require("./routes/locationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();
const SERVER_PORT = process.env.PORT || 8081;

// Connect to MongoDB
dbConnection();

// Determine frontend origin based on environment
const allowedOrigin = process.env.FRONTEND_URL || "*"; // fallback to '*' if not set

const corsOptions = {
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/locations", locationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);

// Default response
app.get("/", (req, res) => {
  res.send("Demeter backend is running.");
});

// Start server
app.listen(SERVER_PORT, () => {
  console.log(`✅ Backend running on port ${SERVER_PORT}`);
});
