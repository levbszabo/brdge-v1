import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Box, CircularProgress, Alert } from '@mui/material';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, userRole } = useContext(AuthContext);

    console.log('AdminRoute - isAuthenticated:', isAuthenticated, 'userRole:', userRole);

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

    // Show access denied if not admin
    if (userRole !== 'admin') {
        return (
            <Box sx={{ p: 4 }}>
                <Alert severity="error">
                    Access Denied: Admin privileges required to view this page.
                </Alert>
            </Box>
        );
    }

    // Render children if user is authenticated admin
    return children;
};

export default AdminRoute; 