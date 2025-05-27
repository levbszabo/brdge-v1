import React, { useEffect } from 'react';
import { Box, Container, Grid, Paper, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link as RouterLink } from 'react-router-dom';
import DotBridgeTypography from '../components/DotBridgeTypography';
import DotBridgeButton from '../components/DotBridgeButton';
import DotBridgeIcon from '../components/DotBridgeIcon';
import Footer from '../components/Footer';

// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerChildren = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const ContactPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [headerRef, headerInView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    const [contactRef, contactInView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    const [customSolutionsRef, customSolutionsInView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const element = document.getElementById(hash.slice(1));
            if (element) {
                const yOffset = -80;
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    }, []);

    const contactMethods = [
        {
            icon: 'Mail',
            title: 'Email Us',
            value: 'levi@dotbridge.io',
            href: 'mailto:levi@dotbridge.io',
            color: theme.palette.primary.main
        },
        {
            icon: 'Calendar',
            title: 'Schedule a Call',
            value: 'Book a 30-min Demo/Consult',
            href: 'https://calendly.com/levi-dotbridge/30min',
            color: theme.palette.primary.main
        }
    ];

    const solutions = [
        {
            icon: 'MessageSquareText',
            title: "AI-Powered Funnels",
            description: "Build a self-serve demo funnel that engages, qualifies, and converts leads 24/7 — no reps required."
        },
        {
            icon: 'Users',
            title: "Custom AI Agents",
            description: "Deploy AI assistants trained on your product, your tone, and your sales motion."
        },
        {
            icon: 'Rocket',
            title: "Enterprise-Ready Deployments",
            description: "Multi-user access, analytics, permissions, and white-labeled experiences for scaling teams."
        },
        {
            icon: 'Plug',
            title: "Seamless Integrations",
            description: "Sync with your CRM, LMS, or onboarding flow to turn .bridge into your revenue command center."
        }
    ];

    return (
        <>
            <Box
                sx={{
                    minHeight: '100vh',
                    background: theme.palette.mode === 'dark'
                        ? theme.palette.background.default
                        : `linear-gradient(to bottom, ${theme.palette.grey[50]}, ${theme.palette.background.default})`,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Background decoration */}
                {!isMobile && (
                    <>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -200,
                                right: -200,
                                width: 400,
                                height: 400,
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${theme.palette.primary.main}08 0%, transparent 70%)`,
                                filter: 'blur(40px)',
                                pointerEvents: 'none'
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -150,
                                left: -150,
                                width: 300,
                                height: 300,
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${theme.palette.primary.light}08 0%, transparent 70%)`,
                                filter: 'blur(40px)',
                                pointerEvents: 'none'
                            }}
                        />
                    </>
                )}

                <style>{`
                    .calendly-inline-widget {
                        min-width: 320px;
                        height: 700px;
                        border-radius: ${theme.shape.borderRadius * 3}px;
                        overflow: hidden;
                        box-shadow: ${theme.shadows[1]};
                    }
                    
                    @media (max-width: 600px) {
                        .calendly-inline-widget {
                            height: 580px;
                        }
                    }
                `}</style>

                {/* Header Section */}
                <Container
                    maxWidth="md"
                    sx={{
                        textAlign: 'center',
                        pt: { xs: 6, md: 8 },
                        pb: { xs: 4, md: 6 },
                        position: 'relative'
                    }}
                >
                    <Box ref={headerRef}>
                        <motion.div
                            initial="initial"
                            animate={headerInView ? "animate" : "initial"}
                            variants={staggerChildren}
                        >
                            <motion.div variants={fadeInUp}>
                                <DotBridgeTypography
                                    variant="h1"
                                    gradient
                                    sx={{
                                        fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                                        fontWeight: 700,
                                        mb: 3,
                                        letterSpacing: '-0.02em'
                                    }}
                                >
                                    Let's Build Your AI Revenue Engine
                                </DotBridgeTypography>
                            </motion.div>

                            <motion.div variants={fadeInUp}>
                                <DotBridgeTypography
                                    variant="h5"
                                    color="text.secondary"
                                    sx={{
                                        maxWidth: '750px',
                                        mx: 'auto',
                                        lineHeight: 1.6,
                                        fontSize: { xs: '1.1rem', md: '1.25rem' }
                                    }}
                                >
                                    Looking to scale sales with AI? Whether you're exploring autonomous funnels,
                                    interactive demos, or full-funnel automation — we'll help you design a system
                                    that closes deals while you sleep.
                                </DotBridgeTypography>
                            </motion.div>
                        </motion.div>
                    </Box>
                </Container>

                {/* Contact Section */}
                <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 }, position: 'relative' }}>
                    <Grid container spacing={{ xs: 4, md: 6 }} ref={contactRef}>
                        <Grid item xs={12} md={5}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={contactInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6 }}
                                style={{ height: '100%' }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 3, sm: 4 },
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        background: theme.palette.background.paper,
                                        borderRadius: theme.shape.borderRadius * 3,
                                        border: `1px solid ${theme.palette.divider}`,
                                        boxShadow: theme.shadows[2],
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: theme.shadows[4],
                                            borderColor: theme.palette.primary.light
                                        }
                                    }}
                                >
                                    <DotBridgeTypography
                                        variant="h4"
                                        sx={{ fontWeight: 600, mb: 3 }}
                                    >
                                        Talk to a Specialist
                                    </DotBridgeTypography>

                                    <DotBridgeTypography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{ mb: 4, lineHeight: 1.6 }}
                                    >
                                        Want to see a demo, scope a custom solution, or discuss integration with your sales stack?
                                    </DotBridgeTypography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                                        {contactMethods.map((method, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={contactInView ? { opacity: 1, x: 0 } : {}}
                                                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Box sx={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: 2,
                                                        background: `linear-gradient(135deg, ${method.color}15 0%, ${method.color}25 100%)`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: theme.shadows[1],
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: theme.shadows[3],
                                                            background: `linear-gradient(135deg, ${method.color}20 0%, ${method.color}30 100%)`
                                                        }
                                                    }}>
                                                        <DotBridgeIcon name={method.icon} size={22} color={method.color} />
                                                    </Box>
                                                    <Box>
                                                        <DotBridgeTypography
                                                            variant="body2"
                                                            sx={{
                                                                color: 'text.secondary',
                                                                mb: 0.25,
                                                                fontWeight: 500
                                                            }}
                                                        >
                                                            {method.title}
                                                        </DotBridgeTypography>
                                                        <Box
                                                            component="a"
                                                            href={method.href}
                                                            target={method.href.startsWith('http') ? '_blank' : undefined}
                                                            rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                            sx={{
                                                                color: 'text.primary',
                                                                fontWeight: 600,
                                                                textDecoration: 'none',
                                                                transition: 'color 0.2s ease',
                                                                '&:hover': {
                                                                    color: 'primary.main'
                                                                }
                                                            }}
                                                        >
                                                            {method.value}
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </motion.div>
                                        ))}
                                    </Box>

                                    <Box sx={{ mt: 'auto' }}>
                                        <DotBridgeButton
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            component="a"
                                            href="https://calendly.com/levi-dotbridge/30min"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            startIcon={<DotBridgeIcon name="Calendar" size={18} />}
                                            sx={{
                                                py: 1.5,
                                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                boxShadow: '0 8px 24px rgba(0, 102, 255, 0.3)',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 12px 32px rgba(0, 102, 255, 0.4)'
                                                }
                                            }}
                                        >
                                            Schedule Now
                                        </DotBridgeButton>
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12} md={7}>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={contactInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                <Paper
                                    elevation={0}
                                    id="calendar-section"
                                    sx={{
                                        p: { xs: 0, sm: 0.5 },
                                        height: '100%',
                                        overflow: 'hidden',
                                        background: theme.palette.background.paper,
                                        borderRadius: theme.shape.borderRadius * 3,
                                        border: `1px solid ${theme.palette.divider}`,
                                        boxShadow: theme.shadows[2],
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: theme.shadows[4],
                                            borderColor: theme.palette.primary.light
                                        }
                                    }}
                                >
                                    <div className="calendly-inline-widget" style={{ height: '700px' }}>
                                        <iframe
                                            src="https://calendly.com/levi-dotbridge/30min?hide_gdpr_banner=1&background_color=ffffff&text_color=101017&primary_color=007aff"
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            title="Schedule a meeting with Brdge AI"
                                            style={{ border: 'none', borderRadius: `${theme.shape.borderRadius * 3}px` }}
                                        ></iframe>
                                    </div>
                                </Paper>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>

                {/* Custom Solutions Section */}
                <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 }, position: 'relative' }}>
                    <Box
                        ref={customSolutionsRef}
                        sx={{
                            p: { xs: 4, sm: 5, md: 6 },
                            borderRadius: theme.shape.borderRadius * 3,
                            background: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: theme.shadows[1]
                        }}
                    >
                        <motion.div
                            initial="initial"
                            animate={customSolutionsInView ? "animate" : "initial"}
                            variants={staggerChildren}
                        >
                            <motion.div variants={fadeInUp}>
                                <DotBridgeTypography
                                    variant="h2"
                                    align="center"
                                    sx={{ fontWeight: 600, mb: 2 }}
                                >
                                    Custom AI Sales Solutions
                                </DotBridgeTypography>
                            </motion.div>

                            <motion.div variants={fadeInUp}>
                                <DotBridgeTypography
                                    variant="h5"
                                    align="center"
                                    color="text.secondary"
                                    sx={{
                                        maxWidth: '800px',
                                        mx: 'auto',
                                        mb: 6,
                                        lineHeight: 1.6
                                    }}
                                >
                                    Not sure where to start? Let's map out the smartest way to plug AI into your sales engine.
                                    We'll help you launch fast — and scale even faster.
                                </DotBridgeTypography>
                            </motion.div>

                            <Grid container spacing={4}>
                                {solutions.map((item, index) => (
                                    <Grid item xs={12} sm={6} md={3} key={index}>
                                        <motion.div
                                            variants={fadeInUp}
                                            whileHover={{ y: -5 }}
                                            transition={{ duration: 0.2 }}
                                            style={{ height: '100%' }}
                                        >
                                            <Box sx={{
                                                textAlign: 'center',
                                                p: 3,
                                                background: theme.palette.background.default,
                                                borderRadius: theme.shape.borderRadius * 2,
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                border: `1px solid ${theme.palette.divider}`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    borderColor: theme.palette.primary.light,
                                                    boxShadow: theme.shadows[2],
                                                    '& .solution-icon': {
                                                        transform: 'scale(1.1)',
                                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                        color: 'white'
                                                    }
                                                }
                                            }}>
                                                <Box
                                                    className="solution-icon"
                                                    sx={{
                                                        mb: 2.5,
                                                        width: 64,
                                                        height: 64,
                                                        borderRadius: 2,
                                                        background: `${theme.palette.primary.main}10`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    <DotBridgeIcon
                                                        name={item.icon}
                                                        size={28}
                                                        color="primary.main"
                                                    />
                                                </Box>
                                                <DotBridgeTypography
                                                    variant="h6"
                                                    sx={{ fontWeight: 600, mb: 1.5 }}
                                                >
                                                    {item.title}
                                                </DotBridgeTypography>
                                                <DotBridgeTypography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ lineHeight: 1.6 }}
                                                >
                                                    {item.description}
                                                </DotBridgeTypography>
                                            </Box>
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>

                            <motion.div variants={fadeInUp}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                                    <DotBridgeButton
                                        variant="outlined"
                                        size="large"
                                        endIcon={<DotBridgeIcon name="ChevronRight" size={18} />}
                                        onClick={() => {
                                            const calendarSection = document.getElementById('calendar-section');
                                            if (calendarSection) {
                                                calendarSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }
                                        }}
                                        sx={{
                                            px: 4,
                                            py: 1.25,
                                            borderWidth: 2,
                                            fontWeight: 600,
                                            '&:hover': {
                                                borderWidth: 2,
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 6px 16px rgba(0, 122, 255, 0.15)'
                                            }
                                        }}
                                    >
                                        Discuss Sales Solutions
                                    </DotBridgeButton>
                                </Box>
                            </motion.div>
                        </motion.div>
                    </Box>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default ContactPage; 