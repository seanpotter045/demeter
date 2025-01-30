const express = require("express");
const app = express();
const cors = require("cors");
const dbConnection = require("./db");
const createUser = require('./routes/userCreateUser');

require('dotenv').config();
const SERVER_PORT = 8081;

dbConnection();
app.use(cors({origin: '*'}));
app.use(express.json());
app.use('/user', createUser);

app.listen(SERVER_PORT, (req, res) => {
    console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
})