import backendURL from '../apiConfig';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateReviewPage = () => {
  const { id } = useParams();
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

      const response = await axios.post(`${backendURL}/api/reviews/locations/${id}/review`, reviewData);

      console.log('Review created:', response.data);

      navigate(`/locations/${id}`);
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Error submitting review');
    }
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-inherit text-brunswick font-inknut">
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 ml-2 bg-fern hover:bg-hunter text-alabaster px-4 py-2 rounded font-semibold transition"
      >
        Go Back
      </button>

      <div className="max-w-2xl mx-auto bg-asparagus rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Write a Review</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          {/* Rating */}
          <div>
            <label htmlFor="rating" className="block mb-1 font-semibold">Rating (1-5)</label>
            <input
              id="rating"
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-4 py-2 bg-alabaster border border-alabaster rounded focus:outline-none focus:ring-2 focus:ring-fern"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-1 font-semibold">Review</label>
            <textarea
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-alabaster border border-alabaster rounded resize-none focus:outline-none focus:ring-2 focus:ring-fern"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-fern hover:bg-hunter text-alabaster px-6 py-3 rounded font-semibold transition"
            >
              Submit Review
            </button>
          </div>
        </form>

        {error && <p className="text-imperial mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default CreateReviewPage;
