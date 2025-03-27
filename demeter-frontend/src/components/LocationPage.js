import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LocationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8081/api/locations/${id}`)
      .then(response => setLocation(response.data))
      .catch(error => console.error('Error fetching location details:', error));

    axios.get(`http://localhost:8081/api/reviews/location/${id}`)
      .then(response => setReviews(response.data))
      .catch(error => console.error('Error fetching reviews:', error));
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Go Back Button */}
      <button
        onClick={() => navigate('/landingPage')}
        className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Go Back
      </button>

      {location ? (
        <>
          <h1 className="text-4xl font-bold mb-6 mt-8">{location.locationName}</h1>
          <p>{location.description}</p>
          <p><strong>Address:</strong> {location.address}</p>

          <div className="mt-8 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Reviews</h2>
              <Link 
                to={`/createReview/${id}`} 
                className="text-blue-500 hover:underline text-lg"
              >
                Write a Review
              </Link>
            </div>
            
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-lg mb-4">
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
