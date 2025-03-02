// src/pages/LandingPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Stack,
    Paper,
    Collapse,
} from '@mui/material';
import {
    ArrowForward,
    ArrowDownward,
    Link as LinkIcon,
    BusinessCenter,
    Add,
    AllInclusive,
    AutoFixHigh,
    VerifiedUser,
} from '@mui/icons-material';
import {
    Upload,
    Sparkles,
    Mic,
    Share2,
} from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { ParallaxProvider } from 'react-scroll-parallax';
import { useInView } from 'react-intersection-observer';
import demoVideo from '../assets/brdge-demo2.mp4';
import logo from '../assets/new-img.png';
import '../fonts.css';
import './LandingPage.css';
import SchoolIcon from '@mui/icons-material/School';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Footer from '../components/Footer';
import videoDemo from '../assets/video-demo-landing.mp4';

const fontFamily = 'Satoshi, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

// The following components maintain the same structure and design,
// but the copy now emphasizes how Brdge AI augments video content with
// voice-based AI assistants to make sales pitches, Loom videos, onboarding walkthroughs, and training sessions interactive.

//
// IntroducingBrdgeAI - "Redefining Knowledge Sharing"
//
const IntroducingBrdgeAI = () => {
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <Container
            maxWidth={false}
            ref={ref}
            disableGutters={true}
            sx={{
                pt: { xs: 2, md: 6 },
                pb: { xs: 2, sm: 6, md: 8 },
                px: 0,
                position: 'relative',
                background: 'transparent',
                borderRadius: 0,
                border: 'none',
                boxShadow: 'none',
                my: { xs: 0, sm: 0, md: 4 },
                zIndex: 1,
                width: '100%',
                mx: 'auto',
                overflow: { xs: 'hidden', md: 'visible' },
                '@keyframes pulse': {
                    '0%': { opacity: 0.8, transform: 'scale(1)' },
                    '50%': { opacity: 1, transform: 'scale(1.1)' },
                    '100%': { opacity: 0.8, transform: 'scale(1)' }
                },
                '@keyframes float': {
                    '0%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                    '100%': { transform: 'translateY(0px)' }
                },
                '@keyframes pulseUnderline': {
                    '0%, 100%': {
                        opacity: 0.5,
                        transform: 'translateX(-50%) scaleX(0.95)',
                        filter: 'brightness(0.8)'
                    },
                    '50%': {
                        opacity: 1,
                        transform: 'translateX(-50%) scaleX(1)',
                        filter: 'brightness(1.2)'
                    }
                },
                '@keyframes underlinePulse': {
                    '0%, 100%': {
                        opacity: 0.5,
                        width: '100px',
                        filter: 'brightness(0.8)'
                    },
                    '50%': {
                        opacity: 1,
                        width: '140px',
                        filter: 'brightness(1.2)'
                    }
                }
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
            >
                {/* HEADLINE - Only visible on mobile */}
                <Typography
                    variant="h2"
                    align="center"
                    sx={{
                        fontSize: { xs: '2rem', sm: '2.5rem' },
                        fontWeight: 800,
                        color: 'white',
                        mb: { xs: 4, sm: 4 }, // Increased margin bottom on mobile
                        mt: { xs: 2, sm: 0 }, // Added margin top on mobile
                        letterSpacing: '-0.02em',
                        textShadow: '0 0 20px rgba(255,255,255,0.2)',
                        textTransform: 'none',
                        display: { xs: 'block', md: 'none' },
                        lineHeight: 1.3, // Increased line height
                        padding: { xs: '0 10px', sm: 0 }, // Increased horizontal padding
                        '& .highlight': {
                            background: 'linear-gradient(180deg, #00ffcc 30%, rgba(0,255,204,0.8) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            position: 'relative',
                            display: 'inline-block',
                            textShadow: 'none',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-4px',
                                left: 0,
                                width: '100%',
                                height: '3px',
                                background: 'linear-gradient(90deg, transparent, #00ffcc, transparent)',
                                opacity: 0.6,
                                animation: 'underlinePulse 3s infinite'
                            }
                        }
                    }}
                >
                    Turn Videos into <span className="highlight">AI Conversations</span>
                </Typography>

                {/* TWO-COLUMN LAYOUT */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'center', md: 'flex-start' },
                        justifyContent: { xs: 'center', md: 'center' },
                        gap: { xs: 0, md: 6 },
                        mt: { xs: 0, md: 4 },
                        width: '100%',
                        maxWidth: { xs: '100%', md: '1200px' },
                        mx: 'auto'
                    }}
                >
                    {/* LEFT COLUMN: VIDEO DEMO */}
                    <Box
                        sx={{
                            flex: { xs: '1', md: '0 0 48%' },
                            width: { xs: '100%', sm: '100%' },
                            maxWidth: { xs: '100%', sm: '100%', md: '48%' },
                            position: 'relative',
                            borderRadius: { xs: 0, sm: '16px', md: '20px' },
                            overflow: 'hidden',
                            marginLeft: { xs: 0, sm: 'auto', md: 0 },
                            marginRight: { xs: 0, sm: 'auto', md: 0 },
                            boxShadow: {
                                xs: 'none',
                                sm: '0 8px 24px rgba(0,0,0,0.2)',
                                md: `
                                    0 10px 30px rgba(0,0,0,0.3),
                                    0 0 0 1px rgba(0, 180, 219, 0.3),
                                    0 0 60px rgba(0, 180, 219, 0.2)
                                `
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(to bottom, rgba(0,41,122,0.1), rgba(0,41,122,0))',
                                zIndex: 2,
                                pointerEvents: 'none'
                            }
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            style={{ width: '100%' }}
                        >
                            <Box sx={{ position: 'relative', width: '100%' }}>
                                <video
                                    ref={videoRef}
                                    width="100%"
                                    height="auto"
                                    muted
                                    playsInline
                                    style={{
                                        display: 'block',
                                        borderRadius: 0,
                                        width: '100%',
                                        objectFit: 'contain'
                                    }}
                                    onClick={togglePlayPause}
                                    poster={videoDemo.poster || undefined}
                                >
                                    <source src={videoDemo} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>

                                {/* Custom Play/Pause Button */}
                                <Box
                                    onClick={togglePlayPause}
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        zIndex: 3,
                                        background: isPlaying ? 'transparent' : 'rgba(0,0,0,0.25)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: isPlaying ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.35)'
                                        }
                                    }}
                                >
                                    {!isPlaying && (
                                        <Box
                                            sx={{
                                                width: { xs: '70px', sm: '80px' },
                                                height: { xs: '70px', sm: '80px' },
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(0, 255, 204, 0.25)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 0 30px rgba(0, 255, 204, 0.5)',
                                                border: '2px solid rgba(0, 255, 204, 0.7)',
                                                transition: 'all 0.3s ease',
                                                animation: 'pulse 2s infinite ease-in-out',
                                                '&:hover': {
                                                    transform: 'scale(1.1)',
                                                    backgroundColor: 'rgba(0, 255, 204, 0.35)'
                                                }
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 0,
                                                    height: 0,
                                                    borderTop: { xs: '14px solid transparent', sm: '15px solid transparent' },
                                                    borderBottom: { xs: '14px solid transparent', sm: '15px solid transparent' },
                                                    borderLeft: { xs: '22px solid rgba(255, 255, 255, 1)', sm: '25px solid rgba(255, 255, 255, 1)' },
                                                    marginLeft: '5px'
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </motion.div>
                    </Box>

                    {/* RIGHT COLUMN: HEADLINE, COPY, CTA */}
                    <Box
                        sx={{
                            flex: { xs: '1', md: '0 0 48%' },
                            maxWidth: { xs: '100%', md: '48%' },
                            textAlign: { xs: 'center', md: 'left' },
                            px: { xs: 4, sm: 6, md: 3 },
                            pt: { xs: 5, md: 2 },
                            mt: { xs: 3, md: 0 },
                            mx: 'auto',
                            width: { xs: '90%', sm: '85%', md: 'auto' }
                        }}
                    >
                        {/* HEADLINE - Only visible on desktop */}
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { sm: '2.5rem', md: '3rem' },
                                fontWeight: 700,
                                color: 'white',
                                mb: 3,
                                letterSpacing: '-0.02em',
                                textShadow: '0 0 20px rgba(255,255,255,0.2)',
                                textTransform: 'none',
                                display: { xs: 'none', md: 'block' },
                                '& .highlight': {
                                    background: 'linear-gradient(180deg, #00ffcc 30%, rgba(0,255,204,0.8) 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    position: 'relative',
                                    display: 'inline-block',
                                    textShadow: 'none',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: '-4px',
                                        left: 0,
                                        width: '100%',
                                        height: '2px',
                                        background: 'linear-gradient(90deg, transparent, #00ffcc, transparent)',
                                        opacity: 0.4
                                    }
                                }
                            }}
                        >
                            Turn Videos into <span className="highlight">AI Conversations</span>
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{
                                color: 'rgba(255,255,255,0.95)',
                                mb: 3,
                                fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.25rem' },
                                fontWeight: 400,
                                lineHeight: 1.6,
                                textAlign: { xs: 'center', md: 'left' },
                                '& strong': {
                                    color: '#00ffcc',
                                    fontWeight: 600,
                                }
                            }}
                        >
                            Transform your static videos, demos, and training sessions into interactive experiences. Viewers can pause, ask questions, and receive instant, voice-driven responses.
                        </Typography>

                        {/* FEATURE BULLETS */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2.5,
                            mb: 4,
                            mt: 4,
                            textAlign: { xs: 'center', md: 'left' }
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: { xs: 'center', md: 'flex-start' },
                                gap: 2
                            }}>
                                <Box
                                    sx={{
                                        minWidth: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(0, 255, 204, 0.15)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#00ffcc',
                                        boxShadow: '0 0 15px rgba(0, 255, 204, 0.2)'
                                    }}
                                >
                                    <VerifiedUser sx={{ fontSize: '20px' }} />
                                </Box>
                                <Typography
                                    sx={{
                                        fontSize: { xs: '1.05rem', sm: '1.1rem' },
                                        color: 'rgba(255,255,255,0.95)',
                                        fontWeight: 400
                                    }}
                                >
                                    Your audience asks. AI answers. <strong>Instantly.</strong>
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: { xs: 'center', md: 'flex-start' },
                                gap: 2
                            }}>
                                <Box
                                    sx={{
                                        minWidth: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(0, 255, 204, 0.15)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#00ffcc',
                                        boxShadow: '0 0 15px rgba(0, 255, 204, 0.2)'
                                    }}
                                >
                                    <AllInclusive sx={{ fontSize: '20px' }} />
                                </Box>
                                <Typography
                                    sx={{
                                        fontSize: { xs: '1.05rem', sm: '1.1rem' },
                                        color: 'rgba(255,255,255,0.95)',
                                        fontWeight: 400
                                    }}
                                >
                                    Train once. Answer forever. <strong>AI handles the rest.</strong>
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: { xs: 'center', md: 'flex-start' },
                                gap: 2
                            }}>
                                <Box
                                    sx={{
                                        minWidth: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(0, 255, 204, 0.15)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#00ffcc',
                                        boxShadow: '0 0 15px rgba(0, 255, 204, 0.2)'
                                    }}
                                >
                                    <AutoFixHigh sx={{ fontSize: '20px' }} />
                                </Box>
                                <Typography
                                    sx={{
                                        fontSize: { xs: '1.05rem', sm: '1.1rem' },
                                        color: 'rgba(255,255,255,0.95)',
                                        fontWeight: 400
                                    }}
                                >
                                    See what your audience <strong>cares about most.</strong>
                                </Typography>
                            </Box>
                        </Box>

                        {/* CTA BUTTONS */}
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={{ xs: 3, sm: 2.5 }}
                            sx={{
                                mt: { xs: 5, sm: 4 },
                                justifyContent: { xs: 'center', md: 'flex-start' },
                                width: '100%'
                            }}
                        >
                            <Button
                                component={Link}
                                to="/signup"
                                variant="contained"
                                size="large"
                                endIcon={<ArrowForward />}
                                sx={{
                                    background: 'linear-gradient(45deg, #00ffcc, #00B4DB)',
                                    color: '#000000',
                                    px: { xs: 3, sm: 4 },
                                    py: { xs: 1.75, sm: 1.75 },
                                    fontSize: { xs: '1.05rem', sm: '1.1rem' },
                                    fontWeight: 700,
                                    borderRadius: '50px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    width: { xs: '100%', sm: 'auto' },
                                    boxShadow: `
                                        0 4px 20px rgba(0, 255, 204, 0.3),
                                        0 0 0 1px rgba(0, 255, 204, 0.1),
                                        0 0 40px rgba(0, 255, 204, 0.2)
                                    `,
                                    zIndex: 1,
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #00B4DB, #00ffcc)',
                                        boxShadow: `
                                            0 6px 25px rgba(0, 255, 204, 0.4),
                                            0 0 0 1px rgba(0, 255, 204, 0.2),
                                            0 0 60px rgba(0, 255, 204, 0.3)
                                        `,
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.3s ease-in-out'
                                }}
                            >
                                Try Free – No Credit Card
                            </Button>

                            <Button
                                component={Link}
                                to="/demos"
                                variant="outlined"
                                size="large"
                                sx={{
                                    color: '#00ffcc',
                                    borderColor: 'rgba(0, 255, 204, 0.4)',
                                    borderWidth: '2px',
                                    px: { xs: 3, sm: 4 },
                                    py: { xs: 1.75, sm: 1.75 },
                                    fontSize: { xs: '1.05rem', sm: '1.1rem' },
                                    fontWeight: 600,
                                    borderRadius: '50px',
                                    letterSpacing: '0.02em',
                                    textTransform: 'none',
                                    width: { xs: '100%', sm: 'auto' },
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: 'rgba(0, 255, 204, 0.6)',
                                        backgroundColor: 'rgba(0, 255, 204, 0.05)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                Watch Full Demo
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </motion.div>
        </Container>
    );
};

//
// HeroSection - Keeping the dynamic, interactive feel and the "Speak Once, Connect Forever" message
//
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
            minHeight: { xs: 'auto', sm: '80vh' }, // Reduced from 90vh to 80vh for desktop
            width: '100vw',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-start',
            background: 'transparent',
            color: 'white',
            overflow: 'hidden',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            paddingTop: { xs: '60px', sm: '60px' },  // Reduced padding for desktop from 80px to 60px
            paddingBottom: { xs: '40px', sm: '40px' }, // Reduced padding for desktop from 60px to 40px
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 30%, rgba(0,65,194,0.4) 0%, transparent 80%)',
                pointerEvents: 'none',
                opacity: 0.9,
                mixBlendMode: 'soft-light'
            },
            px: { xs: 2, sm: 0 },
        }}>
            <Container maxWidth="lg" sx={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                mx: 'auto',
                px: { xs: 3, sm: 3, md: 4 }, // Increased horizontal padding on mobile
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    style={{
                        width: '100%',
                        maxWidth: '1200px',
                        padding: '0 16px',
                        marginBottom: '24px', // Increased margin
                    }}
                >
                    <Typography
                        variant="h1"
                        align="center"
                        className="heading-large"
                        sx={{
                            mb: { xs: 3, sm: 2 }, // Reduced margin for desktop
                            fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
                            lineHeight: { xs: 1.3, sm: 1.1 }, // Increased line height for mobile
                            fontWeight: 800,
                            textTransform: 'none',
                            letterSpacing: '-0.02em',
                            mx: 'auto',
                            maxWidth: { xs: '95%', sm: '90%', md: '85%' },
                            color: 'white',
                            position: 'relative',
                            fontFamily: fontFamily,
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: { xs: '-12px', sm: '-16px' }, // Adjusted bottom space
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: { xs: '70px', sm: '120px' },
                                height: '2px',
                                background: 'linear-gradient(90deg, transparent, rgba(0,255,204,0.6), transparent)',
                                borderRadius: '1px',
                                animation: 'underlinePulse 2s infinite ease-in-out'
                            }
                        }}
                    >
                        <Box
                            component="span"
                            sx={{
                                display: 'block',
                                color: '#FFFFFF',
                                textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                                fontSize: { xs: '2rem', sm: '3.2rem', md: '3.8rem' },
                                fontWeight: 500,
                                letterSpacing: '-0.02em',
                                mb: { xs: 1.5, sm: 0.5 }, // Reduced margin for desktop
                                textTransform: 'none',
                                fontFamily: fontFamily,
                                lineHeight: 1.2
                            }}
                        >
                            Automate Conversations
                        </Box>
                        <Box
                            component="span"
                            sx={{
                                display: 'block',
                                color: '#FFFFFF',
                                textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                                fontSize: { xs: '2rem', sm: '3.2rem', md: '3.8rem' },
                                fontWeight: 500,
                                letterSpacing: '-0.02em',
                                mb: { xs: 3, sm: 2 }, // Reduced margin for desktop
                                textTransform: 'none',
                                fontFamily: fontFamily,
                                lineHeight: 1.2
                            }}
                        >
                            Amplify Expertise
                        </Box>
                        <Box
                            component="span"
                            sx={{
                                display: 'block',
                                fontSize: { xs: '1.1rem', sm: '1.5rem', md: '1.6rem' }, // Reduced font size for desktop
                                fontWeight: 400,
                                color: 'rgba(255,255,255,0.9)',
                                letterSpacing: '0.01em',
                                mt: { xs: 2, sm: 1 }, // Reduced margin for desktop
                                fontFamily: fontFamily,
                                textAlign: 'center',
                                paddingX: { xs: 1, sm: 0 }, // Added horizontal padding on mobile
                            }}
                        >
                            Turn your videos into <strong style={{ fontWeight: 700, color: '#00ffcc', textShadow: '0 0 10px rgba(0,255,204,0.8)' }}>Interactive</strong>, <strong style={{ fontWeight: 700, color: '#00ffcc', textShadow: '0 0 10px rgba(0,255,204,0.8)' }}>AI-Powered</strong> conversations that sell, onboard, and scale effortlessly.
                        </Box>
                    </Typography>
                </motion.div>

                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: { xs: 4, sm: 2 }, // Reduced margin for desktop
                        mt: { xs: 2, sm: 0 } // Reduced margin for desktop
                    }}
                >
                    <Box
                        component="a"
                        href="https://brdge-ai.com/viewBridge/340-e34503"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            width: { xs: '120px', sm: '120px', md: '140px' }, // Reduced size for desktop
                            height: { xs: '120px', sm: '120px', md: '140px' }, // Reduced size for desktop
                            position: 'relative',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mx: 'auto',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '200%',
                                height: '200%',
                                background: 'radial-gradient(circle, rgba(0, 255, 204, 0.15) 0%, transparent 70%)',
                                filter: 'blur(40px)',
                                animation: 'breathe 4s ease-in-out infinite',
                                zIndex: 0,
                            }
                        }}
                        onMouseMove={handleMouseMove}
                    >
                        <motion.div
                            animate={iconAnimation}
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '150%',
                                        height: '150%',
                                        borderRadius: '20%',
                                        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
                                        filter: 'blur(25px)',
                                        animation: 'breatheAndGlow 4s infinite ease-in-out',
                                    },
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '86%',
                                        height: '86%',
                                        borderRadius: '50%',
                                        border: '2px solid rgba(0, 255, 204, 0.3)',
                                        boxShadow: `
                                            0 0 30px rgba(0, 255, 204, 0.3),
                                            inset 0 0 30px rgba(0, 255, 204, 0.2),
                                            0 0 60px rgba(0, 255, 204, 0.2),
                                            inset 0 0 60px rgba(0, 255, 204, 0.1),
                                            0 0 100px rgba(0, 255, 204, 0.1)
                                        `,
                                        animation: 'rotateAndPulse 10s linear infinite',
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '88%',
                                            height: '88%',
                                            borderRadius: '20%',
                                            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
                                            filter: 'blur(8px)',
                                            animation: 'breatheAndGlow 4s infinite ease-in-out',
                                        },
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '86%',
                                            height: '86%',
                                            borderRadius: '50%',
                                            border: '2px solid rgba(0, 255, 204, 0.3)',
                                            boxShadow: `
                                                0 0 15px rgba(0, 255, 204, 0.3),
                                                inset 0 0 15px rgba(0, 255, 204, 0.2),
                                                0 0 30px rgba(0, 255, 204, 0.2),
                                                inset 0 0 30px rgba(0, 255, 204, 0.1)
                                            `,
                                            animation: 'rotateAndPulse 10s linear infinite',
                                        },
                                        '& .spark': {
                                            position: 'absolute',
                                            width: '2px',
                                            height: '20px',
                                            background: 'linear-gradient(to bottom, transparent, #00ffcc, transparent)',
                                            animation: 'sparkle 1.5s infinite',
                                            opacity: 0,
                                        },
                                        '& .spark1': { transform: 'rotate(0deg) translateY(-45px)', animationDelay: '0s' },
                                        '& .spark2': { transform: 'rotate(45deg) translateY(-45px)', animationDelay: '0.2s' },
                                        '& .spark3': { transform: 'rotate(90deg) translateY(-45px)', animationDelay: '0.4s' },
                                        '& .spark4': { transform: 'rotate(135deg) translateY(-45px)', animationDelay: '0.6s' },
                                        '& .spark5': { transform: 'rotate(180deg) translateY(-45px)', animationDelay: '0.8s' },
                                        '& .spark6': { transform: 'rotate(225deg) translateY(-45px)', animationDelay: '1.0s' },
                                        '& .spark7': { transform: 'rotate(270deg) translateY(-45px)', animationDelay: '1.2s' },
                                        '& .spark8': { transform: 'rotate(315deg) translateY(-45px)', animationDelay: '1.4s' },
                                    }}
                                >
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className={`spark spark${i + 1}`} />
                                    ))}
                                    <Box
                                        component="img"
                                        src={logo}
                                        alt="Brdge Logo"
                                        sx={{
                                            width: '82%',
                                            height: '82%',
                                            objectFit: 'contain',
                                            filter: `
                                                drop-shadow(0 0 15px rgba(0, 255, 204, 0.4))
                                                drop-shadow(0 0 30px rgba(0, 255, 204, 0.3))
                                                brightness(1.1)
                                            `,
                                            transition: 'all 0.4s ease',
                                            transform: 'translateZ(0)',
                                            animation: 'floatAndGlow 6s ease-in-out infinite',
                                            position: 'relative',
                                            zIndex: 2,
                                            '&:hover': {
                                                filter: `
                                                    drop-shadow(0 0 25px rgba(0, 255, 204, 0.6))
                                                    drop-shadow(0 0 50px rgba(0, 255, 204, 0.4))
                                                    brightness(1.2)
                                                `,
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                        </motion.div>
                    </Box>
                </Box>

                <Typography
                    variant="h5"
                    align="center"
                    sx={{
                        mt: { xs: 0.5, sm: 2 }, // Reduced margin
                        mb: { xs: 0.5, sm: 2 }, // Reduced margin
                        maxWidth: '800px',
                        mx: 'auto',
                        opacity: 0.9,
                        fontSize: { xs: '0.85rem', sm: '1rem', md: '1.1rem' }, // Reduced font size
                        fontWeight: 400,
                        lineHeight: 1.5,
                        px: { xs: 2, sm: 4 },
                        color: 'rgba(255, 255, 255, 0.95)',
                        letterSpacing: '0.01em',
                        textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                        '& strong': {
                            fontWeight: 600,
                            color: '#fff',
                            textShadow: `
                                0 0 10px rgba(255, 255, 255, 0.3),
                                0 0 20px rgba(0, 255, 204, 0.2)
                            `,
                            letterSpacing: '0.02em'
                        }
                    }}
                >
                    Brdge AI transforms how you connect with your audience:
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        maxWidth: '800px',
                        mx: 'auto',
                        mb: { xs: 1.5, sm: 3, md: 4 }, // Reduced margin
                        px: { xs: 2, sm: 4 },
                    }}
                >
                    {[
                        {
                            text: "Close deals faster with interactive, AI-powered product demos",
                            icon: "🚀"
                        },
                        {
                            text: "Onboard effortlessly with engaging, personalized training",
                            icon: "✨"
                        },
                        {
                            text: "Scale your expertise without losing the personal touch",
                            icon: "📈"
                        },
                        {
                            text: "Instant answers, whenever your audience asks",
                            icon: "🎯"
                        }
                    ].map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                maxWidth: '700px',
                                mb: index < 3 ? { xs: 0.5, sm: 1.25 } : 0, // Reduced margin
                                pb: index < 3 ? { xs: 0.5, sm: 1 } : 0, // Reduced padding
                                borderBottom: index < 3 ? '1px solid rgba(0, 180, 219, 0.1)' : 'none',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateX(8px)'
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    fontSize: { xs: '0.9rem', sm: '1.35rem', md: '1.5rem' },
                                    lineHeight: 1,
                                    mr: { xs: 1.5, sm: 2.5 },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    filter: 'drop-shadow(0 0 8px rgba(0, 255, 204, 0.4))',
                                    transition: 'all 0.3s ease',
                                    animation: 'pulse 3s infinite ease-in-out',
                                    animationDelay: `${0.2 * index}s`
                                }}
                            >
                                {item.icon}
                            </Box>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: { xs: '0.85rem', sm: '1.1rem', md: '1.2rem' },
                                    fontWeight: 400,
                                    lineHeight: 1.4,
                                    color: 'rgba(255, 255, 255, 0.95)',
                                    flex: 1,
                                    '& strong': {
                                        fontWeight: 700,
                                        color: '#00ffcc',
                                        textShadow: '0 0 10px rgba(0, 255, 204, 0.4)'
                                    }
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: item.text.includes("instant answers") ?
                                        item.text.replace("instant answers—in your voice", "instant answers—in your <strong>voice</strong>") :
                                        item.text
                                }}
                            />
                        </Box>
                    ))}
                </Box>

                <Box sx={{
                    display: 'flex',
                    gap: { xs: 2, sm: 3 }, // Reduced gap
                    justifyContent: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                    width: '100%',
                    maxWidth: { xs: '100%', sm: '580px' }, // Adjusted width
                    mx: 'auto',
                    mb: { xs: 2, sm: 2, md: 3 }, // Reduced margin to make content fit in viewport
                    px: { xs: 3, sm: 0 },
                    pt: { xs: 4, sm: 0 } // Added top padding for mobile devices
                }}>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ width: '100%' }}
                    >
                        <Button
                            component={Link}
                            to="/signup"
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{
                                bgcolor: 'rgba(0, 255, 204, 0.9)',
                                color: '#000000',
                                px: { xs: 3, sm: 6 }, // Reduced padding
                                py: { xs: 1, sm: 1.5 }, // Reduced padding
                                fontSize: { xs: '0.9rem', sm: '1.1rem' }, // Reduced font size
                                fontWeight: 600,
                                borderRadius: '50px',
                                boxShadow: '0 4px 15px rgba(0, 255, 204, 0.3)',
                                letterSpacing: '0.02em',
                                textTransform: 'none',
                                minWidth: { xs: '100%', sm: '200px' }, // Adjusted width
                                whiteSpace: 'nowrap',
                                height: 'fit-content',
                                '&:hover': {
                                    bgcolor: 'rgba(0, 255, 204, 1)',
                                    boxShadow: '0 6px 20px rgba(0, 255, 204, 0.4)'
                                }
                            }}
                        >
                            Start Free Today
                        </Button>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ width: '100%' }}
                    >
                        <Button
                            component={Link}
                            to="/demos"
                            variant="outlined"
                            size="large"
                            fullWidth
                            sx={{
                                color: 'white',
                                borderColor: 'rgba(255,255,255,0.5)',
                                borderWidth: '2px',
                                px: { xs: 3, sm: 6 }, // Reduced padding
                                py: { xs: 1, sm: 1.5 }, // Reduced padding
                                fontSize: { xs: '0.9rem', sm: '1.1rem' }, // Reduced font size
                                fontWeight: 600,
                                borderRadius: '50px',
                                minWidth: { xs: '100%', sm: '200px' }, // Adjusted width
                                letterSpacing: '0.02em',
                                textTransform: 'none',
                                whiteSpace: 'nowrap',
                                height: 'fit-content',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: 'rgba(255,255,255,0.4)',
                                    backgroundColor: 'rgba(255,255,255,0.05)'
                                }
                            }}
                        >
                            See It In Action
                        </Button>
                    </motion.div>
                </Box>

                <Box sx={{
                    display: { xs: 'none', sm: 'flex' },
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1, // Reduced gap
                    mt: { xs: 1, sm: 0 }, // Reduced margin
                    mb: { xs: 1, sm: 0 }, // Reduced margin
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
                            y: [0, 10, 0], // Reduced animation height
                        }}
                        transition={{
                            duration: 1.5, // Made animation faster
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            paddingBottom: '10px' // Reduced padding
                        }}
                    >
                        <ArrowDownward sx={{
                            fontSize: 20, // Smaller icon
                            color: '#00ffcc',
                            filter: 'drop-shadow(0 0 8px rgba(0,255,204,0.4))'
                        }} />
                    </motion.div>
                </Box>
            </Container>
        </Box>
    );
};

//
// HowItWorksSection - A simple 4-step process that turns your videos into interactive conversations
//
const HowItWorksSection = () => {
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });
    const steps = [
        {
            number: "01",
            icon: <Upload size={32} />,
            title: "Upload or Record",
            description: "Submit your screen recording, sales pitch, or onboarding video. Brdge AI transcribes and prepares your content for interactive engagement."
        },
        {
            number: "02",
            icon: <Sparkles size={32} />,
            title: "Define the Agent",
            description: "Customize your AI assistant by picking a personality and configuring its knowledge base. Tailor its responses to reflect your unique style and brand voice."
        },
        {
            number: "03",
            icon: <Mic size={32} />,
            title: "Clone Your Voice",
            description: "Let your voice power every response. Clone your authentic sound so your AI delivers answers that feel truly personal."
        },
        {
            number: "04",
            icon: <Share2 size={32} />,
            title: "Share & Engage",
            description: "Distribute one link. As viewers watch, they pause, ask questions, and get immediate, voice-driven answers that keep them hooked."
        }
    ];

    return (
        <Box
            sx={{
                pt: { xs: 10, sm: 8 }, // Increased padding top for mobile
                pb: { xs: 10, sm: 8 }, // Increased padding bottom for mobile
                px: { xs: 3, sm: 3 }, // Increased horizontal padding for mobile
            }}
        >
            <Container maxWidth="lg" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    {/* Section Header */}
                    <Box sx={{ mb: { xs: 8, sm: 8 } }}> {/* Increased margin bottom for mobile */}
                        <Typography
                            variant="h2"
                            align="center"
                            sx={{
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                fontWeight: 600,
                                color: 'white',
                                mb: 3,
                                letterSpacing: '-0.02em',
                                textTransform: 'none',
                            }}
                        >
                            One Platform, Countless Possibilities
                        </Typography>

                        <Typography
                            variant="h5"
                            align="center"
                            sx={{
                                color: 'rgba(255,255,255,0.8)',
                                maxWidth: '800px',
                                mx: 'auto',
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                lineHeight: 1.6,
                                textTransform: 'none',
                                px: { xs: 1, sm: 0 }, // Added horizontal padding for mobile
                            }}
                        >
                            Brdge AI empowers your organization by turning your videos into
                            interactive, voice-powered experiences.
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 8, sm: 8, md: 10 }, // Increased gap for mobile
                        position: 'relative',
                        maxWidth: '800px',
                        mx: 'auto',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: '50%',
                            top: 0,
                            bottom: 0,
                            width: '1px',
                            background: 'linear-gradient(180deg, transparent, rgba(0,255,204,0.2), transparent)',
                            zIndex: 0,
                            display: { xs: 'none', md: 'block' }
                        }
                    }}>
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, x: -50 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', md: 'row' },
                                    alignItems: { xs: 'center', md: 'center' },
                                    gap: { xs: 4, md: 8 },
                                    position: 'relative',
                                    zIndex: 1,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)'
                                    }
                                }}>
                                    <Box sx={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 3,
                                        minWidth: { md: '200px' },
                                        justifyContent: 'flex-end'
                                    }}>
                                        <Typography
                                            sx={{
                                                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                                                fontWeight: 700,
                                                color: 'rgba(0,255,204,0.4)',
                                                width: '40px',
                                                textAlign: 'right'
                                            }}
                                        >
                                            {step.number}
                                        </Typography>
                                        <Box sx={{
                                            width: { xs: '80px', sm: '100px' },
                                            height: { xs: '80px', sm: '100px' },
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: 'linear-gradient(135deg, rgba(0,255,204,0.08), rgba(0,180,219,0.08))',
                                            border: '1px solid rgba(0,255,204,0.15)',
                                            boxShadow: `
                                                0 0 30px rgba(0,255,204,0.1),
                                                0 0 60px rgba(0,180,219,0.05)
                                            `,
                                            color: '#00ffcc',
                                            position: 'relative',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                boxShadow: `
                                                    0 0 40px rgba(0,255,204,0.15),
                                                    0 0 80px rgba(0,180,219,0.1)
                                                `
                                            }
                                        }}>
                                            {React.cloneElement(step.icon, { size: 36 })}
                                        </Box>
                                    </Box>

                                    <Box sx={{
                                        flex: 1,
                                        textAlign: { xs: 'center', md: 'left' },
                                        maxWidth: { md: '400px' }
                                    }}>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                mb: 2,
                                                color: '#00ffcc',
                                                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                                                fontWeight: 600,
                                                letterSpacing: '-0.01em',
                                                textShadow: '0 0 20px rgba(0,255,204,0.2)'
                                            }}
                                        >
                                            {step.title}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: 'rgba(255,255,255,0.9)',
                                                fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                                lineHeight: 1.6,
                                                maxWidth: '500px',
                                                mx: { xs: 'auto', md: 0 },
                                                '& strong': {
                                                    color: '#fff',
                                                    fontWeight: 600,
                                                    textShadow: '0 0 10px rgba(0,255,204,0.2)'
                                                }
                                            }}
                                            dangerouslySetInnerHTML={{ __html: step.description }}
                                        />
                                    </Box>
                                </Box>
                            </motion.div>
                        ))}
                    </Box>

                    <Box sx={{
                        mt: { xs: 8, sm: 10, md: 12 },
                        textAlign: 'center'
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
                                    bgcolor: 'rgba(0,255,204,0.1)',
                                    color: '#00ffcc',
                                    px: { xs: 4, sm: 6 },
                                    py: { xs: 1.5, sm: 2 },
                                    fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                    fontWeight: 600,
                                    borderRadius: '50px',
                                    border: '1px solid rgba(0,255,204,0.2)',
                                    textTransform: 'none',
                                    boxShadow: '0 0 30px rgba(0,255,204,0.1)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: 'rgba(0,255,204,0.15)',
                                        boxShadow: '0 0 40px rgba(0,255,204,0.2)'
                                    }
                                }}
                            >
                                Try It Free
                            </Button>
                        </motion.div>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

//
// ImpactSection - Showcasing the broad potential: interactive onboarding, sales, and education
//
const ImpactSection = () => {
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true,
    });

    const [expandedCard, setExpandedCard] = useState(null);

    const handleCardClick = (id) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    const industries = [
        {
            id: 'onboarding',
            icon: <SchoolIcon />,
            title: 'Onboarding & Training',
            subtitle: 'Engage new hires with interactive video walkthroughs',
            details: [
                {
                    title: 'Streamline Orientation',
                    description: 'Eliminate repetitive onboarding sessions. Your AI assistant handles FAQs with consistent, on‑brand responses.',
                },
                {
                    title: 'Boost Confidence',
                    description: 'Empower new hires to explore your content interactively, getting clarity right when they need it.',
                },
                {
                    title: 'Save Time',
                    description: 'Automate basic Q&A so managers can focus on strategic initiatives.',
                },
            ],
        },
        {
            id: 'sales',
            icon: <BusinessCenter />,
            title: 'Sales & Customer Engagement',
            subtitle: 'Turn every sales pitch into an interactive conversation',
            details: [
                {
                    title: '24/7 Demos',
                    description: 'Prospects can interact with your sales videos on their own time, asking questions and exploring features instantly.',
                },
                {
                    title: 'Build Trust',
                    description: 'Deliver consistent, personalized answers that showcase your expertise and create stronger customer connections.',
                },
                {
                    title: 'Accelerate Conversions',
                    description: 'Instant clarifications shorten the sales cycle and boost conversion rates.',
                },
            ],
        },
        {
            id: 'education',
            icon: <RocketLaunchIcon />,
            title: 'Education & Knowledge Hubs',
            subtitle: 'Transform lectures into interactive learning sessions',
            details: [
                {
                    title: 'Instant Clarity',
                    description: 'Enable students to pause, ask questions, and get real-time insights—making every lesson more engaging.',
                },
                {
                    title: 'Active Learning',
                    description: 'Replace passive watching with interactive Q&A that reinforces understanding and retention.',
                },
                {
                    title: 'Scalable Teaching',
                    description: "Whether for a small class or a massive online course, your AI assistant adapts to every student's pace.",
                },
            ],
        },
    ];

    return (
        <Box sx={{
            pt: { xs: 6, sm: 8 },
            pb: { xs: 6, sm: 8 },
            px: { xs: 2, sm: 3 },
        }}>
            <Container maxWidth="lg" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    {/* Section Header */}
                    <Box sx={{ mb: { xs: 6, sm: 8 } }}>
                        <Typography
                            variant="h2"
                            align="center"
                            sx={{
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                fontWeight: 600,
                                color: 'white',
                                mb: 3,
                                letterSpacing: '-0.02em',
                                textTransform: 'none',
                            }}
                        >
                            One Platform, Countless Possibilities
                        </Typography>

                        <Typography
                            variant="h5"
                            align="center"
                            sx={{
                                color: 'rgba(255,255,255,0.8)',
                                maxWidth: '800px',
                                mx: 'auto',
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                lineHeight: 1.6,
                                textTransform: 'none',
                            }}
                        >
                            Brdge AI empowers your organization by turning your videos into
                            interactive, voice-powered experiences.
                        </Typography>
                    </Box>

                    {/* Cards Container */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)'
                        },
                        gap: { xs: 3, sm: 4 },
                        width: '100%',
                    }}>
                        {industries.map((industry) => (
                            <Paper
                                key={industry.id}
                                onClick={() => handleCardClick(industry.id)}
                                elevation={0}
                                sx={{
                                    position: 'relative',
                                    background: expandedCard === industry.id
                                        ? 'rgba(0,41,122,0.3)'
                                        : 'rgba(0,41,122,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '16px',
                                    border: '1px solid',
                                    borderColor: expandedCard === industry.id
                                        ? 'rgba(0,255,204,0.2)'
                                        : 'rgba(255,255,255,0.1)',
                                    p: { xs: 3, sm: 4 },
                                    pb: { xs: 5, sm: 4 },
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        borderColor: 'rgba(0,255,204,0.3)',
                                        boxShadow: '0 8px 30px rgba(0,255,204,0.15)',
                                    },
                                }}
                            >
                                {/* Card Header */}
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 2.5,
                                    mb: 2,
                                }}>
                                    <Box sx={{
                                        p: 1.5,
                                        bgcolor: 'rgba(0,255,204,0.1)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        {React.cloneElement(industry.icon, {
                                            sx: { fontSize: 24, color: '#00ffcc' }
                                        })}
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: '#fff',
                                                fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                                fontWeight: 600,
                                                mb: 1,
                                            }}
                                        >
                                            {industry.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'rgba(255,255,255,0.7)',
                                                fontSize: '0.9rem',
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {industry.subtitle}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Plus Sign Indicator - Mobile Only */}
                                <Box
                                    sx={{
                                        display: { xs: 'flex', sm: 'none' },
                                        position: 'absolute',
                                        bottom: '12px',
                                        left: '12px',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            bgcolor: 'rgba(0,255,204,0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s ease',
                                            transform: expandedCard === industry.id ? 'rotate(45deg)' : 'none',
                                        }}
                                    >
                                        <Add
                                            sx={{
                                                fontSize: 18,
                                                color: '#00ffcc',
                                            }}
                                        />
                                    </Box>
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            color: 'rgba(255,255,255,0.6)',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {expandedCard === industry.id ? 'Show less' : 'Learn more'}
                                    </Typography>
                                </Box>

                                {/* Expandable Content */}
                                <Collapse in={expandedCard === industry.id}>
                                    <Box sx={{
                                        mt: 3,
                                        pt: 3,
                                        borderTop: '1px solid rgba(255,255,255,0.1)',
                                    }}>
                                        {industry.details.map((detail, idx) => (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    mb: idx !== industry.details.length - 1 ? 3 : 0
                                                }}
                                            >
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        color: '#00ffcc',
                                                        fontWeight: 600,
                                                        fontSize: '0.95rem',
                                                        mb: 1,
                                                    }}
                                                >
                                                    {detail.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: 'rgba(255,255,255,0.7)',
                                                        fontSize: '0.9rem',
                                                        lineHeight: 1.6,
                                                    }}
                                                >
                                                    {detail.description}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Collapse>
                            </Paper>
                        ))}
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

//
// FinalCTA - A powerful invitation to join the revolution in interactive, voice-augmented video content
//
const FinalCTA = () => {
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    return (
        <Box
            sx={{
                pt: { xs: 12, sm: 10, md: 12 }, // Increased padding top for mobile
                pb: { xs: 12, sm: 12, md: 16 }, // Increased padding bottom for desktop
                px: { xs: 3, sm: 4, md: 6 }, // Increased horizontal padding for mobile
                position: 'relative',
                overflow: 'visible', // Changed to visible to prevent content cutoff
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderRadius: '24px',
                maxWidth: '1200px',
                mx: 'auto',
                mb: { xs: 8, sm: 10, md: 12 }, // Added bottom margin for better spacing
            }}
        >
            <Container maxWidth="lg" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                            fontWeight: 700,
                            color: 'white',
                            mb: 2,
                            textTransform: 'none',
                        }}
                    >
                        Ready to Let Your Content
                    </Typography>
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                            fontWeight: 700,
                            color: '#00ffcc',
                            mb: { xs: 4, sm: 5 },
                            textTransform: 'none',
                            letterSpacing: '-0.02em',
                            textShadow: '0 0 20px rgba(0,255,204,0.3)'
                        }}
                    >
                        Speak for Itself?
                    </Typography>

                    <Typography
                        variant="h5"
                        align="center"
                        sx={{
                            fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
                            fontWeight: 400,
                            color: 'rgba(255,255,255,0.9)',
                            mb: { xs: 6, sm: 8 },
                            maxWidth: '600px',
                            mx: 'auto',
                            lineHeight: 1.6
                        }}
                    >
                        Join the Brdge AI revolution and transform all your videos into powerful, interactive conversations. From sales pitches to onboarding and training, watch your content drive exceptional results 24/7 without your constant presence.
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 2, sm: 4 },
                        justifyContent: 'center',
                        maxWidth: '600px',
                        mx: 'auto',
                        mb: { xs: 4, sm: 6, md: 8 }, // Added bottom margin to ensure buttons are visible
                        position: 'relative',
                        zIndex: 10
                    }}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ flex: 1 }}
                        >
                            <Button
                                component={Link}
                                to="/signup"
                                variant="contained"
                                size="large"
                                sx={{
                                    bgcolor: 'rgba(0, 255, 204, 0.9)',
                                    color: '#000000',
                                    px: { xs: 6, sm: 8 },
                                    py: { xs: 1.5, sm: 2 },
                                    fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                    fontWeight: 600,
                                    borderRadius: '50px',
                                    boxShadow: '0 4px 15px rgba(0, 255, 204, 0.3)',
                                    letterSpacing: '0.02em',
                                    textTransform: 'none',
                                    minWidth: { xs: '100%', sm: '220px' },
                                    whiteSpace: 'nowrap',
                                    height: 'fit-content',
                                    '&:hover': {
                                        bgcolor: 'rgba(0, 255, 204, 1)',
                                        boxShadow: '0 6px 20px rgba(0, 255, 204, 0.4)'
                                    }
                                }}
                            >
                                Start Free Today
                            </Button>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ flex: 1 }}
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
                                    px: { xs: 6, sm: 8 },
                                    py: { xs: 1.5, sm: 2 },
                                    fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                    fontWeight: 600,
                                    borderRadius: '50px',
                                    minWidth: { xs: '100%', sm: '220px' },
                                    letterSpacing: '0.02em',
                                    textTransform: 'none',
                                    whiteSpace: 'nowrap',
                                    height: 'fit-content',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: 'rgba(255,255,255,0.4)',
                                        backgroundColor: 'rgba(255,255,255,0.05)'
                                    }
                                }}
                            >
                                Watch Demo
                            </Button>
                        </motion.div>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

// Define animation variants at the top level
const fadeInUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            mass: 1
        }
    }
};

function LandingPage() {
    // Intersection observer hook
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true,
        rootMargin: '50px'
    });

    useEffect(() => {
        // Preload video
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'video';
        link.href = demoVideo;
        document.head.appendChild(link);

        // Smooth scroll behavior
        document.documentElement.style.scrollBehavior = 'smooth';

        return () => {
            document.head.removeChild(link);
            document.documentElement.style.scrollBehavior = 'auto';
        };
    }, []);

    return (
        <ParallaxProvider>
            <Box
                className="gradient-animate"
                sx={{
                    flexGrow: 1,
                    overflow: 'visible', // Changed from 'hidden' to prevent content cutoff
                    background: 'linear-gradient(180deg, #001B3D 0%, #000C1F 25%, #001F5C 50%, #0041C2 75%, #00B4DB 100%)',
                    backgroundSize: '200% 200%',
                    color: 'white',
                    minHeight: '100vh',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingBottom: { xs: 0, sm: 8, md: 10 }, // Added bottom padding to main container for desktop
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 50% 30%, rgba(0,65,194,0.2) 0%, transparent 70%)',
                        pointerEvents: 'none',
                        opacity: 0.6,
                        mixBlendMode: 'soft-light',
                        transform: 'translateZ(0)',
                        willChange: 'opacity',
                        transition: 'opacity 0.3s ease-out'
                    }
                }}
            >
                <style>{`
                    @keyframes gradientShift {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    .gradient-animate {
                        animation: gradientShift 15s ease infinite;
                    }
                `}</style>

                <HeroSection />

                <Container
                    ref={ref}
                    maxWidth="lg"
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        pt: { xs: 6, sm: 4, md: 6 }, // Increased top padding on mobile
                        pb: { xs: 8, sm: 8, md: 10 }, // Increased bottom padding on mobile
                        px: { xs: 2, sm: 4, md: 6 },
                        flex: 1,
                        perspective: '1000px',
                        '& > *': {
                            mb: { xs: 16, sm: 12, md: 16 }, // Increased margin bottom for mobile
                            opacity: 0.98,
                            backdropFilter: 'blur(10px)',
                            borderRadius: '24px',
                            p: { xs: 4, sm: 4, md: 5 }, // Increased padding on mobile
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.04) 100%)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            willChange: 'transform, opacity',
                            transform: 'translateZ(0)',
                            backfaceVisibility: 'hidden',
                            WebkitFontSmoothing: 'subpixel-antialiased',
                            transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
                            '&:hover': {
                                transform: 'translateY(-4px) translateZ(0) scale(1.01)',
                                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                            }
                        }
                    }}
                >
                    <motion.div
                        variants={fadeInUpVariant}
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                    >
                        <IntroducingBrdgeAI />
                        <HowItWorksSection />
                        <ImpactSection />
                        <FinalCTA />
                    </motion.div>
                </Container>
                <Footer />
            </Box>
        </ParallaxProvider>
    );
}

export default LandingPage;
