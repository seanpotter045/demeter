// src/components/SignUpPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    // Handle sign up logic
    const handleSignUp = async (e) => {
        e.preventDefault();  // Prevent the default form submission behavior

        try {
            const response = await axios.post('http://localhost:8081/api/users/createUser', {
                username,
                email,
                password,
            });

            // If the sign-up was successful
            alert("Sign up successful!");
            navigate('/login'); // Navigate to the login page after successful sign up
        } catch (err) {
            // Handle any errors during the sign-up process
            console.error('Sign up error:', err);
            setError(err.response?.data?.message || 'Error signing up');
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <div>
                    <label>Username:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <button type="submit">Sign Up</button>
            </form>

            {error && <div>{error}</div>}
        </div>
    );
};

export default SignUpPage;
