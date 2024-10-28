import React from 'react';
import { Box, Typography, Button, LinearProgress, useTheme, useMediaQuery } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const UsageIndicator = ({ stats }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const getUsagePercentage = () => {
        if (stats.brdges_limit === 'Unlimited') return 0;
        return (stats.brdges_created / parseInt(stats.brdges_limit)) * 100;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: isMobile ? '50%' : 24,
                    transform: isMobile ? 'translateX(50%)' : 'none',
                    width: isMobile ? '90%' : 'auto',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    minWidth: isMobile ? 'auto' : '300px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: isMobile ? 'translateX(50%) translateY(-2px)' : 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                    }
                }}
            >
                <Box sx={{ mb: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUpIcon
                                sx={{
                                    color: theme.palette.primary.main,
                                    fontSize: '1.2rem'
                                }}
                            />
                            <Typography
                                variant="body2"
                                fontWeight="medium"
                            >
                                Brdge Usage
                            </Typography>
                        </Box>
                        <Typography
                            variant="body2"
                            fontWeight="bold"
                            sx={{
                                background: 'linear-gradient(90deg, #2196F3, #00BCD4)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {stats.brdges_created} / {stats.brdges_limit}
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={getUsagePercentage()}
                        sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                background: 'linear-gradient(90deg, #2196F3, #00BCD4)'
                            }
                        }}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        component={RouterLink}
                        to="/profile"
                        variant="contained"
                        size="small"
                        sx={{
                            borderRadius: '20px',
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            py: 0.5,
                            px: 2,
                            background: 'linear-gradient(90deg, #2196F3, #00BCD4)',
                            boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(90deg, #1976D2, #0097A7)',
                                transform: 'scale(1.02)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Upgrade Now
                    </Button>
                </Box>
            </Box>
        </motion.div>
    );
};

export default UsageIndicator; 