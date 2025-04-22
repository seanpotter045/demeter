import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/landingPage');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred during login. Please try again later.');
    }
  };

  const goToSignUp = () => {
    navigate('/signup');
  };

  return (
    <div
      className="min-h-screen font-inknut text-brunswick bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: `url('/OutdoorsPhoto1.jpeg')` }}
    >
      <div className="max-w-md w-full bg-asparagus rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Log In</h1>

        {error && (
          <div className="text-imperial text-center mb-4">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            Log In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p>
            Don’t have an account?{' '}
            <button
              onClick={goToSignUp}
              className="text-alabaster hover:text-hunter font-semibold underline transition"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
