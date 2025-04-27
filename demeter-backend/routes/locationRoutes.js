const express = require('express');
const router = express.Router();
const Location = require('../models/locationModel');

// ✅ Create a location
router.post('/', async (req, res) => {
  const { locationName, locationType, address, username, description, imageUrl } = req.body;

  try {
    const existingLocation = await Location.findOne({ locationName });
    if (existingLocation) {
      return res.status(400).send({ message: "Location already exists" });
    }

    const newLocation = new Location({
      locationName,
      username,
      locationType,
      address,
      description,
      imageUrl, // ✅ Now saving the uploaded S3 image URL too!
    });

    await newLocation.save();

    res.status(201).json(newLocation); // ✅ Send back the full created location, not just a message
  } catch (err) {
    console.error('Error creating location:', err);
    res.status(500).send({ message: 'Error creating location' });
  }
});

// ✅ Get 5 most recent locations
router.get('/recent', async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 }).limit(5);
    res.json(locations);
  } catch (error) {
    console.error('Error fetching recent locations:', error);
    res.status(500).json({ message: 'Error fetching locations' });
  }
});

// ✅ Search locations by name or type
router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ message: 'Missing search query' });

  try {
    const regex = new RegExp(query, 'i'); // Case-insensitive search
    const results = await Location.find({
      $or: [
        { locationName: { $regex: regex } },
        { locationType: { $regex: regex } }
      ]
    });

    res.json(results);
  } catch (err) {
    console.error('Error searching locations:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// ✅ Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching all locations:', error);
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
    console.error('Error fetching location by ID:', error);
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
    console.error('Error updating location:', error);
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
    console.error('Error deleting location:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
