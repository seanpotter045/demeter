const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const User = require('../models/userModel');
const Location = require('../models/locationModel');
const bcrypt = require('bcryptjs');

// Create user
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
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    res.json({ username: user.username, email: user.email, _id: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Update user (username, profile picture, cover image)
router.put('/:userId', async (req, res) => {
  try {
    const { username, profilePicture, coverImage } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { username, profilePicture, coverImage },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Save a location for a user
router.post('/saveLocation/:locationId', async (req, res) => {
  const { locationId } = req.params;
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.savedLocations.includes(locationId)) {
      return res.status(400).json({ message: "Location already saved" });
    }
    user.savedLocations.push(locationId);
    await user.save();
    res.status(200).json({ message: "Location saved successfully" });
  } catch (error) {
    console.error('Error saving location:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Unsave a location for a user
router.post('/unsaveLocation/:locationId', async (req, res) => {
  const { locationId } = req.params;
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    user.savedLocations = user.savedLocations.filter(id => id.toString() !== locationId);
    await user.save();
    res.status(200).json({ message: "Location unsaved successfully" });
  } catch (error) {
    console.error('Error unsaving location:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get saved locations for a user
router.get('/savedLocations/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate('savedLocations');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user.savedLocations);
  } catch (error) {
    console.error('Error fetching saved locations:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Save/unsave locations by userId (alternative way)
router.put('/saveLocation/:userId', async (req, res) => {
  const { locationId } = req.body;
  if (!locationId) return res.status(400).json({ message: 'Missing locationId' });
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.savedLocations) user.savedLocations = [];

    if (user.savedLocations.includes(locationId)) {
      user.savedLocations = user.savedLocations.filter(id => id.toString() !== locationId.toString());
    } else {
      user.savedLocations.push(locationId);
    }

    await user.save();
    res.json({ message: 'Location saved/unsaved successfully', savedLocations: user.savedLocations });
  } catch (error) {
    console.error('Error saving/unsaving location:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Unsave location by userId
router.put('/unsaveLocation/:userId', async (req, res) => {
  try {
    const { locationId } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.savedLocations = user.savedLocations.filter(id => id.toString() !== locationId);
    await user.save();
    res.status(200).json({ message: 'Location unsaved successfully' });
  } catch (err) {
    console.error('Error unsaving location:', err);
    res.status(500).json({ message: 'Error unsaving location' });
  }
});

// ✅ Delete a user by username
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

// ✅ Get user by ID (⚠️ KEEP THIS LAST)
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.savedLocations && user.savedLocations.length > 0) {
      const existingLocations = await Location.find({
        _id: { $in: user.savedLocations }
      }).select('_id');
      const existingLocationIds = existingLocations.map(loc => loc._id.toString());
      user.savedLocations = user.savedLocations.filter(id => existingLocationIds.includes(id.toString()));
      await User.findByIdAndUpdate(req.params.userId, { savedLocations: user.savedLocations });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
