import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import backendURL from '../apiConfig';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [locations, setLocations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [savedLocations, setSavedLocations] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});
  const [savedRatings, setSavedRatings] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Fetch all locations
      axios.get(`${backendURL}/api/locations`)
        .then(res => {
          const userLocations = res.data.filter(location => location.username === parsedUser.username);
          setLocations(userLocations);

          axios.get(`${backendURL}/api/reviews`)
            .then(revRes => {
              const reviews = revRes.data;
              const ratingsMap = {};
              userLocations.forEach((loc) => {
                const locationReviews = reviews.filter(r => r.locationId === loc._id);
                if (locationReviews.length > 0) {
                  const total = locationReviews.reduce((sum, r) => sum + r.rating, 0);
                  ratingsMap[loc._id] = total / locationReviews.length;
                } else {
                  ratingsMap[loc._id] = null;
                }
              });
              setAverageRatings(ratingsMap);
            })
            .catch(err => console.error('Error fetching reviews:', err));
        })
        .catch(err => {
          console.error('Error fetching locations:', err);
          setError('Failed to load locations.');
        });

      // Fetch user's reviews
      axios.get(`${backendURL}/api/reviews`)
        .then(res => {
          const userReviews = res.data.filter(review => review.username === parsedUser.username);
          setReviews(userReviews);
        })
        .catch(err => console.error('Error fetching reviews:', err));

      // Fetch saved locations
      axios.get(`${backendURL}/api/users/${parsedUser._id}`)
        .then(res => {
          const savedIds = res.data.savedLocations || [];
          Promise.all(savedIds.map(id => 
            axios.get(`${backendURL}/api/locations/${id}`).then(r => r.data).catch(() => null)
          ))
          .then(fullLocations => {
            const validLocations = fullLocations.filter(loc => loc !== null);
            setSavedLocations(validLocations);

            axios.get(`${backendURL}/api/reviews`)
              .then(revRes => {
                const reviews = revRes.data;
                const savedRatingsMap = {};
                validLocations.forEach((loc) => {
                  const locationReviews = reviews.filter(r => r.locationId === loc._id);
                  if (locationReviews.length > 0) {
                    const total = locationReviews.reduce((sum, r) => sum + r.rating, 0);
                    savedRatingsMap[loc._id] = total / locationReviews.length;
                  } else {
                    savedRatingsMap[loc._id] = null;
                  }
                });
                setSavedRatings(savedRatingsMap);
              });
          });
        })
        .catch(err => console.error('Error fetching user saved locations:', err));
    }
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const rounded = Math.round(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className="text-hunter text-xl">
          {i < rounded ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  const renderLocationCard = (location, rating) => (
    <div key={location._id} className="flex-shrink-0 w-80 bg-alabaster rounded-lg shadow-md overflow-hidden mr-6 transform hover:scale-105 transition duration-300 ease-in-out">
      <Link to={`/locations/${location._id}`} className="flex flex-col h-full">
        {location.imageUrl && (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={location.imageUrl}
              alt="Location"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6 flex flex-col items-center flex-1">
          <h2 className="text-2xl font-bold text-fern hover:text-hunter text-center mb-2">
            {location.locationName}
          </h2>
          <div className="flex justify-center items-center mb-4">
            {rating !== undefined && rating !== null ? (
              renderStars(rating)
            ) : (
              <p className="italic text-hunter text-sm">Not yet rated</p>
            )}
          </div>
          <p className="text-sm text-center mb-1 text-hunter"><strong>Type:</strong> {location.locationType}</p>
          <p className="text-sm text-center mb-1"><strong>Address:</strong> {location.address}</p>
          <p className="text-sm text-center">{location.description}</p>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 px-4 flex flex-col items-center bg-inherit font-inknut text-brunswick">
      <h1 className="text-4xl font-bold mb-8">My Locations</h1>

      {error && <p className="text-imperial mb-6">{error}</p>}

      {/* Created Locations */}
      {locations.length > 0 ? (
        <div className="w-full max-w-6xl overflow-x-auto">
          <div className="flex space-x-6 py-4">
            {locations.map(loc => renderLocationCard(loc, averageRatings[loc._id]))}
          </div>
        </div>
      ) : (
        <p>No locations created yet.</p>
      )}

      {/* My Reviews */}
      <h1 className="text-4xl font-bold my-12">My Reviews</h1>

      {reviews.length > 0 ? (
        <div className="w-full max-w-6xl overflow-x-auto">
          <div className="flex space-x-6 py-4">
            {reviews.map((review) => (
              <div key={review._id} className="flex-shrink-0 w-80 bg-alabaster rounded-lg shadow-md p-6 mr-6 transform hover:scale-105 transition duration-300 ease-in-out">
                <Link to={`/locations/${review.locationId}`}>
                  <h2 className="text-2xl font-bold text-fern hover:text-hunter mb-2 text-center">
                    {review.locationName}
                  </h2>
                  <div className="flex justify-center items-center mb-4">
                    {renderStars(review.rating)}
                  </div>
                </Link>
                <p className="text-sm text-center">{review.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No reviews submitted yet.</p>
      )}

      {/* Saved Locations */}
      <h1 className="text-4xl font-bold my-12">Saved Locations</h1>

      {savedLocations.length > 0 ? (
        <div className="w-full max-w-6xl overflow-x-auto">
          <div className="flex space-x-6 py-4">
            {savedLocations.map(loc => renderLocationCard(loc, savedRatings[loc._id]))}
          </div>
        </div>
      ) : (
        <p>No saved locations yet.</p>
      )}
    </div>
  );
}
