import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Avatar,
    useTheme,
    Button
} from '@mui/material';
import { api } from '../api';
import PersonIcon from '@mui/icons-material/Person';

function UserProfilePage() {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                console.log('Fetching user profile...');  // Debug log
                const response = await api.get('/user/profile');
                console.log('Profile response:', response);  // Full response log
                console.log('Profile data:', response.data);  // Data log

                if (!response.data) {
                    throw new Error('No data received from server');
                }

                setUserProfile(response.data);
            } catch (err) {
                console.error('Error details:', err);  // Detailed error log
                setError(err.response?.data?.error || 'Failed to load user profile');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleUpgradeClick = async () => {
        try {
            const response = await api.post('/create-checkout-session');
            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleManageSubscription = async () => {
        try {
            const response = await api.post('/create-portal-session');
            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const renderStripeButton = () => {
        return (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <div id="stripe-button-container">
                    <stripe-buy-button
                        buy-button-id="buy_btn_1QF0lP02UrRwCkiwBTHDU1bk"
                        publishable-key="pk_test_51QDAwr02UrRwCkiwTdLxlQNng2UveNcm8cqaIh0tRyAqb4f7GSjU6BZMO0ovMYXkoWXKORoTI7bdI87cXOoZkQdO00NOrRhmNp"
                    >
                    </stripe-buy-button>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        mt: 2,
                        display: 'none',  // This will show if Stripe button fails to load
                        className: 'stripe-button-fallback'
                    }}
                    onClick={handleUpgradeClick}
                >
                    Upgrade to Pro - $59/month
                </Button>
            </Box>
        );
    };

    useEffect(() => {
        if (!window.stripe) {
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/buy-button.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md">
                <Typography color="error" align="center">
                    {error}
                </Typography>
            </Container>
        );
    }

    const isPro = userProfile?.account?.account_type === 'pro';

    // Add debug render
    console.log('Current userProfile state:', userProfile);  // State log
    console.log('isPro:', userProfile?.account?.account_type === 'pro'); // Debug log
    console.log('userProfile:', userProfile); // Debug log

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 2,
                    background: 'white',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)'
                }}
            >
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: '#2196F3',
                            margin: '0 auto',
                            mb: 3
                        }}
                    >
                        <PersonIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: 500,
                            color: '#333',
                            mb: 4
                        }}
                    >
                        Account Profile
                    </Typography>

                    <Box sx={{ textAlign: 'left', pl: 2 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <strong>Email:</strong> {userProfile?.email}
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <strong>Account Type:</strong>
                            <span style={{
                                color: isPro ? theme.palette.primary.main : 'inherit',
                                fontWeight: isPro ? 600 : 400
                            }}>
                                {isPro ? 'Pro' : 'Free'}
                            </span>
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <strong>Member Since:</strong> {
                                userProfile?.account?.created_at
                                    ? new Date(userProfile.account.created_at).toLocaleDateString()
                                    : 'N/A'
                            }
                        </Typography>
                    </Box>

                    {userProfile?.account?.account_type === 'pro' ? (
                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Typography variant="body1" color="primary" sx={{ mb: 2, fontWeight: 500 }}>
                                Pro Subscription Active
                            </Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleManageSubscription}
                            >
                                Manage Subscription
                            </Button>
                        </Box>
                    ) : (
                        <>
                            <Typography
                                variant="h6"
                                align="center"
                                sx={{ mb: 3, color: theme.palette.primary.main }}
                            >
                                Upgrade to Pro
                            </Typography>
                            {renderStripeButton()}
                        </>
                    )}
                </Box>
            </Paper>
        </Container>
    );
}

export default UserProfilePage;
