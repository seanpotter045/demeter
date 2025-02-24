const express = require("express");
const cors = require("cors");
const dbConnection = require("./db"); // Ensure db.js is correctly set up
const locationRoutes = require("./routes/locationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();
const SERVER_PORT = process.env.PORT || 8081;

// Connect to MongoDB
dbConnection();

// Middleware to handle CORS for all incoming requests
const corsOptions = {
  origin: "*", // Allow all origins (can be restricted to specific URLs in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use("/api/locations", locationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);

// Handle preflight OPTIONS requests (CORS preflight checks)
app.options('*', cors(corsOptions)); // Handle preflight requests

// Start server
app.listen(SERVER_PORT, () => {
  console.log(`Backend service running on port ${SERVER_PORT} and waiting for requests.`);
});
