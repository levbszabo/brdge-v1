import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Slide } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const GA_MEASUREMENT_ID = 'G-H5CM8J1TPE';

const CookieConsent = () => {
    const [show, setShow] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        const hasConsented = localStorage.getItem('cookieConsent');
        if (!hasConsented) {
            setShow(true);
        } else if (hasConsented === 'true') {
            initializeGA();
        }
    }, []);

    const initializeGA = () => {
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    };

    const disableGA = () => {
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
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
                    zIndex: theme.zIndex.snackbar,
                    background: theme.palette.background.default + 'f2',
                    backdropFilter: 'blur(8px)',
                    borderTop: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.shadows[8],
                    p: { xs: 2, sm: 2.5 },
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'stretch', md: 'center' },
                    justifyContent: 'center',
                    gap: { xs: 2, sm: 3 }
                }}
            >
                <Typography
                    variant="body2"
                    sx={{
                        color: theme.palette.text.secondary,
                        textAlign: { xs: 'center', md: 'left' },
                        maxWidth: '800px',
                        fontFamily: theme.typography.body2.fontFamily,
                        lineHeight: 1.6,
                    }}
                >
                    We use cookies to enhance your experience. By clicking "Accept", you consent to our use of cookies. Read our{' '}
                    <Link
                        to="/policy#privacy"
                        style={{
                            color: theme.palette.secondary.main,
                            textDecoration: 'underline',
                            fontWeight: 500,
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
                    minWidth: { md: '240px' }
                }}>
                    <Button
                        variant="outlined"
                        onClick={handleDecline}
                        size="medium"
                        sx={{
                            color: theme.palette.secondary.main,
                            borderColor: theme.palette.secondary.main + '80',
                            '&:hover': {
                                borderColor: theme.palette.secondary.main,
                                backgroundColor: theme.palette.action.hover
                            }
                        }}
                    >
                        Decline
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAccept}
                        size="medium"
                        sx={{
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            '&:hover': {
                                backgroundColor: theme.palette.primary.light,
                                boxShadow: theme.shadows[4]
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