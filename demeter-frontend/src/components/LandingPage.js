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
        <h2 className="text-2xl font-semibold mb-4">Recent Locations</h2>
        {recentLocations.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {recentLocations.map((location, index) => (
              <div key={index} className="p-4 border rounded-lg bg-alabaster shadow-md">
                <div className="flex items-center justify-between">
                  <Link to={`/locations/${location._id}`}>
                    <h3 className="text-lg font-bold text-fern hover:text-hunter">{location.locationName}</h3>
                  </Link>
                  <div className="flex ml-4">
                    {location.averageRating !== null ? (
                      renderStars(location.averageRating)
                    ) : (
                      <p className="italic text-hunter text-sm ml-2">Not yet rated</p>
                    )}
                  </div>
                </div>
              
                <p className="text-sm text-hunter mt-1">Created by: {location.username}</p>
                <p className="text-sm"><strong>Type:</strong> {location.locationType}</p>
                <p className="text-sm"><strong>Address:</strong> {location.address}</p>
                <p className="text-sm">{location.description}</p>
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
