const express = require('express');
const router = express.Router();
const Location = require('../models/locationModel');

// ✅ Create a location
router.post('/', async (req, res) => {
  const { locationName, locationType, address, username, description } = req.body;
  
  try {
    const existingLocation = await Location.findOne({ locationName });
    if (existingLocation) {
      return res.status(400).send({ message: "Location already exists" });
    }

    const newLocation = new Location({ locationName, username, locationType, address, description });
    await newLocation.save();

    res.status(201).send({ message: "Location created successfully" });
  } catch (err) {
    console.error('Error creating location:', err);
    res.status(500).send({ message: 'Error creating location' });
  }
});

router.get('/recent', async (req, res) => {
    try {
        const locations = await Location.find().sort({ createdAt: -1 }).limit(5);
        res.json(locations);
    } catch (error) {
        console.error('Error fetching recent locations:', error);
        res.status(500).json({ message: 'Error fetching locations' });
    }
});

// ✅ Search locations
router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ message: 'Missing search query' });

  try {
    const regex = new RegExp(query, 'i');
    const results = await Location.find({
      $or: [
        { locationName: { $regex: regex } },
        { locationType: { $regex: regex } }
      ]
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// ✅ Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get a location by ID
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ error: "Location not found" });
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update a location by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedLocation = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLocation) return res.status(404).json({ error: "Location not found" });
    res.status(200).json(updatedLocation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Delete a location by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedLocation = await Location.findByIdAndDelete(req.params.id);
    if (!deletedLocation) return res.status(404).json({ error: "Location not found" });
    res.status(200).json({ message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
