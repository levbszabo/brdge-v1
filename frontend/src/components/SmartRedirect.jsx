import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Box, CircularProgress } from '@mui/material';

const SmartRedirect = () => {
    const { isAuthenticated, userRole } = useContext(AuthContext);

    // Show loading while authentication is being checked
    if (isAuthenticated === null || userRole === null) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Redirect based on user role
    if (userRole === 'admin') {
        return <Navigate to="/admin" replace />;
    } else {
        return <Navigate to="/dashboard" replace />;
    }
};

export default SmartRedirect; 