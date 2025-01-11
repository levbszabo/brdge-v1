// src/pages/LandingPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Typography, Button, Container, Grid, Box,
    useTheme, Paper, Collapse, Icon
} from '@mui/material';
import {
    ArrowForward, ArrowDownward, Link as LinkIcon, BusinessCenter, Add, AccessTime, AllInclusive,

    HomeRepairService,
    AutoFixHigh,
    VerifiedUser,
    Explore,
} from '@mui/icons-material';
import { motion, useAnimation } from 'framer-motion';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import { useInView } from 'react-intersection-observer';
import demoVideo from '../assets/brdge-demo2.mp4';
import logo from '../assets/new-img.png';
import './LandingPage.css';
import SchoolIcon from '@mui/icons-material/School';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

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
        <Box sx={{
            pt: { xs: 0, sm: 0, md: 0 },
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
                px: { xs: 2, sm: 4, md: 6 },
                mt: { xs: 4, sm: 6, md: 8 },
                position: 'relative',
                zIndex: 1
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
                        mt: { xs: 8, sm: 10, md: 12 },
                        mb: { xs: 6, sm: 8, md: 10 },
                        textTransform: 'capitalize',
                        textShadow: '0 0 20px rgba(255,255,255,0.4)',
                        letterSpacing: '0.02em',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-24px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '140px',
                            height: '3px',
                            background: `linear-gradient(
                                90deg,
                                transparent 0%,
                                rgba(0,255,204,0.2) 15%,
                                rgba(0,255,204,0.5) 50%,
                                rgba(0,255,204,0.2) 85%,
                                transparent 100%
                            )`,
                            borderRadius: '2px',
                            boxShadow: `
                                0 0 10px rgba(0,255,204,0.3),
                                0 0 20px rgba(0,255,204,0.2)
                            `,
                            animation: 'pulseUnderline 3s ease-in-out infinite'
                        }
                    }}>
                        Real Impact Across Industries
                    </Typography>

                    <Grid container spacing={{ xs: 0, sm: 2, md: 4 }}
                        alignItems={{ xs: 'center', md: 'flex-start' }}
                        sx={{
                            mx: { xs: 0, sm: -2, md: -3 },
                            px: { xs: 0, sm: 2, md: 3 },
                            width: '100vw',
                            position: { xs: 'relative', sm: 'static' },
                            left: { xs: '50%', sm: 'auto' },
                            transform: { xs: 'translateX(-50%)', sm: 'none' },
                            mt: { xs: 0, sm: -2, md: 0 }
                        }}>
                        <Grid item xs={12} md={7} sx={{
                            mt: { md: 5 }
                        }}>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.8 }}
                                sx={{
                                    maxWidth: '100vw',
                                    ml: { md: -4 },
                                    px: { xs: 0, sm: 2 },
                                    mx: { xs: 0, sm: 'auto' },
                                }}
                            >
                                <Box sx={{
                                    position: 'relative',
                                    width: '100%',
                                    maxWidth: { xs: '100vw', sm: '1000px' },
                                    margin: '0 auto',
                                    borderRadius: { xs: '4px', sm: '10px' },
                                    overflow: 'hidden',
                                    bgcolor: 'rgba(2, 6, 23, 0.2)',
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: {
                                        xs: 'none',
                                        sm: `
                                            0 8px 32px rgba(0, 0, 0, 0.2),
                                            0 0 40px rgba(0, 180, 219, 0.15),
                                            inset 0 0 30px rgba(0, 180, 219, 0.1)
                                        `
                                    },
                                    mb: { xs: 0, md: 0 },
                                    '&::before': {
                                        content: '""',
                                        display: 'block',
                                        paddingTop: '56.25%',
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
                                            objectFit: 'contain',
                                            padding: 0,
                                            backgroundColor: 'rgba(2, 6, 23, 0.2)',
                                        }}
                                    >
                                        <source src={demoVideo} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </Box>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12} md={5} sx={{
                            pl: { md: 4 },
                            mt: { xs: 3, md: 0 },
                            px: { xs: 3, sm: 2 },
                        }}>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.4, duration: 0.8 }}
                            >
                                <Typography variant="h5" sx={{
                                    color: '#FFFFFF',
                                    mb: 4,
                                    maxWidth: '800px',
                                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.15rem' },
                                    fontWeight: 400,
                                    lineHeight: { xs: 1.5, md: 1.6 },
                                    pr: { md: 2 },  // Add right padding for better spacing
                                    '& strong': {
                                        color: '#00ffcc',
                                        fontWeight: 600,
                                        textShadow: '0 0 10px rgba(0,255,204,0.3)',
                                    }
                                }}>
                                    Brdge AI frees your insights from <em>static PDFs</em> and <em>endless slide decks</em>. In just a few steps, you can build a <strong>personalized AI agent that speaks in your voice</strong> and understands your content inside and out.
                                </Typography>

                                <Typography variant="h5" sx={{
                                    color: '#FFFFFF',
                                    mb: 4,
                                    maxWidth: '800px',
                                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.15rem' },
                                    fontWeight: 400,
                                    lineHeight: { xs: 1.5, md: 1.6 },
                                    pr: { md: 2 },  // Add right padding for better spacing
                                    '& strong': {
                                        color: '#00ffcc',
                                        fontWeight: 600,
                                        textShadow: '0 0 10px rgba(0,255,204,0.3)',
                                    }
                                }}>
                                    Whether it's for <strong>sales funnels</strong>, <strong>onboarding</strong>, <strong>training sessions</strong>, or <strong>community education</strong>, your AI guide responds instantly—no more scheduling calls, repeating yourself, or leaving people waiting!
                                </Typography>

                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    mt: 4
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        color: '#00ffcc',
                                        padding: '8px 16px',
                                        background: 'rgba(0,255,204,0.05)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(0,255,204,0.1)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'rgba(0,255,204,0.08)',
                                            border: '1px solid rgba(0,255,204,0.2)',
                                        }
                                    }}>
                                        <AccessTime sx={{ fontSize: '1.25rem' }} />
                                        <Typography variant="subtitle1" sx={{
                                            fontWeight: 500,
                                            fontSize: '0.9rem',
                                            letterSpacing: '0.02em'
                                        }}>
                                            Under 10 Minutes Setup
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        color: '#00ffcc',
                                        padding: '8px 16px',
                                        background: 'rgba(0,255,204,0.05)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(0,255,204,0.1)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'rgba(0,255,204,0.08)',
                                            border: '1px solid rgba(0,255,204,0.2)',
                                        }
                                    }}>
                                        <AllInclusive sx={{ fontSize: '1.25rem' }} />
                                        <Typography variant="subtitle1" sx={{
                                            fontWeight: 500,
                                            fontSize: '0.9rem',
                                            letterSpacing: '0.02em'
                                        }}>
                                            24/7 Availability
                                        </Typography>
                                    </Box>
                                </Box>
                            </motion.div>
                        </Grid>
                    </Grid>

                    <Box sx={{
                        display: 'flex',
                        gap: { xs: 3, sm: 4 },
                        justifyContent: 'center',
                        mt: { xs: 6, md: 8 },
                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                        px: { xs: 2, sm: 0 },
                    }}>
                        <Box sx={{
                            p: { xs: 3, sm: 3.5 },
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
                            minHeight: { xs: '100px', sm: '120px' },
                            justifyContent: 'center',
                            maxWidth: { xs: '100%', sm: '300px' },
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
                        }}>
                            <Typography variant="h5" sx={{
                                color: '#FFFFFF',
                                mb: 1,
                                textShadow: '0 2px 10px rgba(255,255,255,0.2)',
                                fontSize: { xs: '1.5rem', sm: '1.5rem', md: '1.75rem' }
                            }}>
                                Instant Q&A
                            </Typography>
                            <Typography variant="body2" sx={{
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: { xs: '0.95rem', sm: '0.9rem', md: '1rem' },
                                maxWidth: '160px'
                            }}>
                                Your audience asks. Your AI answers in real-time, no delays or back-and-forth.
                            </Typography>
                        </Box>
                        <Box sx={{
                            p: { xs: 3, sm: 3.5 },
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
                            minHeight: { xs: '100px', sm: '120px' },
                            justifyContent: 'center',
                            maxWidth: { xs: '100%', sm: '300px' },
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
                        }}>
                            <Typography variant="h5" sx={{
                                color: '#FFFFFF',
                                mb: 1,
                                textShadow: '0 2px 10px rgba(255,255,255,0.2)',
                                fontSize: { xs: '1.5rem', sm: '1.5rem', md: '1.75rem' }
                            }}>
                                Scalable Knowledge
                            </Typography>
                            <Typography variant="body2" sx={{
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: { xs: '0.95rem', sm: '0.9rem', md: '1rem' },
                                maxWidth: '160px'
                            }}>
                                Reach unlimited audiences without repeating the same info over and over again.
                            </Typography>
                        </Box>
                        <Box sx={{
                            p: { xs: 3, sm: 3.5 },
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
                            minHeight: { xs: '100px', sm: '120px' },
                            justifyContent: 'center',
                            maxWidth: { xs: '100%', sm: '300px' },
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
                        }}>
                            <Typography variant="h5" sx={{
                                color: '#FFFFFF',
                                mb: 1,
                                textShadow: '0 2px 10px rgba(255,255,255,0.2)',
                                fontSize: { xs: '1.5rem', sm: '1.5rem', md: '1.75rem' }
                            }}>
                                Actionable Insights
                            </Typography>
                            <Typography variant="body2" sx={{
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: { xs: '0.95rem', sm: '0.9rem', md: '1rem' },
                                maxWidth: '160px'
                            }}>
                                Track engagement, see common questions, and refine your content strategy.
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
                            animation: 'pulse 2s ease-in-out infinite',
                        },
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
                                    transform: 'translateY(-2px)',
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
                    @keyframes bounce {
                        0%, 100% { transform: translateX(-50%) translateY(0); }
                        50% { transform: translateX(-50%) translateY(-10px); }
                    }
                    
                    @keyframes ripple {
                        0% { transform: scale(1); opacity: 1; }
                        100% { transform: scale(1.3); opacity: 0; }
                    }

                    @keyframes pulseGlow {
                        0% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.6; }
                        50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.8; }
                        100% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.6; }
                    }

                    @keyframes rotate {
                        0% { transform: translate(-50%, -50%) rotate(0deg); }
                        100% { transform: translate(-50%, -50%) rotate(360deg); }
                    }

                    @keyframes float {
                        0% { transform: translateY(0px) translateZ(0); }
                        50% { transform: translateY(-10px) translateZ(0); }
                        100% { transform: translateY(0px) translateZ(0); }
                    }

                    @keyframes electricGlow {
                        0% { opacity: 0.8; filter: brightness(1); }
                        5% { opacity: 1; filter: brightness(1.2); }
                        10% { opacity: 0.8; filter: brightness(1); }
                        15% { opacity: 1; filter: brightness(1.1); }
                        20% { opacity: 0.8; filter: brightness(1); }
                        100% { opacity: 0.8; filter: brightness(1); }
                    }

                    @keyframes breathe {
                        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
                        50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
                    }

                    @keyframes breatheAndGlow {
                        0%, 100% { 
                            transform: translate(-50%, -50%) scale(0.95);
                            opacity: 0.6;
                            filter: blur(10px) brightness(1);
                        }
                        50% { 
                            transform: translate(-50%, -50%) scale(1.05);
                            opacity: 0.8;
                            filter: blur(15px) brightness(1.2);
                        }
                    }

                    @keyframes rotateAndPulse {
                        0% { 
                            transform: translate(-50%, -50%) rotate(0deg) scale(1);
                            border-color: rgba(255, 255, 255, 0.2);
                        }
                        50% { 
                            transform: translate(-50%, -50%) rotate(180deg) scale(1.05);
                            border-color: rgba(0, 255, 204, 0.3);
                        }
                        100% { 
                            transform: translate(-50%, -50%) rotate(360deg) scale(1);
                            border-color: rgba(255, 255, 255, 0.2);
                        }
                    }

                    @keyframes floatAndGlow {
                        0%, 100% { 
                            transform: translateY(0px) translateZ(0);
                            filter: drop-shadow(0 0 20px rgba(0, 255, 204, 0.3)) brightness(1);
                        }
                        50% { 
                            transform: translateY(-10px) translateZ(0);
                            filter: drop-shadow(0 0 30px rgba(0, 255, 204, 0.4)) brightness(1.1);
                        }
                    }

                    @keyframes electricPulse {
                        0%, 100% { opacity: 0.8; filter: brightness(1); }
                        50% { opacity: 1; filter: brightness(1.2); }
                    }

                    @keyframes sparkle {
                        0% { opacity: 0; height: 15px; }
                        50% { opacity: 0.8; height: 25px; }
                        100% { opacity: 0; height: 15px; }
                    }

                    @keyframes breatheAndGlow {
                        0%, 100% { 
                            transform: translate(-50%, -50%) scale(0.98);
                            opacity: 0.6;
                            filter: blur(8px) brightness(1);
                        }
                        50% { 
                            transform: translate(-50%, -50%) scale(1.02);
                            opacity: 0.8;
                            filter: blur(12px) brightness(1.3);
                        }
                    }

                    @keyframes rotateAndPulse {
                        0% { 
                            transform: translate(-50%, -50%) rotate(0deg) scale(1);
                            border-color: rgba(0, 255, 204, 0.2);
                            box-shadow: 0 0 15px rgba(0, 255, 204, 0.2);
                        }
                        50% { 
                            transform: translate(-50%, -50%) rotate(180deg) scale(1.02);
                            border-color: rgba(0, 255, 204, 0.4);
                            box-shadow: 0 0 25px rgba(0, 255, 204, 0.4);
                        }
                        100% { 
                            transform: translate(-50%, -50%) rotate(360deg) scale(1);
                            border-color: rgba(0, 255, 204, 0.2);
                            box-shadow: 0 0 15px rgba(0, 255, 204, 0.2);
                        }
                    }

                    @keyframes floatAndGlow {
                        0%, 100% { 
                            transform: translateY(0px) translateZ(0);
                            filter: drop-shadow(0 0 15px rgba(0, 255, 204, 0.3)) brightness(1);
                        }
                        50% { 
                            transform: translateY(-8px) translateZ(0);
                            filter: drop-shadow(0 0 25px rgba(0, 255, 204, 0.5)) brightness(1.2);
                        }
                    }

                    @keyframes electricPulse {
                        0%, 100% { opacity: 0.6; filter: brightness(1); }
                        50% { opacity: 1; filter: brightness(1.3); }
                    }

                    @keyframes sparkle {
                        0% { opacity: 0; height: 15px; }
                        50% { opacity: 0.8; height: 25px; }
                        100% { opacity: 0; height: 15px; }
                    }

                    @keyframes breatheAndGlow {
                        0%, 100% { 
                            transform: translate(-50%, -50%) scale(0.98);
                            opacity: 0.6;
                            filter: blur(8px) brightness(1);
                        }
                        50% { 
                            transform: translate(-50%, -50%) scale(1.02);
                            opacity: 0.8;
                            filter: blur(12px) brightness(1.3);
                        }
                    }

                    @keyframes rotateAndPulse {
                        0% { 
                            transform: translate(-50%, -50%) rotate(0deg) scale(1);
                            border-color: rgba(0, 255, 204, 0.2);
                            box-shadow: 0 0 15px rgba(0, 255, 204, 0.2);
                        }
                        50% { 
                            transform: translate(-50%, -50%) rotate(180deg) scale(1.02);
                            border-color: rgba(0, 255, 204, 0.4);
                            box-shadow: 0 0 25px rgba(0, 255, 204, 0.4);
                        }
                        100% { 
                            transform: translate(-50%, -50%) rotate(360deg) scale(1);
                            border-color: rgba(0, 255, 204, 0.2);
                            box-shadow: 0 0 15px rgba(0, 255, 204, 0.2);
                        }
                    }

                    @keyframes floatAndGlow {
                        0%, 100% { 
                            transform: translateY(0px) translateZ(0);
                            filter: drop-shadow(0 0 15px rgba(0, 255, 204, 0.3)) brightness(1);
                        }
                        50% { 
                            transform: translateY(-8px) translateZ(0);
                            filter: drop-shadow(0 0 25px rgba(0, 255, 204, 0.5)) brightness(1.2);
                        }
                    }

                    @keyframes electricPulse {
                        0%, 100% { opacity: 0.6; filter: brightness(1); }
                        50% { opacity: 1; filter: brightness(1.3); }
                    }

                    @keyframes pulse {
                        0% { opacity: 0.5; }
                        50% { opacity: 1; }
                        100% { opacity: 0.5; }
                    }

                    @keyframes pulseUnderline {
                        0%, 100% {
                            opacity: 0.5;
                            transform: translateX(-50%) scaleX(0.95);
                            filter: brightness(0.8);
                        }
                        50% {
                            opacity: 1;
                            transform: translateX(-50%) scaleX(1);
                            filter: brightness(1.2);
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
                        sx={{
                            mb: { xs: 3, sm: 4 },
                            fontSize: { xs: '2.25rem', sm: '3.25rem', md: '3.75rem' },
                            lineHeight: { xs: 1.25, sm: 1.2 },
                            fontWeight: 600,
                            textTransform: 'none',
                            letterSpacing: '-0.02em',
                            mx: 'auto',
                            maxWidth: { xs: '100%', sm: '85%', md: '80%' },
                            color: 'white',
                            textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-24px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '180px',
                                height: '2px',
                                background: `linear-gradient(
                                    90deg, 
                                    transparent 0%,
                                    rgba(0,255,204,0.2) 20%,
                                    rgba(0,255,204,0.4) 50%,
                                    rgba(0,255,204,0.2) 80%,
                                    transparent 100%
                                )`,
                                borderRadius: '1px',
                                boxShadow: `
                                    0 0 10px rgba(0,255,204,0.3),
                                    0 0 20px rgba(0,255,204,0.2)
                                `
                            }
                        }}
                    >
                        <Box
                            component="strong"
                            sx={{
                                textShadow: `
                                    0 0 10px rgba(255, 255, 255, 0.4),
                                    0 0 20px rgba(255, 255, 255, 0.2),
                                    0 0 30px rgba(255, 255, 255, 0.1)
                                `,
                            }}
                        >
                            Speak Through AI
                        </Box>
                        <Box
                            component="span"
                            sx={{
                                display: 'block',
                                mt: { xs: 2, sm: 3 },
                                fontSize: { xs: '2rem', sm: '2.75rem', md: '3.25rem' },
                                fontWeight: 500,
                                color: 'white',
                                textShadow: `
                                    0 0 10px rgba(255, 255, 255, 0.4),
                                    0 0 20px rgba(255, 255, 255, 0.2),
                                    0 0 30px rgba(255, 255, 255, 0.1)
                                `,
                                letterSpacing: '0.02em',
                                opacity: 0.95
                            }}
                        >
                            <strong>Your Knowledge, Your Voice</strong>
                        </Box>
                    </Typography>
                </motion.div>

                <Box
                    component="a"
                    href="https://brdge-ai.com/viewBrdge/136"
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
                            zIndex: 10,
                        },
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
                        lineHeight: 1.85,  // Increased from 1.75 to 1.85 (approximately 5% increase)
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
                    Make your content come alive, turning your documents and presentations into an <strong>always-on voice assistant</strong> that sounds exactly like you.
                    Brdge AI presents on your behalf, letting you <strong>focus on what truly matters</strong>.
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
            icon: (
                <HomeRepairService
                    sx={{
                        fontSize: 36,
                        color: '#00ffcc',
                        filter: 'drop-shadow(0 0 6px rgba(0,255,204,0.6))'
                    }}
                />
            ),
            title: "Upload & Explain",
            description: "Add your documents and outline your core insights quickly."
        },
        {
            icon: (
                <AutoFixHigh
                    sx={{
                        fontSize: 36,
                        color: '#00ffcc',
                        filter: 'drop-shadow(0 0 6px rgba(0,255,204,0.6))'
                    }}
                />
            ),
            title: "Train the AI",
            description: "Refine the AI with clarifications so it reflects your expertise."
        },
        {
            icon: (
                <VerifiedUser
                    sx={{
                        fontSize: 36,
                        color: '#00ffcc',
                        filter: 'drop-shadow(0 0 6px rgba(0,255,204,0.6))'
                    }}
                />
            ),
            title: "Personalize Voice",
            description: "Clone your voice for an experience that resonates with your audience."
        },
        {
            icon: (
                <Explore
                    sx={{
                        fontSize: 36,
                        color: '#00ffcc',
                        filter: 'drop-shadow(0 0 6px rgba(0,255,204,0.6))'
                    }}
                />
            ),
            title: "Share & Interact",
            description: "Provide a link. Viewers ask questions. AI answers instantly, 24/7!"
        }
    ];

    return (
        <Box
            sx={{
                pt: { xs: 4, sm: 6, md: 8 },
                pb: { xs: 4, sm: 6, md: 8 },
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
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                            fontWeight: 600,
                            color: 'white',
                            mb: { xs: 4, sm: 5, md: 6 },
                            textTransform: 'capitalize',
                            textShadow: '0 0 20px rgba(255,255,255,0.3)',
                            letterSpacing: '0.02em',
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '80px',
                                height: '3px',
                                background: 'linear-gradient(90deg, #FFFFFF, #E0E0E0)',
                                borderRadius: '2px',
                                boxShadow: '0 2px 8px rgba(255,255,255,0.2)'
                            }
                        }}
                    >
                        How It Works
                    </Typography>

                    <Box
                        sx={{
                            position: 'relative',
                            mx: 'auto',
                            mt: { xs: 4, md: 6 },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            maxWidth: '800px',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '4px',
                                height: '100%',
                                background: 'linear-gradient(180deg, rgba(0,255,204,0.2), rgba(0,180,219,0.2))',
                                borderRadius: '2px'
                            }
                        }}
                    >
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: index * 0.2, duration: 0.8 }}
                                style={{ width: '100%', position: 'relative' }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        alignItems: 'center',
                                        px: { xs: 2, sm: 4 },
                                        py: { xs: 3, sm: 4 },
                                        mb: { xs: 3, sm: 4 },
                                        position: 'relative',
                                        textAlign: { xs: 'center', sm: 'left' }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            zIndex: 1,
                                            minWidth: '60px',
                                            minHeight: '60px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: 'rgba(0,255,204,0.08)',
                                            borderRadius: '50%',
                                            border: '2px solid rgba(255,255,255,0.1)',
                                            boxShadow: '0 8px 20px rgba(0,255,204,0.2)',
                                            mr: { xs: 0, sm: 3 },
                                            mb: { xs: 2, sm: 0 },
                                            mx: 'auto'
                                        }}
                                    >
                                        {step.icon}
                                    </Box>

                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                mb: 1,
                                                color: '#fff'
                                            }}
                                        >
                                            {step.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: 'rgba(255,255,255,0.8)' }}
                                        >
                                            {step.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </motion.div>
                        ))}
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

// Updated ImpactSection with clearer messaging and more mobile-friendly layout
const ImpactSection = () => {
    const [expandedCard, setExpandedCard] = useState(null);
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    const industries = [
        {
            id: 'onboarding',
            icon: <SchoolIcon />,
            title: "Onboarding & Training",
            subtitle: "Empower new hires and teams with on-demand, personalized guidance",
            details: [
                {
                    title: "Reduce Training Overhead",
                    description: "Instead of repeating policies or product overviews, let AI handle FAQs. Managers reclaim hours each week."
                },
                {
                    title: "Boost Retention & Productivity",
                    description: "New employees feel supported from day one, lowering confusion and accelerating their learning curve."
                },
                {
                    title: "Real ROI",
                    description: "Imagine 10 new hires each saving 2 hours of manager Q&A. That's 20 hours freed up for strategic work."
                },
                {
                    title: "Scale Effortlessly",
                    description: "No matter how big your team grows, the AI is always ready to guide."
                }
            ]
        },
        {
            id: 'sales',
            icon: <BusinessCenter />,
            title: "Sales & Customer Engagement",
            subtitle: "Close deals faster with instant, 24/7 product insights",
            details: [
                {
                    title: "Accelerate Buyer Decisions",
                    description: "Prospects get immediate answers—no booking demos or waiting on a rep."
                },
                {
                    title: "Build Trust & Credibility",
                    description: "Consistent, accurate responses show you know your stuff, strengthening buyer confidence."
                },
                {
                    title: "Better Conversion Rates",
                    description: "Shorten sales cycles by removing delays. Your team focuses on high-value conversations, not basic Q&A."
                },
                {
                    title: "Always-On Support",
                    description: "Even off-hours, your AI is ready, turning interest into action any time."
                }
            ]
        },
        {
            id: 'education',
            icon: <RocketLaunchIcon />,
            title: "Education & Knowledge Hubs",
            subtitle: "Transform static lessons into interactive, AI-driven tutors",
            details: [
                {
                    title: "Instant Understanding",
                    description: "Learners ask, AI answers. Clarify complex concepts without waiting for office hours."
                },
                {
                    title: "Deepen Engagement",
                    description: "Turn PDFs and slides into active learning experiences that improve comprehension."
                },
                {
                    title: "Cut Down Support Burden",
                    description: "Reduce repetitive student inquiries and free educators to focus on curriculum innovation."
                },
                {
                    title: "Scale Learning",
                    description: "From a handful of students to massive online classes, maintain a high-quality learning experience."
                }
            ]
        }
    ];

    const handleCardClick = (id) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    return (
        <Box sx={{
            pt: { xs: 4, sm: 6, md: 8 },
            pb: { xs: 4, sm: 7, md: 10 },
            px: { xs: 2, sm: 4, md: 6 },
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
                        mb: { xs: 4, sm: 5, md: 6 },
                        textTransform: 'capitalize',
                        textShadow: '0 0 20px rgba(255,255,255,0.3)',
                        letterSpacing: '0.02em',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-12px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '80px',
                            height: '3px',
                            background: 'linear-gradient(90deg, #FFFFFF, #E0E0E0)',
                            borderRadius: '2px',
                            boxShadow: '0 2px 8px rgba(255,255,255,0.2)'
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
                        Brdge AI adapts to your field—boosting efficiency, engagement, and growth wherever you apply it.
                    </Typography>

                    <Grid container spacing={{ xs: 3, md: 4 }}>
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
                                            borderRadius: '16px',
                                            backdropFilter: 'blur(12px)',
                                            backgroundColor: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            position: 'relative',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                boxShadow: '0 15px 40px rgba(0,255,204,0.15)',
                                                borderColor: 'rgba(0,255,204,0.3)',
                                                transform: 'translateY(-5px)'
                                            }
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                mb: 3,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}
                                        >
                                            <Box sx={{
                                                p: 1.5,
                                                backgroundColor: 'rgba(0, 255, 204, 0.1)',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                {React.cloneElement(industry.icon, {
                                                    sx: {
                                                        fontSize: 32,
                                                        color: '#00ffcc',
                                                    }
                                                })}
                                            </Box>
                                            <Box sx={{ flexGrow: 1, textAlign: 'left' }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 600,
                                                        mb: 1,
                                                        color: '#fff'
                                                    }}
                                                >
                                                    {industry.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: 'rgba(255,255,255,0.8)' }}
                                                >
                                                    {industry.subtitle}
                                                </Typography>
                                            </Box>
                                            <Add
                                                sx={{
                                                    fontSize: 28,
                                                    color: '#fff',
                                                    transform: expandedCard === industry.id ? 'rotate(45deg)' : 'none',
                                                    transition: 'transform 0.3s ease-in-out'
                                                }}
                                            />
                                        </Box>

                                        <Collapse in={expandedCard === industry.id}>
                                            <Box sx={{
                                                mt: 2,
                                                pt: 2,
                                                borderTop: '1px solid rgba(255,255,255,0.1)'
                                            }}>
                                                {industry.details.map((detail, idx) => (
                                                    <Box key={idx} sx={{ mb: 2 }}>
                                                        <Typography variant="subtitle1" sx={{
                                                            color: '#00ffcc',
                                                            fontWeight: 600,
                                                            mb: 0.5
                                                        }}>
                                                            {detail.title}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{
                                                            color: 'rgba(255,255,255,0.8)',
                                                            lineHeight: 1.6
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

// Updated FinalCTA for stronger clarity and visuals
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
                        background: 'linear-gradient(90deg, #00ffcc 20%, #00B4DB 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textTransform: 'none',
                        px: { xs: 2, sm: 0 },
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '60%',
                            height: '2px',
                            background: 'linear-gradient(90deg, #00ffcc, #00B4DB)',
                            borderRadius: '2px',
                            opacity: 0.5
                        }
                    }}>
                        Ready To Amplify Your Expertise?
                    </Typography>
                    <Typography variant="h5" sx={{
                        color: 'rgba(255,255,255,0.8)',
                        mb: 6,
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                        fontWeight: 400,
                        lineHeight: 1.6,
                        px: { xs: 2, sm: 0 },
                    }}>
                        Join Brdge AI today. Turn your content into an interactive resource that never sleeps.
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        gap: { xs: 2, md: 3 },
                        justifyContent: 'center',
                        flexWrap: 'wrap',
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
                                Watch Demo
                            </Button>
                        </motion.div>
                    </Box>
                </motion.div>
            </Container>

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
            </Box>
        </ParallaxProvider>
    );
}

export default LandingPage;
