import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import { useParams } from 'react-router-dom';
import AgentConnector from '../components/AgentConnector';
import { getAuthToken } from '../utils/auth';
import { api } from '../api';

function ViewBrdgePage() {
    const { id } = useParams();
    const token = getAuthToken();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();

    useEffect(() => {
        // Prevent scrolling on the body
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.touchAction = 'none';

        // Add viewport meta for mobile
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
            viewport.setAttribute('content',
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
            );
        }

        const checkAccess = async () => {
            try {
                // Get the Brdge details
                const response = await api.get(`/brdges/${id}`);
                const brdge = response.data;

                // If Brdge is not shareable and user is not the owner, deny access
                if (!brdge.shareable && token) {
                    const userResponse = await api.get('/user/current');
                    if (userResponse.data.id !== brdge.user_id) {
                        setError('Brdge Is Not Public: Access Denied');
                        setLoading(false);
                        return;
                    }
                } else if (!brdge.shareable && !token) {
                    setError('Brdge Is Not Public: Access Denied');
                    setLoading(false);
                    return;
                }

                setLoading(false);
            } catch (error) {
                console.error('Error checking Brdge access:', error);
                setError('Brdge Is Not Public: Access Denied');
                setLoading(false);
            }
        };

        checkAccess();

        return () => {
            // Cleanup
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
            document.body.style.touchAction = '';

            if (viewport) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
            }
        };
    }, []);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    background: 'linear-gradient(135deg, #000B1F 0%, #001E3C 50%, #0041C2 100%)'
                }}
            >
                <CircularProgress sx={{ color: 'white' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    background: 'linear-gradient(135deg, #000B1F 0%, #001E3C 50%, #0041C2 100%)',
                    color: 'white',
                    textAlign: 'center',
                    px: 3
                }}
            >
                <Typography variant="h5" gutterBottom>
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100dvh',
            width: '100%',
            maxWidth: '100%',
            background: 'linear-gradient(135deg, #000B1F 0%, #001E3C 50%, #0041C2 100%)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            touchAction: 'none',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: '5%',
                left: '-5%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(79, 156, 249, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                animation: 'float 20s infinite alternate',
                zIndex: 0
            },
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '5%',
                right: '-5%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(0, 180, 219, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                animation: 'float 25s infinite alternate-reverse',
                zIndex: 0
            }
        }}>
            <Box sx={{
                height: { xs: '40px', sm: '64px' },
                flexShrink: 0
            }} />

            <Box sx={{
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1,
                WebkitOverflowScrolling: 'touch'
            }}>
                <AgentConnector
                    brdgeId={id}
                    agentType="view"
                    token={token}
                />
            </Box>
        </Box>
    );
}

export default ViewBrdgePage;
