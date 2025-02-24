import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // Parse the user data from localStorage
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
        setUser(null); // If error occurs, reset the user state
      }
    } else {
      setUser(null); // No user data in localStorage
    }
  }, []); // Run only on initial render

  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user data from localStorage
    setUser(null); // Reset user state
    navigate('/'); // Redirect to home or login page
  };

  const handleCreateLocation = () => {
    // Pass the logged-in user's username to the CreateLocationPage
    navigate('/create-location', { state: { username: user.username } });
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
    </div>
  );
}
