import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);

    // If the user is not logged in, redirect them to the login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Otherwise, allow them to view the page (the children)
    return children;
};

export default ProtectedRoute;