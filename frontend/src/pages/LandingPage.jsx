// src/pages/LandingPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Typography, Button, Container, Grid, Box,
    useTheme, Paper, Tabs, Tab, useMediaQuery, Icon,
    Card, CardContent, Collapse
} from '@mui/material';
import {
    CloudUpload, RecordVoiceOver, Slideshow,
    Group, Support, ArrowForward, School, Refresh, Chat,
    AutoAwesome, Speed, Mic, Description, VolumeUp, Share,
    Handshake, TrendingUp, Devices, MenuBook, ArrowDownward,
    Psychology, Link as LinkIcon, Analytics, BusinessCenter,
    Laptop, Campaign, PlayArrow, Add
} from '@mui/icons-material';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import './LandingPage.css';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useInView } from 'react-intersection-observer';
import HowItWorks from '../components/HowItWorks';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import demoVideo from '../assets/brdge-demo2.mp4';

// Reuse FeatureCard component
const FeatureCard = ({ icon, title, description }) => {
    const theme = useTheme();
    return (
        <Paper elevation={3} sx={{
            p: { xs: 3, md: 4 },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: '16px',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
            '&:hover': {
                transform: 'translateY(-10px)',
                boxShadow: theme.shadows[10],
                background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
            }
        }}>
            <Box sx={{
                color: theme.palette.primary.main,
                fontSize: '4rem',
                mb: 2,
                transition: 'transform 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.1)',
                }
            }}>
                {icon}
            </Box>
            <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" align="center">
                {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
                {description}
            </Typography>
        </Paper>
    );
};

const FeatureItem = ({ icon, title, description }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            mb: 3,
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
                transform: 'translateY(-5px)',
            }
        }}>
            <Icon component={icon} sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
            <Box>
                <Typography variant="h6" gutterBottom><strong>{title}</strong></Typography>
                <Typography variant="body2">{description}</Typography>
            </Box>
        </Box>
    </motion.div>
);

// Introducing Brdge AI
const IntroducingBrdgeAI = () => {
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    return (
        <Box sx={{
            pt: { xs: 0, sm: 2, md: 2 },
            pb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 2, sm: 2, md: 3 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: '10%',
                left: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(0,255,204,0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                animation: 'float 15s infinite alternate'
            },
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '10%',
                right: '-10%',
                width: '700px',
                height: '700px',
                background: 'radial-gradient(circle, rgba(0,180,219,0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                animation: 'float 20s infinite alternate-reverse'
            }
        }}>
            <Container maxWidth="lg" ref={ref} sx={{
                px: { xs: 2, sm: 2, md: 3 },
                mx: 'auto',
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <Typography variant="h2" align="center" sx={{
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        fontWeight: 600,
                        color: 'white',
                        mb: { xs: 3, sm: 4, md: 5 },
                        textTransform: 'capitalize',
                        textShadow: '0 0 20px rgba(255,255,255,0.4)',
                        letterSpacing: '0.02em',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-16px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '80px',
                            height: '4px',
                            background: 'linear-gradient(90deg, #FFFFFF, #E0E0E0)',
                            borderRadius: '2px',
                            boxShadow: '0 2px 10px rgba(255,255,255,0.2)'
                        }
                    }}>
                        Redefining Knowledge Sharing
                    </Typography>

                    <Grid
                        container
                        spacing={{ xs: 1, md: 4 }}
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            mb: { xs: 2, md: 4 },
                            px: { xs: 0, sm: 2 }
                        }}
                    >
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.4, duration: 1.0 }}
                                style={{
                                    margin: '0 -16px',
                                    '@media (min-width: 600px)': {
                                        margin: 0
                                    }
                                }}
                            >
                                <Box sx={{
                                    position: 'relative',
                                    width: '100%',
                                    maxWidth: '900px',
                                    margin: '0 auto',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    bgcolor: 'rgba(2, 6, 23, 0.2)',
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: `
                                        0 8px 32px rgba(0, 0, 0, 0.2),
                                        0 0 40px rgba(0, 180, 219, 0.15),
                                        inset 0 0 30px rgba(0, 180, 219, 0.1)
                                    `,
                                    mb: { xs: 1, md: 0 },
                                    height: { xs: '300px', sm: '350px', md: '400px' },
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        inset: '0',
                                        background: 'linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.1) 50%, transparent 80%)',
                                        animation: 'shimmer 2s infinite',
                                    },
                                }}>
                                    <video
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        style={{
                                            position: 'absolute',
                                            top: '0',
                                            left: '0',
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            padding: '0',
                                        }}
                                    >
                                        <source src={demoVideo} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </Box>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12} md={6} sx={{
                            pl: { md: 4 },
                            mt: { xs: 1, md: 0 }
                        }}>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.4, duration: 0.8 }}
                            >
                                <Typography variant="h5" sx={{
                                    color: '#FFFFFF',
                                    mb: 3,
                                    maxWidth: '800px',
                                    fontSize: { xs: '1.125rem', sm: '1.2rem', md: '1.25rem' },
                                    fontWeight: 400,
                                    lineHeight: { xs: 1.5, md: 1.6 },
                                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                    '& strong': {
                                        color: '#00ffcc',
                                        fontWeight: 600,
                                        textShadow: '0 0 10px rgba(0,255,204,0.3)',
                                    },
                                    animation: 'fadeInUp 0.8s ease-out 0.4s backwards',
                                }}>
                                    Transform static content into a <strong> voice-based AI Agent</strong>—<strong>no coding required</strong>. Simply chat with our system and watch your knowledge come alive.
                                </Typography>

                                <Typography variant="h5" sx={{
                                    color: '#FFFFFF',
                                    mb: 3,
                                    maxWidth: '800px',
                                    fontSize: { xs: '1.125rem', sm: '1.2rem', md: '1.25rem' },
                                    fontWeight: 400,
                                    lineHeight: { xs: 1.5, md: 1.6 },
                                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                    '& strong': {
                                        color: '#00ffcc',
                                        fontWeight: 600,
                                        textShadow: '0 0 10px rgba(0,255,204,0.3)',
                                    },
                                    animation: 'fadeInUp 0.8s ease-out 0.2s backwards',
                                }}>
                                    From <strong>customer support</strong> to <strong>employee training</strong>, Brdge AI eliminates repetitive tasks while preserving your authentic voice. Turn every interaction into a <strong>value-driven moment</strong>, available <strong>24/7</strong>.
                                </Typography>

                                <Typography variant="h5" sx={{
                                    color: '#FFFFFF',
                                    mb: 3,
                                    maxWidth: '800px',
                                    fontSize: { xs: '1.125rem', sm: '1.2rem', md: '1.25rem' },
                                    fontWeight: 400,
                                    lineHeight: { xs: 1.5, md: 1.6 },
                                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                    '& strong': {
                                        color: '#00ffcc',
                                        fontWeight: 600,
                                        textShadow: '0 0 10px rgba(0,255,204,0.3)',
                                    },
                                    animation: 'fadeInUp 0.8s ease-out 0.4s backwards',
                                }}>
                                    Extend your presence and let your expertise <strong>enlighten, inspire, and connect</strong> with your audience—anytime, anywhere.
                                </Typography>
                            </motion.div>
                        </Grid>
                    </Grid>

                    <Box sx={{
                        display: 'flex',
                        gap: { xs: 3, sm: 2 },
                        justifyContent: 'center',
                        mt: { xs: 6, md: 4 },
                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                        px: { xs: 2, sm: 0 },
                    }}>
                        <Box sx={{
                            p: { xs: 3, sm: 2.5 },
                            borderRadius: '16px',
                            bgcolor: 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255, 0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: `
                                0 4px 20px rgba(0,0,0,0.2),
                                0 0 0 1px rgba(255,255,255,0.1),
                                0 0 40px rgba(0,180,219,0.1)
                            `,
                            flex: { xs: '1 1 100%', sm: '1' },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            minHeight: { xs: '120px', sm: '140px' },
                            justifyContent: 'center',
                            maxWidth: { xs: '100%', sm: '200px' },
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: `
                                    0 8px 30px rgba(0,0,0,0.3),
                                    0 0 0 1px rgba(255,255,255,0.2),
                                    0 0 60px rgba(0,180,219,0.2)
                                `,
                                bgcolor: 'rgba(255,255,255,0.08)',
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '1px',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                                opacity: 0,
                                transition: 'opacity 0.3s ease-in-out',
                            },
                            '&:hover::after': {
                                opacity: 1,
                            }
                        }}>
                            <Typography variant="h5" sx={{
                                color: '#FFFFFF',
                                mb: 1,
                                textShadow: '0 2px 10px rgba(255,255,255,0.2)',
                                fontSize: { xs: '1.5rem', sm: '1.5rem', md: '1.75rem' }
                            }}>
                                Minutes
                            </Typography>
                            <Typography variant="body2" sx={{
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: { xs: '0.95rem', sm: '0.9rem', md: '1rem' },
                                maxWidth: '160px'
                            }}>
                                Get started in under 10 minutes
                            </Typography>
                        </Box>
                        <Box sx={{
                            p: { xs: 3, sm: 2.5 },
                            borderRadius: '16px',
                            bgcolor: 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255, 0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: `
                                0 4px 20px rgba(0,0,0,0.2),
                                0 0 0 1px rgba(255,255,255,0.1),
                                0 0 40px rgba(0,180,219,0.1)
                            `,
                            flex: { xs: '1 1 100%', sm: '1' },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            minHeight: { xs: '120px', sm: '140px' },
                            justifyContent: 'center',
                            maxWidth: { xs: '100%', sm: '200px' },
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: `
                                    0 8px 30px rgba(0,0,0,0.3),
                                    0 0 0 1px rgba(255,255,255,0.2),
                                    0 0 60px rgba(0,180,219,0.2)
                                `,
                                bgcolor: 'rgba(255,255,255,0.08)',
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '1px',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                                opacity: 0,
                                transition: 'opacity 0.3s ease-in-out',
                            },
                            '&:hover::after': {
                                opacity: 1,
                            }
                        }}>
                            <Typography variant="h5" sx={{
                                color: '#FFFFFF',
                                mb: 1,
                                textShadow: '0 2px 10px rgba(255,255,255,0.2)',
                                fontSize: { xs: '1.5rem', sm: '1.5rem', md: '1.75rem' }
                            }}>
                                24/7
                            </Typography>
                            <Typography variant="body2" sx={{
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: { xs: '0.95rem', sm: '0.9rem', md: '1rem' },
                                maxWidth: '160px'
                            }}>
                                Always on, always ready to help
                            </Typography>
                        </Box>
                        <Box sx={{
                            p: { xs: 3, sm: 2.5 },
                            borderRadius: '16px',
                            bgcolor: 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255, 0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: `
                                0 4px 20px rgba(0,0,0,0.2),
                                0 0 0 1px rgba(255,255,255,0.1),
                                0 0 40px rgba(0,180,219,0.1)
                            `,
                            flex: { xs: '1 1 100%', sm: '1' },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            minHeight: { xs: '120px', sm: '140px' },
                            justifyContent: 'center',
                            maxWidth: { xs: '100%', sm: '200px' },
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: `
                                    0 8px 30px rgba(0,0,0,0.3),
                                    0 0 0 1px rgba(255,255,255,0.2),
                                    0 0 60px rgba(0,180,219,0.2)
                                `,
                                bgcolor: 'rgba(255,255,255,0.08)',
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '1px',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                                opacity: 0,
                                transition: 'opacity 0.3s ease-in-out',
                            },
                            '&:hover::after': {
                                opacity: 1,
                            }
                        }}>
                            <Typography variant="h5" sx={{
                                color: '#FFFFFF',
                                mb: 1,
                                textShadow: '0 2px 10px rgba(255,255,255,0.2)',
                                fontSize: { xs: '1.5rem', sm: '1.5rem', md: '1.75rem' }
                            }}>
                                Your Voice
                            </Typography>
                            <Typography variant="body2" sx={{
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: { xs: '0.95rem', sm: '0.9rem', md: '1rem' },
                                maxWidth: '160px'
                            }}>
                                Present in your own authentic style
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: { xs: 8, md: 6 },
                        position: 'relative',
                        px: { xs: 2, sm: 0 },
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '200px',
                            height: '200px',
                            background: 'radial-gradient(circle, rgba(0,255,204,0.1) 0%, transparent 70%)',
                            filter: 'blur(20px)',
                            zIndex: 0,
                        }
                    }}>
                        <Button
                            component={Link}
                            to="/signup"
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForward />}
                            sx={{
                                background: 'linear-gradient(45deg, #FFFFFF, #E0E0E0)',
                                color: '#000000',
                                px: { xs: 4, sm: 6 },
                                py: { xs: 1.5, sm: 2 },
                                width: { xs: '100%', sm: 'auto' },
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                fontWeight: 600,
                                borderRadius: '100px',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: `
                                    0 4px 20px rgba(255,255,255,0.2),
                                    0 0 0 1px rgba(255,255,255,0.1),
                                    0 0 40px rgba(0,180,219,0.2)
                                `,
                                zIndex: 1,
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #E0E0E0, #FFFFFF)',
                                    boxShadow: `
                                        0 6px 25px rgba(255,255,255,0.3),
                                        0 0 0 1px rgba(255,255,255,0.2),
                                        0 0 60px rgba(0,180,219,0.3)
                                    `,
                                    transform: 'translateY(-2px)',
                                    '&::after': {
                                        transform: 'translateX(100%)'
                                    }
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: '-100%',
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                                    transition: 'transform 0.5s'
                                },
                                transition: 'all 0.3s ease-in-out',
                            }}
                        >
                            Get Started
                        </Button>
                    </Box>
                </motion.div>
            </Container>

            {/* Add keyframe animations */}
            <style>
                {`
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 0.5; }
                        50% { transform: scale(1.1); opacity: 0.3; }
                        100% { transform: scale(1); opacity: 0.5; }
                    }
                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                        100% { transform: translateY(0px); }
                    }
                    @keyframes rotate {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes borderGlow {
                        0% { opacity: 0.5; }
                        100% { opacity: 1; }
                    }
                    
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>
        </Box>
    );
};

// Update the HeroSection component
const HeroSection = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const iconAnimation = useAnimation();

    const handleMouseMove = (event) => {
        const { clientX, clientY } = event;
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
        const x = (clientX - left) / width;
        const y = (clientY - top) / height;
        setMousePosition({ x, y });
    };

    useEffect(() => {
        const moveX = (mousePosition.x - 0.5) * 20;
        const moveY = (mousePosition.y - 0.5) * 20;
        iconAnimation.start({
            x: moveX,
            y: moveY,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        });
    }, [mousePosition, iconAnimation]);

    return (
        <Box sx={{
            minHeight: '100vh',
            width: '100vw',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(180deg, #000000 0%, #000C1F 35%, #0041C2 70%, #00B4DB 100%)',
            color: 'white',
            overflow: 'hidden',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 30% 40%, rgba(0,65,194,0.4) 0%, transparent 60%)',
                pointerEvents: 'none'
            },
            px: { xs: 2, sm: 0 },
        }}>
            <Container maxWidth="lg" sx={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: { xs: 4, sm: 8 },
                px: { xs: 3, sm: 3, md: 4 },
                width: '100%',
                mx: 'auto',
            }}>
                {/* AI Presenter Visualization */}
                <Box
                    sx={{
                        width: { xs: '140px', sm: '200px' },
                        height: { xs: '140px', sm: '200px' },
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: { xs: 2, sm: 4 },
                        cursor: 'pointer'
                    }}
                    onMouseMove={handleMouseMove}
                >
                    <motion.div
                        animate={iconAnimation}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <SmartToyIcon sx={{
                            fontSize: '100px',
                            color: 'white',
                            filter: 'drop-shadow(0 0 20px rgba(0, 180, 219, 0.5))'
                        }} />
                    </motion.div>
                </Box>

                {/* Hero Content */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <Typography
                        variant="h1"
                        align="center"
                        sx={{
                            mb: { xs: 1.5, sm: 2, md: 3 },
                            fontSize: { xs: '2rem', sm: '3.5rem', md: '4.5rem' },
                            lineHeight: 1.1,
                            fontWeight: 700,
                            textTransform: 'none',
                            letterSpacing: '-0.02em',
                            mx: 'auto',
                            maxWidth: { xs: '100%', sm: '90%', md: '80%' },
                        }}
                    >
                        Reimagine Communication
                    </Typography>
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{
                            mb: { xs: 3, sm: 4, md: 6 },
                            maxWidth: '800px',
                            mx: 'auto',
                            opacity: 0.8,
                            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                            fontWeight: 400,
                            px: { xs: 2, sm: 0 },
                        }}
                    >
                        Make your knowledge talk. Transform any document, presentation, or training material into an interactive AI guide—available anytime, anywhere.
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        gap: { xs: 1.5, sm: 2 },
                        justifyContent: 'center',
                        flexDirection: { xs: 'column', sm: 'row' },
                        width: { xs: '90%', sm: 'auto' },
                        px: { xs: 2, sm: 0 },
                        mx: 'auto',
                    }}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                component={Link}
                                to="/signup"
                                variant="contained"
                                size="large"
                                sx={{
                                    bgcolor: 'white',
                                    color: '#0041C2',
                                    px: { xs: 4, md: 6 },
                                    py: { xs: 1.5, md: 2 },
                                    fontSize: { xs: '1rem', md: '1.2rem' },
                                    fontWeight: 600,
                                    borderRadius: '50px',
                                    boxShadow: '0 0 20px rgba(255,255,255,0.3)',
                                    width: { xs: '100%', sm: 'auto' },
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.9)',
                                        boxShadow: '0 0 30px rgba(255,255,255,0.5)'
                                    }
                                }}
                            >
                                Start Free Today
                            </Button>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                component={Link}
                                to="/demos"
                                variant="outlined"
                                size="large"
                                sx={{
                                    color: 'white',
                                    borderColor: 'rgba(255,255,255,0.5)',
                                    borderWidth: '2px',
                                    px: { xs: 4, md: 6 },
                                    py: { xs: 1.5, md: 2 },
                                    fontSize: { xs: '1rem', md: '1.2rem' },
                                    fontWeight: 600,
                                    borderRadius: '50px',
                                    width: { xs: '100%', sm: 'auto' },
                                    '&:hover': {
                                        borderColor: 'white',
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        borderWidth: '2px'
                                    }
                                }}
                            >
                                Watch Demo
                            </Button>
                        </motion.div>
                    </Box>
                </motion.div>

                {/* Move scroll indicator here, after the buttons */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    mt: { xs: 3, sm: 4 },
                    color: 'rgba(255,255,255,0.8)',
                    textTransform: 'uppercase',
                }}>
                    <Typography variant="body2" sx={{
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontSize: '0.75rem',
                        opacity: 0.9,
                        fontWeight: 500,
                    }}>
                        Scroll for more
                    </Typography>
                    <motion.div
                        animate={{
                            y: [0, 10, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <ArrowDownward sx={{
                            fontSize: 24,
                            color: '#00ffcc',
                            filter: 'drop-shadow(0 0 8px rgba(0,255,204,0.4))'
                        }} />
                    </motion.div>
                </Box>
            </Container>
        </Box>
    );
};

// Update the How It Works section with the new design
const HowItWorksSection = () => {
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    const steps = [
        {
            icon: <Box sx={{ position: 'relative' }}>
                <CloudUpload sx={{ fontSize: 56, color: '#00ffcc' }} />
                <Description sx={{
                    fontSize: 28,
                    position: 'absolute',
                    bottom: -12,
                    right: -12,
                    color: '#00ffcc'
                }} />
            </Box>,
            title: "Upload & Present",
            description: "Add your slides and explain them in your own words"
        },
        {
            icon: <SmartToyIcon sx={{ fontSize: 56, color: '#4dffdb' }} />,
            title: "Refine with AI",
            description: "Answer the AI's questions to clarify and enrich your content"
        },
        {
            icon: <Mic sx={{ fontSize: 56, color: '#80ffe6' }} />,
            title: "Personalize Voice",
            description: "Clone your voice for authentic delivery"
        },
        {
            icon: <Box sx={{ position: 'relative' }}>
                <Share sx={{ fontSize: 56, color: '#b3fff0' }} />
                <Chat sx={{
                    fontSize: 28,
                    position: 'absolute',
                    bottom: -12,
                    right: -12,
                    color: '#b3fff0'
                }} />
            </Box>,
            title: "Share & Interact",
            description: "Get a shareable link—viewers ask, AI answers, anytime"
        }
    ];

    return (
        <Box sx={{
            pt: { xs: 2, sm: 4, md: 8 },
            pb: { xs: 4, sm: 6, md: 8 },
            px: { xs: 2, sm: 3, md: 4 },
            position: 'relative',
            overflow: 'hidden'
        }}>
            <Container maxWidth="lg" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <Typography variant="h2" align="center" sx={{
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        fontWeight: 600,
                        color: 'white',
                        mb: { xs: 4, sm: 6, md: 8 },
                        textTransform: 'capitalize',
                        textShadow: '0 0 20px rgba(255,255,255,0.4)',
                        letterSpacing: '0.02em',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-16px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '80px',
                            height: '4px',
                            background: 'linear-gradient(90deg, #FFFFFF, #E0E0E0)',
                            borderRadius: '2px',
                            boxShadow: '0 2px 10px rgba(255,255,255,0.2)'
                        }
                    }}>
                        How It Works
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        gap: { xs: 2, md: 2 },
                        maxWidth: '1200px',
                        mx: 'auto',
                        px: 2
                    }}>
                        {steps.map((step, index) => (
                            <React.Fragment key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: index * 0.2, duration: 0.8 }}
                                    style={{ zIndex: 1 }}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        position: 'relative',
                                        maxWidth: '220px'
                                    }}>
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                padding: '20px',
                                                marginBottom: '16px',
                                                background: 'rgba(0,255,204,0.05)',
                                                borderRadius: '20px',
                                                boxShadow: '0 0 20px rgba(0,255,204,0.1)'
                                            }}
                                        >
                                            {step.icon}
                                        </motion.div>
                                        <Typography variant="h5" sx={{
                                            color: 'white',
                                            fontWeight: 600,
                                            mb: 1,
                                            fontSize: { xs: '1.25rem', sm: '1.4rem' },
                                            textShadow: '0 0 20px rgba(255,255,255,0.4)',
                                            letterSpacing: '0.02em'
                                        }}>
                                            {step.title}
                                        </Typography>
                                        <Typography variant="body1" sx={{
                                            color: 'rgba(255,255,255,0.9)',
                                            fontSize: { xs: '0.95rem', sm: '1rem' },
                                            lineHeight: 1.5,
                                            maxWidth: '200px',
                                            textShadow: '0 0 10px rgba(255,255,255,0.2)',
                                            minHeight: '48px'
                                        }}>
                                            {step.description}
                                        </Typography>
                                    </Box>
                                </motion.div>
                                {index < steps.length - 1 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={inView ? { opacity: 1 } : {}}
                                        transition={{ delay: index * 0.2 + 0.1, duration: 0.8 }}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: { xs: '40px', md: '40px' },
                                            height: { xs: '40px', md: '40px' },
                                            my: { xs: 2, md: 0 }
                                        }}>
                                            <ArrowDownward sx={{
                                                color: '#00ffcc',
                                                fontSize: 32,
                                                opacity: 0.8,
                                                filter: 'drop-shadow(0 0 12px rgba(0,255,204,0.4))',
                                                transition: 'all 0.3s ease',
                                                display: { xs: 'block', md: 'none' },
                                                '&:hover': {
                                                    transform: 'scale(1.1)',
                                                    filter: 'drop-shadow(0 0 16px rgba(0,255,204,0.6))'
                                                }
                                            }} />
                                            <ArrowForward sx={{
                                                color: '#00ffcc',
                                                fontSize: 32,
                                                opacity: 0.8,
                                                filter: 'drop-shadow(0 0 12px rgba(0,255,204,0.4))',
                                                transition: 'all 0.3s ease',
                                                display: { xs: 'none', md: 'block' },
                                                '&:hover': {
                                                    transform: 'scale(1.1)',
                                                    filter: 'drop-shadow(0 0 16px rgba(0,255,204,0.6))'
                                                }
                                            }} />
                                        </Box>
                                    </motion.div>
                                )}
                            </React.Fragment>
                        ))}
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

// Update the FinalCTA section
const FinalCTA = () => {
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    return (
        <Box sx={{
            pt: { xs: 2, sm: 4, md: 8 },
            pb: { xs: 6, sm: 8, md: 12 },
            px: { xs: 2, sm: 3, md: 4 },
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
        }}>
            <Container maxWidth="md" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    style={{ position: 'relative', zIndex: 2 }}
                >
                    <Typography variant="h2" sx={{
                        fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                        fontWeight: 600,
                        color: 'white',
                        mb: 3,
                        background: 'linear-gradient(90deg, #00ffcc, #00B4DB)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textTransform: 'none',
                        px: { xs: 2, sm: 0 },
                    }}>
                        Ready To Transform Your Knowledge Sharing?
                    </Typography>
                    <Typography variant="h5" sx={{
                        color: 'rgba(255,255,255,0.8)',
                        mb: 6,
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                        fontWeight: 400,
                        lineHeight: 1.6,
                        px: { xs: 2, sm: 0 },
                    }}>
                        Join us today and revolutionize the way you share and interact with information.
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        gap: { xs: 2, md: 3 },
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        flexDirection: { xs: 'column', sm: 'row' },
                        width: { xs: '100%', sm: 'auto' },
                        position: 'relative',
                        zIndex: 3
                    }}>
                        <Button
                            component={Link}
                            to="/signup"
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForward />}
                            sx={{
                                bgcolor: '#00ffcc',
                                color: '#000B1F',
                                px: { xs: 4, md: 6 },
                                py: { xs: 1.5, md: 2 },
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                fontWeight: 600,
                                borderRadius: '100px',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    bgcolor: '#00ffcc',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 10px 30px rgba(0,255,204,0.3)',
                                    '&::after': {
                                        transform: 'translateX(100%)'
                                    }
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: '-100%',
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                    transition: 'transform 0.5s'
                                }
                            }}
                        >
                            Get Started Free
                        </Button>

                        <Button
                            component={Link}
                            to="/demos"
                            variant="outlined"
                            size="large"
                            endIcon={<PlayArrow />}
                            sx={{
                                color: 'white',
                                borderColor: 'rgba(255,255,255,0.2)',
                                px: { xs: 4, md: 6 },
                                py: { xs: 1.5, md: 2 },
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                fontWeight: 600,
                                borderRadius: '100px',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease-in-out',
                                width: { xs: '100%', sm: 'auto' },
                                '&:hover': {
                                    borderColor: '#00ffcc',
                                    transform: 'translateY(-3px)',
                                    bgcolor: 'rgba(0,255,204,0.1)',
                                    boxShadow: '0 10px 30px rgba(0,255,204,0.15)',
                                    '&::after': {
                                        transform: 'translateX(100%)'
                                    }
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: '-100%',
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                    transition: 'transform 0.5s'
                                }
                            }}
                        >
                            Watch Demo
                        </Button>
                    </Box>
                </motion.div>
            </Container>

            {/* Background Elements */}
            <Box sx={{
                position: 'absolute',
                top: '-20%',
                left: '-10%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(0,255,204,0.05) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                animation: 'float 15s infinite alternate'
            }} />
            <Box sx={{
                position: 'absolute',
                bottom: '-20%',
                right: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(0,180,219,0.05) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                animation: 'float 20s infinite alternate-reverse'
            }} />
        </Box>
    );
};

// Add this new component
const ImpactSection = () => {
    const [expandedCard, setExpandedCard] = useState(null);
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    const industries = [
        {
            id: 'onboarding',
            icon: <School sx={{ fontSize: 40, color: '#00ffcc' }} />,
            title: "Onboarding & Training",
            subtitle: "Empower new hires with interactive, always-available guidance",
            details: [
                {
                    title: "Reduced Training Time",
                    description: "New employees access interactive Q&A on policies, products, and best practices—no waiting on busy managers."
                },
                {
                    title: "Higher Retention & Engagement",
                    description: "Employees feel supported from day one, reducing confusion and turnover."
                },
                {
                    title: "ROI Potential",
                    description: "By cutting repetitive training sessions, teams can gain back hours each week. With 10 new hires, saving 2 hours of manager Q&A each means 20 hours reclaimed."
                },
                {
                    title: "Projected Impact",
                    description: "Transform your onboarding process to reduce ramp-up time and allow managers to focus on strategic growth rather than repetitive training."
                }
            ]
        },
        {
            id: 'sales',
            icon: <BusinessCenter sx={{ fontSize: 40, color: '#4dffdb' }} />,
            title: "Sales & Customer Engagement",
            subtitle: "Close deals faster with instant, 24/7 product insights",
            details: [
                {
                    title: "Accelerated Sales Cycles",
                    description: "Let prospects explore detailed product information at their convenience—no scheduling delays."
                },
                {
                    title: "Personalized Experience",
                    description: "Create tailored interactions that guide buyers through product features, building trust through consistent, accurate responses."
                },
                {
                    title: "ROI Potential",
                    description: "Reduce response times and increase conversion opportunities by providing instant, accurate product information when prospects need it most."
                },
                {
                    title: "Projected Impact",
                    description: "Enable your sales team to focus on high-value negotiations while AI handles common pre-sale inquiries and product questions 24/7."
                }
            ]
        },
        {
            id: 'education',
            icon: <MenuBook sx={{ fontSize: 40, color: '#80ffe6' }} />,
            title: "Education & Knowledge Hubs",
            subtitle: "Transform static lessons and documents into interactive tutors",
            details: [
                {
                    title: "Instant Clarifications",
                    description: "Enable learners to ask 'How does this apply to my work?' and receive immediate, contextual answers."
                },
                {
                    title: "Deeper Understanding",
                    description: "Convert static PDFs into dynamic Q&A sessions designed to improve comprehension and retention."
                },
                {
                    title: "ROI Potential",
                    description: "Reduce support tickets and email inquiries by providing instant, accurate responses to common student questions."
                },
                {
                    title: "Projected Impact",
                    description: "Enhance your course materials with AI-powered interactions that can provide 24/7 personalized learning support."
                }
            ]
        }
    ];

    const handleCardClick = (id) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    return (
        <Box sx={{
            pt: { xs: 2, sm: 4, md: 8 },
            pb: { xs: 4, sm: 6, md: 8 },
            px: { xs: 2, sm: 3, md: 4 },
            position: 'relative',
            overflow: 'hidden'
        }}>
            <Container maxWidth="lg" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <Typography variant="h2" align="center" sx={{
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        fontWeight: 600,
                        color: 'white',
                        mb: { xs: 4, sm: 6, md: 8 },
                        textTransform: 'capitalize',
                        textShadow: '0 0 20px rgba(255,255,255,0.4)',
                        letterSpacing: '0.02em',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-16px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '80px',
                            height: '4px',
                            background: 'linear-gradient(90deg, #00ffcc, #00B4DB)',
                            borderRadius: '2px',
                            boxShadow: '0 2px 10px rgba(0,255,204,0.3)'
                        }
                    }}>
                        Real Impact Across Industries
                    </Typography>

                    <Typography variant="h5" align="center" sx={{
                        color: 'rgba(255,255,255,0.8)',
                        mb: 8,
                        maxWidth: '800px',
                        mx: 'auto',
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                        px: { xs: 2, sm: 0 },
                    }}>
                        Brdge AI adapts seamlessly to your field—boosting efficiency, engagement, and growth.
                    </Typography>

                    <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                        {industries.map((industry, index) => (
                            <Grid item xs={12} md={4} key={industry.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: index * 0.2, duration: 0.8 }}
                                >
                                    <Paper
                                        onClick={() => handleCardClick(industry.id)}
                                        sx={{
                                            p: { xs: 3, md: 4 },
                                            bgcolor: 'rgba(0,255,204,0.03)',
                                            backdropFilter: 'blur(10px)',
                                            borderRadius: '24px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                            minHeight: { xs: 'auto', md: '320px' },
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: '0 15px 40px rgba(0,255,204,0.15)',
                                                bgcolor: 'rgba(0,255,204,0.05)',
                                                '& .industry-icon': {
                                                    transform: 'scale(1.1) rotate(5deg)',
                                                }
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '1px',
                                                background: 'linear-gradient(90deg, transparent, rgba(0,255,204,0.3), transparent)'
                                            },
                                            ...(expandedCard === industry.id && {
                                                height: 'auto',
                                                '& .MuiCollapse-root': {
                                                    marginTop: 2
                                                }
                                            })
                                        }}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            mb: 3
                                        }}>
                                            <Box className="industry-icon" sx={{
                                                transition: 'transform 0.4s ease',
                                                background: 'rgba(0,255,204,0.1)',
                                                borderRadius: '16px',
                                                p: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {React.cloneElement(industry.icon, {
                                                    sx: {
                                                        fontSize: 48,
                                                        color: '#00ffcc',
                                                        filter: 'drop-shadow(0 0 10px rgba(0,255,204,0.3))'
                                                    }
                                                })}
                                            </Box>
                                            <Add sx={{
                                                color: 'white',
                                                fontSize: 28,
                                                transform: expandedCard === industry.id ? 'rotate(45deg)' : 'none',
                                                transition: 'transform 0.3s ease',
                                                opacity: 0.7,
                                                '&:hover': {
                                                    opacity: 1
                                                }
                                            }} />
                                        </Box>
                                        <Typography variant="h5" sx={{
                                            color: 'white',
                                            fontWeight: 600,
                                            mb: 2,
                                            fontSize: { xs: '1.3rem', sm: '1.4rem' },
                                            textShadow: '0 2px 10px rgba(0,255,204,0.2)'
                                        }}>
                                            {industry.title}
                                        </Typography>
                                        <Typography variant="body1" sx={{
                                            color: 'rgba(255,255,255,0.8)',
                                            mb: 2,
                                            lineHeight: 1.6,
                                            fontSize: { xs: '0.95rem', sm: '1rem' },
                                            px: { xs: 2, sm: 0 },
                                        }}>
                                            {industry.subtitle}
                                        </Typography>
                                        <Collapse in={expandedCard === industry.id}>
                                            <Box sx={{
                                                mt: 4,
                                                pt: 3,
                                                borderTop: '1px solid rgba(255,255,255,0.1)'
                                            }}>
                                                {industry.details.map((detail, idx) => (
                                                    <Box key={idx} sx={{
                                                        mb: 3,
                                                        '&:last-child': { mb: 0 }
                                                    }}>
                                                        <Typography variant="h6" sx={{
                                                            color: '#00ffcc',
                                                            fontWeight: 600,
                                                            mb: 1,
                                                            fontSize: '1rem',
                                                            textShadow: '0 0 10px rgba(0,255,204,0.3)'
                                                        }}>
                                                            {detail.title}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{
                                                            color: 'rgba(255,255,255,0.8)',
                                                            fontSize: '0.9rem',
                                                            lineHeight: 1.7,
                                                            px: { xs: 2, sm: 0 },
                                                        }}>
                                                            {detail.description}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Collapse>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
};

function LandingPage() {
    const theme = useTheme();

    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
        return () => {
            document.documentElement.style.scrollBehavior = 'auto';
        };
    }, []);

    return (
        <ParallaxProvider>
            <Box sx={{
                flexGrow: 1,
                overflow: 'hidden',
                background: 'linear-gradient(180deg, #2ebcda 0%, #00d2ff 30%, #111e38 65%, #0080bf 100%)',
                color: 'white',
                minHeight: '100vh',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 30% 40%, rgba(0,65,194,0.4) 0%, transparent 60%)',
                    pointerEvents: 'none'
                }
            }}>
                <HeroSection />
                <Container maxWidth="lg">
                    <IntroducingBrdgeAI />
                    <HowItWorksSection />
                    <ImpactSection />
                    <FinalCTA />
                </Container>
            </Box>
        </ParallaxProvider>
    );
}

export default LandingPage;
