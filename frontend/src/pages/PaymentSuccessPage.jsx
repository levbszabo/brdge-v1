import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Container, Alert } from '@mui/material';
import { api } from '../api';

function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const tier = searchParams.get('tier');
                const sessionId = searchParams.get('session_id');

                if (!tier || !sessionId) {
                    throw new Error('Missing payment information');
                }

                console.log('Starting payment verification:', { tier, sessionId });

                // Verify the subscription
                const response = await api.post('/verify-subscription', {
                    tier,
                    session_id: sessionId
                });

                console.log('Verification successful:', response.data);

                // Short delay to show success message
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Redirect back to profile page with success parameter
                navigate('/profile?payment=success', { replace: true });

            } catch (error) {
                console.error('Verification error:', error.response?.data || error);
                setError(error.response?.data?.error || 'Failed to verify payment. Please contact support.');
                setVerifying(false);
            }
        };

        verifyPayment();
    }, [searchParams, navigate]);

    if (error) {
        return (
            <Container maxWidth="sm">
                <Box display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="100vh"
                    gap={2}>
                    <Alert severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                    <Typography variant="body1">
                        You can return to your <a href="/profile">profile page</a>.
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Box display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            gap={3}>
            <CircularProgress size={60} />
            <Typography variant="h5" sx={{ mt: 2 }}>
                Completing your subscription...
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Please don't close this page
            </Typography>
        </Box>
    );
}

export default PaymentSuccessPage; 