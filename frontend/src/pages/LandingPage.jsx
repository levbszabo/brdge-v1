// src/pages/LandingPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Typography, Button, Container, Grid, Box,
    useTheme, Paper, Tabs, Tab, useMediaQuery, Icon,
    Card, CardContent
} from '@mui/material';
import {
    CloudUpload, RecordVoiceOver, Slideshow,
    Group, Support, ArrowForward, School, Refresh, Chat,
    AutoAwesome, Speed, Mic, Description, VolumeUp, Share,
    Handshake, TrendingUp, Devices, MenuBook, ArrowDownward,
    Psychology, Link as LinkIcon, Analytics, BusinessCenter,
    Laptop, Campaign
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
            py: { xs: 8, md: 16 },
            position: 'relative',
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
                        alignItems: 'center'
                    }}>
                        <Button
                            sx={{
                                mb: 3,
                                bgcolor: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                borderRadius: '100px',
                                px: 3,
                                py: 1,
                                textTransform: 'none',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' }
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
                                    justifyContent: 'center'
                                }}>
                                    <Box sx={{
                                        position: 'absolute',
                                        width: '150%',
                                        height: '150%',
                                        background: 'radial-gradient(circle at center, rgba(0,255,204,0.15) 0%, transparent 70%)',
                                        animation: 'pulse 3s infinite'
                                    }} />
                                    <SmartToyIcon sx={{
                                        fontSize: '120px',
                                        color: '#00ffcc',
                                        filter: 'drop-shadow(0 0 20px rgba(0,255,204,0.5))',
                                        animation: 'float 3s ease-in-out infinite'
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
                                    mb: 4,
                                    background: 'linear-gradient(90deg, #00ffcc, #00B4DB)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    Redefining Knowledge Sharing
                                </Typography>
                                <Typography variant="h6" sx={{
                                    color: 'rgba(255,255,255,0.9)',
                                    mb: 4,
                                    lineHeight: 1.8
                                }}>
                                    Create personalized AI representatives that deliver your message with precision and engage your audience in real-time conversations.
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    gap: 3,
                                    mb: 6
                                }}>
                                    <Box sx={{
                                        p: 2,
                                        borderRadius: '15px',
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                    }}>
                                        <Typography variant="h4" sx={{ color: '#00ffcc', mb: 1 }}>
                                            Minutes
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                            Setup Time
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        p: 2,
                                        borderRadius: '15px',
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                    }}>
                                        <Typography variant="h4" sx={{ color: '#00ffcc', mb: 1 }}>
                                            24/7
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                            Availability
                                        </Typography>
                                    </Box>
                                </Box>
                                <Button
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowForward />}
                                    sx={{
                                        bgcolor: '#00ffcc',
                                        color: '#000B1F',
                                        px: 4,
                                        py: 2,
                                        borderRadius: '100px',
                                        '&:hover': {
                                            bgcolor: '#00e6b8'
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
                        Revolutionize Presentations with AI
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
                        Meet the future of presentations: AI agents that deliver, explain, and interact—all in your voice.
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
    const steps = [
        {
            title: "Interact with AI",
            description: "Engage with our AI to upload and explain your content effortlessly.",
            icon: <CloudUpload sx={{ fontSize: 40 }} />,
            color: "#00ffcc"
        },
        {
            title: "Generate Script",
            description: "Watch your input transform into a polished, editable script tailored to your voice and style.",
            icon: <Description sx={{ fontSize: 40 }} />,
            color: "#4dffdb"
        },
        {
            title: "Configure the Agent",
            description: "Clone your voice and fine-tune your AI presenter to deliver your message perfectly.",
            icon: <SmartToyIcon sx={{ fontSize: 40 }} />,
            color: "#80ffe6"
        },
        {
            title: "Save & Share",
            description: "Distribute your presentation with a shareable link—accessible anywhere.",
            icon: <Share sx={{ fontSize: 40 }} />,
            color: "#b3fff0"
        },
        {
            title: "AI-Powered Playback",
            description: "Let viewers interact with your AI representative in real-time for dynamic Q&A.",
            icon: <Chat sx={{ fontSize: 40 }} />,
            color: "#e6fffa"
        }
    ];

    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    return (
        <Box sx={{
            py: { xs: 8, sm: 12, md: 16 },
            position: 'relative',
            background: 'linear-gradient(180deg, #00B4DB 0%, #0041C2 100%)',
            mt: -1
        }}>
            <Container maxWidth="lg" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <Box sx={{ mb: 8, textAlign: 'center' }}>
                        <Typography variant="h2" sx={{
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            fontWeight: 600,
                            color: 'white',
                            mb: 2
                        }}>
                            How Brdge AI Works
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4
                    }}>
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: index * 0.2, duration: 0.8 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            '& .step-icon': {
                                                transform: 'scale(1.1) rotate(10deg)',
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        p: 4,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        position: 'relative',
                                        zIndex: 1
                                    }}>
                                        <Box
                                            className="step-icon"
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                                color: step.color,
                                                transition: 'transform 0.3s ease-in-out',
                                                flexShrink: 0
                                            }}
                                        >
                                            {step.icon}
                                        </Box>
                                        <Box>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    color: step.color,
                                                    fontWeight: 600,
                                                    mb: 1
                                                }}
                                            >
                                                {step.title}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.8)'
                                                }}
                                            >
                                                {step.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            width: '150px',
                                            height: '150px',
                                            background: `radial-gradient(circle at 100% 0%, ${step.color}20 0%, transparent 70%)`,
                                            opacity: 0.5
                                        }}
                                    />
                                </Paper>
                            </motion.div>
                        ))}
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

// Update the Final Call to Action section
const FinalCTA = () => {
    return (
        <Box sx={{
            my: { xs: 8, md: 16 },
            textAlign: 'center',
            py: { xs: 6, md: 8 },
            px: { xs: 2, md: 4 },
            background: 'rgba(0, 11, 31, 0.95)',
            borderRadius: { xs: '24px', md: 4 },
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '5px',
                background: 'linear-gradient(90deg, #00B4DB, #0041C2)',
            }
        }}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Typography variant="h3" component="h2" gutterBottom sx={{
                    fontWeight: 'bold',
                    mb: { xs: 2, md: 4 },
                    color: 'white',
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
                }}>
                    Ready to <span style={{ color: '#00ffcc' }}>Transform</span> Your Knowledge Sharing?
                </Typography>
                <Typography variant="h6" component="p" gutterBottom sx={{
                    mb: { xs: 3, md: 6 },
                    maxWidth: '800px',
                    mx: 'auto',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                }}>
                    Join us today and revolutionize the way you share and interact with information.
                </Typography>
                <Button
                    component={Link}
                    to="/signup"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                        py: { xs: 1.5, md: 2 },
                        px: { xs: 4, md: 6 },
                        fontSize: { xs: '1rem', md: '1.2rem' },
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                        borderRadius: '50px',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    Sign Up For Free
                </Button>
            </motion.div>
        </Box>
    );
};

// Key Use Cases Section
const KeyUseCases = () => {
    const useCases = [
        {
            title: "Effortless Onboarding",
            description: "Streamline employee training with consistent, interactive AI sessions.",
            icon: <School sx={{ fontSize: 40 }} />,
            color: "#4dffdb"
        },
        {
            title: "Sales Empowerment",
            description: "Deliver engaging pitches that adapt to client questions on the spot.",
            icon: <BusinessCenter sx={{ fontSize: 40 }} />,
            color: "#00ffcc"
        },
        {
            title: "Product Showcases",
            description: "Create immersive product demos that respond to customer needs dynamically.",
            icon: <Laptop sx={{ fontSize: 40 }} />,
            color: "#80ffe6"
        }
    ];

    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    return (
        <Box sx={{
            py: { xs: 8, sm: 12, md: 16 },
            background: 'linear-gradient(180deg, #0041C2 0%, #000B1F 100%)',
            position: 'relative'
        }}>
            <Container maxWidth="lg" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <Typography variant="h2" align="center" sx={{
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        fontWeight: 600,
                        color: 'white',
                        mb: 8
                    }}>
                        Unlock the Power of AI Presentations
                    </Typography>

                    <Grid container spacing={4}>
                        {useCases.map((useCase, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: index * 0.2, duration: 0.8 }}
                                >
                                    <Paper sx={{
                                        p: 4,
                                        height: '100%',
                                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '20px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            '& .use-case-icon': {
                                                transform: 'scale(1.1) rotate(10deg)',
                                            }
                                        }
                                    }}>
                                        <Box
                                            className="use-case-icon"
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                                color: useCase.color,
                                                transition: 'transform 0.3s ease-in-out',
                                                mb: 3
                                            }}
                                        >
                                            {useCase.icon}
                                        </Box>
                                        <Typography variant="h5" sx={{
                                            color: useCase.color,
                                            fontWeight: 600,
                                            mb: 2
                                        }}>
                                            {useCase.title}
                                        </Typography>
                                        <Typography variant="body1" sx={{
                                            color: 'rgba(255, 255, 255, 0.8)'
                                        }}>
                                            {useCase.description}
                                        </Typography>
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

// Feature Highlights Section
const FeatureHighlights = () => {
    const features = [
        {
            title: "AI Interaction First",
            description: "Offload content directly to the AI, simplifying setup and creating smarter, faster presentations.",
            icon: <Psychology sx={{ fontSize: 40 }} />,
            color: "#00ffcc"
        },
        {
            title: "Voice Cloning",
            description: "Add a personal touch by cloning your voice, making your AI presenter uniquely yours.",
            icon: <Campaign sx={{ fontSize: 40 }} />,
            color: "#4dffdb"
        },
        {
            title: "Dynamic Q&A",
            description: "Engage your audience with interactive, real-time answers powered by AI.",
            icon: <Chat sx={{ fontSize: 40 }} />,
            color: "#80ffe6"
        },
        {
            title: "Easy Sharing",
            description: "Effortlessly distribute your AI-powered presentations through simple, shareable links.",
            icon: <LinkIcon sx={{ fontSize: 40 }} />,
            color: "#b3fff0"
        },
        {
            title: "Scalable Use Cases",
            description: "Adapt to any need—be it sales, onboarding, or team training—with seamless scalability.",
            icon: <Analytics sx={{ fontSize: 40 }} />,
            color: "#e6fffa"
        }
    ];

    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    return (
        <Box sx={{
            py: { xs: 8, sm: 12, md: 16 },
            background: 'linear-gradient(180deg, #000B1F 0%, #000000 100%)',
            position: 'relative'
        }}>
            <Container maxWidth="lg" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <Typography variant="h2" align="center" sx={{
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        fontWeight: 600,
                        color: 'white',
                        mb: 2
                    }}>
                        What Sets Brdge AI Apart
                    </Typography>
                    <Typography variant="h5" align="center" sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        mb: 8,
                        maxWidth: '800px',
                        mx: 'auto'
                    }}>
                        Revolutionizing Communication: Personalization and Engagement at Scale
                    </Typography>

                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: index * 0.2, duration: 0.8 }}
                                >
                                    <Paper sx={{
                                        p: 4,
                                        height: '100%',
                                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '20px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            '& .feature-icon': {
                                                transform: 'scale(1.1) rotate(10deg)',
                                            }
                                        }
                                    }}>
                                        <Box
                                            className="feature-icon"
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                                color: feature.color,
                                                transition: 'transform 0.3s ease-in-out',
                                                mb: 3
                                            }}
                                        >
                                            {feature.icon}
                                        </Box>
                                        <Typography variant="h5" sx={{
                                            color: feature.color,
                                            fontWeight: 600,
                                            mb: 2
                                        }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body1" sx={{
                                            color: 'rgba(255, 255, 255, 0.8)'
                                        }}>
                                            {feature.description}
                                        </Typography>
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
                background: 'linear-gradient(180deg, #b0fff5 0%, #00B4DB 30%, #000B1F 65%, #000000 100%)',
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
                    <KeyUseCases />
                    <FeatureHighlights />
                    <FinalCTA />
                </Container>
            </Box>
        </ParallaxProvider>
    );
}

export default LandingPage;
