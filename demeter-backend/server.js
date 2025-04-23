require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const dbConnection = require("./db");
const locationRoutes = require("./routes/locationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");

const SERVER_PORT = process.env.PORT || 8081;
dbConnection();

// ✅ CORRECT: Apply CORS before any routes
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Also handle preflight explicitly (important for some setups)
app.options('*', cors());

// ✅ JSON middleware
app.use(express.json());

// ✅ Mount your routes
app.use("/api/users", userRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/reviews", reviewRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("✅ Demeter backend is running.");
});

app.listen(SERVER_PORT, () => {
  console.log(`🌱 Demeter backend running on port ${SERVER_PORT}`);
});
