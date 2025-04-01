import React from 'react';
import { Box, Typography, Link, Stack } from '@mui/material';
import { Mail } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Footer = () => {
    const theme = useTheme();

    return (
        <Box
            component="footer"
            sx={{
                width: '100%',
                py: { xs: 2, sm: 2.5 },
                px: { xs: 2, sm: 3, md: 4 },
                background: theme.palette.background.paper + 'e6',
                backdropFilter: 'blur(8px)',
                borderTop: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: { xs: 2, sm: 3 },
                position: 'relative',
                zIndex: theme.zIndex.appBar - 1
            }}
        >
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1.5, sm: 3 }}
                alignItems={{ xs: 'center', sm: 'center' }}
                sx={{
                    color: theme.palette.text.secondary
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75,
                    }}
                >
                    <Mail size={14} style={{ color: theme.palette.secondary.main }} />
                    <Link
                        href="mailto:levi@brdge-ai.com"
                        sx={{
                            color: 'inherit',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            fontFamily: theme.typography.body2.fontFamily,
                            '&:hover': {
                                color: theme.palette.secondary.main,
                                textDecoration: 'underline'
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
                        <Typography
                            component="span"
                            sx={{
                                color: theme.palette.text.disabled,
                                fontSize: '0.875rem'
                            }}
                        >
                            •
                        </Typography>
                    }
                    sx={{
                        fontSize: '0.875rem',
                        color: theme.palette.text.disabled
                    }}
                >
                    <Link
                        component={RouterLink}
                        to="/policy#privacy"
                        sx={{
                            color: 'inherit',
                            textDecoration: 'none',
                            fontFamily: theme.typography.body2.fontFamily,
                            '&:hover': {
                                color: theme.palette.text.secondary,
                                textDecoration: 'underline'
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
                            fontFamily: theme.typography.body2.fontFamily,
                            '&:hover': {
                                color: theme.palette.text.secondary,
                                textDecoration: 'underline'
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
                    color: theme.palette.text.disabled,
                    fontSize: '0.875rem',
                    fontFamily: theme.typography.body2.fontFamily,
                    textAlign: { xs: 'center', sm: 'right' }
                }}
            >
                © {new Date().getFullYear()} All Rights Reserved • Journeyman AI LLC
            </Typography>
        </Box>
    );
};

export default Footer; 