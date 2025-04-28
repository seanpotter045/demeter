import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backendURL from '../apiConfig';

export default function EditProfilePage() {
  const [user, setUser] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setNewUsername(parsedUser.username);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      let profilePictureUrl = user.profilePicture || '';
      let coverImageUrl = user.coverImage || '';

      // Upload new profile picture if selected
      if (profilePicture) {
        const formData = new FormData();
        formData.append('file', profilePicture);
        const uploadRes = await axios.post(`${backendURL}/api/upload`, formData);
        profilePictureUrl = uploadRes.data.url;
      }

      // Upload new cover image if selected
      if (coverImage) {
        const formData = new FormData();
        formData.append('file', coverImage);
        const uploadRes = await axios.post(`${backendURL}/api/upload`, formData);
        coverImageUrl = uploadRes.data.url;
      }

      // Update user info
      const response = await axios.put(`${backendURL}/api/users/${user._id}`, {
        username: newUsername,
        profilePicture: profilePictureUrl,
        coverImage: coverImageUrl,
      });

      // Update local storage
      const updatedUser = { ...user, username: newUsername, profilePicture: profilePictureUrl, coverImage: coverImageUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      navigate('/profile');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile.');
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
        <h1 className="text-3xl font-bold mb-8 text-center">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          {/* Username */}
          <div>
            <label className="block mb-1 font-semibold" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-4 py-2 bg-alabaster border border-alabaster rounded focus:outline-none focus:ring-2 focus:ring-fern"
              required
            />
          </div>

          {/* Profile Picture Upload */}
          <div>
            <label className="block mb-1 font-semibold" htmlFor="profilePicture">Profile Picture</label>
            <input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files[0])}
              className="w-full"
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block mb-1 font-semibold" htmlFor="coverImage">Cover Image</label>
            <input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="w-full"
            />
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-fern hover:bg-hunter text-alabaster px-6 py-3 rounded font-semibold transition"
            >
              Save Changes
            </button>
          </div>

          {error && <p className="text-imperial text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
