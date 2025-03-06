import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateLocationPage = () => {
  const [locationName, setLocationName] = useState('');
  const [locationType, setLocationType] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const locationData = {
        locationName,
        locationType,
        address,
        description,
        username: user.username,
      };

      console.log("Sending location data:", locationData);

      const response = await axios.post('http://localhost:8081/api/locations/createLocation', locationData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Location created:', response.data);

      // Redirect to landing page after successful submission
      navigate('/landingPage');

    } catch (error) {
      console.error('Error creating location:', error);
      setError('Error creating location');
    }
  };

  return (
    <div>
      <h1>Create New Location</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Location Name:</label>
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
          />
        </div>
        <div>
          <label>Location Type:</label>
          <input
            type="text"
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)}
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Create Location</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default CreateLocationPage;
