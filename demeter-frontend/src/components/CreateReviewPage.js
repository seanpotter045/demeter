import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateReviewPage = () => {
  const { id } = useParams(); // Get the location ID from the URL
  const [rating, setRating] = useState('');
  const [description, setDescription] = useState('');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const reviewData = {
            locationId: id,
            rating,
            description,
            username: user.username,
        };

        console.log('Submitting review:', reviewData);

        // Ensure the method is POST
        const response = await axios.post(`http://localhost:8081/api/reviews/locations/${id}/review`, reviewData);

        console.log('Review created:', response.data);

        // Redirect back to the location page after submission
        navigate(`/locations/${id}`);

    } catch (error) {
        console.error('Error submitting review:', error);
        setError('Error submitting review');
    }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Write a Review</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <div className="mb-4">
          <label className="block font-semibold">Rating (1-5):</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Review:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Submit Review
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default CreateReviewPage;
