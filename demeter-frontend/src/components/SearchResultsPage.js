import backendURL from '../apiConfig';
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResultsPage = () => {
  const query = useQuery();
  const searchTerm = query.get('q') || '';
  const [results, setResults] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});

  useEffect(() => {
    if (searchTerm.trim()) {
      axios
        .get(`${backendURL}/api/locations/search?q=${encodeURIComponent(searchTerm)}`)
        .then((res) => {
          setResults(res.data);
          fetchAverageRatings(res.data);
        })
        .catch((err) => console.error('Search error:', err));
    }
  }, [searchTerm]);

  const fetchAverageRatings = async (locations) => {
    try {
      const ratings = {};

      for (const location of locations) {
        const response = await axios.get(`${backendURL}/api/reviews/location/${location._id}`);
        const reviews = response.data;

        if (reviews.length > 0) {
          const total = reviews.reduce((sum, review) => sum + review.rating, 0);
          const average = total / reviews.length;
          ratings[location._id] = average;
        } else {
          ratings[location._id] = null; // No reviews yet
        }
      }

      setAverageRatings(ratings);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

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

  return (
    <div className="min-h-screen px-4 py-10 bg-inherit font-inknut text-brunswick flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-center">Search Results for "{searchTerm}"</h1>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
          {results.map((location) => (
            <div key={location._id} className="bg-alabaster rounded-lg shadow-md p-6 transform hover:scale-105 transition duration-300 ease-in-out">
              <Link to={`/locations/${location._id}`}>
                <h2 className="text-2xl font-bold text-fern hover:text-hunter text-center mb-2">
                  {location.locationName}
                </h2>

                <div className="flex justify-center items-center mb-4">
                  {averageRatings[location._id] !== undefined && averageRatings[location._id] !== null ? (
                    renderStars(averageRatings[location._id])
                  ) : (
                    <p className="italic text-hunter text-sm">Not yet rated</p>
                  )}
                </div>
              </Link>
              
              <p className="text-sm text-center mb-1 text-hunter mt-1">Created by: {location.username}</p>
              <p className="text-sm text-center mb-1"><strong>Type:</strong> {location.locationType}</p>
              <p className="text-sm text-center mb-1"><strong>Address:</strong> {location.address}</p>
              <p className="text-sm text-center">{location.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl mt-10">No matching locations found.</p>
      )}
    </div>
  );
};

export default SearchResultsPage;
