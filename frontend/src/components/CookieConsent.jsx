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
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9999,
                    background: 'rgba(0, 27, 61, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderTop: '1px solid rgba(34, 211, 238, 0.1)',
                    boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.2)',
                    p: { xs: 2, sm: 3 },
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'stretch', md: 'center' },
                    justifyContent: 'center',
                    gap: 2
                }}
            >
                <Typography
                    variant="body2"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        textAlign: { xs: 'center', md: 'left' },
                        maxWidth: '800px'
                    }}
                >
                    We use cookies and Google Analytics to enhance your experience and analyze site usage. By clicking "Accept", you consent to our use of cookies. Read our{' '}
                    <Link
                        to="/policy#privacy"
                        style={{
                            color: 'rgba(34, 211, 238, 0.9)',
                            textDecoration: 'none'
                        }}
                    >
                        Privacy Policy
                    </Link>
                    {' '}to learn more.
                </Typography>
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: { xs: 'center', md: 'flex-end' },
                    minWidth: { md: '300px' }
                }}>
                    <Button
                        variant="outlined"
                        onClick={handleDecline}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            borderColor: 'rgba(34, 211, 238, 0.3)',
                            '&:hover': {
                                borderColor: 'rgba(34, 211, 238, 0.5)',
                                background: 'rgba(34, 211, 238, 0.05)'
                            }
                        }}
                    >
                        Decline
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAccept}
                        sx={{
                            background: 'linear-gradient(45deg, rgba(34, 211, 238, 0.8), rgba(34, 211, 238, 0.6))',
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