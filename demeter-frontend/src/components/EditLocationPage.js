import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import backendURL from '../apiConfig';

const EditLocationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [locationName, setLocationName] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [locationType, setLocationType] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${backendURL}/api/locations/${id}`)
    .then(response => {
      const loc = response.data;
      setLocationName(loc.locationName);
      setLocationType(loc.locationType);
      setAddress(loc.address);
      setDescription(loc.description);
      setCurrentImageUrl(loc.imageUrl); // Save existing image URL
    })
    .catch(error => {
      console.error('Error loading location:', error);
      setError('Error loading location details.');
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!file && !currentImageUrl) {
      setError('Please upload a photo for the location.');
      return;
    }
  
    try {
      let imageUrl = currentImageUrl; // Default to the existing image
  
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadResponse = await axios.post(`${backendURL}/api/upload`, formData);
        imageUrl = uploadResponse.data.url;
      }
  
      const updatedLocation = {
        locationName,
        locationType,
        address,
        description,
        imageUrl, // Always include imageUrl
      };
  
      await axios.put(`${backendURL}/api/locations/${id}`, updatedLocation, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      navigate(`/locations/${id}`);
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

          {/* Image Upload */}
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-1 font-semibold" htmlFor="photo">Upload New Photo</label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="photo" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-alabaster hover:bg-gray-100 transition">
                {file ? (
                  <p className="text-brunswick">{file.name}</p>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-brunswick" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16v-4a4 4 0 018 0v4m-5-1h.01M12 17h.01M12 20h.01M12 23h.01M12 26h.01M12 29h.01"></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG (max 10MB)</p>
                  </div>
                )}
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            </div>
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
