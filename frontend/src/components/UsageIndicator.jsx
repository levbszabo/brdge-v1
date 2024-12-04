import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

function UsageIndicator({ stats }) {
    const used = stats.brdges_created;
    const limit = stats.brdges_limit;
    const isUnlimited = limit === 'Unlimited';
    const percentage = isUnlimited ? 100 : (used / parseInt(limit)) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    p: 3,
                    minWidth: '250px',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
                    },
                    '&:hover': {
                        '& .progress-indicator': {
                            transform: 'scale(1.02)',
                        }
                    }
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.875rem',
                            letterSpacing: '0.02em'
                        }}
                    >
                        Brdges Used
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                        }}
                    >
                        {used} / {isUnlimited ? '∞' : limit}
                    </Typography>
                </Box>

                <Box
                    className="progress-indicator"
                    sx={{
                        position: 'relative',
                        transition: 'transform 0.3s ease'
                    }}
                >
                    <Box
                        sx={{
                            height: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                    >
                        <Box
                            sx={{
                                height: '100%',
                                width: `${percentage}%`,
                                background: 'linear-gradient(90deg, #4F9CF9, #00B4DB)',
                                borderRadius: '4px',
                                transition: 'width 0.5s ease-in-out',
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                    animation: 'shimmer 2s infinite',
                                }
                            }}
                        />
                    </Box>
                </Box>

                <Typography
                    variant="caption"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        display: 'block',
                        textAlign: 'right',
                        mt: 1,
                        fontSize: '0.75rem'
                    }}
                >
                    {isUnlimited ? 'Unlimited Plan' : `${Math.round(percentage)}% Used`}
                </Typography>
            </Box>

            <style>
                {`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                `}
            </style>
        </motion.div>
    );
}

export default UsageIndicator; 