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
  const [sortOption, setSortOption] = useState('date');
  const [hideMyLocations, setHideMyLocations] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (searchTerm.trim()) {
      axios
        .get(`${backendURL}/api/locations/search?q=${encodeURIComponent(searchTerm)}`)
        .then((res) => {
          const fetchedResults = res.data;
          setResults(fetchedResults);
          fetchAverageRatings(fetchedResults);
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
          ratings[location._id] = null;
        }
      }
      setAverageRatings(ratings);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const toggleHideMyLocations = () => {
    setHideMyLocations(!hideMyLocations);
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

  let filteredResults = [...results];

  if (hideMyLocations && user) {
    filteredResults = filteredResults.filter(location => location.username !== user.username);
  }

  if (sortOption === 'alphabetical') {
    filteredResults.sort((a, b) => a.locationName.localeCompare(b.locationName));
  } else if (sortOption === 'date') {
    filteredResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-inherit font-inknut text-brunswick flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-center">Search Results for "{searchTerm}"</h1>

      {/* Filters Section */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="bg-fern text-alabaster px-4 py-2 rounded font-semibold transition hover:bg-hunter"
        >
          <option value="date">Sort by Date (Newest First)</option>
          <option value="alphabetical">Sort A-Z</option>
        </select>

        {user && (
          <button
            onClick={toggleHideMyLocations}
            className="bg-fern hover:bg-hunter text-alabaster px-4 py-2 rounded font-semibold transition"
          >
            {hideMyLocations ? 'Show My Locations' : 'Hide My Locations'}
          </button>
        )}

        <div className="text-sm text-hunter font-semibold">
          Showing {filteredResults.length} {filteredResults.length === 1 ? 'location' : 'locations'}
        </div>
      </div>

      {filteredResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
          {filteredResults.map((location) => (
            <div key={location._id} className="bg-alabaster rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out flex flex-col">
              <Link to={`/locations/${location._id}`} className="flex-1 flex flex-col">
                {location.imageUrl ? (
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={location.imageUrl}
                      alt="Location"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}

                <div className={`p-6 flex flex-col items-center ${!location.imageUrl ? 'justify-center flex-1' : ''}`}>
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

                  <p className="text-sm text-center mb-1 text-hunter">Created by: {location.username}</p>
                  <p className="text-sm text-center mb-1"><strong>Type:</strong> {location.locationType}</p>
                  <p className="text-sm text-center mb-1"><strong>Address:</strong> {location.address}</p>
                  <p className="text-sm text-center">{location.description}</p>
                </div>
              </Link>
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