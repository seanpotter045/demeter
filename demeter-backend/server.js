require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const dbConnection = require("./db");
const locationRoutes = require("./routes/locationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const SERVER_PORT = process.env.PORT || 8081;
dbConnection();

// ✅ Allow both localhost and deployed frontend
const allowedOrigins = [
  "http://localhost:3000",
  "https://demeter-frontend.onrender.com"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Handle preflight requests explicitly
app.options('*', cors());

// ✅ Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API routes
app.use("/api/users", userRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api", uploadRoutes); // 🆕 Mount uploads under /api

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Demeter backend is running.");
});

// ✅ Start server
app.listen(SERVER_PORT, () => {
  console.log(`🌱 Demeter backend running on port ${SERVER_PORT}`);
});
