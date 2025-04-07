// src/pages/LandingPage.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    AllInclusive,
    AutoFixHigh,
    VerifiedUser,
} from '@mui/icons-material';
import {
    Upload,
    Sparkles,
    Mic,
    Share2,
    GraduationCap,
    Briefcase,
    Rocket,
    Plus,
    Minus,
} from 'lucide-react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { ParallaxProvider, useParallax } from 'react-scroll-parallax';
import { useInView } from 'react-intersection-observer';
import demoVideo from '../assets/brdge-demo2.mp4';
import logo from '../assets/new-img.png';
import '../fonts.css';
import './LandingPage.css';
import Footer from '../components/Footer';
import videoDemo from '../assets/brdge-front-page-2.mp4';

// --- Import Assets ---
import darkParchmentTexture from '../assets/textures/dark-parchment.png';
import stampLogoTexture from '../assets/brdge-stamp-logo.png';
import lightMarbleTexture from '../assets/textures/light_marble.jpg';
import crumbledParchment from '../assets/textures/crumbled_parchment.jpg';
import grainyMarble from '../assets/textures/grainy-marble.jpg';
import oldMapTexture from '../assets/textures/old_map.jpg';
import ivyVertical from '../assets/ivy/ivy_straight_solid.svg';
import ivyHorizontal from '../assets/ivy_horizontal.svg';
import ivyStraight from '../assets/ivy/ivy_straight2_2tone.svg';
import ivyCorner from '../assets/ivy/ivy_corner_solid.svg';
import ivyLeaves from '../assets/ivy/ivy_leaves.svg';
// Use existing texture for parchment background for now
const parchmentTexture = darkParchmentTexture;

// Use these fallbacks until you can create the proper assets
const inkTextureOverlay = darkParchmentTexture; // Use existing texture as fallback
const parchmentEdge = crumbledParchment; // Use crumbled parchment as edge texture
const parchmentCorner = oldMapTexture; // Use old map for corner decorations

// --- Updated Color Palette ---
const colors = {
    parchment: '#F5EFE0',       // Warmer parchment
    parchmentDark: '#E8E0CC',   // Darker parchment for contrast
    parchmentLight: '#FAF7ED',  // Lighter parchment
    ink: '#0A1933',             // Primary text - rich ink color
    inkLight: '#1E2A42',        // Secondary text 
    inkFaded: '#4A5366',        // Tertiary text
    sepia: '#9C7C38',           // Sepia tone for accents and highlights
    sepiaLight: '#B89F63',      // Lighter sepia for subtle elements
    sepiaFaded: '#D6C7A1',      // Even lighter sepia for backgrounds
    accent: '#00BFA0',          // Softened Cyan for MINIMAL highlights
    accentLight: '#6CDECB',     // Lighter accent for hover states
    mapBorder: '#B8A182',       // Parchment borders
    marbleLight: '#F0EDE8',     // Light marble color
    marbleDark: '#D8D2C8',      // Darker marble for contrast
};

// Replace bold cyan elements with more subtle understated accents
const scholarlyAccent = {
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-3px',
        left: '10%',
        width: '80%',
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${colors.accent}50, transparent)`,
        opacity: 0.7,
    }
};

// Add typography mixins for ink-styled text
const inkTextStyle = {
    color: colors.ink,
    position: 'relative',
    // Comment out the texture overlay until we have the proper asset
    /* '&::before': {
        content: '""',
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `url(${inkTextureOverlay})`,
        backgroundSize: '200px',
        backgroundRepeat: 'repeat',
        mixBlendMode: 'multiply',
        opacity: 0.08,
        pointerEvents: 'none',
    }, */
    // Keep the text shadow for depth
    textShadow: '0 0.5px 0 rgba(10, 25, 51, 0.2)',
    fontWeight: 600, // Heavier weight for ink appearance
};

// Create mixin for parchment with frayed edges
const parchmentContainer = {
    position: 'relative',
    background: colors.parchment,
    borderRadius: '12px',
    // Add high-contrast parchment texture
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${darkParchmentTexture})`,
        backgroundSize: 'cover',
        opacity: 0.15,
        mixBlendMode: 'multiply',
        borderRadius: '12px',
        zIndex: 0,
    },
    // Use a simple border instead of the SVG edge until we have the proper asset
    '&::after': {
        content: '""',
        position: 'absolute',
        top: -4,
        left: -4,
        right: -4,
        bottom: -4,
        border: `1px solid ${colors.sepia}40`,
        borderRadius: '15px',
        pointerEvents: 'none',
        zIndex: -1,
    },
    // Ensure content appears above texture
    '& > *': {
        position: 'relative',
        zIndex: 1,
    },
    // Add subtle border for definition
    border: `1px solid ${colors.sepia}40`,
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
};

// Create mixin for authentic parchment with elegant corners
const scholarlyParchment = {
    position: 'relative',
    background: colors.parchment,
    borderRadius: '10px',
    // More subtle, organic texture
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${darkParchmentTexture})`,
        backgroundSize: 'cover',
        opacity: 0.15,
        mixBlendMode: 'multiply',
        borderRadius: '10px',
        zIndex: 0,
    },
    // Elegant border styling
    '&::after': {
        content: '""',
        position: 'absolute',
        top: -3,
        left: -3,
        right: -3,
        bottom: -3,
        border: `1px solid ${colors.sepia}40`,
        borderRadius: '12px',
        pointerEvents: 'none',
        zIndex: -1,
    },
    // Create subtle corner flourishes
    '& .corner-flourish': {
        position: 'absolute',
        width: '20px',
        height: '20px',
        opacity: 0.6,
        zIndex: 2,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${stampLogoTexture})`,
    },
    '& .corner-flourish-top-left': {
        top: 8,
        left: 8,
        transform: 'rotate(-45deg)',
    },
    '& .corner-flourish-bottom-right': {
        bottom: 8,
        right: 8,
        transform: 'rotate(135deg)',
    },
    // Ensure content appears above texture
    '& > *': {
        position: 'relative',
        zIndex: 1,
    },
    // Add subtle border for definition
    border: `1px solid ${colors.sepia}40`,
    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
};

// --- Updated Typography Settings ---
const fontFamily = 'Satoshi, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const headingFontFamily = '"Canela Text", "Tiempos Headline", Georgia, serif';

// --- Updated Spacing Values ---
const spacing = {
    sectionPadding: { xs: 4, sm: 6, md: 8, lg: 10 }, // Reduced from previous values
    heroPadding: { xs: 8, sm: 9, md: 10, lg: 12 },   // Reduced padding
};

// Replace cyan on buttons with ink/sepia color theme
const createButtonStyles = (variant, isResponsive = true) => {
    const baseStyles = {
        borderRadius: '4px',
        fontWeight: 600,
        fontFamily: fontFamily,
        letterSpacing: '0.02em',
        textTransform: 'none',
        transition: 'all 0.2s ease-out', // Standardized transition
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: { xs: '54px', sm: '54px' },
        fontSize: { xs: '1.0rem', sm: '1.1rem' },
        px: { xs: 3, sm: 4, md: 5 },
        py: { xs: 1.5, sm: 1.75 },
        width: isResponsive ? { xs: '100%', sm: 'auto' } : 'auto',
        whiteSpace: 'nowrap',
        position: 'relative',
        '&:active': {
            transform: 'scale(0.98)',
        },
        '&:focus': {
            outline: `2px solid ${colors.ink}`,
            outlineOffset: '2px',
        },
    };

    if (variant === 'primary') {
        return {
            ...baseStyles,
            backgroundColor: colors.ink,
            color: colors.parchmentLight,
            border: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            // Subtle accent line instead of bright cyan
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '15%',
                right: '15%',
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${colors.sepia}, transparent)`,
                borderRadius: '1px',
                transition: 'all 0.2s ease-out', // Standardized transition
            },
            '&:hover': {
                backgroundColor: colors.inkLight,
                boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
                transform: 'translateY(-2px)',
                '&::after': { // Fade in/out accent slightly
                    opacity: 0.8,
                }
            },
        };
    } else { // Secondary style
        return {
            ...baseStyles,
            borderColor: colors.sepia,
            borderWidth: '1px',
            borderStyle: 'solid',
            backgroundColor: 'rgba(245, 239, 224, 0.5)',
            color: colors.inkLight,
            position: 'relative',
            overflow: 'hidden',
            zIndex: 1,
            transition: 'all 0.2s ease-out', // Standardized transition
            '&:hover': {
                borderColor: colors.ink,
                backgroundColor: 'rgba(245, 239, 224, 0.8)',
                transform: 'translateY(-2px)',
                boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
            },
        };
    }
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

// Add the sway animation keyframes
const ivyAnimations = {
    '@keyframes sway': {
        '0%': { transform: 'rotate(-1deg) translateX(0)' },
        '25%': { transform: 'rotate(-0.5deg) translateX(-5px)' },
        '50%': { transform: 'rotate(1deg) translateX(0)' },
        '75%': { transform: 'rotate(0.5deg) translateX(5px)' },
        '100%': { transform: 'rotate(-1deg) translateX(0)' }
    },
    '@keyframes swayVertical': {
        '0%, 100%': { transform: 'translateY(0)' },
        '30%': { transform: 'translateY(2px) translateX(-2px)' },
        '50%': { transform: 'translateY(3px)' },
        '70%': { transform: 'translateY(1px) translateX(2px)' },
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

    // Updated togglePlayPause to use useCallback for better performance
    const togglePlayPause = useCallback(() => {
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
    }, [videoRef]); // Removed isPlaying dependency to prevent stale closure issues

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
            disableGutters
            sx={{
                pt: { xs: 4, md: spacing.sectionPadding.md }, // Reduced top padding on mobile
                pb: { xs: 4, sm: spacing.sectionPadding.sm, md: spacing.sectionPadding.md }, // Reduced bottom padding on mobile
                px: { xs: 2, sm: 0 }, // Added horizontal padding on mobile
                position: 'relative',
                // Apply parchment container styling with proper edges
                ...parchmentContainer,
                // Override specific styles
                borderRadius: 0,
                // Replace decorative map-like corners with frayed/burnt effect
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${darkParchmentTexture})`,
                    backgroundSize: 'cover',
                    opacity: 0.15, // Higher contrast texture
                    mixBlendMode: 'multiply',
                },
                // Replace the straight top border with an irregular frayed edge
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '15px',
                    backgroundImage: 'radial-gradient(circle at 10% 0, transparent 20px, rgba(156, 124, 56, 0.15) 21px), radial-gradient(circle at 30% 0, transparent 24px, rgba(156, 124, 56, 0.15) 25px), radial-gradient(circle at 50% 0, transparent 18px, rgba(156, 124, 56, 0.15) 19px), radial-gradient(circle at 70% 0, transparent 22px, rgba(156, 124, 56, 0.15) 23px), radial-gradient(circle at 90% 0, transparent 20px, rgba(156, 124, 56, 0.15) 21px)',
                    backgroundSize: '100% 25px',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.7,
                    zIndex: 0,
                },
                // Make child elements appear above the background texture
                '& > *': {
                    position: 'relative',
                    zIndex: 1,
                }
            }}
        >
            <motion.div
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={fadeInUpVariant}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: '1200px',
                        mx: 'auto',
                        gap: { xs: 3, sm: 4, md: 5 } // More space between elements
                    }}
                >
                    {/* Updated Headline with proper casing and no stamp */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 4,
                        position: 'relative',
                    }}>
                        <Typography
                            variant="h2"
                            align="center"
                            sx={{
                                fontFamily: headingFontFamily,
                                fontSize: { xs: '2.4rem', sm: '3.2rem', md: '3.8rem' },
                                fontWeight: 600,
                                color: colors.ink,
                                mb: { xs: 1, sm: 2 },
                                letterSpacing: '-0.01em',
                                lineHeight: 1.2,
                                width: '100%',
                                padding: { xs: '0 8px', sm: 0 },
                                position: 'relative', // For decorative elements
                                textTransform: 'none', // Ensure text is not all caps
                            }}
                        >
                            Turn courses into <Box component="span" sx={{ // Use Box for specific styling
                                fontFamily: headingFontFamily,
                                fontStyle: 'italic',
                                color: colors.ink, // Keep ink color for emphasis
                                position: 'relative',
                                display: 'inline-block',
                                // Subtle sepia underline
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-6px', // Adjust position
                                    left: '5%',
                                    width: '90%',
                                    height: '1.5px', // Thinner line
                                    background: `linear-gradient(90deg, transparent, ${colors.sepia}, transparent)`,
                                    opacity: 0.9,
                                    borderRadius: '1px',
                                }
                            }}>AI classrooms</Box>
                        </Typography>

                        {/* Stamp logo removed as requested */}
                    </Box>

                    {/* Updated Video Section */}
                    <Box
                        className="video-container" // Added class for hover targeting
                        sx={{
                            width: '100%',
                            maxWidth: { xs: '100%', sm: '95%', md: '80%' },
                            position: 'relative',
                            borderRadius: { xs: 0, sm: '8px' }, // More subtle rounding
                            overflow: 'hidden',
                            mx: 'auto',
                            mb: 0,
                            mt: { xs: 2, sm: 1 },
                            px: { xs: 0, sm: 0, md: 0 },
                            minHeight: { xs: '250px', sm: 'auto' },
                            border: {
                                xs: 'none',
                                sm: `1px solid ${colors.ink}22` // Subtle border
                            },
                            boxShadow: {
                                xs: 'none',
                                sm: '0 4px 20px rgba(0,0,0,0.1)',
                            },
                        }}
                    >
                        <motion.div
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            variants={fadeInUpVariant}
                            style={{ width: '100%' }}
                        >
                            <Box sx={{
                                position: 'relative',
                                width: '100%',
                                paddingTop: { xs: '62.5%', sm: '56.25%' },
                                borderRadius: { xs: 0, sm: '8px' }, // Match container
                                overflow: 'hidden', // Ensure video stays contained
                                backgroundColor: '#000', // Add dark bg behind video
                                '& video': {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: { xs: 0, sm: '7px' }, // Slightly smaller to prevent border overlap
                                    objectFit: 'cover', // Changed from contain for better fill
                                }
                            }}>
                                <video
                                    ref={videoRef}
                                    width="100%"
                                    height="100%"
                                    // controls // Removed native controls
                                    playsInline
                                    data-webkit-playsinline="true"
                                    controlsList="nodownload noremoteplayback"
                                    preload="metadata" // Changed preload to metadata
                                    style={{
                                        display: 'block',
                                        backgroundColor: 'transparent',
                                    }}
                                    poster={videoDemo.poster || undefined}
                                    onClick={togglePlayPause} // Allow clicking video itself to play/pause
                                >
                                    <source src={videoDemo} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>

                                {/* New Subtle Play Button - appears on hover of container */}
                                {!isPlaying && ( // Show only if not playing
                                    <Box
                                        className="video-overlay"
                                        onClick={togglePlayPause}
                                        sx={{
                                            position: 'absolute',
                                            top: 0, left: 0, right: 0, bottom: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            zIndex: 3,
                                            backgroundColor: 'rgba(0,0,0,0.1)', // Slightly darker overlay initially
                                            opacity: 0, // Hidden by default
                                            transition: 'opacity 0.3s ease, background-color 0.3s ease',
                                            '.video-container:hover &': { // Target parent hover
                                                opacity: 1,
                                                backgroundColor: 'rgba(0,0,0,0.3)', // Darken on hover
                                            }
                                        }}
                                        aria-label="Play Video"
                                    >
                                        {/* Simple Play Icon (Triangle) */}
                                        <Box
                                            sx={{
                                                width: '60px', // Smaller size
                                                height: '60px',
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(255, 255, 255, 0.15)', // Subtle background
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: `1px solid ${colors.ink}20`, // Subtle border
                                                transition: 'transform 0.2s ease, background-color 0.2s ease',
                                                '.video-overlay:hover &': {
                                                    transform: 'scale(1.05)',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                                },
                                                // Play triangle using borders
                                                '&::after': {
                                                    content: '""',
                                                    display: 'block',
                                                    width: 0,
                                                    height: 0,
                                                    borderTop: '10px solid transparent',
                                                    borderBottom: '10px solid transparent',
                                                    borderLeft: `16px solid ${colors.ink}`, // Ink color triangle
                                                    marginLeft: '4px', // Adjust position
                                                }
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </motion.div>
                    </Box>

                    {/* Updated Text Section */}
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: { xs: '100%', sm: '90%', md: '80%' },
                            textAlign: 'center',
                            mx: 'auto',
                            px: { xs: 3, sm: 4 }, // Increased horizontal padding on mobile
                            mb: { xs: 4, sm: 6 },
                            mt: { xs: 3, sm: 4 }
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                fontFamily: fontFamily,
                                color: colors.ink,
                                mb: { xs: 4, sm: 5 },
                                fontSize: { xs: '1.2rem', sm: '1.35rem', md: '1.45rem' },
                                fontWeight: 400,
                                lineHeight: 1.6,
                                '& strong': {
                                    color: colors.ink,
                                    fontWeight: 600,
                                    fontFamily: fontFamily,
                                    borderBottom: `2px solid ${colors.sepia}44`,
                                }
                            }}
                        >
                            Transform your static course videos into interactive learning experiences. Students can pause, ask questions, and receive instant, voice-driven responses from your AI teaching assistant.
                        </Typography>

                        {/* Updated Feature Bullets - Styling to match HeroSection */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: { xs: 2, sm: 2.5 }, // Reduced gap to match Hero features
                            mb: { xs: 5, sm: 6 },
                            mt: { xs: 3, sm: 4 },
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: '680px', // Match Hero features width
                            mx: 'auto'
                        }}>
                            {[
                                { icon: <VerifiedUser size={22} />, text: "Students ask. Your AI answers.", highlight: "In your voice" },
                                { icon: <AllInclusive size={22} />, text: "Teach once. Guide forever.", highlight: "Even when you're not there" },
                                { icon: <AutoFixHigh size={22} />, text: "See what students", highlight: "struggle with most" }
                            ].map((feature, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start', // Align icon top
                                        width: '100%',
                                        transition: 'all 0.2s ease-out',
                                        gap: 2, // Reduced gap
                                        py: 1, // Reduced padding
                                        position: 'relative',
                                        borderBottom: index !== 2 ? `1px dashed ${colors.sepia}20` : 'none', // Match Hero divider
                                        paddingBottom: index !== 2 ? 1.5 : 0.5,
                                        marginBottom: index !== 2 ? 1 : 0,
                                        '&:hover': {
                                            backgroundColor: `${colors.parchmentDark}40`,
                                            '& .feature-text': {
                                                transform: 'translateX(3px)',
                                            },
                                            '& .feature-icon': {
                                                transform: 'scale(1.1)',
                                            }
                                        }
                                    }}
                                >
                                    <Box
                                        className="feature-icon"
                                        sx={{
                                            width: '36px', // Match Hero icon size
                                            height: '36px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: 0.9,
                                            marginRight: 1.5, // Consistent spacing
                                            transition: 'transform 0.2s ease-out', // Add transform transition
                                        }}
                                    >
                                        {/* Apply theme colors directly to the icon */}
                                        {React.cloneElement(feature.icon, { color: colors.sepia, strokeWidth: 1.5 })}
                                    </Box>
                                    <Box
                                        className="feature-text"
                                        sx={{
                                            display: 'flex',
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            alignItems: { xs: 'flex-start', sm: 'baseline' },
                                            transition: 'transform 0.2s ease-out',
                                            gap: { xs: 0.2, sm: 0.8 },
                                            flex: 1,
                                        }}
                                    >
                                        <Typography sx={{
                                            fontFamily: fontFamily,
                                            fontSize: { xs: '1rem', sm: '1.05rem' },
                                            fontWeight: 300,
                                            color: colors.inkLight,
                                            lineHeight: 1.6,
                                        }}>
                                            {feature.text}
                                        </Typography>
                                        <Typography
                                            component="span"
                                            sx={{
                                                fontFamily: headingFontFamily,
                                                fontSize: { xs: '1rem', sm: '1.05rem' },
                                                fontWeight: 600,
                                                fontStyle: 'italic',
                                                color: colors.sepia,
                                                lineHeight: 1.6,
                                                position: 'relative',
                                                whiteSpace: 'nowrap',
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    bottom: -1,
                                                    left: '5px',
                                                    width: 'calc(100% - 10px)',
                                                    height: '1px',
                                                    background: `linear-gradient(90deg, transparent, ${colors.sepia}60, ${colors.sepia}60, transparent)`,
                                                    opacity: 0.6,
                                                }
                                            }}
                                        >
                                            {feature.highlight}.
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* Updated CTA Buttons */}
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 3, sm: 4 }}
                        sx={{
                            mt: { xs: 2, sm: 3 },
                            justifyContent: 'center',
                            width: '100%',
                            maxWidth: { xs: '100%', sm: '90%', md: '700px' },
                            mx: 'auto',
                            px: { xs: 3, sm: 0 } // Increased horizontal padding on mobile
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
                                flex: { xs: '1 1 auto', sm: 1 },
                            }}
                        >
                            Start Creating AI Courses
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            sx={{
                                ...createButtonStyles('secondary', false),
                                flex: { xs: '1 1 auto', sm: 1 },
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
// HeroSection - Neo-Scholar meets Futuristic AI
//
const HeroSection = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const iconAnimation = useAnimation();
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: false
    });

    // For animated particles
    const [particles, setParticles] = useState([]);
    const particleCount = 30; // Increased for richer atmosphere

    // Create particles on component mount
    useEffect(() => {
        const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // Random position across width (%)
            y: Math.random() * 100, // Random position across height (%)
            size: Math.random() * 3 + 1, // Random size between 1-4px
            opacity: Math.random() * 0.4 + 0.1, // Random opacity
            duration: Math.random() * 60 + 30, // Animation duration in seconds
            delay: Math.random() * 10, // Delay before animation starts
        }));

        setParticles(newParticles);
    }, []);

    const handleMouseMove = (event) => {
        const { clientX, clientY } = event;
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
        const x = (clientX - left) / width;
        const y = (clientY - top) / height;
        setMousePosition({ x, y });
    };

    useEffect(() => {
        const moveX = (mousePosition.x - 0.5) * 10; // Further reduced movement
        const moveY = (mousePosition.y - 0.5) * 10;
        iconAnimation.start({
            x: moveX,
            y: moveY,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        });
    }, [mousePosition, iconAnimation]);

    // Use parallax for subtle depth effects
    const parallaxBackground = useParallax({ speed: -5 });

    return (
        <Box
            component="section"
            sx={{
                position: 'relative',
                px: { xs: 0, sm: 0, md: 0, lg: 0 },
                pt: { xs: 0, sm: 0 },
                pb: { xs: 4, sm: 6 },
                mt: '-1rem',
                borderRadius: '16px',
                background: theme => ({
                    // ... existing background properties ...
                }),
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '16px',
                    border: '1.5px solid rgba(139, 104, 69, 0.35)',
                    boxShadow: '0 0 25px rgba(0, 191, 160, 0.2), inset 0 0 15px rgba(0, 191, 160, 0.12)', // Enhanced cyan blue glow
                    pointerEvents: 'none',
                    zIndex: 1
                }
            }}
        >
            {/* Bottom Left Corner Ivy - Improved positioning and styling */}
            <Box
                component="img"
                src={ivyCorner}
                alt="Bottom Left Corner Ivy"
                sx={{
                    position: 'absolute',
                    bottom: '-5px',
                    left: '-5px',
                    width: { xs: '50px', sm: '90px', md: '110px' }, // Smaller on mobile
                    height: 'auto',
                    objectFit: 'contain',
                    opacity: 0.5,
                    zIndex: 11,
                    pointerEvents: 'none',
                    mixBlendMode: 'normal',
                    transform: 'translateY(0)',
                    filter: 'brightness(1.3) hue-rotate(70deg) saturate(0.9) drop-shadow(0 0 4px rgba(40, 180, 100, 0.3))',
                }}
            />

            {/* Bottom Right Corner Ivy - Improved positioning and styling */}
            <Box
                component="img"
                src={ivyCorner}
                alt="Bottom Right Corner Ivy"
                sx={{
                    position: 'absolute',
                    bottom: '-5px',
                    right: '-5px',
                    width: { xs: '50px', sm: '90px', md: '110px' }, // Smaller on mobile
                    height: 'auto',
                    objectFit: 'contain',
                    transform: 'scaleX(-1)',
                    opacity: 0.5,
                    zIndex: 11,
                    pointerEvents: 'none',
                    mixBlendMode: 'normal',
                    filter: 'brightness(1.3) hue-rotate(70deg) saturate(0.9) drop-shadow(0 0 4px rgba(40, 180, 100, 0.3))',
                }}
            />

            {/* Accent Leaves - Hide on mobile */}
            <Box
                component="img"
                src={ivyLeaves}
                alt="Accent Leaves"
                sx={{
                    position: 'absolute',
                    top: '20%',
                    left: '45%',
                    width: '120px',
                    opacity: 0.3,
                    zIndex: 5,
                    transform: 'rotate(-15deg)',
                    filter: 'brightness(1.3) hue-rotate(70deg) saturate(0.9) drop-shadow(0 0 5px rgba(40, 180, 100, 0.3))',
                    display: { xs: 'none', sm: 'block' }, // Hide on mobile to save space
                }}
            />

            {/* Existing hero content */}
            <Box
                ref={ref}
                sx={{
                    minHeight: { xs: 'auto', sm: '85vh' },
                    width: '100%',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.ink,
                    overflow: 'hidden',
                    // Center the content by avoiding negative margins
                    // and using a more controlled width
                    maxWidth: '100%',
                    mx: 'auto',
                    paddingTop: { xs: 5, sm: 6, md: 8 }, // Increased top padding on mobile
                    paddingBottom: { xs: 10, sm: 10 }, // Increased bottom padding on mobile
                    background: `linear-gradient(165deg, ${colors.parchmentLight} 0%, ${colors.parchment} 100%)`,
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '18px',
                        background: `
                            linear-gradient(90deg, transparent, ${colors.sepia}40 20%, 
                            ${colors.sepia}60 40%, ${colors.sepiaFaded}40 60%, 
                            ${colors.sepia}40 80%, transparent 100%)
                        `,
                        opacity: 0.5,
                        zIndex: 1,
                    }
                }}
                onMouseMove={handleMouseMove}
            >
                {/* Animated particles - subtle floating dust/light specks */}
                {particles.map((particle) => (
                    <Box
                        key={particle.id}
                        component={motion.div}
                        sx={{
                            position: 'absolute',
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            borderRadius: '50%',
                            background: `${colors.sepiaLight}`,
                            opacity: particle.opacity,
                            filter: 'blur(1px)',
                            zIndex: 1,
                        }}
                        initial={{
                            x: `${particle.x}%`,
                            y: `${particle.y}%`,
                            opacity: 0
                        }}
                        animate={{
                            x: [`${particle.x}%`, `${particle.x + (Math.random() * 10 - 5)}%`],
                            y: [`${particle.y}%`, `${particle.y - 10}%`],
                            opacity: [0, particle.opacity, 0]
                        }}
                        transition={{
                            duration: particle.duration,
                            ease: "linear",
                            repeat: Infinity,
                            delay: particle.delay
                        }}
                    />
                ))}

                {/* Subtle Column Silhouettes - Left */}
                <Box
                    sx={{
                        position: 'absolute',
                        left: { xs: '5px', sm: '15px', md: '30px' },
                        top: '50%',
                        height: { xs: '70%', md: '80%' },
                        width: { xs: '8px', sm: '12px', md: '15px' },
                        opacity: 0.15, // Very subtle
                        transform: 'translateY(-50%)',
                        zIndex: 0,
                        // Create ornate border pattern
                        background: `linear-gradient(180deg, transparent, ${colors.sepia}50 15%, 
                                    ${colors.sepia} 50%, ${colors.sepia}50 85%, transparent)`,
                        // Add decorative edge elements
                        '&::before, &::after': {
                            content: '""',
                            position: 'absolute',
                            left: '50%',
                            width: { xs: '20px', sm: '25px', md: '30px' },
                            height: { xs: '10px', sm: '12px', md: '15px' },
                            background: colors.sepia,
                            opacity: 0.3,
                            borderRadius: '50%',
                            transform: 'translateX(-50%)',
                        },
                        '&::before': {
                            top: '15%',
                        },
                        '&::after': {
                            bottom: '15%',
                        }
                    }}
                />

                {/* Subtle Column Silhouettes - Right */}
                <Box
                    sx={{
                        position: 'absolute',
                        right: { xs: '5px', sm: '15px', md: '30px' },
                        top: '50%',
                        height: { xs: '70%', md: '80%' },
                        width: { xs: '8px', sm: '12px', md: '15px' },
                        opacity: 0.15, // Very subtle
                        transform: 'translateY(-50%)',
                        zIndex: 0,
                        // Create ornate border pattern
                        background: `linear-gradient(180deg, transparent, ${colors.sepia}50 15%, 
                                    ${colors.sepia} 50%, ${colors.sepia}50 85%, transparent)`,
                        // Add decorative edge elements
                        '&::before, &::after': {
                            content: '""',
                            position: 'absolute',
                            right: '50%',
                            width: { xs: '20px', sm: '25px', md: '30px' },
                            height: { xs: '10px', sm: '12px', md: '15px' },
                            background: colors.sepia,
                            opacity: 0.3,
                            borderRadius: '50%',
                            transform: 'translateX(50%)',
                        },
                        '&::before': {
                            top: '15%',
                        },
                        '&::after': {
                            bottom: '15%',
                        }
                    }}
                />

                {/* Decorative Header Arc */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: { xs: '70%', sm: '60%', md: '50%', lg: '40%' },
                        height: { xs: '10px', sm: '15px' },
                        zIndex: 0,
                        // Ornate arc pattern with a rich sepia gradient
                        background: `radial-gradient(ellipse at top, ${colors.sepia}20 0%, 
                                    transparent 70%, transparent 100%)`,
                        // Create a fine line at the bottom of the arc
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: { xs: '8px', sm: '12px' },
                            left: '5%',
                            right: '5%',
                            height: '1px',
                            background: `linear-gradient(90deg, transparent, ${colors.sepia}60, transparent)`,
                            opacity: 0.5,
                        },
                        // Add subtle decorative element
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: { xs: '5px', sm: '10px' },
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: { xs: '30px', sm: '40px' },
                            height: { xs: '2px', sm: '3px' },
                            borderRadius: '2px',
                            background: colors.sepia,
                            opacity: 0.3,
                        }
                    }}
                />

                {/* Main Content Container - Ensure it's centered */}
                <Container
                    maxWidth="lg"
                    sx={{
                        position: 'relative',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        mx: 'auto',
                        px: { xs: 2, sm: 3, md: 4 }, // Added more padding on mobile
                    }}
                >
                    {/* Background Parallax Effect */}
                    <Box
                        ref={parallaxBackground.ref}
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url(${darkParchmentTexture})`,
                            backgroundSize: 'cover',
                            opacity: 0.07,
                            mixBlendMode: 'multiply',
                            pointerEvents: 'none',
                            zIndex: 0,
                        }}
                    />

                    {/* Decorative Ink Splash Elements */}
                    <Box
                        component={motion.div}
                        animate={{
                            opacity: [0.12, 0.15, 0.12],
                            scale: [1, 1.02, 1],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                        sx={{
                            position: 'absolute',
                            top: '15%',
                            left: '10%',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50% 60% 40% 50%',
                            background: colors.sepia,
                            opacity: 0.15,
                            // Ink splatter details
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '-4px',
                                left: '8px',
                                width: '5px',
                                height: '5px',
                                borderRadius: '50% 60% 50% 40%',
                                background: colors.sepia,
                                opacity: 0.8,
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '6px',
                                left: '10px',
                                width: '7px',
                                height: '7px',
                                borderRadius: '40% 50% 50% 60%',
                                background: colors.sepia,
                                opacity: 0.4,
                            }
                        }}
                    />

                    <Box
                        component={motion.div}
                        animate={{
                            opacity: [0.15, 0.2, 0.15],
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 6,
                            delay: 1.5,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                        sx={{
                            position: 'absolute',
                            bottom: '25%',
                            right: '12%',
                            width: '9px',
                            height: '9px',
                            borderRadius: '50% 40% 50% 60%',
                            background: colors.sepia,
                            opacity: 0.2,
                            // Ink splatter details
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '7px',
                                left: '-6px',
                                width: '6px',
                                height: '6px',
                                borderRadius: '50% 60% 40% 50%',
                                background: colors.sepia,
                                opacity: 0.5,
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '-3px',
                                left: '-8px',
                                width: '4px',
                                height: '4px',
                                borderRadius: '50%',
                                background: colors.sepia,
                                opacity: 0.3,
                            }
                        }}
                    />

                    {/* Main Hero Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.2,
                            ease: [0.165, 0.84, 0.44, 1]
                        }}
                        style={{
                            width: '100%',
                            maxWidth: '800px',
                            textAlign: 'center',
                            marginBottom: 0,
                            marginTop: '10px',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {/* Small uppercase academic-style label */}
                        <Typography
                            component={motion.p}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            sx={{
                                fontFamily: headingFontFamily,
                                fontSize: { xs: '0.65rem', sm: '0.8rem' }, // Even smaller on mobile
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: colors.sepia,
                                mb: { xs: 1.5, sm: 2 },
                                mt: { xs: 3, sm: 0 }, // Add top margin on mobile only
                                pt: { xs: 3, sm: 0 }, // Add top padding on mobile only
                                opacity: 0.9,
                            }}
                        >
                            For the Voices That Last.
                        </Typography>

                        {/* 1. Updated Hero Headline - More poetic, timeless */}
                        <Typography
                            component={motion.h1}
                            animate={iconAnimation}
                            align="center"
                            className="heading-large neo-scholar-heading"
                            sx={{
                                fontFamily: headingFontFamily,
                                fontSize: { xs: '2.2rem', sm: '3.2rem', md: '4.2rem' }, // Reduced font size on mobile
                                fontWeight: 500,
                                lineHeight: { xs: 1.3, sm: 1.15 }, // Increased line height on mobile for better readability
                                ...inkTextStyle,
                                mb: 1.5,
                                letterSpacing: '-0.02em',
                                position: 'relative',
                                order: 1,
                                // Enhanced decorative underline
                                '&::after': {
                                    content: '""',
                                    display: 'block',
                                    width: '80px',
                                    height: '2px',
                                    background: `linear-gradient(90deg, transparent, ${colors.sepia}, transparent)`,
                                    margin: '20px auto 0',
                                    borderRadius: '2px',
                                    opacity: 0.8,
                                    boxShadow: `1px 1px 0 ${colors.sepia}20, -1px -1px 0 ${colors.sepia}10`,
                                },
                                // Add text mask for ink texture
                                WebkitTextFillColor: 'transparent',
                                WebkitBackgroundClip: 'text',
                                backgroundImage: `linear-gradient(to bottom, ${colors.ink} 95%, ${colors.sepia}90 100%)`,
                            }}
                        >
                            Teach Once. Guide Forever.
                        </Typography>

                        {/* 2. First part of subheading - Enhanced with animated reveal & italic serif */}
                        <Typography
                            component={motion.p}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            align="center"
                            sx={{
                                fontFamily: fontFamily,
                                fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
                                fontWeight: 300,
                                lineHeight: 1.7,
                                color: colors.inkLight,
                                maxWidth: '630px',
                                mx: 'auto',
                                mb: 2,
                                letterSpacing: '0.01em',
                                position: 'relative',
                                order: 2,
                                // Enhanced hover effect for strong/italic text
                                '& em': { // Using em for italic serif quotes
                                    fontFamily: headingFontFamily,
                                    fontStyle: 'italic',
                                    color: colors.ink,
                                    fontWeight: 500,
                                    position: 'relative',
                                    transition: 'all 0.3s ease',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: '-1px',
                                        left: '0',
                                        right: '0',
                                        height: '1px',
                                        background: colors.sepia,
                                        opacity: 0.4,
                                        transition: 'transform 0.3s ease',
                                        transform: 'scaleX(0.95)',
                                        transformOrigin: 'center',
                                    },
                                    '&:hover': {
                                        color: colors.sepia,
                                        '&::after': {
                                            transform: 'scaleX(1.05)',
                                            opacity: 0.8,
                                        }
                                    }
                                }
                            }}
                        >
                            Brdge AI transforms your lectures into <em>interactive, always-on conversations</em>—bringing your wisdom to every student who needs it.
                        </Typography>

                        {/* 3. Refined second part of subheading with recommended microcopy */}
                        <Typography
                            component={motion.p}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            align="center"
                            sx={{
                                fontFamily: fontFamily,
                                fontSize: { xs: '1.0rem', sm: '1.1rem', md: '1.2rem' },
                                fontWeight: 300,
                                lineHeight: 1.7,
                                color: colors.inkLight,
                                maxWidth: '630px',
                                mx: 'auto',
                                mb: 3,
                                letterSpacing: '0.01em',
                                position: 'relative',
                                order: 4,
                                // Enhanced hover effect for em text
                                '& em': {
                                    fontFamily: headingFontFamily,
                                    fontStyle: 'italic',
                                    color: colors.ink,
                                    fontWeight: 500,
                                    position: 'relative',
                                    transition: 'all 0.3s ease',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: '-1px',
                                        left: '0',
                                        right: '0',
                                        height: '1px',
                                        background: colors.sepia,
                                        opacity: 0.4,
                                        transition: 'transform 0.3s ease',
                                        transform: 'scaleX(0.95)',
                                        transformOrigin: 'center',
                                    },
                                    '&:hover': {
                                        color: colors.sepia,
                                        '&::after': {
                                            transform: 'scaleX(1.05)',
                                            opacity: 0.8,
                                        }
                                    }
                                }
                            }}
                        >
                            Whether you're a professor, a coach, or a late-night learner—Brdge helps your <em>voice reach further</em>.
                        </Typography>
                    </motion.div>

                    {/* 5. Enhanced Feature Section with Hover Animations */}
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            maxWidth: '680px',
                            width: '100%',
                            mx: 'auto',
                            mb: { xs: 4, sm: 5 },
                            px: { xs: 2, sm: 0 }, // Added horizontal padding on mobile
                            gap: { xs: 3, sm: 3.5 },
                            position: 'relative',
                            padding: { xs: 2, sm: 3, md: 3.5 },
                            order: 5,
                            // Ornate top/bottom borders
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: '10%',
                                right: '10%',
                                height: '6px',
                                backgroundImage: `url(${crumbledParchment})`,
                                backgroundSize: 'cover',
                                mask: `linear-gradient(90deg, transparent, black 20%, black 80%, transparent)`,
                                opacity: 0.2,
                                zIndex: 0,
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: '15%',
                                right: '15%',
                                height: '4px',
                                backgroundImage: `url(${crumbledParchment})`,
                                backgroundSize: 'cover',
                                mask: `linear-gradient(90deg, transparent, black 30%, black 70%, transparent)`,
                                opacity: 0.15,
                                zIndex: 0,
                            }
                        }}
                    >
                        {[
                            { text: "Create AI tutors that answer student questions", highlight: "in your voice", icon: <GraduationCap size={22} color={colors.sepia} strokeWidth={1.5} /> },
                            { text: "Increase course completion rates with", highlight: "personalized guidance", icon: <Sparkles size={22} color={colors.sepia} strokeWidth={1.5} /> },
                            { text: "Scale your teaching without sacrificing the", highlight: "personal touch", icon: <Briefcase size={22} color={colors.sepia} strokeWidth={1.5} /> },
                            { text: "Learn what your students need through", highlight: "AI insights", icon: <Mic size={22} color={colors.sepia} strokeWidth={1.5} /> }
                        ].map((item, index) => (
                            <Box
                                component={motion.div}
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    delay: 1.2 + (index * 0.1),
                                    duration: 0.5
                                }}
                                whileHover={{
                                    scale: 1.02,
                                    x: 3,
                                    transition: { duration: 0.2 }
                                }}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    position: 'relative',
                                    px: { xs: 2, sm: 1.5 }, // More padding on mobile
                                    py: 0.5,
                                    // Enhanced dividers between items
                                    borderBottom: index !== 3 ? `1px dashed ${colors.sepia}20` : 'none',
                                    paddingBottom: index !== 3 ? 1 : 0.5,
                                    marginBottom: index !== 3 ? 0.5 : 0,
                                    transition: 'all 0.3s ease-out',
                                    // Hover effect with background gradient
                                    '&:hover': {
                                        background: `linear-gradient(90deg, transparent, ${colors.parchmentDark}30, transparent)`,
                                        '& .feature-text': {
                                            transform: 'translateX(3px)',
                                        },
                                        '& .feature-icon': {
                                            transform: 'scale(1.1) rotate(-5deg)',
                                            filter: `drop-shadow(0 0 3px ${colors.accent}40)`,
                                        }
                                    }
                                }}
                            >
                                {/* Icon with enhanced styling */}
                                <Box
                                    className="feature-icon"
                                    sx={{
                                        width: { xs: '32px', sm: '40px' }, // Smaller on mobile
                                        height: { xs: '32px', sm: '40px' }, // Smaller on mobile
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: 0.9,
                                        position: 'relative',
                                        marginRight: { xs: 1.5, sm: 2 }, // Less margin on mobile
                                        marginTop: '0px',
                                        transition: 'transform 0.3s ease-out, filter 0.3s ease-out',
                                        // Add subtle ornate border
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: '5px',
                                            border: `1px dashed ${colors.sepia}20`,
                                            borderRadius: '6px',
                                            opacity: 0.6,
                                            transition: 'opacity 0.3s ease',
                                        },
                                        '&:hover::before': {
                                            opacity: 1,
                                        }
                                    }}
                                >
                                    {item.icon}
                                </Box>

                                {/* Improved text rendering for mobile */}
                                <Box
                                    className="feature-text"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        alignItems: { xs: 'flex-start', sm: 'baseline' },
                                        transition: 'transform 0.3s ease-out',
                                        gap: { xs: 0.2, sm: 0.8 },
                                        position: 'relative',
                                        flex: 1,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: fontFamily,
                                            fontSize: { xs: '0.95rem', sm: '1.05rem' }, // Smaller font on mobile
                                            fontWeight: 300,
                                            color: colors.inkLight,
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {item.text}
                                    </Typography>

                                    <Typography
                                        component={motion.span}
                                        whileHover={{
                                            color: colors.accent,
                                            transition: { duration: 0.2 }
                                        }}
                                        sx={{
                                            fontFamily: headingFontFamily,
                                            fontSize: { xs: '0.95rem', sm: '1.05rem' }, // Smaller font on mobile
                                            fontWeight: 600,
                                            fontStyle: 'italic',
                                            color: colors.sepia,
                                            lineHeight: 1.6,
                                            position: 'relative',
                                            whiteSpace: 'nowrap',
                                            cursor: 'default',
                                            // Enhanced underline with animated gradient
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: -1,
                                                left: '2px',
                                                width: 'calc(100% - 4px)',
                                                height: '1px',
                                                background: `linear-gradient(90deg, transparent, ${colors.sepia}70, ${colors.accent}40, transparent)`,
                                                backgroundSize: '200% 100%',
                                                opacity: 0.8,
                                                transition: 'all 0.5s ease',
                                            },
                                            '&:hover::after': {
                                                backgroundPosition: '100% 0',
                                                opacity: 1,
                                            }
                                        }}
                                    >
                                        {item.highlight}.
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    {/* 6. Enhanced CTA Buttons with better verbs and styling */}
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.8 }}
                        sx={{
                            display: 'flex',
                            gap: { xs: 2, sm: 3.5 },
                            justifyContent: 'center',
                            flexDirection: { xs: 'column', sm: 'row' },
                            width: '100%',
                            maxWidth: { xs: '90%', sm: '600px' },
                            mx: 'auto',
                            mb: { xs: 3, sm: 5 }, // Less margin on mobile
                            px: { xs: 2, sm: 0 },
                            position: 'relative',
                            // Add ornate decorative element above buttons
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '-20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '40px',
                                height: '12px',
                                backgroundImage: `url(${oldMapTexture})`,
                                backgroundSize: 'cover',
                                maskImage: 'linear-gradient(90deg, transparent, black, transparent)',
                                opacity: 0.2,
                            }
                        }}
                    >
                        {/* Primary Button with enhanced styling */}
                        <motion.div
                            whileHover={{
                                scale: 1.03,
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Button
                                component={Link}
                                to="/signup"
                                variant="contained"
                                size="large"
                                sx={{
                                    ...createButtonStyles('primary'),
                                    position: 'relative',
                                    overflow: 'hidden',
                                    py: { xs: 1.5, sm: 1.75 }, // Less padding on mobile
                                    fontSize: { xs: '1rem', sm: '1.15rem' }, // Smaller font on mobile
                                    // Add subtle shine effect on hover
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: '-100%',
                                        width: '100%',
                                        height: '100%',
                                        background: `linear-gradient(90deg, transparent, ${colors.accentLight}20, transparent)`,
                                        transition: 'all 0.6s ease',
                                    },
                                    '&:hover::before': {
                                        left: '100%',
                                    },
                                }}
                                endIcon={<ArrowForward sx={{ transition: 'transform 0.3s ease' }} />}
                            >
                                Teach with Brdge AI
                            </Button>
                        </motion.div>

                        {/* Secondary button with enhanced styling */}
                        <motion.div
                            whileHover={{
                                scale: 1.03,
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Button
                                variant="outlined"
                                size="large"
                                component="a"
                                href="https://brdge-ai.com/viewBridge/344-96eac2"
                                target="_blank"
                                rel="noopener"
                                sx={{
                                    ...createButtonStyles('secondary'),
                                    position: 'relative',
                                    py: { xs: 1.5, sm: 1.75 }, // Less padding on mobile
                                    fontSize: { xs: '1rem', sm: '1.15rem' }, // Smaller font on mobile
                                    // Add subtle illuminate effect
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        inset: '-2px',
                                        background: `linear-gradient(90deg, ${colors.parchmentLight}, ${colors.sepia}30, ${colors.parchmentLight})`,
                                        backgroundSize: '200% 100%',
                                        borderRadius: '6px',
                                        opacity: 0,
                                        transition: 'opacity 0.3s ease, background-position 0.6s ease',
                                        zIndex: -1,
                                    },
                                    '&:hover::before': {
                                        opacity: 1,
                                        backgroundPosition: '100% 0',
                                    }
                                }}
                                // Add play icon
                                startIcon={<motion.div whileHover={{ scale: 1.1 }}>
                                    <Box sx={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        border: `1px solid ${colors.sepia}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        '&::after': {
                                            content: '""',
                                            width: 0,
                                            height: 0,
                                            borderTop: '4px solid transparent',
                                            borderBottom: '4px solid transparent',
                                            borderLeft: `6px solid ${colors.sepia}`,
                                            marginLeft: '1px',
                                        }
                                    }} />
                                </motion.div>}
                            >
                                Watch a Brdge in Action
                            </Button>
                        </motion.div>
                    </Box>

                    {/* 5. Add a Single Centered Visual: Quote in italic serif */}
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        sx={{
                            textAlign: 'center',
                            maxWidth: '700px',
                            mx: 'auto',
                            mt: 3,
                            mb: { xs: 8, sm: 10 }, // Adjusted spacing for mobile
                            position: 'relative',
                            // Add enhanced divider styling with room for logo
                            '&::before, &::after': {
                                content: '""',
                                position: 'absolute',
                                width: { xs: '30%', sm: '35%' }, // Shorter on mobile
                                height: '1px',
                                background: `linear-gradient(90deg, transparent, ${colors.sepia}50, transparent)`,
                                left: 0,
                                bottom: { xs: '-50px', sm: '-80px' }, // Less space on mobile
                                zIndex: 1,
                            },
                            '&::after': {
                                left: 'auto',
                                right: 0,
                            }
                        }}
                    >
                        <Typography
                            component="blockquote"
                            sx={{
                                fontFamily: headingFontFamily,
                                fontStyle: 'italic',
                                fontSize: { xs: '1rem', sm: '1.2rem' }, // Smaller on mobile
                                color: colors.sepia,
                                lineHeight: 1.6,
                                position: 'relative',
                                px: { xs: 2, sm: 0 }, // Add padding on mobile
                                '&::before, &::after': {
                                    content: '"""',
                                    fontFamily: headingFontFamily,
                                    fontWeight: 600,
                                    fontSize: '1.5em',
                                    lineHeight: 0,
                                    verticalAlign: 'baseline',
                                    opacity: 0.6,
                                },
                                '&::before': {
                                    marginRight: '0.2em',
                                    verticalAlign: 'sub',
                                },
                                '&::after': {
                                    marginLeft: '0.2em',
                                }
                            }}
                        >
                            The most generous teachers teach once—and keep showing up.
                        </Typography>

                        {/* Add Logo Stamp to Divider */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: { xs: '-80px', sm: '-120px' }, // Reduced bottom spacing on mobile
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: { xs: '70px', sm: '90px' }, // Smaller on mobile
                                height: { xs: '70px', sm: '90px' }, // Smaller on mobile
                                backgroundColor: colors.parchmentLight,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: `1px solid ${colors.sepia}30`,
                                boxShadow: `0 0 15px ${colors.parchmentLight}, 0 0 8px ${colors.parchmentLight}`,
                                zIndex: 10,
                                // Inner highlight
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    inset: { xs: '4px', sm: '5px' }, // Adjusted for mobile
                                    borderRadius: '50%',
                                    border: `3px solid ${colors.sepia}20`,
                                    zIndex: 3,
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src={stampLogoTexture}
                                alt=""
                                sx={{
                                    width: { xs: '70px', sm: '90px' }, // Smaller on mobile
                                    height: { xs: '70px', sm: '90px' }, // Smaller on mobile
                                    objectFit: 'contain',
                                    opacity: 0.85,
                                    filter: 'contrast(1.1)',
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Decorative Bottom Quill Stroke */}
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 0.4, width: '50px' }}
                        transition={{ delay: 1.6, duration: 1 }}
                        sx={{
                            position: 'absolute',
                            bottom: '5%',
                            left: '40%',
                            height: '2px',
                            background: `linear-gradient(90deg, transparent, ${colors.sepia}70, ${colors.sepia}40)`,
                            transform: 'rotate(-1deg)',
                            // Quill stroke decoration
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-3px',
                                right: '5px',
                                width: '8px',
                                height: '1px',
                                background: colors.sepia,
                                transform: 'rotate(15deg)',
                                opacity: 0.7,
                            }
                        }}
                    />
                </Container>
            </Box>
        </Box>
    );
};

//
// HowItWorksSection - Apply Neo-Scholar aesthetic
//
const HowItWorksSection = () => {
    const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
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
        <Box sx={{
            background: 'transparent',
            py: { xs: 4, sm: spacing.sectionPadding.sm, md: spacing.sectionPadding.md }, // Less padding on mobile
            position: 'relative',
            // Add decorative elements to enhance the scholarly aesthetic
            '&::before': {
                content: '""',
                position: 'absolute',
                top: '5%',
                left: '2%',
                width: '40px',
                height: '40px',
                backgroundImage: `url(${darkParchmentTexture})`,
                backgroundSize: 'contain',
                opacity: 0.15,
                mixBlendMode: 'multiply',
                transform: 'rotate(-15deg)',
                zIndex: 0,
            },
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '8%',
                right: '4%',
                width: '50px',
                height: '50px',
                backgroundImage: `url(${darkParchmentTexture})`,
                backgroundSize: 'contain',
                opacity: 0.25,
                mixBlendMode: 'multiply',
                transform: 'rotate(12deg)',
                zIndex: 0,
            }
        }}>
            <Container maxWidth="lg" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    {/* Section Header - Apply heading font */}
                    <Box sx={{
                        mb: { xs: 6, sm: 8 },
                        position: 'relative',
                        // Add decorative quill stroke
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-12px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '80px',
                            height: '2px',
                            background: `linear-gradient(90deg, transparent, ${colors.sepia}80, transparent)`,
                            borderRadius: '2px',
                            opacity: 0.8,
                        }
                    }}>
                        <Typography
                            variant="h2"
                            align="center"
                            sx={{
                                fontFamily: headingFontFamily,
                                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
                                fontWeight: 600,
                                color: colors.ink,
                                mb: 2,
                                letterSpacing: '-0.02em',
                                textTransform: 'none',
                                position: 'relative',
                                display: 'inline-block',
                                // Subtle decorative flourish
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '-15px',
                                    left: '-25px',
                                    width: '18px',
                                    height: '1px',
                                    background: colors.sepia,
                                    transform: 'rotate(-30deg)',
                                    opacity: 0.5,
                                },
                            }}
                        >
                            How to Create AI-Powered Courses
                        </Typography>

                        <Typography
                            variant="h5"
                            align="center"
                            sx={{
                                fontFamily: fontFamily,
                                color: colors.inkLight,
                                maxWidth: '800px',
                                mx: 'auto',
                                fontSize: { xs: '1.05rem', sm: '1.2rem' },
                                lineHeight: 1.6,
                                textTransform: 'none',
                                px: { xs: 1, sm: 0 },
                                '& strong': {
                                    fontWeight: 600,
                                    color: colors.sepia,
                                    fontFamily: headingFontFamily,
                                    fontStyle: 'italic',
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: '-2px',
                                        left: '0',
                                        right: '0',
                                        height: '1px',
                                        background: colors.sepia,
                                        opacity: 0.4,
                                    }
                                }
                            }}
                        >
                            Transform your course content into <strong>interactive learning experiences</strong> with just four simple steps.
                        </Typography>
                    </Box>

                    {/* Steps Section - Enhanced with Neo-Scholar styling */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 6, sm: 8, md: 8 },
                        position: 'relative',
                        maxWidth: '800px',
                        mx: 'auto',
                        // Refined timeline connector with sepia tint
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: { xs: 'calc(30px + 1.5rem)', md: 'calc(50% - 1px)' },
                            transform: { xs: 'none', md: 'translateX(-50%)' },
                            top: '40px',
                            bottom: '40px',
                            width: '2px',
                            background: `linear-gradient(180deg, 
                                transparent, 
                                ${colors.sepia}20 10%, 
                                ${colors.sepia}30 50%, 
                                ${colors.sepia}20 90%, 
                                transparent)`,
                            zIndex: 0,
                            display: 'block',
                        },
                        // Add subtle dashed pattern to the connector
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            left: { xs: 'calc(30px + 1.5rem)', md: 'calc(50% - 1px)' },
                            transform: { xs: 'none', md: 'translateX(-50%)' },
                            top: '40px',
                            bottom: '40px',
                            width: '2px',
                            background: `repeating-linear-gradient(0deg, 
                                transparent, 
                                transparent 4px, 
                                ${colors.sepia}10 4px, 
                                ${colors.sepia}10 8px)`,
                            zIndex: 0,
                            display: 'block',
                        }
                    }}>
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.8, delay: index * 0.15 }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: {
                                        xs: 'row',
                                        md: index % 2 === 0 ? 'row' : 'row-reverse'
                                    },
                                    alignItems: 'center',
                                    gap: { xs: 3, md: 6 },
                                    position: 'relative',
                                    zIndex: 1,
                                    transition: 'all 0.3s ease',
                                    // Add hover effect for each step
                                    '&:hover': {
                                        '& .step-number': {
                                            color: colors.sepia,
                                            transform: 'scale(1.05)',
                                        },
                                        '& .step-icon': {
                                            transform: 'translateY(-3px)',
                                            boxShadow: `0 6px 15px ${colors.sepia}20`,
                                        },
                                        '& .step-title': {
                                            color: colors.ink,
                                            '&::after': {
                                                width: '100%',
                                                opacity: 0.8,
                                            }
                                        }
                                    }
                                }}>
                                    {/* Icon and Number - Enhanced with scholarly styling */}
                                    <Box sx={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 3,
                                        minWidth: { xs: 'auto', md: '150px' },
                                        justifyContent: {
                                            xs: 'flex-start',
                                            md: index % 2 === 0 ? 'flex-end' : 'flex-start'
                                        }
                                    }}>
                                        <Typography
                                            className="step-number"
                                            sx={{
                                                fontFamily: headingFontFamily,
                                                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                                                fontWeight: 700, // Changed from 600 to 700 for bolder text
                                                color: colors.sepia, // Changed from sepiaLight to sepia for better contrast
                                                width: '40px',
                                                textAlign: index % 2 === 0 ? 'right' : 'left',
                                                order: index % 2 === 0 ? 0 : 1,
                                                transition: 'color 0.3s ease, transform 0.3s ease',
                                                // Add decorative dot/ornament
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    width: '6px',
                                                    height: '6px',
                                                    borderRadius: '50%',
                                                    backgroundColor: colors.sepia,
                                                    opacity: 0.5,
                                                    top: '50%',
                                                    left: index % 2 === 0 ? 'auto' : '12px',
                                                    right: index % 2 === 0 ? '12px' : 'auto',
                                                    transform: 'translateY(-50%)',
                                                }
                                            }}
                                        >
                                            {step.number}
                                        </Typography>

                                        {/* Enhanced Icon Display */}
                                        <Box
                                            className="step-icon"
                                            sx={{
                                                width: { xs: '60px', sm: '70px' },
                                                height: { xs: '60px', sm: '70px' },
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: colors.ink,
                                                position: 'relative',
                                                order: index % 2 === 0 ? 1 : 0,
                                                background: `linear-gradient(135deg, ${colors.parchmentLight}, ${colors.parchment})`,
                                                border: `1px solid ${colors.sepia}30`,
                                                borderRadius: '12px',
                                                boxShadow: `0 3px 10px ${colors.inkLight}10`,
                                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                                // Add parchment texture
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    inset: 0,
                                                    backgroundImage: `url(${darkParchmentTexture})`,
                                                    backgroundSize: 'cover',
                                                    opacity: 0.08,
                                                    borderRadius: '12px',
                                                    mixBlendMode: 'multiply',
                                                }
                                            }}
                                        >
                                            {/* Apply theme color directly */}
                                            {React.cloneElement(step.icon, {
                                                size: 28,
                                                color: colors.sepia,
                                                strokeWidth: 1.5,
                                                style: { position: 'relative', zIndex: 2 }
                                            })}
                                        </Box>
                                    </Box>

                                    {/* Text Content - Enhanced with scholarly styling */}
                                    <Box sx={{
                                        flex: 1,
                                        textAlign: { xs: 'left', md: index % 2 === 0 ? 'left' : 'right' },
                                        maxWidth: { md: '450px' }
                                    }}>
                                        <Typography
                                            className="step-title"
                                            variant="h5"
                                            sx={{
                                                fontFamily: headingFontFamily,
                                                mb: 1.5,
                                                color: colors.sepia,
                                                fontSize: { xs: '1.3rem', sm: '1.4rem' },
                                                fontWeight: 600,
                                                letterSpacing: '-0.01em',
                                                transition: 'color 0.3s ease',
                                                position: 'relative',
                                                display: 'inline-block',
                                                // Add animated underline effect
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    bottom: '-4px',
                                                    left: 0,
                                                    width: '40%',
                                                    height: '1px',
                                                    background: `linear-gradient(90deg, ${colors.sepia}80, ${colors.sepia}30)`,
                                                    transition: 'width 0.3s ease, opacity 0.3s ease',
                                                    opacity: 0.5,
                                                }
                                            }}
                                        >
                                            {step.title}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: fontFamily,
                                                color: colors.inkLight,
                                                fontSize: { xs: '1.0rem', sm: '1.1rem' },
                                                lineHeight: 1.6,
                                                maxWidth: '500px',
                                                mx: { xs: 0, md: index % 2 === 0 ? 0 : 'auto' },
                                                // Emphasis styling
                                                '& strong': {
                                                    fontWeight: 600,
                                                    color: colors.ink,
                                                    position: 'relative',
                                                }
                                            }}
                                        >
                                            {step.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </motion.div>
                        ))}
                    </Box>

                    {/* Enhanced CTA Button with Neo-Scholar styling */}
                    <Box sx={{
                        mt: { xs: 8, sm: 10, md: 12 },
                        textAlign: 'center',
                        position: 'relative',
                        // Add decorative flourish
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '-20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '30px',
                            height: '10px',
                            backgroundImage: `url(${stampLogoTexture})`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            opacity: 0.9,
                        }
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
                                    ...createButtonStyles('primary', false),
                                    position: 'relative',
                                    backgroundColor: colors.ink,
                                    color: colors.parchmentLight,
                                    py: 1.75,
                                    px: 5,
                                    '&:hover': {
                                        backgroundColor: colors.inkLight,
                                        transform: 'translateY(-3px)',
                                    },
                                    // Enhanced accent line
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 0,
                                        left: '10%',
                                        right: '10%',
                                        height: '3px',
                                        background: `linear-gradient(90deg, transparent, ${colors.sepia}, transparent)`,
                                        borderRadius: '2px',
                                    }
                                }}
                                endIcon={<Sparkles size={18} />}
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
            icon: <GraduationCap />,
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
            icon: <Briefcase />,
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
            icon: <Rocket />,
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

    return (
        <Box sx={{ background: 'transparent', py: spacing.sectionPadding }}> {/* Added padding */}
            <Container maxWidth="lg" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    {/* Section Header - Apply heading font */}
                    <Box sx={{ mb: { xs: 6, sm: 8 } }}>
                        <Typography
                            variant="h2"
                            align="center"
                            sx={{
                                fontFamily: headingFontFamily,
                                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
                                fontWeight: 600,
                                color: colors.ink,
                                mb: 2,
                                letterSpacing: '-0.02em',
                                textTransform: 'none',
                            }}
                        >
                            Transform Education at Every Level
                        </Typography>

                        <Typography
                            variant="h5" // Style with sx
                            align="center"
                            sx={{
                                fontFamily: fontFamily, // Body font
                                color: colors.inkLight,
                                maxWidth: '800px',
                                mx: 'auto',
                                fontSize: { xs: '1.05rem', sm: '1.2rem' }, // Adjust size
                                lineHeight: 1.6,
                                textTransform: 'none',
                                px: { xs: 1, sm: 0 },
                            }}
                        >
                            Brdge AI empowers educators at all levels by turning standard course content
                            into interactive, AI-powered learning experiences.
                        </Typography>
                    </Box>

                    {/* Cards Container */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                        gap: { xs: 3, sm: 4 },
                        width: '100%',
                    }}>
                        {industries.map((industry) => (
                            <Paper
                                key={industry.id}
                                onClick={() => handleCardClick(industry.id)}
                                elevation={0}
                                sx={{
                                    ...scholarlyParchment,
                                    padding: { xs: 2.5, sm: 3 },
                                    height: '100%',
                                    cursor: 'pointer',
                                    background: colors.parchmentDark,
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    pb: 6,
                                    '&:hover': {
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                                    },
                                    // Remove the corner flourishes by overriding their display
                                    '& .corner-flourish': {
                                        display: 'none', // This hides the corner flourishes
                                    }
                                }}
                            >
                                {/* Remove these lines or comment them out */}
                                {/* <Box className="corner-flourish corner-flourish-top-left" /> */}
                                {/* <Box className="corner-flourish corner-flourish-bottom-right" /> */}

                                {/* Rest of the card content */}
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    // Removed gap, mb, mt to use padding/margins within items
                                    height: '100%', // Ensure content box takes height
                                }}>
                                    {/* Card Header */}
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 2.5,
                                        mb: 2,
                                    }}>
                                        {/* Simplified Icon Box */}
                                        <Box sx={{
                                            p: 1.5,
                                            bgcolor: 'rgba(10, 25, 51, 0.05)', // Lighter ink background
                                            borderRadius: '8px', // Softer rounding
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: `1px solid ${colors.mapBorder}30`, // Lighter border
                                        }}>
                                            {/* Use Lucide icon directly with theme colors */}
                                            {React.cloneElement(industry.icon, {
                                                size: 24, // Consistent size
                                                color: colors.ink, // Use ink color
                                                strokeWidth: 1.5
                                            })}
                                        </Box>

                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                sx={{
                                                    fontFamily: headingFontFamily,
                                                    color: colors.ink,
                                                    fontSize: { xs: '1.2rem', sm: '1.3rem' },
                                                    fontWeight: 600,
                                                    mb: 0.5,
                                                    lineHeight: 1.3,
                                                }}
                                            >
                                                {industry.title}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontFamily: fontFamily,
                                                    color: colors.inkLight,
                                                    fontSize: '0.9rem',
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {industry.subtitle}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Expandable Content */}
                                    <Collapse in={expandedCard === industry.id} sx={{ width: '100%', mt: 'auto' }}>
                                        <Box sx={{
                                            pt: 2, // Reduced padding top
                                            mt: 2, // Added margin top
                                            borderTop: `1px solid ${colors.mapBorder}40`,
                                            background: 'transparent',
                                        }}>
                                            {industry.details.map((detail, idx) => (
                                                <Box
                                                    key={idx}
                                                    sx={{
                                                        mb: idx !== industry.details.length - 1 ? 2.5 : 0,
                                                        background: 'transparent',
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontFamily: fontFamily,
                                                            color: colors.sepia, // Use sepia for detail title
                                                            fontWeight: 600,
                                                            fontSize: '1rem',
                                                            mb: 0.5,
                                                        }}
                                                    >
                                                        {detail.title}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            fontFamily: fontFamily,
                                                            color: colors.inkLight,
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
                                </Box>

                                {/* Custom Chevron Expand Indicator */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 16, // Adjusted position
                                        left: '50%', // Center horizontally
                                        transform: 'translateX(-50%)', // Center horizontally
                                        width: 20, // Smaller indicator
                                        height: 20,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: colors.inkLight, // Theme color for chevron
                                        transition: 'transform 0.3s ease',
                                        // Rotate chevron based on expanded state
                                        ...(expandedCard === industry.id && {
                                            transform: 'translateX(-50%) rotate(180deg)',
                                        }),
                                        '&::before': { // Create chevron using borders
                                            content: '""',
                                            display: 'block',
                                            width: '8px',
                                            height: '8px',
                                            borderLeft: `2px solid ${colors.inkLight}`,
                                            borderBottom: `2px solid ${colors.inkLight}`,
                                            transform: 'rotate(-45deg)',
                                            transition: 'border-color 0.3s ease',
                                        }
                                    }}
                                />
                            </Paper>
                        ))}
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

//
// FinalCTA - Apply Neo-Scholar aesthetic
//
const FinalCTA = () => {
    const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

    return (
        <Box
            sx={{
                position: 'relative',
                background: `url('/textures/parchment.png')`,
                overflow: 'hidden',
                pt: { xs: 6, sm: 10, md: 12 }, // Reduced top padding on mobile
                pb: { xs: 6, sm: 10, md: 12 }, // Reduced bottom padding on mobile
            }}
        >
            {/* Left Ivy - Enhanced styling */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '12%',
                    opacity: 1,
                    pointerEvents: 'none',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    maskImage: 'linear-gradient(to right, transparent, rgba(0,0,0,0.7) 15%, rgba(0,0,0,1) 30%)',
                    '& > img': {
                        position: 'absolute',
                        height: '100%',
                        left: '-30%',
                        opacity: 0.15,
                        filter: 'url(#ivy-color-filter) hue-rotate(5deg) saturate(1.2)',
                        animation: 'sway 10s ease-in-out infinite',
                    }
                }}
            >
                <Box
                    component="img"
                    src={ivyVertical}
                    alt="Left Ivy Primary"
                    sx={{
                        animation: 'sway 10s ease-in-out infinite !important',
                        opacity: '0.15 !important',
                    }}
                />
                <Box
                    component="img"
                    src={ivyVertical}
                    alt="Left Ivy Secondary"
                    sx={{
                        opacity: '0.08 !important',
                        left: '-15% !important',
                        scale: '0.65',
                        animationDelay: '1.5s !important',
                        animation: 'sway 12s ease-in-out infinite !important',
                    }}
                />
            </Box>

            {/* Right Ivy - Enhanced styling */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    height: '100%',
                    width: '12%', // Control width of the ivy border area
                    opacity: 1,
                    pointerEvents: 'none',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    // Add gradient overlay mask for better edge fading
                    maskImage: 'linear-gradient(to left, transparent, rgba(0,0,0,0.7) 15%, rgba(0,0,0,1) 30%)',
                    // Flipped horizontally
                    transform: 'scaleX(-1)',
                    // Layered ivy effect with multiple instances
                    '& > img': {
                        position: 'absolute',
                        height: '100%',
                        left: '-30%', // Adjust position to show the right part of the ivy
                        opacity: 0.15,
                        filter: 'hue-rotate(10deg) saturate(1.1)', // Subtle color adjustment
                        animation: 'sway 10s ease-in-out infinite',
                    }
                }}
            >
                {/* Main large ivy */}
                <Box
                    component="img"
                    src={ivyVertical}
                    alt="Right Ivy Primary"
                    sx={{
                        animation: 'sway 10s ease-in-out infinite !important',
                        animationDelay: '0.5s !important',
                        opacity: '0.15 !important',
                    }}
                />

                {/* Secondary smaller ivy for layering */}
                <Box
                    component="img"
                    src={ivyVertical}
                    alt="Right Ivy Secondary"
                    sx={{
                        opacity: '0.08 !important',
                        left: '-15% !important',
                        scale: '0.65',
                        animationDelay: '2s !important',
                        animation: 'sway 12s ease-in-out infinite !important',
                    }}
                />
            </Box>

            {/* Top Ivy - Modified for better horizontal styling */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: '5%',
                    width: '90%',
                    height: '15%', // Restrict height to top portion
                    opacity: 0.08,
                    pointerEvents: 'none',
                    zIndex: 1,
                    overflow: 'hidden',
                    animation: 'swayVertical 8s ease-in-out infinite',
                }}
            >
                <Box
                    component="img"
                    src={ivyHorizontal}
                    alt="Top Ivy"
                    sx={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: 'none',
                        objectFit: 'cover',
                        objectPosition: 'top',
                    }}
                />
            </Box>

            {/* Bottom Ivy - Modified for better horizontal styling */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: '5%',
                    width: '90%',
                    height: '15%', // Restrict height to bottom portion
                    opacity: 0.08,
                    pointerEvents: 'none',
                    zIndex: 1,
                    overflow: 'hidden',
                    transform: 'scaleY(-1)', // flip vertically
                    animation: 'swayVertical 8s ease-in-out infinite',
                }}
            >
                <Box
                    component="img"
                    src={ivyHorizontal}
                    alt="Bottom Ivy"
                    sx={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: 'none',
                        objectFit: 'cover',
                        objectPosition: 'top',
                    }}
                />
            </Box>

            {/* Existing CTA content */}
            <Typography
                variant="h2"
                align="center"
                sx={{
                    fontFamily: headingFontFamily,
                    fontSize: { xs: '1.8rem', sm: '2.8rem', md: '3.4rem' }, // Reduced size on mobile
                    fontWeight: 600,
                    color: colors.ink,
                    mb: 1,
                    textTransform: 'none',
                    lineHeight: { xs: 1.3, sm: 1.3 }, // Adjusted line height
                    px: { xs: 2, sm: 0 }, // Added horizontal padding on mobile
                }}
            >
                Ready to Let Your Teaching
            </Typography>
            <Typography
                variant="h2"
                align="center"
                sx={{
                    fontFamily: headingFontFamily,
                    fontSize: { xs: '1.8rem', sm: '2.8rem', md: '3.4rem' }, // Reduced size on mobile
                    fontWeight: 700,
                    color: colors.sepia, // Change from accent to sepia
                    mb: { xs: 3, sm: 5 }, // Less margin on mobile
                    textTransform: 'none',
                    letterSpacing: '-0.02em',
                    lineHeight: { xs: 1.3, sm: 1.3 }, // Adjusted line height
                    px: { xs: 2, sm: 0 }, // Added horizontal padding on mobile
                }}
            >
                Reach More Students?
            </Typography>

            <Typography
                variant="h5"
                align="center"
                sx={{
                    fontFamily: fontFamily,
                    fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }, // Smaller on mobile
                    fontWeight: 400,
                    color: colors.inkLight,
                    mb: { xs: 4, sm: 6 }, // Less margin on mobile
                    maxWidth: { xs: '95%', sm: '700px' }, // Wider on mobile
                    mx: 'auto',
                    lineHeight: 1.6,
                    px: { xs: 2, sm: 0 }, // Added padding on mobile
                }}
            >
                Join educators transforming traditional videos into interactive learning experiences. Scale your impact, improve student outcomes, and provide personalized guidance—all without your constant presence.
            </Typography>

            {/* Update CTA buttons - Primary button with ink color */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 3 },
                justifyContent: 'center',
                maxWidth: { xs: '100%', sm: '650px' },
                mx: 'auto',
                position: 'relative',
                zIndex: 10,
                px: { xs: 1, sm: 0 },
            }}>
                {/* Updated primary button styling */}
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ flex: 1, width: '100%' }}
                >
                    <Button
                        component={Link}
                        to="/signup"
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{
                            ...createButtonStyles('primary', false),
                            position: 'relative',
                            minHeight: '60px',
                            fontSize: '1.15rem',
                            // Button styling handled by updated createButtonStyles
                        }}
                    >
                        Create Your AI Teaching Assistant
                    </Button>
                </motion.div>

                {/* Updated secondary button */}
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ flex: 1, width: '100%' }}
                >
                    <Button
                        variant="outlined"
                        size="large"
                        fullWidth
                        component="a"
                        href="https://brdge-ai.com/viewBridge/344-96eac2"
                        target="_blank"
                        rel="noopener"
                        sx={{
                            ...createButtonStyles('secondary', false),
                            position: 'relative',
                            borderRadius: '8px', // Consistent rounding
                            minHeight: '60px',
                            fontSize: '1.15rem',
                            // Button styling handled by updated createButtonStyles
                        }}
                    >
                        Watch Education Demo
                    </Button>
                </motion.div>
            </Box>
        </Box>
    );
};

// Create a more ornate scholarly divider
const ScholarlyDivider = ({ margin = { xs: 4, sm: 6, md: 8 }, width = { xs: '85%', sm: '70%' } }) => (
    <Box
        sx={{
            my: margin,
            mx: 'auto',
            width: width,
            height: { xs: '6px', sm: '8px' }, // Smaller height on mobile
            position: 'relative',
            opacity: 0.9, // Increased opacity for better visibility
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            // Main divider line with gradient
            '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '0',
                right: '0',
                height: '1px',
                background: `linear-gradient(90deg, transparent, ${colors.sepia}70, ${colors.sepia}90, ${colors.sepia}70, transparent)`,
                transform: 'translateY(-50%)',
                zIndex: 1,
            },

            // Decorative line pattern on sides
            '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '5%',
                right: '5%',
                height: '3px',
                background: `repeating-linear-gradient(90deg, 
                    transparent, transparent 20px, 
                    ${colors.sepia}30 20px, ${colors.sepia}30 25px)`,
                transform: 'translateY(-50%)',
                opacity: 0.6,
                zIndex: 0,
            },
        }}
    >
        {/* Center stamp with enhanced styling */}
        <Box
            sx={{
                position: 'relative',
                width: { xs: '40px', sm: '50px' }, // Smaller on mobile
                height: { xs: '40px', sm: '50px' }, // Smaller on mobile
                backgroundColor: colors.parchmentLight,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${colors.sepia}30`,
                boxShadow: `0 0 10px ${colors.parchmentLight}, 0 0 5px ${colors.parchmentLight}`,
                zIndex: 2, // Place above lines

                // Inner highlight
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: { xs: '2px', sm: '3px' }, // Smaller on mobile
                    borderRadius: '50%',
                    border: `1px solid ${colors.sepia}20`,
                    zIndex: 3,
                },
            }}
        >
            <Box
                component="img"
                src={stampLogoTexture}
                alt=""
                sx={{
                    width: { xs: '28px', sm: '35px' }, // Smaller on mobile
                    height: { xs: '28px', sm: '35px' }, // Smaller on mobile
                    objectFit: 'contain',
                    opacity: 0.85,
                    filter: 'contrast(1.1)',
                    transform: 'rotate(10deg)',
                }}
            />
        </Box>
    </Box>
);

// Create a quill pen mark component for section titles
const QuillMark = ({ color = colors.sepia, opacity = 0.6, rotation = -10 }) => (
    <Box
        sx={{
            position: 'absolute',
            width: '25px',
            height: '3px',
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            transform: `rotate(${rotation}deg)`,
            opacity: opacity,
            borderRadius: '1px',
        }}
    />
);

const storyData = [
    {
        title: "A Bridge Between Minds",
        image: "/brdge-ai-core.png",
        subtitle: "Where mentorship meets memory.",
        description: "Brdge AI carries the teacher's voice forward—so students never lose the wisdom they need. The conversation doesn't end when the class does."
    },
    {
        title: "Teach Once Answer Forever",
        image: "/teach-once.png",
        subtitle: "Presence without pressure.",
        description: "You taught with care. Brdge AI carries that care into every answer. Now, students can ask again—and again—and still feel understood."
    },
    {
        title: "The Moment They Both Earned",
        image: "/moment-earned.png",
        subtitle: "The reward of real teaching.",
        description: "Brdge AI helps more students get to this moment—by meeting them when and where they need it most. It's not just scale. It's significance."
    },
    {
        title: "The Future is Self-Taught",
        image: "/self-taught.webp",
        subtitle: "The classroom has expanded.",
        description: "For every student learning at 2AM, for every question they were too afraid to ask—Brdge AI is there. This isn't school as it was. It's learning as it should be. Self-driven. Supportive. Limitless."
    },
];

const StorySection = () => {
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    return (
        <Box sx={{
            py: { xs: 5, sm: spacing.sectionPadding.sm, md: spacing.sectionPadding.md }, // Adjusted padding on mobile
            position: 'relative',
            // Enhanced background with parchment styling
            background: `linear-gradient(135deg, ${colors.parchmentLight} 0%, ${colors.parchment} 100%)`,
            // Add subtle texture overlay
            '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${darkParchmentTexture})`,
                backgroundSize: 'cover',
                opacity: 0.08,
                mixBlendMode: 'multiply',
                zIndex: 0,
            },
            // Add decorative top border
            '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '15%',
                right: '15%',
                height: '6px',
                backgroundImage: `url(${crumbledParchment})`,
                backgroundSize: 'cover',
                mask: `linear-gradient(90deg, transparent, black 30%, black 70%, transparent)`,
                opacity: 0.15,
                zIndex: 0,
            }
        }}>
            {/* Decorative Ink Splash Elements */}
            <Box
                component={motion.div}
                animate={{
                    opacity: [0.12, 0.15, 0.12],
                    scale: [1, 1.02, 1],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '8%',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50% 60% 40% 50%',
                    background: colors.sepia,
                    opacity: 0.15,
                    zIndex: 0,
                    // Ink splatter details
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '-4px',
                        left: '8px',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50% 60% 50% 40%',
                        background: colors.sepia,
                        opacity: 0.8,
                    },
                }}
            />

            <Box
                component={motion.div}
                animate={{
                    opacity: [0.15, 0.2, 0.15],
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    duration: 6,
                    delay: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                sx={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '10%',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50% 40% 50% 60%',
                    background: colors.sepia,
                    opacity: 0.2,
                    zIndex: 0,
                }}
            />

            <Container maxWidth="lg" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    {/* Section Header with Neo-Scholar styling */}
                    <Box sx={{
                        mb: { xs: 6, sm: 8 },
                        position: 'relative',
                        textAlign: 'center',
                        // Add decorative quill stroke
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-15px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '80px',
                            height: '2px',
                            background: `linear-gradient(90deg, transparent, ${colors.sepia}80, transparent)`,
                            borderRadius: '2px',
                            opacity: 0.8,
                        }
                    }}>
                        <Box
                            component={motion.div}
                            initial={{ opacity: 0, y: -10 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            sx={{
                                position: 'relative',
                                display: 'inline-block',
                                mb: 2,
                            }}
                        >
                            {/* Decorative quill mark above title */}
                            <Box sx={{
                                position: 'absolute',
                                top: '-20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '30px',
                                height: '12px',
                                backgroundImage: `url(${stampLogoTexture})`,
                                backgroundSize: 'cover',
                                opacity: 0.3,
                            }} />

                            <Typography variant="h2" sx={{
                                fontFamily: headingFontFamily,
                                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.4rem' },
                                fontWeight: 600,
                                color: colors.ink,
                                letterSpacing: '-0.02em',
                                textTransform: 'none',
                                // Add ink-like text styling
                                WebkitTextFillColor: 'transparent',
                                WebkitBackgroundClip: 'text',
                                backgroundImage: `linear-gradient(to bottom, ${colors.ink} 95%, ${colors.sepia}90 100%)`,
                            }}>
                                Why Brdge AI Matters
                            </Typography>
                        </Box>

                        <Typography
                            component={motion.p}
                            initial={{ opacity: 0, y: 10 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            sx={{
                                fontFamily: fontFamily,
                                color: colors.inkLight,
                                fontSize: { xs: '1.05rem', sm: '1.2rem' },
                                lineHeight: 1.6,
                                maxWidth: '700px',
                                mx: 'auto',
                                px: { xs: 2, sm: 0 },
                            }}
                        >
                            These stories highlight how Brdge AI solves real-world teaching challenges and transforms educational experiences for both educators and students.
                        </Typography>
                    </Box>

                    {/* Story Cards with Neo-Scholar styling */}
                    <Stack spacing={{ xs: 6, md: 8 }}>
                        {storyData.map((story, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: { xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' },
                                        alignItems: 'center',
                                        gap: { xs: 4, md: 6 },
                                        position: 'relative',
                                        // Add subtle quill mark for decoration
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: index % 2 === 0 ? '10%' : '15%',
                                            left: index % 2 === 0 ? '45%' : '50%',
                                            width: '15px',
                                            height: '1px',
                                            background: `linear-gradient(90deg, transparent, ${colors.sepia}60, transparent)`,
                                            transform: `rotate(${index % 2 === 0 ? '-15' : '12'}deg)`,
                                            opacity: 0.6,
                                            zIndex: 0,
                                        }
                                    }}
                                >
                                    {/* Image with scholarly frame styling */}
                                    <Box
                                        component={motion.div}
                                        whileHover={{
                                            scale: 1.02,
                                            transition: { duration: 0.3 }
                                        }}
                                        sx={{
                                            width: { xs: '100%', md: '50%' },
                                            position: 'relative',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            // Add parchment frame effect
                                            border: `1px solid ${colors.sepia}30`,
                                            boxShadow: `0 8px 25px rgba(0,0,0,0.12)`,
                                            padding: '8px',
                                            background: colors.parchmentLight,
                                            // Add texture to frame
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                inset: 0,
                                                backgroundImage: `url(${darkParchmentTexture})`,
                                                backgroundSize: 'cover',
                                                opacity: 0.08,
                                                mixBlendMode: 'multiply',
                                                zIndex: 0,
                                            },
                                            // Add subtle corner decorations
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                borderRadius: '12px',
                                                border: `1px solid ${colors.sepia}20`,
                                                pointerEvents: 'none',
                                                zIndex: 2,
                                            }
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={story.image}
                                            alt={story.title}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                position: 'relative',
                                                zIndex: 1,
                                            }}
                                        />

                                        {/* Add corner flourishes to images */}
                                        <Box sx={{
                                            position: 'absolute',
                                            top: '10px',
                                            left: '10px',
                                            width: '20px',
                                            height: '20px',
                                            borderTop: `1px solid ${colors.sepia}60`,
                                            borderLeft: `1px solid ${colors.sepia}60`,
                                            zIndex: 2,
                                        }} />

                                        <Box sx={{
                                            position: 'absolute',
                                            bottom: '10px',
                                            right: '10px',
                                            width: '20px',
                                            height: '20px',
                                            borderBottom: `1px solid ${colors.sepia}60`,
                                            borderRight: `1px solid ${colors.sepia}60`,
                                            zIndex: 2,
                                        }} />
                                    </Box>

                                    {/* Text content with neo-scholar styling */}
                                    <Box
                                        component={motion.div}
                                        whileHover={{ x: index % 2 === 0 ? 5 : -5 }}
                                        sx={{
                                            flex: 1,
                                            textAlign: { xs: 'center', md: 'left' },
                                            padding: { xs: 2, md: 3 },
                                            position: 'relative',
                                            // Add subtle border on hover
                                            '&:hover::before': {
                                                opacity: 0.8,
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                left: 0,
                                                top: '20%',
                                                bottom: '20%',
                                                width: '2px',
                                                background: `linear-gradient(to bottom, transparent, ${colors.sepia}50, transparent)`,
                                                opacity: 0.4,
                                                transition: 'opacity 0.3s ease',
                                                display: { xs: 'none', md: 'block' },
                                                left: index % 2 === 0 ? 0 : 'auto',
                                                right: index % 2 === 0 ? 'auto' : 0,
                                            }
                                        }}
                                    >
                                        <Typography
                                            variant="h4"
                                            component={motion.h4}
                                            whileHover={{
                                                color: colors.sepia,
                                                transition: { duration: 0.2 }
                                            }}
                                            sx={{
                                                fontFamily: headingFontFamily,
                                                color: colors.ink,
                                                fontSize: { xs: '1.6rem', sm: '2.2rem' }, // Smaller on mobile
                                                fontWeight: 600,
                                                mb: { xs: 1.5, sm: 2 }, // Less margin on mobile
                                                position: 'relative',
                                                display: 'inline-block',
                                                // Add underline effect
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    bottom: '-6px',
                                                    left: { xs: '10%', md: '0%' },
                                                    width: { xs: '80%', md: '40%' },
                                                    height: '1px',
                                                    background: `linear-gradient(90deg, ${colors.sepia}90, ${colors.sepia}30)`,
                                                    transition: 'width 0.3s ease, opacity 0.3s ease',
                                                    opacity: 0.7,
                                                },
                                                '&:hover::after': {
                                                    width: { xs: '90%', md: '60%' },
                                                    opacity: 1,
                                                }
                                            }}
                                        >
                                            {story.title}
                                        </Typography>

                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: colors.sepia,
                                                mb: { xs: 2, sm: 3 }, // Less margin on mobile
                                                fontFamily: headingFontFamily,
                                                fontStyle: 'italic',
                                                fontSize: { xs: '1rem', sm: '1.2rem' }, // Smaller on mobile
                                                fontWeight: 500,
                                                opacity: 0.85,
                                                // Add subtle sepia glow
                                                textShadow: `0 0 1px ${colors.sepia}20`,
                                            }}
                                        >
                                            {story.subtitle}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: colors.inkLight,
                                                fontSize: { xs: '0.95rem', sm: '1.1rem' }, // Smaller on mobile
                                                fontFamily: fontFamily,
                                                lineHeight: 1.7,
                                                position: 'relative',
                                                px: { xs: 1, sm: 0 }, // Added padding on mobile
                                                // Add quill pen flourish
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    bottom: '-15px',
                                                    right: { xs: '45%', md: index % 2 === 0 ? '75%' : '5%' },
                                                    width: '25px',
                                                    height: '1px',
                                                    background: `linear-gradient(90deg, transparent, ${colors.sepia}60, transparent)`,
                                                    transform: 'rotate(-5deg)',
                                                    opacity: 0.6,
                                                }
                                            }}
                                        >
                                            {story.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </motion.div>
                        ))}
                    </Stack>

                    {/* Add decorative quill mark at the bottom */}
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, width: 0 }}
                        animate={inView ? { opacity: 0.4, width: '50px' } : {}}
                        transition={{ delay: 1.2, duration: 1 }}
                        sx={{
                            position: 'relative',
                            height: '2px',
                            background: `linear-gradient(90deg, transparent, ${colors.sepia}70, ${colors.sepia}40)`,
                            transform: 'rotate(-1deg)',
                            marginTop: 8,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            // Quill stroke decoration
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-3px',
                                right: '5px',
                                width: '8px',
                                height: '1px',
                                background: colors.sepia,
                                transform: 'rotate(15deg)',
                                opacity: 0.7,
                            }
                        }}
                    />
                </motion.div>
            </Container>
        </Box>
    );
};


function LandingPage() {
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
                sx={{
                    flexGrow: 1,
                    overflow: 'visible',
                    background: colors.crumbledParchment,
                    position: 'relative',
                    color: colors.ink,
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingBottom: 0,
                    // Remove the extra padding to bring hero up
                    paddingTop: 0,
                    // Standardize background texture
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundImage: `url(${darkParchmentTexture})`,
                        backgroundSize: 'cover',
                        backgroundAttachment: 'fixed', // Keep fixed if desired
                        opacity: 0.05, // Standardized opacity
                        pointerEvents: 'none',
                        zIndex: 0,
                        mixBlendMode: 'blend', // Standardized blend mode
                    },
                    // Remove heavy outer border or replace with subtle one
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 10, // Example subtle border placement
                        left: 10,
                        right: 10,
                        bottom: 10,
                        border: `30px solid ${colors.mapBorder}20`, // Thin, subtle border
                        borderRadius: '10px',
                        pointerEvents: 'none',
                        zIndex: 0,
                        opacity: 0.05, // Make it faint
                    }
                }}
            >
                {/* Use semantic header for the hero section */}
                <Box component="header">
                    <HeroSection />
                </Box>

                {/* Mark the main content container as main */}
                <Container
                    component="main"
                    ref={ref}
                    maxWidth="lg"
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        pt: { xs: 5, sm: 3, md: 5 }, // Restored original padding
                        pb: { xs: 6, sm: 6, md: 8 },
                        px: { xs: 2, sm: 3, md: 4 },
                        flex: 1,
                        // Add torn parchment edge effect
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '5%',
                            right: '5%',
                            height: '8px',
                            background: `linear-gradient(90deg, transparent 0%, ${colors.mapBorder}20 20%,
                                        transparent 30%, ${colors.mapBorder}20 40%, transparent 50%,
                                        ${colors.mapBorder}20 60%, transparent 70%, ${colors.mapBorder}20 80%,
                                        transparent 100%)`,
                            opacity: 0.5,
                            zIndex: 10,
                        }
                    }}
                >
                    {/* Removed top-level motion.div, handled within components */}
                    <IntroducingBrdgeAI />
                    <ScholarlyDivider />
                    <HowItWorksSection />
                    <StorySection />
                    <ScholarlyDivider />
                    <ImpactSection />
                    {/* Removed ScholarlyDivider before FinalCTA */}
                    <FinalCTA />
                </Container>

                {/* Use semantic footer */}
                <Box
                    component="footer"
                    sx={{
                        marginTop: 'auto', // Pushes footer to bottom
                        width: '100%',
                        position: 'relative', // Needed for z-index stacking if adding effects
                        zIndex: 1, // Ensure footer is above background texture
                    }}
                >
                    <Footer />
                </Box>
            </Box>
        </ParallaxProvider>
    );
}

export default LandingPage;