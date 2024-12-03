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
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const tabDetails = [
        {
            label: "Static",
            icon: <Slideshow />,
            title: 'Static AI Presentation',
            description: 'Traditional presentations with AI-powered delivery. Upload your content and let our AI present it consistently every time.',
            component: (
                <Box sx={{
                    p: 4,
                    textAlign: 'center',
                    bgcolor: 'rgba(0, 65, 194, 0.05)',
                    borderRadius: 2
                }}>
                    <Typography variant="body1">
                        Static presentations allow you to create consistent, AI-powered content delivery.
                        Perfect for standardized training and presentations.
                    </Typography>
                </Box>
            ),
        },
        {
            label: "Agentic",
            icon: <Chat />,
            title: 'Agentic AI Presentation',
            description: 'Interactive presentations that can respond to questions and adapt in real-time.',
            component: (
                <Box sx={{
                    p: 4,
                    textAlign: 'center',
                    bgcolor: 'rgba(0, 180, 219, 0.05)',
                    borderRadius: 2
                }}>
                    <Typography variant="body1">
                        Agentic presentations take it further by enabling real-time interaction.
                        Your AI presenter can answer questions and adapt to your audience's needs.
                    </Typography>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{
            my: { xs: 4, md: 16 },
            background: 'linear-gradient(135deg, #f0f4f8 0%, #e0e8f0 100%)',
            p: { xs: 3, md: 8 },
            borderRadius: 4,
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        }}>
            <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" align="center" sx={{ mb: { xs: 3, md: 6 } }}>
                Introducing Brdge AI
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography variant="body1" paragraph>
                            With Brdge AI, transform any document into a presentation with your chosen script—consistent and ready to go.

                            Simply upload your document, record your walkthrough, set your script, and deploy. Want more interaction?

                            Our Agentic Brdge allows your presentations to respond to questions, creating an engaging, dynamic experience for your audience.
                        </Typography>
                        <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
                            <strong>Key Use Cases:</strong>
                        </Typography>
                        <FeatureItem
                            icon={Handshake}
                            title="Effortlessly Guide New Hires"
                            description="Create AI-powered onboarding sessions that guide new employees through policies, tools, and workflows. Ensure a consistent and engaging experience for every hire."
                        />
                        <FeatureItem
                            icon={TrendingUp}
                            title="Elevate Your Sales Pitches"
                            description="Transform your sales presentations with AI-driven interactivity, adapting to client questions and ensuring every pitch is engaging and effective."
                        />
                        <FeatureItem
                            icon={Devices}
                            title="Showcase Your Products Like Never Before"
                            description="Turn your product demos into dynamic, AI-led experiences that respond to your audience's interactions and highlight key features."
                        />
                    </motion.div>
                </Grid>

                <Grid item xs={12} md={7}>
                    <Box sx={{
                        backgroundColor: '#ffffff',
                        borderRadius: 4,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        p: { xs: 2, md: 4 },
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            sx={{
                                mb: 2,
                                '& .MuiTabs-flexContainer': {
                                    justifyContent: 'center',
                                },
                                '& .MuiTab-root': {
                                    minWidth: 'auto',
                                    px: { xs: 1, md: 2 },
                                    color: 'text.secondary',
                                    '&.Mui-selected': {
                                        color: 'primary.main',
                                        fontWeight: 'bold',
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        borderRadius: '8px',
                                    },
                                },
                                '& .MuiTabs-indicator': {
                                    display: 'none',
                                },
                            }}
                            aria-label="AI Presentation Versions"
                        >
                            {tabDetails.map((tab, index) => (
                                <Tab
                                    key={index}
                                    label={tab.label}
                                    icon={tab.icon}
                                    iconPosition="start"
                                    sx={{
                                        flexDirection: { xs: 'column', md: 'row' },
                                        alignItems: 'center',
                                    }}
                                />
                            ))}
                        </Tabs>
                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={tabValue}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                    style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                                >
                                    <Typography variant="h6" gutterBottom>
                                        {tabDetails[tabValue].title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {tabDetails[tabValue].description}
                                    </Typography>
                                    <Box sx={{ flexGrow: 1, width: '100%', position: 'relative' }}>
                                        {tabDetails[tabValue].component}
                                    </Box>
                                </motion.div>
                            </AnimatePresence>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

// Update the hero section
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
            background: 'linear-gradient(180deg, #000000 0%, #000B1F 35%, #0041C2 70%, #00B4DB 100%)',
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

                {/* Existing Hero Content */}
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
                                    borderRadius: '50px',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.9)'
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
                                    borderColor: 'white',
                                    px: { xs: 4, md: 6 },
                                    py: { xs: 1.5, md: 2 },
                                    fontSize: { xs: '1rem', md: '1.2rem' },
                                    borderRadius: '50px',
                                    '&:hover': {
                                        borderColor: 'white',
                                        bgcolor: 'rgba(255,255,255,0.1)'
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
                bottom: 40,
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'rgba(255,255,255,0.6)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1
            }}>
                <Typography variant="body2" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
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
    return (
        <Box sx={{ py: { xs: 8, sm: 12, md: 16 } }}>
            <Container maxWidth="lg">
                <Typography variant="h2" align="center" sx={{ mb: 6 }}>
                    How Brdge AI Works
                </Typography>

                <Grid container spacing={4}>
                    {[
                        {
                            title: "Interact with AI",
                            description: "Engage with our AI to upload and explain your content effortlessly."
                        },
                        {
                            title: "Generate Script",
                            description: "Watch your input transform into a polished, editable script tailored to your voice and style."
                        },
                        {
                            title: "Configure the Agent",
                            description: "Clone your voice and fine-tune your AI presenter to deliver your message perfectly."
                        },
                        {
                            title: "Save & Share",
                            description: "Distribute your presentation with a shareable link—accessible anywhere."
                        }
                    ].map((step, index) => (
                        <Grid item xs={12} md={6} lg={3} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                            >
                                <Box sx={{
                                    p: 3,
                                    height: '100%',
                                    bgcolor: 'secondary.main',
                                    borderRadius: 2
                                }}>
                                    <Typography variant="h6" gutterBottom>
                                        {step.title}
                                    </Typography>
                                    <Typography>
                                        {step.description}
                                    </Typography>
                                </Box>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
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
            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <HeroSection />
                <Container maxWidth="lg">
                    {/* Call to Action Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 6, sm: 8 } }}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                component={Link}
                                to="/demos"
                                variant="contained"
                                size="large"
                                endIcon={<ArrowForward />}
                                sx={{
                                    py: { xs: 1.5, md: 2 },
                                    px: { xs: 4, md: 6 },
                                    fontSize: { xs: '1rem', md: '1.2rem' },
                                    borderRadius: 2,
                                    backgroundColor: theme.palette.primary.main,
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.dark,
                                    },
                                }}
                            >
                                Explore AI Use Cases
                            </Button>
                        </motion.div>
                    </Box>

                    {/* Introducing Brdge AI Section */}
                    <IntroducingBrdgeAI />

                    {/* How It Works Section */}
                    <HowItWorksSection />

                    {/* Final Call to Action */}
                    <Box sx={{
                        my: { xs: 8, md: 16 },
                        textAlign: 'center',
                        py: { xs: 6, md: 8 },
                        px: { xs: 2, md: 4 },
                        background: 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)',
                        borderRadius: { xs: '24px', md: theme.shape.borderRadius },
                        boxShadow: '0px 10px 30px rgba(0, 131, 176, 0.3)',
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
                </Container>
            </Box>
        </ParallaxProvider>
    );
}

export default LandingPage;
