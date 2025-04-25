import backendURL from '../apiConfig';
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LocationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null); // ✅ Load logged-in user

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    axios.get(`${backendURL}/api/locations/${id}`)
      .then(response => setLocation(response.data))
      .catch(error => console.error('Error fetching location details:', error));

    axios.get(`${backendURL}/api/reviews/location/${id}`)
      .then(response => setReviews(response.data))
      .catch(error => console.error('Error fetching reviews:', error));
  }, [id]);

  const handleEdit = () => {
    navigate(`/editLocation/${id}`); // 👈 we'll build this next if you want
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      try {
        await axios.delete(`${backendURL}/api/locations/${id}`);
        alert('Location deleted successfully');
        navigate('/landingPage');
      } catch (error) {
        console.error('Error deleting location:', error);
        alert('Failed to delete location.');
      }
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 flex flex-col items-center bg-inherit font-inknut text-brunswick">
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-32 left-4 bg-fern text-alabaster px-4 py-2 rounded font-semibold hover:bg-hunter transition"
      >
        Go Back
      </button>

      {location ? (
        <>
          <h1 className="text-4xl font-bold mb-6 mt-8">{location.locationName}</h1>
          <p>{location.description}</p>
          <p><strong>Address:</strong> {location.address}</p>

          {/* ✨ Edit / Delete Buttons */}
          {user && location.username === user.username && (
            <div className="flex space-x-4 my-6">
              <button
                onClick={handleEdit}
                className="bg-fern hover:bg-hunter text-alabaster px-4 py-2 rounded font-semibold transition"
              >
                Edit Location
              </button>
              <button
                onClick={handleDelete}
                className="bg-imperial hover:bg-red-700 text-alabaster px-4 py-2 rounded font-semibold transition"
              >
                Delete Location
              </button>
            </div>
          )}

          {/* Reviews Section */}
          <div className="mt-8 w-full max-w-2xl">
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
        </>
      ) : (
        <p>Loading location details...</p>
      )}
    </div>
  );
}
