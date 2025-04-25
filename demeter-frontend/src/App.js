import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import SignUpPage from './components/SignUpPage';
import CreateLocationPage from './components/CreateLocationPage';
import LocationPage from './components/LocationPage';
import EditLocationPage from './components/EditLocationPage';
import CreateReviewPage from './components/CreateReviewPage';
import EditReviewPage from './components/EditReviewPage';
import SearchResultsPage from './components/SearchResultsPage';
import Navbar from './components/Navbar';

const AppLayout = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/signup'];

  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <div className="app-container">
      {!shouldHideNavbar && <Navbar />}
      
      <div className={`min-h-screen ${shouldHideNavbar ? '' : 'bg-sage text-black'}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/landingPage" element={<LandingPage />} />
          <Route path="/createLocation" element={<CreateLocationPage />} />
          <Route path="/locations/:id" element={<LocationPage />} />
          <Route path="/editLocation/:id" element={<EditLocationPage />} />
          <Route path="/createReview/:id" element={<CreateReviewPage />} />
          <Route path="/editReview/:id" element={<EditReviewPage />} />
          <Route path="/search" element={<SearchResultsPage/>}/>
          <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
