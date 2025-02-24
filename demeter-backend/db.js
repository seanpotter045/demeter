const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const MONGO_URI = process.env.MONGO_URI;

const dbConnection = async () => {
    if (!MONGO_URI) {
        console.error("❌ MongoDB Connection Error: MONGO_URI is not defined in .env file");
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB Connected Successfully");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    }
};

module.exports = dbConnection;
