import React from 'react';
import { Box, Container, Typography, Button, Paper, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import AgentConnector from '../components/AgentConnector';
import Footer from '../components/Footer';

// Use the same DEMO_BRIDGE_ID for consistency
const DEMO_BRIDGE_ID = '447';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerChildren = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

// Hero Section - Enhanced with better mobile layout
const HeroSection = () => {
    return (
        <Box sx={{
            minHeight: { xs: '100vh', md: '85vh' },
            display: 'flex',
            alignItems: 'center',
            pt: { xs: 8, sm: 14, md: 16 },
            pb: { xs: 8, sm: 10, md: 12 },
            background: 'linear-gradient(180deg, #fdfdfd 0%, #f8fafc 100%)',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(ellipse at center top, rgba(26, 26, 46, 0.03) 0%, transparent 70%)',
                pointerEvents: 'none',
            }
        }}>
            <Container maxWidth="md">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerChildren}
                >
                    {/* Research Paper Title */}
                    <motion.div variants={fadeInUp}>
                        <Typography
                            variant="h1"
                            component="h1"
                            align="left"
                            sx={{
                                mb: { xs: 3, md: 4 },
                                fontSize: { xs: '1.875rem', sm: '2.5rem', md: '3rem' },
                                fontWeight: 300,
                                lineHeight: { xs: 1.2, md: 1.25 },
                                color: '#1a1a2e',
                                fontFamily: '"Merriweather", serif',
                                letterSpacing: '-0.01em',
                                maxWidth: '100%',
                                textAlign: { xs: 'center', sm: 'center', md: 'left' },
                                textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                            }}
                        >
                            DotBridge: A Framework for Multimodal Knowledge Extraction and Structured Agent Configuration
                        </Typography>
                    </motion.div>

                    {/* Research Abstract */}
                    <motion.div variants={fadeInUp}>
                        <Typography
                            variant="subtitle1"
                            align="left"
                            sx={{
                                mb: { xs: 3, md: 4 },
                                maxWidth: '100%',
                                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                                lineHeight: { xs: 1.6, md: 1.7 },
                                fontWeight: 400,
                                fontFamily: '"Inter", sans-serif',
                                color: '#4b5563',
                                fontStyle: 'normal',
                                textAlign: { xs: 'center', md: 'left' },
                                textShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                            }}
                        >
                            An open-source system for converting video, transcripts, and documents into structured knowledge graphs for research agents and quantitative workflows. This framework demonstrates novel techniques for production-scale multimodal AI deployment.
                        </Typography>
                    </motion.div>

                    {/* Research Keywords/Tags */}
                    <motion.div variants={fadeInUp}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: { xs: 'center', md: 'flex-start' },
                            mb: { xs: 4, md: 5 },
                            flexWrap: 'wrap',
                            gap: { xs: 1, sm: 1.5 },
                            px: { xs: 1, sm: 0 }
                        }}>
                            {['Multimodal AI', 'Knowledge Graphs', 'Agent Systems', 'NLP', 'Production ML'].map((tech) => (
                                <Chip
                                    key={tech}
                                    label={tech}
                                    variant="outlined"
                                    sx={{
                                        fontWeight: 400,
                                        fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                                        height: { xs: '26px', sm: '28px' },
                                    }}
                                />
                            ))}
                        </Box>
                    </motion.div>

                    {/* Academic Action Buttons */}
                    <motion.div variants={fadeInUp}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: { xs: 2, sm: 2 },
                            justifyContent: { xs: 'center', md: 'flex-start' },
                            alignItems: { xs: 'stretch', sm: 'flex-start' },
                            maxWidth: { xs: '100%', sm: 'none' },
                            px: { xs: 1, sm: 0 }
                        }}>
                            <Button
                                variant="contained"
                                size="large"
                                component={Link}
                                to={`/viewBridge/${DEMO_BRIDGE_ID}`}
                                sx={{
                                    minWidth: { xs: '100%', sm: '180px' },
                                    order: { xs: 1, sm: 0 },
                                }}
                            >
                                Interactive Demo
                            </Button>

                            <Button
                                variant="outlined"
                                size="large"
                                href="https://github.com/levbszabo/brdge-v1"
                                target="_blank"
                                sx={{
                                    minWidth: { xs: '100%', sm: '180px' },
                                    order: { xs: 2, sm: 0 },
                                }}
                            >
                                Code Repository
                            </Button>

                            <Button
                                variant="text"
                                size="large"
                                href="https://journeymanai.io"
                                target="_blank"
                                sx={{
                                    minWidth: { xs: '100%', sm: 'auto' },
                                    order: { xs: 3, sm: 0 },
                                    display: { xs: 'flex', sm: 'inline-flex' },
                                    justifyContent: { xs: 'center', sm: 'flex-start' },
                                }}
                            >
                                Contact Author →
                            </Button>
                        </Box>
                    </motion.div>
                </motion.div>
            </Container>
        </Box>
    );
};

// Enhanced Methodology Section with glassmorphism cards
const TechnologySection = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const features = [
        {
            title: 'Multipass Content Analysis',
            description: 'Sequential extraction pipeline analyzing content structure, temporal components, and semantic relationships across modalities.'
        },
        {
            title: 'Knowledge Graph Construction',
            description: 'Structured representation including teaching personas, engagement opportunities, timeline mappings, and Q&A derivations.'
        },
        {
            title: 'Agent Instantiation Framework',
            description: 'Dynamic agent configuration utilizing extracted knowledge graphs for contextually-aware conversational interfaces.'
        },
        {
            title: 'Temporal Engagement Mapping',
            description: 'Time-synchronized interaction opportunities derived from content analysis and embedded within agent response patterns.'
        }
    ];

    return (
        <Box ref={ref} sx={{
            py: { xs: 8, md: 10 },
            bgcolor: 'background.default',
            position: 'relative',
        }}>
            <Container maxWidth="lg">
                <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={staggerChildren}
                >
                    <motion.div variants={fadeInUp}>
                        <Typography
                            variant="h2"
                            component="h2"
                            sx={{
                                mb: 2,
                                textAlign: { xs: 'center', md: 'left' },
                                px: { xs: 2, sm: 0 }
                            }}
                        >
                            Methodology
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                mb: 6,
                                maxWidth: '700px',
                                mx: { xs: 'auto', md: 0 },
                                textAlign: { xs: 'center', md: 'left' },
                                px: { xs: 2, sm: 0 }
                            }}
                        >
                            Systematic approach to multipass content analysis and knowledge graph construction from multimodal sources.
                        </Typography>
                    </motion.div>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
                        gap: { xs: 3, md: 4 },
                        mt: 4,
                        px: { xs: 1, sm: 0 }
                    }}>
                        {features.map((feature, index) => (
                            <motion.div key={index} variants={fadeInUp}>
                                <Box sx={{
                                    p: { xs: 3, md: 4 },
                                    height: '100%',
                                    borderRadius: '6px',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                    }
                                }}>
                                    <Typography variant="h6" sx={{
                                        mb: { xs: 1.5, md: 2 },
                                        fontWeight: 600,
                                        fontFamily: '"Inter", sans-serif',
                                        color: '#1a1a2e',
                                        fontSize: { xs: '1rem', md: '1.125rem' },
                                    }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        lineHeight: 1.65,
                                        fontFamily: '"Inter", sans-serif',
                                        color: '#6b7280',
                                        fontSize: { xs: '0.875rem', md: '0.9375rem' },
                                    }}>
                                        {feature.description}
                                    </Typography>
                                </Box>
                            </motion.div>
                        ))}
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

// Enhanced Applications Section with improved mobile layout
const ApplicationsSection = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const applications = [
        {
            title: 'Financial Research',
            items: ['Earnings call analysis', 'SEC filing interrogation', 'Investment research automation', 'Risk assessment workflows']
        },
        {
            title: 'Academic Research',
            items: ['Literature review automation', 'Citation analysis', 'Research methodology extraction', 'Cross-reference validation']
        },
        {
            title: 'Enterprise Knowledge',
            items: ['Document analysis pipelines', 'Training content structuring', 'Knowledge base construction', 'Information retrieval systems']
        }
    ];

    return (
        <Box ref={ref} sx={{
            py: { xs: 8, md: 10 },
            bgcolor: 'background.subtle',
            position: 'relative',
        }}>
            <Container maxWidth="lg">
                <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={staggerChildren}
                >
                    <motion.div variants={fadeInUp}>
                        <Typography
                            variant="h2"
                            component="h2"
                            sx={{
                                mb: 6,
                                textAlign: { xs: 'center', md: 'left' },
                                px: { xs: 2, sm: 0 }
                            }}
                        >
                            Research Applications
                        </Typography>
                    </motion.div>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                        gap: { xs: 3, md: 4 },
                        px: { xs: 1, sm: 0 }
                    }}>
                        {applications.map((app, index) => (
                            <motion.div key={index} variants={fadeInUp}>
                                <Paper elevation={0} sx={{
                                    p: { xs: 3, md: 4 },
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                    }
                                }}>
                                    <Typography variant="h5" sx={{
                                        mb: 3,
                                        fontWeight: 600,
                                        color: '#1a1a2e',
                                        fontFamily: '"Inter", sans-serif',
                                        fontSize: { xs: '1rem', md: '1.125rem' },
                                    }}>
                                        {app.title}
                                    </Typography>
                                    <Box component="ul" sx={{
                                        pl: 0,
                                        listStyle: 'none',
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: { xs: 1, md: 1.5 }
                                    }}>
                                        {app.items.map((item, idx) => (
                                            <Box component="li" key={idx} sx={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                '&::before': {
                                                    content: '"•"',
                                                    color: '#9ca3af',
                                                    marginRight: '12px',
                                                    fontSize: '1rem',
                                                    lineHeight: '1.5',
                                                    flexShrink: 0,
                                                }
                                            }}>
                                                <Typography variant="body2" sx={{
                                                    fontFamily: '"Inter", sans-serif',
                                                    lineHeight: 1.6,
                                                    color: '#6b7280',
                                                    fontSize: { xs: '0.875rem', md: '0.9375rem' },
                                                }}>{item}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Paper>
                            </motion.div>
                        ))}
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

// Enhanced Demo Section with better mobile experience
const DemoSection = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <Box ref={ref} sx={{
            py: { xs: 8, md: 10 },
            bgcolor: 'background.default',
        }}>
            <Container maxWidth="lg">
                <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={staggerChildren}
                >
                    <motion.div variants={fadeInUp}>
                        <Typography
                            variant="h2"
                            component="h2"
                            sx={{
                                mb: 3,
                                textAlign: { xs: 'center', md: 'left' },
                                px: { xs: 2, sm: 0 }
                            }}
                        >
                            Implementation
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                mb: 6,
                                maxWidth: '600px',
                                mx: { xs: 'auto', md: 0 },
                                textAlign: { xs: 'center', md: 'left' },
                                px: { xs: 2, sm: 0 }
                            }}
                        >
                            Interactive demonstration of the multimodal knowledge extraction framework in operation.
                        </Typography>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                        {/* Desktop Demo */}
                        <Box sx={{
                            display: { xs: 'none', md: 'block' },
                            maxWidth: '900px',
                            mx: 'auto',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid #e5e7eb',
                            bgcolor: '#ffffff',
                            aspectRatio: '16 / 10',
                            boxShadow: '0 20px 60px rgba(26, 26, 46, 0.08), 0 8px 32px rgba(0, 0, 0, 0.04)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 24px 80px rgba(26, 26, 46, 0.12), 0 12px 40px rgba(0, 0, 0, 0.06)',
                            }
                        }}>
                            {/* Browser chrome with enhanced styling */}
                            <Box sx={{
                                p: 1.5,
                                borderBottom: '1px solid #f3f4f6',
                                background: 'linear-gradient(180deg, #fafafc 0%, #f8fafc 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ef4444' }} />
                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#10b981' }} />
                                </Box>
                                <Typography variant="caption" sx={{
                                    flex: 1,
                                    textAlign: 'center',
                                    fontWeight: 400,
                                    fontFamily: '"Inter", sans-serif',
                                    color: '#9ca3af',
                                    fontSize: '0.75rem',
                                }}>
                                    DotBridge Framework - Interactive Demo
                                </Typography>
                            </Box>

                            {/* Demo content */}
                            <Box sx={{ height: 'calc(100% - 48px)', position: 'relative' }}>
                                <AgentConnector
                                    brdgeId={DEMO_BRIDGE_ID}
                                    agentType="view"
                                    token=""
                                    userId={null}
                                    isEmbed={false}
                                />
                            </Box>
                        </Box>

                        {/* Mobile Demo Card */}
                        <Box sx={{
                            display: { xs: 'block', md: 'none' },
                            textAlign: 'center',
                            px: { xs: 2, sm: 0 }
                        }}>
                            <Paper elevation={1} sx={{
                                p: { xs: 3, sm: 4 },
                                borderRadius: '8px',
                                maxWidth: '400px',
                                mx: 'auto',
                            }}>
                                <Typography variant="h6" sx={{
                                    mb: 2,
                                    color: '#1a1a2e',
                                    fontFamily: '"Inter", sans-serif',
                                    fontWeight: 600,
                                    fontSize: { xs: '1rem', sm: '1.125rem' },
                                }}>
                                    Interactive Demo
                                </Typography>
                                <Typography variant="body2" sx={{
                                    mb: 3,
                                    fontFamily: '"Inter", sans-serif',
                                    lineHeight: 1.6,
                                    color: '#6b7280',
                                    fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                                }}>
                                    Experience the framework on desktop for optimal interaction
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    component={Link}
                                    to={`/viewBridge/${DEMO_BRIDGE_ID}`}
                                    fullWidth
                                    sx={{
                                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                                    }}
                                >
                                    Launch Demo
                                </Button>
                            </Paper>
                        </Box>
                    </motion.div>
                </motion.div>
            </Container>
        </Box>
    );
};

// Enhanced About Section with better mobile layout
const AboutSection = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <Box ref={ref} sx={{
            py: { xs: 8, md: 10 },
            bgcolor: 'background.subtle',
        }}>
            <Container maxWidth="lg">
                <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={staggerChildren}
                >
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
                        gap: { xs: 4, lg: 6 },
                        alignItems: 'start',
                        px: { xs: 1, sm: 0 }
                    }}>
                        <motion.div variants={fadeInUp}>
                            <Typography variant="h3" sx={{
                                mb: 4,
                                textAlign: { xs: 'center', lg: 'left' },
                                px: { xs: 1, sm: 0 }
                            }}>
                                Research Background
                            </Typography>
                            <Box sx={{ px: { xs: 1, sm: 0 } }}>
                                <Typography variant="body1" sx={{ mb: 4 }}>
                                    DotBridge was developed to explore systematic approaches to multimodal knowledge extraction,
                                    real-time agent architectures, and structured content analysis. Originally conceived as a commercial
                                    application, the framework is now open-sourced to advance academic research in knowledge graph
                                    construction from unstructured multimodal sources.
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 4 }}>
                                    The system demonstrates novel techniques for production-scale multimodal AI deployment,
                                    with particular relevance to alternative data processing in quantitative finance,
                                    automated research workflows, and conversational AI systems.
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    gap: 2,
                                    flexWrap: 'wrap',
                                    justifyContent: { xs: 'center', lg: 'flex-start' }
                                }}>
                                    <Button variant="outlined" href="https://journeymanai.io" target="_blank">
                                        Author Profile
                                    </Button>
                                    <Button variant="outlined" href="https://github.com/levbszabo/brdge-v1" target="_blank">
                                        Source Code
                                    </Button>
                                </Box>
                            </Box>
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                            <Paper elevation={0} sx={{
                                p: { xs: 3, md: 4 },
                                borderRadius: '8px',
                                maxWidth: { xs: '400px', lg: 'none' },
                                mx: { xs: 'auto', lg: 0 },
                            }}>
                                <Typography variant="h6" sx={{
                                    mb: 3,
                                    color: '#1a1a2e',
                                    fontWeight: 600,
                                    fontFamily: '"Inter", sans-serif',
                                    fontSize: { xs: '1rem', md: '1.125rem' },
                                    textAlign: { xs: 'center', lg: 'left' }
                                }}>
                                    Technical Focus Areas
                                </Typography>
                                <Box component="ul" sx={{ pl: 0, listStyle: 'none' }}>
                                    {[
                                        'Multimodal content analysis',
                                        'Knowledge graph construction',
                                        'Real-time agent systems',
                                        'Structured data extraction',
                                        'Production ML frameworks'
                                    ].map((item, idx) => (
                                        <Box component="li" key={idx} sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                            '&::before': {
                                                content: '"•"',
                                                color: '#9ca3af',
                                                marginRight: '12px',
                                                fontSize: '1rem',
                                                flexShrink: 0,
                                            }
                                        }}>
                                            <Typography variant="body2" sx={{
                                                color: '#6b7280',
                                                fontFamily: '"Inter", sans-serif',
                                                lineHeight: 1.6,
                                                fontSize: { xs: '0.875rem', md: '0.9375rem' },
                                            }}>{item}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Paper>
                        </motion.div>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

// Main Component
function TechShowcaseLandingPage() {
    return (
        <Box sx={{ bgcolor: 'background.default' }}>
            <HeroSection />
            <TechnologySection />
            <ApplicationsSection />
            <DemoSection />
            <AboutSection />
            <Footer />
        </Box>
    );
}

export default TechShowcaseLandingPage; 