import React, { useState, useRef } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    TextField,
    Chip,
    styled,
    useTheme,
    useMediaQuery,
    Tabs,
    Tab,
    Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle, ArrowRight, Sparkles, Smartphone, Bot, BarChart3, Zap, Lightbulb, Rocket, Share2 } from 'lucide-react';
import { FunnelProvider, useFunnel } from '../contexts/FunnelContext';
import AIChatBlock from '../components/blocks/AIChatBlock';
import SystemDiagramPanel from '../components/blocks/SystemDiagramPanel';
import ProposalOutputBlock from '../components/blocks/ProposalOutputBlock';
import AsyncTicketBlock from '../components/blocks/AsyncTicketBlock';
import Footer from '../components/Footer';
import DotBridgeButton from '../components/DotBridgeButton';
import DotBridgeTypography from '../components/DotBridgeTypography';
import DotBridgeCard from '../components/DotBridgeCard';

const HeroSectionWrapper = styled(Box)(({ theme }) => ({
    background: `linear-gradient(135deg, ${theme.palette.primary.lighter}20 0%, ${theme.palette.background.paper} 100%)`,
    padding: theme.spacing(6, 0, 8, 0),
    position: 'relative',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(4, 0, 6, 0),
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: -150,
        right: -150,
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`,
        filter: 'blur(80px)',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -200,
        left: -200,
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.palette.secondary.main}10 0%, transparent 70%)`,
        filter: 'blur(100px)',
    }
}));

const ExpertiseCard = ({ icon, title, description }) => {
    const theme = useTheme();
    return (
        <motion.div whileHover={{ y: -5 }} style={{ height: '100%' }}>
            <DotBridgeCard
                sx={{
                    p: { xs: 2, md: 3 },
                    height: '100%',
                    border: `1px solid ${theme.palette.divider}`,
                    background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.subtle})`,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: `0 8px 24px ${theme.palette.primary.main}20`,
                        transform: 'translateY(-5px)'
                    },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                        width: 48, height: 48, borderRadius: 2, background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}05)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', mr: 2
                    }}>
                        {icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} sx={{ fontSize: '1.1rem' }}>{title}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">{description}</Typography>
            </DotBridgeCard>
        </motion.div>
    );
};

// Inner component that uses the funnel context
const AIConsultingServicesContent = () => {
    const theme = useTheme();
    const isLgDown = useMediaQuery(theme.breakpoints.down('lg'));
    const { proposalData, chatHistory } = useFunnel();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [sessionStarted, setSessionStarted] = useState(false);
    const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [activeTab, setActiveTab] = useState(0);
    const leadFormRef = useRef(null);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const expertiseAreas = [
        { icon: <Rocket size={24} />, title: 'MVP & Proof of Concept', description: 'Quickly validate your AI ideas with a functional prototype. We build lean, effective MVPs to test assumptions and demonstrate value to stakeholders.' },
        { icon: <Smartphone size={24} />, title: 'Custom Application Development', description: 'From mobile apps to enterprise web platforms, we build scalable, user-centric applications powered by intelligent features.' },
        { icon: <Bot size={24} />, title: 'Autonomous AI Agents', description: 'Deploy intelligent agents to automate complex workflows, handle customer interactions, and operate business processes 24/7.' },
        { icon: <BarChart3 size={24} />, title: 'Data Analytics & Insights', description: 'Turn your raw data into a strategic asset. We build dashboards and data models that uncover actionable insights and drive decisions.' },
        { icon: <Zap size={24} />, title: 'Workflow Automation', description: 'Eliminate manual tasks and streamline operations. We identify and build custom automations that save time and reduce errors.' },
        { icon: <Lightbulb size={24} />, title: 'Strategic AI Consulting', description: 'Beyond code, we provide strategic guidance to align your AI initiatives with your core business objectives for maximum impact.' },
    ];

    // Configuration for the AI strategist
    const AI_STRATEGIST_CONFIG = {
        agentType: 'ai_consultant',
        systemPrompt: `You are an elite AI strategist and solutions architect with deep expertise in LLMs, machine learning, data pipelines, and AI product development.

Your goal is to conduct a sophisticated discovery session that uncovers:

1. **Business Impact & ROI**
   - What specific business metrics will this AI solution improve?
   - What's the cost of NOT solving this problem?
   - What's their expected ROI timeline?

2. **Technical Architecture & Data Readiness**
   - Current data infrastructure (databases, APIs, data lakes)
   - Data quality and volume (structured/unstructured)
   - Existing ML/AI tools and frameworks
   - Integration requirements with current systems
   - Security and compliance requirements

3. **Project Scope & Complexity**
   - Is this a proof-of-concept, pilot, or production system?
   - User scale and performance requirements
   - Edge cases and failure modes to consider
   - Success criteria and KPIs

4. **Team & Resources**
   - Internal technical capabilities (who will maintain this?)
   - Previous AI/ML project experience
   - Budget range and timeline constraints
   - Decision-making process and stakeholders

5. **Strategic Considerations**
   - Competitive advantage sought
   - Build vs. buy vs. hybrid approach
   - Long-term vision and roadmap
   - Risk tolerance and innovation appetite

Ask ONE focused question at a time. Listen actively and dig deeper based on their responses. 

After 5-7 substantive exchanges, synthesize their needs and suggest moving to proposal generation.

Your tone should be that of a trusted advisor - confident, insightful, and genuinely interested in their success.`,
        initialMessage: "Hey! I'm Levi, your AI strategist. I help companies build custom AI systems, websites, and data-driven applications. \n\nWhat are you looking to tackle?",
        endConversationCtaText: "Generate My Custom Solution Proposal"
    };

    const handleStartSession = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }
        setEmailError('');
        setSessionStarted(true);
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box component="main" sx={{ flex: '1 0 auto' }}>
                <HeroSectionWrapper ref={headerRef}>
                    <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={headerInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6 }}
                        >
                            <Chip
                                icon={<Sparkles size={16} />}
                                label="AI CONSULTING SERVICES"
                                sx={{
                                    mb: 3,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.primary.light}30 100%)`,
                                    color: theme.palette.primary.dark,
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.05em',
                                    px: 2,
                                    py: 0.5,
                                    border: '1px solid',
                                    borderColor: theme.palette.primary.light,
                                    boxShadow: '0 4px 12px rgba(0, 102, 255, 0.15)',
                                    '& .MuiChip-icon': {
                                        color: theme.palette.primary.main
                                    }
                                }}
                            />
                            <DotBridgeTypography
                                variant="h1"
                                sx={{
                                    mb: { xs: 2, sm: 3 },
                                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem', lg: '4.5rem' },
                                    fontWeight: 800,
                                    lineHeight: { xs: 1.2, md: 1.1 },
                                    letterSpacing: '-0.02em',
                                    px: { xs: 1, sm: 0 }
                                }}
                            >
                                <Box component="span" sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: 'block'
                                }}>
                                    Transform Your AI Vision
                                </Box>
                                <Box component="span" sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: 'block',
                                    mt: 0.5
                                }}>
                                    Into Tangible Reality.
                                </Box>
                            </DotBridgeTypography>
                            <DotBridgeTypography
                                variant="h5"
                                sx={{
                                    mb: { xs: 4, sm: 5 },
                                    color: theme.palette.text.secondary,
                                    maxWidth: '800px',
                                    mx: 'auto',
                                    lineHeight: 1.6,
                                    fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                                    fontWeight: 400,
                                    px: { xs: 2, sm: 1, md: 0 }
                                }}
                            >
                                Whether you need strategic guidance for AI adoption, technical architecture for complex systems, or hands-on implementation support — our AI solutions architects deliver results that matter.
                            </DotBridgeTypography>

                            {!sessionStarted && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        gap: 2,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        maxWidth: '600px',
                                        mx: 'auto',
                                        mt: 5
                                    }}>
                                        <TextField
                                            variant="outlined"
                                            placeholder="Enter your email to begin"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            error={!!emailError}
                                            helperText={emailError}
                                            fullWidth
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    bgcolor: 'background.paper',
                                                }
                                            }}
                                        />
                                        <DotBridgeButton
                                            variant="contained"
                                            onClick={handleStartSession}
                                            endIcon={<ArrowRight size={20} />}
                                            sx={{
                                                px: { xs: 3, sm: 4 },
                                                py: { xs: 1.5, sm: '15.5px' },
                                                fontSize: { xs: '1rem', sm: '1.125rem' },
                                                fontWeight: 600,
                                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                boxShadow: '0 10px 30px rgba(0, 102, 255, 0.3)',
                                                borderRadius: 2,
                                                width: { xs: '100%', sm: 'auto' },
                                                flexShrink: 0,
                                                '&:hover': {
                                                    transform: 'translateY(-3px)',
                                                    boxShadow: '0 15px 40px rgba(0, 102, 255, 0.4)'
                                                }
                                            }}
                                        >
                                            Start Session
                                        </DotBridgeButton>
                                    </Box>
                                </motion.div>
                            )}
                        </motion.div>
                    </Container>
                </HeroSectionWrapper>

                {/* AI Chat / Expertise Section */}
                <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 }, px: { xs: 2, sm: 3 } }}>
                    {!sessionStarted ? (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <Box>
                                <DotBridgeTypography variant="h2" sx={{ textAlign: 'center', mb: 1, fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }}>
                                    Our Expertise, Your Advantage
                                </DotBridgeTypography>
                                <DotBridgeTypography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mb: { xs: 4, md: 6 }, fontWeight: 400, maxWidth: '700px', mx: 'auto' }}>
                                    We don't just build technology. We build solutions that solve real-world business problems and create lasting value.
                                </DotBridgeTypography>
                                <Grid container spacing={3}>
                                    {expertiseAreas.map((item, index) => (
                                        <Grid item xs={12} sm={6} lg={4} key={index}>
                                            <ExpertiseCard icon={item.icon} title={item.title} description={item.description} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </motion.div>
                    ) : !proposalData ? (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <Box sx={{ px: { xs: 0, sm: 1, md: 3 }, py: { xs: 2, md: 4 } }}>
                                <DotBridgeTypography variant="h2" sx={{ textAlign: 'center', mb: 1, fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }}>
                                    AI Strategy Session
                                </DotBridgeTypography>
                                <DotBridgeTypography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mb: 4, fontWeight: 400 }}>
                                    Chat with our AI strategist to define your project scope and goals.
                                </DotBridgeTypography>
                                {isLgDown ? (
                                    <>
                                        <Paper square sx={{
                                            borderBottom: 1, borderColor: 'divider', mb: 2, background: 'transparent',
                                            position: 'sticky', top: 0, zIndex: 10,
                                            backdropFilter: 'blur(8px)',
                                            backgroundColor: `${theme.palette.background.paper}99`
                                        }}>
                                            <Tabs
                                                value={activeTab}
                                                onChange={handleTabChange}
                                                variant="fullWidth"
                                                indicatorColor="primary"
                                                textColor="primary"
                                            >
                                                <Tab icon={<Bot size={18} />} iconPosition="start" label="AI Strategist" />
                                                <Tab icon={<Share2 size={18} />} iconPosition="start" label="Live Architecture" />
                                            </Tabs>
                                        </Paper>
                                        <Box>
                                            <Box hidden={activeTab !== 0}>
                                                <AIChatBlock
                                                    agentType={AI_STRATEGIST_CONFIG.agentType}
                                                    systemPrompt={AI_STRATEGIST_CONFIG.systemPrompt}
                                                    initialMessage={AI_STRATEGIST_CONFIG.initialMessage}
                                                    endConversationCtaText={AI_STRATEGIST_CONFIG.endConversationCtaText}
                                                />
                                            </Box>
                                            <Box hidden={activeTab !== 1}>
                                                <SystemDiagramPanel chatHistory={chatHistory} />
                                            </Box>
                                        </Box>
                                    </>
                                ) : (
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} lg={6}>
                                            <AIChatBlock
                                                agentType={AI_STRATEGIST_CONFIG.agentType}
                                                systemPrompt={AI_STRATEGIST_CONFIG.systemPrompt}
                                                initialMessage={AI_STRATEGIST_CONFIG.initialMessage}
                                                endConversationCtaText={AI_STRATEGIST_CONFIG.endConversationCtaText}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6}>
                                            <Box sx={{ position: 'sticky', top: { lg: 20 }, height: 'fit-content' }}>
                                                <SystemDiagramPanel chatHistory={chatHistory} />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                )}
                            </Box>
                        </motion.div>
                    ) : (
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7 }}
                            >
                                <Box sx={{ px: { xs: 0, sm: 1, md: 3 }, py: { xs: 2, md: 4 } }}>
                                    <DotBridgeTypography variant="h2" sx={{ textAlign: 'center', mb: 1, fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }}>
                                        AI Strategy Session
                                    </DotBridgeTypography>
                                    <DotBridgeTypography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mb: 4, fontWeight: 400 }}>
                                        Chat with our AI strategist to define your project scope and goals.
                                    </DotBridgeTypography>
                                    {isLgDown ? (
                                        <>
                                            <Paper square sx={{
                                                borderBottom: 1, borderColor: 'divider', mb: 2, background: 'transparent',
                                                position: 'sticky', top: 0, zIndex: 10,
                                                backdropFilter: 'blur(8px)',
                                                backgroundColor: `${theme.palette.background.paper}99`
                                            }}>
                                                <Tabs
                                                    value={activeTab}
                                                    onChange={handleTabChange}
                                                    variant="fullWidth"
                                                    indicatorColor="primary"
                                                    textColor="primary"
                                                >
                                                    <Tab icon={<Bot size={18} />} iconPosition="start" label="AI Strategist" />
                                                    <Tab icon={<Share2 size={18} />} iconPosition="start" label="Live Architecture" />
                                                </Tabs>
                                            </Paper>
                                            <Box>
                                                <Box hidden={activeTab !== 0}>
                                                    <AIChatBlock
                                                        agentType={AI_STRATEGIST_CONFIG.agentType}
                                                        systemPrompt={AI_STRATEGIST_CONFIG.systemPrompt}
                                                        initialMessage={AI_STRATEGIST_CONFIG.initialMessage}
                                                        endConversationCtaText={AI_STRATEGIST_CONFIG.endConversationCtaText}
                                                    />
                                                </Box>
                                                <Box hidden={activeTab !== 1}>
                                                    <SystemDiagramPanel chatHistory={chatHistory} />
                                                </Box>
                                            </Box>
                                        </>
                                    ) : (
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} lg={6}>
                                                <AIChatBlock
                                                    agentType={AI_STRATEGIST_CONFIG.agentType}
                                                    systemPrompt={AI_STRATEGIST_CONFIG.systemPrompt}
                                                    initialMessage={AI_STRATEGIST_CONFIG.initialMessage}
                                                    endConversationCtaText={AI_STRATEGIST_CONFIG.endConversationCtaText}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={6}>
                                                <Box sx={{ position: 'sticky', top: { lg: 20 }, height: 'fit-content' }}>
                                                    <SystemDiagramPanel chatHistory={chatHistory} />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    )}
                                </Box>
                            </motion.div>
                            {proposalData && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7 }}
                                >
                                    <DotBridgeTypography variant="h2" sx={{ textAlign: 'center', my: 4, fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }}>
                                        Your Custom Proposal
                                    </DotBridgeTypography>
                                    <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
                                        <Grid item xs={12} lg={8}>
                                            <ProposalOutputBlock leadFormRef={leadFormRef} />
                                        </Grid>
                                        <Grid item xs={12} lg={4} ref={leadFormRef}>
                                            <Box sx={{ position: 'sticky', top: { lg: 20 }, height: 'fit-content' }}>
                                                <AsyncTicketBlock />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </motion.div>
                            )}
                        </>
                    )}
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

// Main component that provides the context
const AIConsultingServices = () => {
    return (
        <FunnelProvider funnelType="ai-consulting">
            <AIConsultingServicesContent />
        </FunnelProvider>
    );
};

export default AIConsultingServices; 