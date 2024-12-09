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

// Reuse FeatureCard component
const FeatureCard = ({ icon, title, description }) => {
    const theme = useTheme();
    return (
        <Paper elevation={3} sx={{
            p: 4,
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
            py: { xs: 4, md: 8 },
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
            <Container maxWidth="lg" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    {/* Section Title */}
                    <Box sx={{
                        mb: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative'
                    }}>
                        <Box sx={{
                            position: 'absolute',
                            top: '-50%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '200px',
                            height: '200px',
                            background: 'linear-gradient(45deg, rgba(0,255,204,0.1), rgba(0,180,219,0.1))',
                            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                            animation: 'rotate 20s linear infinite'
                        }} />
                        <Button
                            sx={{
                                mb: 3,
                                bgcolor: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                borderRadius: '100px',
                                px: 3,
                                py: 1,
                                textTransform: 'none',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.15)',
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
                                    transition: 'transform 0.5s',
                                }
                            }}
                        >
                            Why Brdge AI?
                        </Button>
                    </Box>

                    {/* Main Content */}
                    <Grid container spacing={8} alignItems="center">
                        {/* Left Column - Visual */}
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.2, duration: 0.8 }}
                            >
                                <Box sx={{
                                    position: 'relative',
                                    height: '400px',
                                    borderRadius: '30px',
                                    overflow: 'hidden',
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)',
                                        opacity: 0.5
                                    }
                                }}>
                                    <Box sx={{
                                        position: 'absolute',
                                        width: '150%',
                                        height: '150%',
                                        background: 'radial-gradient(circle at center, rgba(0,255,204,0.15) 0%, transparent 70%)',
                                        animation: 'pulse 3s infinite'
                                    }} />
                                    <Box sx={{
                                        position: 'absolute',
                                        top: '20%',
                                        left: '5%',
                                        width: '300px',
                                        height: '300px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '50%',
                                        animation: 'rotate 20s linear infinite',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: -1,
                                            borderRadius: 'inherit',
                                            padding: '1px',
                                            background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2))',
                                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                            WebkitMaskComposite: 'xor',
                                            maskComposite: 'exclude'
                                        }
                                    }} />
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: '15%',
                                        right: '10%',
                                        width: '200px',
                                        height: '200px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '50%',
                                        animation: 'rotate 15s linear infinite reverse',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: -1,
                                            borderRadius: 'inherit',
                                            padding: '1px',
                                            background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2))',
                                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                            WebkitMaskComposite: 'xor',
                                            maskComposite: 'exclude'
                                        }
                                    }} />
                                    <SmartToyIcon sx={{
                                        fontSize: '120px',
                                        color: '#00ffcc',
                                        filter: 'drop-shadow(0 0 20px rgba(0,255,204,0.5))',
                                        animation: 'float 3s ease-in-out infinite',
                                        position: 'relative',
                                        zIndex: 1
                                    }} />
                                </Box>
                            </motion.div>
                        </Grid>

                        {/* Right Column - Text Content */}
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.4, duration: 0.8 }}
                            >
                                <Typography variant="h3" sx={{
                                    fontWeight: 600,
                                    mb: 2,
                                    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                                    background: 'linear-gradient(90deg, #FFFFFF, #E0E0E0)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textShadow: '0 2px 10px rgba(255,255,255,0.3)',
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: '-8px',
                                        left: 0,
                                        width: '60px',
                                        height: '4px',
                                        background: 'linear-gradient(90deg, #FFFFFF, #E0E0E0)',
                                        borderRadius: '2px',
                                        boxShadow: '0 2px 10px rgba(255,255,255,0.2)'
                                    }
                                }}>
                                    Redefining Knowledge Sharing
                                </Typography>
                                <Typography variant="h5" sx={{
                                    color: '#FFFFFF',
                                    mb: 2,
                                    maxWidth: '800px',
                                    opacity: 0.8,
                                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                                    fontWeight: 400,
                                    lineHeight: 1.6,
                                    textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                                }}>
                                    Brdge AI transforms static content into a living, conversational expert—no coding required. Simply chat with our system, provide your materials, and within minutes your AI guide is answering questions and engaging users anytime, anywhere.
                                </Typography>
                                <Typography variant="h5" sx={{
                                    color: '#FFFFFF',
                                    mb: 3,
                                    maxWidth: '800px',
                                    opacity: 0.8,
                                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                                    fontWeight: 400,
                                    lineHeight: 1.6,
                                    textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                                }}>
                                    From helping customers understand products, to training new hires, to deepening a learner's grasp of a course—
                                    Brdge AI eliminates repetitive tasks so you can spend time on what truly matters by turning every interaction into a value-driven moment, and preserves the authenticity of your own voice to build trust with your audience.
                                </Typography>
                                <Typography variant="h5" sx={{
                                    color: '#FFFFFF',
                                    mb: 3,
                                    maxWidth: '800px',
                                    opacity: 0.8,
                                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                                    fontWeight: 400,
                                    lineHeight: 1.6,
                                    textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                                }}>
                                    It's about extending your presence so your knowledge is always ready to enlighten, inspire, and connect.
                                </Typography>

                                <Box sx={{
                                    display: 'flex',
                                    gap: 2,
                                    mb: 4
                                }}>
                                    <Box sx={{
                                        p: 2.5,
                                        borderRadius: '16px',
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        minHeight: '140px',
                                        justifyContent: 'center',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '1px',
                                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
                                        }
                                    }}>
                                        <Typography variant="h5" sx={{
                                            color: '#FFFFFF',
                                            mb: 1,
                                            textShadow: '0 2px 10px rgba(255,255,255,0.2)',
                                            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                                        }}>
                                            Minutes
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: 'rgba(255,255,255,0.9)',
                                            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                                            maxWidth: '160px'
                                        }}>
                                            Get started in under 10 minutes
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        p: 2.5,
                                        borderRadius: '16px',
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        minHeight: '140px',
                                        justifyContent: 'center',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '1px',
                                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
                                        }
                                    }}>
                                        <Typography variant="h5" sx={{
                                            color: '#FFFFFF',
                                            mb: 1,
                                            textShadow: '0 2px 10px rgba(255,255,255,0.2)',
                                            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                                        }}>
                                            24/7
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: 'rgba(255,255,255,0.9)',
                                            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                                            maxWidth: '160px'
                                        }}>
                                            Always on, always ready to help
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        p: 2.5,
                                        borderRadius: '16px',
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        minHeight: '140px',
                                        justifyContent: 'center',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '1px',
                                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
                                        }
                                    }}>
                                        <Typography variant="h5" sx={{
                                            color: '#FFFFFF',
                                            mb: 1,
                                            textShadow: '0 2px 10px rgba(255,255,255,0.2)',
                                            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                                        }}>
                                            Your Voice
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: 'rgba(255,255,255,0.9)',
                                            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                                            maxWidth: '160px'
                                        }}>
                                            Present in your own authentic style
                                        </Typography>
                                    </Box>
                                </Box>
                                <Button
                                    component={Link}
                                    to="/signup"
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowForward />}
                                    sx={{
                                        background: 'linear-gradient(45deg, #FFFFFF, #E0E0E0)',
                                        color: '#000000',
                                        px: 4,
                                        py: 2,
                                        borderRadius: '100px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 20px rgba(255,255,255,0.2)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #E0E0E0, #FFFFFF)',
                                            boxShadow: '0 6px 25px rgba(255,255,255,0.3)',
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
                                        }
                                    }}
                                >
                                    Get Started
                                </Button>
                            </motion.div>
                        </Grid>
                    </Grid>
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
            }
        }}>
            <Container maxWidth="lg" sx={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 8
            }}>
                {/* AI Presenter Visualization */}
                <Box
                    sx={{
                        width: '200px',
                        height: '200px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: 4,
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
                            mb: { xs: 2, sm: 3 },
                            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                            lineHeight: 1.1,
                            fontWeight: 700,
                            textTransform: 'none',
                            letterSpacing: '-0.02em'
                        }}
                    >
                        Reimagine Communication
                    </Typography>
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{
                            mb: { xs: 4, sm: 6 },
                            maxWidth: '800px',
                            mx: 'auto',
                            opacity: 0.8,
                            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                            fontWeight: 400
                        }}
                    >
                        Make your knowledge talk. Transform any document, presentation, or training material into an interactive AI guide—available anytime, anywhere.
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        justifyContent: 'center',
                        mt: 4
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
            </Container>

            {/* Scroll Indicator */}
            <Box sx={{
                position: 'absolute',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'rgba(255,255,255,0.6)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                textTransform: 'uppercase'
            }}>
                <Typography variant="body2" sx={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontSize: '0.75rem',
                    opacity: 0.7
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
                    <ArrowDownward sx={{ fontSize: 20 }} />
                </motion.div>
            </Box>
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
            py: { xs: 8, md: 12 },
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
                        mb: 8,
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
                        gap: { xs: 4, md: 2 },
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
                                            fontSize: { xs: '0.9rem', sm: '1rem' },
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
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={inView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: index * 0.2 + 0.1, duration: 0.8 }}
                                        style={{
                                            display: { xs: 'none', md: 'block' }
                                        }}
                                    >
                                        <Box sx={{
                                            width: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <ArrowForward sx={{
                                                color: '#00ffcc',
                                                fontSize: 32,
                                                opacity: 0.8,
                                                filter: 'drop-shadow(0 0 12px rgba(0,255,204,0.4))',
                                                transition: 'all 0.3s ease',
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
            py: { xs: 8, md: 12 },
            textAlign: 'center',
            position: 'relative'
        }}>
            <Container maxWidth="md" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <Typography variant="h2" sx={{
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        fontWeight: 600,
                        color: 'white',
                        mb: 3,
                        background: 'linear-gradient(90deg, #00ffcc, #00B4DB)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textTransform: 'none'
                    }}>
                        Ready To Transform Your Knowledge Sharing?
                    </Typography>
                    <Typography variant="h5" sx={{
                        color: 'rgba(255,255,255,0.8)',
                        mb: 6,
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                        fontWeight: 400,
                        lineHeight: 1.6
                    }}>
                        Join us today and revolutionize the way you share and interact with information.
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        gap: 3,
                        justifyContent: 'center',
                        flexWrap: 'wrap'
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
                    title: "ROI in Action",
                    description: "By cutting repetitive training sessions, teams gain back hours each week. Imagine onboarding 10 new hires: if each saves 2 hours of manager Q&A, that's 20 hours reclaimed."
                },
                {
                    title: "Real-World Impact",
                    description: "A tech startup transformed its onboarding process, shortening ramp-up time by 30% and allowing managers to focus on strategic growth."
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
                    description: "Prospects ask detailed questions at their convenience—no waiting for a salesperson's schedule."
                },
                {
                    title: "Personalized Experience",
                    description: "Each interaction feels tailored, guiding buyers through product features or property details and building trust."
                },
                {
                    title: "ROI in Action",
                    description: "Shorter deal times mean more conversions per month. For a SaaS company, cutting follow-up time by even one day can significantly boost monthly revenue."
                },
                {
                    title: "Real-World Impact",
                    description: "A software vendor integrated Brdge AI to answer common pre-sale inquiries, increasing lead-to-close conversion rates by 15% and freeing the sales team to focus on high-value negotiations."
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
                    description: "Learners ask 'How does this apply to my work?' and get immediate, contextual answers."
                },
                {
                    title: "Deeper Understanding",
                    description: "Turn dry PDFs into dynamic Q&A sessions, improving comprehension and retention."
                },
                {
                    title: "ROI in Action",
                    description: "A course creator sees fewer support tickets and email inquiries, saving time and improving student satisfaction."
                },
                {
                    title: "Real-World Impact",
                    description: "An online training provider integrated Brdge AI into their course library, cutting down learner confusion and increasing positive feedback scores by 20%."
                }
            ]
        }
    ];

    const handleCardClick = (id) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    return (
        <Box sx={{
            py: { xs: 8, md: 12 },
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
                        mb: 2,
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
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }
                    }}>
                        Brdge AI adapts seamlessly to your field—boosting efficiency, engagement, and growth.
                    </Typography>

                    <Grid container spacing={4}>
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
                                            p: 4,
                                            bgcolor: 'rgba(0,255,204,0.03)',
                                            backdropFilter: 'blur(10px)',
                                            borderRadius: '24px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                            minHeight: '320px',
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
                                            fontSize: { xs: '0.95rem', sm: '1rem' }
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
                                                            lineHeight: 1.7
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
