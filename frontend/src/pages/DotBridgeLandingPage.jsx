import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid, Typography as MuiTypography, Paper, Accordion, AccordionSummary, AccordionDetails, useTheme, useMediaQuery, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import DotBridgeButton from '../components/DotBridgeButton';
import DotBridgeTypography from '../components/DotBridgeTypography';
import DotBridgeCard, { CardContent, CardHeader } from '../components/DotBridgeCard';
import DotBridgeIcon from '../components/DotBridgeIcon';
import Footer from '../components/Footer';

import AgentConnector from '../components/AgentConnector';

const DEMO_BRIDGE_ID = '420';

const Section = ({ children, sx, variant = "default", ...props }) => {
    const theme = useTheme();
    const sectionVariants = {
        default: {},
        light: {
            bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
        },
        dark: {
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
        accent: {
            bgcolor: theme.palette.primary.lighter,
        }
    };

    return (
        <Box
            component="section"
            sx={{
                py: { xs: 10, sm: 12, md: 16 },
                px: { xs: 2, sm: 3, md: 4 },
                position: 'relative',
                ...sectionVariants[variant],
                ...sx
            }}
            {...props}
        >
            <Container maxWidth="lg">
                {children}
            </Container>
        </Box>
    );
};

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.7 } }
};

const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const HeroSection = () => {
    const [logoRef, logoInView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    const theme = useTheme();

    return (
        <Box sx={{
            pt: { xs: 8, md: 10 },
            pb: { xs: 10, md: 16 },
            px: { xs: 2, sm: 3 },
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <Container maxWidth="md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <DotBridgeTypography
                        variant="h1"
                        component="h1"
                        sx={{
                            mb: { xs: 2, sm: 2 },
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' }
                        }}
                    >
                        Turn Sales Videos into Conversations That Convert
                    </DotBridgeTypography>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <DotBridgeTypography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            mb: 6,
                            maxWidth: '700px',
                            mx: 'auto',
                            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                            lineHeight: { xs: 1.5, md: 1.6 }
                        }}
                    >
                        Your sales videos shouldn't just be watched — they should sell. DotBridge turns them into autonomous selling machines that engage, qualify, and close deals for you.
                    </DotBridgeTypography>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2.5, flexWrap: 'wrap', mb: { xs: 6, sm: 8 } }}>
                        <DotBridgeButton
                            size="large"
                            color="primary"
                            variant="contained"
                            component={Link}
                            to="/signup"
                            endIcon={<DotBridgeIcon name="ArrowRight" size={18} />}
                        >
                            Launch Your First Bridge (Free)
                        </DotBridgeButton>
                        <DotBridgeButton
                            size="large"
                            color="primary"
                            variant="outlined"
                            component={Link}
                            to={`https://dotbridge.io/viewBridge/${DEMO_BRIDGE_ID}`}
                            endIcon={<DotBridgeIcon name="Play" size={18} />}
                        >
                            Watch Live Demo
                        </DotBridgeButton>
                    </Box>
                </motion.div>

                <motion.div
                    ref={logoRef}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={logoInView ? {
                        opacity: 1,
                        scale: 1,
                        y: [0, -5, 0],
                        transition: {
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                            y: {
                                repeat: Infinity,
                                repeatType: "mirror",
                                duration: 3,
                                ease: "easeInOut"
                            }
                        }
                    } : {}}
                    style={{ display: 'inline-block', marginBottom: '16px' }}
                >
                    <Box
                        component="img"
                        src="/new-img.png"
                        alt=".bridge logo element"
                        sx={{
                            display: 'block',
                            mx: 'auto',
                            width: 'auto',
                            height: { xs: 60, sm: 100 },
                            mb: 0,
                            bgcolor: 'transparent',
                            p: 0,
                        }}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <DotBridgeTypography
                        variant="overline"
                        color="text.secondary"
                    >
                        The .bridge Format — The Interface for the AI-Native Web
                    </DotBridgeTypography>
                </motion.div>
            </Container>

            {/* Enhanced background elements with subtle animations */}
            <Box
                component={motion.div}
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.03, 1],
                    transition: {
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "mirror"
                    }
                }}
                sx={{
                    position: 'absolute',
                    top: -120,
                    right: -120,
                    width: 350,
                    height: 350,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0,122,255,0.03) 0%, rgba(0,122,255,0) 70%)',
                    zIndex: -1,
                    filter: 'blur(30px)'
                }}
            />
            <Box
                component={motion.div}
                animate={{
                    opacity: [0.3, 0.4, 0.3],
                    scale: [1, 1.02, 1],
                    transition: {
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: 2
                    }
                }}
                sx={{
                    position: 'absolute',
                    bottom: -180,
                    left: -180,
                    width: 450,
                    height: 450,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0,122,255,0.02) 0%, rgba(0,122,255,0) 60%)',
                    zIndex: -1,
                    filter: 'blur(40px)'
                }}
            />
        </Box>
    );
};

const TrustedBySection = () => (
    <Section sx={{
        py: { xs: 4, sm: 6, md: 8 }, // Reduced padding for a tighter feel
        borderTop: '1px solid',
        borderColor: 'divider',
        textAlign: 'center'
    }}>
        <DotBridgeTypography
            variant="overline"
            color="text.secondary"
            sx={{ mb: 4 }}
        >
            Trusted by Leading Creators & Brands
        </DotBridgeTypography>
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 4, sm: 6, md: 8 }, // Generous spacing between logos
            flexWrap: 'wrap'
        }}>
            {/* Display names as plain text */}
            <MuiTypography variant="h6" color="text.secondary">
                Railay Media
            </MuiTypography>
            <MuiTypography variant="h6" color="text.secondary">
                GrowFast
            </MuiTypography>
            {/* Add more names as needed */}
        </Box>
    </Section>
);

const WhyNowSection = () => (
    <Section variant="light" sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        <Box maxWidth="md" mx="auto" textAlign="center">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInUp}
            >
                <DotBridgeTypography variant='h2' component="h2" sx={{
                    mb: 3,
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
                }}>
                    Your Biggest Growth Blocker Isn't Your Product. It's Your Passive Content.
                </DotBridgeTypography>
            </motion.div>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInUp}
            >
                <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                    mb: { xs: 6, md: 8 },
                    maxWidth: '700px',
                    mx: 'auto',
                    fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                    lineHeight: 1.6
                }}>
                    You've built a great offering, but if your videos and demos are just one-way monologues, they're creating a bottleneck that stifles lead flow, burns out your team, and leaves predictable revenue just out of reach.
                </DotBridgeTypography>
            </motion.div>
            <Grid container spacing={4} justifyContent="center">
                <motion.div
                    variants={staggerChildren}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    style={{ width: '100%' }}
                >
                    <Grid container spacing={4} justifyContent="center">
                        {[{ icon: 'UsersRound', text: 'Low Engagement' }, { icon: 'TrendingDown', text: 'Poor Conversion' }, { icon: 'Clock', text: 'Wasted Time' }].map((item, i) => (
                            <Grid item key={i} xs={6} sm={4}>
                                <motion.div variants={fadeInUp}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                                        <DotBridgeIcon name={item.icon} size={40} color="primary.main" />
                                        <DotBridgeTypography variant="body1" >{item.text}</DotBridgeTypography>
                                    </Box>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Grid>
        </Box>
    </Section>
);

const WhatIsBridgeSection = () => {
    const [sectionRef, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    return (
        <Section sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <Grid container spacing={{ xs: 4, sm: 5, md: 10 }} alignItems="center">
                <Grid item xs={12} md={6}>
                    <motion.div
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 0.7,
                                    staggerChildren: 0.2
                                }
                            }
                        }}
                    >
                        <DotBridgeTypography
                            variant='overline'
                            color="primary.main"
                            sx={{
                                mb: 1,
                                display: 'inline-block',
                                position: 'relative',
                                pl: '15px',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: '50%',
                                    width: '10px',
                                    height: '2px',
                                    backgroundColor: 'primary.main',
                                    transform: 'translateY(-50%)'
                                }
                            }}
                        >
                            The Bridge Format
                        </DotBridgeTypography>

                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <DotBridgeTypography variant='h2' component="h2" sx={{
                                mb: 3,
                                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
                            }}>
                                Video That <Box component="span" sx={{ color: 'primary.main' }}>Talks Back</Box>
                            </DotBridgeTypography>
                        </motion.div>

                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <DotBridgeTypography variant="h5" color="text.primary" sx={{
                                mb: 1.5,
                                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                                lineHeight: 1.6
                            }}>
                                You've got the right pitch but your demo can't deliver it alone. DotBridge gives it a voice, a memory, and a mission:
                            </DotBridgeTypography>
                        </motion.div>

                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <DotBridgeTypography
                                variant="h5"
                                component="p"
                                color="text.primary"
                                sx={{
                                    mb: { xs: 2.5, md: 3 },
                                    fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                                    fontWeight: 500,
                                    fontStyle: 'italic',
                                    lineHeight: 1.6,
                                    position: 'relative',
                                    pl: 2,
                                    borderLeft: '3px solid',
                                    borderColor: 'primary.main',
                                }}
                            >
                                To engage every prospect like your best rep, even while you sleep.
                            </DotBridgeTypography>
                        </motion.div>

                        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
                            {[{ icon: 'Bot', title: 'AI That Feels Like You', text: 'Your cloned voice. Your message. Automatically on-brand.' },
                            { icon: 'ListChecks', title: 'Works While You Sleep', text: 'Engage, qualify and close deals 24/7. Letting prospects self-serve.' },
                            { icon: 'BarChart3', title: 'Knows What Works', text: 'See who watched, what they asked, and what made them convert.' }].map((item, i) => (
                                <motion.li
                                    key={i}
                                    variants={{
                                        hidden: { opacity: 0, x: -20 },
                                        visible: {
                                            opacity: 1,
                                            x: 0,
                                            transition: {
                                                delay: 0.3 + (i * 0.15),
                                                duration: 0.5
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 2,
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateX(5px)'
                                        }
                                    }}>
                                        <Box sx={{
                                            width: 36,
                                            height: 36,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '8px',
                                            backgroundColor: 'primary.lighter',
                                            flexShrink: 0
                                        }}>
                                            <DotBridgeIcon name={item.icon} size={20} color="primary.main" />
                                        </Box>
                                        <Box>
                                            <DotBridgeTypography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' }, mb: 0.5 }}>{item.title}</DotBridgeTypography>
                                            <DotBridgeTypography variant="body1" color="text.secondary">{item.text}</DotBridgeTypography>
                                        </Box>
                                    </Box>
                                </motion.li>
                            ))}
                        </Box>
                    </motion.div>
                </Grid>
                <Grid item xs={12} md={6} ref={sectionRef}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        <Box sx={{
                            p: 0,
                            textAlign: 'center',
                            borderRadius: { xs: 0, sm: theme => theme.shape.borderRadius * 1.5 },
                            minHeight: { xs: 'auto', sm: 300 },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: { xs: 'transparent', sm: 'neutral.light' },
                            overflow: 'hidden',
                            mb: { xs: 0, sm: 0 },
                            position: 'relative',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(180deg, rgba(0,122,255,0.03) 0%, rgba(0,0,0,0) 100%)',
                                zIndex: 1
                            }
                        }}>
                            <Box
                                component="img"
                                src="/dotbridge-hero1.jpg"
                                alt="How Bridge Works"
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block',
                                    objectFit: 'cover',
                                    borderRadius: { xs: 0, sm: theme => theme.shape.borderRadius * 1.5 },
                                    p: 0,
                                    m: 0,
                                    transition: 'transform 0.5s ease',
                                    '&:hover': {
                                        transform: 'scale(1.02)'
                                    }
                                }}
                            />
                        </Box>
                    </motion.div>
                </Grid>
            </Grid>
        </Section>
    );
};

const DemoSection = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const videoRef = useRef(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const handlePlayButtonClick = () => {
        if (videoRef.current) {
            videoRef.current.play()
                .then(() => setIsVideoPlaying(true))
                .catch(error => console.error("Error playing video:", error));
        }
    };

    return (
        <Section sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <Box maxWidth="lg" mx="auto" textAlign="center" mb={{ xs: 4, md: 8 }}>
                <DotBridgeTypography variant='h2' component="h2" sx={{
                    mb: { xs: 2, md: 3 },
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
                }}>
                    See Bridge in Action
                </DotBridgeTypography>
                <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                    maxWidth: '750px',
                    mx: 'auto',
                    fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }
                }}>
                    Experience the difference. Interact with a live bridge demo or watch how easy it is to transform your videos.
                </DotBridgeTypography>
            </Box>

            {isMobile ? (
                <Box
                    sx={{
                        maxWidth: '600px',
                        mx: 'auto',
                        position: 'relative',
                        borderRadius: theme.shape.borderRadius,
                        overflow: 'hidden',
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: theme.shadows[1],
                        background: theme.palette.background.paper,
                    }}
                >
                    <Box sx={{ position: 'relative' }}>
                        <video
                            ref={videoRef}
                            src="/dotbridge-hero-small.mp4"
                            controls={isVideoPlaying}
                            playsInline
                            poster="/dotbridge-hero-cover.jpg"
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                            preload="metadata"
                            onPlay={() => setIsVideoPlaying(true)}
                            onEnded={() => setIsVideoPlaying(false)}
                            onPause={() => setIsVideoPlaying(false)}
                        />
                        {!isVideoPlaying && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                whileHover={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                                onClick={handlePlayButtonClick}
                                style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(0,0,0,0.4)', cursor: 'pointer',
                                }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    style={{
                                        width: 80, height: 80, borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.95)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        boxShadow: theme.shadows[2],
                                    }}
                                >
                                    <DotBridgeIcon name="Play" size={40} color="primary.main" style={{ transform: 'translateX(3px)' }} />
                                </motion.div>
                            </motion.div>
                        )}
                    </Box>
                    <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
                        <MuiTypography variant="body2">
                            <Link
                                to={`https://dotbridge.io/viewBridge/${DEMO_BRIDGE_ID}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                                Try Interactive Demo <DotBridgeIcon name="ExternalLink" size={14} />
                            </Link>
                        </MuiTypography>
                    </Box>
                </Box>
            ) : (
                <DotBridgeCard
                    variant="outlined"
                    sx={{
                        maxWidth: { md: '1100px', lg: '1200px' },
                        mx: 'auto',
                        position: 'relative',
                        aspectRatio: '16 / 9',
                        minHeight: '500px',
                        overflow: 'hidden',
                        '& .agent-connector-container': {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                        },
                    }}
                >
                    <div className="agent-connector-container">
                        <AgentConnector
                            brdgeId={DEMO_BRIDGE_ID}
                            agentType="view"
                            token=""
                        />
                    </div>
                </DotBridgeCard>
            )}
            {!isMobile && (
                <DotBridgeTypography variant="body1" color="text.secondary" align="center" sx={{ mt: 4, maxWidth: '600px', mx: 'auto' }}>
                    <strong>Interactive demo:</strong> Ask questions, see dynamic prompts, and experience AI-powered video firsthand.
                </DotBridgeTypography>
            )}
        </Section>
    );
};

const ComparisonSection = () => {
    const comparisons = [
        { useCase: "Product Demos / Sales Presentations", before: "Static videos with no follow-up mechanism", after: "Interactive demos that qualify & capture leads → <strong>3× more SQLs</strong>" },
        { useCase: "Sales Enablement Materials", before: "One-size-fits-all decks & PDFs", after: "Self-adapting content paths based on prospect's role & needs → <strong>32% faster deal cycles</strong>" },
        { useCase: "RFP/Procurement Responses", before: "Lengthy documents requiring sales support", after: "Instant answers to technical/pricing questions → <strong>5× higher response rate</strong>" },
        { useCase: "Customer/Prospect Training", before: "Live webinars with low attendance rates", after: "24/7 on-demand interactive training → <strong>47% reduced support tickets</strong>" }
    ];

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Section sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <Box maxWidth="md" mx="auto" textAlign="center" mb={{ xs: 4, md: 8 }}>
                <DotBridgeTypography variant='h2' component="h2" sx={{
                    mb: { xs: 2, md: 3 },
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
                }}>
                    Transform Your B2B Sales Assets
                </DotBridgeTypography>
                <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                    fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }
                }}>
                    Stop losing momentum between touchpoints. Turn every asset into a revenue-driving conversation.
                </DotBridgeTypography>
            </Box>

            {isMobile ? (
                <Box>
                    {comparisons.map((item, index) => (
                        <DotBridgeCard
                            key={index}
                            sx={{
                                mb: 3,
                                overflow: 'hidden',
                                '&:last-child': { mb: 0 }
                            }}
                        >
                            <Box sx={{
                                p: 2,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'neutral.light'
                            }}>
                                <DotBridgeTypography variant="subtitle1" fontWeight="bold">{item.useCase}</DotBridgeTypography>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                            }}>
                                <Box sx={{
                                    p: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider'
                                }}>
                                    <DotBridgeIcon name="Video" size={16} color="text.secondary" />
                                    <Box>
                                        <DotBridgeTypography variant="caption" color="text.secondary" fontWeight="bold">
                                            Traditional Approach
                                        </DotBridgeTypography>
                                        <DotBridgeTypography variant="body2" color="text.secondary">
                                            {item.before}
                                        </DotBridgeTypography>
                                    </Box>
                                </Box>

                                <Box sx={{
                                    p: 2,
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 1.5,
                                    bgcolor: 'primary.lighter'
                                }}>
                                    <DotBridgeIcon name="Zap" size={16} color="primary.main" style={{ marginTop: '3px' }} />
                                    <Box>
                                        <DotBridgeTypography variant="caption" color="primary.main" fontWeight="bold">
                                            With DotBridge
                                        </DotBridgeTypography>
                                        <DotBridgeTypography
                                            variant="body2"
                                            sx={{ fontWeight: 500 }}
                                            dangerouslySetInnerHTML={{ __html: item.after }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </DotBridgeCard>
                    ))}
                </Box>
            ) : (
                <DotBridgeCard sx={{ overflow: 'hidden', borderRadius: theme => theme.shape.borderRadius }}>
                    <Box sx={{ width: '100%', display: 'table', borderCollapse: 'collapse' }}>
                        {/* Table Header */}
                        <Box sx={{ display: 'table-row', bgcolor: 'neutral.light' }}>
                            <Box sx={{ display: 'table-cell', p: 3, borderBottom: '1px solid', borderColor: 'divider', width: '30%' }}>
                                <DotBridgeTypography variant="subtitle1" fontWeight="bold">Sales Asset</DotBridgeTypography>
                            </Box>
                            <Box sx={{ display: 'table-cell', p: 3, borderBottom: '1px solid', borderColor: 'divider', width: '35%' }}>
                                <DotBridgeTypography variant="subtitle1" fontWeight="bold" color="text.secondary">
                                    <DotBridgeIcon name="Video" size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                                    Traditional Approach
                                </DotBridgeTypography>
                            </Box>
                            <Box sx={{ display: 'table-cell', p: 3, borderBottom: '1px solid', borderColor: 'divider', width: '35%' }}>
                                <DotBridgeTypography variant="subtitle1" fontWeight="bold" color="primary.main">
                                    <DotBridgeIcon name="Zap" size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                                    With DotBridge
                                </DotBridgeTypography>
                            </Box>
                        </Box>

                        {/* Table Rows */}
                        {comparisons.map((item, index) => (
                            <Box sx={{ display: 'table-row' }} key={index}>
                                <Box sx={{
                                    display: 'table-cell',
                                    p: 3,
                                    borderBottom: index < comparisons.length - 1 ? '1px solid' : 'none',
                                    borderColor: 'divider',
                                    verticalAlign: 'middle'
                                }}>
                                    <DotBridgeTypography variant="h6">{item.useCase}</DotBridgeTypography>
                                </Box>
                                <Box sx={{
                                    display: 'table-cell',
                                    p: 3,
                                    borderBottom: index < comparisons.length - 1 ? '1px solid' : 'none',
                                    borderColor: 'divider',
                                    bgcolor: 'background.paper',
                                    verticalAlign: 'middle'
                                }}>
                                    <DotBridgeTypography variant="body1" color="text.secondary">{item.before}</DotBridgeTypography>
                                </Box>
                                <Box sx={{
                                    display: 'table-cell',
                                    p: 3,
                                    borderBottom: index < comparisons.length - 1 ? '1px solid' : 'none',
                                    borderColor: 'divider',
                                    bgcolor: 'primary.lighter',
                                    verticalAlign: 'middle'
                                }}>
                                    <DotBridgeTypography
                                        variant="body1"
                                        sx={{ fontWeight: 500 }}
                                        dangerouslySetInnerHTML={{ __html: item.after }}
                                    />
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </DotBridgeCard>
            )}
        </Section>
    );
};

const SectionDivider = ({ variant = "light" }) => {
    const theme = useTheme();

    const styles = {
        light: {
            bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
        },
        accent: {
            bgcolor: theme.palette.primary.lighter,
        },
        none: {
            display: 'none'
        }
    };

    return (
        <Box
            sx={{
                py: 0,
                ...styles[variant]
            }}
        >
            <Container maxWidth="lg">
                <Divider sx={{ borderColor: theme.palette.divider }} />
            </Container>
        </Box>
    );
};

const FAQSection = () => {
    const [expanded, setExpanded] = useState(false);
    const theme = useTheme();

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const faqs = [
        {
            q: "How does DotBridge help my sales team close more deals?",
            a: "DotBridge turns your passive sales videos (demos, VSLs, webinars) into interactive AI agents. These \"Bridges\" can qualify leads 24/7, answer prospect questions instantly, deliver personalized demo content based on their needs, and guide them through the sales process—freeing up your sales team to focus on highly qualified, bottom-of-funnel opportunities.",
            id: "panel1"
        },
        {
            q: "Can DotBridge integrate with our existing CRM or sales tools?",
            a: "Yes, our Premium plan offers CRM and webhook integrations, allowing you to seamlessly feed lead data, engagement metrics, and conversation insights from DotBridge into your existing sales and marketing ecosystem.",
            id: "panel2"
        },
        {
            q: "Is DotBridge suitable for our entire sales team, and can we manage content collaboratively?",
            a: "DotBridge is designed for ease of use, allowing any team member to create and deploy AI-powered Bridges without technical skills. While direct multi-user collaborative editing on a single Bridge isn\'t explicitly detailed, \"Flows\" allow for organizing multiple Bridges, and different team members can manage different Bridges or Flows based on your internal processes. For specific enterprise team management needs, we recommend discussing a custom solution.",
            id: "panel3"
        },
        {
            q: "How secure is our sales content and the data collected through DotBridge?",
            a: "We prioritize security. We use enterprise-grade encryption and security practices. Your sales content, prospect interaction data, and any voice models remain private and are used solely to power your Bridges and provide you with analytics.",
            id: "panel4"
        },
        {
            q: "Can we customize the Bridge player to match our company branding?",
            a: "Yes, our Premium plan offers customization options for player colors and branding, ensuring a consistent and professional experience that aligns with your company\'s visual identity.",
            id: "panel5"
        },
        {
            q: "What kind of sales content works best with DotBridge?",
            a: "DotBridge is versatile. You can use it to supercharge existing MP4 videos like product demos, VSLs, recorded webinars, or even explainer videos. You can also supplement the AI\'s knowledge with PDF documents (e.g., sales decks, product sheets) to ensure comprehensive and accurate responses.",
            id: "panel6"
        },
        {
            q: "How can we measure the ROI of using DotBridge?",
            a: "DotBridge provides analytics on viewer engagement, questions asked, and conversion points within your interactive content. Our Premium plan offers advanced analytics, and with CRM integration, you can directly track how DotBridge interactions contribute to lead generation, qualification, and closed deals, giving you clear insight into its impact on your sales pipeline.",
            id: "panel7"
        },
        {
            q: "What are \"AI Minutes\" and how many do we need?",
            a: "AI Minutes are consumed when the AI interacts with a prospect—answering questions or guiding them through content. The number of minutes you\'ll need depends on the volume of traffic to your Bridges and the average interaction length. Our plans offer different tiers of AI Minutes, and you can monitor usage in your dashboard. For high-volume needs, we can discuss custom plans.",
            id: "panel8"
        }
    ];

    return (
        <Section>
            <Box maxWidth="md" mx="auto">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                >
                    <DotBridgeTypography variant='h2' component="h2" sx={{
                        mb: { xs: 6, md: 8 },
                        textAlign: 'center',
                        fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
                    }}>
                        Frequently Asked Questions
                    </DotBridgeTypography>
                </motion.div>

                <motion.div
                    variants={staggerChildren}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {faqs.map((faq, index) => (
                        <motion.div key={faq.id} variants={fadeInUp} custom={index}>
                            <Accordion
                                expanded={expanded === faq.id}
                                onChange={handleChange(faq.id)}
                                sx={{
                                    mb: 1.5,
                                    boxShadow: expanded === faq.id ? theme.shadows[1] : 'none',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: expanded === faq.id ? '' : theme.palette.grey[50]
                                    }
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<DotBridgeIcon name={expanded === faq.id ? "Minus" : "Plus"} size={20} color="primary.main" />}
                                    aria-controls={`${faq.id}-content`}
                                    id={`${faq.id}-header`}
                                    sx={{
                                        py: { xs: 1.5, md: 2 },
                                        px: { xs: 2, md: 3 },
                                    }}
                                >
                                    <DotBridgeTypography
                                        variant="h6"
                                        sx={{
                                            fontSize: { xs: '1rem', md: '1.25rem' },
                                            fontWeight: expanded === faq.id ? 600 : 500,
                                            color: expanded === faq.id ? 'primary.main' : 'text.primary',
                                            transition: 'color 0.2s ease, font-weight 0.2s ease'
                                        }}
                                    >
                                        {faq.q}
                                    </DotBridgeTypography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ py: { xs: 2, md: 2.5 }, px: { xs: 2, md: 3 } }}>
                                    <DotBridgeTypography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                        {faq.a}
                                    </DotBridgeTypography>
                                </AccordionDetails>
                            </Accordion>
                        </motion.div>
                    ))}
                </motion.div>
            </Box>
        </Section>
    );
}

const UseCasesSection = () => {
    const theme = useTheme();

    const landingPageJourneySteps = [
        {
            icon: 'Eye',
            title: '1. Spark Interest 24/7',
            subtitle: 'Your content grabs attention and answers initial questions, day or night, turning passive views into active prospects.',
        },
        {
            icon: 'SearchCheck',
            title: '2. Qualify Leads Automatically',
            subtitle: 'Ditch forms. Your Bridge has intelligent conversations that pinpoint real needs, so your team only talks to hot leads.',
        },
        {
            icon: 'Presentation',
            title: '3. Deliver Perfect Demos, Scaled',
            subtitle: 'Showcase your product\'s value with personalized walkthroughs, tailored to each prospect\'s specific interests, anytime.',
        },
        {
            icon: 'Target',
            title: '4. Overcome Objections & Close',
            subtitle: 'Your Bridge handles common objections, clarifies pricing, and guides prospects toward a confident buying decision.',
        },
        {
            icon: 'Rocket',
            title: '5. Secure the Win & Ensure Stickiness',
            subtitle: 'Finalize details, confirm next steps, and ensure a smooth transition for new clients, maximizing retention from day one.',
        },
    ];

    return (
        <Section sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <Box maxWidth="lg" mx="auto" textAlign="center" mb={{ xs: 6, md: 10 }}>
                <DotBridgeTypography variant='h2' component="h2" sx={{
                    mb: { xs: 2, md: 3 },
                    fontSize: { xs: '1.85rem', sm: '2.35rem', md: '2.75rem' }
                }}>
                    Turn Clicks into Customers with DotBridge
                </DotBridgeTypography>
                <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                    maxWidth: '800px',
                    mx: 'auto',
                    fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }
                }}>
                    Stop losing leads to passive videos. Create an interactive journey that captures, qualifies, and converts — even while you sleep.
                </DotBridgeTypography>
            </Box>

            <Grid container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">
                {/* Left Column: Visual Journey Steps */}
                <Grid item xs={12} md={5}>
                    <Box sx={{ position: 'relative' }}>
                        {landingPageJourneySteps.map((step, index) => (
                            <Box key={step.title} sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                mb: index === landingPageJourneySteps.length - 1 ? 0 : { xs: 3.5, md: 4 },
                                position: 'relative',
                            }}>
                                <DotBridgeIcon
                                    name={step.icon}
                                    size={36}
                                    color="primary.main"
                                    sx={{ mr: 2.5, mt: 0.5, flexShrink: 0 }}
                                />
                                <Box>
                                    <DotBridgeTypography variant="h6" sx={{ mb: 0.5, fontSize: { xs: '1.1rem', md: '1.2rem' } }}>
                                        {step.title}
                                    </DotBridgeTypography>
                                    <DotBridgeTypography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', md: '0.95rem' }, lineHeight: 1.6 }}>
                                        {step.subtitle}
                                    </DotBridgeTypography>
                                </Box>
                                {/* Simple Vertical Connector Line */}
                                {index < landingPageJourneySteps.length - 1 && (
                                    <Box sx={{
                                        position: 'absolute',
                                        left: '18px', // Align with center of icon (36px / 2)
                                        top: '48px', // Start below icon and some text
                                        bottom: { xs: '-28px', md: '-32px' }, // Extend to next item's top margin area
                                        width: '2px',
                                        bgcolor: 'primary.light',
                                        zIndex: -1,
                                    }} />
                                )}
                            </Box>
                        ))}
                    </Box>
                </Grid>

                {/* Right Column: Persuasive Text */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={0} sx={{
                        p: { xs: 2.5, sm: 3, md: 4 },
                        bgcolor: { xs: 'transparent', md: 'neutral.light' },
                        border: { xs: 'none', md: `1px solid ${theme.palette.divider}` },
                        borderRadius: { xs: 0, md: theme.shape.borderRadius },
                        mt: { xs: 3, md: 0 }
                    }}>
                        <DotBridgeTypography variant="h4" component="h3" sx={{
                            mb: 2,
                            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                            color: 'primary.dark'
                        }}>
                            Your Sales Team's New Superpower
                        </DotBridgeTypography>
                        <DotBridgeTypography variant="body1" color="text.primary" sx={{ mb: 2, lineHeight: 1.7 }}>
                            You've built a winning product. But your sales videos? They're just talking <em>at</em> people. Imagine if they could talk <em>with</em> them – qualifying, demoing, and closing, just like your best rep.
                        </DotBridgeTypography>
                        <DotBridgeTypography variant="body1" color="text.primary" sx={{ mb: 2, lineHeight: 1.7 }}>
                            Picture this: A prospect interacts with your DotBridge. It's not a passive watch; it's an engaging conversation.
                            Questions are answered instantly. Needs are understood deeply. Personalized demos are delivered on the spot.
                            Your sales team steps in only when prospects are educated, qualified, and ready to talk terms.
                        </DotBridgeTypography>
                        <DotBridgeTypography variant="body1" color="text.primary" sx={{ mb: 3, lineHeight: 1.7 }}>
                            This is how you stop chasing cold leads and start closing warm deals. It's how you give your team leverage, multiply their impact, and build a predictable revenue engine that never sleeps.
                        </DotBridgeTypography>
                        <DotBridgeTypography variant="h6" sx={{ color: 'text.primary', fontSize: { xs: '1.1rem', md: '1.2rem' }, mb: 3, fontWeight: 'bold' }}>
                            Ready to turn your content into your top-performing sales channel?
                        </DotBridgeTypography>
                        <DotBridgeButton
                            variant="contained"
                            color="primary"
                            size="large"
                            component={Link}
                            to="/signup"
                            endIcon={<DotBridgeIcon name="ArrowRight" />}
                        >
                            Create Your First Bridge Free
                        </DotBridgeButton>
                    </Paper>
                </Grid>
            </Grid>
        </Section>
    );
};

const HowItWorksSection = () => {
    const steps = [
        { icon: "UploadCloud", title: "Upload", text: "Any MP4, Loom, Zoom or slide deck." },
        { icon: "UserCog", title: "Define Persona", text: "Set AI tone, expertise & goals in 60 sec." },
        { icon: "MicVocal", title: "Clone Voice (Optional)", text: "Add your authentic voice for AI answers." },
        { icon: "Send", title: "Publish & Track", text: "Get a shareable link/embed & watch analytics." }
    ];
    return (
        <Section sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <Box maxWidth="md" mx="auto" textAlign="center" mb={{ xs: 4, md: 8 }}>
                <DotBridgeTypography variant='h2' component="h2" sx={{
                    mb: { xs: 2, md: 3 },
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
                }}>
                    Launch Your First Bridge in Minutes
                </DotBridgeTypography>
                <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                    fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }
                }}>
                    No code required. Just upload, configure, and publish.
                </DotBridgeTypography>
            </Box>
            <Grid container spacing={{ xs: 3, sm: 4, md: 5 }} justifyContent="center">
                {steps.map((step, index) => (
                    <Grid item xs={6} sm={6} md={3} key={index} sx={{ textAlign: 'center' }}>
                        <Box sx={{
                            display: 'inline-flex',
                            p: { xs: 1.5, md: 2.5 },
                            borderRadius: '50%',
                            bgcolor: 'neutral.light',
                            mb: { xs: 2, md: 3 }
                        }}>
                            <DotBridgeIcon name={step.icon} size={36} color="primary.main" />
                        </Box>
                        <DotBridgeTypography variant="h6" sx={{
                            mb: { xs: 1, md: 1.5 },
                            fontSize: { xs: '1rem', md: '1.25rem' }
                        }}>{index + 1}. {step.title}</DotBridgeTypography>
                        <DotBridgeTypography variant="body1" color="text.secondary">{step.text}</DotBridgeTypography>
                    </Grid>
                ))}
            </Grid>
            <Box textAlign="center" mt={{ xs: 4, md: 7 }}>
                <DotBridgeTypography variant="subtitle1" color="text.primary">
                    Total setup time: <Box component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>under 10 minutes.</Box>
                </DotBridgeTypography>
            </Box>
        </Section>
    );
};

const ProofSection = () => {
    const metrics = [
        { value: "+42%", label: "Lead-to-SQL Conversion", sub: "(Enterprise SaaS)" },
        { value: "-38%", label: "Sales Cycle Duration", sub: "(Average Reduction)" },
        { value: "4.7x", label: "Pipeline Generated", sub: "(Per Sales Rep)" },
        { value: "$2.6M", label: "ARR Influenced", sub: "(Early Customers)" }
    ];
    return (
        <Section sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <Box maxWidth="md" mx="auto" textAlign="center" mb={{ xs: 4, md: 8 }}>
                <DotBridgeTypography variant='h2' component="h2" sx={{
                    mb: { xs: 2, md: 3 },
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
                }}>
                    Enterprise-Grade Results
                </DotBridgeTypography>
                <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                    fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }
                }}>
                    How B2B companies are transforming their sales pipeline with DotBridge
                </DotBridgeTypography>
            </Box>
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
                {metrics.map((metric, index) => (
                    <Grid item xs={6} sm={6} md={3} key={index}>
                        <DotBridgeCard variant="outlined" sx={{
                            height: '100%',
                            textAlign: 'center',
                            p: { xs: 2, sm: 3, md: 4 },
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                            }
                        }}>
                            <DotBridgeTypography variant="h3" color="primary.main" sx={{
                                mb: 1,
                                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
                                fontWeight: 700
                            }}>
                                {metric.value}
                            </DotBridgeTypography>
                            <DotBridgeTypography variant="h6" sx={{
                                mb: 0.5,
                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
                            }}>{metric.label}</DotBridgeTypography>
                            <DotBridgeTypography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>{metric.sub}</DotBridgeTypography>
                        </DotBridgeCard>
                    </Grid>
                ))}
            </Grid>
            <Box textAlign="center" mt={{ xs: 4, md: 6 }}>
                <DotBridgeTypography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    "DotBridge has completely changed how we engage with enterprise prospects."
                </DotBridgeTypography>
                <DotBridgeTypography variant="body2" color="text.secondary">
                    — VP of Sales, Leading Enterprise SaaS Platform
                </DotBridgeTypography>
            </Box>
        </Section>
    );
};

const PricingSection = () => (
    <Section sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        <Box maxWidth="md" mx="auto" textAlign="center" mb={{ xs: 4, md: 8 }}>
            <DotBridgeTypography variant='h2' component="h2" sx={{
                mb: { xs: 2, md: 3 },
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
            }}>
                Simple Pricing for Growth
            </DotBridgeTypography>
        </Box>
        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center" alignItems="stretch">
            <Grid item xs={12} sm={6} md={4}>
                <DotBridgeCard sx={{
                    p: { xs: 3, md: 4 },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: (theme) => theme.shadows[2]
                    }
                }}>
                    <DotBridgeTypography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>Free</DotBridgeTypography>
                    <DotBridgeTypography variant="h2" sx={{
                        my: 1,
                        fontSize: { xs: '2rem', md: '2.5rem' }
                    }}>$0</DotBridgeTypography>
                    <DotBridgeTypography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Forever</DotBridgeTypography>
                    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4, flexGrow: 1 }}>
                        {[
                            "1 Bridge Link",
                            "30 AI Minutes/mo",
                            "Voice Clone",
                            "Basic Analytics",
                            "1 Flow Limit",
                            "Watermark"
                        ].map(feature => (
                            <Box component="li" key={feature} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <DotBridgeIcon name="Check" size={18} color="primary.main" />
                                <DotBridgeTypography variant="body1" component="span">{feature}</DotBridgeTypography>
                            </Box>
                        ))}
                    </Box>
                    <DotBridgeButton fullWidth variant="outlined" color="primary" component={Link} to="/signup">
                        Start Free
                    </DotBridgeButton>
                </DotBridgeCard>
            </Grid>

            <Grid item xs={12} sm={8} md={4}>
                <DotBridgeCard sx={{
                    p: 4,
                    height: '100%',
                    border: '2px solid',
                    borderColor: 'primary.main',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    transform: { md: 'scale(1.05)' },
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: { md: 'scale(1.05) translateY(-3px)' },
                        boxShadow: (theme) => theme.shadows[3]
                    }
                }}>
                    <Box sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'primary.main', color: 'primary.contrastText', px: 1.5, py: 0.3, borderRadius: '99px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                        Most Popular
                    </Box>
                    <DotBridgeTypography variant="h4">Standard</DotBridgeTypography>
                    <DotBridgeTypography variant="h2" sx={{ my: 1 }}>$49</DotBridgeTypography>
                    <DotBridgeTypography variant="body2" color="text.secondary" sx={{ mb: 3 }}>per month</DotBridgeTypography>
                    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4, flexGrow: 1 }}>
                        {[
                            "10 bridge Links",
                            "300 AI Minutes/mo",
                            "Voice Clone",
                            "Basic Analytics",
                            "1 Flow Limit",
                            "Watermark"
                        ].map(feature => (
                            <Box component="li" key={feature} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <DotBridgeIcon name="Check" size={18} color="primary.main" />
                                <DotBridgeTypography variant="body1" component="span">{feature}</DotBridgeTypography>
                            </Box>
                        ))}
                    </Box>
                    <DotBridgeButton fullWidth variant="contained" color="primary" component={Link} to="/signup?plan=standard">
                        Choose Standard
                    </DotBridgeButton>
                </DotBridgeCard>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
                <DotBridgeCard sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': { transform: 'translateY(-3px)', boxShadow: (theme) => theme.shadows[2] }
                }}>
                    <DotBridgeTypography variant="h4">Premium</DotBridgeTypography>
                    <DotBridgeTypography variant="h2" sx={{ my: 1 }}>$149</DotBridgeTypography>
                    <DotBridgeTypography variant="body2" color="text.secondary" sx={{ mb: 3 }}>per month</DotBridgeTypography>
                    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4, flexGrow: 1 }}>
                        {[
                            "100 Bridge Links",
                            "1000 AI Minutes/mo",
                            "100 Flows",
                            "Voice Clone",
                            "CRM / Webhooks",
                            "Adv. Analytics",
                            "No Watermark"
                        ].map(feature => (
                            <Box component="li" key={feature} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <DotBridgeIcon name="Check" size={18} color="primary.main" />
                                <DotBridgeTypography variant="body1" component="span">{feature}</DotBridgeTypography>
                            </Box>
                        ))}
                    </Box>
                    <DotBridgeButton fullWidth variant="outlined" color="primary" component={Link} to="/signup?plan=premium">
                        Choose Premium
                    </DotBridgeButton>
                </DotBridgeCard>
            </Grid>
        </Grid>
        <Box textAlign="center" mt={6}>
            <MuiTypography variant="body1">
                <Link
                    to="/pricing"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                    See Full Pricing Details <DotBridgeIcon name="ArrowRight" size={16} />
                </Link>
            </MuiTypography>
        </Box>
    </Section>
);

const FinalCTASection = () => (
    <Section sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <DotBridgeTypography variant='h2' component="h2" sx={{
                mb: { xs: 2, md: 3 },
                color: 'inherit',
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
            }}>
                Ready to Turn Video Into Revenue?
            </DotBridgeTypography>
            <DotBridgeTypography variant="h5" sx={{
                mb: { xs: 4, md: 5 },
                maxWidth: '700px',
                mx: 'auto',
                color: 'primary.contrastText',
                opacity: 0.85,
                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }
            }}>
                Launch your first bridge today and watch leads, sales and student success climb – while you sleep.
            </DotBridgeTypography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2.5, flexWrap: 'wrap' }}>
                <DotBridgeButton
                    size="large"
                    sx={{
                        bgcolor: 'common.white',
                        color: 'primary.main',
                        '&:hover': {
                            bgcolor: 'neutral.light',
                        }
                    }}
                    variant="contained"
                    component={Link}
                    to="/signup"
                >
                    Start Free Now
                </DotBridgeButton>
                <DotBridgeButton
                    size="large"
                    variant="outlined"
                    onClick={() => console.log('See It Live Clicked')}
                    sx={{
                        color: 'common.white',
                        borderColor: 'rgba(255,255,255,0.6)',
                        '&:hover': {
                            borderColor: 'common.white',
                            bgcolor: 'rgba(255,255,255,0.1)'
                        }
                    }}
                >
                    See It Live
                </DotBridgeButton>
            </Box>
        </Container>
    </Section>
);

function DotBridgeLandingPage() {
    const theme = useTheme();
    const { scrollY } = useScroll();

    return (
        <Box sx={{ backgroundColor: theme.palette.background.default }}>
            <HeroSection />

            <WhyNowSection />

            <WhatIsBridgeSection />

            <Section variant="light">
                <DemoSection />
            </Section>

            <ComparisonSection />

            <Section variant="light">
                <UseCasesSection />
            </Section>

            <HowItWorksSection />

            <PricingSection />

            <Section variant="light">
                <FAQSection />
            </Section>

            <FinalCTASection />

            <Footer />
        </Box>
    );
}

export default DotBridgeLandingPage;