const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

router.post('/createUser', async (req, res) => {
    const { username, email, password } = req.body;

    const user = await User.findOne({ username: username });
    if(user){
        return res.status(409).send({ message: "User is taken, pick another..." });
    }

    const createUser = new User({
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

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a user by ID
router.put('/users/:id', async (req, res) => {
    try {
            const id = req.params.id;
            const user = await User.findOne({ id: id });
            if (!user) {
                return res.status(404).json({ error: "User with this username does not exist." });
            }
            return res.json(user);
        } catch (err) {
            console.error("Error retrieving user:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
});

// Delete a user by ID
router.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
