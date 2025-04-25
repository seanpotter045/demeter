import backendURL from '../apiConfig';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendURL}/api/users/createUser`, {
        username,
        email,
        password,
      });      

      alert("Sign up successful!");
      navigate('/login');
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err.response?.data?.message || 'Error signing up');
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div
      className="min-h-screen font-inknut text-brunswick bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: `url('/OutdoorsPhoto1.jpeg')` }}
    >
      <div className="max-w-md w-full bg-asparagus rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>

        {error && (
          <div className="text-imperial text-center mb-4">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1 font-semibold">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 text-brunswick placeholder:text-brunswick bg-alabaster border border-alabaster rounded focus:outline-none focus:ring-2 focus:ring-fern"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-brunswick placeholder:text-brunswick bg-alabaster border border-alabaster rounded focus:outline-none focus:ring-2 focus:ring-fern"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-semibold">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-brunswick placeholder:text-brunswick bg-alabaster border border-alabaster rounded focus:outline-none focus:ring-2 focus:ring-fern"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-fern hover:bg-hunter text-alabaster font-semibold py-3 rounded transition"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center">
          <p>
            Already have an account?{' '}
            <button
              onClick={goToLogin}
              className="text-alabaster hover:text-hunter font-semibold underline transition"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
