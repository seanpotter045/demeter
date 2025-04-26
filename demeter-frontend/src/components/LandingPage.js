import backendURL from '../apiConfig';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const [recentLocations, setRecentLocations] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
        setUser(null);
      }
    }

    // Fetch recent locations
    axios.get(`${backendURL}/api/locations/recent`)
      .then(async (response) => {
        const locations = response.data;

        // Fetch reviews for each location to calculate average rating
        const locationsWithRatings = await Promise.all(
          locations.map(async (location) => {
            try {
              const reviewsRes = await axios.get(`${backendURL}/api/reviews/location/${location._id}`);
              const reviews = reviewsRes.data;

              let averageRating = null;
              if (reviews.length > 0) {
                const total = reviews.reduce((sum, review) => sum + review.rating, 0);
                averageRating = total / reviews.length;
              }

              return { ...location, averageRating };
            } catch (err) {
              console.error('Error fetching reviews for location', location._id, err);
              return { ...location, averageRating: null };
            }
          })
        );

        setRecentLocations(locationsWithRatings);
      })
      .catch(error => console.error('Error fetching recent locations:', error));
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating); // full stars only
    for (let i = 0; i < 5; i++) {
      if (i < roundedRating) {
        stars.push(<span key={i} className="text-fern text-xl">★</span>);
      } else {
        stars.push(<span key={i} className="text-fern text-xl">☆</span>);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen flex flex-col items-center font-inknut bg-sage text-brunswick px-4 py-10">
      <h1 className="text-4xl font-bold mb-6">
        Welcome to Demeter{user ? `, ${user.username}` : ''}!
      </h1>
      <p className="text-xl mb-8">We’re here to help you get off the computer 🌎</p>

      {/* Recent Locations */}
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recent Locations</h2>

          {/* NEW "View All Locations" Button */}
          <Link
            to="/allLocations" // <-- make sure you add a route to this page!
            className="bg-fern hover:bg-hunter text-alabaster px-4 py-2 rounded font-semibold transition"
          >
            View All
          </Link>
        </div>

        {recentLocations.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {recentLocations.map((location, index) => (
              <div key={index} className="p-4 border rounded-lg bg-alabaster">
                <Link to={`/locations/${location._id}`}>
                  <h3 className="text-lg font-bold text-fern hover:text-hunter">
                    {location.locationName}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">Created by: {location.username}</p>
                <p className="text-sm">Type: {location.locationType}</p>
                <p className="text-sm">Address: {location.address}</p>
                <p className="text-sm">Description: {location.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No recent locations found.</p>
        )}
      </div>
    </div>
  );
}
