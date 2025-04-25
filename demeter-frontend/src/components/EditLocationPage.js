import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import backendURL from '../apiConfig'; // ✅

const EditLocationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [locationName, setLocationName] = useState('');
  const [locationType, setLocationType] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch existing location data to prefill the form
    axios.get(`${backendURL}/api/locations/${id}`)
      .then(response => {
        const loc = response.data;
        setLocationName(loc.locationName);
        setLocationType(loc.locationType);
        setAddress(loc.address);
        setDescription(loc.description);
      })
      .catch(error => {
        console.error('Error loading location:', error);
        setError('Error loading location details.');
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedLocation = {
        locationName,
        locationType,
        address,
        description,
      };

      await axios.put(`${backendURL}/api/locations/${id}`, updatedLocation, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      navigate(`/locations/${id}`); // Redirect back to the location page
    } catch (error) {
      console.error('Error updating location:', error);
      setError('Failed to update location.');
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
        <h1 className="text-3xl font-bold mb-8 text-center">Edit Location</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location Name */}
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-1 font-semibold" htmlFor="locationName">Location Name</label>
            <input
              id="locationName"
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full px-4 py-2 bg-alabaster border border-alabaster rounded focus:outline-none focus:ring-2 focus:ring-fern"
              required
            />
          </div>

          {/* Location Type */}
          <div>
            <label className="block mb-1 font-semibold" htmlFor="locationType">Location Type</label>
            <select
              id="locationType"
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
              className="w-full px-4 py-2 bg-alabaster border border-alabaster rounded focus:outline-none focus:ring-2 focus:ring-fern appearance-none"
              required
            >
              <option value="" disabled>Select a type:</option>
              <option value="Park">Park</option>
              <option value="Landmark">Landmark</option>
              <option value="Hiking Trail">Hiking Trail</option>
              <option value="Beach">Beach</option>
              <option value="Garden">Garden</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1 font-semibold" htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 bg-alabaster border border-alabaster rounded focus:outline-none focus:ring-2 focus:ring-fern"
              required
            />
          </div>

          {/* Description */}
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-1 font-semibold" htmlFor="description">Description</label>
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
          <div className="col-span-1 md:col-span-2 text-center">
            <button
              type="submit"
              className="bg-fern hover:bg-hunter text-alabaster px-6 py-3 rounded font-semibold transition"
            >
              Save Changes
            </button>
          </div>
        </form>

        {error && <p className="text-imperial mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default EditLocationPage;
