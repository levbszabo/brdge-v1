import React, { useEffect } from 'react';
import { Box, Container, Typography, Button, Grid, Paper, Divider, TextField, useTheme } from '@mui/material';
import { Mail, Calendar, MessageSquare, Users, ThumbsUp, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import Footer from '../components/Footer';

const ContactPage = () => {
    const theme = useTheme();
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

    const PrimaryText = ({ children }) => (
        <Box component="span" sx={{ color: 'primary.main', fontWeight: 'inherit' }}>
            {children}
        </Box>
    );

    return (
        <>
            <Box
                sx={{
                    bgcolor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    minHeight: 'calc(100vh - 64px)',
                    py: { xs: 4, md: 6 },
                    pt: { xs: 1, md: 2 }
                }}
            >
                <style>{`
                    .calendly-inline-widget {
                        min-width: 320px;
                        height: 700px;
                        border-radius: ${theme.shape.borderRadius}px;
                        overflow: hidden;
                        box-shadow: ${theme.shadows[1]};
                    }
                    
                    @media (max-width: 600px) {
                        .calendly-inline-widget {
                            height: 580px;
                        }
                    }
                `}</style>

                <Container
                    maxWidth="md"
                    sx={{
                        textAlign: 'center',
                        mb: { xs: 4, md: 6 },
                        pt: { xs: 0, md: 1 }
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <Typography
                            variant="h2"
                            component="h1"
                            sx={{
                                mb: 2,
                                color: 'text.primary',
                                fontSize: { xs: '2rem', sm: '2.3rem', md: '2.6rem' }
                            }}
                        >
                            Let's Build Your AI Revenue Engine
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{ color: 'text.secondary', maxWidth: '750px', mx: 'auto' }}
                        >
                            Looking to scale sales with AI? Whether you're exploring autonomous funnels, interactive demos, or full-funnel automation — we'll help you design a system that closes deals while you sleep.
                        </Typography>
                    </motion.div>
                </Container>

                <Container maxWidth="lg" sx={{ mb: { xs: 8, md: 12 } }}>
                    <Grid container spacing={{ xs: 4, md: 6 }}>
                        <Grid item xs={12} md={5} ref={contactRef}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={contactInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6 }}
                                style={{ height: '100%' }}
                            >
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: { xs: 3, sm: 4 },
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        bgcolor: 'background.paper',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                        borderRadius: '16px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)'
                                        }
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}
                                    >
                                        Talk to a Specialist
                                    </Typography>

                                    <Box sx={{ mb: 3 }}>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: 'text.secondary', lineHeight: 1.6 }}
                                        >
                                            Want to see a demo, scope a custom solution, or discuss integration with your sales stack?
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '12px',
                                                background: `${theme.palette.primary.main}20`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'primary.main',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
                                                    background: `${theme.palette.primary.main}30`,
                                                }
                                            }}>
                                                <Mail size={22} />
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.25, fontWeight: 500 }}>
                                                    Email Us
                                                </Typography>
                                                <Link href="mailto:levi@dotbridge.io" sx={{ color: 'text.primary', fontWeight: 600, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                                                    levi@dotbridge.io
                                                </Link>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '12px',
                                                background: `${theme.palette.primary.main}20`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'primary.main',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
                                                    background: `${theme.palette.primary.main}30`,
                                                }
                                            }}>
                                                <Calendar size={22} />
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.25, fontWeight: 500 }}>
                                                    Schedule a Call
                                                </Typography>
                                                <Link href="https://calendly.com/levi-dotbridge/30min" target="_blank" rel="noopener noreferrer" sx={{ color: 'text.primary', fontWeight: 600, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                                                    Book a 30-min Demo/Consult
                                                </Link>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box sx={{ mt: 'auto' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            fullWidth
                                            component="a"
                                            href="https://calendly.com/levi-dotbridge/30min"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            startIcon={<Calendar size={18} />}
                                            sx={{
                                                py: 1.5,
                                                borderRadius: '10px',
                                                fontWeight: 600,
                                                boxShadow: theme.shadows[3],
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: theme.shadows[6]
                                                }
                                            }}
                                        >
                                            Schedule Now
                                        </Button>
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
                                    variant="outlined"
                                    id="calendar-section"
                                    sx={{
                                        p: { xs: 0, sm: 0.5 },
                                        height: '100%',
                                        overflow: 'hidden',
                                        bgcolor: 'background.paper',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                        borderRadius: '16px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)'
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
                                            style={{ border: 'none', borderRadius: `${theme.shape.borderRadius}px` }}
                                        ></iframe>
                                    </div>
                                </Paper>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>

                <Container maxWidth="lg" sx={{ mb: { xs: 8, md: 12 } }}>
                    <Box
                        ref={customSolutionsRef}
                        sx={{
                            mt: { xs: 6, md: 10 },
                            p: { xs: 3, sm: 4, md: 5 },
                            borderRadius: theme.shape.borderRadius,
                            bgcolor: 'neutral.light',
                            border: `1px solid ${theme.palette.divider}`
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={customSolutionsInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7 }}
                        >
                            <Typography
                                variant="h2"
                                align="center"
                                sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}
                            >
                                Custom AI Sales Solutions
                            </Typography>

                            <Typography
                                variant="h5"
                                align="center"
                                sx={{ color: 'text.secondary', maxWidth: '800px', mx: 'auto', mb: 6 }}
                            >
                                Not sure where to start? Let's map out the smartest way to plug AI into your sales engine. We'll help you launch fast — and scale even faster.
                            </Typography>

                            <Grid container spacing={4}>
                                {[
                                    {
                                        icon: <MessageSquare size={28} />,
                                        title: "AI-Powered Funnels",
                                        description: "Build a self-serve demo funnel that engages, qualifies, and converts leads 24/7 — no reps required."
                                    },
                                    {
                                        icon: <Users size={28} />,
                                        title: "Custom AI Agents",
                                        description: "Deploy AI assistants trained on your product, your tone, and your sales motion."
                                    },
                                    {
                                        icon: <ThumbsUp size={28} />,
                                        title: "Enterprise-Ready Deployments",
                                        description: "Multi-user access, analytics, permissions, and white-labeled experiences for scaling teams."
                                    },
                                    {
                                        icon: <Calendar size={28} />,
                                        title: "Seamless Integrations",
                                        description: "Sync with your CRM, LMS, or onboarding flow to turn .bridge into your revenue command center."
                                    }
                                ].map((item, index) => (
                                    <Grid item xs={12} sm={6} md={3} key={index}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={customSolutionsInView ? { opacity: 1, y: 0 } : {}}
                                            transition={{ duration: 0.5, delay: 0.1 + (index * 0.1) }}
                                            style={{ height: '100%' }}
                                            whileHover={{ y: -5 }}
                                        >
                                            <Box sx={{
                                                textAlign: 'center',
                                                p: 3,
                                                backgroundColor: 'background.paper',
                                                borderRadius: '16px',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                                                border: `1px solid ${theme.palette.divider}`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                                                    borderColor: theme.palette.primary.light
                                                }
                                            }}>
                                                <Box sx={{
                                                    color: 'primary.main',
                                                    mb: 2.5,
                                                    width: 64,
                                                    height: 64,
                                                    borderRadius: '16px',
                                                    backgroundColor: `${theme.palette.primary.main}15`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)'
                                                }}>
                                                    {item.icon}
                                                </Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
                                                    {item.title}
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                                    {item.description}
                                                </Typography>
                                            </Box>
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>

                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="large"
                                    component="button"
                                    sx={{
                                        px: 4,
                                        py: 1.25,
                                        borderRadius: '10px',
                                        borderWidth: '2px',
                                        fontWeight: 600,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderWidth: '2px',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 16px rgba(0, 122, 255, 0.15)'
                                        }
                                    }}
                                    endIcon={<ChevronRight size={18} />}
                                    onClick={() => {
                                        const calendarSection = document.getElementById('calendar-section');
                                        if (calendarSection) {
                                            calendarSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                    }}
                                >
                                    Discuss Sales Solutions
                                </Button>
                            </Box>
                        </motion.div>
                    </Box>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default ContactPage; 