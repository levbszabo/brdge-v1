import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Slide } from '@mui/material';
import { Link } from 'react-router-dom';

const GA_MEASUREMENT_ID = 'G-H5CM8J1TPE';

const CookieConsent = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const hasConsented = localStorage.getItem('cookieConsent');
        if (!hasConsented) {
            setShow(true);
        } else if (hasConsented === 'true') {
            // If user has previously consented, initialize GA
            initializeGA();
        }
    }, []);

    const initializeGA = () => {
        // Initialize Google Analytics
        window.gtag('consent', 'update', {
            'analytics_storage': 'granted'
        });
    };

    const disableGA = () => {
        // Disable Google Analytics
        window.gtag('consent', 'update', {
            'analytics_storage': 'denied'
        });

        // Optionally, you can also delete existing cookies
        document.cookie.split(";").forEach(function (c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
    };

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setShow(false);
        initializeGA();
    };

    const handleDecline = () => {
        localStorage.setItem('cookieConsent', 'false');
        setShow(false);
        disableGA();
    };

    if (!show) return null;

    return (
        <Slide direction="up" in={show} mountOnEnter unmountOnExit>
            <Box
                sx={{
                    position: 'fixed',
                    zIndex: 9999,
                    p: { xs: 2, sm: 3 },
                    display: 'flex',
                    gap: 2,
                    // Different styling for mobile and desktop
                    ...(window.innerWidth < 600 ? {
                        // Mobile: Full width banner at bottom
                        bottom: 0,
                        left: 0,
                        right: 0,
                        flexDirection: 'column',
                        background: 'rgba(0, 27, 61, 0.95)',
                        borderTop: '1px solid rgba(34, 211, 238, 0.1)',
                        boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.2)',
                    } : {
                        // Desktop: Compact box in bottom-right corner
                        bottom: 20,
                        right: 20,
                        maxWidth: '400px',
                        flexDirection: 'column',
                        background: 'rgba(0, 27, 61, 0.98)',
                        borderRadius: '12px',
                        border: '1px solid rgba(34, 211, 238, 0.1)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
                    }),
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Typography
                    variant="body2"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        textAlign: { xs: 'center', sm: 'left' },
                        fontSize: { xs: '0.875rem', sm: '0.8rem' },
                        lineHeight: 1.5,
                    }}
                >
                    We use cookies and Google Analytics to enhance your experience. By continuing, you agree to our{' '}
                    <Link
                        to="/policy#privacy"
                        style={{
                            color: 'rgba(34, 211, 238, 0.9)',
                            textDecoration: 'none'
                        }}
                    >
                        Privacy Policy
                    </Link>.
                </Typography>
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'center',
                }}>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={handleDecline}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            borderColor: 'rgba(34, 211, 238, 0.3)',
                            fontSize: '0.8rem',
                            py: 0.5,
                            '&:hover': {
                                borderColor: 'rgba(34, 211, 238, 0.5)',
                                background: 'rgba(34, 211, 238, 0.05)'
                            }
                        }}
                    >
                        Decline
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={handleAccept}
                        sx={{
                            background: 'linear-gradient(45deg, rgba(34, 211, 238, 0.8), rgba(34, 211, 238, 0.6))',
                            fontSize: '0.8rem',
                            py: 0.5,
                            '&:hover': {
                                background: 'linear-gradient(45deg, rgba(34, 211, 238, 0.9), rgba(34, 211, 238, 0.7))',
                            }
                        }}
                    >
                        Accept
                    </Button>
                </Box>
            </Box>
        </Slide>
    );
};

export default CookieConsent; 