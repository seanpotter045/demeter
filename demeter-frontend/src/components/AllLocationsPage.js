import backendURL from '../apiConfig';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AllLocationsPage() {
  const [locations, setLocations] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});
  const [sortOption, setSortOption] = useState('date');
  const [hideMyLocations, setHideMyLocations] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    axios.get(`${backendURL}/api/locations`)
      .then((res) => {
        let fetchedLocations = res.data;

        if (sortOption === 'alphabetical') {
          fetchedLocations.sort((a, b) => a.locationName.localeCompare(b.locationName));
        } else if (sortOption === 'date') {
          fetchedLocations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setLocations(fetchedLocations);

        axios.get(`${backendURL}/api/reviews`)
          .then((reviewRes) => {
            const reviews = reviewRes.data;
            const ratingsMap = {};

            fetchedLocations.forEach((loc) => {
              const locationReviews = reviews.filter(r => r.locationId === loc._id);
              if (locationReviews.length > 0) {
                const total = locationReviews.reduce((sum, r) => sum + r.rating, 0);
                ratingsMap[loc._id] = total / locationReviews.length;
              } else {
                ratingsMap[loc._id] = null;
              }
            });

            setAverageRatings(ratingsMap);
          })
          .catch((err) => console.error('Error fetching reviews:', err));
      })
      .catch((err) => console.error('Error fetching locations:', err));
  }, [sortOption]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const toggleHideMyLocations = () => {
    setHideMyLocations(!hideMyLocations);
  };

  const renderStars = (rating) => {
    const stars = [];
    const rounded = Math.round(rating);
    for (let i = 0; i < 5; i++) {
      if (i < rounded) {
        stars.push(<span key={i} className="text-hunter text-xl">★</span>);
      } else {
        stars.push(<span key={i} className="text-hunter text-xl">☆</span>);
      }
    }
    return stars;
  };

  const filteredLocations = hideMyLocations && user
    ? locations.filter(location => location.username !== user.username)
    : locations;

  return (
    <div className="min-h-screen px-4 py-10 bg-inherit font-inknut text-brunswick flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-fern hover:bg-hunter text-alabaster px-4 py-2 rounded font-semibold transition"
        >
          Go Back
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-8 text-center">All Locations</h1>

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
          Showing {filteredLocations.length} {filteredLocations.length === 1 ? 'location' : 'locations'}
        </div>
      </div>

      {filteredLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
          {filteredLocations.map((location) => (
            <div key={location._id} className="bg-alabaster rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out flex flex-col">
              <Link to={`/locations/${location._id}`} className="flex-1 flex flex-col">
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={location.imageUrl ? location.imageUrl : "/NoPictureAvailable.png"}
                  alt="Location"
                  className="w-full h-full object-cover"
                />
              </div>


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
        <p className="text-center text-xl mt-10">No locations found.</p>
      )}
    </div>
  );
}