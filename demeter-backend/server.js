const express = require("express");
const app = express();
const cors = require("cors");
const dbConnection = require("./db");
const locationRoutes = require('./routes/locationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();
const SERVER_PORT = 8081;

dbConnection();
app.use(cors({origin: '*'}));
app.use(express.json());
app.use('/api', locationRoutes);
app.use('/api', reviewRoutes);
app.use('/api', userRoutes);

app.listen(SERVER_PORT, (req, res) => {
    console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
})