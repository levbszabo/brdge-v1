import React from 'react';
import { Navigate } from 'react-router-dom';

// Replace this with your actual authentication check
const isAuthenticated = () => {
    // Implement your actual authentication check
    // For example, verify if the auth token is valid
    const token = localStorage.getItem('authToken');
    // Optionally, add more checks (e.g., token expiry)
    return !!token; // Return true if authenticated
};

const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        // Redirect to the login page if not authenticated
        return <Navigate to="/login" />;
    }

    // Render the children if authenticated
    return children;
};

export default ProtectedRoute;