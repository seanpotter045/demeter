import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import SignUpPage from './components/SignUpPage';
import CreateLocationPage from './components/CreateLocationPage';
import LocationPage from './components/LocationPage';
import CreateReviewPage from './components/CreateReviewPage';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/landingPage" element={<LandingPage />} />
          <Route path="/createLocation" element={<CreateLocationPage />} />
          <Route path="/locations/:id" element={<LocationPage />} />
          <Route path="/createReview/:id" element={<CreateReviewPage />} />
          <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
