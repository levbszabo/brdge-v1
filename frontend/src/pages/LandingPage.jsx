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
    Rocket
} from 'lucide-react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { ParallaxProvider, useParallax } from 'react-scroll-parallax';
import { useInView } from 'react-intersection-observer';
import '../fonts.css';
import './LandingPage.css';
import Footer from '../components/Footer';
import AgentConnector from '../components/AgentConnector';

// --- Import Assets ---
import darkParchmentTexture from '../assets/textures/dark-parchment.png';
import stampLogoTexture from '../assets/brdge-stamp-logo.png';
import crumbledParchment from '../assets/textures/crumbled_parchment.jpg';
import oldMapTexture from '../assets/textures/old_map.jpg';
import ivyVertical from '../assets/ivy/ivy_straight_solid.svg';
import ivyHorizontal from '../assets/ivy_horizontal.svg';
import ivyStraight from '../assets/ivy/ivy_straight2_2tone.svg';
import ivyCorner from '../assets/ivy/ivy_corner_solid.svg';
import ivyLeaves from '../assets/ivy/ivy_leaves.svg';
// Use existing texture for parchment background for now
const parchmentTexture = darkParchmentTexture;

// HARDCODED BRIDGE ID FOR DEMO
const DEMO_BRIDGE_ID = '388'; // Demo Bridge ID from https://brdge-ai.com/viewBridge/344-96eac2

// Use these fallbacks until you can create the proper assets

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

            {/* Bottom Left Corner Ivy - Existing */}
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
                    paddingTop: { xs: 7, sm: 6, md: 8 }, // Increased top padding on mobile for more breathing room
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
                                mb: { xs: 2, sm: 2 },
                                mt: { xs: 1, sm: 0 }, // Increased top margin on mobile for more breathing space
                                pt: { xs: 2, sm: 0 }, // Reduced top padding on mobile
                                opacity: 0.9,
                            }}
                        >
                            Built for course creators who want their knowledge to scale — beautifully.
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
                            Teach Smarter with AI
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
                            Upload your lectures or course videos. Brdge AI adds interactive quizzes, discussion prompts, and a<em> personalized AI assistant that answers student questions </em> — in your own voice and teaching style.
                        </Typography>

                        {/* 3. Refined second part of subheading with recommended microcopy */}
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
                            { text: "Scale your teaching without sacrificing the", highlight: "personal touch", icon: <Briefcase size={22} color={colors.sepia} strokeWidth={1.5} /> }
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
                                component={Link}
                                to="/marketplace"
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
                                Explore Courses
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
                            Teach Once, Guide Forever.
                        </Typography>

                        {/* Add Logo Stamp to Divider */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: { xs: '-85px', sm: '-120px' }, // Adjusted for better positioning in divider
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
// IntroducingBrdgeAI - "See Brdge AI In Action" (Merged Section)
//
const IntroducingBrdgeAI = () => {
    const [ref, inView] = useInView({
        threshold: 0.1, // Lower threshold for earlier trigger
        triggerOnce: true
    });

    // Define steps data directly within the component
    const steps = [
        {
            number: "01",
            icon: <Upload size={28} />, // Adjusted size for consistency
            title: "Upload Your Course Content",
            description: "Submit your lectures or slides. Brdge prepares them for engagement."
        },
        {
            number: "02",
            icon: <Sparkles size={28} />,
            title: "Create Your AI Teaching Assistant",
            description: "Define its tone, knowledge, and style to match how you teach."
        },
        {
            number: "03",
            icon: <Mic size={28} />,
            title: "Clone Your Voice",
            description: "Your voice powers every response — no robotic chatbots here."
        },
        {
            number: "04",
            icon: <Share2 size={28} />,
            title: "Share With Students",
            description: "They pause, ask questions, and get instant, personalized answers."
        }
    ];


    return (
        <Container
            maxWidth={false} // Keep full width container
            ref={ref}
            disableGutters
            sx={{
                pt: { xs: 6, sm: 8, md: 10 }, // Adjusted top padding
                pb: { xs: 6, sm: 8, md: 10 }, // Adjusted bottom padding
                px: { xs: 0, sm: 0 }, // Remove horizontal padding for full width elements
                position: 'relative',
                // Apply parchment container styling - keep background/texture consistent
                ...parchmentContainer,
                borderRadius: 0, // No border radius for seamless section flow
                borderTop: `1px solid ${colors.sepia}20`, // Subtle top border
                borderBottom: `1px solid ${colors.sepia}20`, // Subtle bottom border
                // Override default parchmentContainer borders if necessary
                '&::after': { // Remove or adjust the default parchment border
                    display: 'none',
                },
                // Ensure content appears above texture
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
                transition={{ duration: 0.6, ease: "easeOut" }} // Adjust animation timing
            >
                {/* Centered content box */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: '1200px', // Max width for content inside
                        mx: 'auto',
                        px: { xs: 2, sm: 3, md: 4 }, // Add padding inside the content box
                        gap: { xs: 4, sm: 5, md: 6 } // Consistent gap
                    }}
                >
                    {/* Section Header */}
                    <Box sx={{
                        textAlign: 'center',
                        mb: { xs: 3, sm: 4 },
                        width: '100%',
                        maxWidth: '750px', // Max width for header text
                        mx: 'auto',
                    }}>
                        {/* Label */}
                        <Typography
                            component={motion.p}
                            initial={{ opacity: 0, y: -10 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            sx={{
                                fontFamily: headingFontFamily,
                                fontSize: '0.8rem',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: colors.sepia,
                                mb: 2,
                                opacity: 0.9,
                            }}
                        >
                            See Brdge AI in Action
                        </Typography>

                        {/* Headline */}
                        <Typography
                            component={motion.h2}
                            initial={{ opacity: 0, y: 15 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            align="center"
                            sx={{
                                fontFamily: headingFontFamily,
                                fontSize: { xs: '2.4rem', sm: '3.2rem', md: '3.8rem' },
                                fontWeight: 600, // Bold
                                ...inkTextStyle, // Apply ink style
                                mb: 2,
                                letterSpacing: '-0.01em',
                                lineHeight: 1.2,
                                textTransform: 'none',
                            }}
                        >
                            From Course Video to Interactive AI Experience — in Minutes
                        </Typography>

                        {/* Subheadline */}
                        <Typography
                            component={motion.p}
                            initial={{ opacity: 0, y: 15 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            align="center"
                            sx={{
                                fontFamily: fontFamily,
                                fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                fontWeight: 400, // Normal weight
                                lineHeight: 1.7,
                                color: colors.inkLight,
                                maxWidth: '700px', // Specified max-width
                                mx: 'auto',
                                mb: 0, // Remove bottom margin if video follows immediately
                            }}
                        >
                            Brdge turns your lessons into intelligent, voice-driven learning environments — with quizzes, Q&A, and personalized AI engagement, all powered by your content and voice.
                        </Typography>
                    </Box>

                    {/* Brdge AI Demo Container */}
                    <Box
                        className="demo-container"
                        component={motion.div}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.4, duration: 0.7 }}
                        sx={{
                            width: '100%',
                            maxWidth: { xs: '100%', sm: '100%', md: '90%', lg: '1000px' }, // Increased width
                            position: 'relative',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            mx: 'auto',
                            mb: 1.5,
                            border: `1px solid ${colors.sepia}40`,
                            boxShadow: `0 10px 35px rgba(0,0,0,0.15), 0 0 15px rgba(156, 124, 56, 0.1)`,
                            // Hide any default video controls
                            '& ::-webkit-media-controls-panel': {
                                display: 'none !important',
                            },
                            '& ::-webkit-media-controls': {
                                display: 'none !important',
                            },
                            '& ::-webkit-media-controls-enclosure': {
                                display: 'none !important',
                            },
                            '& video::-webkit-media-controls': {
                                display: 'none !important',
                            },
                            // Add other styling
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: `linear-gradient(90deg, transparent, ${colors.sepia}80, transparent)`,
                                zIndex: 10,
                            },
                            '&::after': {
                                content: '"Try it out!"',
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                background: colors.sepia,
                                color: colors.parchmentLight,
                                padding: '5px 12px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                borderRadius: '30px',
                                zIndex: 10,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                opacity: 0.9,
                                pointerEvents: 'none',
                                display: { xs: 'none', sm: 'block' }
                            }
                        }}
                    >
                        <Box sx={{
                            position: 'relative',
                            width: '100%',
                            // Adjust aspect ratio to give more height - aiming for taller on mobile
                            paddingTop: { xs: '150%', sm: '80%', md: '65%' }, // Increased % for xs again
                            minHeight: { xs: '500px', sm: '550px', md: '600px' }, // Keep min heights
                            borderRadius: '10px',
                            overflow: 'hidden',
                            backgroundColor: colors.parchmentLight,
                            '& > div': {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                borderRadius: '10px',
                                padding: { xs: '0', sm: '8px' }
                            },
                            // Remove any black bar at bottom
                            '& iframe': {
                                backgroundColor: 'transparent !important'
                            },
                            // Ensure bottom border is fully hidden
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                height: '5px',
                                background: colors.parchmentLight,
                                zIndex: 5
                            },
                            // Add a subtle pulse animation to encourage interaction
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: '80%',
                                height: '80%',
                                transform: 'translate(-50%, -50%)',
                                background: `radial-gradient(circle, ${colors.sepia}10 0%, transparent 70%)`,
                                borderRadius: '50%',
                                opacity: 0.7,
                                animation: 'pulse 3s infinite',
                                zIndex: 0,
                                pointerEvents: 'none'
                            }
                        }}>
                            <AgentConnector
                                brdgeId={DEMO_BRIDGE_ID}
                                agentType="view"
                                token=""
                            />
                        </Box>
                    </Box>

                    {/* Small Caption Under Demo */}
                    <Typography
                        component={motion.p}
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        sx={{
                            fontFamily: fontFamily,
                            fontSize: '0.9rem',
                            color: colors.inkFaded,
                            textAlign: 'center',
                            mt: 1.5, // Added top margin for spacing
                            mb: { xs: 4, sm: 5 },
                            maxWidth: '600px',
                            mx: 'auto',
                            // Add emphasis for "interactive" 
                            '& strong': {
                                fontWeight: 600,
                                color: colors.sepia
                            }
                        }}
                    >
                        <strong>Interactive demo:</strong> Ask questions and see how AI-powered learning works. Built with Brdge.
                    </Typography>

                    {/* Add keyframe animation for the pulse effect */}
                    <Box
                        component="style"
                        dangerouslySetInnerHTML={{
                            __html: `
                                @keyframes pulse {
                                    0% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.8); }
                                    50% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
                                    100% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.8); }
                                }
                            `
                        }}
                    />

                    {/* How It Works Steps - Responsive Two-Column Layout */}
                    <Box sx={{
                        display: 'grid', // Use Grid for layout
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, // 1 column on xs, 2 columns on md+
                        gap: { xs: 4, sm: 5, md: 6 }, // Adjust gap for grid (row and column)
                        width: '100%',
                        maxWidth: { xs: '700px', md: '900px' }, // Allow more width for two columns
                        mx: 'auto',
                        mb: { xs: 4, sm: 5 }, // Margin below steps
                    }}>
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.title}
                                // Animate based on grid position? Simpler to just fade/slide in.
                                initial={{ opacity: 0, x: -20 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                            >
                                {/* Flexbox for individual step alignment (Badge + Text) */}
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: { xs: 2.5, sm: 3 },
                                    height: '100%', // Ensure grid items take full height for alignment if needed
                                }}>
                                    {/* Number Badge */}
                                    <Box sx={{
                                        width: { xs: 40, sm: 48 },
                                        height: { xs: 40, sm: 48 },
                                        borderRadius: '50%',
                                        backgroundColor: colors.sepia,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        border: `1px solid ${colors.sepiaLight}40`,
                                        boxShadow: `0 2px 4px ${colors.ink}15`,
                                    }}>
                                        <Typography
                                            sx={{
                                                fontFamily: headingFontFamily,
                                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                                fontWeight: 600,
                                                color: colors.parchmentLight,
                                                lineHeight: 1,
                                            }}
                                        >
                                            {step.number}
                                        </Typography>
                                    </Box>

                                    {/* Text Content */}
                                    <Box sx={{ flex: 1, pt: { xs: 0.5, sm: 0.7 } }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontFamily: headingFontFamily,
                                                color: colors.ink,
                                                fontSize: { xs: '1.15rem', sm: '1.3rem' },
                                                fontWeight: 600,
                                                mb: 0.5,
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            {step.title}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: fontFamily,
                                                color: colors.inkLight,
                                                fontSize: { xs: '0.95rem', sm: '1rem' },
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {step.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </motion.div>
                        ))}
                    </Box>

                    {/* Tagline Reprise */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        <Typography
                            component="blockquote"
                            sx={{
                                fontFamily: headingFontFamily, // Serif font
                                fontStyle: 'italic', // Italic
                                fontSize: { xs: '1.2rem', sm: '1.4rem' },
                                color: colors.sepia, // Sepia color
                                lineHeight: 1.6,
                                textAlign: 'center', // Centered
                                maxWidth: '600px',
                                mx: 'auto',
                                mb: { xs: 4, sm: 5 }, // Margin below tagline
                                position: 'relative',
                                '&::before, &::after': { // Optional quotes
                                    content: '"""',
                                    fontFamily: headingFontFamily,
                                    fontWeight: 600,
                                    fontSize: '1.5em',
                                    lineHeight: 0,
                                    verticalAlign: 'baseline',
                                    opacity: 0.5,
                                    color: colors.sepia,
                                },
                                '&::before': { marginRight: '0.2em', verticalAlign: 'sub' },
                                '&::after': { marginLeft: '0.2em' },
                            }}
                        >
                            Teach once. Guide forever.
                        </Typography>
                    </motion.div>

                    {/* CTA Section */}
                    <Box sx={{
                        textAlign: 'center',
                        width: '100%',
                        maxWidth: '400px', // Max width for the button container
                        mx: 'auto',
                        mb: { xs: 2, sm: 0 }, // Reduced margin at the very bottom of the section
                    }}>
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.9, duration: 0.6 }}
                        >
                            <Button
                                component={Link}
                                to="/signup"
                                variant="contained"
                                size="large"
                                sx={{
                                    ...createButtonStyles('primary', false), // Use primary style, non-responsive width
                                    width: '100%', // Make button full width within its container
                                    py: { xs: 1.75, sm: 2 },
                                    fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                    // Add rocket icon
                                    '& .MuiButton-endIcon': { marginLeft: '12px' }
                                }}
                                endIcon={<Rocket size={20} />}
                            >
                                Create Your First AI Course
                            </Button>
                        </motion.div>
                    </Box>

                </Box> {/* End Centered Content Box */}
            </motion.div>
        </Container>
    );
};

//
// HeroSection - Neo-Scholar meets Futuristic AI
//


//
// HowItWorksSection - Apply Neo-Scholar aesthetic
//
// REMOVE THIS ENTIRE COMPONENT DEFINITION
// const HowItWorksSection = () => { ... };


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
                        component={Link}
                        to="/marketplace"
                        sx={{
                            ...createButtonStyles('secondary', false),
                            position: 'relative',
                            borderRadius: '8px', // Consistent rounding
                            minHeight: '60px',
                            fontSize: '1.15rem',
                            // Button styling handled by updated createButtonStyles
                        }}
                    >
                        Explore Marketplace
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

//
// MissionSection - Our philosophy and core values
//
const MissionSection = () => {
    const [ref, inView] = useInView({
        threshold: 0.15,
        triggerOnce: true
    });

    // Animated quill writing effect for decorative elements
    const quillAnimation = {
        initial: { width: 0, opacity: 0 },
        animate: { width: '100%', opacity: 0.8, transition: { duration: 1.5, ease: "easeOut" } }
    };

    // Animated reveal for pillars
    const pillarAnimation = {
        initial: { opacity: 0, y: 20 },
        animate: (custom) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                delay: 0.3 + custom * 0.15,
                ease: "easeOut"
            }
        })
    };

    // Animated glow effect for logo
    const glowPulse = {
        initial: { boxShadow: `0 0 0px ${colors.sepia}00` },
        animate: {
            boxShadow: [
                `0 0 5px ${colors.sepia}30`,
                `0 0 15px ${colors.sepia}40`,
                `0 0 5px ${colors.sepia}30`
            ],
            transition: {
                duration: 3.5,
                repeat: Infinity,
                repeatType: "mirror"
            }
        }
    };

    // Simplified elegant fade in for headline - removed blue block animation
    const headlineAnimation = {
        initial: { opacity: 0, y: 15 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.3, duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <Box
            component="section"
            sx={{
                position: 'relative',
                py: { xs: 7, sm: 9, md: 11 },
                background: `linear-gradient(135deg, ${colors.parchmentLight} 0%, ${colors.parchment} 100%)`,
                borderTop: `1px solid ${colors.sepia}20`,
                borderBottom: `1px solid ${colors.sepia}20`,
                overflowX: 'hidden',
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
                // Add decorative top/bottom borders
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '10%',
                    right: '10%',
                    height: '6px',
                    backgroundImage: `url(${crumbledParchment})`,
                    backgroundSize: 'cover',
                    mask: `linear-gradient(90deg, transparent, black 30%, black 70%, transparent)`,
                    opacity: 0.15,
                    zIndex: 0,
                }
            }}
        >
            <Box
                component="img"
                src={ivyCorner}
                alt=""
                sx={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    width: { xs: '60px', sm: '80px', md: '100px' },
                    height: 'auto',
                    objectFit: 'contain',
                    opacity: 0.2,
                    zIndex: 1,
                    filter: 'hue-rotate(40deg) saturate(0.9)',
                    transform: 'scaleX(-1)',
                }}
            />

            <Container
                maxWidth="lg"
                ref={ref}
                sx={{
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                <Box
                    sx={{
                        textAlign: 'center',
                        mb: { xs: 5, sm: 6, md: 7 },
                        position: 'relative',
                    }}
                >
                    {/* Section Label - Small caps sepia */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Typography
                            sx={{
                                fontFamily: fontFamily,
                                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                color: colors.sepia,
                                mb: 1.5,
                                opacity: 0.9,
                                position: 'relative',
                                display: 'inline-block',
                                // Add subtle quill mark above
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '-18px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '30px',
                                    height: '2px',
                                    background: `linear-gradient(90deg, transparent, ${colors.sepia}80, transparent)`,
                                    borderRadius: '2px',
                                }
                            }}
                        >
                            Our Mission
                        </Typography>
                    </motion.div>

                    {/* Main Headline - with elegant animation */}
                    <motion.div
                        initial="initial"
                        animate={inView ? "animate" : "initial"}
                        variants={headlineAnimation}
                        style={{ position: 'relative', display: 'inline-block' }}
                    >
                        <Typography
                            component="h2"
                            sx={{
                                fontFamily: headingFontFamily,
                                fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem' },
                                fontWeight: 600,
                                color: colors.ink,
                                mb: 3,
                                maxWidth: '850px',
                                mx: 'auto',
                                lineHeight: 1.2,
                                // Add subtle ink effect
                                WebkitTextFillColor: 'transparent',
                                WebkitBackgroundClip: 'text',
                                backgroundImage: `linear-gradient(to bottom, ${colors.ink} 95%, ${colors.sepia}90 100%)`,
                                // Add subtle decorative element below
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-15px',
                                    left: '25%',
                                    right: '25%',
                                    height: '1px',
                                    background: `linear-gradient(90deg, transparent, ${colors.sepia}70, transparent)`,
                                    opacity: 0.8,
                                }
                            }}
                        >
                            Built for the Voices That Last
                        </Typography>
                    </motion.div>

                    {/* Subheadline - with subtle animation */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.5, duration: 0.7 }}
                    >
                        <Typography
                            sx={{
                                fontFamily: fontFamily,
                                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                lineHeight: 1.7,
                                color: colors.inkLight,
                                mb: 6,
                                maxWidth: '700px',
                                mx: 'auto',
                                px: { xs: 2, sm: 0 },
                                position: 'relative',
                                // Add decorative quill line below
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-20px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '60px',
                                    height: '2px',
                                    background: `linear-gradient(90deg, transparent, ${colors.sepia}80, transparent)`,
                                    borderRadius: '2px',
                                }
                            }}
                        >
                            Great teaching should last — beyond the moment, beyond the inbox, beyond the burnout.
                            Brdge AI preserves your presence, your voice, and your impact so your best lessons keep teaching even when you're not there.
                        </Typography>
                    </motion.div>
                </Box>

                {/* Logo and Pillars Container - Responsive layout */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        gap: { xs: 5, md: 6 },
                        position: 'relative',
                    }}
                >
                    {/* Logo Container with animated glow */}
                    <Box
                        component={motion.div}
                        initial="initial"
                        animate={inView ? "animate" : "initial"}
                        variants={glowPulse}
                        sx={{
                            width: { xs: '100%', md: '45%' },
                            maxWidth: { xs: '350px', md: '500px' },
                            position: 'relative',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            padding: '12px',
                            background: `linear-gradient(135deg, ${colors.parchmentLight}90, ${colors.parchment}70)`,
                            border: `1px solid ${colors.sepia}30`,
                            // Add floating animation
                            animation: 'float 6s ease-in-out infinite',
                            // Logo will glow on hover
                            '&:hover': {
                                '&::before': {
                                    opacity: 0.7,
                                }
                            },
                            // Inner glow effect
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '8px',
                                padding: '2px',
                                background: `linear-gradient(135deg, ${colors.sepia}40, ${colors.sepia}20)`,
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude',
                                opacity: 0.4,
                                transition: 'opacity 0.5s ease'
                            },
                            // Elegant corner accents
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                inset: '5px',
                                borderRadius: '4px',
                                border: `1px solid ${colors.sepia}20`,
                                pointerEvents: 'none',
                            }
                        }}
                    >
                        {/* Logo image */}
                        <Box
                            component="img"
                            src="/brdge-ai-core.png"
                            alt="Brdge AI - Teaching that lasts"
                            sx={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: '4px',
                                transition: 'transform 0.5s ease',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                }
                            }}
                        />

                        {/* Create floating animation keyframes */}
                        <Box
                            component="style"
                            dangerouslySetInnerHTML={{
                                __html: `
                            @keyframes float {
                                0% { transform: translateY(0px); }
                                50% { transform: translateY(-8px); }
                                100% { transform: translateY(0px); }
                            }
                        `
                            }}
                        />
                    </Box>

                    {/* Three Pillars Container */}
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: { xs: 4, sm: 5 },
                            width: '100%',
                            position: 'relative',
                            // Add decorative vertical line
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '5%',
                                bottom: '5%',
                                left: { xs: '50%', md: 0 },
                                width: '1px',
                                transform: { xs: 'translateX(-50%)', md: 'none' },
                                background: `linear-gradient(to bottom, transparent, ${colors.sepia}40, transparent)`,
                                display: { xs: 'none', md: 'block' },
                            }
                        }}
                    >
                        {/* First Pillar - Clarity */}
                        <Box
                            component={motion.div}
                            custom={0}
                            initial="initial"
                            animate={inView ? "animate" : "initial"}
                            variants={pillarAnimation}
                            whileHover={{ x: 10, transition: { duration: 0.2 } }}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 3,
                                padding: { xs: 2, md: 3 },
                                borderRadius: '8px',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                // Subtle background on hover
                                '&:hover': {
                                    background: `linear-gradient(90deg, ${colors.parchmentDark}70, transparent)`,
                                    '& .pillar-icon': {
                                        transform: 'translateY(-3px)',
                                        boxShadow: `0 6px 15px ${colors.sepia}30`,
                                    },
                                    '& .pillar-line': {
                                        width: '100%',
                                        opacity: 0.7,
                                    }
                                }
                            }}
                        >
                            {/* Icon with enhanced styling */}
                            <Box
                                className="pillar-icon"
                                sx={{
                                    width: { xs: '50px', sm: '55px' },
                                    height: { xs: '50px', sm: '55px' },
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: `linear-gradient(135deg, ${colors.ink}, ${colors.ink}90)`,
                                    color: colors.parchmentLight,
                                    boxShadow: `0 4px 10px ${colors.ink}30`,
                                    transition: 'all 0.3s ease',
                                    // Add subtle border
                                    border: `1px solid ${colors.ink}30`,
                                    // Add inner ring
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        inset: '5px',
                                        borderRadius: '50%',
                                        border: `1px dashed ${colors.parchmentLight}50`,
                                        opacity: 0.6,
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        fontSize: '1.8rem',
                                        lineHeight: 1,
                                    }}
                                >
                                    🧠
                                </Box>
                            </Box>

                            {/* Text Content */}
                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontFamily: headingFontFamily,
                                        color: colors.ink,
                                        fontSize: { xs: '1.3rem', sm: '1.5rem' },
                                        fontWeight: 600,
                                        mb: 1.5,
                                        position: 'relative',
                                    }}
                                >
                                    Clarity
                                    {/* Animated underline */}
                                    <Box
                                        className="pillar-line"
                                        component={motion.div}
                                        initial={{ width: '30%', opacity: 0.4 }}
                                        sx={{
                                            position: 'absolute',
                                            bottom: '-6px',
                                            left: 0,
                                            height: '2px',
                                            background: `linear-gradient(90deg, ${colors.sepia}90, ${colors.sepia}30)`,
                                            transition: 'all 0.4s ease',
                                        }}
                                    />
                                </Typography>

                                <Typography
                                    sx={{
                                        fontFamily: fontFamily,
                                        color: colors.inkLight,
                                        fontSize: '1.05rem',
                                        lineHeight: 1.6,
                                    }}
                                >
                                    Every great teacher has clarity of thought. Brdge gives them clarity of delivery.
                                </Typography>
                            </Box>
                        </Box>

                        {/* Second Pillar - Preservation */}
                        <Box
                            component={motion.div}
                            custom={1}
                            initial="initial"
                            animate={inView ? "animate" : "initial"}
                            variants={pillarAnimation}
                            whileHover={{ x: 10, transition: { duration: 0.2 } }}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 3,
                                padding: { xs: 2, md: 3 },
                                borderRadius: '8px',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                // Subtle background on hover
                                '&:hover': {
                                    background: `linear-gradient(90deg, ${colors.parchmentDark}70, transparent)`,
                                    '& .pillar-icon': {
                                        transform: 'translateY(-3px)',
                                        boxShadow: `0 6px 15px ${colors.sepia}30`,
                                    },
                                    '& .pillar-line': {
                                        width: '100%',
                                        opacity: 0.7,
                                    }
                                }
                            }}
                        >
                            {/* Icon with enhanced styling */}
                            <Box
                                className="pillar-icon"
                                sx={{
                                    width: { xs: '50px', sm: '55px' },
                                    height: { xs: '50px', sm: '55px' },
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: `linear-gradient(135deg, ${colors.ink}, ${colors.ink}90)`,
                                    color: colors.parchmentLight,
                                    boxShadow: `0 4px 10px ${colors.ink}30`,
                                    transition: 'all 0.3s ease',
                                    // Add subtle border
                                    border: `1px solid ${colors.ink}30`,
                                    // Add inner ring
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        inset: '5px',
                                        borderRadius: '50%',
                                        border: `1px dashed ${colors.parchmentLight}50`,
                                        opacity: 0.6,
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        fontSize: '1.8rem',
                                        lineHeight: 1,
                                    }}
                                >
                                    🕊️
                                </Box>
                            </Box>

                            {/* Text Content */}
                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontFamily: headingFontFamily,
                                        color: colors.ink,
                                        fontSize: { xs: '1.3rem', sm: '1.5rem' },
                                        fontWeight: 600,
                                        mb: 1.5,
                                        position: 'relative',
                                    }}
                                >
                                    Preservation
                                    {/* Animated underline */}
                                    <Box
                                        className="pillar-line"
                                        component={motion.div}
                                        initial={{ width: '30%', opacity: 0.4 }}
                                        sx={{
                                            position: 'absolute',
                                            bottom: '-6px',
                                            left: 0,
                                            height: '2px',
                                            background: `linear-gradient(90deg, ${colors.sepia}90, ${colors.sepia}30)`,
                                            transition: 'all 0.4s ease',
                                        }}
                                    />
                                </Typography>

                                <Typography
                                    sx={{
                                        fontFamily: fontFamily,
                                        color: colors.inkLight,
                                        fontSize: '1.05rem',
                                        lineHeight: 1.6,
                                    }}
                                >
                                    You taught it once. It mattered. That version of your voice shouldn't disappear.
                                </Typography>
                            </Box>
                        </Box>

                        {/* Third Pillar - Balance */}
                        <Box
                            component={motion.div}
                            custom={2}
                            initial="initial"
                            animate={inView ? "animate" : "initial"}
                            variants={pillarAnimation}
                            whileHover={{ x: 10, transition: { duration: 0.2 } }}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 3,
                                padding: { xs: 2, md: 3 },
                                borderRadius: '8px',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                // Subtle background on hover
                                '&:hover': {
                                    background: `linear-gradient(90deg, ${colors.parchmentDark}70, transparent)`,
                                    '& .pillar-icon': {
                                        transform: 'translateY(-3px)',
                                        boxShadow: `0 6px 15px ${colors.sepia}30`,
                                    },
                                    '& .pillar-line': {
                                        width: '100%',
                                        opacity: 0.7,
                                    }
                                }
                            }}
                        >
                            {/* Icon with enhanced styling */}
                            <Box
                                className="pillar-icon"
                                sx={{
                                    width: { xs: '50px', sm: '55px' },
                                    height: { xs: '50px', sm: '55px' },
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: `linear-gradient(135deg, ${colors.ink}, ${colors.ink}90)`,
                                    color: colors.parchmentLight,
                                    boxShadow: `0 4px 10px ${colors.ink}30`,
                                    transition: 'all 0.3s ease',
                                    // Add subtle border
                                    border: `1px solid ${colors.ink}30`,
                                    // Add inner ring
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        inset: '5px',
                                        borderRadius: '50%',
                                        border: `1px dashed ${colors.parchmentLight}50`,
                                        opacity: 0.6,
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        fontSize: '1.8rem',
                                        lineHeight: 1,
                                    }}
                                >
                                    ⚖️
                                </Box>
                            </Box>

                            {/* Text Content */}
                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontFamily: headingFontFamily,
                                        color: colors.ink,
                                        fontSize: { xs: '1.3rem', sm: '1.5rem' },
                                        fontWeight: 600,
                                        mb: 1.5,
                                        position: 'relative',
                                    }}
                                >
                                    Balance
                                    {/* Animated underline */}
                                    <Box
                                        className="pillar-line"
                                        component={motion.div}
                                        initial={{ width: '30%', opacity: 0.4 }}
                                        sx={{
                                            position: 'absolute',
                                            bottom: '-6px',
                                            left: 0,
                                            height: '2px',
                                            background: `linear-gradient(90deg, ${colors.sepia}90, ${colors.sepia}30)`,
                                            transition: 'all 0.4s ease',
                                        }}
                                    />
                                </Typography>

                                <Typography
                                    sx={{
                                        fontFamily: fontFamily,
                                        color: colors.inkLight,
                                        fontSize: '1.05rem',
                                        lineHeight: 1.6,
                                    }}
                                >
                                    Brdge lets you grow your reach without losing your presence — or your peace of mind.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Final tagline with animated quill stroke */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.4, duration: 0.8 }}
                    sx={{
                        textAlign: 'center',
                        mt: { xs: 6, sm: 8 },
                        position: 'relative',
                        // Add animated quill stroke path below
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-15px',
                            left: '50%',
                            width: '80px',
                            height: '2px',
                            background: `linear-gradient(90deg, transparent, ${colors.sepia}, transparent)`,
                            transform: 'translateX(-50%) rotate(-1deg)',
                            opacity: 0.6,
                        }
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: headingFontFamily,
                            fontStyle: 'italic',
                            fontSize: { xs: '1.1rem', sm: '1.25rem' },
                            color: colors.sepia,
                            lineHeight: 1.5,
                            maxWidth: '700px',
                            mx: 'auto',
                            opacity: 0.85,
                        }}
                    >
                        Every course is a chance to leave something behind — something that speaks, teaches, and lasts.
                    </Typography>
                </Box>
            </Container>

            {/* Animated quill stroke at the bottom */}
            <Box
                component={motion.div}
                initial="initial"
                animate={inView ? "animate" : "initial"}
                variants={quillAnimation}
                sx={{
                    position: 'absolute',
                    bottom: '30px',
                    right: '15%',
                    height: '2px',
                    maxWidth: '120px',
                    background: `linear-gradient(90deg, transparent, ${colors.sepia}60, ${colors.sepia}30)`,
                    transform: 'rotate(2deg)',
                    // Quill flourish at the end
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        right: 0,
                        bottom: '-2px',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50% 50% 0 50%',
                        background: colors.sepia,
                        opacity: 0.5,
                    }
                }}
            />
        </Box>
    );
};

//
// ShiftSection - Modern learning paradigm shift
//
const ShiftSection = () => {
    const [ref, inView] = useInView({
        threshold: 0.15,
        triggerOnce: true
    });

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: (custom) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.2 + (custom * 0.1),
                duration: 0.6,
                ease: "easeOut"
            }
        })
    };

    // Comparison table data
    const comparisonItems = [
        { traditional: "Static videos", brdge: "Interactive, voice-led guidance" },
        { traditional: "One-size-fits-all lessons", brdge: "Personalized learning moments" },
        { traditional: "Support via email or Slack", brdge: "Instant answers in your voice" },
        { traditional: "High dropout, low engagement", brdge: "Higher completion + retention" },
        { traditional: "You do everything", brdge: "Brdge handles 80% of questions" }
    ];

    return (
        <Box
            component="section"
            sx={{
                position: 'relative',
                py: { xs: 7, sm: 9, md: 11 },
                background: `linear-gradient(135deg, ${colors.parchmentDark} 0%, ${colors.parchment} 100%)`,
                borderTop: `1px solid ${colors.sepia}20`,
                borderBottom: `1px solid ${colors.sepia}20`,
                overflow: 'hidden',
                // Add subtle texture overlay
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${darkParchmentTexture})`,
                    backgroundSize: 'cover',
                    opacity: 0.1,
                    mixBlendMode: 'multiply',
                    zIndex: 0,
                }
            }}
        >
            {/* Background decorative elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '20%',
                    height: '40%',
                    opacity: 0.05,
                    background: `url(${ivyStraight})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top right',
                    transform: 'scaleX(-1) rotate(20deg)',
                    zIndex: 0,
                    pointerEvents: 'none',
                }}
            />

            <Container
                maxWidth="lg"
                ref={ref}
                sx={{
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                {/* Section Header */}
                <Box
                    sx={{
                        textAlign: 'center',
                        mb: { xs: 5, sm: 6, md: 7 },
                        position: 'relative',
                        maxWidth: '900px',
                        mx: 'auto',
                    }}
                >
                    {/* Section Label */}
                    <motion.div
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        variants={fadeIn}
                        custom={0}
                    >
                        <Typography
                            sx={{
                                fontFamily: fontFamily,
                                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: colors.sepia,
                                mb: 1.5,
                                opacity: 0.9,
                                fontWeight: 600,
                            }}
                        >
                            The Shift Is Happening
                        </Typography>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.div
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        variants={fadeIn}
                        custom={1}
                    >
                        <Typography
                            component="h2"
                            sx={{
                                fontFamily: headingFontFamily,
                                fontSize: { xs: '2.2rem', sm: '3rem', md: '3.5rem' },
                                fontWeight: 600,
                                color: colors.ink,
                                mb: 3,
                                lineHeight: 1.2,
                                // Add subtle ink effect
                                WebkitTextFillColor: 'transparent',
                                WebkitBackgroundClip: 'text',
                                backgroundImage: `linear-gradient(to bottom, ${colors.ink} 95%, ${colors.sepia}90 100%)`,
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-15px',
                                    left: '25%',
                                    right: '25%',
                                    height: '1px',
                                    background: `linear-gradient(90deg, transparent, ${colors.sepia}70, transparent)`,
                                    opacity: 0.8,
                                }
                            }}
                        >
                            Students Are Learning Differently Now
                        </Typography>
                    </motion.div>

                    {/* Two-column layout with text and image */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: { xs: 4, md: 6 },
                            width: '100%',
                            maxWidth: '1050px',
                            mx: 'auto',
                            mb: { xs: 6, sm: 8 },
                            mt: { xs: 2, sm: 3 },
                            px: { xs: 2, md: 0 },
                            alignItems: { md: 'center' }, // Center align items on desktop
                        }}
                    >
                        {/* Text Column - Left */}
                        <Box
                            component={motion.div}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            variants={fadeIn}
                            custom={2}
                            sx={{
                                flex: { md: '1.25' }, // Make text column wider (25% more)
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: { xs: 'center', md: 'flex-start' }, // Left align on desktop
                                pr: { md: 3 }, // Add padding on the right for desktop
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: fontFamily,
                                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                    lineHeight: 1.65, // Increased line-height
                                    color: colors.inkLight,
                                    position: 'relative',
                                    mb: { xs: 2, md: 0 },
                                    textAlign: { xs: 'center', md: 'left' }, // Left align text on desktop
                                    maxWidth: '550px', // Control maximum width
                                    // Add decorative side element for desktop
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        left: -20,
                                        top: '10%',
                                        bottom: '10%',
                                        width: '3px',
                                        background: `linear-gradient(to bottom, transparent, ${colors.sepia}40, transparent)`,
                                        display: { xs: 'none', md: 'block' },
                                    },
                                    // Enhance styling for each sentence
                                    '& .sentence': {
                                        display: 'block',
                                        mb: 1.2, // Add space between sentences
                                    },
                                    // Add subtle emphasis to key phrases
                                    '& .emphasis': {
                                        color: colors.ink,
                                        fontWeight: 500,
                                    }
                                }}
                            >
                                <span className="sentence">They pause. They question. They search at midnight.</span>
                                <span className="sentence">They expect answers that are <span className="emphasis">instant, personal, and real</span>.</span>

                                <span className="sentence" style={{ marginTop: '1.2rem' }}>
                                    Brdge meets them where they are — and helps you stay
                                    <span className="emphasis"> present</span>,
                                    even when you're not online.
                                </span>
                            </Typography>
                        </Box>

                        {/* Image Column - Right */}
                        <Box
                            component={motion.div}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            variants={fadeIn}
                            custom={3}
                            sx={{
                                flex: { md: '1' }, // Standard flex for image
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: { xs: 'center', md: 'flex-end' }, // Right align on desktop
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: `0 10px 30px rgba(0,0,0,0.12)`,
                                    border: `1px solid ${colors.sepia}30`,
                                    // Use auto height to preserve aspect ratio
                                    '& img': {
                                        filter: 'sepia(0.2)',
                                        transition: 'all 0.5s ease',
                                        '&:hover': {
                                            filter: 'sepia(0.1)',
                                        }
                                    }
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/self-taught.webp"
                                    alt="Student reading on rooftop - self-guided learning"
                                    sx={{
                                        width: '100%',
                                        height: 'auto', // Auto height to maintain aspect ratio
                                        display: 'block',
                                    }}
                                />
                            </Box>

                            {/* Caption below image */}
                            <Typography
                                component={motion.p}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                sx={{
                                    fontFamily: headingFontFamily,
                                    fontStyle: 'italic',
                                    fontSize: { xs: '0.95rem', sm: '1.1rem' },
                                    color: colors.sepia,
                                    textAlign: 'center',
                                    width: '100%', // Full width for caption
                                    mt: 2,
                                    mb: 1,
                                    opacity: 0.9,
                                    position: 'relative',
                                    // Add decorative element
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: '-12px',
                                        left: '15%',
                                        right: '15%',
                                        height: '1px',
                                        background: `linear-gradient(90deg, transparent, ${colors.sepia}50, transparent)`,
                                    }
                                }}
                            >
                                "This isn't school as it was. It's learning as it should be."
                            </Typography>
                        </Box>
                    </Box>

                    {/* Comparison Table */}
                    <motion.div
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        variants={fadeIn}
                        custom={4}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: '900px',
                                mx: 'auto',
                                mb: { xs: 6, sm: 7 },
                                overflow: 'hidden',
                                border: `1px solid ${colors.sepia}30`,
                                borderRadius: '8px',
                                background: `rgba(255, 255, 255, 0.5)`,
                                boxShadow: `0 6px 20px rgba(0,0,0,0.08)`,
                            }}
                        >
                            {/* Table Header - Show only on desktop */}
                            <Box
                                sx={{
                                    display: { xs: 'none', sm: 'grid' }, // Hide on mobile
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    borderBottom: `1px solid ${colors.sepia}30`,
                                    background: colors.parchmentDark,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: headingFontFamily,
                                        fontSize: '1.2rem',
                                        fontWeight: 600,
                                        color: colors.ink,
                                        p: 2.5,
                                        textAlign: 'center',
                                        borderRight: `1px solid ${colors.sepia}30`,
                                    }}
                                >
                                    Traditional Online Courses
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: headingFontFamily,
                                        fontSize: '1.2rem',
                                        fontWeight: 600,
                                        color: colors.ink,
                                        p: 2.5,
                                        textAlign: 'center',
                                        position: 'relative',
                                        // Add subtle accent
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: 0,
                                            left: '30%',
                                            width: '40%',
                                            height: '2px',
                                            background: colors.sepia,
                                        }
                                    }}
                                >
                                    Brdge-Powered Learning
                                </Typography>
                            </Box>

                            {/* Mobile header - only visible on mobile */}
                            <Box
                                sx={{
                                    display: { xs: 'block', sm: 'none' },
                                    background: colors.parchmentDark,
                                    borderBottom: `1px solid ${colors.sepia}30`,
                                    p: 2.5,
                                    textAlign: 'center',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: headingFontFamily,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        color: colors.ink,
                                        mb: 0.5,
                                    }}
                                >
                                    How Brdge Transforms Learning
                                </Typography>
                            </Box>

                            {/* Table Rows - Desktop View */}
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                {comparisonItems.map((item, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(2, 1fr)',
                                            borderBottom: index < comparisonItems.length - 1 ? `1px solid ${colors.sepia}15` : 'none',
                                            '&:hover': {
                                                background: `rgba(255, 255, 255, 0.7)`,
                                            }
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontFamily: fontFamily,
                                                fontSize: '1rem',
                                                color: colors.inkLight,
                                                p: 2.5,
                                                textAlign: 'center',
                                                borderRight: `1px solid ${colors.sepia}15`,
                                            }}
                                        >
                                            {item.traditional}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: fontFamily,
                                                fontSize: '1rem',
                                                fontWeight: 500,
                                                color: colors.ink,
                                                p: 2.5,
                                                textAlign: 'center',
                                            }}
                                        >
                                            {item.brdge}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>

                            {/* Mobile Comparison Cards - Stack each comparison as a card */}
                            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                                {comparisonItems.map((item, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            position: 'relative',
                                            borderBottom: index < comparisonItems.length - 1 ? `1px solid ${colors.sepia}15` : 'none',
                                            py: 3,
                                            px: 3,
                                            '&:hover': {
                                                background: `rgba(255, 255, 255, 0.6)`,
                                            }
                                        }}
                                    >
                                        {/* Label: Traditional vs Brdge */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '0.7rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                mb: 1.5,
                                                opacity: 0.7,
                                                fontWeight: 600,
                                            }}
                                        >
                                            <Box sx={{ color: colors.inkFaded }}>Traditional</Box>
                                            <Box sx={{ color: colors.sepia }}>Brdge</Box>
                                        </Box>

                                        {/* Content container */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 2
                                            }}
                                        >
                                            {/* Traditional vs Brdge comparison */}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                }}
                                            >
                                                {/* Traditional side */}
                                                <Box
                                                    sx={{
                                                        flex: 1,
                                                        pr: 2,
                                                        py: 1.5,
                                                        borderRight: `1px dashed ${colors.sepia}30`,
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontFamily: fontFamily,
                                                            fontSize: '0.95rem',
                                                            color: colors.inkLight,
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        {item.traditional}
                                                    </Typography>
                                                </Box>

                                                {/* Brdge side */}
                                                <Box
                                                    sx={{
                                                        flex: 1,
                                                        pl: 2,
                                                        py: 1.5,
                                                        position: 'relative',
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontFamily: fontFamily,
                                                            fontSize: '0.95rem',
                                                            fontWeight: 500,
                                                            color: colors.ink,
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        {item.brdge}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </motion.div>

                    {/* Closing Statement */}
                    <motion.div
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        variants={fadeIn}
                        custom={5}
                    >
                        <Typography
                            component="blockquote"
                            sx={{
                                fontFamily: headingFontFamily,
                                fontStyle: 'italic',
                                fontSize: { xs: '1.2rem', sm: '1.4rem' },
                                color: colors.sepia,
                                textAlign: 'center',
                                maxWidth: '600px',
                                mx: 'auto',
                                mb: { xs: 6, sm: 7 }, // Increased margin for better spacing
                                lineHeight: 1.6,
                                '&::before, &::after': {
                                    content: '"""',
                                    fontFamily: headingFontFamily,
                                    fontWeight: 600,
                                    fontSize: '1.5em',
                                    lineHeight: 0,
                                    verticalAlign: 'baseline',
                                    opacity: 0.5,
                                },
                                '&::before': { marginRight: '0.2em', verticalAlign: 'sub' },
                                '&::after': { marginLeft: '0.2em' },
                            }}
                        >
                            You're not just building a course.
                            <br />
                            You're building what comes next.
                        </Typography>
                    </motion.div>

                    {/* CTA Buttons - Improved spacing and hierarchy */}
                    <motion.div
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        variants={fadeIn}
                        custom={6}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 3.5, // Increased gap between elements
                                width: '100%',
                                maxWidth: '400px',
                                mx: 'auto',
                                pt: { xs: 2, sm: 3 }, // Added top padding as requested
                            }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                style={{ width: '100%' }}
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
                                        minHeight: '56px',
                                        fontSize: '1.1rem',
                                        mb: 1.5, // Added bottom margin
                                    }}
                                    endIcon={<ArrowForward />}
                                >
                                    Create Your First Brdge
                                </Button>
                            </motion.div>

                            <Box
                                component={Link}
                                to="/contact"
                                sx={{
                                    fontFamily: fontFamily,
                                    fontSize: '0.9rem', // Made slightly smaller
                                    color: colors.inkLight,
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    transition: 'all 0.2s ease',
                                    marginTop: 1, // Added more top spacing
                                    borderBottom: '1px solid transparent', // Prepare for hover effect
                                    paddingBottom: '2px',
                                    '&:hover': {
                                        color: colors.sepia,
                                        borderBottom: `1px solid ${colors.sepia}60`, // Added underline on hover
                                    }
                                }}
                            >
                                Prefer a done-for-you setup? <span style={{ marginLeft: '4px' }}>Talk to our team</span>
                                <ArrowForward sx={{ fontSize: '0.8rem', ml: 0.5 }} />
                            </Box>
                        </Box>
                    </motion.div>
                </Box>
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
        // Remove preloading of video
        // Smooth scroll behavior
        document.documentElement.style.scrollBehavior = 'smooth';

        return () => {
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
                    maxWidth={false} // Changed to false for full-width sections
                    disableGutters // Remove gutters for full-width sections
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        pt: 0, // Remove top padding for seamless section flow
                        pb: { xs: 6, sm: 6, md: 8 }, // Keep bottom padding for footer spacing
                        px: 0, // Remove horizontal padding
                        flex: 1,
                        // Remove the torn parchment edge effect if sections are full-width
                        // '&::before': { ... }
                    }}
                >
                    {/* Merged Section */}
                    <IntroducingBrdgeAI />
                    <MissionSection />
                    <ScholarlyDivider />
                    <ShiftSection />
                    <ScholarlyDivider />
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