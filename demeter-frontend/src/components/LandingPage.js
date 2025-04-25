import backendURL from '../apiConfig';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const [recentLocations, setRecentLocations] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
        setUser(null);
      }
    }

    
    axios.get(`${backendURL}/api/locations/recent`)
      .then(response => setRecentLocations(response.data))
      .catch(error => console.error('Error fetching recent locations:', error));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center font-inknut bg-sage text-brunswick px-4 py-10">
      <h1 className="text-4xl font-bold mb-6">
        Welcome to Demeter{user ? `, ${user.username}` : ''}!
      </h1>
      <p className="text-xl mb-8">We’re here to help you get you off the computer 🌎</p>

      {/* Recent Locations */}
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Recent Locations</h2>
        {recentLocations.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {recentLocations.map((location, index) => (
              <div key={index} className="p-4 border rounded-lg bg-alabaster">
                <Link to={`/locations/${location._id}`}>
                  <h3 className="text-lg font-bold text-fern hover:text-hunter">
                    {location.locationName}
                  </h3>
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
