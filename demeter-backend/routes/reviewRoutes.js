const express = require('express');
const router = express.Router();
const Review = require('../models/reviewModel');
const Location = require('../models/locationModel');

router.post('/createReview', async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/locations/:id/review', async (req, res) => {
    const { username, rating, description } = req.body;
    try {
        const location = await Location.findById(req.params.id);
        if (!location) {
            return res.status(404).json({ error: "Location not found" });
        }

        const newReview = new Review({
            locationName: location.locationName,
            username,
            rating,
            description,
            locationId: location._id,
        });

        await newReview.save();
        res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (error) {
        console.error('Error:', error); // Log error to understand the issue
        res.status(500).json({ error: error.message });
    }
});

// Get all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get reviews by location id
router.get('/location/:locationId', async (req, res) => {
    try {
        const reviews = await Review.find({ locationId: req.params.locationId });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a review by ID
router.get('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ error: "Review not found" });
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a review by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedReview) return res.status(404).json({ error: "Review not found" });
        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a review by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);
        if (!deletedReview) return res.status(404).json({ error: "Review not found" });
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
