const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const newUser = require('../models/reviewModel');

router.post('/createUser', async (req, res) => {
    const { username, email, password } = req.body;

    const user = await newUser.findOne({ username: username });
    if(user){
        return res.status(409).send({ message: "User is taken, pick another..." });
    }

    const createUser = new newUser({
        username: username,
        email: email,
        password: password,

    });

    try{
        const saveNewUser = await createUser.save();
        res.send(saveNewUser);
    } catch (error){
        res.status(400).send({ message: "Error trying to create new user" })
    }
})

module.exports = router;