import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, CircularProgress, useTheme, Button, Paper, Container } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AgentConnector from '../components/AgentConnector';
import { getAuthToken } from '../utils/auth';
import { api } from '../api';
import { AuthContext } from '../App';

function ViewBrdgePage() {
    const theme = useTheme();
    const params = useParams();
    // Handle both URL formats: /viewBridge/:id-:uid and /b/:publicId
    const id = params.publicId || (params.id ? params.id.split('-')[0] : null);
    const uidFromUrl = params.id ? params.id.split('-')[1] : null;
    const token = getAuthToken();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // New states for course info
    const [courseInfo, setCourseInfo] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrollButtonLoading, setEnrollButtonLoading] = useState(false);

    const [currentUserId, setCurrentUserId] = useState(null);

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

                // Get current user ID if authenticated
                if (token) {
                    try {
                        const userResponse = await api.get('/user/current');
                        setCurrentUserId(userResponse.data.id);
                    } catch (userError) {
                        console.error('Error fetching user info:', userError);
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
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: theme.palette.background.default,
                position: 'relative'
            }}>
                <CircularProgress sx={{ color: theme.palette.primary.main, position: 'relative', zIndex: 1 }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: theme.palette.background.default,
                color: theme.palette.text.primary,
                textAlign: 'center',
                px: 3,
                gap: 3,
                position: 'relative'
            }}>
                <Paper elevation={0} sx={{
                    p: 4,
                    maxWidth: 500,
                    width: '100%',
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.shape.borderRadius,
                    position: 'relative',
                    zIndex: 1
                }}>
                    <Typography variant="h4" gutterBottom sx={{
                        color: theme.palette.text.primary,
                        fontFamily: theme.typography.h1.fontFamily,
                        mb: 2,
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            display: 'block',
                            width: '40px',
                            height: '2px',
                            background: theme.palette.primary.main,
                            margin: '10px auto 0',
                            borderRadius: '1px',
                        }
                    }}>
                        {error}
                    </Typography>

                    {courseInfo && !isAuthenticated && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 3 }}>
                            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                                This module is part of the course: <Typography component="span" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>{courseInfo.name}</Typography>
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    // Store the current URL to redirect back after login
                                    sessionStorage.setItem('redirectAfterLogin', location.pathname);
                                    navigate('/signup');
                                }}
                                sx={{ mt: 1 }}
                            >
                                Sign in to Access
                            </Button>
                        </Box>
                    )}

                    {courseInfo && isAuthenticated && !isEnrolled && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 3 }}>
                            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                                Enroll in <Typography component="span" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>{courseInfo.name}</Typography> to access this content
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleEnrollClick}
                                disabled={enrollButtonLoading}
                                sx={{ mt: 1 }}
                            >
                                {enrollButtonLoading ? <CircularProgress size={24} color="inherit" /> : 'Enroll Now'}
                            </Button>
                        </Box>
                    )}

                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate('/home')}
                        sx={{ mt: 3 }}
                    >
                        Return to Dashboard
                    </Button>
                </Paper>
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
            bgcolor: theme.palette.background.default,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            touchAction: 'none'
        }}>
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
                    userId={currentUserId}
                />
            </Box>
        </Box>
    );
}

export default ViewBrdgePage;
