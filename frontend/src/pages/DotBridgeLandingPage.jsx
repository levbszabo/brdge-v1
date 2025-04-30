import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid, Typography as MuiTypography, Paper, Accordion, AccordionSummary, AccordionDetails, useTheme, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import DotBridgeButton from '../components/DotBridgeButton';
import DotBridgeTypography from '../components/DotBridgeTypography';
import DotBridgeCard, { CardContent, CardHeader } from '../components/DotBridgeCard';
import DotBridgeIcon from '../components/DotBridgeIcon';

import AgentConnector from '../components/AgentConnector';

const DEMO_BRIDGE_ID = '398';

const Section = ({ children, sx, ...props }) => (
    <Box component="section" sx={{ py: { xs: 12, md: 16 }, ...sx }} {...props}>
        <Container maxWidth="lg">
            {children}
        </Container>
    </Box>
);

const HeroSection = () => (
    <Box sx={{
        pt: { xs: 2, md: 4 },
        pb: { xs: 12, md: 20 },
        textAlign: 'center'
    }}>
        <Container maxWidth="md">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 20,
                    delay: 0.1
                }}
                style={{ display: 'inline-block' }}
            >
                <Box
                    component="img"
                    src="/new-img.png"
                    alt=".bridge logo element"
                    sx={{
                        display: 'block',
                        mx: 'auto',
                        width: 'auto',
                        height: { xs: 70, sm: 120 },
                        mb: 4,
                        bgcolor: 'transparent'
                    }}
                />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <DotBridgeTypography
                    variant="h1"
                    component="h1"
                    sx={{
                        mb: 2,
                    }}
                >
                    Create AI-Powered Videos That Sell, Teach & Onboard Automatically
                </DotBridgeTypography>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
            >
                <DotBridgeTypography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        mb: 6,
                        maxWidth: '700px',
                        mx: 'auto',
                        fontSize: '1.1rem',
                        lineHeight: 1.6
                    }}
                >
                    DotBridge is the new interactive "bridge" format that turns any video into an AI agent that captures leads, qualifies buyers and coaches users in your own voice. Launch your first bridge in minutes and watch conversion rates jump.
                </DotBridgeTypography>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2.5, flexWrap: 'wrap' }}>
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
                        onClick={() => console.log('Watch Demo Clicked')}
                        endIcon={<DotBridgeIcon name="Play" size={18} />}
                    >
                        Watch Live Demo
                    </DotBridgeButton>
                </Box>
            </motion.div>
        </Container>
    </Box>
);

const TrustedBySection = () => (
    <Section sx={{
        py: { xs: 6, md: 8 }, // Reduced padding for a tighter feel
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
            <DotBridgeTypography variant='h2' component="h2" sx={{ mb: 3 }}>
                Static Video is Holding You Back.
            </DotBridgeTypography>
            <DotBridgeTypography variant="h5" color="text.secondary" sx={{ mb: 6, maxWidth: '700px', mx: 'auto' }}>
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
        <Grid container spacing={{ xs: 5, md: 10 }} alignItems="center">
            <Grid item xs={12} md={6}>
                <DotBridgeTypography variant='overline' color="primary.main" sx={{ mb: 1 }}>The Bridge Format</DotBridgeTypography>
                <DotBridgeTypography variant='h2' component="h2" sx={{ mb: 3 }}>
                    Video That Talks Back
                </DotBridgeTypography>
                <DotBridgeTypography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
                    Imagine a PDF, but for interactive video. A single "bridge" link or embed contains:
                </DotBridgeTypography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {[{ icon: 'Bot', title: 'AI Agent', text: 'Answers questions 24/7 in your cloned voice.' }, { icon: 'ListChecks', title: 'Dynamic Prompts', text: 'Quizzes, polls & CTAs capture leads & feedback.' }, { icon: 'BarChart3', title: 'Conversion Tracking', text: 'See exactly what drives results.' }].map((item, i) => (
                        <Box component="li" key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                            <DotBridgeIcon name={item.icon} size={28} color="primary.main" style={{ marginTop: '5px' }} />
                            <Box>
                                <DotBridgeTypography variant="h6">{item.title}</DotBridgeTypography>
                                <DotBridgeTypography variant="body1" color="text.secondary">{item.text}</DotBridgeTypography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Grid>
            <Grid item xs={12} md={6}>
                <Box sx={{
                    p: { xs: 3, sm: 5 },
                    textAlign: 'center',
                    borderRadius: theme => theme.shape.borderRadius,
                    border: '1px solid',
                    borderColor: 'divider',
                    minHeight: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'neutral.light'
                }}>
                    <DotBridgeIcon name="Workflow" size={64} color="primary.main" />
                    <DotBridgeTypography variant="h6" sx={{ mt: 3, mb: 1 }}>Visualization: How Bridge Works</DotBridgeTypography>
                    <DotBridgeTypography variant="body2" color="text.secondary">
                        {'(e.g., Flow Diagram: Upload Video -> AI Processing -> Interactive Bridge Output)'}
                    </DotBridgeTypography>
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
            <Box maxWidth="lg" mx="auto" textAlign="center" mb={8}>
                <DotBridgeTypography variant='h2' component="h2" sx={{ mb: 3 }}>
                    See Bridge in Action
                </DotBridgeTypography>
                <DotBridgeTypography variant="h5" color="text.secondary" sx={{ maxWidth: '750px', mx: 'auto' }}>
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
                            src="/brdge-demo.mp4"
                            controls={isVideoPlaying}
                            playsInline
                            poster="/poster-landing.png"
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
                                to={`https://brdge-ai.com/viewBridge/${DEMO_BRIDGE_ID}`}
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

    return (
        <Section sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <Box maxWidth="md" mx="auto" textAlign="center" mb={8}>
                <DotBridgeTypography variant='h2' component="h2" sx={{ mb: 3 }}>
                    Static Video vs. Interactive Bridge
                </DotBridgeTypography>
                <DotBridgeTypography variant="h5" color="text.secondary">
                    Stop talking <em>at</em> your audience. Start interacting <em>with</em> them.
                </DotBridgeTypography>
            </Box>

            <Grid container spacing={{ xs: 4, md: 6 }} justifyContent="center">
                {comparisons.map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{ height: '100%', p: { xs: 1, sm: 2 } }}>
                            <DotBridgeTypography variant="h6" sx={{ mb: 3 }}>{item.useCase}</DotBridgeTypography>
                            <Box sx={{ mb: 3 }}>
                                <DotBridgeTypography variant="overline" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                                    Static Video:
                                </DotBridgeTypography>
                                <DotBridgeTypography variant="body1" color="text.primary">
                                    {item.before}
                                </DotBridgeTypography>
                            </Box>
                            <Box>
                                <DotBridgeTypography variant="overline" color="primary.main" display="block" sx={{ mb: 0.5 }}>
                                    With Bridge:
                                </DotBridgeTypography>
                                <DotBridgeTypography
                                    variant="body1"
                                    color="text.primary"
                                    sx={{ fontWeight: 500 }}
                                    dangerouslySetInnerHTML={{ __html: item.after }}
                                />
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
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
                <DotBridgeTypography variant='h2' component="h2" sx={{ mb: 8, textAlign: 'center' }}>
                    Frequently Asked Questions
                </DotBridgeTypography>
                {faqs.map((faq) => (
                    <Accordion
                        key={faq.id}
                        expanded={expanded === faq.id}
                        onChange={handleChange(faq.id)}
                    >
                        <AccordionSummary
                            expandIcon={<DotBridgeIcon name={expanded === faq.id ? "Minus" : "Plus"} size={20} color="primary.main" />}
                            aria-controls={`${faq.id}-content`}
                            id={`${faq.id}-header`}
                        >
                            <DotBridgeTypography variant="h6">{faq.q}</DotBridgeTypography>
                        </AccordionSummary>
                        <AccordionDetails>
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
    const cases = [
        {
            useCase: "Lead Magnets / Webinars",
            before: "Passive watch & bounce",
            after: "Email gate + interactive Q&A",
            result: "+2× opt-ins",
            icon: "Magnet"
        },
        {
            useCase: "VSLs / Funnel Pages",
            before: "One-way pitch",
            after: "Smart prompts that qualify buyers",
            result: "Higher AOV",
            icon: "Target"
        },
        {
            useCase: "Course Modules",
            before: "~15% completion rate",
            after: "AI tutor, quizzes, voice answers",
            result: "35%+ completion",
            icon: "GraduationCap"
        },
        {
            useCase: "Product Onboarding",
            before: "Docs & support tickets",
            after: "Personalized interactive walkthroughs",
            result: "Faster Time-to-Value",
            icon: "Rocket"
        }
    ];

    return (
        <Section sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <Box maxWidth="md" mx="auto" textAlign="center" mb={8}>
                <DotBridgeTypography variant='h2' component="h2" sx={{ mb: 3 }}>
                    Transform Any Video Interaction
                </DotBridgeTypography>
                <DotBridgeTypography variant="h5" color="text.secondary">
                    Replace passive content with active experiences that drive results.
                </DotBridgeTypography>
            </Box>
            <Grid container spacing={4}>
                {cases.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Box sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                            <DotBridgeIcon name={item.icon} size={40} color="primary.main" sx={{ mb: 2.5 }} />
                            <DotBridgeTypography variant="h6" sx={{ mb: 2.5 }}>{item.useCase}</DotBridgeTypography>
                            <Box sx={{ mb: 2.5 }}>
                                <DotBridgeTypography variant="overline" color="text.secondary">Before</DotBridgeTypography>
                                <DotBridgeTypography variant="body1" color="text.primary">{item.before}</DotBridgeTypography>
                            </Box>
                            <Box sx={{ mb: 2.5 }}>
                                <DotBridgeTypography variant="overline" color="primary.main">With Bridge</DotBridgeTypography>
                                <DotBridgeTypography variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>{item.after}</DotBridgeTypography>
                            </Box>
                            <DotBridgeTypography variant="subtitle1" color="primary.dark" sx={{ fontWeight: 600 }}>
                                → {item.result}
                            </DotBridgeTypography>
                        </Box>
                    </Grid>
                ))}
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
            <Box maxWidth="md" mx="auto" textAlign="center" mb={8}>
                <DotBridgeTypography variant='h2' component="h2" sx={{ mb: 3 }}>
                    Launch Your First Bridge in Minutes
                </DotBridgeTypography>
                <DotBridgeTypography variant="h5" color="text.secondary">
                    No code required. Just upload, configure, and publish.
                </DotBridgeTypography>
            </Box>
            <Grid container spacing={5} justifyContent="center">
                {steps.map((step, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index} sx={{ textAlign: 'center' }}>
                        <Box sx={{
                            display: 'inline-flex',
                            p: 2.5,
                            borderRadius: '50%',
                            bgcolor: 'neutral.light',
                            mb: 3
                        }}>
                            <DotBridgeIcon name={step.icon} size={36} color="primary.main" />
                        </Box>
                        <DotBridgeTypography variant="h6" sx={{ mb: 1.5 }}>{index + 1}. {step.title}</DotBridgeTypography>
                        <DotBridgeTypography variant="body1" color="text.secondary">{step.text}</DotBridgeTypography>
                    </Grid>
                ))}
            </Grid>
            <Box textAlign="center" mt={7}>
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
            <Box maxWidth="md" mx="auto" textAlign="center" mb={8}>
                <DotBridgeTypography variant='h2' component="h2" sx={{ mb: 3 }}>
                    Proof in the Numbers
                </DotBridgeTypography>
                <DotBridgeTypography variant="h5" color="text.secondary">
                    Early results from creators using DotBridge.
                </DotBridgeTypography>
            </Box>
            <Grid container spacing={4} justifyContent="center">
                {metrics.map((metric, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <DotBridgeCard variant="outlined" sx={{ height: '100%', textAlign: 'center', p: 4 }}>
                            <DotBridgeTypography variant="h2" color="primary.main" sx={{ mb: 1 }}>
                                {metric.value}
                            </DotBridgeTypography>
                            <DotBridgeTypography variant="h6" sx={{ mb: 0.5 }}>{metric.label}</DotBridgeTypography>
                            <DotBridgeTypography variant="caption" color="text.secondary">{metric.sub}</DotBridgeTypography>
                        </DotBridgeCard>
                    </Grid>
                ))}
            </Grid>
            <Box textAlign="center" mt={5}>
                <DotBridgeTypography variant="body2" color="text.secondary">
                    (Detailed case studies coming soon - join the waitlist inside the app.)
                </DotBridgeTypography>
            </Box>
        </Section>
    );
};

const PricingSection = () => (
    <Section sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        <Box maxWidth="md" mx="auto" textAlign="center" mb={8}>
            <DotBridgeTypography variant='h2' component="h2" sx={{ mb: 3 }}>
                Simple Pricing for Growth
            </DotBridgeTypography>
        </Box>
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            <Grid item xs={12} sm={6} md={4}>
                <DotBridgeCard sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: (theme) => theme.shadows[2]
                    }
                }}>
                    <DotBridgeTypography variant="h4">Free</DotBridgeTypography>
                    <DotBridgeTypography variant="h2" sx={{ my: 1 }}>$0</DotBridgeTypography>
                    <DotBridgeTypography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Forever</DotBridgeTypography>
                    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4, flexGrow: 1 }}>
                        {[
                            "1 bridge Link",
                            "Basic AI Q&A",
                            "Voice Clone",
                            "Basic Analytics",
                            "1 Course Limit",
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
                            "1 Course Limit",
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
                            "Unlimited Links",
                            "1000 AI Minutes/mo",
                            "Unlimited Courses",
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
        <DotBridgeCard variant="outlined" sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>
            <DotBridgeTypography variant='h3' component="h3" sx={{ mb: 2 }}>
                Need It Built For You?
            </DotBridgeTypography>
            <DotBridgeTypography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '650px', mx: 'auto' }}>
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
            <DotBridgeTypography variant='h2' component="h2" sx={{ mb: 3, color: 'inherit' }}>
                Ready to Turn Video Into Revenue?
            </DotBridgeTypography>
            <DotBridgeTypography variant="h5" sx={{ mb: 5, maxWidth: '700px', mx: 'auto', color: 'primary.contrastText', opacity: 0.85 }}>
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
            <TrustedBySection />
            <WhatIsBridgeSection />
            <ComparisonSection />
            <DemoSection />
            <UseCasesSection />
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