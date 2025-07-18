import React from 'react';
import { Box, Container, Grid, Typography, Button, Paper, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import DotBridgeButton from '../components/DotBridgeButton';
import DotBridgeTypography from '../components/DotBridgeTypography';
import DotBridgeCard from '../components/DotBridgeCard';
import DotBridgeIcon from '../components/DotBridgeIcon';
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

// Hero Section
const HeroSection = () => {
    return (
        <Box sx={{
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            pt: { xs: 8, sm: 10, md: 12 },
            pb: { xs: 6, sm: 8, md: 10 },
            background: 'linear-gradient(180deg, #fefefe 0%, #f8fafc 100%)',
            borderBottom: '1px solid #e2e8f0'
        }}>
            <Container maxWidth="lg">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerChildren}
                >
                    {/* Main Headline */}
                    <motion.div variants={fadeInUp}>
                        <DotBridgeTypography
                            variant="h1"
                            component="h1"
                            align="center"
                            sx={{
                                mb: 3,
                                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                                fontWeight: 300,
                                lineHeight: 1.2,
                                color: '#2d3748',
                                fontFamily: '"Georgia", "Times New Roman", serif',
                                letterSpacing: '-0.02em'
                            }}
                        >
                            DotBridge Research Framework
                        </DotBridgeTypography>
                    </motion.div>

                    {/* Subheadline */}
                    <motion.div variants={fadeInUp}>
                        <Typography
                            variant="h5"
                            align="center"
                            color="text.secondary"
                            sx={{
                                mb: 2,
                                maxWidth: '800px',
                                mx: 'auto',
                                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                                lineHeight: 1.6,
                                fontWeight: 300,
                                fontFamily: '"Georgia", "Times New Roman", serif'
                            }}
                        >
                            A research framework for multipass knowledge extraction and structured knowledge graph construction from multimodal content
                        </Typography>
                    </motion.div>

                    {/* Tech Stack */}
                    <motion.div variants={fadeInUp}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, flexWrap: 'wrap', gap: 1 }}>
                            {['Multipass NLP', 'Knowledge Graphs', 'Structured Extraction', 'Python', 'React', 'Real-time Agents'].map((tech) => (
                                <Chip
                                    key={tech}
                                    label={tech}
                                    variant="outlined"
                                    sx={{
                                        fontWeight: 400,
                                        borderColor: '#2d3748',
                                        color: '#2d3748',
                                        backgroundColor: 'rgba(45, 55, 72, 0.04)',
                                        fontFamily: '"Georgia", "Times New Roman", serif',
                                        fontSize: '0.875rem'
                                    }}
                                />
                            ))}
                        </Box>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div variants={fadeInUp}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 3,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <DotBridgeButton
                                variant="contained"
                                size="large"
                                component={Link}
                                to={`/viewBridge/${DEMO_BRIDGE_ID}`}
                                startIcon={<DotBridgeIcon name="Play" />}
                                sx={{
                                    px: 4,
                                    py: 2,
                                    fontSize: '1.125rem',
                                    fontWeight: 400,
                                    minWidth: { xs: '100%', sm: '200px' },
                                    backgroundColor: '#2d3748',
                                    fontFamily: '"Georgia", "Times New Roman", serif',
                                    '&:hover': { backgroundColor: '#4a5568' }
                                }}
                            >
                                Interactive Demo
                            </DotBridgeButton>

                            <DotBridgeButton
                                variant="outlined"
                                size="large"
                                href="https://github.com/your-username/dotbridge"
                                target="_blank"
                                startIcon={<DotBridgeIcon name="Github" />}
                                sx={{
                                    px: 4,
                                    py: 2,
                                    fontSize: '1.125rem',
                                    fontWeight: 400,
                                    minWidth: { xs: '100%', sm: '200px' },
                                    borderColor: '#2d3748',
                                    color: '#2d3748',
                                    fontFamily: '"Georgia", "Times New Roman", serif',
                                    '&:hover': { borderColor: '#4a5568', backgroundColor: 'rgba(45, 55, 72, 0.05)' }
                                }}
                            >
                                Research Code
                            </DotBridgeButton>

                            <DotBridgeButton
                                variant="text"
                                size="large"
                                href="https://journeymanai.io"
                                target="_blank"
                                sx={{
                                    px: 4,
                                    py: 2,
                                    fontSize: '1.125rem',
                                    fontWeight: 300,
                                    color: '#2d3748',
                                    fontFamily: '"Georgia", "Times New Roman", serif',
                                    '&:hover': { backgroundColor: 'rgba(45, 55, 72, 0.05)' }
                                }}
                            >
                                Principal Investigator →
                            </DotBridgeButton>
                        </Box>
                    </motion.div>
                </motion.div>
            </Container>
        </Box>
    );
};

// Technology Overview Section
const TechnologySection = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const features = [
        {
            icon: 'FileText',
            title: 'Multipass Content Analysis',
            description: 'Sequential extraction pipeline analyzing content structure, temporal components, and semantic relationships across modalities'
        },
        {
            icon: 'Share2',
            title: 'Knowledge Graph Construction',
            description: 'Structured representation including teaching personas, engagement opportunities, timeline mappings, and Q&A derivations'
        },
        {
            icon: 'MessageSquare',
            title: 'Agent Instantiation Framework',
            description: 'Dynamic agent configuration utilizing extracted knowledge graphs for contextually-aware conversational interfaces'
        },
        {
            icon: 'Target',
            title: 'Temporal Engagement Mapping',
            description: 'Time-synchronized interaction opportunities derived from content analysis and embedded within agent response patterns'
        }
    ];

    return (
        <Box ref={ref} sx={{ py: { xs: 8, md: 12 }, bgcolor: '#fefefe', borderBottom: '1px solid #e2e8f0' }}>
            <Container maxWidth="lg">
                <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={staggerChildren}
                >
                    <motion.div variants={fadeInUp}>
                        <Typography
                            variant="h2"
                            align="center"
                            sx={{
                                mb: 2,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                fontWeight: 300,
                                color: '#2d3748',
                                fontFamily: '"Georgia", "Times New Roman", serif'
                            }}
                        >
                            Research Methodology: Structured Knowledge Extraction
                        </Typography>
                        <Typography
                            variant="h6"
                            align="center"
                            color="text.secondary"
                            sx={{
                                mb: 8,
                                maxWidth: '800px',
                                mx: 'auto',
                                fontWeight: 300,
                                fontFamily: '"Georgia", "Times New Roman", serif',
                                fontStyle: 'italic'
                            }}
                        >
                            A systematic approach to multipass content analysis and knowledge graph construction from multimodal sources
                        </Typography>
                    </motion.div>

                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <motion.div variants={fadeInUp}>
                                    <DotBridgeCard sx={{
                                        p: 4,
                                        height: '100%',
                                        textAlign: 'center',
                                        transition: 'all 0.3s ease',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: '#fefefe',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 25px rgba(45, 55, 72, 0.08)',
                                            borderColor: '#cbd5e0'
                                        }
                                    }}>
                                        <Box sx={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: 2,
                                            bgcolor: '#f7fafc',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 3,
                                        }}>
                                            <DotBridgeIcon name={feature.icon} size={32} color="#2d3748" />
                                        </Box>
                                        <Typography variant="h6" sx={{
                                            mb: 2,
                                            fontWeight: 400,
                                            fontFamily: '"Georgia", "Times New Roman", serif',
                                            color: '#2d3748'
                                        }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{
                                            lineHeight: 1.6,
                                            fontFamily: '"Georgia", "Times New Roman", serif'
                                        }}>
                                            {feature.description}
                                        </Typography>
                                    </DotBridgeCard>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
};

// Applications Section
const ApplicationsSection = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const applications = [
        {
            title: 'Financial Services',
            items: ['Earnings call analysis and Q&A', 'SEC filing interrogation', 'Investment research automation', 'Risk assessment conversations']
        },
        {
            title: 'Research & Education',
            items: ['Academic paper interaction', 'Documentation Q&A systems', 'Training content delivery', 'Knowledge base creation']
        },
        {
            title: 'Enterprise',
            items: ['Internal knowledge systems', 'Customer support automation', 'Training and onboarding', 'Document analysis workflows']
        }
    ];

    return (
        <Box ref={ref} sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <Container maxWidth="lg">
                <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={staggerChildren}
                >
                    <motion.div variants={fadeInUp}>
                        <Typography
                            variant="h2"
                            align="center"
                            sx={{
                                mb: 8,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                fontWeight: 300,
                                color: '#2d3748',
                                fontFamily: '"Georgia", "Times New Roman", serif'
                            }}
                        >
                            Research Applications
                        </Typography>
                    </motion.div>

                    <Grid container spacing={4}>
                        {applications.map((app, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <motion.div variants={fadeInUp} style={{ height: '100%' }}>
                                    <Paper sx={{
                                        p: 4,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        bgcolor: '#fefefe',
                                        border: '1px solid #e2e8f0',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: '0 8px 25px rgba(45, 55, 72, 0.08)',
                                            borderColor: '#cbd5e0'
                                        }
                                    }}>
                                        <Typography variant="h5" sx={{
                                            mb: 3,
                                            fontWeight: 400,
                                            color: '#2d3748',
                                            fontFamily: '"Georgia", "Times New Roman", serif'
                                        }}>
                                            {app.title}
                                        </Typography>
                                        <Box component="ul" sx={{
                                            pl: 0,
                                            listStyle: 'none',
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2
                                        }}>
                                            {app.items.map((item, idx) => (
                                                <Box component="li" key={idx} sx={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start'
                                                }}>
                                                    <DotBridgeIcon name="ArrowRight" size={16} color="#2d3748" sx={{ mt: 0.5, mr: 2, flexShrink: 0 }} />
                                                    <Typography variant="body2" sx={{
                                                        fontFamily: '"Georgia", "Times New Roman", serif',
                                                        lineHeight: 1.6
                                                    }}>{item}</Typography>
                                                </Box>
                                            ))}
                                        </Box>
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

// Demo Section
const DemoSection = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <Box ref={ref} sx={{ py: { xs: 8, md: 12 }, bgcolor: '#fefefe', borderBottom: '1px solid #e2e8f0' }}>
            <Container maxWidth="lg">
                <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={staggerChildren}
                >
                    <motion.div variants={fadeInUp}>
                        <Typography
                            variant="h2"
                            align="center"
                            sx={{
                                mb: 3,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                fontWeight: 300,
                                color: '#2d3748',
                                fontFamily: '"Georgia", "Times New Roman", serif'
                            }}
                        >
                            Interactive System Demonstration
                        </Typography>
                        <Typography
                            variant="h6"
                            align="center"
                            color="text.secondary"
                            sx={{
                                mb: 6,
                                maxWidth: '600px',
                                mx: 'auto',
                                fontWeight: 300,
                                fontFamily: '"Georgia", "Times New Roman", serif',
                                fontStyle: 'italic'
                            }}
                        >
                            Experience the multimodal knowledge extraction framework in operation
                        </Typography>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                        <Box sx={{
                            maxWidth: '1000px',
                            mx: 'auto',
                            borderRadius: 3,
                            overflow: 'hidden',
                            boxShadow: '0 20px 60px rgba(26, 54, 93, 0.15)',
                            bgcolor: '#ffffff',
                            aspectRatio: '16 / 10'
                        }}>
                            {/* Browser chrome */}
                            <Box sx={{
                                p: 1.5,
                                borderBottom: '1px solid #e2e8f0',
                                bgcolor: '#f8fafc',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff5f57' }} />
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#28ca42' }} />
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{
                                    flex: 1,
                                    textAlign: 'center',
                                    fontWeight: 400,
                                    fontFamily: '"Georgia", "Times New Roman", serif'
                                }}>
                                    DotBridge Research Framework - Interactive Demo
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
                    </motion.div>
                </motion.div>
            </Container>
        </Box>
    );
};

// About Section
const AboutSection = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <Box ref={ref} sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
            <Container maxWidth="lg">
                <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={staggerChildren}
                >
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <motion.div variants={fadeInUp}>
                                <Typography variant="h3" sx={{
                                    mb: 4,
                                    fontWeight: 300,
                                    color: '#2d3748',
                                    fontFamily: '"Georgia", "Times New Roman", serif'
                                }}>
                                    Research Background
                                </Typography>
                                <Typography variant="body1" sx={{
                                    mb: 4,
                                    fontSize: '1.125rem',
                                    lineHeight: 1.7,
                                    color: '#4a5568',
                                    fontFamily: '"Georgia", "Times New Roman", serif'
                                }}>
                                    DotBridge was developed to explore systematic approaches to multimodal knowledge extraction,
                                    real-time agent architectures, and structured content analysis. Originally conceived as a commercial
                                    application, the framework is now open-sourced to advance academic research in knowledge graph
                                    construction from unstructured multimodal sources.
                                </Typography>
                                <Typography variant="body1" sx={{
                                    mb: 4,
                                    fontSize: '1.125rem',
                                    lineHeight: 1.7,
                                    color: '#4a5568',
                                    fontFamily: '"Georgia", "Times New Roman", serif'
                                }}>
                                    The system demonstrates novel techniques for production-scale multimodal AI deployment,
                                    with particular relevance to alternative data processing in quantitative finance,
                                    automated research workflows, and conversational AI systems.
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                    <Button
                                        variant="outlined"
                                        href="https://journeymanai.io"
                                        target="_blank"
                                        sx={{
                                            borderColor: '#2d3748',
                                            color: '#2d3748',
                                            fontFamily: '"Georgia", "Times New Roman", serif',
                                            fontWeight: 400,
                                            '&:hover': {
                                                borderColor: '#4a5568',
                                                backgroundColor: 'rgba(45, 55, 72, 0.05)'
                                            }
                                        }}
                                    >
                                        Principal Investigator
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        href="https://github.com/your-username/dotbridge"
                                        target="_blank"
                                        sx={{
                                            borderColor: '#2d3748',
                                            color: '#2d3748',
                                            fontFamily: '"Georgia", "Times New Roman", serif',
                                            fontWeight: 400,
                                            '&:hover': {
                                                borderColor: '#4a5568',
                                                backgroundColor: 'rgba(45, 55, 72, 0.05)'
                                            }
                                        }}
                                    >
                                        Research Repository
                                    </Button>
                                </Box>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <motion.div variants={fadeInUp}>
                                <Paper sx={{
                                    p: 4,
                                    bgcolor: '#fefefe',
                                    border: '1px solid #e2e8f0',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 8px 25px rgba(45, 55, 72, 0.08)',
                                        borderColor: '#cbd5e0'
                                    }
                                }}>
                                    <Typography variant="h6" sx={{
                                        mb: 3,
                                        color: '#2d3748',
                                        fontWeight: 400,
                                        fontFamily: '"Georgia", "Times New Roman", serif'
                                    }}>
                                        Research Focus Areas
                                    </Typography>
                                    <Box component="ul" sx={{ pl: 0, listStyle: 'none' }}>
                                        {[
                                            'Multimodal content analysis',
                                            'Knowledge graph construction',
                                            'Real-time agent systems',
                                            'Structured data extraction',
                                            'Production ML frameworks'
                                        ].map((item, idx) => (
                                            <Box component="li" key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <DotBridgeIcon name="Check" size={16} sx={{ mr: 2, color: '#2d3748' }} />
                                                <Typography variant="body2" sx={{
                                                    color: '#4a5568',
                                                    fontFamily: '"Georgia", "Times New Roman", serif',
                                                    lineHeight: 1.6
                                                }}>{item}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>
                    </Grid>
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