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
    Radio,
    LinearProgress,
    IconButton,
    Alert,
    Modal,
    Backdrop,
    Fade
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
    ArrowRight,
    Sparkles,
    Rocket,
    Clock,
    Globe,
    Briefcase,
    Heart,
    Zap,
    Award,
    ChevronRight,
    Upload,
    X,
    FileCheck,
    AlertCircle,
    Star,
    BarChart3,
    Lightbulb,
    RefreshCw
} from 'lucide-react';
import Footer from '../components/Footer';
import DotBridgeButton from '../components/DotBridgeButton';
import DotBridgeTypography from '../components/DotBridgeTypography';
import DotBridgeCard from '../components/DotBridgeCard';
import AgentConnector from '../components/AgentConnector';
import ResumeAnalyzer from '../components/ResumeAnalyzer';

// Demo Bridge ID for the AI intake
const CAREER_DEMO_BRIDGE_ID = '452';

// Performance optimization
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reusable DeliverableCard component
const DeliverableCard = ({ icon, title, description, color = '#007AFF' }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <motion.div
            whileHover={!isMobile ? { y: -4 } : {}}
            transition={{ duration: 0.2 }}
        >
            <DotBridgeCard
                sx={{
                    p: { xs: 2, sm: 2.5, md: 3 },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: `2px solid ${color}20`,
                    borderRadius: { xs: 2, md: 3 },
                    background: `linear-gradient(135deg, ${color}03 0%, transparent 100%)`,
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        borderColor: color,
                        boxShadow: `0 16px 48px ${color}20`,
                        transform: isMobile ? 'none' : 'translateY(-4px)',
                        '& .deliverable-icon': {
                            transform: isMobile ? 'none' : 'scale(1.1) rotate(5deg)'
                        }
                    },
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: { xs: 1.5, md: 2 }
                }}>
                    <Box
                        className="deliverable-icon"
                        sx={{
                            width: { xs: 40, sm: 44, md: 48 },
                            height: { xs: 40, sm: 44, md: 48 },
                            borderRadius: 2,
                            background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: color,
                            mr: { xs: 1.5, md: 2 },
                            flexShrink: 0,
                            transition: 'transform 0.3s ease'
                        }}
                    >
                        {React.cloneElement(icon, { size: isMobile ? 20 : 24 })}
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{
                        color: theme.palette.text.primary,
                        fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                        flex: 1,
                        lineHeight: 1.3
                    }}>
                        {title}
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{
                    lineHeight: 1.6,
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                    flex: 1
                }}>
                    {description}
                </Typography>
            </DotBridgeCard>
        </motion.div>
    );
};

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
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    maxWidth: 'none !important',
    [theme.breakpoints.up('sm')]: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(6),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(8),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    [theme.breakpoints.up('lg')]: {
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(10),
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
    },
    [theme.breakpoints.up('xl')]: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
    },
}));

const HeroSection = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    padding: theme.spacing(3, 1),
    background: `linear-gradient(135deg, ${theme.palette.primary.lighter}20 0%, ${theme.palette.background.paper} 100%)`,
    borderRadius: theme.shape.borderRadius * 2,
    position: 'relative',
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
        marginBottom: theme.spacing(6),
        padding: theme.spacing(4, 2),
        borderRadius: theme.shape.borderRadius * 3,
    },
    [theme.breakpoints.up('md')]: {
        marginBottom: theme.spacing(8),
        padding: theme.spacing(6, 0),
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: -100,
        right: -100,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`,
        filter: 'blur(60px)',
        [theme.breakpoints.up('sm')]: {
            width: 300,
            height: 300,
        }
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -150,
        left: -150,
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.palette.secondary.main}10 0%, transparent 70%)`,
        filter: 'blur(80px)',
        [theme.breakpoints.up('sm')]: {
            width: 400,
            height: 400,
        }
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

    // Animation and scroll handling
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Lead form state
    const [leadForm, setLeadForm] = useState({
        name: '',
        email: '',
        linkedinUrl: '',
        targetJobTitle: '',
        biggestChallenge: '',
        resumeFile: null
    });
    const [leadSubmitted, setLeadSubmitted] = useState(false);
    const [leadSubmitting, setLeadSubmitting] = useState(false);

    // File input reference
    const fileInputRef = useRef(null);

    // State for personalized AI strategist
    const [showPersonalizedStrategist, setShowPersonalizedStrategist] = useState(false);
    const [personalizationId, setPersonalizationId] = useState(null);
    const [isCreatingPersonalization, setIsCreatingPersonalization] = useState(false);

    // State for career strategy ticket generation
    const [isGeneratingTicket, setIsGeneratingTicket] = useState(false);
    const [careerTicket, setCareerTicket] = useState(null);
    const [ticketError, setTicketError] = useState(null);

    // State for resume analysis ID (for direct ticket generation)
    const [resumeAnalysisId, setResumeAnalysisId] = useState(null);

    // State for editable ticket fields
    const [editableTicketData, setEditableTicketData] = useState({
        email: '',
        linkedin_url: '',
        target_roles: [],
        target_locations: [],
        salary_goal: '',
        notes: ''
    });

    // State for CTA popup modal
    const [ctaModalOpen, setCtaModalOpen] = useState(false);
    const [ctaEmail, setCtaEmail] = useState('');
    const [ctaSubmitting, setCtaSubmitting] = useState(false);
    const [ctaSubmitted, setCtaSubmitted] = useState(false);

    // State for Stripe payment processing
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Track scroll for floating CTA
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const threshold = window.innerHeight * 1.2;
            setShowFloatingCTA(scrolled > threshold && !isMobile);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile]);

    const processSteps = [
        {
            icon: <Users size={36} />,
            number: "1",
            title: "Define Your Vision",
            description: "Discuss your career goals through our AI strategist. We help clarify your ideal role and target companies.",
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
            price: "$149",
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
            price: "$249",
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
            price: "$399",
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
        setLeadSubmitting(true);

        try {
            // Get the API base URL from config or environment
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

            // Prepare enhanced lead data with finalized ticket information
            const enhancedLeadData = {
                ...leadForm,
                // Include resume analysis ID and finalized goals if available
                resume_analysis_id: resumeAnalysisId,
                personalization_id: personalizationId,
                finalized_goals: editableTicketData,
                // Include ticket information if available
                career_ticket_data: careerTicket ? {
                    strategy_summary: careerTicket.strategy_summary,
                    client_info: careerTicket.client_info,
                    generated_at: new Date().toISOString()
                } : null
            };

            let response;

            // If there's a file, use FormData; otherwise use JSON
            if (leadForm.resumeFile) {
                const formData = new FormData();

                // Add all form fields except the file
                Object.keys(enhancedLeadData).forEach(key => {
                    if (key !== 'resumeFile') {
                        const value = enhancedLeadData[key];
                        if (typeof value === 'object' && value !== null) {
                            formData.append(key, JSON.stringify(value));
                        } else {
                            formData.append(key, value || '');
                        }
                    }
                });

                // Add the file
                formData.append('resumeFile', leadForm.resumeFile);

                response = await fetch(`${apiUrl}/leads`, {
                    method: 'POST',
                    body: formData // No Content-Type header for FormData
                });
            } else {
                // No file, use regular JSON submission
                response = await fetch(`${apiUrl}/leads`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(enhancedLeadData)
                });
            }

            if (response.ok) {
                setLeadSubmitted(true);

                // Optional: Regenerate ticket with final user inputs if they made significant edits
                if (careerTicket && (editableTicketData.target_roles.length > 0 || editableTicketData.notes)) {
                    console.log('User made edits to ticket - enhanced lead data captured');
                }
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Error submitting lead form:', error);
            // Still show success to user, but log the error
            setLeadSubmitted(true);
        } finally {
            setLeadSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLeadForm(prev => ({ ...prev, [name]: value }));
    };

    // File upload handler
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type (PDF only)
            const allowedTypes = ['application/pdf'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a PDF file only.');
                return;
            }

            if (file.size > maxSize) {
                alert('File size must be less than 5MB.');
                return;
            }

            setLeadForm(prev => ({ ...prev, resumeFile: file }));
        }
    };

    // Trigger file input
    const handleFileUploadClick = () => {
        fileInputRef.current?.click();
    };

    // Remove file
    const handleFileRemove = () => {
        setLeadForm(prev => ({ ...prev, resumeFile: null }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handlers for editable ticket fields
    const handleAddRole = (newRole) => {
        if (newRole && !editableTicketData.target_roles.includes(newRole)) {
            setEditableTicketData(prev => ({
                ...prev,
                target_roles: [...prev.target_roles, newRole]
            }));
        }
    };

    const handleRemoveRole = (roleToRemove) => {
        setEditableTicketData(prev => ({
            ...prev,
            target_roles: prev.target_roles.filter(role => role !== roleToRemove)
        }));
    };

    const handleAddLocation = (newLocation) => {
        if (newLocation && !editableTicketData.target_locations.includes(newLocation)) {
            setEditableTicketData(prev => ({
                ...prev,
                target_locations: [...prev.target_locations, newLocation]
            }));
        }
    };

    const handleRemoveLocation = (locationToRemove) => {
        setEditableTicketData(prev => ({
            ...prev,
            target_locations: prev.target_locations.filter(location => location !== locationToRemove)
        }));
    };

    const handleTicketFieldChange = (field, value) => {
        setEditableTicketData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Stripe Payment Handler
    const handleActivateStrategy = async () => {
        // Validate that we have required information before proceeding
        if (!editableTicketData.email) {
            alert('Please enter your email address before activating your strategy.');
            return;
        }

        if (!editableTicketData.linkedin_url) {
            alert('Please enter your LinkedIn profile URL before activating your strategy.');
            return;
        }

        setIsProcessingPayment(true);

        try {
            // Generate stripe client reference ID
            const stripeClientReferenceId = `dotbridge_${Date.now()}`;

            // First, create the order in our system
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

            // Extract email - prioritize the form data we just collected
            const customerEmail = editableTicketData.email.trim().toLowerCase();

            // Extract name from ticket if available, otherwise use email prefix
            const customerName = careerTicket?.client_info?.name ||
                editableTicketData.email.split('@')[0] ||
                'Career Accelerator Client';

            const orderData = {
                email: customerEmail,
                name: customerName,
                linkedin_url: editableTicketData.linkedin_url,
                resume_analysis_id: resumeAnalysisId,
                personalization_id: personalizationId,
                finalized_goals: editableTicketData,
                career_ticket_data: careerTicket ? {
                    strategy_summary: careerTicket.strategy_summary,
                    client_info: careerTicket.client_info,
                    generated_at: new Date().toISOString()
                } : null,
                stripe_client_reference_id: stripeClientReferenceId
            };

            console.log('Creating order with data:', orderData);

            const orderResponse = await fetch(`${apiUrl}/career-accelerator/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const orderResult = await orderResponse.json();

            if (!orderResponse.ok) {
                throw new Error(orderResult.error || 'Failed to create order');
            }

            console.log('Order created successfully:', orderResult);

            // Track conversion event for analytics
            if (typeof window.gtag !== 'undefined') {
                window.gtag('event', 'begin_checkout', {
                    currency: 'USD',
                    value: 299,
                    items: [{
                        item_id: 'career_playbook_complete',
                        item_name: 'DotBridge Career Acceleration System',
                        category: 'Career Services',
                        quantity: 1,
                        price: 299
                    }]
                });
            }

            // Store order info for post-purchase tracking
            const purchaseData = {
                order_id: orderResult.order_id,
                user_id: orderResult.user_id,
                ...orderData,
                timestamp: Date.now()
            };

            // Only include email if we have one
            if (customerEmail) {
                purchaseData.email = customerEmail;
            }

            localStorage.setItem('dotbridge_purchase_data', JSON.stringify(purchaseData));

            // Get the payment link from environment variables
            const paymentLink = process.env.REACT_APP_STRIPE_CAREER_PAYMENT_LINK;

            if (!paymentLink) {
                throw new Error('Payment link not configured');
            }

            // Build URL with metadata - use the same reference ID for tracking
            const urlParams = new URLSearchParams({
                'client_reference_id': stripeClientReferenceId
            });

            // Only add email if we have one
            if (customerEmail) {
                urlParams.set('prefilled_email', customerEmail);
            }

            const fullPaymentUrl = `${paymentLink}?${urlParams.toString()}`;

            console.log('Redirecting to Stripe:', fullPaymentUrl);

            // For mobile devices, use window.location.href to avoid popup blockers
            if (isMobile) {
                window.location.href = fullPaymentUrl;
            } else {
                // For desktop, open in new tab
                window.open(fullPaymentUrl, '_blank', 'noopener,noreferrer');
            }

        } catch (error) {
            console.error('Error creating order or initiating payment:', error);

            // Try to extract error message from response
            let errorMessage = 'An error occurred while processing your request.';
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }

            alert(`Error: ${errorMessage}`);
        } finally {
            setIsProcessingPayment(false);
        }
    };

    // CTA Modal handlers (keeping for backward compatibility)
    const handleCtaOpen = () => {
        // Now redirect directly to Stripe instead of opening modal
        handleActivateStrategy();
    };

    const handleCtaClose = () => {
        setCtaModalOpen(false);
        setCtaEmail('');
        setCtaSubmitting(false);
    };

    const handleCtaSubmit = async (e) => {
        e.preventDefault();
        setCtaSubmitting(true);

        try {
            // Get the API base URL from config or environment
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

            // Prepare CTA lead data
            const ctaLeadData = {
                email: ctaEmail,
                source: 'cta_strategy_activation',
                resume_analysis_id: resumeAnalysisId,
                personalization_id: personalizationId,
                finalized_goals: editableTicketData,
                career_ticket_data: careerTicket ? {
                    strategy_summary: careerTicket.strategy_summary,
                    client_info: careerTicket.client_info,
                    generated_at: new Date().toISOString()
                } : null
            };

            const response = await fetch(`${apiUrl}/leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ctaLeadData)
            });

            if (response.ok) {
                setCtaSubmitted(true);
                // Auto-close modal after 3 seconds
                setTimeout(() => {
                    handleCtaClose();
                    setCtaSubmitted(false);
                }, 3000);
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Error submitting CTA form:', error);
            // Still show success to user
            setCtaSubmitted(true);
            setTimeout(() => {
                handleCtaClose();
                setCtaSubmitted(false);
            }, 3000);
        } finally {
            setCtaSubmitting(false);
        }
    };

    const handleGenerateTicket = async () => {
        // Check if we have either resumeAnalysisId or personalizationId
        if (!resumeAnalysisId && !personalizationId) {
            setTicketError('Please upload and analyze your resume first, or start a conversation.');
            return;
        }

        setIsGeneratingTicket(true);
        setTicketError(null);

        try {
            // Get the API base URL from config or environment
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

            // Prepare request body with new structure
            const requestBody = {
                finalized_goals: editableTicketData
            };

            // Use direct resume analysis ID if available, otherwise fall back to personalization ID
            if (resumeAnalysisId) {
                requestBody.resume_analysis_id = resumeAnalysisId;
            }
            if (personalizationId) {
                requestBody.personalization_id = personalizationId;
            }

            const response = await fetch(`${apiUrl}/generate-ticket`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate career strategy');
            }

            if (data.success && data.ticket) {
                setCareerTicket(data.ticket);

                // Initialize editable fields with ticket data
                setEditableTicketData({
                    email: data.ticket.client_info?.email || '',
                    linkedin_url: data.ticket.client_info?.linkedin_url || '',
                    target_roles: data.ticket.client_info?.target_roles || [],
                    target_locations: data.ticket.client_info?.target_locations || [],
                    salary_goal: data.ticket.client_info?.suggested_salary_range || data.ticket.client_info?.salary_goal || '',
                    notes: ''
                });

                // Scroll to the ticket display
                setTimeout(() => {
                    const ticketElement = document.querySelector('[data-ticket-display]');
                    if (ticketElement) {
                        ticketElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error generating career strategy:', error);
            setTicketError(error.message || 'Failed to generate your career strategy. Please try again.');
        } finally {
            setIsGeneratingTicket(false);
        }
    };

    return (
        <>
            <PageContainer>
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
                                    label="BRIDGE YOUR CAREER"
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
                                    mb: { xs: 2, sm: 3 },
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '4rem' },
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
                                    Stop Applying Blind.
                                </Box>
                                <Box component="span" sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: 'block',
                                    mt: 0.5
                                }}>
                                    Start Reaching the Right People.
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
                                    fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem', lg: '1.5rem' },
                                    fontWeight: 400,
                                    px: { xs: 2, sm: 1, md: 0 }
                                }}
                            >
                                DotBridge gives you a complete job outreach system—built around your goals, your experience, and your voice.
                                {!isMobile && ' '}
                                {!isMobile && (
                                    <Box component="span" sx={{
                                        color: theme.palette.primary.main,
                                        fontWeight: 600,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>
                                        No more guessing, no more blind applications.
                                    </Box>
                                )}
                            </DotBridgeTypography>

                            {/* CTA Buttons */}
                            <Box sx={{
                                display: 'flex',
                                gap: { xs: 1.5, sm: 2 },
                                justifyContent: 'center',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: 'center',
                                px: { xs: 3, sm: 2, md: 0 }
                            }}>
                                <DotBridgeButton
                                    variant="contained"
                                    size={isMobile ? "medium" : "large"}
                                    endIcon={<ArrowRight size={isMobile ? 18 : 20} />}
                                    sx={{
                                        px: { xs: 3, sm: 4 },
                                        py: { xs: 1.5, sm: 1.75 },
                                        fontSize: { xs: '1rem', sm: '1.125rem' },
                                        fontWeight: 600,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                        boxShadow: '0 10px 30px rgba(0, 102, 255, 0.3)',
                                        borderRadius: 2,
                                        width: { xs: '100%', sm: 'auto' },
                                        maxWidth: { xs: '280px', sm: 'none' },
                                        position: 'relative',
                                        '&:hover': {
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 15px 40px rgba(0, 102, 255, 0.4)'
                                        }
                                    }}
                                    onClick={() => document.getElementById('ai-resume-analyzer-section')?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    Build My Job Plan
                                </DotBridgeButton>

                                <DotBridgeButton
                                    variant="outlined"
                                    size={isMobile ? "medium" : "large"}
                                    sx={{
                                        px: { xs: 3, sm: 4 },
                                        py: { xs: 1.5, sm: 1.75 },
                                        fontSize: { xs: '1rem', sm: '1.125rem' },
                                        fontWeight: 600,
                                        borderWidth: 2,
                                        borderColor: theme.palette.primary.main,
                                        color: theme.palette.primary.main,
                                        borderRadius: 2,
                                        width: { xs: '100%', sm: 'auto' },
                                        maxWidth: { xs: '280px', sm: 'none' },
                                        '&:hover': {
                                            borderWidth: 2,
                                            backgroundColor: theme.palette.primary.lighter,
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                    onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    How It Works
                                </DotBridgeButton>
                            </Box>

                            {/* Trust Indicators */}
                            <Box sx={{
                                mt: { xs: 4, sm: 5 },
                                display: 'flex',
                                gap: { xs: 2, sm: 3 },
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                                px: 2
                            }}>
                                {[
                                    { icon: <Clock size={isMobile ? 18 : 20} />, text: "48-72 Hour Delivery" },
                                    { icon: <Users size={isMobile ? 18 : 20} />, text: "Professional Service" }
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
                                            gap: { xs: 0.5, sm: 1 },
                                            color: theme.palette.text.secondary,
                                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
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

                {/* Progress Indicator - Desktop Only */}
                {!isMobile && (
                    <Box sx={{
                        textAlign: 'center',
                        mb: { xs: 4, md: 6 },
                        px: { xs: 2, sm: 0 }
                    }}>
                        <Box sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: { xs: 1, sm: 2 },
                            p: { xs: 1.5, sm: 2 },
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.main}03 100%)`,
                            border: `1px solid ${theme.palette.primary.main}20`,
                            borderRadius: { xs: 2, md: 3 },
                            boxShadow: '0 4px 16px rgba(0, 102, 255, 0.1)'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                px: { xs: 1, sm: 1.5 },
                                py: 0.5,
                                background: theme.palette.primary.main,
                                color: 'white',
                                borderRadius: 1,
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                fontWeight: 700
                            }}>
                                <span>1</span>
                                <span>ANALYZE</span>
                            </Box>
                            <ArrowRight size={16} color={theme.palette.text.secondary} />
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                px: { xs: 1, sm: 1.5 },
                                py: 0.5,
                                background: theme.palette.grey[200],
                                color: theme.palette.text.secondary,
                                borderRadius: 1,
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                fontWeight: 600
                            }}>
                                <span>2</span>
                                <span>STRATEGIZE</span>
                            </Box>
                            <ArrowRight size={16} color={theme.palette.text.secondary} />
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                px: { xs: 1, sm: 1.5 },
                                py: 0.5,
                                background: theme.palette.grey[200],
                                color: theme.palette.text.secondary,
                                borderRadius: 1,
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                fontWeight: 600
                            }}>
                                <span>3</span>
                                <span>ACTIVATE</span>
                            </Box>
                        </Box>
                    </Box>
                )}

                {/* Resume Analyzer Section */}
                <Box id="ai-resume-analyzer-section" sx={{
                    mb: { xs: 6, sm: 8, md: 10 },
                    py: { xs: 4, sm: 6, md: 8 },
                    bgcolor: theme.palette.background.subtle,
                    borderRadius: { xs: 2, md: 3 },
                    mx: { xs: 0.5, sm: 2, md: 3, lg: 4 }
                }}>
                    <Box sx={{
                        px: { xs: 1, sm: 3, md: 4, lg: 6 },
                        maxWidth: '1200px',
                        mx: 'auto'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <DotBridgeTypography variant="h2" sx={{
                                textAlign: 'center',
                                mb: { xs: 1.5, sm: 2, md: 3 },
                                fontWeight: 700,
                                fontSize: { xs: '1.5rem', sm: '2.25rem', md: '2.5rem', lg: '2.75rem' },
                                lineHeight: { xs: 1.3, md: 1.2 },
                                px: { xs: 1, sm: 0 }
                            }}>
                                Step 1:
                                <Box component="span" sx={{
                                    color: theme.palette.primary.main,
                                    mx: { xs: 0.5, sm: 1 },
                                    display: { xs: 'inline', sm: 'inline' }
                                }}>
                                    Get Your Data-Driven Baseline
                                </Box>
                            </DotBridgeTypography>

                            <DotBridgeTypography variant="h5" sx={{
                                textAlign: 'center',
                                mb: { xs: 3, sm: 4, md: 6 },
                                color: theme.palette.text.secondary,
                                lineHeight: 1.6,
                                fontSize: { xs: '0.9rem', sm: '1.125rem', md: '1.25rem', lg: '1.375rem' },
                                px: { xs: 2, sm: 0 }
                            }}>
                                This instant, free analysis gives us the raw intelligence we need.
                                {!isMobile && <br />}
                                {isMobile ? (
                                    "After your analysis, you'll be able to generate your personalized career strategy."
                                ) : (
                                    "In the next step, our AI Strategist will work with you to turn that intelligence into a winning action plan."
                                )}
                            </DotBridgeTypography>

                            <ResumeAnalyzer
                                showPersonalizedStrategist={!isMobile && showPersonalizedStrategist}
                                setShowPersonalizedStrategist={setShowPersonalizedStrategist}
                                personalizationId={personalizationId}
                                setPersonalizationId={setPersonalizationId}
                                isCreatingPersonalization={isCreatingPersonalization}
                                setIsCreatingPersonalization={setIsCreatingPersonalization}
                                isMobile={isMobile}
                                onResumeAnalysisComplete={(analysisId) => {
                                    console.log('Resume analysis completed with ID:', analysisId);
                                    setResumeAnalysisId(analysisId);
                                }}
                            />
                        </motion.div>
                    </Box>
                </Box>

                {/* Interactive Demo Section - Only show when AI strategist is active AND not on mobile */}
                {!isMobile && showPersonalizedStrategist && (
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
                                Step 2: Let's Build Your Personalized Plan.
                            </DotBridgeTypography>

                            <DotBridgeTypography variant="h6" sx={{
                                textAlign: 'center',
                                mb: 6,
                                color: theme.palette.text.secondary,
                                maxWidth: '700px',
                                mx: 'auto'
                            }}>
                                Our AI Strategist has already reviewed your resume analysis. Now, it needs to understand your unique career goals.
                                Have a brief chat and we will use this conversation to generate a final proposal for your playbook.
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
                                        maxWidth: '1100px',
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

                                        {/* Agent Connector - Conditionally Rendered */}
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
                                            {personalizationId ? (
                                                <div className="agent-connector-container">
                                                    <AgentConnector
                                                        brdgeId={CAREER_DEMO_BRIDGE_ID}
                                                        agentType="view"
                                                        token=""
                                                        userId={`anon_demo_${Date.now()}`}
                                                        isEmbed={false}
                                                        personalizationId={personalizationId}
                                                    />
                                                </div>
                                            ) : (
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    height: '100%',
                                                    color: 'text.secondary',
                                                    flexDirection: 'column',
                                                    gap: 2
                                                }}>
                                                    {isCreatingPersonalization ? (
                                                        <>
                                                            <CircularProgress size={40} />
                                                            <Typography variant="body1" fontWeight={500}>
                                                                Creating your personalized session...
                                                            </Typography>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles size={48} />
                                                            <Typography variant="h6" fontWeight={600} textAlign="center">
                                                                Initializing your AI strategist...
                                                            </Typography>
                                                        </>
                                                    )}
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </Box>
                )}

                {/* CTA Button after demo - Show for mobile after resume analysis or desktop after strategist */}
                {((!isMobile && (resumeAnalysisId || showPersonalizedStrategist))) && (
                    <Box sx={{
                        textAlign: 'center',
                        mb: { xs: 6, md: 10 },
                        mt: isMobile ? 4 : (showPersonalizedStrategist ? 4 : -6),
                        px: { xs: 2, sm: 0 }
                    }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <DotBridgeButton
                                variant={(isMobile || (!isMobile && showPersonalizedStrategist)) ? "contained" : "outlined"}
                                size="large"
                                disabled={isGeneratingTicket}
                                sx={{
                                    px: { xs: 4, sm: 5 },
                                    py: { xs: 1.5, sm: 2 },
                                    fontSize: { xs: '1rem', sm: '1.125rem' },
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease-in-out',
                                    width: { xs: '100%', sm: 'auto' },
                                    maxWidth: { xs: '320px', sm: 'none' },
                                    ...((isMobile || (!isMobile && showPersonalizedStrategist)) && {
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                        color: 'white',
                                        boxShadow: '0 10px 30px rgba(0, 102, 255, 0.3)',
                                        animation: isMobile ? 'none' : 'pulse 2s infinite',
                                    }),
                                    '@keyframes pulse': {
                                        '0%': {
                                            transform: 'scale(1)',
                                            boxShadow: '0 10px 30px rgba(0, 102, 255, 0.3)',
                                        },
                                        '50%': {
                                            transform: 'scale(1.03)',
                                            boxShadow: '0 15px 40px rgba(0, 102, 255, 0.4)',
                                        },
                                        '100%': {
                                            transform: 'scale(1)',
                                            boxShadow: '0 10px 30px rgba(0, 102, 255, 0.3)',
                                        }
                                    },
                                    '&:hover': {
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 15px 40px rgba(0, 102, 255, 0.4)',
                                        animation: 'none'
                                    },
                                    '&:disabled': {
                                        background: theme.palette.grey[400],
                                        color: theme.palette.grey[600],
                                        transform: 'none',
                                        boxShadow: 'none',
                                        animation: 'none'
                                    }
                                }}
                                onClick={handleGenerateTicket}
                            >
                                {isGeneratingTicket ? (
                                    <>
                                        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                        {isMobile ? 'Generating...' : 'Generating Your Plan...'}
                                    </>
                                ) : (
                                    isMobile ? 'Generate My Plan' : 'Generate My Career Co-Pilot Plan'
                                )}
                            </DotBridgeButton>
                            {!isMobile && !showPersonalizedStrategist && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                    Or, skip ahead and generate your plan directly
                                </Typography>
                            )}
                        </motion.div>
                    </Box>
                )}

                {/* Error Display */}
                {ticketError && (
                    <Box sx={{ mb: 4, mx: { xs: 2, sm: 3, md: 4 } }}>
                        <Alert severity="error" sx={{ maxWidth: '600px', mx: 'auto' }}>
                            {ticketError}
                        </Alert>
                    </Box>
                )}

                {/* Career Strategy Ticket Display */}
                {careerTicket && (
                    <Box sx={{
                        mb: { xs: 6, md: 8 },
                        mx: { xs: 0.5, sm: 1, md: 3 },
                        px: { xs: 0.5, sm: 0 }
                    }} data-ticket-display>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <DotBridgeCard sx={{
                                maxWidth: { xs: '100%', md: '1200px' },
                                mx: 'auto',
                                p: { xs: 2, sm: 3, md: 4 },
                                background: `linear-gradient(135deg, #ffffff 0%, #fafbff 50%, #f5f7ff 100%)`,
                                border: '1px solid',
                                borderColor: '#e1e7ff',
                                borderRadius: { xs: 2, md: 4 },
                                boxShadow: '0 24px 80px rgba(0, 102, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.04)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: { xs: 4, md: 6 },
                                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.primary.main} 100%)`,
                                    borderRadius: '16px 16px 0 0'
                                }
                            }}>
                                {/* Premium Report Header */}
                                <Box sx={{
                                    textAlign: 'center',
                                    mb: { xs: 2.5, md: 3.5 },
                                    pt: { xs: 1, md: 1.5 },
                                    position: 'relative'
                                }}>
                                    {/* Watermark/Background Text - Hidden on mobile */}
                                    <Box sx={{
                                        position: 'absolute',
                                        top: -20,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: { xs: '4rem', md: '8rem' },
                                        fontWeight: 900,
                                        color: theme.palette.primary.main,
                                        opacity: 0.02,
                                        zIndex: 0,
                                        userSelect: 'none',
                                        pointerEvents: 'none',
                                        display: { xs: 'none', sm: 'block' }
                                    }}>
                                        STRATEGY
                                    </Box>

                                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                                        <Chip
                                            icon={<Award size={16} />}
                                            label={isMobile ? "CAREER STRATEGY" : "PREMIUM CAREER STRATEGY REPORT"}
                                            sx={{
                                                mb: { xs: 1.5, md: 2 },
                                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                color: 'white',
                                                fontWeight: 700,
                                                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                letterSpacing: '0.1em',
                                                px: { xs: 1.5, sm: 2 },
                                                py: 0.5,
                                                height: { xs: 28, sm: 32 },
                                                boxShadow: '0 8px 24px rgba(0, 102, 255, 0.2)',
                                                '& .MuiChip-icon': {
                                                    color: 'white'
                                                }
                                            }}
                                        />

                                        <DotBridgeTypography variant="h2" sx={{
                                            fontWeight: 800,
                                            background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            mb: { xs: 1, md: 1.5 },
                                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                                            letterSpacing: '-0.02em',
                                            lineHeight: 1.2
                                        }}>
                                            {isMobile ? 'Your Career Strategy' : 'Career Acceleration Strategy'}
                                        </DotBridgeTypography>

                                        <Typography variant="h5" sx={{
                                            color: theme.palette.text.secondary,
                                            fontWeight: 400,
                                            mb: 0.5,
                                            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' }
                                        }}>
                                            Personalized for <strong>{careerTicket.client_info.name}</strong>
                                        </Typography>

                                        <Typography variant="body2" sx={{
                                            color: theme.palette.text.secondary,
                                            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.875rem' },
                                            opacity: 0.7,
                                            display: { xs: 'none', sm: 'block' }
                                        }}>
                                            Generated on {new Date().toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })} • Confidential Report
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Two-Column Layout - Stack on mobile */}
                                <Grid container spacing={{ xs: 3, md: 4 }}>
                                    {/* Left Column - Strategic Information */}
                                    <Grid item xs={12} md={7}>

                                        {/* Executive Summary Panel */}
                                        <Box sx={{
                                            p: { xs: 2, sm: 2.5, md: 3 },
                                            mb: { xs: 2.5, md: 3.5 },
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.main}03 100%)`,
                                            border: `2px solid ${theme.palette.primary.main}15`,
                                            borderRadius: { xs: 2, md: 3 },
                                            position: 'relative',
                                            '&::before': {
                                                content: '"EXECUTIVE SUMMARY"',
                                                position: 'absolute',
                                                top: -10,
                                                left: { xs: 15, sm: 20 },
                                                backgroundColor: theme.palette.background.paper,
                                                color: theme.palette.primary.main,
                                                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                fontWeight: 700,
                                                letterSpacing: '0.1em',
                                                px: { xs: 1.5, sm: 2 }
                                            }
                                        }}>
                                            <Typography variant="overline" sx={{
                                                color: theme.palette.primary.main,
                                                fontWeight: 700,
                                                letterSpacing: '0.1em',
                                                mb: { xs: 1.5, md: 2 },
                                                display: 'block',
                                                fontSize: { xs: '0.65rem', sm: '0.75rem' }
                                            }}>
                                                STRATEGIC OVERVIEW
                                            </Typography>
                                            <Typography variant="body1" sx={{
                                                fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' },
                                                lineHeight: 1.7,
                                                color: 'text.primary',
                                                mb: { xs: 2, md: 3 }
                                            }}>
                                                {careerTicket.strategy_summary}
                                            </Typography>
                                        </Box>

                                        {/* Editable Co-Creation Fields */}
                                        <Box sx={{
                                            p: { xs: 2, sm: 2.5, md: 3 },
                                            mb: { xs: 2.5, md: 3.5 },
                                            background: `linear-gradient(135deg, ${theme.palette.success.main}08 0%, ${theme.palette.success.main}03 100%)`,
                                            border: `2px solid ${theme.palette.success.main}15`,
                                            borderRadius: { xs: 2, md: 3 },
                                            position: 'relative',
                                            '&::before': {
                                                content: '"CUSTOMIZE YOUR GOALS"',
                                                position: 'absolute',
                                                top: -10,
                                                left: { xs: 15, sm: 20 },
                                                backgroundColor: theme.palette.background.paper,
                                                color: theme.palette.success.main,
                                                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                fontWeight: 700,
                                                letterSpacing: '0.1em',
                                                px: { xs: 1.5, sm: 2 }
                                            }
                                        }}>
                                            {/* Email and LinkedIn */}
                                            <Box sx={{ mb: { xs: 2, md: 3 } }}>
                                                <Typography variant="body2" color="text.secondary" sx={{
                                                    mb: 1,
                                                    fontWeight: 600,
                                                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                                                }}>
                                                    Confirm Your Email *
                                                </Typography>
                                                <TextField
                                                    size="small"
                                                    placeholder="Enter your email address..."
                                                    fullWidth
                                                    type="email"
                                                    required
                                                    value={editableTicketData.email}
                                                    onChange={(e) => handleTicketFieldChange('email', e.target.value)}
                                                    sx={{
                                                        '& .MuiInputBase-input': {
                                                            fontSize: { xs: '0.875rem', sm: '1rem' },
                                                            padding: { xs: '8px 12px', sm: '10px 14px' }
                                                        }
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ mb: { xs: 2, md: 3 } }}>
                                                <Typography variant="body2" color="text.secondary" sx={{
                                                    mb: 1,
                                                    fontWeight: 600,
                                                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                                                }}>
                                                    LinkedIn Profile URL *
                                                </Typography>
                                                <TextField
                                                    size="small"
                                                    placeholder="https://linkedin.com/in/your-profile"
                                                    fullWidth
                                                    required
                                                    value={editableTicketData.linkedin_url}
                                                    onChange={(e) => handleTicketFieldChange('linkedin_url', e.target.value)}
                                                    sx={{
                                                        '& .MuiInputBase-input': {
                                                            fontSize: { xs: '0.875rem', sm: '1rem' },
                                                            padding: { xs: '8px 12px', sm: '10px 14px' }
                                                        }
                                                    }}
                                                />
                                            </Box>

                                            {/* Target Roles */}
                                            <Box sx={{ mb: { xs: 2, md: 3 } }}>
                                                <Typography variant="body2" color="text.secondary" sx={{
                                                    mb: 1,
                                                    fontWeight: 600,
                                                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                                                }}>
                                                    Target Roles
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, sm: 1 }, mb: { xs: 1.5, md: 2 } }}>
                                                    {editableTicketData.target_roles.map((role, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={role}
                                                            onDelete={() => handleRemoveRole(role)}
                                                            color="primary"
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{
                                                                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                                                height: { xs: 24, sm: 28 }
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                                <TextField
                                                    size="small"
                                                    placeholder="Add target role..."
                                                    fullWidth
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleAddRole(e.target.value);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                    sx={{
                                                        '& .MuiInputBase-input': {
                                                            fontSize: { xs: '0.875rem', sm: '1rem' },
                                                            padding: { xs: '8px 12px', sm: '10px 14px' }
                                                        }
                                                    }}
                                                />
                                            </Box>

                                            {/* Target Locations */}
                                            <Box sx={{ mb: { xs: 2, md: 3 } }}>
                                                <Typography variant="body2" color="text.secondary" sx={{
                                                    mb: 1,
                                                    fontWeight: 600,
                                                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                                                }}>
                                                    Target Locations
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, sm: 1 }, mb: { xs: 1.5, md: 2 } }}>
                                                    {editableTicketData.target_locations.map((location, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={location}
                                                            onDelete={() => handleRemoveLocation(location)}
                                                            color="secondary"
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{
                                                                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                                                height: { xs: 24, sm: 28 }
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                                <TextField
                                                    size="small"
                                                    placeholder="Add location..."
                                                    fullWidth
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleAddLocation(e.target.value);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                    sx={{
                                                        '& .MuiInputBase-input': {
                                                            fontSize: { xs: '0.875rem', sm: '1rem' },
                                                            padding: { xs: '8px 12px', sm: '10px 14px' }
                                                        }
                                                    }}
                                                />
                                            </Box>

                                            {/* Salary Goal */}
                                            <Box sx={{ mb: { xs: 2, md: 3 } }}>
                                                <Typography variant="body2" color="text.secondary" sx={{
                                                    mb: 1,
                                                    fontWeight: 600,
                                                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                                                }}>
                                                    Target Salary Range
                                                </Typography>
                                                <TextField
                                                    size="small"
                                                    placeholder="e.g., $80,000-$100,000"
                                                    fullWidth
                                                    value={editableTicketData.salary_goal}
                                                    onChange={(e) => handleTicketFieldChange('salary_goal', e.target.value)}
                                                    sx={{
                                                        '& .MuiInputBase-input': {
                                                            fontSize: { xs: '0.875rem', sm: '1rem' },
                                                            padding: { xs: '8px 12px', sm: '10px 14px' }
                                                        }
                                                    }}
                                                />
                                            </Box>

                                            {/* Notes */}
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{
                                                    mb: 1,
                                                    fontWeight: 600,
                                                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                                                }}>
                                                    Optional: Add any notes or dream companies for our team
                                                </Typography>
                                                <TextField
                                                    size="small"
                                                    placeholder="Any specific companies, preferences, or additional context..."
                                                    fullWidth
                                                    multiline
                                                    rows={isMobile ? 2 : 3}
                                                    value={editableTicketData.notes}
                                                    onChange={(e) => handleTicketFieldChange('notes', e.target.value)}
                                                    sx={{
                                                        '& .MuiInputBase-input': {
                                                            fontSize: { xs: '0.875rem', sm: '1rem' },
                                                            padding: { xs: '8px 12px', sm: '10px 14px' }
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        {/* Key Challenges Section */}
                                        <Box sx={{ mb: { xs: 2.5, md: 3.5 } }}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mb: { xs: 2, md: 2.5 },
                                                pb: { xs: 1, md: 1.5 },
                                                borderBottom: `2px solid ${theme.palette.primary.main}20`
                                            }}>
                                                <Box sx={{
                                                    width: { xs: 32, sm: 36, md: 40 },
                                                    height: { xs: 32, sm: 36, md: 40 },
                                                    borderRadius: 2,
                                                    background: `linear-gradient(135deg, ${theme.palette.error.main}15 0%, ${theme.palette.error.main}05 100%)`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mr: { xs: 1.5, md: 2 }
                                                }}>
                                                    <AlertCircle size={isMobile ? 18 : 20} color={theme.palette.error.main} />
                                                </Box>
                                                <Typography variant="h4" fontWeight={700} sx={{
                                                    color: theme.palette.text.primary,
                                                    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
                                                }}>
                                                    {isMobile ? 'Key Challenges' : 'Critical Challenges Analysis'}
                                                </Typography>
                                            </Box>
                                            <Grid container spacing={{ xs: 2, md: 3 }}>
                                                {careerTicket.client_info.key_challenges?.map((challenge, index) => (
                                                    <Grid item xs={12} key={index}>
                                                        <Box sx={{
                                                            p: { xs: 2, sm: 2.5 },
                                                            border: `1px solid ${theme.palette.error.main}20`,
                                                            borderRadius: 2,
                                                            background: `linear-gradient(135deg, ${theme.palette.error.main}02 0%, transparent 100%)`,
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                borderColor: theme.palette.error.main,
                                                                boxShadow: `0 8px 24px ${theme.palette.error.main}15`,
                                                                transform: 'translateY(-2px)'
                                                            }
                                                        }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                                <Box sx={{
                                                                    width: { xs: 20, sm: 22 },
                                                                    height: { xs: 20, sm: 22 },
                                                                    borderRadius: '50%',
                                                                    background: theme.palette.error.main,
                                                                    color: 'white',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                                                    fontWeight: 700,
                                                                    mr: { xs: 1, sm: 1.5 },
                                                                    mt: 0.25,
                                                                    flexShrink: 0
                                                                }}>
                                                                    {index + 1}
                                                                </Box>
                                                                <Typography variant="body1" sx={{
                                                                    fontWeight: 500,
                                                                    lineHeight: 1.6,
                                                                    color: theme.palette.text.primary,
                                                                    fontSize: { xs: '0.85rem', sm: '0.95rem' }
                                                                }}>
                                                                    {challenge}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>

                                    </Grid>

                                    {/* Right Column - Deliverable Preview Cards */}
                                    <Grid item xs={12} md={5}>
                                        <Box sx={{
                                            position: { xs: 'relative', md: 'sticky' },
                                            top: { md: 20 }
                                        }}>
                                            <Typography variant="h4" fontWeight={700} sx={{
                                                mb: { xs: 2, md: 3 },
                                                textAlign: 'center',
                                                color: theme.palette.text.primary,
                                                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
                                            }}>
                                                Your ABC Playbook Preview
                                            </Typography>

                                            <Grid container spacing={{ xs: 1.5, md: 2 }}>
                                                <Grid item xs={12}>
                                                    <DeliverableCard
                                                        icon={<FileCheck size={isMobile ? 20 : 24} />}
                                                        title="Strategic Resume Tune-Up"
                                                        description={careerTicket.deliverable_previews?.resume_tune_up_preview || "We don't just proofread. We upgrade your core asset to get past AI screeners and impress the human hiring managers who matter."}
                                                        color="#007AFF"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <DeliverableCard
                                                        icon={<BarChart3 size={isMobile ? 20 : 24} />}
                                                        title="Opportunity & Decision-Maker Matrix"
                                                        description={careerTicket.deliverable_previews?.opportunity_matrix_preview || "You're not just getting a list of jobs. You'll receive a curated intelligence report of 50+ high-value companies and the specific decision-makers to contact."}
                                                        color="#5856D6"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <DeliverableCard
                                                        icon={<MessageSquare size={isMobile ? 20 : 24} />}
                                                        title="Multi-Channel Outreach Cadence"
                                                        description={careerTicket.deliverable_previews?.outreach_cadence_preview || "You're not just getting templates. We provide you with professionally written, non-generic messaging to start meaningful conversations."}
                                                        color="#AF52DE"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <DeliverableCard
                                                        icon={<Calendar size={isMobile ? 20 : 24} />}
                                                        title="14-Day Action Plan"
                                                        description={careerTicket.deliverable_previews?.action_playbook_preview || "You're not just getting advice. You get a step-by-step GPS for the first two weeks of your campaign."}
                                                        color="#34C759"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>

                                </Grid>
                            </DotBridgeCard>

                            {/* Premium CTA Section - Full Width & Centered */}
                            {careerTicket && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.5 }}
                                    whileHover={!isMobile ? { scale: 1.01 } : {}}
                                    style={{ marginTop: isMobile ? '1.5rem' : '2rem' }}
                                >
                                    <Box sx={{
                                        maxWidth: { xs: '100%', md: '960px' },
                                        mx: 'auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        p: { xs: 2.5, sm: 3, md: 4 },
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}1a 0%, ${theme.palette.primary.main}0d 50%, transparent 100%)`,
                                        border: `1px solid ${theme.palette.primary.main}30`,
                                        borderRadius: { xs: 2, md: 4 },
                                        position: 'relative',
                                        overflow: 'hidden',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s ease',
                                        flexDirection: 'column',
                                        gap: { xs: 2, md: 2.5 },
                                        textAlign: 'center',
                                        '&:hover': {
                                            borderColor: theme.palette.primary.main,
                                            transform: isMobile ? 'none' : 'translateY(-2px)',
                                            boxShadow: `0 20px 60px ${theme.palette.primary.main}25`,
                                            '& .cta-glow': {
                                                opacity: 1
                                            }
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 1,
                                            background: `linear-gradient(90deg, transparent 0%, ${theme.palette.primary.main} 50%, transparent 100%)`,
                                            opacity: 0.6
                                        }
                                    }}>
                                        {/* Content */}
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, md: 1.5 }, justifyContent: 'center' }}>
                                                <Rocket size={isMobile ? 24 : 28} color={theme.palette.primary.main} style={{ marginRight: isMobile ? 8 : 12 }} />
                                                <Typography variant="h4" fontWeight={700} sx={{
                                                    background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                                                    backgroundClip: 'text',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                                                    lineHeight: 1.2
                                                }}>
                                                    {isMobile ? 'Ready to Start?' : 'Ready to Transform Your Career?'}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body1" sx={{
                                                color: theme.palette.text.secondary,
                                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.05rem' },
                                                lineHeight: 1.6,
                                                maxWidth: '620px',
                                                mx: 'auto',
                                                px: { xs: 1, sm: 0 }
                                            }}>
                                                {isMobile
                                                    ? 'Your personalized strategy is ready. Activate now to start connecting with decision-makers today.'
                                                    : 'Get instant access to your personalized strategy and start connecting with decision-makers today.'
                                                }
                                            </Typography>
                                        </Box>

                                        {/* Button */}
                                        <Box sx={{ pt: { xs: 0, md: 1 } }}>
                                            <DotBridgeButton
                                                variant="contained"
                                                size="large"
                                                endIcon={!isProcessingPayment && <ArrowRight size={20} />}
                                                onClick={handleCtaOpen}
                                                disabled={isProcessingPayment || !editableTicketData.email || !editableTicketData.linkedin_url}
                                                sx={{
                                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                    color: 'white',
                                                    fontWeight: 700,
                                                    px: { xs: 3, md: 4 },
                                                    py: { xs: 1.25, md: 1.5 },
                                                    fontSize: { xs: '1rem', md: '1.125rem' },
                                                    borderRadius: { xs: 2, md: 3 },
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    textShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
                                                    boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
                                                    transition: 'all 0.3s ease',
                                                    minWidth: { xs: '180px', md: '200px' },
                                                    width: { xs: '100%', sm: 'auto' },
                                                    maxWidth: { xs: '280px', sm: 'none' },
                                                    '&::before': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: '-100%',
                                                        width: '100%',
                                                        height: '100%',
                                                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
                                                        transition: 'left 0.6s ease'
                                                    },
                                                    '&:hover': {
                                                        transform: isMobile ? 'none' : 'translateY(-3px) scale(1.05)',
                                                        boxShadow: `0 16px 48px ${theme.palette.primary.main}60`,
                                                        textShadow: '0 0 30px rgba(255, 255, 255, 1)',
                                                        '&::before': {
                                                            left: '100%'
                                                        }
                                                    },
                                                    '&:active': {
                                                        transform: isMobile ? 'scale(0.98)' : 'translateY(-1px) scale(1.02)'
                                                    },
                                                    '&:disabled': {
                                                        background: theme.palette.grey[400],
                                                        color: theme.palette.grey[600],
                                                        textShadow: 'none',
                                                        transform: 'none',
                                                        boxShadow: 'none'
                                                    }
                                                }}
                                            >
                                                {isProcessingPayment ? (
                                                    <>
                                                        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                                        Opening Secure Checkout...
                                                    </>
                                                ) : (
                                                    'Activate Strategy - $299'
                                                )}
                                            </DotBridgeButton>

                                            {/* Helper text for required fields */}
                                            {(!editableTicketData.email || !editableTicketData.linkedin_url) && (
                                                <Typography variant="caption" sx={{
                                                    display: 'block',
                                                    textAlign: 'center',
                                                    mt: 1,
                                                    color: theme.palette.warning.main,
                                                    fontSize: '0.75rem'
                                                }}>
                                                    ⚠️ Please fill in your email and LinkedIn URL above to activate your strategy
                                                </Typography>
                                            )}
                                        </Box>

                                        {/* Subtle glow effect */}
                                        <Box
                                            className="cta-glow"
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: '120%',
                                                height: '120%',
                                                background: `radial-gradient(circle, ${theme.palette.primary.main}05 0%, transparent 70%)`,
                                                opacity: 0,
                                                transition: 'opacity 0.3s ease',
                                                pointerEvents: 'none',
                                                zIndex: -1
                                            }}
                                        />
                                    </Box>
                                </motion.div>
                            )}

                        </motion.div>
                    </Box>
                )}

                {/* How It Works Section */}
                <Box id="how-it-works" sx={{
                    mb: { xs: 8, md: 12 },
                    py: { xs: 6, sm: 8, md: 12 },
                    px: { xs: 2, sm: 3, md: 4 },
                    position: 'relative',
                    background: `linear-gradient(135deg, 
                        ${theme.palette.background.paper} 0%, 
                        ${theme.palette.primary.main}03 25%,
                        ${theme.palette.secondary.main}02 75%,
                        ${theme.palette.background.paper} 100%
                    )`,
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -50,
                        left: -50,
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${theme.palette.primary.main}08 0%, transparent 70%)`,
                        filter: 'blur(60px)',
                        animation: 'float 20s ease-in-out infinite'
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -50,
                        right: -50,
                        width: 300,
                        height: 300,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${theme.palette.secondary.main}06 0%, transparent 70%)`,
                        filter: 'blur(80px)',
                        animation: 'float 25s ease-in-out infinite reverse'
                    },
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                        '33%': { transform: 'translate(30px, -30px) scale(1.1)' },
                        '66%': { transform: 'translate(-20px, 20px) scale(0.9)' }
                    },
                    '@keyframes progressGlow': {
                        '0%, 100%': { opacity: 0.3 },
                        '50%': { opacity: 0.6 }
                    }
                }}>
                    <Container maxWidth="lg" sx={{
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 1,
                        px: { xs: 1, sm: 2, md: 3 }
                    }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            {/* Journey Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Chip
                                    icon={<Rocket size={16} />}
                                    label="YOUR TRANSFORMATION JOURNEY"
                                    sx={{
                                        mb: { xs: 2, md: 3 },
                                        background: `linear-gradient(135deg, ${theme.palette.success.main}20 0%, ${theme.palette.primary.main}15 100%)`,
                                        color: theme.palette.primary.dark,
                                        fontWeight: 700,
                                        fontSize: { xs: '0.7rem', md: '0.75rem' },
                                        letterSpacing: '0.1em',
                                        px: { xs: 2, md: 3 },
                                        py: 0.5,
                                        border: '1px solid',
                                        borderColor: theme.palette.primary.light,
                                        boxShadow: '0 8px 24px rgba(0, 102, 255, 0.15)',
                                        '& .MuiChip-icon': {
                                            color: theme.palette.success.main
                                        }
                                    }}
                                />
                            </motion.div>

                            <DotBridgeTypography variant="h2" component="h2" sx={{
                                mb: { xs: 1, md: 2 },
                                fontWeight: 800,
                                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem', lg: '3.25rem' },
                                background: `linear-gradient(135deg, 
                                    ${theme.palette.text.primary} 0%, 
                                    ${theme.palette.primary.main} 50%, 
                                    ${theme.palette.secondary.main} 100%
                                )`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '-0.02em',
                                lineHeight: { xs: 1.2, md: 1.1 }
                            }}>
                                From Invisible to Interview-Ready
                            </DotBridgeTypography>

                            <DotBridgeTypography variant="h4" sx={{
                                mb: { xs: 1, md: 1 },
                                fontWeight: 600,
                                color: theme.palette.primary.main,
                                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' }
                            }}>
                                in 3 Strategic Steps
                            </DotBridgeTypography>

                            <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                                mb: 10,
                                maxWidth: '780px',
                                mx: 'auto',
                                lineHeight: 1.7,
                                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
                                fontWeight: 400
                            }}>
                                Our AI-powered transformation system turns your career dreams into a targeted action plan.
                                <Box component="span" sx={{
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    No more guessing, no more blind applications.
                                </Box>
                            </DotBridgeTypography>

                            {/* Journey Progress Bar */}
                            <Box sx={{
                                mb: 8,
                                display: { xs: 'none', md: 'block' },
                                position: 'relative'
                            }}>
                                <Box sx={{
                                    height: 4,
                                    background: `linear-gradient(90deg, 
                                        ${theme.palette.primary.main} 0%, 
                                        ${theme.palette.secondary.main} 50%, 
                                        ${theme.palette.success.main} 100%
                                    )`,
                                    borderRadius: 2,
                                    mx: 'auto',
                                    maxWidth: '600px',
                                    opacity: 0.3,
                                    animation: 'progressGlow 3s ease-in-out infinite',
                                    '@keyframes progressGlow': {
                                        '0%, 100%': { opacity: 0.3 },
                                        '50%': { opacity: 0.6 }
                                    }
                                }} />
                                <Typography variant="caption" sx={{
                                    position: 'absolute',
                                    top: 12,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    color: 'text.secondary',
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.1em'
                                }}>
                                    YOUR TRANSFORMATION TIMELINE
                                </Typography>
                            </Box>

                            <Grid container spacing={6} alignItems="stretch" sx={{ position: 'relative' }}>
                                {/* Connecting Lines for Desktop */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: '15%',
                                    left: '25%',
                                    width: '18%',
                                    height: 2,
                                    background: `linear-gradient(90deg, ${theme.palette.primary.main}60 0%, ${theme.palette.secondary.main}40 100%)`,
                                    borderRadius: 1,
                                    display: { xs: 'none', md: 'block' },
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        right: -8,
                                        top: -4,
                                        width: 0,
                                        height: 0,
                                        borderLeft: '8px solid',
                                        borderTop: '5px solid transparent',
                                        borderBottom: '5px solid transparent',
                                        borderLeftColor: theme.palette.secondary.main
                                    }
                                }} />
                                <Box sx={{
                                    position: 'absolute',
                                    top: '15%',
                                    right: '25%',
                                    width: '18%',
                                    height: 2,
                                    background: `linear-gradient(90deg, ${theme.palette.secondary.main}60 0%, ${theme.palette.success.main}40 100%)`,
                                    borderRadius: 1,
                                    display: { xs: 'none', md: 'block' },
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        right: -8,
                                        top: -4,
                                        width: 0,
                                        height: 0,
                                        borderLeft: '8px solid',
                                        borderTop: '5px solid transparent',
                                        borderBottom: '5px solid transparent',
                                        borderLeftColor: theme.palette.success.main
                                    }
                                }} />

                                {/* Step 1 */}
                                <Grid item xs={12} md={4}>
                                    <motion.div
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        style={{ height: '100%' }}
                                    >
                                        <DotBridgeCard sx={{
                                            p: { xs: 3, sm: 3.5, md: 4 },
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            textAlign: 'center',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            border: '2px solid',
                                            borderColor: 'transparent',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            background: `linear-gradient(135deg, 
                                                ${theme.palette.background.paper} 0%, 
                                                ${theme.palette.primary.main}05 100%
                                            )`,
                                            mx: { xs: 1, sm: 0 },
                                            '&:hover': {
                                                borderColor: theme.palette.primary.main,
                                                boxShadow: `0 20px 60px ${theme.palette.primary.main}25`,
                                                '& .step-icon': {
                                                    transform: 'scale(1.2) rotate(10deg)',
                                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                                                },
                                                '& .step-number': {
                                                    color: theme.palette.primary.main,
                                                    transform: 'scale(1.1)'
                                                },
                                                '& .step-progress': {
                                                    width: '100%'
                                                }
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: 6,
                                                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                                                borderRadius: '8px 8px 0 0'
                                            }
                                        }}>


                                            <Box sx={{ mb: 3, mt: 2 }}>
                                                <Typography
                                                    className="step-number"
                                                    variant="h2"
                                                    sx={{
                                                        color: theme.palette.primary.main,
                                                        fontWeight: 900,
                                                        fontSize: { xs: '2rem', md: '2.5rem' },
                                                        lineHeight: 1,
                                                        opacity: 0.8,
                                                        mb: 2,
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    01
                                                </Typography>
                                                <Box
                                                    className="step-icon"
                                                    sx={{
                                                        width: 80,
                                                        height: 80,
                                                        borderRadius: 3,
                                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.primary.main}10 100%)`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mx: 'auto',
                                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        border: `3px solid ${theme.palette.primary.main}20`
                                                    }}
                                                >
                                                    <FileText size={36} color={theme.palette.primary.main} />
                                                </Box>
                                            </Box>

                                            <Typography variant="h4" sx={{
                                                fontWeight: 700,
                                                mb: 2,
                                                color: 'text.primary',
                                                fontSize: { xs: '1.25rem', md: '1.5rem' }
                                            }}>
                                                🔍 Discover Your Hidden Power
                                            </Typography>

                                            <Typography variant="h6" sx={{
                                                fontWeight: 600,
                                                mb: 2,
                                                color: theme.palette.primary.main,
                                                fontSize: { xs: '1rem', md: '1.125rem' }
                                            }}>
                                                Analyze & Strategize
                                            </Typography>

                                            <Typography variant="body1" color="text.secondary" sx={{
                                                lineHeight: 1.7,
                                                flex: 1,
                                                fontSize: '1rem'
                                            }}>
                                                Upload your resume for an <strong>instant AI analysis</strong> that reveals your strongest selling points. Then chat with our AI Strategist to crystallize your career vision and create a personalized roadmap that actually works.
                                            </Typography>

                                            {/* Time Indicator */}
                                            <Box sx={{
                                                mt: 3,
                                                p: 1.5,
                                                background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.primary.main}05 100%)`,
                                                borderRadius: 2,
                                                border: `1px solid ${theme.palette.primary.main}20`
                                            }}>
                                                <Typography variant="caption" sx={{
                                                    color: theme.palette.primary.main,
                                                    fontWeight: 600,
                                                    fontSize: '0.8rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 0.5
                                                }}>
                                                    <Clock size={14} />
                                                    5-10 minutes
                                                </Typography>
                                            </Box>
                                        </DotBridgeCard>
                                    </motion.div>
                                </Grid>

                                {/* Step 2 */}
                                <Grid item xs={12} md={4}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        style={{ height: '100%' }}
                                    >
                                        <DotBridgeCard sx={{
                                            p: { xs: 3, sm: 3.5, md: 4 },
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            textAlign: 'center',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            border: '2px solid',
                                            borderColor: 'transparent',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            background: `linear-gradient(135deg, 
                                                ${theme.palette.background.paper} 0%, 
                                                ${theme.palette.secondary.main}05 100%
                                            )`,
                                            mx: { xs: 1, sm: 0 },
                                            '&:hover': {
                                                borderColor: theme.palette.secondary.main,
                                                boxShadow: `0 20px 60px ${theme.palette.secondary.main}25`,
                                                '& .step-icon': {
                                                    transform: 'scale(1.2) rotate(-10deg)',
                                                    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`
                                                },
                                                '& .step-number': {
                                                    color: theme.palette.secondary.main,
                                                    transform: 'scale(1.1)'
                                                },
                                                '& .step-progress': {
                                                    width: '100%'
                                                }
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: 6,
                                                background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
                                                borderRadius: '8px 8px 0 0'
                                            }
                                        }}>

                                            <Box sx={{ mb: { xs: 2, md: 3 }, mt: { xs: 1.5, md: 2 } }}>
                                                <Typography
                                                    className="step-number"
                                                    variant="h2"
                                                    sx={{
                                                        color: theme.palette.secondary.main,
                                                        fontWeight: 900,
                                                        fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                                                        lineHeight: 1,
                                                        opacity: 0.8,
                                                        mb: { xs: 1.5, md: 2 },
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    02
                                                </Typography>
                                                <Box
                                                    className="step-icon"
                                                    sx={{
                                                        width: { xs: 70, sm: 75, md: 80 },
                                                        height: { xs: 70, sm: 75, md: 80 },
                                                        borderRadius: 3,
                                                        background: `linear-gradient(135deg, ${theme.palette.secondary.main}20 0%, ${theme.palette.secondary.main}10 100%)`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mx: 'auto',
                                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        border: `3px solid ${theme.palette.secondary.main}20`
                                                    }}
                                                >
                                                    <Sparkles size={{ xs: 32, md: 36 }} color={theme.palette.secondary.main} />
                                                </Box>
                                            </Box>

                                            <Typography variant="h4" sx={{
                                                fontWeight: 700,
                                                mb: { xs: 1, md: 2 },
                                                color: 'text.primary',
                                                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                                                lineHeight: 1.3
                                            }}>
                                                ✨ Generate Your Blueprint
                                            </Typography>

                                            <Typography variant="h6" sx={{
                                                fontWeight: 600,
                                                mb: { xs: 1.5, md: 2 },
                                                color: theme.palette.secondary.main,
                                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.125rem' }
                                            }}>
                                                Unlock Your Playbook
                                            </Typography>

                                            <Typography variant="body1" color="text.secondary" sx={{
                                                lineHeight: 1.7,
                                                flex: 1,
                                                fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                                                px: { xs: 0.5, sm: 0 }
                                            }}>
                                                Our AI generates your comprehensive <strong>"ABC Playbook"</strong> proposal tailored to your unique profile. Review your custom strategy, approve your plan, and we'll officially commission our expert team to build your complete career acceleration package.
                                            </Typography>

                                            {/* Time Indicator */}
                                            <Box sx={{
                                                mt: { xs: 2, md: 3 },
                                                p: { xs: 1.25, md: 1.5 },
                                                background: `linear-gradient(135deg, ${theme.palette.secondary.main}10 0%, ${theme.palette.secondary.main}05 100%)`,
                                                borderRadius: 2,
                                                border: `1px solid ${theme.palette.secondary.main}20`
                                            }}>
                                                <Typography variant="caption" sx={{
                                                    color: theme.palette.secondary.main,
                                                    fontWeight: 600,
                                                    fontSize: { xs: '0.75rem', md: '0.8rem' },
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 0.5
                                                }}>
                                                    <Zap size={14} />
                                                    Instant generation
                                                </Typography>
                                            </Box>
                                        </DotBridgeCard>
                                    </motion.div>
                                </Grid>

                                {/* Step 3 */}
                                <Grid item xs={12} md={4}>
                                    <motion.div
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, delay: 0.6 }}
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        style={{ height: '100%' }}
                                    >
                                        <DotBridgeCard sx={{
                                            p: { xs: 3, sm: 3.5, md: 4 },
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            textAlign: 'center',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            border: '2px solid',
                                            borderColor: 'transparent',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            background: `linear-gradient(135deg, 
                                                ${theme.palette.background.paper} 0%, 
                                                ${theme.palette.success.main}05 100%
                                            )`,
                                            mx: { xs: 1, sm: 0 },
                                            '&:hover': {
                                                borderColor: theme.palette.success.main,
                                                boxShadow: `0 20px 60px ${theme.palette.success.main}25`,
                                                '& .step-icon': {
                                                    transform: 'scale(1.2) rotate(15deg)',
                                                    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
                                                },
                                                '& .step-number': {
                                                    color: theme.palette.success.main,
                                                    transform: 'scale(1.1)'
                                                },
                                                '& .step-progress': {
                                                    width: '100%'
                                                }
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: 6,
                                                background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
                                                borderRadius: '8px 8px 0 0'
                                            }
                                        }}>

                                            <Box sx={{ mb: { xs: 2, md: 3 }, mt: { xs: 1.5, md: 2 } }}>
                                                <Typography
                                                    className="step-number"
                                                    variant="h2"
                                                    sx={{
                                                        color: theme.palette.success.main,
                                                        fontWeight: 900,
                                                        fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                                                        lineHeight: 1,
                                                        opacity: 0.8,
                                                        mb: { xs: 1.5, md: 2 },
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    03
                                                </Typography>
                                                <Box
                                                    className="step-icon"
                                                    sx={{
                                                        width: { xs: 70, sm: 75, md: 80 },
                                                        height: { xs: 70, sm: 75, md: 80 },
                                                        borderRadius: 3,
                                                        background: `linear-gradient(135deg, ${theme.palette.success.main}20 0%, ${theme.palette.success.main}10 100%)`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mx: 'auto',
                                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        border: `3px solid ${theme.palette.success.main}20`
                                                    }}
                                                >
                                                    <Rocket size={{ xs: 32, md: 36 }} color={theme.palette.success.main} />
                                                </Box>
                                            </Box>

                                            <Typography variant="h4" sx={{
                                                fontWeight: 700,
                                                mb: { xs: 1, md: 2 },
                                                color: 'text.primary',
                                                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                                                lineHeight: 1.3
                                            }}>
                                                🚀 Launch Your Success
                                            </Typography>

                                            <Typography variant="h6" sx={{
                                                fontWeight: 600,
                                                mb: { xs: 1.5, md: 2 },
                                                color: theme.palette.success.main,
                                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.125rem' }
                                            }}>
                                                Execute with Confidence
                                            </Typography>

                                            <Typography variant="body1" color="text.secondary" sx={{
                                                lineHeight: 1.7,
                                                flex: 1,
                                                fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                                                px: { xs: 0.5, sm: 0 }
                                            }}>
                                                Within <strong>72 hours</strong>, access your private Command Center with everything you need: your optimized resume, Opportunity Matrix of 50+ targeted companies, personalized outreach scripts, and your complete 14-Day Action Plan.
                                            </Typography>

                                            {/* Time Indicator */}
                                            <Box sx={{
                                                mt: { xs: 2, md: 3 },
                                                p: { xs: 1.25, md: 1.5 },
                                                background: `linear-gradient(135deg, ${theme.palette.success.main}15 0%, ${theme.palette.success.main}05 100%)`,
                                                borderRadius: 2,
                                                border: `1px solid ${theme.palette.success.main}20`
                                            }}>
                                                <Typography variant="caption" sx={{
                                                    color: theme.palette.success.main,
                                                    fontWeight: 600,
                                                    fontSize: { xs: '0.75rem', md: '0.8rem' },
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 0.5
                                                }}>
                                                    <Rocket size={14} />
                                                    72-hour delivery
                                                </Typography>
                                            </Box>
                                        </DotBridgeCard>
                                    </motion.div>
                                </Grid>
                            </Grid>

                            {/* Final CTA Section */}
                            <Box sx={{ mt: 12, position: 'relative' }}>

                                {/* Motivational Quote */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 1.2 }}
                                >
                                    <Box sx={{
                                        textAlign: 'center',
                                        mb: 6,
                                        p: 4,
                                        borderRadius: 3,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}05 50%, ${theme.palette.success.main}08 100%)`,
                                        border: `1px solid ${theme.palette.primary.main}15`,
                                        maxWidth: '800px',
                                        mx: 'auto'
                                    }}>
                                        <Typography variant="h4" sx={{
                                            fontWeight: 600,
                                            fontStyle: 'italic',
                                            color: theme.palette.text.primary,
                                            mb: 2,
                                            fontSize: { xs: '1.25rem', md: '1.5rem' }
                                        }}>
                                            "Your next career breakthrough is just three steps away."
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{
                                            fontSize: '1rem',
                                            fontWeight: 500
                                        }}>
                                            Don't let another opportunity slip by while you're stuck in the application black hole.
                                        </Typography>
                                    </Box>
                                </motion.div>

                                {/* Enhanced CTA Button */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 1.4 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <DotBridgeButton
                                        variant="contained"
                                        size="large"
                                        onClick={() => document.getElementById('ai-resume-analyzer-section')?.scrollIntoView({ behavior: 'smooth' })}
                                        endIcon={<ArrowRight size={20} />}
                                        sx={{
                                            px: 6,
                                            py: 2.5,
                                            fontSize: '1.25rem',
                                            fontWeight: 700,
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.success.main} 100%)`,
                                            boxShadow: '0 12px 40px rgba(0, 102, 255, 0.3)',
                                            borderRadius: 3,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            minWidth: '280px',
                                            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                                            animation: 'glow 2s ease-in-out infinite alternate',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: '-100%',
                                                width: '100%',
                                                height: '100%',
                                                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                                                transition: 'left 0.6s ease'
                                            },
                                            '&:hover': {
                                                transform: 'translateY(-4px) scale(1.02)',
                                                boxShadow: '0 20px 60px rgba(0, 102, 255, 0.4)',
                                                animation: 'none',
                                                '&::before': {
                                                    left: '100%'
                                                }
                                            },
                                            '@keyframes glow': {
                                                '0%': {
                                                    boxShadow: '0 12px 40px rgba(0, 102, 255, 0.3)'
                                                },
                                                '100%': {
                                                    boxShadow: '0 16px 50px rgba(0, 102, 255, 0.5)'
                                                }
                                            }
                                        }}
                                    >
                                        🚀 Start My Transformation Journey
                                    </DotBridgeButton>
                                </motion.div>

                                <Typography variant="body2" color="text.secondary" sx={{
                                    mt: 3,
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1
                                }}>
                                    <CheckCircle size={16} color={theme.palette.success.main} />
                                    Free resume analysis • No commitments • Start in seconds
                                </Typography>
                            </Box>
                        </motion.div>
                    </Container>
                </Box>

                {/* What You Get Section - Enhanced */}
                <Box sx={{
                    mb: { xs: 8, md: 12 },
                    py: { xs: 4, sm: 6, md: 8 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <Container maxWidth="lg" sx={{ width: '100%' }}>
                        <DotBridgeTypography variant="h3" sx={{
                            textAlign: 'center',
                            mb: { xs: 4, sm: 6, md: 8 },
                            fontWeight: 600,
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                            px: { xs: 2, sm: 0 },
                            lineHeight: 1.3
                        }}>
                            Your Complete Job Outreach System Includes:
                        </DotBridgeTypography>

                        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{
                            maxWidth: '1200px',
                            mx: 'auto',
                            px: { xs: 1, sm: 2, md: 4 }
                        }}>
                            {[
                                {
                                    icon: <FileText size={isMobile ? 28 : 32} />,
                                    title: "AI-Driven Resume Analysis",
                                    description: "Get specific, actionable feedback and an optimized resume for ATS systems and human readers",
                                    color: '#007AFF'
                                },
                                {
                                    icon: <Search size={isMobile ? 28 : 32} />,
                                    title: "Curated Employer List",
                                    description: "50-100+ targeted companies with direct decision-maker contacts who are likely to hire you",
                                    color: '#5856D6'
                                },
                                {
                                    icon: <MessageSquare size={isMobile ? 28 : 32} />,
                                    title: "Custom Outreach Templates",
                                    description: "3-5 proven email & LinkedIn message templates personalized for your background and goals",
                                    color: '#AF52DE'
                                },
                                {
                                    icon: <Calendar size={isMobile ? 28 : 32} />,
                                    title: "Daily Action Calendar",
                                    description: "Step-by-step roadmap showing exactly who to contact, when, and how to follow up",
                                    color: '#FF3B30'
                                },
                                {
                                    icon: <TrendingUp size={isMobile ? 28 : 32} />,
                                    title: "Response Tracking System",
                                    description: "Simple spreadsheet to track your outreach, responses, and interview pipeline",
                                    color: '#34C759'
                                },
                                {
                                    icon: <Sparkles size={isMobile ? 28 : 32} />,
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
                                        whileHover={!isMobile ? { y: -4 } : {}}
                                    >
                                        <DotBridgeCard
                                            sx={{
                                                p: { xs: 2, sm: 2.5, md: 3 },
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: { xs: 1.5, md: 2 },
                                                transition: 'all 0.3s ease',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                borderRadius: { xs: 2, md: 3 },
                                                '&:hover': {
                                                    borderColor: item.color,
                                                    boxShadow: `0 8px 24px ${item.color}20`,
                                                    '& .deliverable-icon': {
                                                        transform: isMobile ? 'none' : 'scale(1.1) rotate(5deg)'
                                                    }
                                                }
                                            }}
                                        >
                                            <Box
                                                className="deliverable-icon"
                                                sx={{
                                                    width: { xs: 48, sm: 52, md: 56 },
                                                    height: { xs: 48, sm: 52, md: 56 },
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
                                                <Typography variant="h6" sx={{
                                                    fontWeight: 600,
                                                    mb: { xs: 0.5, md: 1 },
                                                    fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.125rem' },
                                                    lineHeight: 1.3
                                                }}>
                                                    {item.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{
                                                    lineHeight: 1.6,
                                                    fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.875rem' }
                                                }}>
                                                    {item.description}
                                                </Typography>
                                            </Box>
                                        </DotBridgeCard>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>




                {/* Lead Capture Form */}
                <Box id="lead-form" sx={{
                    mb: { xs: 8, md: 12 },
                    py: { xs: 6, sm: 8, md: 10 },
                    px: { xs: 1, sm: 2, md: 3, lg: 4 }
                }}>
                    <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
                        {/* Redirect Notice */}
                        <Box sx={{
                            textAlign: 'center',
                            mb: { xs: 3, md: 4 },
                            p: { xs: 2, md: 3 },
                            background: `linear-gradient(135deg, ${theme.palette.warning.main}15 0%, ${theme.palette.warning.main}05 100%)`,
                            border: `2px solid ${theme.palette.warning.main}30`,
                            borderRadius: { xs: 2, md: 3 },
                            mx: { xs: 1, sm: 0 }
                        }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 600,
                                mb: 1,
                                color: theme.palette.warning.dark,
                                fontSize: { xs: '1rem', md: '1.125rem' }
                            }}>
                                ⚡ Want Faster Results?
                            </Typography>
                            <Typography variant="body1" sx={{
                                color: theme.palette.text.secondary,
                                mb: 2,
                                fontSize: { xs: '0.9rem', md: '1rem' }
                            }}>
                                Skip the form below and get your personalized strategy in minutes instead of days.
                            </Typography>
                            <DotBridgeButton
                                variant="contained"
                                size="medium"
                                onClick={() => document.getElementById('ai-resume-analyzer-section')?.scrollIntoView({ behavior: 'smooth' })}
                                sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
                                    color: 'white',
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1,
                                    fontSize: '0.9rem',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 8px 24px ${theme.palette.warning.main}40`
                                    }
                                }}
                            >
                                🚀 Start with Free Analysis Instead
                            </DotBridgeButton>
                        </Box>

                        <DotBridgeCard
                            sx={{
                                p: { xs: 2.5, sm: 3, md: 4 },
                                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.lighter}10 100%)`,
                                border: '2px solid',
                                borderColor: 'primary.light',
                                boxShadow: '0 8px 32px rgba(0, 102, 255, 0.1)',
                                borderRadius: { xs: 2, md: 3 },
                                mx: { xs: 1, sm: 0 }
                            }}
                        >
                            <DotBridgeTypography variant="h4" sx={{
                                textAlign: 'center',
                                mb: { xs: 1.5, md: 2 },
                                fontWeight: 700,
                                fontSize: { xs: '1.375rem', sm: '1.5rem', md: '1.75rem' },
                                lineHeight: 1.3
                            }}>
                                Alternative: Request Manual Playbook Build
                            </DotBridgeTypography>

                            <DotBridgeTypography variant="body1" sx={{
                                textAlign: 'center',
                                mb: { xs: 2, md: 3 },
                                color: theme.palette.text.secondary,
                                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.125rem' },
                                lineHeight: 1.6,
                                px: { xs: 0.5, sm: 0 }
                            }}>
                                Prefer a more traditional approach? Fill out the form below with your details.
                                Our team will personally review your profile and contact you within one business day to begin building your complete job outreach system.
                            </DotBridgeTypography>

                            <DotBridgeTypography variant="body1" sx={{
                                textAlign: 'center',
                                mb: { xs: 3, md: 4 },
                                color: theme.palette.primary.main,
                                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                                fontWeight: 600,
                                px: { xs: 0.5, sm: 0 }
                            }}>
                                This is our full, done-for-you service, starting at $299
                            </DotBridgeTypography>

                            {leadSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Box sx={{ textAlign: 'center', py: { xs: 3, md: 4 } }}>
                                        <CheckCircle size={64} color={theme.palette.success.main} />
                                        <Typography variant="h5" sx={{
                                            mt: 2,
                                            mb: 1,
                                            fontWeight: 600,
                                            fontSize: { xs: '1.25rem', md: '1.5rem' }
                                        }}>
                                            You're All Set!
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{
                                            fontSize: { xs: '0.9rem', md: '1rem' }
                                        }}>
                                            Check your email for next steps. We'll be in touch within 24 hours.
                                        </Typography>
                                    </Box>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleLeadSubmit}>
                                    <Grid container spacing={{ xs: 2, md: 3 }}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Full Name *"
                                                name="name"
                                                value={leadForm.name}
                                                onChange={handleInputChange}
                                                required
                                                variant="outlined"
                                                size="medium"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Email Address *"
                                                name="email"
                                                type="email"
                                                value={leadForm.email}
                                                onChange={handleInputChange}
                                                required
                                                variant="outlined"
                                                size="medium"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="LinkedIn Profile URL"
                                                name="linkedinUrl"
                                                value={leadForm.linkedinUrl || ''}
                                                onChange={handleInputChange}
                                                variant="outlined"
                                                size="medium"
                                                placeholder="https://linkedin.com/in/your-profile"
                                                helperText="This is more valuable than a phone number at this stage."
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Your #1 Target Job Title"
                                                name="targetJobTitle"
                                                value={leadForm.targetJobTitle || ''}
                                                onChange={handleInputChange}
                                                variant="outlined"
                                                size="medium"
                                                placeholder="e.g. Senior Software Engineer, Marketing Manager, Sales Director"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="What's your biggest job search challenge right now?"
                                                name="biggestChallenge"
                                                value={leadForm.biggestChallenge || ''}
                                                onChange={handleInputChange}
                                                variant="outlined"
                                                size="medium"
                                                multiline
                                                rows={3}
                                                placeholder="e.g. Not getting responses to applications, don't know where to find the right opportunities, lack of interview invitations..."
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box sx={{
                                                border: '2px dashed',
                                                borderColor: leadForm.resumeFile ? theme.palette.success.main : theme.palette.grey[300],
                                                borderRadius: 2,
                                                p: 3,
                                                textAlign: 'center',
                                                transition: 'all 0.3s ease',
                                                background: leadForm.resumeFile ? `${theme.palette.success.main}08` : 'transparent',
                                                '&:hover': {
                                                    borderColor: theme.palette.primary.main,
                                                    backgroundColor: leadForm.resumeFile ? `${theme.palette.success.main}10` : theme.palette.primary.lighter
                                                }
                                            }}>
                                                {leadForm.resumeFile ? (
                                                    // File selected state
                                                    <>
                                                        <CheckCircle size={32} color={theme.palette.success.main} />
                                                        <Typography variant="body1" sx={{ mt: 1, mb: 0.5, fontWeight: 600, color: theme.palette.success.main }}>
                                                            File Selected!
                                                        </Typography>
                                                        <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.9rem', mb: 1.5 }}>
                                                            {leadForm.resumeFile.name} ({(leadForm.resumeFile.size / 1024 / 1024).toFixed(1)} MB)
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                            <DotBridgeButton
                                                                variant="outlined"
                                                                size="small"
                                                                onClick={handleFileUploadClick}
                                                                sx={{
                                                                    borderColor: theme.palette.primary.main,
                                                                    color: theme.palette.primary.main
                                                                }}
                                                            >
                                                                Change File
                                                            </DotBridgeButton>
                                                            <DotBridgeButton
                                                                variant="outlined"
                                                                size="small"
                                                                onClick={handleFileRemove}
                                                                sx={{
                                                                    borderColor: theme.palette.error.main,
                                                                    color: theme.palette.error.main,
                                                                    '&:hover': {
                                                                        borderColor: theme.palette.error.dark,
                                                                        backgroundColor: `${theme.palette.error.main}08`
                                                                    }
                                                                }}
                                                                startIcon={<X size={16} />}
                                                            >
                                                                Remove
                                                            </DotBridgeButton>
                                                        </Box>
                                                    </>
                                                ) : (
                                                    // No file selected state
                                                    <>
                                                        <Upload size={32} color={theme.palette.grey[500]} />
                                                        <Typography variant="body1" sx={{ mt: 1, mb: 0.5, fontWeight: 500 }}>
                                                            Upload Your Resume
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 2 }}>
                                                            Optional - helps us provide more targeted recommendations
                                                            <br />
                                                            Supports PDF files only (max 5MB)
                                                        </Typography>
                                                        <DotBridgeButton
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={handleFileUploadClick}
                                                            startIcon={<Upload size={16} />}
                                                        >
                                                            Choose File
                                                        </DotBridgeButton>
                                                    </>
                                                )}
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    style={{ display: 'none' }}
                                                    onChange={handleFileSelect}
                                                    accept=".pdf,application/pdf"
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <DotBridgeButton
                                                type="submit"
                                                variant="contained"
                                                fullWidth
                                                size="large"
                                                disabled={leadSubmitting}
                                                sx={{
                                                    py: { xs: 1.75, md: 2 },
                                                    fontSize: { xs: '1rem', md: '1.125rem' },
                                                    fontWeight: 600,
                                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                    boxShadow: '0 8px 24px rgba(0, 102, 255, 0.3)',
                                                    borderRadius: 2,
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 12px 32px rgba(0, 102, 255, 0.4)'
                                                    }
                                                }}
                                            >
                                                {leadSubmitting ? (
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
                    </Box>
                </Box>

            </PageContainer>



            <Footer />

            {/* CTA Modal */}
            <Modal
                open={ctaModalOpen}
                onClose={handleCtaClose}
                closeAfterTransition
                disableAutoFocus={true}
                disableEnforceFocus={true}
                disableRestoreFocus={true}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                    sx: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.7)' }
                }}
            >
                <Fade in={ctaModalOpen}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: '400px' },
                        bgcolor: 'background.paper',
                        borderRadius: 3,
                        boxShadow: `0 24px 80px rgba(0, 102, 255, 0.3)`,
                        p: 4,
                        outline: 'none',
                        border: `2px solid ${theme.palette.primary.main}20`
                    }}>
                        {ctaSubmitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Box sx={{ textAlign: 'center', py: 2 }}>
                                    <CheckCircle size={64} color={theme.palette.success.main} />
                                    <Typography variant="h5" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                                        Perfect! You're All Set! 🚀
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Check your email for instant access to your career strategy.
                                    </Typography>
                                </Box>
                            </motion.div>
                        ) : (
                            <>
                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <Rocket size={48} color={theme.palette.primary.main} />
                                    <Typography variant="h4" sx={{
                                        mt: 2,
                                        mb: 1,
                                        fontWeight: 700,
                                        background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>
                                        Activate Your Strategy
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                        Get instant access to your personalized career acceleration strategy
                                    </Typography>
                                </Box>

                                <form onSubmit={handleCtaSubmit}>
                                    <TextField
                                        fullWidth
                                        label="Your Email Address"
                                        type="email"
                                        value={ctaEmail}
                                        onChange={(e) => setCtaEmail(e.target.value)}
                                        required
                                        variant="outlined"
                                        sx={{ mb: 3 }}
                                        InputProps={{
                                            sx: {
                                                borderRadius: 2,
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: theme.palette.primary.main,
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: theme.palette.primary.main,
                                                }
                                            }
                                        }}
                                    />

                                    <DotBridgeButton
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={ctaSubmitting}
                                        endIcon={!ctaSubmitting && <ArrowRight size={20} />}
                                        sx={{
                                            py: 1.75,
                                            fontSize: '1.125rem',
                                            fontWeight: 700,
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                            borderRadius: 2,
                                            textShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
                                            boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 12px 40px ${theme.palette.primary.main}60`,
                                                textShadow: '0 0 30px rgba(255, 255, 255, 1)',
                                            },
                                            '&:disabled': {
                                                background: theme.palette.grey[400],
                                                textShadow: 'none',
                                                transform: 'none'
                                            }
                                        }}
                                    >
                                        {ctaSubmitting ? (
                                            <>
                                                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                                Activating...
                                            </>
                                        ) : (
                                            'Get Instant Access'
                                        )}
                                    </DotBridgeButton>

                                    <Typography variant="caption" color="text.secondary" sx={{
                                        display: 'block',
                                        textAlign: 'center',
                                        mt: 2,
                                        fontSize: '0.75rem'
                                    }}>
                                        🔒 Your information is secure and will never be shared
                                    </Typography>
                                </form>
                            </>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default CareerAcceleratorPage; 