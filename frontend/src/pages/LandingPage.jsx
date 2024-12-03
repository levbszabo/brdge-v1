// src/pages/LandingPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Typography, Button, Container, Grid, Box,
    useTheme, Paper, Tabs, Tab, useMediaQuery, Icon
} from '@mui/material';
import {
    CloudUpload, RecordVoiceOver, Slideshow,
    Group, Support, ArrowForward, School, Refresh, Chat,
    AutoAwesome, Speed, Mic, Description, VolumeUp, Share,
    Handshake, TrendingUp, Devices, MenuBook, ArrowDownward
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
    return (
        <Box sx={{
            py: { xs: 8, md: 16 },
            position: 'relative',
        }}>
            <Container maxWidth="lg">
                {/* Section Title */}
                <Box sx={{ mb: 8 }}>
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
                    <Typography variant="h2" sx={{
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        fontWeight: 500,
                        lineHeight: 1.2,
                        maxWidth: '800px'
                    }}>
                        Transform Your Presentations with AI-Powered Delivery
                    </Typography>
                </Box>

                {/* Feature Cards */}
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{
                            bgcolor: 'rgba(0, 11, 31, 0.95)',
                            p: 4,
                            borderRadius: 4,
                            height: '100%',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.1)',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(135deg, rgba(0,180,219,0.1) 0%, transparent 100%)',
                                zIndex: 0
                            }
                        }}>
                            {/* Decorative Line Art */}
                            <Box sx={{
                                position: 'absolute',
                                bottom: 20,
                                right: 20,
                                width: '120px',
                                height: '120px',
                                opacity: 0.1,
                                background: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20,20 L100,20 M20,60 L100,60 M20,100 L100,100' stroke='white' stroke-width='2' fill='none'/%3E%3C/svg%3E")`
                            }} />

                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Typography variant="h5" gutterBottom sx={{
                                    fontWeight: 600,
                                    color: '#00ffcc'
                                }}>
                                    Knowledge Acquisition
                                </Typography>
                                <Typography variant="body1" sx={{
                                    color: 'rgba(255,255,255,0.8)',
                                    lineHeight: 1.6
                                }}>
                                    Optimize knowledge retention with AI-powered presentations that adapt to your audience's needs.
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    {/* Repeat similar Grid items for other features */}
                </Grid>

                {/* Stats/Quote Section */}
                <Box sx={{
                    mt: 12,
                    p: 6,
                    borderRadius: 4,
                    bgcolor: 'rgba(0, 11, 31, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center'
                }}>
                    <Typography variant="h4" sx={{
                        maxWidth: '800px',
                        mx: 'auto',
                        lineHeight: 1.4
                    }}>
                        Transform your presentations with <span style={{ color: '#00ffcc' }}>50% better</span> engagement and retention rates
                    </Typography>
                </Box>
            </Container>
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

// Add the How It Works section with the new design
const HowItWorksSection = () => {
    const steps = [
        {
            title: "Interact with AI",
            description: "Engage with our AI to upload and explain your content effortlessly.",
            icon: "M20,20 L100,20 M20,60 L100,60" // Simple lines for upload
        },
        {
            title: "Generate Script",
            description: "Watch your input transform into a polished, editable script tailored to your voice and style.",
            icon: "M20,40 Q60,20 100,40 M20,60 Q60,80 100,60" // Wavy lines for transformation
        },
        {
            title: "Configure the Agent",
            description: "Clone your voice and fine-tune your AI presenter to deliver your message perfectly.",
            icon: "M30,20 L90,20 L60,60 L30,20 M40,40 L80,40" // Settings-like icon
        },
        {
            title: "Save & Share",
            description: "Distribute your presentation with a shareable link—accessible anywhere.",
            icon: "M20,60 L100,60 M60,20 L60,100" // Plus/share icon
        },
        {
            title: "AI-Powered Playback",
            description: "Let viewers interact with your AI representative in real-time for dynamic Q&A.",
            icon: "M40,20 A20,20 0 1,1 40,80 M60,20 A20,20 0 1,0 60,80" // Wave pattern
        }
    ];

    return (
        <Box sx={{
            py: { xs: 8, sm: 12, md: 16 },
            position: 'relative',
            background: 'linear-gradient(180deg, #00B4DB 0%, #0041C2 100%)',
            mt: -1,
            '&::before': {
                content: '""',
                position: 'absolute',
                top: -2,
                left: 0,
                right: 0,
                height: '150px',
                background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%2300B4DB' d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: 'rotate(180deg)',
                zIndex: 1
            },
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -2,
                left: 0,
                right: 0,
                height: '150px',
                background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%230041C2' d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 1
            }
        }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                {/* Section Title - update colors for better contrast */}
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Button
                        sx={{
                            mb: 3,
                            bgcolor: 'rgba(0,0,0,0.2)',
                            color: 'white',
                            borderRadius: '100px',
                            px: 3,
                            py: 1,
                            textTransform: 'none',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.3)' }
                        }}
                    >
                        The Process
                    </Button>
                    <Typography variant="h2" sx={{
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        fontWeight: 500,
                        lineHeight: 1.2,
                        color: 'white'
                    }}>
                        How Brdge AI Works
                    </Typography>
                </Box>

                {/* Update card styles for better contrast on gradient background */}
                <Grid container spacing={4}>
                    {steps.map((step, index) => (
                        <Grid item xs={12} md={6} lg={index === 4 ? 12 : 6} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                            >
                                <Box sx={{
                                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                                    backdropFilter: 'blur(10px)',
                                    p: 4,
                                    borderRadius: 4,
                                    height: '100%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    flexDirection: index === 4 ? 'row' : 'column',
                                    alignItems: index === 4 ? 'center' : 'flex-start',
                                    gap: 3,
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                    }
                                }}>
                                    {/* Decorative Line Art */}
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 20,
                                        right: 20,
                                        width: '120px',
                                        height: '120px',
                                        opacity: 0.1,
                                        background: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='${step.icon}' stroke='white' stroke-width='2' fill='none'/%3E%3C/svg%3E")`
                                    }} />

                                    <Box sx={{ position: 'relative', zIndex: 1, flex: 1 }}>
                                        <Typography variant="h5" gutterBottom sx={{
                                            fontWeight: 600,
                                            color: '#00ffcc',
                                            mb: 2
                                        }}>
                                            {step.title}
                                        </Typography>
                                        <Typography variant="body1" sx={{
                                            color: 'rgba(255,255,255,0.8)',
                                            lineHeight: 1.6
                                        }}>
                                            {step.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
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
                    <FinalCTA />
                </Container>
            </Box>
        </ParallaxProvider>
    );
}

export default LandingPage;
