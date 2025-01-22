// src/pages/LandingPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Stack,
    Card,
    CardContent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useTheme,
    Paper,
    Collapse,
    Icon
} from '@mui/material';
import {
    ArrowForward,
    ArrowDownward,
    Link as LinkIcon,
    BusinessCenter,
    Add,
    AccessTime,
    AllInclusive,
    HomeRepairService,
    AutoFixHigh,
    VerifiedUser,
    Explore,
} from '@mui/icons-material';
import {
    Upload,
    Sparkles,
    Mic,
    Share2,
} from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import { useInView } from 'react-intersection-observer';
import demoVideo from '../assets/brdge-demo2.mp4';
import logo from '../assets/new-img.png';
import '../fonts.css';
import './LandingPage.css';
import SchoolIcon from '@mui/icons-material/School';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Footer from '../components/Footer';

const fontFamily = 'Satoshi, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

// The user requested no errors, clear messaging, strong visuals, and good mobile rendering.
// HeroSection and "Redefining Knowledge Sharing" (IntroducingBrdgeAI) components are good as is,
// so we will keep them mostly intact, just ensuring no breakage.
// The rest of the page (HowItWorksSection, ImpactSection, FinalCTA) will be refined for stronger messaging,
// better mobile responsiveness, and clearer visuals.

// IntroducingBrdgeAI (the "Redefining Knowledge Sharing" component) - we keep as user said they work well
const IntroducingBrdgeAI = () => {
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    return (
        <Box
            sx={{
                pt: { xs: 4, md: 6 },
                pb: { xs: 4, sm: 6, md: 8 },
                position: 'relative',
                backgroundColor: 'rgba(0, 65, 194, 0.08)', // Lighter blue background
                borderRadius: '24px',
                border: '1px solid rgba(0, 180, 219, 0.12)',
                boxShadow: `
                    inset 0 0 100px rgba(0, 180, 219, 0.05),
                    0 4px 20px rgba(0, 0, 0, 0.1)
                `,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, rgba(0, 65, 194, 0.03) 0%, rgba(0, 180, 219, 0.03) 100%)',
                    borderRadius: '24px',
                    pointerEvents: 'none'
                }
            }}
        >
            <Container
                maxWidth="lg"
                ref={ref}
                sx={{
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    {/* HEADLINE */}
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                            fontWeight: 700,
                            color: 'white',
                            mb: { xs: 3, sm: 4 },
                            letterSpacing: '-0.02em',
                            textShadow: '0 0 20px rgba(255,255,255,0.2)',
                            textTransform: 'none',
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
                        Make Your Content <span className="highlight">Speak</span>
                    </Typography>

                    {/* TOP TEXT SECTION */}
                    <Box sx={{
                        maxWidth: '800px',
                        mx: 'auto',
                        mb: { xs: 6, sm: 8 },
                    }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    color: 'rgba(255,255,255,0.95)',
                                    mb: 3,
                                    fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.25rem' },
                                    fontWeight: 400,
                                    lineHeight: 1.6,
                                    textAlign: 'center',
                                    '& strong': {
                                        color: '#00ffcc',
                                        fontWeight: 600,
                                    },
                                    '& em': {
                                        fontStyle: 'normal',
                                        color: 'rgba(255,255,255,0.8)',
                                    }
                                }}
                            >
                                Turn your <em>static slideshows</em> and <em>pre-recorded videos</em> into{' '}
                                <strong>dynamic, interactive sessions</strong>. Let viewers pause, ask
                                questions, and get immediate answers in your voice—even when you're away.
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    color: 'rgba(255,255,255,0.95)',
                                    mb: 5,
                                    fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.25rem' },
                                    fontWeight: 400,
                                    lineHeight: 1.6,
                                    textAlign: 'center',
                                    '& strong': {
                                        color: '#00ffcc',
                                        fontWeight: 600,
                                    }
                                }}
                            >
                                Watch as <strong>engagement soars</strong>, your <strong>time frees up</strong>,
                                and your unique style stays front and center—even while you focus elsewhere.
                                With Brdge AI, your content never clocks out.
                            </Typography>

                            {/* Feature bullets */}
                            <Box sx={{
                                display: { xs: 'none', sm: 'flex' }, // Hide on mobile, show on tablet and up
                                flexDirection: 'row',
                                gap: 3,
                                justifyContent: 'center',
                                flexWrap: 'wrap'
                            }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        color: '#00B4DB',
                                        padding: '12px 24px',
                                        background: 'rgba(0, 41, 122, 0.2)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(0, 180, 219, 0.2)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        flex: { xs: '1 1 100%', sm: '0 1 auto' },
                                        maxWidth: { xs: '100%', sm: '280px' },
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            background: 'rgba(0, 41, 122, 0.3)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: `
                                                0 4px 20px rgba(0, 180, 219, 0.15),
                                                0 0 0 1px rgba(0, 180, 219, 0.3),
                                                inset 0 0 20px rgba(0, 180, 219, 0.05)
                                            `
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '1px',
                                            background: 'linear-gradient(90deg, transparent, rgba(0, 180, 219, 0.2), transparent)',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease',
                                        },
                                        '&:hover::before': {
                                            opacity: 1
                                        }
                                    }}
                                >
                                    <AccessTime sx={{ fontSize: '1.5rem' }} />
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: '1rem',
                                            letterSpacing: '0.02em',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        Seamless Setup
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        color: '#00B4DB',
                                        padding: '12px 24px',
                                        background: 'rgba(0, 41, 122, 0.2)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(0, 180, 219, 0.2)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        flex: { xs: '1 1 100%', sm: '0 1 auto' },
                                        maxWidth: { xs: '100%', sm: '280px' },
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            background: 'rgba(0, 41, 122, 0.3)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: `
                                                0 4px 20px rgba(0, 180, 219, 0.15),
                                                0 0 0 1px rgba(0, 180, 219, 0.3),
                                                inset 0 0 20px rgba(0, 180, 219, 0.05)
                                            `
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '1px',
                                            background: 'linear-gradient(90deg, transparent, rgba(0, 180, 219, 0.2), transparent)',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease',
                                        },
                                        '&:hover::before': {
                                            opacity: 1
                                        }
                                    }}
                                >
                                    <AllInclusive sx={{ fontSize: '1.5rem' }} />
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: '1rem',
                                            letterSpacing: '0.02em',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        24/7 Engagement
                                    </Typography>
                                </Box>
                            </Box>
                        </motion.div>
                    </Box>

                    {/* VIDEO SECTION */}
                    <Box sx={{
                        width: '100%',
                        mb: { xs: 6, sm: 8 },
                        maxWidth: '1000px',
                        mx: 'auto',
                        position: 'relative',
                        display: { xs: 'none', sm: 'block' }, // Hide on mobile, show on tablet and up
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '100%',
                            height: '100%',
                            background: 'radial-gradient(circle at center, rgba(0, 180, 219, 0.12), transparent 70%)',
                            filter: 'blur(40px)',
                            zIndex: 0
                        }
                    }}>
                        <motion.div>
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    paddingTop: '56.25%',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    background: 'rgba(0, 41, 122, 0.3)', // Darker blue for video background
                                    border: '1px solid rgba(0, 180, 219, 0.2)',
                                    boxShadow: `
                                        0 8px 32px rgba(0, 0, 0, 0.2),
                                        0 4px 8px rgba(0, 0, 0, 0.1),
                                        0 0 0 1px rgba(0, 180, 219, 0.1),
                                        inset 0 0 32px rgba(0, 180, 219, 0.05)
                                    `,
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        inset: 0,
                                        borderRadius: '20px',
                                        padding: '1px',
                                        background: 'linear-gradient(180deg, rgba(0, 180, 219, 0.2), rgba(0, 65, 194, 0.1))',
                                        WebkitMask:
                                            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                        WebkitMaskComposite: 'xor',
                                        maskComposite: 'exclude',
                                        zIndex: 1
                                    }
                                }}
                            >
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
                                        padding: 0,
                                    }}
                                >
                                    <source src={demoVideo} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </Box>
                        </motion.div>
                    </Box>

                    {/* THREE FEATURE CARDS */}
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 2, sm: 3, md: 4 }}
                        sx={{
                            justifyContent: 'center',
                            px: { xs: 2, sm: 0 }
                        }}
                    >
                        {/* CARD #1 */}
                        <Box
                            sx={{
                                p: { xs: 3, sm: 3.5 },
                                borderRadius: '16px',
                                bgcolor: 'rgba(0, 41, 122, 0.2)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(0, 180, 219, 0.2)',
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
                                minHeight: { xs: '100px', sm: '120px' },
                                justifyContent: 'center',
                                maxWidth: { xs: '100%', sm: '300px' },
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: `
                      0 8px 30px rgba(0,0,0,0.2),
                      0 0 0 1px rgba(0, 180, 219, 0.3),
                      0 0 60px rgba(0, 180, 219, 0.1)
                    `,
                                    bgcolor: 'rgba(0, 41, 122, 0.3)'
                                }
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    color: '#FFFFFF',
                                    mb: 1,
                                    textShadow: '0 2px 10px rgba(255,255,255,0.2)',
                                    fontSize: { xs: '1.4rem', sm: '1.5rem', md: '1.75rem' },
                                    fontWeight: 600
                                }}
                            >
                                Instant Q&A
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: 'rgba(255,255,255,0.9)', maxWidth: '160px', fontSize: { xs: '0.95rem', sm: '0.9rem', md: '1rem' } }}
                            >
                                No delays or repeated calls—your AI answers viewer questions right away.
                            </Typography>
                        </Box>

                        {/* CARD #2 */}
                        <Box
                            sx={{
                                p: { xs: 3, sm: 3.5 },
                                borderRadius: '16px',
                                bgcolor: 'rgba(0, 41, 122, 0.2)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(0, 180, 219, 0.2)',
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
                                minHeight: { xs: '100px', sm: '120px' },
                                justifyContent: 'center',
                                maxWidth: { xs: '100%', sm: '300px' },
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: `
                      0 8px 30px rgba(0,0,0,0.2),
                      0 0 0 1px rgba(0, 180, 219, 0.3),
                      0 0 60px rgba(0, 180, 219, 0.1)
                    `,
                                    bgcolor: 'rgba(0, 41, 122, 0.3)'
                                }
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    color: '#FFFFFF',
                                    mb: 1,
                                    textShadow: '0 2px 10px rgba(255,255,255,0.2)',
                                    fontSize: { xs: '1.4rem', sm: '1.5rem', md: '1.75rem' },
                                    fontWeight: 600
                                }}
                            >
                                Scalable Knowledge
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: 'rgba(255,255,255,0.9)', maxWidth: '160px', fontSize: { xs: '0.95rem', sm: '0.9rem', md: '1rem' } }}
                            >
                                Share once, let Brdge AI handle unlimited requests—without repeating yourself.
                            </Typography>
                        </Box>

                        {/* CARD #3 */}
                        <Box
                            sx={{
                                p: { xs: 3, sm: 3.5 },
                                borderRadius: '16px',
                                bgcolor: 'rgba(0, 41, 122, 0.2)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(0, 180, 219, 0.2)',
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
                                minHeight: { xs: '100px', sm: '120px' },
                                justifyContent: 'center',
                                maxWidth: { xs: '100%', sm: '300px' },
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: `
                      0 8px 30px rgba(0,0,0,0.2),
                      0 0 0 1px rgba(0, 180, 219, 0.3),
                      0 0 60px rgba(0, 180, 219, 0.1)
                    `,
                                    bgcolor: 'rgba(0, 41, 122, 0.3)'
                                }
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    color: '#FFFFFF',
                                    mb: 1,
                                    textShadow: '0 2px 10px rgba(255,255,255,0.2)',
                                    fontSize: { xs: '1.4rem', sm: '1.5rem', md: '1.75rem' },
                                    fontWeight: 600
                                }}
                            >
                                Actionable Insights
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: 'rgba(255,255,255,0.9)', maxWidth: '160px', fontSize: { xs: '0.95rem', sm: '0.9rem', md: '1rem' } }}
                            >
                                Track engagement, see common questions, and refine your strategy based on real-time data.
                            </Typography>
                        </Box>
                    </Stack>

                    {/* CTA BUTTON */}
                    <Box
                        sx={{
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
                                width: '400px',
                                height: '400px',
                                background: `
                    radial-gradient(circle at center,
                    rgba(0,255,204,0.15) 0%,
                    rgba(0,255,204,0.1) 20%,
                    rgba(0,180,219,0.05) 40%,
                    transparent 70%)
                  `,
                                filter: 'blur(40px)',
                                zIndex: 0,
                                animation: 'pulse 2s ease-in-out infinite'
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
                                background: 'linear-gradient(45deg, #FFFFFF, #E0E0E0)',
                                color: '#000000',
                                px: { xs: 4, sm: 6 },
                                py: { xs: 1.5, sm: 2 },
                                width: { xs: '100%', sm: 'auto' },
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                fontWeight: 600,
                                borderRadius: '50px',
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
                                    transform: 'translateY(-2px)'
                                },
                                transition: 'all 0.3s ease-in-out'
                            }}
                        >
                            Get Started
                        </Button>
                    </Box>
                </motion.div>
            </Container>

            {/* Keyframe animations (same as before) */}
            <style>
                {`
            @keyframes pulse {
              0% { opacity: 0.5; }
              50% { opacity: 1; }
              100% { opacity: 0.5; }
            }
            @keyframes float {
              0% { transform: translateY(0px) }
              50% { transform: translateY(-20px) }
              100% { transform: translateY(0px) }
            }
            @keyframes pulseUnderline {
              0%, 100% {
                opacity: 0.5; transform: translateX(-50%) scaleX(0.95); filter: brightness(0.8);
              }
              50% {
                opacity: 1; transform: translateX(-50%) scaleX(1); filter: brightness(1.2);
              }
            }
          `}
            </style>
        </Box>
    );
};

// HeroSection - user said it works well, so minimal changes
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
            minHeight: '90vh',
            width: '100vw',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: 'transparent',
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
                mt: { xs: '80px', sm: '72px' },
                mb: { xs: 4, sm: 6, md: 8 },
                px: { xs: 2, sm: 3, md: 4 },
                width: '100%',
                mx: 'auto',
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    style={{
                        width: '100%',
                        maxWidth: '1200px',
                        padding: '0 16px',
                        marginBottom: '24px',
                    }}
                >
                    <Typography
                        variant="h1"
                        align="center"
                        className="heading-large"
                        sx={{
                            mb: { xs: 3, sm: 4 },
                            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                            lineHeight: { xs: 1.2, sm: 1.1 },
                            fontWeight: 800,
                            textTransform: 'none',
                            letterSpacing: '-0.02em',
                            mx: 'auto',
                            maxWidth: { xs: '100%', sm: '85%', md: '80%' },
                            color: 'white',
                            position: 'relative',
                            fontFamily: fontFamily,
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-24px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '140px',
                                height: '2px',
                                background: 'linear-gradient(90deg, transparent, rgba(0,255,204,0.4), transparent)',
                                borderRadius: '1px'
                            }
                        }}
                    >
                        <Box
                            component="span"
                            sx={{
                                display: 'block',
                                color: '#FFFFFF',
                                textShadow: '0 0 20px rgba(255,255,255,0.15)',
                                fontSize: { xs: '2.75rem', sm: '3.75rem', md: '4.5rem' },
                                fontWeight: 500,
                                letterSpacing: '-0.02em',
                                mb: { xs: 3, sm: 4 },
                                textTransform: 'none',
                                fontFamily: fontFamily,
                                lineHeight: 1.2
                            }}
                        >
                            Speak Once,
                            <br />
                            <span className="highlight" style={{
                                background: 'linear-gradient(180deg, #00ffcc 30%, rgba(0,255,204,0.8) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                position: 'relative',
                                display: 'inline-block',
                                textShadow: 'none',
                            }}>
                                Connect Forever
                            </span>
                        </Box>
                        <Box
                            component="span"
                            sx={{
                                display: 'block',
                                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                                fontWeight: 400,
                                color: 'rgba(255,255,255,0.9)',
                                letterSpacing: '0.01em',
                                mt: 3,
                                fontFamily: fontFamily
                            }}
                        >

                        </Box>
                    </Typography>
                </motion.div>

                <Box
                    component="a"
                    href="https://brdge-ai.com/viewBrdge/252"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        width: { xs: '160px', sm: '180px', md: '200px' },
                        height: { xs: '160px', sm: '180px', md: '200px' },
                        position: 'relative',
                        cursor: 'pointer',
                        mx: 'auto',
                        mb: { xs: 3, sm: 4 },
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '200%',  // Increased from 120% to 200%
                            height: '200%', // Increased from 120% to 200%
                            background: 'radial-gradient(circle, rgba(0, 255, 204, 0.15) 0%, transparent 70%)',
                            filter: 'blur(40px)',  // Added blur to soften the extended glow
                            animation: 'breathe 4s ease-in-out infinite',
                            zIndex: 0,
                        },
                        '&::after': {
                            content: '"Click to chat"',
                            position: 'absolute',
                            bottom: '-40px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'linear-gradient(135deg, rgba(0, 255, 204, 0.1), rgba(0, 180, 219, 0.1))',
                            backdropFilter: 'blur(10px)',
                            padding: { xs: '8px 16px', sm: '12px 24px' },
                            borderRadius: '24px',
                            fontSize: { xs: '0.85rem', sm: '0.95rem' },
                            color: '#00ffcc',
                            whiteSpace: 'nowrap',
                            opacity: 0,
                            transition: 'all 0.3s ease',
                            visibility: 'hidden',
                            zIndex: 100,  // Increased from 10 to 100
                        },
                        '&:hover::after': {  // Add this hover state
                            opacity: 1,
                            visibility: 'visible',
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
                                    width: '150%',  // Increased from 88% to 150%
                                    height: '150%', // Increased from 88% to 150%
                                    borderRadius: '20%',
                                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
                                    filter: 'blur(25px)',  // Increased blur for softer, wider glow
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
                                        0 0 100px rgba(0, 255, 204, 0.1)  // Added extra outer glow
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

                <Typography
                    variant="h5"
                    align="center"
                    sx={{
                        mt: { xs: 2, sm: 3 },
                        mb: { xs: 8, sm: 10, md: 12 },
                        maxWidth: '800px',
                        mx: 'auto',
                        opacity: 0.9,
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                        fontWeight: 400,
                        lineHeight: 1.85,
                        px: { xs: 3, sm: 4 },
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
                    Imagine your recorded videos and documents actively <strong>talking</strong> with viewers. Let them <strong>pause</strong>, ask questions, and hear <strong>your voice</strong> respond—even when you're not around. Welcome to the revolution: living, breathing <strong>engagement that never sleeps.</strong>
                </Typography>

                <Box sx={{
                    display: 'flex',
                    gap: { xs: 3, sm: 4 },
                    justifyContent: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                    width: '100%',
                    maxWidth: { xs: '100%', sm: '600px' },
                    mx: 'auto',
                    mb: { xs: 8, sm: 10, md: 12 },
                    px: { xs: 3, sm: 0 }
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
                                bgcolor: 'white',
                                color: '#0041C2',
                                px: { xs: 6, sm: 8 },
                                py: { xs: 1.5, sm: 2 },
                                fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                fontWeight: 600,
                                borderRadius: '50px',
                                boxShadow: '0 0 20px rgba(255,255,255,0.15)',
                                letterSpacing: '0.02em',
                                textTransform: 'none',
                                minWidth: { xs: '100%', sm: '220px' },
                                whiteSpace: 'nowrap',
                                height: 'fit-content',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.95)',
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
                                '&:hover': {
                                    borderColor: 'white',
                                    transform: 'translateY(-3px)',
                                    bgcolor: 'rgba(0,255,204,0.1)',
                                    boxShadow: '0 10px 30px rgba(0,255,204,0.15)',
                                },
                            }}
                        >
                            See It In Action
                        </Button>
                    </motion.div>
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    mt: { xs: 4, sm: 6 },
                    mb: { xs: 4, sm: 6 },
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
                            y: [0, 15, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            paddingBottom: '20px'
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

// Updated HowItWorksSection
// Make messaging crisper and visually cleaner. Ensure mobile-friendly layout.
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
            description: "Include a <strong>screen recording</strong> plus an optional PDF. Brdge transcribes everything for your AI. "
        },
        {
            number: "02",
            icon: <Sparkles size={32} />,
            title: "Define the Agent",
            description: "Pick a personality and <strong>configure your knowledge base </strong>. Tailor the AIs responses to match your style."
        },
        {
            number: "03",
            icon: <Mic size={32} />,
            title: "Clone Your Voice",
            description: "Clone your distinct sound so every response feels like <strong> you're guiding the conversation.</strong>"
        },
        {
            number: "04",
            icon: <Share2 size={32} />,
            title: "Share & Engage",
            description: "Send one link. As viewers watch, they pause, ask, and the <strong>AI instantly replies</strong> in your voice."
        }
    ];

    return (
        <Box
            sx={{
                pt: { xs: 8, sm: 10, md: 12 },
                pb: { xs: 8, sm: 10, md: 12 },
                px: { xs: 2, sm: 4, md: 6 },
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderRadius: '24px'
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
                            letterSpacing: '-0.02em',
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-16px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '120px',
                                height: '1px',
                                background: 'linear-gradient(90deg, transparent, rgba(0,255,204,0.4), transparent)',
                                borderRadius: '1px'
                            }
                        }}
                    >
                        How It Works
                    </Typography>

                    <Typography
                        variant="h5"
                        align="center"
                        sx={{
                            fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
                            fontWeight: 400,
                            color: 'rgba(255,255,255,0.9)',
                            mb: { xs: 8, sm: 10, md: 12 },
                            maxWidth: '600px',
                            mx: 'auto',
                            lineHeight: 1.6
                        }}
                    >
                        Turn your slides and videos into a 24/7 conversation in just four steps.
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 6, sm: 8, md: 10 },
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

// Updated ImpactSection with clearer messaging and more mobile-friendly layout
const ImpactSection = () => {
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    // Add state for expanded cards
    const [expandedCard, setExpandedCard] = useState(null);

    const handleCardClick = (id) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    // UPDATED copy: shorter, more direct
    const industries = [
        {
            id: 'onboarding',
            icon: <SchoolIcon />,
            title: 'Onboarding & Training',
            subtitle: 'Empower new hires instantly',
            details: [
                {
                    title: 'Streamline Orientation',
                    description:
                        'Stop repeating policies or product intros—your AI fields common questions with perfect consistency.'
                },
                {
                    title: 'Boost Confidence',
                    description:
                        'New hires get clarity right when they need it, reducing confusion or delays.'
                },
                {
                    title: 'Time Savings',
                    description:
                        'Automate basic Q&A so managers can focus on strategic growth.'
                }
            ]
        },
        {
            id: 'sales',
            icon: <BusinessCenter />,
            title: 'Sales & Customer Engagement',
            subtitle: 'Close deals faster with real-time Q&A',
            details: [
                {
                    title: '24/7 Demos',
                    description:
                        'Prospects ask about pricing or features on their schedule—no more missed leads.'
                },
                {
                    title: 'Build Trust',
                    description:
                        'Consistent, accurate answers prove you\'re the expert they can count on.'
                },
                {
                    title: 'Shorten the Funnel',
                    description:
                        'Instant clarifications speed up decisions, boosting conversions.'
                }
            ]
        },
        {
            id: 'education',
            icon: <RocketLaunchIcon />,
            title: 'Education & Knowledge Hubs',
            subtitle: 'Turn lectures into a living tutor',
            details: [
                {
                    title: 'Immediate Clarity',
                    description:
                        'Students pause recorded lessons, ask deeper questions, and get real-time insight.'
                },
                {
                    title: 'Engaging Learning',
                    description:
                        'Interactive Q&A improves comprehension more than passive videos.'
                },
                {
                    title: 'Scale Effortlessly',
                    description:
                        'Whether 5 or 5,000 students, your AI answers in detail so you can handle advanced needs.'
                }
            ]
        }
    ];

    return (
        <Box
            sx={{
                pt: { xs: 4, sm: 6, md: 8 },
                pb: { xs: 4, sm: 7, md: 10 },
                px: { xs: 2, sm: 4, md: 6 },
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Container maxWidth="lg" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    {/* HEADLINE */}
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                            fontWeight: 600,
                            color: 'white',
                            mb: { xs: 3, sm: 4, md: 5 },
                            letterSpacing: '0.02em',
                            textShadow: '0 0 20px rgba(255,255,255,0.3)',
                            textTransform: 'none',
                        }}
                    >
                        One Platform, Countless Possibilities
                    </Typography>

                    {/* SUB-HEADLINE */}
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{
                            color: 'rgba(255,255,255,0.8)',
                            mb: 6,
                            maxWidth: '800px',
                            mx: 'auto',
                            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                            px: { xs: 2, sm: 0 },
                        }}
                    >
                        Brdge AI supercharges your entire organization—
                        driving efficiency, engagement, and unstoppable growth, no matter your field..
                    </Typography>

                    {/* CARDS */}
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 2, sm: 3, md: 4 }}
                        sx={{
                            justifyContent: 'center',
                            mt: { xs: 4, md: 6 },
                            px: { xs: 2, sm: 0 },
                            alignItems: 'stretch'
                        }}
                    >
                        {industries.map((industry, index) => (
                            <Box
                                key={industry.id}
                                sx={{
                                    flex: { xs: '1', sm: '1 1 0' },
                                    width: { sm: '33.33%' },
                                    minHeight: '100%'
                                }}
                            >
                                <Paper
                                    onClick={() => handleCardClick(industry.id)}
                                    sx={{
                                        height: '100%',
                                        p: { xs: 3, md: 4 },
                                        borderRadius: '16px',
                                        backdropFilter: 'blur(12px)',
                                        backgroundColor: expandedCard === industry.id ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
                                        border: '1px solid',
                                        borderColor: expandedCard === industry.id ? 'rgba(0,255,204,0.2)' : 'rgba(255,255,255,0.1)',
                                        position: 'relative',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        '&:hover': {
                                            boxShadow: '0 15px 40px rgba(0,255,204,0.15)',
                                            borderColor: 'rgba(0,255,204,0.3)',
                                            transform: 'translateY(-5px)'
                                        }
                                    }}
                                >
                                    {/* CARD HEADER */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            mb: expandedCard === industry.id ? 3 : 0,
                                            transition: 'margin 0.3s ease'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                backgroundColor: expandedCard === industry.id ? 'rgba(0, 255, 204, 0.15)' : 'rgba(0, 255, 204, 0.1)',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {React.cloneElement(industry.icon, {
                                                sx: {
                                                    fontSize: 32,
                                                    color: '#00ffcc'
                                                }
                                            })}
                                        </Box>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: '#fff',
                                                }}
                                            >
                                                {industry.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'rgba(255,255,255,0.8)',
                                                    mt: 0.5
                                                }}
                                            >
                                                {industry.subtitle}
                                            </Typography>
                                        </Box>
                                        <Add
                                            sx={{
                                                fontSize: 24,
                                                color: '#fff',
                                                transform: expandedCard === industry.id ? 'rotate(45deg)' : 'none',
                                                transition: 'transform 0.3s ease'
                                            }}
                                        />
                                    </Box>

                                    <Collapse in={expandedCard === industry.id}>
                                        <Box
                                            sx={{
                                                mt: 3,
                                                pt: 3,
                                                borderTop: '1px solid rgba(255,255,255,0.1)'
                                            }}
                                        >
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
                                                            mb: 1,
                                                            fontSize: '0.95rem'
                                                        }}
                                                    >
                                                        {detail.title}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'rgba(255,255,255,0.8)',
                                                            lineHeight: 1.6
                                                        }}
                                                    >
                                                        {detail.description}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Collapse>
                                </Paper>
                            </Box>
                        ))}
                    </Stack>
                </motion.div>
            </Container>
        </Box>
    );
};

// Updated FinalCTA for stronger clarity and visuals
const FinalCTA = () => {
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    return (
        <Box
            sx={{
                pt: { xs: 8, sm: 10, md: 12 },
                pb: { xs: 8, sm: 10, md: 12 },
                px: { xs: 2, sm: 4, md: 6 },
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderRadius: '24px',
                maxWidth: '1200px',
                mx: 'auto'
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
                            letterSpacing: '-0.02em'
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
                        Join the Brdge AI revolution and watch every video or document become an endless, interactive conversation.
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 2, sm: 4 },
                        justifyContent: 'center',
                        maxWidth: '600px',
                        mx: 'auto'
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
                                    width: '100%',
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
                                    width: '100%',
                                    color: 'white',
                                    borderColor: 'rgba(255,255,255,0.2)',
                                    borderWidth: 1,
                                    px: { xs: 4, sm: 6 },
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

function LandingPage() {
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
                background: 'linear-gradient(180deg, #001B3D 0%, #000C1F 15%, #001F5C 35%, #0041C2 60%, #00B4DB 100%)',
                color: 'white',
                minHeight: '100vh',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
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
                }
            }}>
                <HeroSection />
                <Container
                    maxWidth="lg"
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        pt: { xs: 2, sm: 4, md: 6 },
                        pb: { xs: 6, sm: 8, md: 10 },
                        px: { xs: 2, sm: 4, md: 6 },
                        flex: 1,
                        '& > *': {
                            mb: { xs: 10, sm: 12, md: 16 },
                            opacity: 0.98,
                            backdropFilter: 'blur(10px)',
                            borderRadius: '24px',
                            p: { xs: 3, sm: 4, md: 5 },
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 100%)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                            }
                        }
                    }}
                >
                    <IntroducingBrdgeAI />
                    <HowItWorksSection />
                    <ImpactSection />
                    <FinalCTA />
                </Container>
                <Footer />
            </Box>
        </ParallaxProvider>
    );
}

export default LandingPage;
