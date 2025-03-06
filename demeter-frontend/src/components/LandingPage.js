import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';  // Import Link
import axios from 'axios';

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const [recentLocations, setRecentLocations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }

    // Fetch recent locations
    axios.get('http://localhost:8081/api/locations/recent')
      .then(response => setRecentLocations(response.data))
      .catch(error => console.error('Error fetching recent locations:', error));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleCreateLocation = () => {
    navigate('/create-location', { state: { username: user?.username } });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-4xl font-bold mb-6">
        Welcome to Demeter, {user ? user.username : 'Loading...'}
      </h1>
      <p>Would you like to create a location?</p>

      {user ? (
        <>
          <button
            onClick={handleCreateLocation}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mt-4"
          >
            Create Location
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition mt-4 ml-4"
          >
            Log Out
          </button>
        </>
      ) : (
        <p>No user data found</p>
      )}

      {/* Recent Locations */}
      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Recent Locations</h2>
        {recentLocations.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {recentLocations.map((location, index) => (
              <div key={index} className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-lg">
                <Link to={`/locations/${location._id}`}>
                  <h3 className="text-lg font-bold text-blue-600 hover:text-blue-800">{location.locationName}</h3>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">Created by: {location.username}</p>
                <p className="text-sm">Type: {location.locationType}</p>
                <p className="text-sm">Address: {location.address}</p>
                <p className="text-sm">Description: {location.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No recent locations found.</p>
        )}
      </div>
    </div>
  );
}
