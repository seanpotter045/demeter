import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-bone text-brunswick font-inknut p-4 flex flex-wrap justify-between items-center gap-4">
      {/* Logo */}
      <Link to="/landingPage" className="text-5xl font-tangerine text-brunswick hover:opacity-80 transition">
        Demeter
      </Link>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-grow max-w-md flex items-center bg-alabaster rounded-lg overflow-hidden shadow-sm">
        <input
          type="text"
          placeholder="Search For..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 text-brunswick placeholder-brunswick focus:outline-none"
        />
        <button
          type="submit"
          className="bg-fern hover:bg-hunter text-alabaster px-4 py-2 font-semibold transition"
        >
          Search
        </button>
      </form>

      {/* Right-side links */}
      <div className="flex space-x-4 items-center">
        <Link
          to="/createLocation"
          className="bg-fern hover:bg-hunter text-alabaster px-4 py-2 rounded font-semibold transition"
        >
          Got a Spot?
        </Link>

        {user && (
          <>
            <button
              onClick={handleLogout}
              className="bg-imperial hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition"
            >
              Log Out
            </button>

            {/* Profile Button */}
            <Link to="/profile" className="ml-2">
              <img
                src="/ProfileButton.png"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-fern hover:border-hunter transition"
              />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
