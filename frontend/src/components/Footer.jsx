import React from 'react';
import { Box, Typography, Link, Stack } from '@mui/material';
import { Mail } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                width: '100%',
                py: { xs: 2, sm: 2.5 },
                px: { xs: 2, sm: 3 },
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: { xs: 1, sm: 0 },
                position: 'relative',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 10
            }}
        >
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1, sm: 3 }}
                alignItems={{ xs: 'center', sm: 'flex-start' }}
                sx={{
                    color: 'rgba(255, 255, 255, 0.7)'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                    }}
                >
                    <Mail size={14} />
                    <Link
                        href="mailto:levi@brdge-ai.com"
                        sx={{
                            color: 'inherit',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            '&:hover': {
                                color: '#00ffcc',
                                textDecoration: 'none'
                            }
                        }}
                    >
                        levi@brdge-ai.com
                    </Link>
                </Box>

                <Stack
                    direction="row"
                    spacing={2}
                    divider={
                        <Box
                            component="span"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.3)',
                                fontSize: '0.875rem'
                            }}
                        >
                            •
                        </Box>
                    }
                    sx={{
                        fontSize: '0.875rem',
                        color: 'rgba(255, 255, 255, 0.5)'
                    }}
                >
                    <Link
                        component={RouterLink}
                        to="/policy#privacy"
                        sx={{
                            color: 'inherit',
                            textDecoration: 'none',
                            '&:hover': {
                                color: '#00ffcc'
                            }
                        }}
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        component={RouterLink}
                        to="/policy#terms"
                        sx={{
                            color: 'inherit',
                            textDecoration: 'none',
                            '&:hover': {
                                color: '#00ffcc'
                            }
                        }}
                    >
                        Terms of Service
                    </Link>
                </Stack>
            </Stack>

            <Typography
                variant="body2"
                sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.875rem',
                    textAlign: { xs: 'center', sm: 'right' }
                }}
            >
                © {new Date().getFullYear()} All Rights Reserved • Journeyman AI LLC
            </Typography>
        </Box>
    );
};

export default Footer; 