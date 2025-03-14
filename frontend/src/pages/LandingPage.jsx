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
import videoDemo from '../assets/brdge-front-page-2.mp4';

const fontFamily = 'Satoshi, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

// Utility function for consistent button styling across the page
const createButtonStyles = (variant, isResponsive = true) => {
    const baseStyles = {
        borderRadius: '50px',
        fontWeight: 600,
        letterSpacing: '0.01em',
        textTransform: 'none',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: { xs: '54px', sm: '54px' }, // Consistent touch-friendly height
        fontSize: { xs: '1.05rem', sm: '1.1rem' },
        px: { xs: 3, sm: 4, md: 6 },
        py: { xs: 2, sm: 1.75 },
        width: isResponsive ? { xs: '100%', sm: 'auto' } : 'auto',
        whiteSpace: 'nowrap',
        boxShadow: 'none',
        '&:active': {
            transform: 'scale(0.98)',
        },
        '&:focus': {
            outline: '2px solid rgba(0, 255, 204, 0.4)',
            outlineOffset: '2px',
        },
    };

    if (variant === 'primary') {
        return {
            ...baseStyles,
            background: 'linear-gradient(45deg, #00ffcc, #00B4DB)',
            color: '#000000',
            boxShadow: '0 4px 15px rgba(0, 255, 204, 0.3)',
            '&:hover': {
                background: 'linear-gradient(45deg, #00B4DB, #00ffcc)',
                boxShadow: '0 6px 20px rgba(0, 255, 204, 0.4)',
                transform: 'translateY(-2px)',
            },
        };
    } else {
        return {
            ...baseStyles,
            color: '#00ffcc',
            borderColor: 'rgba(0, 255, 204, 0.4)',
            borderWidth: '2px',
            backdropFilter: 'blur(10px)',
            '&:hover': {
                borderColor: 'rgba(0, 255, 204, 0.6)',
                backgroundColor: 'rgba(0, 255, 204, 0.05)',
                transform: 'translateY(-2px)',
            },
        };
    }
};

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

    // Update togglePlayPause to work with native controls
    const togglePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(error => console.error("Error playing video:", error));
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    // Listen for play/pause events from native controls
    useEffect(() => {
        const videoElement = videoRef.current;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        if (videoElement) {
            videoElement.addEventListener('play', handlePlay);
            videoElement.addEventListener('pause', handlePause);
        }

        return () => {
            if (videoElement) {
                videoElement.removeEventListener('play', handlePlay);
                videoElement.removeEventListener('pause', handlePause);
            }
        };
    }, []);

    return (
        <Container
            maxWidth={false}
            ref={ref}
            disableGutters={true}
            sx={{
                pt: { xs: 5, md: 6 },
                pb: { xs: 5, sm: 6, md: 8 },
                px: { xs: 0, sm: 3, md: 6 }, // Removed horizontal padding on mobile
                position: 'relative',
                background: 'transparent',
                borderRadius: 0,
                border: 'none',
                boxShadow: 'none',
                my: { xs: 2, sm: 3, md: 4 },
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
                {/* STACKED LAYOUT - TITLE FIRST */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: '1200px',
                        mx: 'auto',
                        gap: { xs: 2, sm: 3, md: 4 } // Reduced gap on mobile
                    }}
                >
                    {/* HEADLINE - Visible on all devices */}
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            fontSize: { xs: '2.2rem', sm: '2.5rem', md: '3rem' }, // Increased font size on mobile
                            fontWeight: 800,
                            color: 'white',
                            mb: { xs: 0, sm: 1 }, // Reduced margin for better spacing with gap
                            letterSpacing: '-0.02em',
                            textShadow: '0 0 20px rgba(255,255,255,0.2)',
                            textTransform: 'none',
                            lineHeight: 1.3,
                            width: '100%',
                            padding: { xs: '0 8px', sm: 0 },
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
                        Turn Courses into <span className="highlight">AI Classrooms</span>
                    </Typography>

                    {/* VIDEO SECTION - Larger and more prominent */}
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: { xs: '100%', sm: '95%', md: '80%' },
                            position: 'relative',
                            borderRadius: { xs: 0, sm: '8px' }, // No border radius on mobile
                            overflow: 'hidden',
                            mx: 'auto',
                            mb: 0,
                            // Mobile optimizations
                            mt: { xs: 1, sm: 0 },
                            // Removed all horizontal padding
                            px: { xs: 0, sm: 0, md: 2 },
                            // Fixed height wrapper on mobile to prevent layout shifts
                            minHeight: { xs: '250px', sm: 'auto' },
                            boxShadow: {
                                xs: 'none', // No shadow on mobile for clean edges
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
                            <Box sx={{
                                position: 'relative',
                                width: '100%',
                                // Fixed aspect ratio that works well on mobile
                                paddingTop: { xs: '62.5%', sm: '56.25%' }, // Taller aspect ratio on mobile
                                // Mobile-specific styles
                                '@media (max-width: 600px)': {
                                    margin: 0,
                                    borderRadius: 0,
                                    height: 'auto'
                                },
                                '& video': {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: { xs: 0, sm: '8px' },
                                    '@media (max-width: 600px)': {
                                        '&::-webkit-media-controls': {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'flex-end'
                                        },
                                        '&::-webkit-media-controls-enclosure': {
                                            borderRadius: 0,
                                            background: 'rgba(0,0,0,0.5)'
                                        },
                                        '&::-webkit-media-controls-panel': {
                                            height: 'auto',
                                            padding: '8px 0',
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
                                        },
                                        '&::-webkit-media-controls-play-button': {
                                            transform: 'scale(1.5)',
                                            margin: '0 12px'
                                        },
                                        '&::-webkit-media-controls-timeline': {
                                            marginInline: '12px'
                                        }
                                    }
                                }
                            }}>
                                <video
                                    ref={videoRef}
                                    width="100%"
                                    height="100%"
                                    controls
                                    playsInline
                                    // These attributes need proper JSX format with dashes converted to camelCase
                                    // or added as custom attributes
                                    x-webkit-airplay="allow"
                                    data-webkit-playsinline="true"
                                    controlsList="nodownload noremoteplayback"
                                    preload="auto" // Changed from metadata to auto for better mobile playback
                                    style={{
                                        display: 'block',
                                        borderRadius: 0,
                                        objectFit: 'contain',
                                        backgroundColor: 'transparent',
                                        maxHeight: '100%',
                                        width: '100%'
                                    }}
                                    poster={videoDemo.poster || undefined}
                                >
                                    <source src={videoDemo} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>

                                {/* Hide custom play button when controls are enabled */}
                                {!isPlaying && !videoRef.current?.hasAttribute('controls') && (
                                    <Box
                                        component="a"
                                        href="https://brdge-ai.com/viewBridge/344-96eac2"
                                        target="_blank"
                                        rel="noopener"
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
                                            background: 'rgba(0,0,0,0.25)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                background: 'rgba(0,0,0,0.35)'
                                            }
                                        }}
                                    >
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
                                    </Box>
                                )}
                            </Box>
                        </motion.div>
                    </Box>

                    {/* TEXT SECTION - Below video with improved spacing */}
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: { xs: '100%', sm: '90%', md: '80%' },
                            textAlign: 'center',
                            mx: 'auto',
                            px: { xs: 1, sm: 4 }, // Reduced padding on mobile
                            mb: { xs: 3, sm: 5 },
                            mt: { xs: 1, sm: 2 }
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                color: 'rgba(255,255,255,0.95)',
                                mb: { xs: 3, sm: 4 },
                                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.25rem' }, // Smaller font on mobile
                                fontWeight: 400,
                                lineHeight: 1.6,
                                '& strong': {
                                    color: '#00ffcc',
                                    fontWeight: 600,
                                }
                            }}
                        >
                            Transform your static course videos into interactive learning experiences. Students can pause, ask questions, and receive instant, voice-driven responses from your AI teaching assistant.
                        </Typography>

                        {/* FEATURE BULLETS - Centered */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: { xs: 2, sm: 2.5 }, // Reduced gap on mobile
                            mb: { xs: 3, sm: 4 },
                            mt: { xs: 1, sm: 2 },
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: { xs: '100%', md: '80%' },
                            mx: 'auto'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
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
                                    Students ask. Your AI answers. <strong>In your voice.</strong>
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
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
                                    Teach once. Guide forever. <strong>Even when you're not there.</strong>
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
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
                                    See what students <strong>struggle with most.</strong>
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* CTA BUTTONS - Centered */}
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 2, sm: 2.5 }} // Reduced spacing on mobile
                        sx={{
                            mt: { xs: 0, sm: 2 }, // Reduced top margin on mobile
                            justifyContent: 'center',
                            width: '100%',
                            maxWidth: { xs: '100%', sm: '90%', md: '70%' }, // Wider on mobile
                            mx: 'auto',
                            // Mobile-specific styling
                            '@media (max-width: 600px)': {
                                px: 2 // Add padding on mobile
                            }
                        }}
                    >
                        <Button
                            component={Link}
                            to="/signup"
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForward />}
                            sx={{
                                ...createButtonStyles('primary', false),
                                flex: { xs: '1 1 auto', sm: 1 }, // Make buttons take equal space
                            }}
                        >
                            Start Creating AI Courses
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            sx={{
                                ...createButtonStyles('secondary', false),
                                flex: { xs: '1 1 auto', sm: 1 }, // Make buttons take equal space
                            }}
                            component="a"
                            href="https://brdge-ai.com/viewBridge/344-96eac2"
                            target="_blank"
                            rel="noopener"
                        >
                            Watch Course Demo
                        </Button>
                    </Stack>
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
                        marginBottom: '16px', // Reduced margin to fit more content
                    }}
                >
                    <Typography
                        variant="h1"
                        align="center"
                        className="heading-large"
                        sx={{
                            mb: { xs: 2, sm: 1.5 }, // Further reduced margin
                            fontSize: { xs: '1.8rem', sm: '2.6rem', md: '3rem' }, // Smaller font sizes across all breakpoints
                            lineHeight: { xs: 1.3, sm: 1.1 },
                            fontWeight: 800,
                            textTransform: 'none',
                            letterSpacing: '-0.02em',
                            mx: 'auto',
                            maxWidth: { xs: '95%', sm: '90%', md: '85%' },
                            color: 'white',
                            position: 'relative',
                            fontFamily: fontFamily,
                            // Removed the after pseudo-element here as we'll add a global underline at the end
                            '@keyframes shimmer': {
                                '0%': {
                                    backgroundPosition: '-200% 0',
                                },
                                '100%': {
                                    backgroundPosition: '200% 0',
                                },
                            },
                            // Add global underline that spans the entire title
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: { xs: '-15px', sm: '-20px' },
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: { xs: '200px', sm: '320px', md: '400px' }, // Wider underline for the entire title
                                height: '3px',
                                background: 'linear-gradient(90deg, transparent, rgba(0,255,204,0.8), transparent)',
                                borderRadius: '2px',
                                animation: 'underlinePulse 2s infinite ease-in-out'
                            },
                        }}
                    >
                        <Box
                            component="span"
                            sx={{
                                display: 'block',
                                color: '#FFFFFF',
                                textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                                fontSize: { xs: '1.9rem', sm: '2.8rem', md: '3.4rem' }, // Smaller font sizes
                                fontWeight: 700,
                                letterSpacing: '-0.02em',
                                mb: { xs: 1, sm: 0.5 }, // Reduced margin
                                textTransform: 'none',
                                fontFamily: fontFamily,
                                lineHeight: 1.2,
                                position: 'relative',
                                paddingBottom: { xs: '6px', sm: '8px' }, // Reduced padding
                                // Removed the individual underline here
                            }}
                        >
                            Turn Your Expertise
                        </Box>
                        <Box
                            component="span"
                            className="gradient-text"
                            sx={{
                                display: 'block',
                                background: 'linear-gradient(90deg, #00ffcc, #00B4DB, #00ffcc)',
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                MozBackgroundClip: 'text',
                                MozTextFillColor: 'transparent',
                                textShadow: 'none',
                                fontSize: { xs: '1.9rem', sm: '2.8rem', md: '3.4rem' }, // Smaller font sizes
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                                mb: { xs: 2, sm: 1.5 }, // Reduced margin
                                textTransform: 'none',
                                fontFamily: fontFamily,
                                lineHeight: 1.2,
                                animation: 'shimmer 3s infinite linear alternate',
                                px: 2,
                            }}
                        >
                            Into AI-Powered Courses
                        </Box>
                        <Box
                            component="span"
                            sx={{
                                display: 'block',
                                fontSize: { xs: '1rem', sm: '1.3rem', md: '1.4rem' }, // Smaller font sizes
                                fontWeight: 400,
                                color: 'rgba(255,255,255,0.9)',
                                letterSpacing: '0.01em',
                                mt: { xs: 1.5, sm: 1 }, // Reduced margin
                                fontFamily: fontFamily,
                                textAlign: 'center',
                                paddingX: { xs: 1, sm: 0 },
                            }}
                        >
                            Create interactive learning experiences that <strong style={{ fontWeight: 700, color: '#00ffcc', textShadow: '0 0 10px rgba(0,255,204,0.8)' }}>teach</strong>, <strong style={{ fontWeight: 700, color: '#00ffcc', textShadow: '0 0 10px rgba(0,255,204,0.8)' }}>engage</strong>, and <strong style={{ fontWeight: 700, color: '#00ffcc', textShadow: '0 0 10px rgba(0,255,204,0.8)' }}>scale</strong> your knowledge 24/7.
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
                        href="https://brdge-ai.com/viewBridge/344-96eac2"
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
                            margin: '0 auto', // Ensure proper centering
                            transform: 'translateX(0)', // Fix for potential transform issues
                            left: { xs: '0', sm: 'auto' }, // Explicit positioning for mobile
                            right: { xs: '0', sm: 'auto' },
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
                        mt: { xs: 1.5, sm: 2 }, // Increased top margin on mobile
                        mb: { xs: 2, sm: 2.5 }, // Increased bottom margin
                        maxWidth: '800px',
                        mx: 'auto',
                        opacity: 1, // Increased from 0.9 for better visibility
                        fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.35rem' }, // Increased font size across all breakpoints
                        fontWeight: 500, // Increased from 400 for better emphasis
                        lineHeight: 1.5,
                        px: { xs: 2, sm: 4 },
                        color: 'rgba(255, 255, 255, 0.95)',
                        letterSpacing: '0.01em',
                        textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                        position: 'relative',
                        '&::after': { // Added an underline to make it stand out as a section heading
                            content: '""',
                            position: 'absolute',
                            bottom: '-10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: { xs: '100px', sm: '120px' },
                            height: '2px',
                            background: 'rgba(0, 255, 204, 0.4)',
                            borderRadius: '1px',
                        },
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
                    Brdge AI transforms how educators connect with students:
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
                            text: "Create AI tutors that answer student questions 24/7",
                            icon: "🎓"
                        },
                        {
                            text: "Increase course completion rates with personalized guidance",
                            icon: "✨"
                        },
                        {
                            text: "Scale your teaching without sacrificing the personal touch",
                            icon: "📈"
                        },
                        {
                            text: "Learn what your students need through AI insights",
                            icon: "🧠"
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
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ width: '100%', flex: 1 }}
                    >
                        <Button
                            component={Link}
                            to="/signup"
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={createButtonStyles('primary')}
                        >
                            Start Free Today
                        </Button>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ width: '100%', flex: 1 }}
                    >
                        <Button
                            variant="outlined"
                            size="large"
                            sx={createButtonStyles('secondary')}
                            component="a"
                            href="https://brdge-ai.com/viewBridge/344-96eac2"
                            target="_blank"
                            rel="noopener"
                        >
                            Watch Education Demo
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
            title: "Upload Your Course Content",
            description: "Submit your lectures, tutorials, or workshop videos. Brdge AI transcribes and prepares your educational content for interactive student engagement."
        },
        {
            number: "02",
            icon: <Sparkles size={32} />,
            title: "Create Your Teaching Assistant",
            description: "Customize your AI tutor by defining its knowledge, tone, and teaching style. Tailor its responses to match your instructional approach and expertise."
        },
        {
            number: "03",
            icon: <Mic size={32} />,
            title: "Clone Your Teaching Voice",
            description: "Let your actual voice power every response. Clone your authentic sound so your AI delivers answers that maintain your teaching presence."
        },
        {
            number: "04",
            icon: <Share2 size={32} />,
            title: "Share With Students",
            description: "Distribute one link. As students watch, they can pause, ask questions, and get immediate, voice-driven answers that deepen their understanding."
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
                            How to Create AI-Powered Courses
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
                            Brdge AI transforms your course content into interactive learning experiences
                            with just four simple steps.
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
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                component={Link}
                                to="/signup"
                                variant="contained"
                                size="large"
                                sx={{
                                    ...createButtonStyles('primary'),
                                    // Replace the transparent/subtle styling with more vibrant colors
                                    background: 'linear-gradient(45deg, #00ffcc, #00B4DB)',
                                    color: '#000000',
                                    fontWeight: 700,
                                    borderWidth: 0,
                                    boxShadow: '0 4px 15px rgba(0, 255, 204, 0.3)',
                                    maxWidth: { xs: '90%', sm: 'auto' },
                                    mx: 'auto',
                                    px: { xs: 4, sm: 6 },
                                    py: { xs: 1.5, sm: 1.5 },
                                    fontSize: { xs: '.90rem', sm: '1.0rem' },
                                    display: 'inline-flex',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #00ffdd, #00C4EB)',
                                        boxShadow: '0 6px 20px rgba(0, 255, 204, 0.4)',
                                        transform: 'translateY(-2px)',
                                    }
                                }}
                            >
                                Create Your First AI Course
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
            id: 'courses',
            icon: <SchoolIcon />,
            title: 'Course Creators',
            subtitle: 'Scale your teaching impact without sacrificing quality',
            details: [
                {
                    title: 'Personalized Learning at Scale',
                    description: 'Let every student interact with your course as if they had a 1:1 session with you, getting personalized guidance in your voice.',
                },
                {
                    title: 'Higher Completion Rates',
                    description: 'Students who can get immediate answers to their questions are 65% more likely to complete your courses.',
                },
                {
                    title: 'Deeper Engagement',
                    description: 'Transform passive watching into active learning through AI-powered conversation with your teaching persona.',
                },
            ],
        },
        {
            id: 'institutions',
            icon: <BusinessCenter />,
            title: 'Educational Institutions',
            subtitle: 'Create interactive learning environments that scale expertise',
            details: [
                {
                    title: 'Faculty Knowledge Scaling',
                    description: 'Allow your best professors and subject matter experts to help more students through AI-powered "always available" guidance.',
                },
                {
                    title: 'Student Support Enhancement',
                    description: 'Provide 24/7 answers to common questions while identifying students who need additional human support.',
                },
                {
                    title: 'Learning Analytics',
                    description: 'Gain insights into what topics students find most challenging and where they need additional resources.',
                },
            ],
        },
        {
            id: 'corporate',
            icon: <RocketLaunchIcon />,
            title: 'Corporate Training',
            subtitle: 'Transform employee onboarding and continuous learning',
            details: [
                {
                    title: 'Interactive Onboarding',
                    description: 'New employees can ask questions during training videos, reducing time-to-productivity and increasing retention.',
                },
                {
                    title: 'Knowledge Preservation',
                    description: 'Capture the expertise of senior staff and subject matter experts in interactive AI versions that guide new team members.',
                },
                {
                    title: 'Consistent Training',
                    description: "Ensure every employee gets the same quality of instruction and guidance, regardless of when or where they're trained.",
                },
            ],
        },
    ];

    // Define consistent card background color to ensure matching across components
    const cardBgColor = 'rgba(0,41,122,0.2)';
    const cardBgColorActive = 'rgba(0,41,122,0.3)';

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
                            Transform Education at Every Level
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
                            Brdge AI empowers educators at all levels by turning standard course content
                            into interactive, AI-powered learning experiences.
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
                                    background: expandedCard === industry.id ? cardBgColorActive : cardBgColor,
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '16px',
                                    border: '1px solid',
                                    borderColor: expandedCard === industry.id
                                        ? 'rgba(0,255,204,0.3)'
                                        : 'rgba(255,255,255,0.1)',
                                    p: { xs: 3, sm: 4 },
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    overflow: 'hidden',
                                    height: '100%', // Make all cards the same height in their collapsed state
                                    display: 'flex',
                                    flexDirection: 'column',
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
                                        display: { xs: 'flex', sm: 'flex' }, // Show on all devices for better UX
                                        position: 'absolute',
                                        bottom: '12px',
                                        left: '12px',
                                        alignItems: 'center',
                                        gap: 1,
                                        zIndex: 2, // Ensure it's above other content
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

                                {/* Spacer for bottom where indicator appears */}
                                <Box sx={{
                                    height: '36px', // Height of indicator plus some padding
                                    mt: 'auto',
                                    visibility: 'hidden'
                                }} />

                                {/* Expandable Content */}
                                <Collapse in={expandedCard === industry.id} sx={{ width: '100%' }}>
                                    <Box sx={{
                                        mt: 3,
                                        pt: 3,
                                        borderTop: '1px solid rgba(255,255,255,0.1)',
                                        background: 'transparent',
                                    }}>
                                        {industry.details.map((detail, idx) => (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    mb: idx !== industry.details.length - 1 ? 3 : 0,
                                                    background: 'transparent',
                                                }}
                                            >
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        color: '#00ffcc',
                                                        fontWeight: 600,
                                                        fontSize: '0.95rem',
                                                        mb: 1,
                                                        textShadow: '0 0 10px rgba(0,255,204,0.2)'
                                                    }}
                                                >
                                                    {detail.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: 'rgba(255,255,255,0.8)',
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
                pt: { xs: 12, sm: 10, md: 12 },
                pb: { xs: 12, sm: 12, md: 16 },
                px: { xs: 4, sm: 4, md: 6 }, // Increased padding on xs (mobile)
                position: 'relative',
                overflow: 'visible',
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderRadius: '24px',
                maxWidth: '1200px',
                mx: 'auto',
                mb: { xs: 8, sm: 10, md: 12 },
            }}
        >
            <Container maxWidth="lg" ref={ref} sx={{ px: { xs: 0, sm: 2 } }}> {/* Reduced padding on mobile */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            fontSize: { xs: '1.9rem', sm: '2.6rem', md: '3.2rem' }, // Reduced font size for mobile
                            fontWeight: 700,
                            color: 'white',
                            mb: 1, // Reduced margin
                            textTransform: 'none',
                            lineHeight: { xs: 1.2, sm: 1.3 }, // Tighter line height on mobile
                            px: { xs: 1, sm: 0 }, // Added horizontal padding on mobile
                        }}
                    >
                        Ready to Let Your Teaching
                    </Typography>
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            fontSize: { xs: '1.9rem', sm: '2.6rem', md: '3.2rem' }, // Reduced font size for mobile
                            fontWeight: 700,
                            color: '#00ffcc',
                            mb: { xs: 3, sm: 4 }, // Reduced margin on mobile
                            textTransform: 'none',
                            letterSpacing: '-0.02em',
                            textShadow: '0 0 20px rgba(0,255,204,0.3)',
                            lineHeight: { xs: 1.2, sm: 1.3 }, // Tighter line height on mobile
                            px: { xs: 1, sm: 0 }, // Added horizontal padding on mobile
                        }}
                    >
                        Reach More Students?
                    </Typography>

                    <Typography
                        variant="h5"
                        align="center"
                        sx={{
                            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }, // Reduced font size
                            fontWeight: 400,
                            color: 'rgba(255,255,255,0.9)',
                            mb: { xs: 5, sm: 6 }, // Reduced bottom margin
                            maxWidth: { xs: '100%', sm: '600px' }, // Full width on mobile
                            mx: 'auto',
                            lineHeight: 1.5,
                            px: { xs: 1, sm: 0 }, // Added horizontal padding on mobile
                        }}
                    >
                        Join educators who are transforming traditional course videos into interactive learning experiences. Scale your teaching impact, improve student outcomes, and provide personalized guidance—all without your constant presence.
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 2, sm: 4 },
                        justifyContent: 'center',
                        maxWidth: { xs: '100%', sm: '600px' }, // Full width on mobile
                        mx: 'auto',
                        mb: { xs: 4, sm: 6, md: 8 },
                        position: 'relative',
                        zIndex: 10,
                        px: { xs: 1, sm: 0 }, // Reduced padding
                    }}>
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ flex: 1, width: '100%' }} // Added width 100%
                        >
                            <Button
                                component={Link}
                                to="/signup"
                                variant="contained"
                                size="large"
                                fullWidth
                                sx={{
                                    ...createButtonStyles('primary'),
                                    height: { xs: 'auto', sm: '60px' }, // Changed to auto height on mobile
                                    minHeight: { xs: '64px', sm: '60px' }, // Added minimum height
                                    fontSize: { xs: '0.85rem', sm: '1.1rem' }, // Further reduced font size on mobile
                                    whiteSpace: 'normal',
                                    lineHeight: 1.2,
                                    py: { xs: 2, sm: 1.75 }, // Added vertical padding on mobile
                                    px: { xs: 2, sm: 4 }, // Adjusted horizontal padding
                                }}
                            >
                                Create Your AI Teaching Assistant
                            </Button>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ flex: 1, width: '100%' }} // Added width 100%
                        >
                            <Button
                                component={Link}
                                to="/demos"
                                variant="outlined"
                                size="large"
                                fullWidth
                                sx={{
                                    ...createButtonStyles('secondary'),
                                    color: 'white',
                                    borderColor: 'rgba(255,255,255,0.5)',
                                    height: { xs: 'auto', sm: '60px' }, // Changed to auto height on mobile
                                    minHeight: { xs: '64px', sm: '60px' }, // Added minimum height
                                    fontSize: { xs: '0.85rem', sm: '1.1rem' }, // Further reduced font size on mobile
                                    whiteSpace: 'normal',
                                    lineHeight: 1.2,
                                    py: { xs: 2, sm: 1.75 }, // Added vertical padding on mobile
                                    px: { xs: 2, sm: 4 }, // Adjusted horizontal padding
                                    '&:hover': {
                                        borderColor: 'rgba(255,255,255,0.4)',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        transform: 'translateY(-2px)',
                                    }
                                }}
                            >
                                See Education Demos
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
                    paddingBottom: { xs: 0, sm: 0, md: 0 }, // Removed bottom padding
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
                            },
                            '&:last-child': {
                                mb: 0, // Remove margin from last child to avoid extra space before footer
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

                {/* Footer positioned at the bottom with no space underneath */}
                <Box
                    sx={{
                        marginTop: 'auto',
                        width: '100%',
                    }}
                >
                    <Footer />
                </Box>
            </Box>
        </ParallaxProvider>
    );
}

export default LandingPage;
