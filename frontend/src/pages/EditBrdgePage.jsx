import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Paper } from '@mui/material';
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
    const [currentUserId, setCurrentUserId] = useState(null);

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
                        console.error('Invalid Bridge URL. UID mismatch.');
                        navigate('/');
                        return;
                    }
                }

                setIsAuthorized(true);
            } catch (error) {
                console.error('Authorization check failed:', error.message || error);
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

                // First, if user is authenticated, get their ID regardless of course/standalone brdge
                if (authToken) {
                    try {
                        const userResponse = await api.get('/user/current');
                        setCurrentUserId(userResponse.data.id);

                        // If this is the owner, grant access
                        if (userResponse.data.id === brdge.user_id) {
                            hasAccess = true;
                        }
                    } catch (err) {
                        console.error('Error fetching user data:', err.message || err);
                        // Set a fallback anonymous user ID if user fetch fails
                        setCurrentUserId(`anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
                    }
                } else {
                    // Set a fallback anonymous user ID if no auth token
                    setCurrentUserId(`anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
                }

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
                                console.error('Error checking enrollment status:', error.message || error);
                            }
                        }
                    } catch (error) {
                        console.error('Error fetching course info:', error.message || error);
                    }
                } else {
                    // Standalone brdge (not part of a course)
                    // If Brdge is shareable, allow access
                    if (brdge.shareable) {
                        hasAccess = true;
                    }
                    // Owner access is already checked above
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
                console.error('Error checking Bridge access during access check:', error.message || error);
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
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            touchAction: 'none',
            bgcolor: theme.palette.background.default
        }}>
            <Box sx={{
                height: { xs: '44px', sm: '50px', md: '56px' },
                flexShrink: 0,
                borderBottom: `1px solid ${theme.palette.divider}`,
                // This can be used for a header if needed
            }} />

            <Box sx={{
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1,
                WebkitOverflowScrolling: 'touch'
            }}>
                {loading || error ? (
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: error ? 'error.main' : 'white',
                        gap: 2
                    }}>
                        {error ? (
                            <Typography variant="h6">Error: {error}</Typography>
                        ) : (
                            <>
                                <Typography variant="h6">Loading...</Typography>
                            </>
                        )}
                    </Box>
                ) : (
                    <AgentConnector
                        brdgeId={id}
                        agentType="edit"
                        token={authToken}
                        userId={currentUserId}
                    />
                )}
            </Box>

            {/* Premium Access Dialog */}
            <Dialog
                open={premiumAccessDialogOpen}
                onClose={() => setPremiumAccessDialogOpen(false)}
                PaperProps={{
                    sx: {
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        backgroundImage: 'none', // Remove default gradient
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: theme.shadows[3]
                    }
                }}
            >
                <DialogTitle sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontFamily: theme.typography.h1.fontFamily
                }}>
                    Premium Access Required
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: theme.palette.text.secondary, my: 2 }}>
                        This module requires premium access. Please upgrade your enrollment to access premium content.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Button
                        onClick={() => setPremiumAccessDialogOpen(false)}
                        sx={{ color: theme.palette.text.secondary }}
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
                        color="primary"
                    >
                        Upgrade to Premium
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EditBrdgePage;