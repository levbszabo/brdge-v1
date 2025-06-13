import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Alert,
    CircularProgress,
    Button,
    Chip
} from '@mui/material';
import { ArrowBack, AdminPanelSettings } from '@mui/icons-material';
import { api } from '../api';
import ClientDashboard from './ClientDashboard';

const AdminClientDashboard = () => {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClientDashboard();
    }, [clientId]);

    const fetchClientDashboard = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/client/${clientId}/dashboard`);
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching client dashboard:', error);
            setError(error.response?.data?.error || 'Failed to load client dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/admin')}
                >
                    Back to Admin Dashboard
                </Button>
            </Container>
        );
    }

    return (
        <Box>
            {/* Admin Header */}
            <Box sx={{
                bgcolor: 'warning.light',
                color: 'warning.contrastText',
                py: 1,
                px: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AdminPanelSettings />
                    <Typography variant="body2" fontWeight="bold">
                        Admin View: {dashboardData?.user?.email}
                    </Typography>
                    <Chip
                        label="Admin Mode"
                        size="small"
                        color="warning"
                        variant="outlined"
                    />
                </Box>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/admin')}
                    sx={{ color: 'inherit', borderColor: 'currentColor' }}
                >
                    Back to Admin
                </Button>
            </Box>

            {/* Client Dashboard Content */}
            <ClientDashboard adminViewData={dashboardData} />
        </Box>
    );
};

export default AdminClientDashboard; 