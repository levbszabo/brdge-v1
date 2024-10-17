import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                await api.get('/check-auth');
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsAuthenticated(false);
                localStorage.removeItem('authToken');
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Or some loading spinner
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
