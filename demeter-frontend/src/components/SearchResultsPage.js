import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResultsPage = () => {
  const query = useQuery();
  const searchTerm = query.get('q') || '';
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (searchTerm.trim()) {
      axios
        .get(`http://localhost:8081/api/locations/search?q=${encodeURIComponent(searchTerm)}`)
        .then((res) => setResults(res.data))
        .catch((err) => console.error('Search error:', err));
    }
  }, [searchTerm]);

  return (
    <div className="min-h-screen px-4 py-10 bg-inherit font-inknut text-brunswick">
      <h1 className="text-3xl font-bold mb-4">Search Results for "{searchTerm}"</h1>
      {results.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
          {results.map((location) => (
            <div key={location._id} className="p-4 bg-alabaster rounded-lg shadow">
              <Link to={`/locations/${location._id}`}>
                <h2 className="text-xl font-bold text-fern hover:text-hunter">
                  {location.locationName}
                </h2>
              </Link>
              <p className="text-sm">{location.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No matching locations found.</p>
      )}
    </div>
  );
};

export default SearchResultsPage;
