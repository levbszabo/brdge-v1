import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    Paper,
    useTheme,
    useMediaQuery,
    Divider,
    TextField,
    CircularProgress,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    Target,
    CheckCircle,
    MessageSquare,
    Calendar,
    Search,
    FileText,
    TrendingUp,
    Users,
    Star,
    ArrowRight,
    Sparkles,
    Rocket,
    Shield,
    Clock,
    Globe,
    Briefcase,
    Heart,
    Zap,
    Award,
    ChevronRight
} from 'lucide-react';
import Footer from '../components/Footer';
import DotBridgeButton from '../components/DotBridgeButton';
import DotBridgeTypography from '../components/DotBridgeTypography';
import DotBridgeCard from '../components/DotBridgeCard';
import AgentConnector from '../components/AgentConnector';

// Demo Bridge ID for the AI intake
const CAREER_DEMO_BRIDGE_ID = '448';

// Performance optimization
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: prefersReducedMotion ? 0.01 : 0.7,
            ease: "easeOut"
        }
    }
};

const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: prefersReducedMotion ? 0 : 0.15,
            delayChildren: prefersReducedMotion ? 0 : 0.2
        }
    }
};

const PageContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(10),
    },
}));

const HeroSection = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(8),
    padding: theme.spacing(6, 0),
    background: `linear-gradient(135deg, ${theme.palette.primary.lighter}20 0%, ${theme.palette.background.paper} 100%)`,
    borderRadius: theme.shape.borderRadius * 3,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`,
        filter: 'blur(60px)',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -150,
        left: -150,
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.palette.secondary.main}10 0%, transparent 70%)`,
        filter: 'blur(80px)',
    }
}));

const ProcessStep = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    transition: 'all 0.3s ease',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 20px 40px rgba(0, 102, 255, 0.15)',
        '& .step-icon': {
            transform: 'scale(1.1) rotate(5deg)',
        },
        '& .step-number': {
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        }
    },
}));

const PricingCard = styled(Paper)(({ theme, popular }) => ({
    padding: theme.spacing(4),
    border: popular ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius * 3,
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: popular ? theme.palette.primary.lighter : theme.palette.background.paper,
    boxShadow: popular ? `0 20px 60px ${theme.palette.primary.main}20` : theme.shadows[2],
    transition: 'all 0.3s ease',
    overflow: 'visible',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: popular ? `0 30px 80px ${theme.palette.primary.main}30` : theme.shadows[8],
    },
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3),
    height: '100%',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius * 2,
    background: theme.palette.background.paper,
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
        borderColor: theme.palette.primary.light,
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
        opacity: 0,
        transition: 'opacity 0.3s ease'
    },
    '&:hover::before': {
        opacity: 1
    }
}));

const CareerAcceleratorPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [problemRef, problemInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [processRef, processInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [showFloatingCTA, setShowFloatingCTA] = useState(false);

    // Demo section scroll animation
    const demoRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: demoRef,
        offset: ["start end", "end start"]
    });
    const rotateX = useTransform(scrollYProgress, [0, 0.5], isMobile ? [10, 0] : [15, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], isMobile ? [0.98, 1] : [0.97, 1]);

    // Lead form state
    const [lead, setLead] = useState({
        name: '',
        email: '',
        phone: '',
        currentRole: '',
        targetRole: '',
        experience: '',
        urgency: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Track scroll for floating CTA
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const threshold = window.innerHeight * 1.2;
            setShowFloatingCTA(scrolled > threshold);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const processSteps = [
        {
            icon: <Users size={36} />,
            number: "1",
            title: "Define Your Vision",
            description: "Share your résumé and career goals through our AI strategist. We help clarify your ideal role and target companies.",
            color: '#007AFF'
        },
        {
            icon: <FileText size={36} />,
            number: "2",
            title: "Résumé & Profile Polish",
            description: "Our AI analyzes your materials and provides actionable suggestions to optimize for your target roles.",
            color: '#5856D6'
        },
        {
            icon: <Search size={36} />,
            number: "3",
            title: "Intelligent Lead Generation",
            description: "We build a custom list of 50-100+ prospective employers and key hiring contacts who match your profile.",
            color: '#AF52DE'
        },
        {
            icon: <MessageSquare size={36} />,
            number: "4",
            title: "Craft Your Outreach Toolkit",
            description: "We generate compelling, personalized email and LinkedIn scripts designed to grab attention and get responses.",
            color: '#FF3B30'
        },
        {
            icon: <Calendar size={36} />,
            number: "5",
            title: "Launch Your Action Plan",
            description: "Receive a structured daily calendar detailing who to contact, when, and with what message.",
            color: '#34C759'
        }
    ];

    const pricingPlans = [
        {
            name: "STARTER",
            price: 149,
            originalPrice: 199,
            description: "Perfect for getting started",
            mainValue: "Everything you need to launch your targeted job search",
            features: [
                "AI Résumé Analysis & Optimization",
                "50 Targeted Employer Leads",
                "2 Outreach Message Templates",
                "7-Day Action Calendar",
                "Email Support"
            ],
            popular: false,
            color: 'grey'
        },
        {
            name: "PRO",
            price: 249,
            originalPrice: 399,
            description: "Most popular for serious job seekers",
            mainValue: "Comprehensive system with multi-channel outreach",
            features: [
                "Everything in Starter PLUS:",
                "75+ Targeted Leads with Contacts",
                "5 Outreach Templates (Email & LinkedIn)",
                "Personalized 14-Day Calendar",
                "Priority Email Support",
                "Follow-up Strategy Guide"
            ],
            popular: true,
            color: 'primary'
        },
        {
            name: "PREMIUM",
            price: 399,
            originalPrice: 699,
            description: "Maximum support & guidance",
            mainValue: "White-glove service with personal coaching",
            features: [
                "Everything in Pro PLUS:",
                "100+ Premium Leads & Contacts",
                "DotBridge Video Intro Setup",
                "Personal Strategy Call (30 min)",
                "Reply Coaching & Templates",
                "90-Day Success Tracking"
            ],
            popular: false,
            color: 'success'
        }
    ];

    const testimonials = [
        {
            quote: "The targeted employer list and custom scripts were a game-changer. I went from 0 responses to 3 interviews in my first two weeks!",
            name: "Sarah K.",
            role: "Marketing Manager",
            background: "Previously Retail",
            rating: 5
        },
        {
            quote: "As a new RN targeting med spas, I had no clue where to start. This system gave me direct contacts and confidence. Got my first offer in a month!",
            name: "Tracy M.",
            role: "Registered Nurse",
            background: "Med Spa Transition",
            rating: 5
        },
        {
            quote: "After my bootcamp, I was lost in the job search. The AI Career Accelerator gave me a clear roadmap and I landed my dream dev role!",
            name: "Mike D.",
            role: "Software Developer",
            background: "Bootcamp Graduate",
            rating: 5
        }
    ];

    const targetPersonas = [
        { icon: <Rocket />, text: "Recent Tech Bootcamp Graduates", color: '#007AFF' },
        { icon: <Briefcase />, text: "Mid-Career Professionals Switching Industries", color: '#5856D6' },
        { icon: <Heart />, text: "Nurses & Clinicians Targeting Private Practice", color: '#FF3B30' },
        { icon: <TrendingUp />, text: "Sales/CS Reps Looking to Level Up", color: '#34C759' },
        { icon: <Globe />, text: "International Candidates Breaking Into New Markets", color: '#AF52DE' },
        { icon: <Award />, text: "Anyone Feeling Qualified but Invisible", color: '#FF9500' }
    ];

    const handleLeadSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
            setIsSubmitting(false);
        }, 1500);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLead(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <PageContainer maxWidth="lg">
                {/* Hero Section - Enhanced */}
                <Box ref={headerRef}>
                    <HeroSection>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={headerInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={headerInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Chip
                                    icon={<Sparkles size={16} />}
                                    label="AI-POWERED JOB SEARCH SYSTEM"
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
                            </motion.div>

                            <DotBridgeTypography
                                variant="h1"
                                sx={{
                                    mb: 3,
                                    fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                                    fontWeight: 800,
                                    lineHeight: { xs: 1.2, md: 1.1 },
                                    letterSpacing: '-0.02em'
                                }}
                            >
                                <Box component="span" sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: 'block'
                                }}>
                                    Land Interviews,
                                </Box>
                                <Box component="span" sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: 'block',
                                    mt: 0.5
                                }}>
                                    Not Ghosted
                                </Box>
                            </DotBridgeTypography>

                            <DotBridgeTypography
                                variant="h5"
                                sx={{
                                    mb: 5,
                                    color: theme.palette.text.secondary,
                                    maxWidth: '800px',
                                    mx: 'auto',
                                    lineHeight: 1.6,
                                    fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                                    fontWeight: 400
                                }}
                            >
                                Stop applying blindly. We build you a
                                <Box component="span" sx={{
                                    fontWeight: 600,
                                    color: theme.palette.primary.main,
                                    mx: 0.5
                                }}>
                                    personalized outreach strategy
                                </Box>
                                —identifying ideal employers, crafting compelling messages, and providing a step-by-step daily plan—to get you seen by the right people.
                            </DotBridgeTypography>

                            {/* CTA Buttons */}
                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                justifyContent: 'center',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: 'center',
                                px: { xs: 2, sm: 0 }
                            }}>
                                <DotBridgeButton
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowRight size={20} />}
                                    sx={{
                                        px: 4,
                                        py: 1.75,
                                        fontSize: '1.125rem',
                                        fontWeight: 600,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                        boxShadow: '0 10px 30px rgba(0, 102, 255, 0.3)',
                                        borderRadius: 2,
                                        width: { xs: '100%', sm: 'auto' },
                                        '&:hover': {
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 15px 40px rgba(0, 102, 255, 0.4)'
                                        }
                                    }}
                                    onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    Start Building My Plan
                                </DotBridgeButton>

                                <DotBridgeButton
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        px: 4,
                                        py: 1.75,
                                        fontSize: '1.125rem',
                                        fontWeight: 600,
                                        borderWidth: 2,
                                        borderColor: theme.palette.primary.main,
                                        color: theme.palette.primary.main,
                                        borderRadius: 2,
                                        width: { xs: '100%', sm: 'auto' },
                                        '&:hover': {
                                            borderWidth: 2,
                                            backgroundColor: theme.palette.primary.lighter,
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                    onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    View Pricing
                                </DotBridgeButton>
                            </Box>

                            {/* Trust Indicators */}
                            <Box sx={{
                                mt: 5,
                                display: 'flex',
                                gap: 3,
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                                px: 2
                            }}>
                                {[
                                    { icon: <Shield size={20} />, text: "100% Money-Back Guarantee" },
                                    { icon: <Clock size={20} />, text: "48-72 Hour Delivery" },
                                    { icon: <Users size={20} />, text: "500+ Success Stories" }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            color: theme.palette.text.secondary,
                                            fontSize: '0.875rem'
                                        }}>
                                            <Box sx={{ color: theme.palette.primary.main }}>
                                                {item.icon}
                                            </Box>
                                            {item.text}
                                        </Box>
                                    </motion.div>
                                ))}
                            </Box>
                        </motion.div>
                    </HeroSection>
                </Box>

                {/* Problem Section - Enhanced */}
                <Box ref={problemRef} sx={{ mb: 10, textAlign: 'center', py: 6 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={problemInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7 }}
                    >
                        <DotBridgeTypography variant="h2" sx={{
                            mb: 3,
                            fontWeight: 700,
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                        }}>
                            Tired of Sending Your Résumé Into the
                            <Box component="span" sx={{
                                color: theme.palette.primary.main,
                                display: 'block'
                            }}>
                                Black Hole?
                            </Box>
                        </DotBridgeTypography>

                        <DotBridgeTypography variant="body1" sx={{
                            mb: 5,
                            maxWidth: '700px',
                            mx: 'auto',
                            fontSize: '1.125rem',
                            lineHeight: 1.7,
                            color: theme.palette.text.secondary
                        }}>
                            You're qualified. You've polished your résumé countless times. You spend hours on job boards,
                            hitting "apply" only to hear… <strong>silence</strong>. It's frustrating, demoralizing, and feels
                            like a full-time job with no paycheck.
                        </DotBridgeTypography>

                        {/* Pain Points Grid */}
                        <Grid container spacing={3} sx={{ maxWidth: '900px', mx: 'auto', mb: 5 }}>
                            {[
                                { icon: <Target />, stat: "200+", label: "Average applications sent", color: '#FF3B30' },
                                { icon: <MessageSquare />, stat: "2%", label: "Typical response rate", color: '#FF9500' },
                                { icon: <Clock />, stat: "40hrs", label: "Weekly job search time", color: '#AF52DE' },
                                { icon: <TrendingUp />, stat: "6mo+", label: "Average search duration", color: '#5856D6' }
                            ].map((item, index) => (
                                <Grid item xs={6} md={3} key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={problemInView ? { opacity: 1, scale: 1 } : {}}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <Box sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            bgcolor: theme.palette.background.paper,
                                            border: '1px solid',
                                            borderColor: theme.palette.divider,
                                            textAlign: 'center',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: theme.shadows[4],
                                                borderColor: item.color
                                            }
                                        }}>
                                            <Box sx={{ color: item.color, mb: 1 }}>
                                                {React.cloneElement(item.icon, { size: 32 })}
                                            </Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700, color: item.color }}>
                                                {item.stat}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {item.label}
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={problemInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Box sx={{
                                p: 4,
                                borderRadius: 3,
                                background: `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.primary.light}30 100%)`,
                                border: `2px solid ${theme.palette.primary.light}`,
                                maxWidth: '700px',
                                mx: 'auto',
                                boxShadow: '0 10px 30px rgba(0, 102, 255, 0.1)'
                            }}>
                                <DotBridgeTypography variant="h4" sx={{
                                    fontWeight: 600,
                                    color: theme.palette.primary.dark,
                                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                                }}>
                                    You don't need another résumé template.
                                    <Box component="span" sx={{ display: 'block', mt: 1 }}>
                                        You need a system that puts you directly in front of decision-makers.
                                    </Box>
                                </DotBridgeTypography>
                            </Box>
                        </motion.div>
                    </motion.div>
                </Box>

                {/* Solution Section - Enhanced */}
                <Box sx={{ mb: 10 }}>
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7 }}
                            >
                                <DotBridgeTypography variant="h2" sx={{
                                    mb: 3,
                                    fontWeight: 700,
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '2.75rem' }
                                }}>
                                    We Build Your
                                    <Box component="span" sx={{
                                        color: theme.palette.primary.main,
                                        display: 'block'
                                    }}>
                                        Personalized Job Outreach Engine
                                    </Box>
                                </DotBridgeTypography>
                                <DotBridgeTypography variant="body1" sx={{
                                    mb: 4,
                                    fontSize: '1.125rem',
                                    lineHeight: 1.7,
                                    color: theme.palette.text.secondary
                                }}>
                                    The AI Career Accelerator is a comprehensive service that transforms your job search
                                    from a guessing game into a targeted campaign. We handle the heavy lifting of strategy
                                    and preparation, so you can focus on what matters: acing interviews and landing your dream role.
                                </DotBridgeTypography>

                                {/* Benefits List */}
                                <Box sx={{ mt: 4 }}>
                                    {[
                                        "Get responses from 10-20% of your outreach (vs. 2% industry average)",
                                        "Save 30+ hours per week on job search activities",
                                        "Access hidden job market (70% of roles never posted)",
                                        "Stand out with personalized, strategic messaging"
                                    ].map((benefit, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                        >
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                mb: 2,
                                                p: 2,
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    bgcolor: theme.palette.primary.lighter,
                                                    transform: 'translateX(8px)'
                                                }
                                            }}>
                                                <CheckCircle size={20} color={theme.palette.primary.main} style={{ marginTop: 2, flexShrink: 0 }} />
                                                <Typography variant="body1" sx={{ ml: 2, fontWeight: 500 }}>
                                                    {benefit}
                                                </Typography>
                                            </Box>
                                        </motion.div>
                                    ))}
                                </Box>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7 }}
                            >
                                <Grid container spacing={2}>
                                    {[
                                        {
                                            icon: <Target />,
                                            from: "Aimlessly applying to hundreds of jobs",
                                            to: "Precisely targeting 50-100+ ideal employers",
                                            gradient: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)'
                                        },
                                        {
                                            icon: <MessageSquare />,
                                            from: "Generic résumés getting ignored",
                                            to: "Custom-crafted outreach messages that get replies",
                                            gradient: 'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)'
                                        },
                                        {
                                            icon: <Calendar />,
                                            from: "Overwhelm and uncertainty",
                                            to: "Clear, daily action plan that keeps you focused",
                                            gradient: 'linear-gradient(135deg, #FF3B30 0%, #FF6B6B 100%)'
                                        },
                                        {
                                            icon: <TrendingUp />,
                                            from: "Radio silence and rejection",
                                            to: "Meaningful conversations and job offers",
                                            gradient: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)'
                                        }
                                    ].map((item, index) => (
                                        <Grid item xs={12} key={index}>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    p: 2.5,
                                                    borderRadius: 2,
                                                    bgcolor: theme.palette.background.paper,
                                                    border: '1px solid',
                                                    borderColor: theme.palette.divider,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        boxShadow: theme.shadows[4],
                                                        borderColor: theme.palette.primary.light,
                                                        '& .transformation-icon': {
                                                            transform: 'rotate(360deg)'
                                                        }
                                                    }
                                                }}>
                                                    <Box
                                                        className="transformation-icon"
                                                        sx={{
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: 2,
                                                            background: item.gradient,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: 'white',
                                                            transition: 'transform 0.6s ease',
                                                            flexShrink: 0
                                                        }}
                                                    >
                                                        {React.cloneElement(item.icon, { size: 24 })}
                                                    </Box>
                                                    <Box sx={{ ml: 2.5, flex: 1 }}>
                                                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through', mb: 0.5 }}>
                                                            {item.from}
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                                                            {item.to}
                                                        </Typography>
                                                    </Box>
                                                    <ChevronRight size={20} color={theme.palette.primary.main} />
                                                </Box>
                                            </motion.div>
                                        </Grid>
                                    ))}
                                </Grid>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Box>

                {/* Process Section - Enhanced */}
                <Box ref={processRef} sx={{ mb: 10, py: 8, bgcolor: theme.palette.grey[50], borderRadius: 3 }}>
                    <Container>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={processInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7 }}
                        >
                            <DotBridgeTypography variant="h2" sx={{
                                textAlign: 'center',
                                mb: 2,
                                fontWeight: 700,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '2.75rem' }
                            }}>
                                Your Path to More Interviews
                                <Box component="span" sx={{
                                    color: theme.palette.primary.main,
                                    display: 'block'
                                }}>
                                    In 5 Simple Steps
                                </Box>
                            </DotBridgeTypography>

                            <DotBridgeTypography variant="h6" sx={{
                                textAlign: 'center',
                                mb: 6,
                                color: theme.palette.text.secondary,
                                maxWidth: '600px',
                                mx: 'auto'
                            }}>
                                From confused to confident in less than a week
                            </DotBridgeTypography>

                            <Grid container spacing={3}>
                                {processSteps.map((step, index) => (
                                    <Grid item xs={12} md={2.4} key={index}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={processInView ? { opacity: 1, y: 0 } : {}}
                                            transition={{ duration: 0.6, delay: index * 0.1 }}
                                            whileHover={{ y: -8 }}
                                        >
                                            <ProcessStep>
                                                <Box
                                                    className="step-number"
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        background: `linear-gradient(135deg, ${step.color}20 0%, ${step.color}10 100%)`,
                                                        border: `2px solid ${step.color}`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        position: 'absolute',
                                                        top: -20,
                                                        left: '50%',
                                                        transform: 'translateX(-50%)',
                                                        bgcolor: theme.palette.background.paper,
                                                        transition: 'all 0.3s ease',
                                                        fontWeight: 700,
                                                        fontSize: '1.125rem',
                                                        color: step.color
                                                    }}
                                                >
                                                    {step.number}
                                                </Box>
                                                <Box
                                                    className="step-icon"
                                                    sx={{
                                                        width: 72,
                                                        height: 72,
                                                        borderRadius: 3,
                                                        background: `linear-gradient(135deg, ${step.color}15 0%, ${step.color}05 100%)`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mb: 2,
                                                        mt: 3,
                                                        color: step.color,
                                                        transition: 'transform 0.3s ease'
                                                    }}
                                                >
                                                    {step.icon}
                                                </Box>
                                                <Typography variant="h6" fontWeight={600} sx={{ mb: 1, fontSize: '1rem' }}>
                                                    {step.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                                    {step.description}
                                                </Typography>
                                            </ProcessStep>
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Process Timeline for Mobile */}
                            <Box sx={{
                                display: { xs: 'block', md: 'none' },
                                position: 'relative',
                                mt: 4,
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: '50%',
                                    top: 0,
                                    bottom: 0,
                                    width: 2,
                                    bgcolor: theme.palette.primary.light,
                                    transform: 'translateX(-50%)'
                                }
                            }} />
                        </motion.div>
                    </Container>
                </Box>

                {/* Interactive Demo Section */}
                <Box id="demo-section" sx={{ mb: 10, py: 8 }}>
                    <motion.div
                        ref={demoRef}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <DotBridgeTypography variant="h2" sx={{
                            textAlign: 'center',
                            mb: 2,
                            fontWeight: 700,
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '2.75rem' }
                        }}>
                            Meet Your AI Career Strategist
                        </DotBridgeTypography>

                        <DotBridgeTypography variant="h6" sx={{
                            textAlign: 'center',
                            mb: 6,
                            color: theme.palette.text.secondary,
                            maxWidth: '700px',
                            mx: 'auto'
                        }}>
                            Chat with our AI assistant below. Upload your résumé or simply tell it about your career goals.
                            In minutes, it will analyze your needs and generate a free preview of your personalized outreach strategy.
                        </DotBridgeTypography>

                        <motion.div
                            style={{
                                perspective: isMobile ? '1000px' : '1500px',
                                perspectiveOrigin: '50% 30%'
                            }}
                        >
                            <motion.div
                                style={{
                                    rotateX: prefersReducedMotion ? 0 : rotateX,
                                    scale: prefersReducedMotion ? 1 : scale,
                                    transformStyle: 'preserve-3d',
                                    transformOrigin: '50% 100%'
                                }}
                            >
                                <Box sx={{
                                    maxWidth: '900px',
                                    mx: 'auto',
                                    position: 'relative',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    boxShadow: '0 30px 80px rgba(0, 102, 255, 0.15)',
                                    border: '2px solid',
                                    borderColor: theme.palette.primary.light,
                                    bgcolor: 'background.paper',
                                    aspectRatio: '16 / 9',
                                    transform: 'translateZ(0)',
                                    backfaceVisibility: 'hidden'
                                }}>
                                    {/* Demo Header */}
                                    <Box sx={{
                                        p: 2,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        background: `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.background.paper} 100%)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Sparkles size={20} color={theme.palette.primary.main} />
                                            <DotBridgeTypography variant="subtitle1" fontWeight={600}>
                                                AI Career Strategist
                                            </DotBridgeTypography>
                                        </Box>
                                        <Chip
                                            label="LIVE DEMO"
                                            size="small"
                                            color="primary"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Box>

                                    {/* Agent Connector */}
                                    <Box sx={{
                                        position: 'relative',
                                        height: 'calc(100% - 60px)',
                                        '& .agent-connector-container': {
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                        }
                                    }}>
                                        <div className="agent-connector-container">
                                            <AgentConnector
                                                brdgeId={CAREER_DEMO_BRIDGE_ID}
                                                agentType="view"
                                                token=""
                                                userId={null}
                                                isEmbed={false}
                                            />
                                        </div>
                                    </Box>
                                </Box>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </Box>

                {/* Target Audience Section - Enhanced */}
                <Box sx={{ mb: 10, py: 8, bgcolor: theme.palette.background.subtle, borderRadius: 3 }}>
                    <Container>
                        <DotBridgeTypography variant="h2" sx={{
                            textAlign: 'center',
                            mb: 4,
                            fontWeight: 700,
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '2.75rem' }
                        }}>
                            Is the AI Career Accelerator
                            <Box component="span" sx={{
                                color: theme.palette.primary.main,
                                display: 'block'
                            }}>
                                Right For You?
                            </Box>
                        </DotBridgeTypography>

                        <DotBridgeTypography variant="body1" sx={{
                            textAlign: 'center',
                            mb: 6,
                            fontSize: '1.125rem',
                            color: theme.palette.text.secondary,
                            maxWidth: '700px',
                            mx: 'auto'
                        }}>
                            This system is designed for ambitious professionals ready to take a proactive,
                            strategic approach to their job search. If you're...
                        </DotBridgeTypography>

                        <Grid container spacing={3}>
                            {targetPersonas.map((persona, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 3,
                                            borderRadius: 2,
                                            bgcolor: 'background.paper',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: theme.shadows[4],
                                                borderColor: persona.color,
                                                transform: 'translateX(8px)',
                                                '& .persona-icon': {
                                                    transform: 'scale(1.1) rotate(5deg)'
                                                }
                                            }
                                        }}>
                                            <Box
                                                className="persona-icon"
                                                sx={{
                                                    width: 56,
                                                    height: 56,
                                                    borderRadius: 2,
                                                    background: `linear-gradient(135deg, ${persona.color}20 0%, ${persona.color}10 100%)`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: persona.color,
                                                    transition: 'transform 0.3s ease',
                                                    flexShrink: 0,
                                                    mr: 3
                                                }}
                                            >
                                                {React.cloneElement(persona.icon, { size: 28 })}
                                            </Box>
                                            <Typography variant="body1" sx={{ fontWeight: 500, flex: 1 }}>
                                                {persona.text}
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <DotBridgeTypography variant="h4" sx={{
                                textAlign: 'center',
                                mt: 6,
                                fontWeight: 600,
                                color: theme.palette.primary.main,
                                fontSize: { xs: '1.5rem', sm: '1.75rem' }
                            }}>
                                If you're ready to stop waiting and start creating opportunities,
                                <Box component="span" sx={{ display: 'block', mt: 1 }}>
                                    this is for you.
                                </Box>
                            </DotBridgeTypography>
                        </motion.div>
                    </Container>
                </Box>

                {/* What You Get Section - Enhanced */}
                <Box sx={{ mb: 10 }}>
                    <DotBridgeTypography variant="h3" sx={{
                        textAlign: 'center',
                        mb: 6,
                        fontWeight: 600,
                        fontSize: { xs: '1.75rem', sm: '2.25rem' }
                    }}>
                        Your Complete Job Outreach System Includes:
                    </DotBridgeTypography>

                    <Grid container spacing={3} sx={{ maxWidth: '1000px', mx: 'auto' }}>
                        {[
                            {
                                icon: <FileText size={32} />,
                                title: "AI-Driven Résumé Analysis",
                                description: "Get specific, actionable feedback to optimize your résumé for ATS systems and human readers",
                                color: '#007AFF'
                            },
                            {
                                icon: <Search size={32} />,
                                title: "Curated Employer List",
                                description: "50-100+ targeted companies with direct decision-maker contacts who are likely to hire you",
                                color: '#5856D6'
                            },
                            {
                                icon: <MessageSquare size={32} />,
                                title: "Custom Outreach Templates",
                                description: "3-5 proven email & LinkedIn message templates personalized for your background and goals",
                                color: '#AF52DE'
                            },
                            {
                                icon: <Calendar size={32} />,
                                title: "Daily Action Calendar",
                                description: "Step-by-step roadmap showing exactly who to contact, when, and how to follow up",
                                color: '#FF3B30'
                            },
                            {
                                icon: <TrendingUp size={32} />,
                                title: "Response Tracking System",
                                description: "Simple spreadsheet to track your outreach, responses, and interview pipeline",
                                color: '#34C759'
                            },
                            {
                                icon: <Sparkles size={32} />,
                                title: "Bonus: Interview Prep Guide",
                                description: "Common questions, storytelling frameworks, and negotiation tips for your target roles",
                                color: '#FF9500'
                            }
                        ].map((item, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -4 }}
                                >
                                    <DotBridgeCard
                                        sx={{
                                            p: 3,
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 2,
                                            transition: 'all 0.3s ease',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            '&:hover': {
                                                borderColor: item.color,
                                                boxShadow: `0 8px 24px ${item.color}20`,
                                                '& .deliverable-icon': {
                                                    transform: 'scale(1.1) rotate(5deg)'
                                                }
                                            }
                                        }}
                                    >
                                        <Box
                                            className="deliverable-icon"
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: 2,
                                                background: `linear-gradient(135deg, ${item.color}20 0%, ${item.color}10 100%)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: item.color,
                                                flexShrink: 0,
                                                transition: 'transform 0.3s ease'
                                            }}
                                        >
                                            {item.icon}
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                                {item.description}
                                            </Typography>
                                        </Box>
                                    </DotBridgeCard>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Pricing Section - Enhanced */}
                <Box id="pricing" sx={{ mb: 10, py: 8 }}>
                    <DotBridgeTypography variant="h2" sx={{
                        textAlign: 'center',
                        mb: 2,
                        fontWeight: 700,
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '2.75rem' }
                    }}>
                        Choose Your
                        <Box component="span" sx={{
                            color: theme.palette.primary.main,
                            display: 'block'
                        }}>
                            Career Accelerator Package
                        </Box>
                    </DotBridgeTypography>

                    <DotBridgeTypography variant="h6" sx={{
                        textAlign: 'center',
                        mb: 6,
                        color: theme.palette.text.secondary,
                        maxWidth: '600px',
                        mx: 'auto'
                    }}>
                        Limited-time launch pricing - Save up to 43% off regular rates
                    </DotBridgeTypography>

                    <Grid container spacing={4} alignItems="stretch" sx={{ maxWidth: '1100px', mx: 'auto' }}>
                        {pricingPlans.map((plan, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    style={{ height: '100%' }}
                                >
                                    <PricingCard popular={plan.popular}>
                                        {plan.popular && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5, delay: 0.3 }}
                                            >
                                                <Box sx={{
                                                    position: 'absolute',
                                                    top: -16,
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    bgcolor: 'primary.main',
                                                    color: 'primary.contrastText',
                                                    px: 3,
                                                    py: 0.75,
                                                    borderRadius: '99px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.05em',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    boxShadow: '0 4px 12px rgba(0, 102, 255, 0.3)'
                                                }}>
                                                    <Star size={14} fill="currentColor" />
                                                    MOST POPULAR
                                                </Box>
                                            </motion.div>
                                        )}

                                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                                            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                                                {plan.name}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                                {plan.description}
                                            </Typography>

                                            <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', mb: 1 }}>
                                                <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through', mr: 1 }}>
                                                    ${plan.originalPrice}
                                                </Typography>
                                                <Typography variant="h2" fontWeight={800} color={plan.popular ? 'primary.main' : 'text.primary'}>
                                                    ${plan.price}
                                                </Typography>
                                            </Box>

                                            <Chip
                                                label={`Save $${plan.originalPrice - plan.price}`}
                                                color="error"
                                                size="small"
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </Box>

                                        <Box sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: plan.popular ? 'primary.lighter' : theme.palette.grey[50],
                                            mb: 3
                                        }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center' }}>
                                                {plan.mainValue}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ flexGrow: 1, mb: 3 }}>
                                            {plan.features.map((feature, featureIndex) => (
                                                <Box key={featureIndex} sx={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    mb: 2,
                                                    '&:hover': {
                                                        '& .feature-check': {
                                                            transform: 'scale(1.2)',
                                                            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
                                                        }
                                                    }
                                                }}>
                                                    <Box
                                                        className="feature-check"
                                                        sx={{
                                                            width: 20,
                                                            height: 20,
                                                            borderRadius: '50%',
                                                            bgcolor: plan.popular ? 'primary.main' : 'success.main',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            mr: 1.5,
                                                            mt: 0.25,
                                                            flexShrink: 0,
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        <CheckCircle size={14} color="white" />
                                                    </Box>
                                                    <Typography variant="body2" sx={{
                                                        fontWeight: feature.includes('PLUS:') ? 600 : 400,
                                                        color: feature.includes('PLUS:') ? 'primary.main' : 'text.secondary'
                                                    }}>
                                                        {feature}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>

                                        <DotBridgeButton
                                            variant={plan.popular ? "contained" : "outlined"}
                                            fullWidth
                                            size="large"
                                            sx={{
                                                mt: 'auto',
                                                py: 1.75,
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                ...(plan.popular && {
                                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                    boxShadow: '0 8px 24px rgba(0, 102, 255, 0.3)',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 12px 32px rgba(0, 102, 255, 0.4)'
                                                    }
                                                })
                                            }}
                                            onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
                                        >
                                            Get {plan.name} Plan →
                                        </DotBridgeButton>
                                    </PricingCard>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            All plans include a typical 48-72 hour turnaround for your personalized system delivery.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            30-day money-back guarantee. Payment plans available for Pro & Premium.
                        </Typography>
                    </Box>
                </Box>

                {/* Testimonials - Enhanced */}
                <Box sx={{ mb: 10, py: 8, bgcolor: theme.palette.grey[50], borderRadius: 3 }}>
                    <Container>
                        <DotBridgeTypography variant="h3" sx={{
                            textAlign: 'center',
                            mb: 6,
                            fontWeight: 600,
                            fontSize: { xs: '1.75rem', sm: '2.25rem' }
                        }}>
                            Success Stories From Job Seekers Like You
                        </DotBridgeTypography>

                        <Grid container spacing={4}>
                            {testimonials.map((testimonial, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        whileHover={{ y: -4 }}
                                        style={{ height: '100%' }}
                                    >
                                        <TestimonialCard>
                                            <Box sx={{ mb: 2 }}>
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} size={20} fill={theme.palette.warning.main} color={theme.palette.warning.main} />
                                                ))}
                                            </Box>

                                            <Typography variant="body1" sx={{
                                                mb: 3,
                                                fontStyle: 'italic',
                                                lineHeight: 1.7,
                                                color: theme.palette.text.secondary
                                            }}>
                                                "{testimonial.quote}"
                                            </Typography>

                                            <Divider sx={{ mb: 2 }} />

                                            <Box>
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    {testimonial.name}
                                                </Typography>
                                                <Typography variant="body2" color="primary.main" fontWeight={500}>
                                                    {testimonial.role}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {testimonial.background}
                                                </Typography>
                                            </Box>
                                        </TestimonialCard>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                {/* Lead Capture Form */}
                <Box id="lead-form" sx={{ mb: 10, py: 8 }}>
                    <Container maxWidth="sm">
                        <DotBridgeCard
                            sx={{
                                p: { xs: 3, md: 5 },
                                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.lighter}10 100%)`,
                                border: '2px solid',
                                borderColor: 'primary.light',
                                boxShadow: '0 20px 60px rgba(0, 102, 255, 0.1)'
                            }}
                        >
                            <DotBridgeTypography variant="h4" sx={{
                                textAlign: 'center',
                                mb: 2,
                                fontWeight: 700
                            }}>
                                Ready to Transform Your Job Search?
                            </DotBridgeTypography>

                            <DotBridgeTypography variant="body1" sx={{
                                textAlign: 'center',
                                mb: 4,
                                color: theme.palette.text.secondary
                            }}>
                                Get instant access to your personalized job search strategy.
                                Limited spots available at launch pricing.
                            </DotBridgeTypography>

                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <CheckCircle size={64} color={theme.palette.success.main} />
                                        <Typography variant="h5" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                                            You're All Set!
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Check your email for next steps. We'll be in touch within 24 hours.
                                        </Typography>
                                    </Box>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleLeadSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Full Name"
                                                name="name"
                                                value={lead.name}
                                                onChange={handleInputChange}
                                                required
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                name="email"
                                                type="email"
                                                value={lead.email}
                                                onChange={handleInputChange}
                                                required
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Phone (Optional)"
                                                name="phone"
                                                value={lead.phone}
                                                onChange={handleInputChange}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl component="fieldset">
                                                <FormLabel component="legend" sx={{ mb: 1 }}>
                                                    How urgently do you need to land a new role?
                                                </FormLabel>
                                                <RadioGroup
                                                    name="urgency"
                                                    value={lead.urgency}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <FormControlLabel value="asap" control={<Radio />} label="ASAP - I need income now" />
                                                    <FormControlLabel value="1-3months" control={<Radio />} label="1-3 months - Active search" />
                                                    <FormControlLabel value="3-6months" control={<Radio />} label="3-6 months - Exploring options" />
                                                    <FormControlLabel value="passive" control={<Radio />} label="Just keeping options open" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <DotBridgeButton
                                                type="submit"
                                                variant="contained"
                                                fullWidth
                                                size="large"
                                                disabled={isSubmitting}
                                                sx={{
                                                    py: 2,
                                                    fontSize: '1.125rem',
                                                    fontWeight: 600,
                                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                    boxShadow: '0 8px 24px rgba(0, 102, 255, 0.3)',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 12px 32px rgba(0, 102, 255, 0.4)'
                                                    }
                                                }}
                                            >
                                                {isSubmitting ? (
                                                    <CircularProgress size={24} color="inherit" />
                                                ) : (
                                                    'Get My Career Accelerator Plan →'
                                                )}
                                            </DotBridgeButton>
                                        </Grid>
                                    </Grid>
                                </form>
                            )}
                        </DotBridgeCard>
                    </Container>
                </Box>

                {/* Final CTA Section */}
                <Box sx={{
                    textAlign: 'center',
                    py: 8,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: 'white',
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Background decoration */}
                    <Box sx={{
                        position: 'absolute',
                        top: -100,
                        right: -100,
                        width: 300,
                        height: 300,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        filter: 'blur(60px)'
                    }} />

                    <Container sx={{ position: 'relative', zIndex: 1 }}>
                        <DotBridgeTypography variant="h2" sx={{
                            mb: 3,
                            fontWeight: 700,
                            color: 'inherit',
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                        }}>
                            Stop Applying. Start Connecting.
                        </DotBridgeTypography>

                        <DotBridgeTypography variant="h5" sx={{
                            mb: 5,
                            maxWidth: '700px',
                            mx: 'auto',
                            color: 'inherit',
                            opacity: 0.9,
                            fontWeight: 400
                        }}>
                            Your dream job won't find you in a pile of résumés. It's time to take control
                            with a proven system. Let us build your personalized AI Career Accelerator today.
                        </DotBridgeTypography>

                        <DotBridgeButton
                            variant="contained"
                            size="large"
                            endIcon={<ArrowRight size={20} />}
                            sx={{
                                px: 5,
                                py: 2,
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                bgcolor: 'white',
                                color: 'primary.main',
                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                                '&:hover': {
                                    bgcolor: 'grey.100',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)'
                                }
                            }}
                            onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Build My Job-Getting System Now
                        </DotBridgeButton>

                        {/* Urgency indicator */}
                        <Box sx={{ mt: 4 }}>
                            <Chip
                                icon={<Zap size={16} />}
                                label="Limited Launch Pricing Ends Soon"
                                sx={{
                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                    color: 'white',
                                    fontWeight: 600,
                                    backdropFilter: 'blur(10px)'
                                }}
                            />
                        </Box>
                    </Container>
                </Box>
            </PageContainer>

            {/* Floating CTA Button */}
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{
                    opacity: showFloatingCTA ? 1 : 0,
                    y: showFloatingCTA ? 0 : 100
                }}
                transition={{ duration: 0.3 }}
                style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    zIndex: 1000,
                    pointerEvents: showFloatingCTA ? 'auto' : 'none'
                }}
            >
                <DotBridgeButton
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                    sx={{
                        px: 3,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        boxShadow: '0 8px 32px rgba(0, 102, 255, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        '&:hover': {
                            transform: 'translateY(-3px) scale(1.02)',
                            boxShadow: '0 12px 40px rgba(0, 102, 255, 0.5)'
                        }
                    }}
                >
                    <Sparkles size={20} />
                    Get Started →
                </DotBridgeButton>
            </motion.div>

            <Footer />
        </>
    );
};

export default CareerAcceleratorPage; 