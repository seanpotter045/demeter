import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import backendURL from '../apiConfig';

export default function LocationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [isSaved, setIsSaved] = useState(false); // NEW: save status

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Check if saved
      axios.get(`${backendURL}/api/users/${parsedUser._id}`)
        .then(res => {
          const saved = res.data.savedLocations?.includes(id);
          setIsSaved(saved);
        })
        .catch(err => console.error('Error checking saved locations:', err));
    }

    axios.get(`${backendURL}/api/locations/${id}`)
      .then(response => setLocation(response.data))
      .catch(error => console.error('Error fetching location details:', error));

    axios.get(`${backendURL}/api/reviews/location/${id}`)
      .then(response => {
        setReviews(response.data);

        if (response.data.length > 0) {
          const total = response.data.reduce((sum, review) => sum + review.rating, 0);
          const average = total / response.data.length;
          setAverageRating(average);
        } else {
          setAverageRating(null);
        }
      })
      .catch(error => console.error('Error fetching reviews:', error));
  }, [id]);

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating);
    for (let i = 0; i < 5; i++) {
      if (i < roundedRating) {
        stars.push(<span key={i} className="text-hunter text-2xl">★</span>);
      } else {
        stars.push(<span key={i} className="text-hunter text-2xl">☆</span>);
      }
    }
    return stars;
  };

  const handleToggleSave = async () => {
    if (!user) {
      alert('You must be logged in to save locations.');
      return;
    }

    try {
      if (isSaved) {
        await axios.put(`${backendURL}/api/users/unsaveLocation/${user._id}`, { locationId: id });
        setIsSaved(false);
      } else {
        await axios.put(`${backendURL}/api/users/saveLocation/${user._id}`, { locationId: id });
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving/unsaving location:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`${backendURL}/api/reviews/${reviewId}`);
        navigate(0); // Reload to update reviews and average
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 flex flex-col items-center bg-inherit font-inknut text-brunswick">
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-32 left-4 bg-fern hover:bg-hunter text-alabaster px-4 py-2 rounded font-semibold transition"
      >
        Go Back
      </button>

      {location ? (
        <>
          {/* Location Name + Save/Unsave Button */}
          <div className="flex items-center justify-center mt-8 mb-4 space-x-4">
            <h1 className="text-4xl font-bold text-center">{location.locationName}</h1>
            {user && user.username !== location.username && (
              <button onClick={handleToggleSave} className="focus:outline-none">
                <img
                  src={isSaved ? "/SavedIcon.png" : "/NotSavedIcon.png"}
                  alt={isSaved ? "Saved" : "Not Saved"}
                  className="w-10 h-10"
                />
              </button>
            )}
          </div>

          {/* Average Rating */}
          <div className="mt-2 mb-6 flex justify-center">
            {averageRating ? (
              <div className="flex">
                {renderStars(averageRating)}
              </div>
            ) : (
              <p className="italic text-brunswick text-center mt-2">Not yet rated</p>
            )}
          </div>

          {/* Location Info */}
          <p className="mb-2 text-lg text-center"><strong>Created by:</strong> {location.username}</p>
          <p className="mb-2 text-lg text-center"><strong>Type:</strong> {location.locationType}</p>
          <p className="mb-2 text-lg text-center"><strong>Address:</strong> {location.address}</p>
          <p className="mb-6 text-center">{location.description}</p>

          {/* Edit / Delete if user created it */}
          {user && location.username === user.username && (
            <div className="flex space-x-4 mt-2 mb-8">
              <Link
                to={`/editLocation/${id}`}
                className="bg-fern hover:bg-hunter text-alabaster px-4 py-2 rounded font-semibold transition"
              >
                Edit Location
              </Link>
              <button
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this location?')) {
                    try {
                      await axios.delete(`${backendURL}/api/locations/${id}`);
                      navigate('/landingPage');
                    } catch (error) {
                      console.error('Error deleting location:', error);
                    }
                  }
                }}
                className="bg-imperial hover:bg-red-700 text-alabaster px-4 py-2 rounded font-semibold transition"
              >
                Delete Location
              </button>
            </div>
          )}

          {/* Reviews */}
          <div className="mt-8 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Reviews</h2>
              {user && location.username !== user.username && (
                <Link
                  to={`/createReview/${id}`}
                  className="bg-fern hover:bg-sage text-alabaster px-4 py-2 rounded font-semibold transition"
                >
                  Write a Review
                </Link>
              )}
            </div>

            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="p-4 border rounded-lg bg-alabaster shadow-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p><strong>{review.username}</strong> - Rating: {review.rating}</p>

                    {user && user.username === review.username && (
                      <div className="flex space-x-2">
                        <Link
                          to={`/editReview/${review._id}`}
                          className="bg-fern hover:bg-hunter text-alabaster px-2 py-1 rounded font-semibold text-xs transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="bg-imperial hover:bg-red-700 text-alabaster px-2 py-1 rounded font-semibold text-xs transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <p>{review.description}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading location details...</p>
      )}
    </div>
  );
}
