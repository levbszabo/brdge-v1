import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
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
    const isMobile = useMediaQuery('(max-width:640px)');

    useEffect(() => {
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
    }, [id, token]);

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

    if (isMobile) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #000B1F 0%, #001E3C 50%, #0041C2 100%)',
                color: 'white',
                textAlign: 'center',
                px: 3,
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '5%',
                    left: '-5%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(79, 156, 249, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    animation: 'float 20s infinite alternate',
                    zIndex: 0
                }
            }}>
                <Box sx={{
                    position: 'relative',
                    zIndex: 1,
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    p: 4,
                    maxWidth: '90%'
                }}>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 2,
                            background: 'linear-gradient(to right, #00B4DB, #0083B0)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        Mobile Coming Soon
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            lineHeight: 1.6
                        }}
                    >
                        We're working to bring the Brdge experience to mobile devices. Please visit us on desktop for the full experience.
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100vw',
            background: 'linear-gradient(135deg, #000B1F 0%, #001E3C 50%, #0041C2 100%)',
            position: 'relative',
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
                height: '64px',
                flexShrink: 0
            }} />

            <Box sx={{
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1
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
