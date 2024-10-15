import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { BACKEND_URL } from '../config';

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
                const response = await fetch(`${BACKEND_URL}/check-auth`, {
                    headers: {
                        'Authorization': token
                    }
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    localStorage.removeItem('authToken');
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsAuthenticated(false);
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
