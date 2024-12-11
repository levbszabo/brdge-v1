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
                    mt: { xs: 4, sm: 6, md: 8 },
                    p: { xs: 3, sm: 4, md: 6 },
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '24px',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                    },
                }}
            >
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Box
                        sx={{
                            width: { xs: 80, sm: 100, md: 120 },
                            height: { xs: 80, sm: 100, md: 120 },
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #4F9CF9, #00B4DB)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            mb: 4,
                            boxShadow: '0 12px 24px rgba(0,180,219,0.2)',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: -1,
                                borderRadius: 'inherit',
                                padding: '1px',
                                background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2))',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude',
                            }
                        }}
                    >
                        <PresentationIcon sx={{
                            fontSize: { xs: 36, sm: 42, md: 50 },
                            color: 'white',
                            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
                        }} />
                    </Box>
                </motion.div>

                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        color: 'white',
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                        mb: 2,
                        textShadow: '0 0 20px rgba(255,255,255,0.2)',
                    }}
                >
                    Create Your First Brdge
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        mb: 4,
                        maxWidth: '600px',
                        mx: 'auto',
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                        lineHeight: 1.6,
                        color: 'rgba(255,255,255,0.8)',
                    }}
                >
                    Unleash the power of AI to bring your presentations to life. Turn your content into captivating stories with a personal AI presenter in minutes.
                </Typography>

                {canCreate ? (
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={onCreateClick}
                            sx={{
                                py: { xs: 1.5, sm: 2 },
                                px: { xs: 4, sm: 6 },
                                borderRadius: '50px',
                                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                                background: 'linear-gradient(45deg, #4F9CF9, #00B4DB)',
                                color: 'white',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 4px 15px rgba(79, 156, 249, 0.2)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #00B4DB, #4F9CF9)',
                                    boxShadow: '0 6px 20px rgba(79, 156, 249, 0.4)',
                                }
                            }}
                        >
                            Create Your First Brdge
                        </Button>
                    </motion.div>
                ) : (
                    <Box sx={{ mt: 2 }}>
                        <Typography
                            sx={{
                                mb: 2,
                                color: '#ff4d4d',
                                textShadow: '0 0 10px rgba(255,77,77,0.2)'
                            }}
                        >
                            You've reached your Brdge limit
                        </Typography>
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
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #00B4DB, #4F9CF9)',
                                    boxShadow: '0 6px 20px rgba(79, 156, 249, 0.4)',
                                }
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