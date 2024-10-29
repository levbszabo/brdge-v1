import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import PresentationIcon from '@mui/icons-material/Slideshow';
import { Link as RouterLink } from 'react-router-dom';

const EmptyBrdgeState = ({ onCreateClick, canCreate }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Box
                sx={{
                    textAlign: 'center',
                    mt: 8,
                    p: 6,
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '24px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
            >
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        transition: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                >
                    <Box
                        sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2196F3, #00BCD4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            mb: 4,
                            boxShadow: '0 12px 24px rgba(33, 150, 243, 0.2)'
                        }}
                    >
                        <PresentationIcon sx={{ fontSize: 50, color: 'white' }} />
                    </Box>
                </motion.div>

                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        background: 'linear-gradient(45deg, #2196F3, #00BCD4)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Create Your First Brdge
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        mb: 4,
                        maxWidth: '600px',
                        mx: 'auto',
                        fontSize: '1.1rem',
                        lineHeight: 1.6
                    }}
                >
                    Unleash the power of AI to bring your presentations to life. Turn your content into captivating stories with a personal AI presenter in minutes.
                </Typography>

                {canCreate ? (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={onCreateClick}
                            sx={{
                                py: 2,
                                px: 6,
                                borderRadius: '50px',
                                fontSize: '1.1rem',
                                background: 'linear-gradient(90deg, #0072ff, #00c6ff)',
                                boxShadow: '0 4px 15px rgba(0,114,255,0.2)',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #0058cc, #00a3cc)',
                                }
                            }}
                        >
                            Create Your First Brdge
                        </Button>
                    </motion.div>
                ) : (
                    <Box sx={{ mt: 2 }}>
                        <Typography
                            color="error.main"
                            sx={{ mb: 2 }}
                        >
                            You've reached your Brdge limit
                        </Typography>
                        <Button
                            component={RouterLink}
                            to="/profile"
                            variant="contained"
                            color="primary"
                            sx={{
                                borderRadius: '50px',
                                py: 1.5,
                                px: 4,
                                background: 'linear-gradient(90deg, #0072ff, #00c6ff)',
                            }}
                        >
                            Upgrade Your Plan
                        </Button>
                    </Box>
                )}
            </Box>
        </motion.div>
    );
};

export default EmptyBrdgeState; 