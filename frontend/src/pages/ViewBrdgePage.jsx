import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, CircularProgress, useTheme, Button } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AgentConnector from '../components/AgentConnector';
import { getAuthToken } from '../utils/auth';
import { api } from '../api';
import { AuthContext } from '../App';

function ViewBrdgePage() {
    const params = useParams();
    // Handle both URL formats: /viewBridge/:id-:uid and /b/:publicId
    const id = params.publicId || (params.id ? params.id.split('-')[0] : null);
    const uidFromUrl = params.id ? params.id.split('-')[1] : null;
    const token = getAuthToken();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // New states for course info
    const [courseInfo, setCourseInfo] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrollButtonLoading, setEnrollButtonLoading] = useState(false);

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

                // Verify the UUID prefix matches if we're using the id-uid format
                if (uidFromUrl && !brdge.public_id.startsWith(uidFromUrl)) {
                    setError('Invalid Bridge URL');
                    setLoading(false);
                    return;
                }

                // The actual GET request response already enforces all permission rules
                // If we got a successful response, access is granted by the backend
                setLoading(false);

                // Still check for course info to display enrollment options if needed
                if (brdge.course_modules && brdge.course_modules.length > 0) {
                    const courseModule = brdge.course_modules[0];
                    try {
                        const courseResponse = await api.get(`/courses/${courseModule.course_id}/public`);
                        setCourseInfo(courseResponse.data);

                        if (token) {
                            const enrollmentResponse = await api.get(`/courses/${courseModule.course_id}/enrollment-status`);
                            setIsEnrolled(enrollmentResponse.data.enrolled);
                        }
                    } catch (err) {
                        console.error('Error fetching course info:', err);
                    }
                }
            } catch (error) {
                console.error('Error checking Bridge access:', error);

                // More descriptive error messages based on status code
                if (error.response?.status === 401) {
                    if (!isAuthenticated) {
                        setError('This content requires you to sign in or enroll in the course');
                    } else {
                        setError('You don\'t have access to this content. It may require course enrollment or premium access.');
                    }
                } else {
                    setError('Unable to access this content. It may have been removed or is unavailable.');
                }
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
    }, [id, uidFromUrl, token, isAuthenticated]);

    const handleEnrollClick = async () => {
        if (!isAuthenticated) {
            // Store the current URL in session storage to redirect back after login
            sessionStorage.setItem('redirectAfterLogin', location.pathname);
            navigate('/signup');
            return;
        }

        if (!courseInfo) return;

        setEnrollButtonLoading(true);
        try {
            await api.post(`/courses/${courseInfo.id}/enroll`);
            setIsEnrolled(true);
        } catch (error) {
            console.error('Error enrolling in course:', error);
        } finally {
            setEnrollButtonLoading(false);
        }
    };

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
                    px: 3,
                    gap: 3
                }}
            >
                <Typography variant="h5" gutterBottom>
                    {error}
                </Typography>

                {courseInfo && !isAuthenticated && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1">
                            This module is part of the course: <strong>{courseInfo.name}</strong>
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                // Store the current URL to redirect back after login
                                sessionStorage.setItem('redirectAfterLogin', location.pathname);
                                navigate('/signup');
                            }}
                            sx={{
                                mt: 1,
                                backgroundColor: '#00E5FF',
                                '&:hover': { backgroundColor: '#00BCD4' }
                            }}
                        >
                            Sign in to Access
                        </Button>
                    </Box>
                )}

                {courseInfo && isAuthenticated && !isEnrolled && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1">
                            Enroll in <strong>{courseInfo.name}</strong> to access this content
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEnrollClick}
                            disabled={enrollButtonLoading}
                            sx={{
                                mt: 1,
                                backgroundColor: '#00E5FF',
                                '&:hover': { backgroundColor: '#00BCD4' }
                            }}
                        >
                            {enrollButtonLoading ? <CircularProgress size={24} color="inherit" /> : 'Enroll Now'}
                        </Button>
                    </Box>
                )}

                <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                    sx={{
                        mt: 2,
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.3)',
                        '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                    }}
                >
                    Return to Dashboard
                </Button>
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
                flexShrink: 0,
                zIndex: 10
            }}>
                {/* Empty header for spacing only */}
            </Box>

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
