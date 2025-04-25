import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import backendURL from '../apiConfig';

export default function EditReviewPage() {
  const { id } = useParams(); // Review ID
  const navigate = useNavigate();
  const [rating, setRating] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${backendURL}/api/reviews/${id}`)
      .then((res) => {
        setRating(res.data.rating);
        setDescription(res.data.description);
      })
      .catch((err) => {
        console.error('Error fetching review:', err);
        setError('Error loading review.');
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${backendURL}/api/reviews/${id}`, { rating, description });
      navigate(-1); // Go back to location page
    } catch (err) {
      console.error('Error updating review:', err);
      setError('Failed to update review.');
    }
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-inherit text-brunswick font-inknut">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 ml-2 bg-fern hover:bg-hunter text-alabaster px-4 py-2 rounded font-semibold transition"
      >
        Go Back
      </button>

      <div className="max-w-2xl mx-auto bg-asparagus rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Edit Review</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-semibold">Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-4 py-2 bg-alabaster border border-alabaster rounded focus:outline-none focus:ring-2 focus:ring-fern"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Review Description</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-alabaster border border-alabaster rounded focus:outline-none focus:ring-2 focus:ring-fern"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-fern hover:bg-hunter text-alabaster px-6 py-3 rounded font-semibold transition"
          >
            Save Changes
          </button>
        </form>

        {error && <p className="text-imperial mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
