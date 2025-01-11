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
            <Box sx={{
                textAlign: 'center',
                py: { xs: 8, sm: 10 },
                px: { xs: 3, sm: 4 },
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '24px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}>
                <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Box sx={{
                        width: { xs: 80, sm: 100 },
                        height: { xs: 80, sm: 100 },
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4F9CF9, #00B4DB)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        mb: 4,
                        boxShadow: '0 12px 24px rgba(0,180,219,0.2)',
                    }}>
                        <PresentationIcon sx={{
                            fontSize: { xs: 36, sm: 42 },
                            color: 'white',
                            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
                        }} />
                    </Box>
                </motion.div>

                <Typography variant="h4" sx={{
                    fontWeight: 600,
                    color: 'white',
                    fontSize: { xs: '1.5rem', sm: '2rem' },
                    mb: 3,
                    textShadow: '0 0 20px rgba(255,255,255,0.2)',
                }}>
                    Create Your First Brdge
                </Typography>

                <Typography variant="body1" sx={{
                    mb: 6,
                    maxWidth: '500px',
                    mx: 'auto',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    lineHeight: 1.6,
                    color: 'rgba(255,255,255,0.8)',
                }}>
                    Turn your content into an interactive AI experience with your own voice assistant.
                </Typography>

                {canCreate ? (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={onCreateClick}
                            sx={{
                                py: 1.5,
                                px: 4,
                                borderRadius: '50px',
                                fontSize: '1rem',
                                background: 'linear-gradient(45deg, #4F9CF9, #00B4DB)',
                                color: 'white',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 4px 15px rgba(79, 156, 249, 0.2)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #00B4DB, #4F9CF9)',
                                }
                            }}
                        >
                            Create New Brdge
                        </Button>
                    </motion.div>
                ) : (
                    <Button
                        component={RouterLink}
                        to="/profile"
                        variant="contained"
                        sx={{
                            borderRadius: '50px',
                            py: 1.5,
                            px: 4,
                            background: 'linear-gradient(45deg, #4F9CF9, #00B4DB)',
                            color: 'white',
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            '&:hover': {
                                background: 'linear-gradient(45deg, #00B4DB, #4F9CF9)',
                            }
                        }}
                    >
                        Upgrade Plan
                    </Button>
                )}
            </Box>
        </motion.div>
    );
};

export default EmptyBrdgeState; 