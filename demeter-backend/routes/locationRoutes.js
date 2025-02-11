const express = require('express');
const router = express.Router();
const Location = require('../models/locationModel');

// Create a new location
router.post('/createLocation', async (req, res) => {
    try {
        const location = new Location(req.body);
        await location.save();
        res.status(201).json(location);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all locations
router.get('/locations', async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a location by ID
router.get('/locations/:id', async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) return res.status(404).json({ error: "Location not found" });
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a location by ID
router.put('/locations/:id', async (req, res) => {
    try {
        const updatedLocation = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedLocation) return res.status(404).json({ error: "Location not found" });
        res.status(200).json(updatedLocation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a location by ID
router.delete('/locations/:id', async (req, res) => {
    try {
        const deletedLocation = await Location.findByIdAndDelete(req.params.id);
        if (!deletedLocation) return res.status(404).json({ error: "Location not found" });
        res.status(200).json({ message: "Location deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
