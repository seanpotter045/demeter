import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // Import useParams to get the dynamic id from the URL
import axios from 'axios';

export default function LocationPage() {
  const { id } = useParams();  // Grab the location ID from the URL
  const [location, setLocation] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch location details by ID
    axios.get(`http://localhost:8081/api/locations/${id}`)
      .then(response => setLocation(response.data))
      .catch(error => console.error('Error fetching location details:', error));

    // Fetch reviews for this location
    axios.get(`http://localhost:8081/api/reviews/location/${id}`)
      .then(response => setReviews(response.data))
      .catch(error => console.error('Error fetching reviews:', error));
  }, [id]);  // Runs when the id changes

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {location ? (
        <>
          <h1 className="text-4xl font-bold mb-6">{location.locationName}</h1>
          <p>{location.description}</p>
          <p><strong>Address:</strong> {location.address}</p>

          <div className="mt-8 w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
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
