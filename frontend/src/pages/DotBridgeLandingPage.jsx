import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid, Typography as MuiTypography, Paper, Accordion, AccordionSummary, AccordionDetails, useTheme, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import DotBridgeButton from '../components/DotBridgeButton';
import DotBridgeTypography from '../components/DotBridgeTypography';
import DotBridgeCard, { CardContent, CardHeader } from '../components/DotBridgeCard';
import DotBridgeIcon from '../components/DotBridgeIcon';

import AgentConnector from '../components/AgentConnector';

const DEMO_BRIDGE_ID = '420';

const Section = ({ children, sx, ...props }) => (
    <Box component="section" sx={{ py: { xs: 8, sm: 10, md: 16 }, px: { xs: 2, sm: 3, md: 4 }, ...sx }} {...props}>
        <Container maxWidth="lg">
            {children}
        </Container>
    </Box>
);

const HeroSection = () => (
    <Box sx={{
        pt: { xs: 6, md: 8 },
        pb: { xs: 8, md: 16 },
        px: { xs: 2, sm: 3 },
        textAlign: 'center'
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
                    Turn Any Video Into an AI That Sells, Teaches, and Closes
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
                    Static videos can't convert. DotBridge wraps them in a smart interface that talks back, qualifies leads, and drives action — all while learning from every click.
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
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 20,
                    delay: 0.4
                }}
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
                        p: 0
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
    </Box>
);

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
    <Section sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        <Box maxWidth="md" mx="auto" textAlign="center">
            <DotBridgeTypography variant='h2' component="h2" sx={{
                mb: 3,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
            }}>
                Static Video is Holding You Back.
            </DotBridgeTypography>
            <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                mb: { xs: 4, md: 6 },
                maxWidth: '700px',
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }
            }}>
                Attention spans are shrinking. Engagement is plummeting. If your video is just a one-way street, you're leaving leads, sales, and student success on the table.
            </DotBridgeTypography>
            <Grid container spacing={4} justifyContent="center">
                {[{ icon: 'UsersRound', text: 'Low Engagement' }, { icon: 'TrendingDown', text: 'Poor Conversion' }, { icon: 'Clock', text: 'Wasted Time' }].map((item, i) => (
                    <Grid item key={i} xs={6} sm={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                            <DotBridgeIcon name={item.icon} size={32} color="primary.main" />
                            <DotBridgeTypography variant="body1" >{item.text}</DotBridgeTypography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    </Section>
);

const WhatIsBridgeSection = () => (
    <Section sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        <Grid container spacing={{ xs: 4, sm: 5, md: 10 }} alignItems="center">
            <Grid item xs={12} md={6}>
                <DotBridgeTypography variant='overline' color="primary.main" sx={{ mb: 1 }}>The Bridge Format</DotBridgeTypography>
                <DotBridgeTypography variant='h2' component="h2" sx={{
                    mb: 3,
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
                }}>
                    Video That Talks Back
                </DotBridgeTypography>
                <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                    mb: { xs: 3, md: 4 },
                    fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }
                }}>
                    Imagine a PDF, but for interactive video. A single "bridge" link or embed contains:
                </DotBridgeTypography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
                    {[{ icon: 'Bot', title: 'AI Agent', text: 'Answers questions 24/7 in your cloned voice.' }, { icon: 'ListChecks', title: 'Dynamic Prompts', text: 'Quizzes, polls & CTAs capture leads & feedback.' }, { icon: 'BarChart3', title: 'Conversion Tracking', text: 'See exactly what drives results.' }].map((item, i) => (
                        <Box component="li" key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <DotBridgeIcon name={item.icon} size={28} color="primary.main" style={{ marginTop: '5px' }} />
                            <Box>
                                <DotBridgeTypography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>{item.title}</DotBridgeTypography>
                                <DotBridgeTypography variant="body1" color="text.secondary">{item.text}</DotBridgeTypography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Grid>
            <Grid item xs={12} md={6}>
                <Box sx={{
                    p: 0,
                    textAlign: 'center',
                    borderRadius: { xs: 0, sm: theme => theme.shape.borderRadius },
                    minHeight: { xs: 'auto', sm: 300 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: { xs: 'transparent', sm: 'neutral.light' },
                    overflow: 'hidden',
                    mb: { xs: 0, sm: 0 }
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
                            borderRadius: { xs: 0, sm: 0 },
                            p: 0,
                            m: 0
                        }}
                    />
                </Box>
            </Grid>
        </Grid>
    </Section>
);

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
        { useCase: "Lead Magnets / Webinars", before: "Passive watch & bounce", after: "Email gate + interactive Q&A → <strong>+2× opt-ins</strong>" },
        { useCase: "VSLs / Funnel Pages", before: "One-way pitch", after: "Smart prompts that qualify + route hot buyers → <strong>Higher AOV</strong>" },
        { useCase: "Course Modules", before: "Low completion (~15%)", after: "AI tutor, quizzes, voice answers → <strong>35%+ completion</strong>" },
        { useCase: "Product Onboarding", before: "Docs & support tickets", after: "Personalized walkthroughs → <strong>Faster Time-to-Value</strong>" }
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
                    Static Video vs. Interactive Bridge
                </DotBridgeTypography>
                <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                    fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }
                }}>
                    Stop talking <em>at</em> your audience. Start interacting <em>with</em> them.
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
                                            Static Video
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
                                            With Bridge
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
                                <DotBridgeTypography variant="subtitle1" fontWeight="bold">Use Case</DotBridgeTypography>
                            </Box>
                            <Box sx={{ display: 'table-cell', p: 3, borderBottom: '1px solid', borderColor: 'divider', width: '35%' }}>
                                <DotBridgeTypography variant="subtitle1" fontWeight="bold" color="text.secondary">
                                    <DotBridgeIcon name="Video" size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                                    Static Video
                                </DotBridgeTypography>
                            </Box>
                            <Box sx={{ display: 'table-cell', p: 3, borderBottom: '1px solid', borderColor: 'divider', width: '35%' }}>
                                <DotBridgeTypography variant="subtitle1" fontWeight="bold" color="primary.main">
                                    <DotBridgeIcon name="Zap" size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                                    With Bridge
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

const FAQSection = () => {
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const faqs = [
        { q: "Do I need tech skills?", a: "Absolutely not. If you can upload a video, you can create a bridge. It's designed for creators and marketers, not developers.", id: "panel1" },
        { q: "Will a bridge replace my existing course platform (Kajabi, Teachable, etc.)?", a: "No, DotBridge complements your existing tools. You host your core course content on your platform and embed bridge links or modules where you want interactive elements, lead capture, or AI tutoring.", id: "panel2" },
        { q: "Is my content and voice data secure?", a: "Yes. We use enterprise-grade encryption and security practices. Your content, data, and voice models remain private and are only used to power your bridges.", id: "panel3" },
        { q: "What kind of videos can I use?", a: "You can upload standard MP4 files, or directly import from Loom, Zoom recordings, or even use slide decks (we'll auto-generate audio).", id: "panel4" },
        { q: "How does the AI Q&A work?", a: "Our AI analyzes your video content (and optional documents) to build a knowledge base. When a viewer asks a question, the AI generates an answer based *only* on that knowledge, delivered instantly in your cloned voice (if enabled) or a natural text-to-speech voice.", id: "panel5" },
        { q: "What are AI Credits?", a: "Credits are used for AI features like question answering and voice cloning generation. Each plan includes a monthly allowance. Additional credits can be purchased if needed.", id: "panel6" },
        { q: "Can I customize the look of the bridge player?", a: "Yes, Pro plans offer customization options for player colors, branding, and prompt styling to match your website or course.", id: "panel7" },
    ];

    return (
        <Section sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <Box maxWidth="md" mx="auto">
                <DotBridgeTypography variant='h2' component="h2" sx={{
                    mb: { xs: 4, md: 8 },
                    textAlign: 'center',
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
                }}>
                    Frequently Asked Questions
                </DotBridgeTypography>
                {faqs.map((faq) => (
                    <Accordion
                        key={faq.id}
                        expanded={expanded === faq.id}
                        onChange={handleChange(faq.id)}
                        sx={{ mb: 1 }}
                    >
                        <AccordionSummary
                            expandIcon={<DotBridgeIcon name={expanded === faq.id ? "Minus" : "Plus"} size={20} color="primary.main" />}
                            aria-controls={`${faq.id}-content`}
                            id={`${faq.id}-header`}
                            sx={{ py: { xs: 1.5, md: 2 }, px: { xs: 2, md: 3 } }}
                        >
                            <DotBridgeTypography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>{faq.q}</DotBridgeTypography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ py: { xs: 1.5, md: 2 }, px: { xs: 2, md: 3 } }}>
                            <DotBridgeTypography variant="body1" color="text.secondary">
                                {faq.a}
                            </DotBridgeTypography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Section>
    );
}

const UseCasesSection = () => {
    const theme = useTheme();

    const landingPageJourneySteps = [
        {
            icon: 'Eye',
            title: '1. Awareness Bridge',
            subtitle: 'Grab attention with short, punchy videos that speak directly to your audience\'s challenges and spark their curiosity.',
        },
        {
            icon: 'SearchCheck',
            title: '2. Discovery Bridge',
            subtitle: 'Ditch boring forms. Have real conversations that uncover what your prospects actually need and care about.',
        },
        {
            icon: 'Presentation',
            title: '3. Demo Bridge',
            subtitle: 'Show your product in action with personalized walkthroughs that focus on exactly what matters to each prospect.',
        },
        {
            icon: 'Target',
            title: '4. Sales Bridge',
            subtitle: 'Handle objections, talk pricing, and guide decisions with a smart assistant that never sleeps or goes on vacation.',
        },
        {
            icon: 'Rocket',
            title: '5. Onboarding Bridge',
            subtitle: 'Turn new customers into happy power users with guided setup that gets them up and running in record time.',
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
                            mb: 3,
                            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                            color: 'primary.dark'
                        }}>
                            Say Goodbye to One-Way Videos
                        </DotBridgeTypography>
                        <DotBridgeTypography variant="body1" color="text.primary" sx={{ mb: 2, lineHeight: 1.7 }}>
                            Think of DotBridge as your 24/7 sales and support team. We turn your videos from passive watching into two-way conversations that <DotBridgeTypography component="span" color="primary.main" fontWeight="bold">connect, engage, and convert</DotBridgeTypography> on autopilot.
                        </DotBridgeTypography>
                        <DotBridgeTypography variant="body1" color="text.primary" sx={{ mb: 2, lineHeight: 1.7 }}>
                            Picture this: A potential customer finds your Awareness Bridge. It catches their interest, answers their questions on the spot, and smoothly moves them to your Discovery Bridge. Here, instead of filling out yet another form, they have a natural conversation that reveals what they really need.
                        </DotBridgeTypography>
                        <DotBridgeTypography variant="body1" color="text.primary" sx={{ mb: 3, lineHeight: 1.7 }}>
                            When they hit your Demo Bridge, they don't see a generic product tour – they get a walkthrough focused on what matters to them. By the time they reach your Sales Bridge, objections are handled and decisions are easier. And once they're a customer? Your Onboarding Bridge gets them up to speed fast, saving you countless support tickets.
                        </DotBridgeTypography>
                        <DotBridgeTypography variant="h6" sx={{ color: 'text.primary', fontSize: { xs: '1.1rem', md: '1.2rem' }, mb: 3 }}>
                            Why keep losing leads to boring videos? Let's build a journey that converts while you focus on what you do best.
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
        { value: "+124%", label: "Email Capture Increase", sub: "(Webinar Funnels)" },
        { value: "2.1x", label: "Paid Course Sales", sub: "(VSL Conversion)" },
        { value: "-57%", label: "Support Tickets", sub: "(Onboarding Flows)" },
        { value: "+40%", label: "Course Completion", sub: "(AI Tutor Modules)" }
    ];
    return (
        <Section sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <Box maxWidth="md" mx="auto" textAlign="center" mb={{ xs: 4, md: 8 }}>
                <DotBridgeTypography variant='h2' component="h2" sx={{
                    mb: { xs: 2, md: 3 },
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
                }}>
                    Proof in the Numbers
                </DotBridgeTypography>
                <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                    fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }
                }}>
                    Early results from creators using DotBridge.
                </DotBridgeTypography>
            </Box>
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
                {metrics.map((metric, index) => (
                    <Grid item xs={6} sm={6} md={3} key={index}>
                        <DotBridgeCard variant="outlined" sx={{ height: '100%', textAlign: 'center', p: { xs: 2, sm: 3, md: 4 } }}>
                            <DotBridgeTypography variant="h3" color="primary.main" sx={{
                                mb: 1,
                                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' }
                            }}>
                                {metric.value}
                            </DotBridgeTypography>
                            <DotBridgeTypography variant="h6" sx={{
                                mb: 0.5,
                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
                            }}>{metric.label}</DotBridgeTypography>
                            <DotBridgeTypography variant="caption" color="text.secondary">{metric.sub}</DotBridgeTypography>
                        </DotBridgeCard>
                    </Grid>
                ))}
            </Grid>
            <Box textAlign="center" mt={{ xs: 3, md: 5 }}>
                <DotBridgeTypography variant="body2" color="text.secondary">
                    (Detailed case studies coming soon - join the waitlist inside the app.)
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

const DFYSection = () => (
    <Section sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        <DotBridgeCard variant="outlined" sx={{ p: { xs: 3, sm: 4, md: 6 }, textAlign: 'center' }}>
            <DotBridgeTypography variant='h3' component="h3" sx={{
                mb: { xs: 1.5, md: 2 },
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' }
            }}>
                Need It Built For You?
            </DotBridgeTypography>
            <DotBridgeTypography variant="body1" color="text.secondary" sx={{ mb: { xs: 3, md: 4 }, maxWidth: '650px', mx: 'auto' }}>
                Let our expert team build your entire AI Revenue Machine: bridge webinar, VSL, course modules, and marketing campaigns.
            </DotBridgeTypography>
            <DotBridgeButton
                size="large"
                color="primary"
                variant="contained"
                component={Link}
                to="/services"
                endIcon={<DotBridgeIcon name="ArrowRight" size={18} />}
            >
                Explore Done-For-You Services
            </DotBridgeButton>
        </DotBridgeCard>
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
    return (
        <Box sx={{ backgroundColor: theme.palette.background.default }}>
            <HeroSection />
            <WhyNowSection />
            <WhatIsBridgeSection />
            <DemoSection />
            <ComparisonSection />
            <UseCasesSection />
            <TrustedBySection />
            <HowItWorksSection />
            <ProofSection />
            <PricingSection />
            <DFYSection />
            <FAQSection />
            <FinalCTASection />
        </Box>
    );
}

export default DotBridgeLandingPage;