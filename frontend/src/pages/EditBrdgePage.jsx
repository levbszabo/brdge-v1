import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AgentConnector from '../components/AgentConnector';
import { api } from '../api';

function EditBrdgePage() {
    const theme = useTheme();
    const params = useParams();
    // Handle combined ID-UID format from the URL
    const [id, uidFromUrl] = params.id ? params.id.split('-') : [null, null];
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [authToken, setAuthToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [courseInfo, setCourseInfo] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [premiumAccessDialogOpen, setPremiumAccessDialogOpen] = useState(false);

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                // Get the token from localStorage
                const token = localStorage.getItem('token');
                setAuthToken(token || '');

                const response = await api.get(`/brdges/${id}/check-auth`);

                // If we have a UID from the URL, verify it matches
                if (uidFromUrl && response.data.brdge.public_id) {
                    const publicIdPrefix = response.data.brdge.public_id.substring(0, 6);
                    if (uidFromUrl !== publicIdPrefix) {
                        console.error('Invalid Bridge URL');
                        navigate('/');
                        return;
                    }
                }

                setIsAuthorized(true);
            } catch (error) {
                console.error('Authorization check failed:', error);
                navigate('/');
            }
        };

        if (id) {
            checkAuthorization();
        } else {
            navigate('/');
        }
    }, [id, uidFromUrl, navigate]);

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

                let hasAccess = false;
                let courseModule = null;
                let courseData = null;

                // Check if this brdge is part of a course
                if (brdge.course_modules && brdge.course_modules.length > 0) {
                    // Find the first course this brdge belongs to
                    courseModule = brdge.course_modules[0];

                    try {
                        const courseResponse = await api.get(`/courses/${courseModule.course_id}`);
                        courseData = courseResponse.data;
                        setCourseInfo(courseData);

                        // Get module permissions
                        const modulePermission = courseModule.permissions || { access_level: 'enrolled' }; // Default to enrolled

                        // Check access based on permission level
                        if (modulePermission.access_level === 'public') {
                            // Public modules are accessible to everyone
                            hasAccess = true;
                        } else if (authToken) {
                            try {
                                // Check if user is enrolled
                                const enrollmentResponse = await api.get(`/courses/${courseModule.course_id}/enrollment-status`);
                                const isUserEnrolled = enrollmentResponse.data.enrolled;
                                setIsEnrolled(isUserEnrolled);

                                // For enrolled level, just need to be enrolled
                                if (modulePermission.access_level === 'enrolled' && isUserEnrolled) {
                                    hasAccess = true;
                                }
                                // For premium level, need to be enrolled AND have premium access
                                else if (modulePermission.access_level === 'premium' &&
                                    isUserEnrolled &&
                                    enrollmentResponse.data.has_premium_access) {
                                    hasAccess = true;
                                }
                            } catch (error) {
                                console.error('Error checking enrollment status:', error);
                            }
                        }
                    } catch (error) {
                        console.error('Error fetching course info:', error);
                    }
                } else {
                    // Standalone brdge (not part of a course)
                    // If Brdge is shareable, allow access
                    if (brdge.shareable) {
                        hasAccess = true;
                    }
                    // If user is the owner, allow access
                    else if (authToken) {
                        try {
                            const userResponse = await api.get('/user/current');
                            if (userResponse.data.id === brdge.user_id) {
                                hasAccess = true;
                            }
                        } catch (err) {
                            console.error('Error checking user identity:', err);
                        }
                    }
                }

                // If access was denied, set error message based on module permission
                if (!hasAccess) {
                    if (!courseModule) {
                        setError('This module is private. Only the creator can access it.');
                    } else {
                        const permission = courseModule.permissions || { access_level: 'enrolled' };

                        if (permission.access_level === 'enrolled') {
                            setError('Enrollment Required: You need to enroll in this course to access this module.');
                        } else if (permission.access_level === 'premium') {
                            setError('Premium Access Required: This module requires premium course access.');
                        } else {
                            setError('Access Denied: You do not have permission to view this module.');
                        }
                    }
                    setLoading(false);
                    return;
                }

                setLoading(false);
            } catch (error) {
                console.error('Error checking Bridge access:', error);
                setError('Bridge Is Not Public: Access Denied');
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
    }, [id, uidFromUrl, authToken]);

    // Only render the main content if authorized
    if (!isAuthorized) {
        return null; // Or a loading spinner
    }

    const handleUpgradeToPremium = async () => {
        if (!authToken) {
            sessionStorage.setItem('redirectAfterLogin', location.pathname);
            navigate('/signup');
            return;
        }

        if (!courseInfo) return;

        // Navigate to premium upgrade page or show payment dialog
        // This implementation will depend on your payment/subscription system
        navigate(`/courses/${courseInfo.id}/upgrade-to-premium`);
    };

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
                height: '64px',
                flexShrink: 0
            }} />

            <Box sx={{
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1,
                WebkitOverflowScrolling: 'touch'
            }}>
                <AgentConnector brdgeId={id} agentType="edit" token={authToken} />
            </Box>

            {/* Premium Access Dialog */}
            <Dialog
                open={premiumAccessDialogOpen}
                onClose={() => setPremiumAccessDialogOpen(false)}
            >
                <DialogTitle sx={{
                    bgcolor: 'rgba(0, 10, 30, 0.9)',
                    color: 'white'
                }}>
                    Premium Access Required
                </DialogTitle>
                <DialogContent sx={{ bgcolor: 'rgba(0, 10, 30, 0.9)', color: 'white' }}>
                    <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        This module requires premium access. Please upgrade your enrollment to access premium content.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ bgcolor: 'rgba(0, 10, 30, 0.9)', p: 2 }}>
                    <Button
                        onClick={() => setPremiumAccessDialogOpen(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setPremiumAccessDialogOpen(false);
                            // Call a function to upgrade to premium
                            handleUpgradeToPremium();
                        }}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)',
                            boxShadow: '0 4px 15px rgba(156, 39, 176, 0.3)',
                        }}
                    >
                        Upgrade to Premium
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EditBrdgePage;