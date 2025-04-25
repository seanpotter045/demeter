import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import backendURL from '../apiConfig'; // ✅

export default function LocationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [location, setLocation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${backendURL}/api/locations/${id}`)
      .then(response => setLocation(response.data))
      .catch(error => {
        console.error('Error fetching location details:', error);
        setError('Error loading location details.');
      });

    axios.get(`${backendURL}/api/reviews/location/${id}`)
      .then(response => setReviews(response.data))
      .catch(error => {
        console.error('Error fetching reviews:', error);
      });
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this location? This action cannot be undone.')) {
      try {
        await axios.delete(`${backendURL}/api/locations/${id}`);
        navigate('/landingPage'); // Redirect to landing page after deletion
      } catch (error) {
        console.error('Error deleting location:', error);
        setError('Failed to delete location.');
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center font-inknut text-brunswick bg-sage">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen flex items-center justify-center font-inknut text-brunswick bg-sage">
        <p className="text-xl">Loading location details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 flex flex-col items-center bg-inherit font-inknut text-brunswick">
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-32 left-4 bg-fern text-alabaster px-4 py-2 rounded font-semibold hover:bg-hunter transition"
      >
        Go Back
      </button>

      {/* Location Details */}
      <h1 className="text-4xl font-bold mb-6 mt-8">{location.locationName}</h1>
      <p>{location.description}</p>
      <p><strong>Address:</strong> {location.address}</p>
      <p><strong>Type:</strong> {location.locationType}</p>

      {/* Owner Options */}
      {user && user.username === location.username && (
        <div className="flex space-x-4 mt-6">
          <Link
            to={`/editLocation/${id}`}
            className="bg-fern hover:bg-hunter text-alabaster px-4 py-2 rounded font-semibold transition"
          >
            Edit Location
          </Link>
          <button
            onClick={handleDelete}
            className="bg-imperial hover:bg-red-700 text-alabaster px-4 py-2 rounded font-semibold transition"
          >
            Delete Location
          </button>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-10 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Reviews</h2>
          <Link
            to={`/createReview/${id}`}
            className="bg-fern hover:bg-sage text-alabaster px-4 py-2 rounded font-semibold transition"
          >
            Write a Review
          </Link>
        </div>

        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="p-4 border rounded-lg bg-alabaster shadow-lg mb-4">
              <p><strong>{review.username}</strong> - Rating: {review.rating}</p>
              <p>{review.description}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
