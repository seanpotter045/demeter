const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');


router.post('/createUser', async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: "Username or email already exists" });
      }
  
      const newUser = new User({ username, email, password });
      await newUser.save();
  
      res.status(201).json({ message: "User created successfully" });
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  
  // Login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });
  
    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ message: 'User not found' });
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.status(400).json({ message: 'Invalid credentials' });
  
      res.json({ username: user.username, email: user.email });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });


router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


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
const mongoose = require("mongoose");

router.delete('/users/:username', async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ username: req.params.username });

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: `User '${req.params.username}' deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
