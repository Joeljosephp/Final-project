import React, { createContext, useState } from 'react';
import axios from 'axios';

// Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Check if the user already has a token in local storage on initial load
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem('access')
    );

    const login = async (username, password) => {
        // We use standard axios here instead of our custom 'api' 
        // because we don't have/need a token yet to log in!
        const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
        const response = await axios.post(`${API_URL}/api/token/`, {
            username,
            password
        });

        // Save the tokens to local storage
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);

        // Update the global state
        setIsAuthenticated(true);
    };

    const register = async (username, password, email, firstName, lastName) => {
        const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
        await axios.post(`${API_URL}/api/register/`, {
            username,
            password,
            email,
            first_name: firstName,
            last_name: lastName
        });
        // Log in immediately after registering
        await login(username, password);
    };

    const logout = () => {
        // Clear tokens and update state
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};