import React, { useState, useCallback } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Chip,
    LinearProgress,
    IconButton,
    Alert,
    Collapse,
    Rating,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    useTheme,
    alpha,
    Fade,
    Grow,
    CircularProgress,
    TextField,
    Button,
    Card,
    CardContent,
    CardHeader,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { api } from '../api';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    X,
    FileText,
    CheckCircle,
    AlertCircle,
    Star,
    BarChart3,
    Lightbulb,
    RefreshCw,
    Target,
    TrendingUp,
    Award,
    Briefcase,
    ChevronRight,
    FileCheck,
    Download,
    Eye,
    Edit2,
    Plus,
    ChevronDown,
    ChevronUp,
    Save,
    Search,
    Building,
    Sparkles,
    Shield
} from 'lucide-react';
import DotBridgeButton from './DotBridgeButton';
import DotBridgeTypography from './DotBridgeTypography';
import DotBridgeCard from './DotBridgeCard';

// Styled components
const UploadZone = styled(Paper)(({ theme, isDragActive, hasFile }) => ({
    padding: theme.spacing(6),
    textAlign: 'center',
    border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: isDragActive
        ? alpha(theme.palette.primary.main, 0.05)
        : hasFile
            ? alpha(theme.palette.success.main, 0.05)
            : theme.palette.background.paper,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.02),
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4]
    }
}));

const DashboardCard = styled(Card)(({ theme }) => ({
    height: '100%',
    transition: 'all 0.3s ease',
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
        boxShadow: theme.shadows[4],
        borderColor: theme.palette.primary.light
    }
}));

const ScoreDisplay = styled(Box)(({ theme, score }) => {
    const getScoreColor = (score) => {
        if (score >= 8) return theme.palette.success.main;
        if (score >= 6) return theme.palette.warning.main;
        return theme.palette.error.main;
    };

    return {
        width: 100,
        height: 100,
        borderRadius: '50%',
        border: `6px solid ${getScoreColor(score)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: `conic-gradient(${getScoreColor(score)} ${score * 10}%, ${theme.palette.grey[200]} ${score * 10}%)`,
        '&::before': {
            content: '""',
            position: 'absolute',
            width: '85%',
            height: '85%',
            borderRadius: '50%',
            backgroundColor: theme.palette.background.paper
        }
    };
});

const ResumeAnalyzer = ({
    showPersonalizedStrategist,
    setShowPersonalizedStrategist,
    personalizationId,
    setPersonalizationId,
    isCreatingPersonalization,
    setIsCreatingPersonalization
}) => {
    const theme = useTheme();
    const [file, setFile] = useState(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [error, setError] = useState(null);
    const [editingTitles, setEditingTitles] = useState(false);
    const [customTitles, setCustomTitles] = useState([]);
    const [activeInsight, setActiveInsight] = useState('keywords'); // For additional insights tabs

    // Expandable sections state
    const [expandedSections, setExpandedSections] = useState({
        strengths: true,
        improvements: false,
        strategy: false,
        keywords: false,
        jobTitles: false,
        companies: false
    });

    // Analysis results from API
    const [analysisResults, setAnalysisResults] = useState(null);

    // Sample data for preview
    const sampleData = {
        overallScore: 7.5,
        candidateName: "Sarah Chen",
        potentialTitles: ["Senior Software Engineer", "Full Stack Developer", "Technical Lead", "Software Architect"],
        strengths: [
            "Strong full-stack experience with React, Node.js, and Python demonstrated across 3 major projects",
            "Led cross-functional team of 8 engineers, showing leadership potential",
            "Quantified achievements: 'Reduced API response time by 45%' shows impact focus",
            "Active open-source contributor with 2.5k GitHub stars on personal projects"
        ],
        improvements: [
            {
                category: "Keywords",
                suggestion: "Add cloud platform keywords like 'AWS', 'Docker', 'Kubernetes' which appear in 78% of senior roles",
                impact: "high"
            },
            {
                category: "Quantification",
                suggestion: "Quantify team leadership impact - add metrics like team velocity improvement or project delivery time",
                impact: "high"
            },
            {
                category: "Skills",
                suggestion: "Add a dedicated 'Technical Skills' section with categorized skills (Languages, Frameworks, Tools, Cloud)",
                impact: "medium"
            },
            {
                category: "Format",
                suggestion: "Use consistent bullet point format and action verbs throughout experience section",
                impact: "low"
            }
        ],
        targetRoleMatch: {
            "Senior Software Engineer": 85,
            "Full Stack Developer": 78,
            "Technical Lead": 72,
            "Software Architect": 68
        },
        strategy: "Your combination of technical depth and emerging leadership experience positions you well for senior IC or team lead roles. Focus on highlighting your mentorship experience and architectural decisions to stand out for technical lead positions. Consider pursuing AWS certifications to strengthen your cloud expertise.",
        keywordGaps: ["Microservices", "CI/CD", "Agile", "System Design", "AWS/GCP", "Docker", "REST API", "Unit Testing", "Scrum", "DevOps"],
        industryInsights: "The market for senior engineers with full-stack expertise is strong, with 23% YoY growth. Companies are especially seeking engineers who can mentor others and make architectural decisions.",
        suggestedJobTitles: [
            "Senior Software Engineer",
            "Senior Full Stack Developer",
            "Staff Software Engineer",
            "Technical Lead - Full Stack",
            "Principal Software Engineer",
            "Software Architect",
            "Engineering Manager",
            "Senior Backend Engineer"
        ],
        targetCompanies: [
            "Mid-size tech companies (Series B-D)",
            "Stripe, Square, Plaid",
            "Enterprise SaaS companies",
            "GitLab, Zapier (Remote-first)",
            "Thoughtworks",
            "Google, Meta, Amazon"
        ]
    };

    // File handling
    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    }, []);

    const handleFileSelect = (selectedFile) => {
        // Validate file type
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const validExtensions = ['.pdf', '.docx'];

        const fileExtension = selectedFile.name.toLowerCase().substr(selectedFile.name.lastIndexOf('.'));

        if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(fileExtension)) {
            setError('Please upload a PDF or DOCX file');
            return;
        }

        // Validate file size (max 10MB)
        if (selectedFile.size > 10 * 1024 * 1024) {
            setError('File size must be less than 10MB');
            return;
        }

        setError(null);
        setFile(selectedFile);
        setAnalysisComplete(false);
        setAnalysisResults(null);
    };

    const handleFileInputChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            handleFileSelect(selectedFile);
        }
    };

    const removeFile = () => {
        setFile(null);
        setAnalysisComplete(false);
        setAnalysisResults(null);
        setError(null);
        setEditingTitles(false);
        setCustomTitles([]);
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleStartEditingTitles = () => {
        // Don't reset customTitles if already populated, preserve edits
        if (customTitles.length === 0 && analysisResults?.potentialTitles) {
            setCustomTitles([...analysisResults.potentialTitles]);
        }
        setEditingTitles(true);
    };

    const handleSaveTitles = () => {
        // Save the custom titles back to analysis results
        if (analysisResults) {
            setAnalysisResults(prev => ({
                ...prev,
                potentialTitles: [...customTitles.filter(title => title.trim() !== '')]
            }));
        }
        setEditingTitles(false);
    };

    const handleCancelEditingTitles = () => {
        // Reset to original titles
        if (analysisResults?.potentialTitles) {
            setCustomTitles([...analysisResults.potentialTitles]);
        }
        setEditingTitles(false);
    };

    const analyzeResume = async () => {
        setIsAnalyzing(true);
        setError(null);

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('resume', file);

            // Get or create session ID for anonymous users
            let sessionId = localStorage.getItem('resumeSessionId');
            if (!sessionId) {
                sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                localStorage.setItem('resumeSessionId', sessionId);
            }

            // Make API call using centralized api object
            const response = await api.post('/resume-analysis', formData, {
                headers: {
                    'X-Session-ID': sessionId,
                    'Content-Type': 'multipart/form-data'
                }
            });

            const data = response.data;

            // Store analysis ID for future reference
            localStorage.setItem('lastAnalysisId', data.analysis_id);

            // Set results
            setAnalysisResults(data.results);
            setIsAnalyzing(false);
            setAnalysisComplete(true);

            // Initialize custom titles with the potential titles
            if (data.results.potentialTitles) {
                setCustomTitles([...data.results.potentialTitles]);
            }

        } catch (err) {
            console.error('Error analyzing resume:', err);
            setError(err.message || 'Failed to analyze resume. Please try again.');
            setIsAnalyzing(false);
        }
    };

    // Simplified function to create personalization record
    const createPersonalizationRecord = async (analysisData, brdgeId = 448) => {
        console.log('📊 Creating personalization record for bridge ID:', brdgeId);

        const response = await api.post(`/brdges/${brdgeId}/personalization/demo-record`, {
            template_name: 'Resume Analysis',
            columns: [
                { name: 'name', usage_note: 'Use to personalize greetings and conversation', example: 'Sarah Chen' },
                { name: 'experience_level', usage_note: 'Tailor advice complexity to their experience', example: 'Experienced' },
                { name: 'current_role', usage_note: 'Reference their current position when giving examples', example: 'Senior Software Engineer' },
                { name: 'industry', usage_note: 'Use industry-specific examples and terminology', example: 'Technology' },
                { name: 'skills', usage_note: 'Reference their skills when discussing opportunities', example: 'React, Node.js, Python' },
                { name: 'career_goals', usage_note: 'Align advice with their stated career objectives', example: 'Tech Lead position' },
                { name: 'resume_score', usage_note: 'Starting point for improvement discussions', example: '85' },
                { name: 'resume_strengths', usage_note: 'Build on these positive aspects', example: 'Strong technical skills' },
                { name: 'resume_improvements', usage_note: 'Focus coaching on these areas', example: 'Add more metrics' },
                { name: 'resume_suggestions', usage_note: 'Specific actionable advice to provide', example: 'Quantify achievements' }
            ],
            data: {
                // Core profile data
                name: analysisData.candidateName || 'Professional',
                experience_level: analysisData.experienceLevel || 'Experienced',
                current_role: analysisData.potentialTitles?.[0] || 'Software Engineer',
                industry: 'Technology',
                skills: analysisData.keywordGaps?.slice(0, 5).join(', ') || 'React, Node.js, Python',
                career_goals: analysisData.strategy || 'Advance to senior technical roles',
                resume_score: analysisData.overallScore || 0,
                resume_strengths: Array.isArray(analysisData.strengths) ? analysisData.strengths.join('; ') : (analysisData.strengths || ''),
                resume_improvements: Array.isArray(analysisData.improvements) ?
                    analysisData.improvements.map(imp => imp.suggestion || imp).join('; ') :
                    (analysisData.improvements || ''),
                resume_suggestions: analysisData.strategy || '',
            }
        }, {
            headers: {
                'X-Session-Fingerprint': navigator.userAgent.substring(0, 100) + '-' + Date.now()
            }
        });

        console.log('✅ Personalization record created:', response.data);
        return response.data.unique_id;
    };

    // New approach: Create personalization first, then mount AgentConnector
    const handleAIStrategistClick = async () => {
        if (isCreatingPersonalization) return; // Prevent double clicks

        try {
            setIsCreatingPersonalization(true);
            console.log('🚀 Creating personalized AI strategist session...');

            // Create personalization record first using actual results or sample data
            const dataToUse = analysisResults || sampleData;
            const uniqueId = await createPersonalizationRecord(dataToUse, 448);
            console.log('✅ Personalization record created with ID:', uniqueId);

            // Set the personalization ID and show the AI strategist
            setPersonalizationId(uniqueId);
            setShowPersonalizedStrategist(true);

            // Small delay to ensure state is updated, then scroll
            setTimeout(() => {
                const demoSection = document.getElementById('demo-section');
                if (demoSection) {
                    demoSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    console.log('📍 Scrolled to personalized AI strategist');
                }
            }, 100);

        } catch (error) {
            console.error('❌ Error creating personalized session:', error);
            setError('Failed to create personalized session. Please try again.');
        } finally {
            setIsCreatingPersonalization(false);
        }
    };

    return (
        <Box sx={{
            maxWidth: 1600,
            mx: 'auto',
            p: { xs: 1, md: 2 }, // Reduced padding
            minHeight: '600px'
        }}>
            {/* Compact Header */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                    AI Resume Command Center
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Get instant insights and personalized career recommendations
                </Typography>
            </Box>

            <Grid container spacing={2}>
                {/* Left Column - Upload Section (Narrower) */}
                <Grid item xs={12} md={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Upload Card */}
                        <Card sx={{
                            border: '1px solid',
                            borderColor: theme.palette.divider,
                            borderRadius: 2,
                            overflow: 'visible'
                        }}>
                            <CardContent sx={{ p: 2 }}>
                                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Upload size={16} />
                                    Resume Upload
                                </Typography>

                                {!file ? (
                                    <Box>
                                        <UploadZone
                                            isDragActive={isDragActive}
                                            hasFile={false}
                                            onDragEnter={handleDragEnter}
                                            onDragLeave={handleDragLeave}
                                            onDragOver={handleDragOver}
                                            onDrop={handleDrop}
                                            onClick={() => document.getElementById('resume-upload').click()}
                                            sx={{
                                                height: '160px',
                                                p: 2,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                background: isDragActive ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                                                border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
                                            }}
                                        >
                                            <input
                                                id="resume-upload"
                                                type="file"
                                                accept=".pdf,.docx"
                                                onChange={handleFileInputChange}
                                                style={{ display: 'none' }}
                                            />
                                            <motion.div
                                                animate={{
                                                    scale: isDragActive ? 1.1 : 1,
                                                }}
                                                transition={{ duration: 0.2 }}
                                                style={{ textAlign: 'center' }}
                                            >
                                                <Upload size={32} color={theme.palette.primary.main} />
                                            </motion.div>
                                            <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
                                                {isDragActive ? 'Drop here' : 'Drop resume or browse'}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', mt: 1 }}>
                                                <Chip label="PDF" size="small" sx={{ height: 20, fontSize: '0.75rem' }} />
                                                <Chip label="DOCX" size="small" sx={{ height: 20, fontSize: '0.75rem' }} />
                                            </Box>
                                        </UploadZone>

                                        {/* Quick Stats */}
                                        <Box sx={{ mt: 2, p: 1.5, bgcolor: theme.palette.grey[50], borderRadius: 1 }}>
                                            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                                What you'll get:
                                            </Typography>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <CheckCircle size={12} color={theme.palette.success.main} />
                                                        <Typography variant="caption">ATS Score</Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <CheckCircle size={12} color={theme.palette.success.main} />
                                                        <Typography variant="caption">Target Roles</Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <CheckCircle size={12} color={theme.palette.success.main} />
                                                        <Typography variant="caption">Keywords</Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <CheckCircle size={12} color={theme.palette.success.main} />
                                                        <Typography variant="caption">Strategy</Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box>
                                        <Box sx={{
                                            p: 2,
                                            borderRadius: 1,
                                            bgcolor: alpha(theme.palette.success.main, 0.05),
                                            border: '1px solid',
                                            borderColor: alpha(theme.palette.success.main, 0.2),
                                            mb: 2
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <FileCheck size={20} color={theme.palette.success.main} />
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                                                            {file.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <IconButton
                                                    size="small"
                                                    onClick={removeFile}
                                                    sx={{
                                                        p: 0.5,
                                                        color: theme.palette.error.main,
                                                        '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) }
                                                    }}
                                                >
                                                    <X size={16} />
                                                </IconButton>
                                            </Box>
                                        </Box>

                                        <Button
                                            variant="contained"
                                            fullWidth
                                            onClick={analyzeResume}
                                            disabled={isAnalyzing || analysisComplete}
                                            startIcon={isAnalyzing ? <CircularProgress size={16} color="inherit" /> : <BarChart3 size={16} />}
                                            sx={{
                                                py: 1,
                                                bgcolor: theme.palette.primary.main,
                                                color: 'common.white',
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    bgcolor: theme.palette.primary.dark,
                                                    boxShadow: 'none'
                                                },
                                                '&.Mui-disabled': {
                                                    bgcolor: theme.palette.primary.main,
                                                    color: 'common.white'
                                                }
                                            }}
                                        >
                                            {isAnalyzing ? 'Analyzing...' : analysisComplete ? '✓ Complete' : 'Analyze Resume'}
                                        </Button>

                                        {analysisComplete && (
                                            <Button
                                                fullWidth
                                                size="small"
                                                variant="outlined"
                                                startIcon={<RefreshCw size={14} />}
                                                onClick={removeFile}
                                                sx={{ mt: 1 }}
                                            >
                                                New Resume
                                            </Button>
                                        )}
                                    </Box>
                                )}

                                {/* Error Alert */}
                                {error && (
                                    <Alert
                                        severity="error"
                                        onClose={() => setError(null)}
                                        sx={{ mt: 2 }}
                                    >
                                        {error}
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Tips Card - fills unused space */}
                        <Card sx={{
                            border: '1px solid',
                            borderColor: theme.palette.divider,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.02)
                        }}>
                            <CardContent sx={{ p: 2 }}>
                                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Lightbulb size={16} color={theme.palette.warning.main} />
                                    Pro Tips
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                        <Typography variant="caption" color="primary" fontWeight={600}>1.</Typography>
                                        <Typography variant="caption" sx={{ lineHeight: 1.4 }}>
                                            Use PDF format for best results
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                        <Typography variant="caption" color="primary" fontWeight={600}>2.</Typography>
                                        <Typography variant="caption" sx={{ lineHeight: 1.4 }}>
                                            Include all work experience
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                        <Typography variant="caption" color="primary" fontWeight={600}>3.</Typography>
                                        <Typography variant="caption" sx={{ lineHeight: 1.4 }}>
                                            List technical skills clearly
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Value Proposition */}
                        <Box sx={{
                            p: 2,
                            textAlign: 'center',
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.light, 0.04),
                            border: '1px solid',
                            borderColor: theme.palette.divider
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                                <Sparkles size={16} color={theme.palette.primary.main} />
                                <Typography variant="body2" fontWeight={600} color="text.primary">
                                    Personalized Career Growth
                                </Typography>
                            </Box>
                            <Typography variant="caption" sx={{
                                display: 'block',
                                color: theme.palette.text.secondary,
                                lineHeight: 1.5
                            }}>
                                Get AI-powered insights to match your perfect role, highlight your strengths, and accelerate your career journey
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Right Column - Analysis Results */}
                <Grid item xs={12} md={9}>
                    {/* Show preview when no analysis is complete */}
                    {!analysisComplete && !isAnalyzing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <AnalysisResults
                                data={sampleData}
                                isPreview={true}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                activeInsight={activeInsight}
                                setActiveInsight={setActiveInsight}
                                editingTitles={false}
                                customTitles={[]}
                                handleStartEditingTitles={() => { }}
                                handleSaveTitles={() => { }}
                                handleCancelEditingTitles={() => { }}
                                setCustomTitles={() => { }}
                                handleAIStrategistClick={handleAIStrategistClick}
                                isCreatingPersonalization={isCreatingPersonalization}
                            />
                        </motion.div>
                    )}

                    {/* Loading State - Analyzing */}
                    {isAnalyzing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card sx={{
                                height: '500px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid',
                                borderColor: theme.palette.divider
                            }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <CircularProgress size={60} thickness={2} />
                                    <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
                                        Analyzing Your Resume
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: '400px' }}>
                                        Our AI is extracting insights and matching you with opportunities...
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                        {['Parsing', 'Analyzing', 'Matching', 'Generating'].map((step, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                            >
                                                <Chip
                                                    label={step}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                    sx={{ fontSize: '0.75rem' }}
                                                />
                                            </motion.div>
                                        ))}
                                    </Box>
                                </Box>
                            </Card>
                        </motion.div>
                    )}

                    {/* Analysis Results */}
                    {analysisComplete && analysisResults && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <AnalysisResults
                                data={analysisResults}
                                isPreview={false}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                activeInsight={activeInsight}
                                setActiveInsight={setActiveInsight}
                                editingTitles={editingTitles}
                                customTitles={customTitles}
                                handleStartEditingTitles={handleStartEditingTitles}
                                handleSaveTitles={handleSaveTitles}
                                handleCancelEditingTitles={handleCancelEditingTitles}
                                setCustomTitles={setCustomTitles}
                                handleAIStrategistClick={handleAIStrategistClick}
                                isCreatingPersonalization={isCreatingPersonalization}
                            />
                        </motion.div>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

// Separate component for analysis results
const AnalysisResults = ({
    data,
    isPreview,
    expandedSections,
    toggleSection,
    activeInsight,
    setActiveInsight,
    editingTitles,
    customTitles,
    handleStartEditingTitles,
    handleSaveTitles,
    handleCancelEditingTitles,
    setCustomTitles,
    handleAIStrategistClick,
    isCreatingPersonalization = false
}) => {
    const theme = useTheme();

    return (
        <Box>
            {isPreview && (
                <Alert
                    severity="info"
                    icon={<Sparkles size={16} />}
                    sx={{
                        mb: 2,
                        py: 0.5,
                        '& .MuiAlert-message': { py: 0.5 }
                    }}
                >
                    <Typography variant="caption" fontWeight={600}>
                        Sample Preview - Upload your resume to see your personalized analysis
                    </Typography>
                </Alert>
            )}

            {/* Compact Score Header */}
            <Card sx={{
                mb: 2,
                border: '1px solid',
                borderColor: theme.palette.divider,
                borderRadius: 2,
                boxShadow: 'none'
            }}>
                <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: '50%',
                                    border: `3px solid ${data.overallScore >= 7 ? theme.palette.success.main : theme.palette.warning.main}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: theme.palette.background.paper,
                                    flexShrink: 0,
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        border: `1px solid ${data.overallScore >= 7 ? theme.palette.success.main : theme.palette.warning.main}`,
                                        opacity: 0.2,
                                        transform: 'scale(1.2)'
                                    }
                                }}>
                                    <Typography variant="h4" fontWeight={700}>
                                        {data.overallScore}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 0.5 }}>
                                        Resume Score
                                    </Typography>
                                    <Rating
                                        value={data.overallScore / 2}
                                        precision={0.5}
                                        readOnly
                                        size="small"
                                        sx={{ fontSize: '1rem' }}
                                    />
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5, color: theme.palette.text.primary }}>
                                {data.candidateName}'s Resume Analysis
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                Top 25% of candidates • Ready for {data.potentialTitles?.[0] || 'your target role'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                                {data.potentialTitles?.slice(0, 3).map((title, index) => (
                                    <Chip
                                        key={index}
                                        label={title}
                                        size="small"
                                        sx={{
                                            height: 26,
                                            fontSize: '0.8125rem',
                                            fontWeight: 500,
                                            bgcolor: theme.palette.grey[100],
                                            color: theme.palette.text.primary,
                                            border: 'none',
                                            '&:hover': {
                                                bgcolor: theme.palette.grey[200]
                                            }
                                        }}
                                    />
                                ))}
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Button
                                variant="contained"
                                fullWidth
                                disabled={isPreview || isCreatingPersonalization}
                                startIcon={isCreatingPersonalization ? <CircularProgress size={16} color="inherit" /> : null}
                                endIcon={!isCreatingPersonalization ? <ChevronRight size={18} /> : null}
                                sx={{
                                    py: 1.25,
                                    bgcolor: theme.palette.primary.main,
                                    color: 'common.white',
                                    fontWeight: 600,
                                    fontSize: '0.9375rem',
                                    boxShadow: 'none',
                                    textTransform: 'none',
                                    '&:hover': {
                                        bgcolor: theme.palette.primary.dark,
                                        boxShadow: 'none'
                                    },
                                    '&.Mui-disabled': {
                                        bgcolor: theme.palette.primary.main,
                                        color: 'common.white'
                                    }
                                }}
                                onClick={handleAIStrategistClick}
                            >
                                {isCreatingPersonalization ? 'Creating Your Session...' : 'Talk to your AI Strategist'}
                            </Button>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75, textAlign: 'center' }}>
                                Free AI consultation
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Main Analysis Grid - Compact 2x2 */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                {/* Target Roles */}
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        height: '100%',
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                        borderRadius: 2,
                        boxShadow: 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            borderColor: theme.palette.primary.light
                        }
                    }}>
                        <CardHeader
                            sx={{ p: 2, pb: 1.5 }}
                            avatar={
                                <Box sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 1.5,
                                    bgcolor: theme.palette.grey[100],
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Target size={20} color={theme.palette.primary.main} />
                                </Box>
                            }
                            title={
                                <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: '1rem' }}>
                                    Best-Fit Target Roles
                                </Typography>
                            }
                            action={
                                !isPreview && (
                                    <IconButton size="small" sx={{ p: 0.75 }}>
                                        <Edit2 size={16} />
                                    </IconButton>
                                )
                            }
                        />
                        <CardContent sx={{ pt: 0, px: 2, pb: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                                {data.potentialTitles?.slice(0, 4).map((title, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            p: 1.25,
                                            borderRadius: 1,
                                            bgcolor: theme.palette.grey[50],
                                            border: '1px solid',
                                            borderColor: 'transparent',
                                            transition: 'all 0.2s ease',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                borderColor: theme.palette.primary.light,
                                                bgcolor: alpha(theme.palette.primary.main, 0.04)
                                            }
                                        }}
                                    >
                                        <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.875rem' }}>
                                            {title}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: '0.8125rem',
                                                color: data.targetRoleMatch?.[title] >= 80 ? theme.palette.success.main : theme.palette.primary.main
                                            }}
                                        >
                                            {data.targetRoleMatch?.[title] || 75}% Match
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Key Strengths */}
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        height: '100%',
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                        borderRadius: 2,
                        boxShadow: 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            borderColor: theme.palette.success.light
                        }
                    }}>
                        <CardHeader
                            sx={{ p: 2, pb: 1.5 }}
                            avatar={
                                <Box sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 1.5,
                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Award size={20} color={theme.palette.success.main} />
                                </Box>
                            }
                            title={
                                <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: '1rem' }}>
                                    Your Key Strengths
                                </Typography>
                            }
                            action={
                                <Button
                                    size="small"
                                    onClick={() => toggleSection('strengths')}
                                    disabled={isPreview}
                                    sx={{
                                        minWidth: 'auto',
                                        px: 2,
                                        py: 0.5,
                                        fontSize: '0.8125rem',
                                        fontWeight: 500,
                                        textTransform: 'none',
                                        bgcolor: 'transparent',
                                        color: theme.palette.success.main,
                                        border: '1px solid',
                                        borderColor: theme.palette.success.light,
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.success.main, 0.08),
                                            borderColor: theme.palette.success.main
                                        }
                                    }}
                                    endIcon={expandedSections.strengths ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                >
                                    {expandedSections.strengths ? 'Hide' : 'Show All'} {data.strengths?.length || 0}
                                </Button>
                            }
                        />
                        <CardContent sx={{ pt: 0, px: 2, pb: 2 }}>
                            {!expandedSections.strengths ? (
                                <Box>
                                    {data.strengths?.slice(0, 2).map((strength, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                                            <CheckCircle size={16} color={theme.palette.success.main} style={{ marginTop: 2, flexShrink: 0 }} />
                                            <Typography variant="body2" sx={{ lineHeight: 1.5, fontSize: '0.875rem', color: theme.palette.text.secondary }}>
                                                {strength.length > 60 ? `${strength.substring(0, 60)}...` : strength}
                                            </Typography>
                                        </Box>
                                    ))}
                                    {data.strengths?.length > 2 && (
                                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.75rem' }}>
                                            +{data.strengths.length - 2} more strengths
                                        </Typography>
                                    )}
                                </Box>
                            ) : (
                                <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                                    {data.strengths?.map((strength, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                                            <CheckCircle size={16} color={theme.palette.success.main} style={{ marginTop: 2, flexShrink: 0 }} />
                                            <Typography variant="body2" sx={{ lineHeight: 1.5, fontSize: '0.875rem', color: theme.palette.text.secondary }}>
                                                {strength}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Improvements */}
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        height: '100%',
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                        borderRadius: 2,
                        boxShadow: 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            borderColor: theme.palette.warning.light
                        }
                    }}>
                        <CardHeader
                            sx={{ p: 2, pb: 1.5 }}
                            avatar={
                                <Box sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 1.5,
                                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Lightbulb size={20} color={theme.palette.warning.main} />
                                </Box>
                            }
                            title={
                                <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: '1rem' }}>
                                    Improvement Opportunities
                                </Typography>
                            }
                            action={
                                <Button
                                    size="small"
                                    onClick={() => toggleSection('improvements')}
                                    disabled={isPreview}
                                    sx={{
                                        minWidth: 'auto',
                                        px: 2,
                                        py: 0.5,
                                        fontSize: '0.8125rem',
                                        fontWeight: 500,
                                        textTransform: 'none',
                                        bgcolor: 'transparent',
                                        color: theme.palette.warning.main,
                                        border: '1px solid',
                                        borderColor: theme.palette.warning.light,
                                        animation: !expandedSections.improvements && !isPreview ? 'subtle-pulse 3s infinite' : 'none',
                                        '@keyframes subtle-pulse': {
                                            '0%': { borderColor: theme.palette.warning.light },
                                            '50%': { borderColor: theme.palette.warning.main },
                                            '100%': { borderColor: theme.palette.warning.light }
                                        },
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.warning.main, 0.08),
                                            borderColor: theme.palette.warning.main,
                                            animation: 'none'
                                        }
                                    }}
                                    endIcon={expandedSections.improvements ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                >
                                    {expandedSections.improvements ? 'Hide' : 'View'} {data.improvements?.length || 0} Items
                                </Button>
                            }
                        />
                        <CardContent sx={{ pt: 0, px: 2, pb: 2 }}>
                            {!expandedSections.improvements ? (
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                        <AlertCircle size={16} color={theme.palette.warning.main} />
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                            Quick fixes to boost your score
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                        {data.improvements?.map((imp, index) => (
                                            <Chip
                                                key={index}
                                                label={imp.category}
                                                size="small"
                                                sx={{
                                                    height: 22,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 500,
                                                    bgcolor:
                                                        imp.impact === 'high' ? alpha(theme.palette.error.main, 0.08) :
                                                            imp.impact === 'medium' ? alpha(theme.palette.warning.main, 0.08) :
                                                                alpha(theme.palette.info.main, 0.08),
                                                    color:
                                                        imp.impact === 'high' ? theme.palette.error.dark :
                                                            imp.impact === 'medium' ? theme.palette.warning.dark :
                                                                theme.palette.info.dark,
                                                    border: 'none'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                                    {data.improvements?.map((improvement, index) => (
                                        <Box key={index} sx={{
                                            mb: 1.5,
                                            p: 1.25,
                                            borderRadius: 1,
                                            bgcolor: theme.palette.grey[50],
                                            border: '1px solid',
                                            borderColor: theme.palette.grey[200]
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.875rem' }}>
                                                    {improvement.category}
                                                </Typography>
                                                <Chip
                                                    label={improvement.impact}
                                                    size="small"
                                                    sx={{
                                                        height: 18,
                                                        fontSize: '0.6875rem',
                                                        fontWeight: 600,
                                                        bgcolor:
                                                            improvement.impact === 'high' ? theme.palette.error.main :
                                                                improvement.impact === 'medium' ? theme.palette.warning.main :
                                                                    theme.palette.info.main,
                                                        color: 'white'
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: '0.8125rem' }}>
                                                {improvement.suggestion}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Career Strategy */}
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        height: '100%',
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                        borderRadius: 2,
                        boxShadow: 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            borderColor: theme.palette.info.light
                        }
                    }}>
                        <CardHeader
                            sx={{ p: 2, pb: 1.5 }}
                            avatar={
                                <Box sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 1.5,
                                    bgcolor: alpha(theme.palette.info.main, 0.1),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <TrendingUp size={20} color={theme.palette.info.main} />
                                </Box>
                            }
                            title={
                                <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: '1rem' }}>
                                    Your Career Strategy
                                </Typography>
                            }
                            action={
                                <Button
                                    size="small"
                                    onClick={() => toggleSection('strategy')}
                                    disabled={isPreview}
                                    sx={{
                                        minWidth: 'auto',
                                        px: 2,
                                        py: 0.5,
                                        fontSize: '0.8125rem',
                                        fontWeight: 500,
                                        textTransform: 'none',
                                        bgcolor: 'transparent',
                                        color: theme.palette.info.main,
                                        border: '1px solid',
                                        borderColor: theme.palette.info.light,
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.info.main, 0.08),
                                            borderColor: theme.palette.info.main
                                        }
                                    }}
                                    endIcon={expandedSections.strategy ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                >
                                    {expandedSections.strategy ? 'Hide' : 'Read'} Strategy
                                </Button>
                            }
                        />
                        <CardContent sx={{ pt: 0, px: 2, pb: 2 }}>
                            {!expandedSections.strategy ? (
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                        <Sparkles size={16} color={theme.palette.info.main} />
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                            AI-generated roadmap for your success
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ lineHeight: 1.5, fontSize: '0.875rem', color: theme.palette.text.secondary }}>
                                        {data.strategy?.substring(0, 100)}...
                                    </Typography>
                                </Box>
                            ) : (
                                <Box>
                                    <Typography variant="body2" sx={{ lineHeight: 1.6, fontSize: '0.875rem', display: 'block', mb: 1.5, color: theme.palette.text.secondary }}>
                                        {data.strategy}
                                    </Typography>
                                    {data.industryInsights && (
                                        <Box sx={{
                                            mt: 1.5,
                                            p: 1.25,
                                            borderRadius: 1,
                                            bgcolor: alpha(theme.palette.info.main, 0.08),
                                            border: '1px solid',
                                            borderColor: alpha(theme.palette.info.main, 0.2)
                                        }}>
                                            <Typography variant="body2" sx={{ lineHeight: 1.5, fontSize: '0.8125rem' }}>
                                                <strong>Market Insight:</strong> {data.industryInsights}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Additional Insights - Tabbed Interface */}
            <Card sx={{
                border: '1px solid',
                borderColor: theme.palette.divider,
                borderRadius: 2,
                boxShadow: 'none'
            }}>
                <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, fontSize: '1rem' }}>
                        Additional Career Insights
                    </Typography>

                    {/* Tabs */}
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 2, borderBottom: '1px solid', borderColor: theme.palette.divider, pb: 0 }}>
                        {[
                            { id: 'keywords', label: 'Missing Keywords', icon: <AlertCircle size={16} />, count: data.keywordGaps?.length },
                            { id: 'titles', label: 'Job Search Terms', icon: <Briefcase size={16} />, count: data.suggestedJobTitles?.length },
                            { id: 'companies', label: 'Target Companies', icon: <Building size={16} />, count: data.targetCompanies?.length }
                        ].map((tab) => (
                            <Button
                                key={tab.id}
                                size="small"
                                onClick={() => setActiveInsight(tab.id)}
                                sx={{
                                    minWidth: 'auto',
                                    px: 2,
                                    py: 1,
                                    fontSize: '0.8125rem',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    color: activeInsight === tab.id ? theme.palette.primary.main : theme.palette.text.secondary,
                                    borderBottom: activeInsight === tab.id ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                                    borderRadius: 0,
                                    bgcolor: 'transparent',
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                                        color: theme.palette.primary.main
                                    }
                                }}
                                startIcon={tab.icon}
                            >
                                {tab.label} ({tab.count || 0})
                            </Button>
                        ))}
                    </Box>

                    {/* Tab Content */}
                    <Box sx={{ minHeight: 120 }}>
                        {activeInsight === 'keywords' && data.keywordGaps?.length > 0 && (
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mb: 1.5, fontSize: '0.875rem' }}>
                                    Add these keywords to improve ATS matching:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                                    {data.keywordGaps.map((keyword, index) => (
                                        <Chip
                                            key={index}
                                            label={keyword}
                                            size="small"
                                            sx={{
                                                height: 26,
                                                fontSize: '0.8125rem',
                                                fontWeight: 500,
                                                bgcolor: theme.palette.grey[100],
                                                color: theme.palette.text.primary,
                                                border: '1px solid',
                                                borderColor: theme.palette.warning.light,
                                                '&:hover': {
                                                    bgcolor: alpha(theme.palette.warning.main, 0.08),
                                                    borderColor: theme.palette.warning.main
                                                }
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {activeInsight === 'titles' && data.suggestedJobTitles?.length > 0 && (
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mb: 1.5, fontSize: '0.875rem' }}>
                                    Search for these job titles on job boards:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                                    {data.suggestedJobTitles.map((title, index) => (
                                        <Chip
                                            key={index}
                                            label={title}
                                            size="small"
                                            icon={<Search size={14} />}
                                            sx={{
                                                height: 26,
                                                fontSize: '0.8125rem',
                                                fontWeight: 500,
                                                bgcolor: theme.palette.grey[100],
                                                color: theme.palette.text.primary,
                                                border: '1px solid',
                                                borderColor: theme.palette.primary.light,
                                                '& .MuiChip-icon': { fontSize: '0.875rem' },
                                                '&:hover': {
                                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                    borderColor: theme.palette.primary.main
                                                }
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {activeInsight === 'companies' && data.targetCompanies?.length > 0 && (
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mb: 1.5, fontSize: '0.875rem' }}>
                                    Companies that match your profile:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                                    {data.targetCompanies.map((company, index) => (
                                        <Chip
                                            key={index}
                                            label={company}
                                            size="small"
                                            sx={{
                                                height: 26,
                                                fontSize: '0.8125rem',
                                                fontWeight: 500,
                                                bgcolor: theme.palette.grey[100],
                                                color: theme.palette.text.primary,
                                                border: '1px solid',
                                                borderColor: theme.palette.success.light,
                                                '&:hover': {
                                                    bgcolor: alpha(theme.palette.success.main, 0.08),
                                                    borderColor: theme.palette.success.main
                                                }
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ResumeAnalyzer; 