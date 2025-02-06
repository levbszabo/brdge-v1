import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import PresentationIcon from '@mui/icons-material/Slideshow';
import { Link as RouterLink } from 'react-router-dom';

const EmptyBrdgeState = ({ onCreateClick, canCreate }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <Box sx={{
                textAlign: 'center',
                py: { xs: 8, sm: 10 },
                px: { xs: 3, sm: 4 },
                background: 'linear-gradient(135deg, rgba(2, 6, 23, 0.9), rgba(7, 11, 35, 0.9))',
                borderRadius: '24px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.3), transparent)',
                }
            }}>
                <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Box sx={{
                        width: { xs: 80, sm: 100 },
                        height: { xs: 80, sm: 100 },
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #22D3EE, #0EA5E9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        mb: 4,
                        boxShadow: '0 12px 24px rgba(34, 211, 238, 0.2)',
                        border: '1px solid rgba(34, 211, 238, 0.3)',
                    }}>
                        <PresentationIcon sx={{
                            fontSize: { xs: 36, sm: 42 },
                            color: 'white',
                            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))'
                        }} />
                    </Box>
                </motion.div>

                <Typography variant="h4" sx={{
                    fontWeight: 700,
                    color: 'white',
                    fontSize: { xs: '1.75rem', sm: '2.25rem' },
                    mb: 2,
                    background: 'linear-gradient(to right, #FFFFFF 30%, rgba(255, 255, 255, 0.8))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                    fontFamily: 'Satoshi',
                }}>
                    Create Your First Bridge
                </Typography>

                <Typography variant="body1" sx={{
                    mb: 6,
                    maxWidth: '500px',
                    mx: 'auto',
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    lineHeight: 1.6,
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: 'Satoshi',
                }}>
                    Turn your content into an interactive AI experience with your own voice assistant.
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
                                py: 1.5,
                                px: 4,
                                borderRadius: '12px',
                                fontSize: '1rem',
                                background: 'linear-gradient(135deg, #22D3EE, #0EA5E9)',
                                color: 'white',
                                fontWeight: 600,
                                textTransform: 'none',
                                fontFamily: 'Satoshi',
                                boxShadow: '0 8px 24px rgba(34, 211, 238, 0.25)',
                                border: '1px solid rgba(34, 211, 238, 0.3)',
                                backdropFilter: 'blur(8px)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #0EA5E9, #22D3EE)',
                                    boxShadow: '0 8px 32px rgba(34, 211, 238, 0.35)',
                                }
                            }}
                        >
                            Create New Bridge
                        </Button>
                    </motion.div>
                ) : (
                    <Button
                        component={RouterLink}
                        to="/profile"
                        variant="contained"
                        sx={{
                            borderRadius: '12px',
                            py: 1.5,
                            px: 4,
                            background: 'linear-gradient(135deg, #22D3EE, #0EA5E9)',
                            color: 'white',
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            fontFamily: 'Satoshi',
                            boxShadow: '0 8px 24px rgba(34, 211, 238, 0.25)',
                            border: '1px solid rgba(34, 211, 238, 0.3)',
                            backdropFilter: 'blur(8px)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #0EA5E9, #22D3EE)',
                                boxShadow: '0 8px 32px rgba(34, 211, 238, 0.35)',
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