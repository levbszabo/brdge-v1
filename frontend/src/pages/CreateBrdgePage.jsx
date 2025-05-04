// CreateBrdgePage.jsx - Updated to remove recording functionality and improve log display

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';
import { useSnackbar } from '../utils/snackbar';
import { ArrowRight, Upload, Video, FileText, Clock, AlertTriangle, CheckCircle, Info, Settings } from 'lucide-react';
import dotbridgeTheme from '../dotbridgeTheme'; // Import the theme
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Button, TextField, CircularProgress, Paper, Chip, Alert, Container, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const MAX_PDF_SIZE = 20 * 1024 * 1024;  // 20MB in bytes
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;  // 500MB in bytes

const SepiaText = styled('span')(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.light})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block',
    fontFamily: theme.typography.h2.fontFamily,
}));

const ScholarlyDivider = styled(Box)(({ theme }) => ({
    position: 'relative',
    height: '40px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2.5, 0),
    '&::before, &::after': {
        content: '""',
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}80, transparent)`,
        flexGrow: 1,
    },
    '&::before': {
        marginRight: theme.spacing(2.5),
    },
    '&::after': {
        marginLeft: theme.spacing(2.5),
    }
}));

function CreateBrdgePage() {
    const theme = dotbridgeTheme;
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const [isMobile, setIsMobile] = useState(false);
    const [processingStatus, setProcessingStatus] = useState({
        status: "pending",
        logs: [],
        progress: 0
    });
    const [createdBrdgeId, setCreatedBrdgeId] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [pollingInterval, setPollingInterval] = useState(null);
    const logContainerRef = useRef(null);

    // Add state for new fields
    const [bridgeType, setBridgeType] = useState('course'); // Default to 'course'
    const [additionalInstructions, setAdditionalInstructions] = useState('');

    // Define bridge types and placeholders
    const bridgeTypes = [
        { value: 'course', label: 'Course Module', placeholder: 'e.g., Focus on beginner concepts, use Socratic questioning...' },
        { value: 'webinar', label: 'Webinar / Lead Nurture', placeholder: 'e.g., Goal is to book a meeting, ask qualifying questions...' },
        { value: 'vsl', label: 'Video Sales Letter (VSL)', placeholder: 'e.g., Overcome objections about pricing, build urgency...' },
        { value: 'onboarding', label: 'Onboarding / Tutorial', placeholder: 'e.g., Guide users through setup, link to specific features...' },
    ];

    useEffect(() => {
        if (id) {
            fetchBrdgeData();
        }
    }, [id]);

    useEffect(() => {
        const checkMobile = () => {
            const isMobileDevice = window.innerWidth <= 768;
            setIsMobile(isMobileDevice);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Clean up polling when component unmounts
    useEffect(() => {
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [pollingInterval]);

    // Start polling for status updates
    useEffect(() => {
        if (createdBrdgeId && loading) {
            const interval = setInterval(() => {
                fetchProcessingStatus(createdBrdgeId);
            }, 3000); // Poll every 3 seconds

            setPollingInterval(interval);

            // Initial fetch right away
            fetchProcessingStatus(createdBrdgeId);

            return () => clearInterval(interval);
        }
    }, [createdBrdgeId, loading]);

    // Auto-scroll to bottom of logs
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [processingStatus.logs]);

    // Watch for completed processing
    useEffect(() => {
        if (processingStatus.status === "completed" && createdBrdgeId) {
            // Stop polling
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
            setLoading(false);
            showSnackbar('Bridge creation complete!', 'success');
            // Wait a moment before navigating
            setTimeout(() => {
                navigate(`/edit/${createdBrdgeId}`);
            }, 1500); // Shorter delay
        } else if (processingStatus.status === "failed" && createdBrdgeId) {
            // Stop polling on failure
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
            setLoading(false);
            setError('Processing failed. Please review the logs or try again.'); // More specific error
            showSnackbar('Bridge processing failed', 'error');
        }
    }, [processingStatus.status, createdBrdgeId, pollingInterval, navigate, showSnackbar]);

    // Update placeholder when bridgeType changes
    useEffect(() => {
        const selectedType = bridgeTypes.find(type => type.value === bridgeType);
        setAdditionalInstructions(''); // Clear instructions when type changes
        // We'll set the placeholder directly in the TextField below
    }, [bridgeType]);

    const fetchProcessingStatus = async (brdgeId) => {
        try {
            const response = await api.get(`/brdges/${brdgeId}/status`);
            setProcessingStatus(response.data);
        } catch (error) {
            console.error('Error fetching processing status:', error);
        }
    };

    const fetchBrdgeData = async () => {
        try {
            const response = await api.get(`/brdges/${id}`);
            setName(response.data.name);
        } catch (error) {
            console.error('Error fetching brdge data:', error);
            setError('Failed to fetch AI Module data. Please try again.');
        }
    };

    const validateVideoFile = (file) => {
        // Only accept MP4 files
        const validTypes = ['video/mp4'];
        const maxSize = MAX_VIDEO_SIZE; // 500MB in bytes

        if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.mp4')) {
            return {
                isValid: false,
                error: 'Invalid file type. Please upload MP4 video files only.'
            };
        }

        if (file.size > maxSize) {
            return {
                isValid: false,
                error: `File is too large. Maximum size is 500MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`
            };
        }

        return { isValid: true };
    };

    const handleVideoFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validation = validateVideoFile(file);
        if (!validation.isValid) {
            showSnackbar(validation.error, 'error');
            e.target.value = ''; // Clear the input
            return;
        }

        setVideoFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (!file) return;

        const validation = validateVideoFile(file);
        if (!validation.isValid) {
            showSnackbar(validation.error, 'error');
            return;
        }

        setVideoFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (file && file.size > MAX_PDF_SIZE) {
            showSnackbar('PDF file size exceeds 20MB limit', 'error');
            setLoading(false);
            return;
        }

        if (videoFile && videoFile.size > MAX_VIDEO_SIZE) {
            showSnackbar('Video file size exceeds 500MB limit', 'error');
            setLoading(false);
            return;
        }

        // Require video file
        if (!videoFile) {
            setError('Please upload an MP4 video for the AI Module');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('bridge_type', bridgeType);
        formData.append('additional_instructions', additionalInstructions);

        // PDF is optional now
        if (file) {
            formData.append('presentation', file);
        }

        if (videoFile) {
            formData.append('screen_recording', videoFile);
        }

        try {
            if (id) {
                await api.put(`/brdges/${id}`, formData);
                showSnackbar('AI Module updated successfully', 'success');
                navigate(`/edit/${id}`);
            } else {
                // Add async=true parameter to request asynchronous processing
                formData.append('async', 'true');

                const response = await api.post('/brdges', formData);
                setCreatedBrdgeId(response.data.brdge.id);
                // We'll start polling immediately after getting the ID
            }
        } catch (error) {
            console.error('Error creating/updating brdge:', error);
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    // Enhanced Processing display component focused on user-friendly messages
    const ProcessingDisplay = () => {
        // Filter and clean logs for user display
        const displayLogs = processingStatus.logs.filter(log => {
            const message = log.message || '';
            // Exclude Gemini API mentions and generic timing/completion messages
            return !message.includes('Gemini API') &&
                !message.includes('gemini') &&
                !message.startsWith('⏱️ TIMING:') &&
                !/extraction complete|identified/.test(message);
        }).map(log => {
            const cleanedLog = { ...log };
            let message = cleanedLog.message;
            // Remove emojis
            message = message.replace(/[^\u0000-\u007F]+/g, '').trim();
            // Clean up EXTRACTION PASS messages
            if (message.includes('EXTRACTION PASS')) {
                message = message.replace(/🔍 EXTRACTION PASS \d+:/, 'Analysis Step:').trim();
                message = message
                    .replace('Extracting knowledge base', 'Analyzing Content Knowledge')
                    .replace('Extracting teaching persona', 'Identifying Teaching Style')
                    .replace('Extracting engagement opportunities', 'Finding Learning Moments')
                    .replace('Combining extraction components', 'Finalizing AI Build')
                    .replace(/parallel content timelines|concept network/g, 'content structure');
            }
            // General processing steps
            message = message
                .replace('Processing video', 'Analyzing Video Input')
                .replace('Uploading analysis results', 'Saving Analysis')
                .replace('Starting AI build process', 'Initiating AI Construction')
                .replace('Building knowledge graph', 'Constructing Knowledge Map');


            cleanedLog.message = message;
            return cleanedLog;
        }).filter(log => log.message); // Remove logs that became empty after cleaning

        const getIcon = (status) => {
            switch (status) {
                case 'success': return <CheckCircle style={{ width: 16, height: 16, marginTop: 2, color: theme.palette.success.main }} />;
                case 'error': return <AlertTriangle style={{ width: 16, height: 16, marginTop: 2, color: theme.palette.error.main }} />;
                case 'info':
                default: return <Info style={{ width: 16, height: 16, marginTop: 2, color: theme.palette.info.main }} />;
            }
        };

        const getStatusText = () => {
            switch (processingStatus.status) {
                case 'pending': return 'Initializing...';
                case 'processing': return 'In Progress...';
                case 'completed': return 'Complete';
                case 'failed': return 'Failed';
                default: return 'Processing...';
            }
        };

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
                <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                    Building Your Bridge...
                </Typography>
                <Box sx={{ width: '100%', position: 'relative' }}>
                    <Box sx={{ height: 10, width: '100%', bgcolor: theme.palette.neutral.light, borderRadius: '5px', overflow: 'hidden' }}>
                        <motion.div
                            style={{ height: '100%', backgroundColor: theme.palette.primary.main }}
                            initial={{ width: 0 }}
                            animate={{ width: `${processingStatus.progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </Box>
                    <Typography variant="caption" sx={{ position: 'absolute', right: 5, top: -18, color: theme.palette.text.secondary }}>
                        {Math.round(processingStatus.progress)}%
                    </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Status: <Chip label={getStatusText()} size="small" color={processingStatus.status === 'completed' ? 'success' : processingStatus.status === 'failed' ? 'error' : 'info'} variant="outlined" sx={{ ml: 0.5 }} />
                </Typography>

                <Paper
                    ref={logContainerRef}
                    elevation={0}
                    sx={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                        bgcolor: theme.palette.background.default,
                        borderRadius: theme.shape.borderRadius,
                        p: 2,
                        width: '100%',
                        border: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {displayLogs.length > 0 ? (
                            displayLogs.map((log, index) => (
                                <motion.div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: theme.spacing(1),
                                        color: log.status === 'error' ? theme.palette.error.dark : theme.palette.text.secondary,
                                        fontSize: '0.875rem'
                                    }}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {getIcon(log.status)}
                                    <Typography variant="body2" component="span">{log.message}</Typography>
                                </motion.div>
                            ))
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                                <Clock style={{ width: 16, height: 16, color: theme.palette.info.main }} />
                                <Typography variant="body2">Initializing Bridge creation...</Typography>
                            </Box>
                        )}
                    </Box>
                </Paper>

                {processingStatus.status !== "completed" && processingStatus.status !== "failed" && (
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic', textAlign: 'center' }}>
                        Building your Bridge can take a few minutes depending on the video length. <br /> Feel free to navigate away; we'll notify you when it's ready.
                    </Typography>
                )}

                {processingStatus.status === "completed" && (
                    <Typography variant="body1" sx={{ color: theme.palette.success.main, fontWeight: 500 }}>
                        Processing complete! Redirecting shortly...
                    </Typography>
                )}
                {processingStatus.status === "failed" && (
                    <Typography variant="body1" sx={{ color: theme.palette.error.main, fontWeight: 500 }}>
                        Processing failed. Check logs or contact support.
                    </Typography>
                )}
            </Box>
        );
    };

    return (
        <Box sx={{
            minHeight: 'calc(100vh - 64px)',
            bgcolor: theme.palette.background.default,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: { xs: 4, md: 6 },
            px: 2,
        }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h3" component="h1" sx={{
                        color: theme.palette.text.primary,
                        textAlign: 'center',
                        mb: 5,
                        fontFamily: theme.typography.h3.fontFamily,
                        '&::after': {
                            content: '""',
                            display: 'block',
                            width: '80px',
                            height: '3px',
                            background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}99, transparent)`,
                            margin: '15px auto 0',
                            borderRadius: '2px',
                        }
                    }}>
                        Create New <SepiaText>Bridge</SepiaText>
                    </Typography>

                    <Grid container spacing={4} alignItems="flex-start">

                        <Grid item xs={12} md={7}>
                            <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: theme.shape.borderRadius * 1.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Video size={22} color={theme.palette.primary.main} />
                                    1. Upload Video (MP4)
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 3 }}>
                                    The core content for your Bridge (MP4 format, max 500MB).
                                </Typography>

                                {!videoFile ? (
                                    <Box
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        sx={{
                                            flexGrow: 1,
                                            minHeight: '400px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            transition: 'background-color 0.2s ease',
                                            bgcolor: isDragging ? theme.palette.action.hover : theme.palette.background.default,
                                            borderRadius: theme.shape.borderRadius,
                                            border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
                                            p: 3,
                                        }}
                                    >
                                        <Box component="label" htmlFor="video-upload-input" sx={{
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5,
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            transition: 'all 0.2s ease',
                                            color: theme.palette.text.secondary,
                                            '&:hover': {
                                                color: theme.palette.primary.light,
                                            }
                                        }}>
                                            <Box sx={{
                                                p: 1.5,
                                                borderRadius: '50%',
                                                bgcolor: theme.palette.action.selected,
                                                border: `1px solid ${theme.palette.divider}`,
                                                display: 'inline-flex',
                                                mb: 1,
                                            }}>
                                                <Upload size={36} />
                                            </Box>
                                            <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontWeight: 500, mb: 0.5 }}>
                                                {isDragging ? 'Drop video here' : 'Drag & drop video or click'}
                                            </Typography>
                                            <Typography variant="caption">
                                                MP4 format, max 500MB
                                            </Typography>
                                            <TextField
                                                type="file"
                                                onChange={handleVideoFileUpload}
                                                accept="video/mp4"
                                                sx={{ display: 'none' }}
                                                id="video-upload-input"
                                            />
                                        </Box>
                                    </Box>
                                ) : (
                                    <Paper elevation={0} sx={{
                                        display: 'flex', alignItems: 'center', gap: 2, p: 1.5,
                                        borderRadius: theme.shape.borderRadius,
                                        bgcolor: theme.palette.primary.main + '1A',
                                        border: `1px solid ${theme.palette.primary.main + '30'}`,
                                        mt: 'auto'
                                    }}>
                                        <Box sx={{ p: 1, borderRadius: '4px', bgcolor: theme.palette.primary.main + '25' }}>
                                            <Video size={20} color={theme.palette.primary.dark} />
                                        </Box>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {videoFile.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                                            </Typography>
                                        </Box>
                                        <Button variant="text" onClick={() => setVideoFile(null)} sx={{ color: theme.palette.error.main, minWidth: 'auto', p: 0.5, '&:hover': { bgcolor: theme.palette.error.main + '1A' } }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 6L6 18"></path><path d="M6 6l12 12"></path>
                                            </svg>
                                        </Button>
                                    </Paper>
                                )}
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={5}>
                            {error && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            )}

                            {loading && createdBrdgeId ? (
                                <ProcessingDisplay />
                            ) : (
                                <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: theme.shape.borderRadius * 1.5, bgcolor: theme.palette.background.paper }}>
                                    <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Settings size={22} color={theme.palette.primary.main} />
                                        2. Configure Bridge
                                    </Typography>

                                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle2" component="label" htmlFor="bridge-name" sx={{ color: theme.palette.text.primary, fontWeight: 500, mb: 1, display: 'block' }}>
                                                Bridge Name
                                            </Typography>
                                            <TextField
                                                size="small"
                                                id="bridge-name"
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter a name for your Bridge..."
                                                required
                                                fullWidth
                                            />
                                        </Box>

                                        <Box sx={{ flex: 1 }}>
                                            <FormControl fullWidth variant="outlined" size="small">
                                                <InputLabel id="bridge-type-label">Bridge Type</InputLabel>
                                                <Select
                                                    labelId="bridge-type-label"
                                                    id="bridge-type-select"
                                                    value={bridgeType}
                                                    onChange={(e) => setBridgeType(e.target.value)}
                                                    label="Bridge Type"
                                                >
                                                    {bridgeTypes.map((type) => (
                                                        <MenuItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', mt: 0.5 }}>
                                                Select the primary goal for this Bridge.
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="subtitle2" component="label" htmlFor="additional-instructions" sx={{ color: theme.palette.text.primary, fontWeight: 500, mb: 1, display: 'block' }}>
                                                Additional Instructions (Optional)
                                            </Typography>
                                            <TextField
                                                size="small"
                                                id="additional-instructions"
                                                type="text"
                                                value={additionalInstructions}
                                                onChange={(e) => setAdditionalInstructions(e.target.value)}
                                                placeholder={bridgeTypes.find(type => type.value === bridgeType)?.placeholder || 'Provide specific guidance for the AI...'}
                                                fullWidth
                                                multiline
                                                rows={2}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: theme.palette.primary.light,
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: theme.palette.primary.main,
                                                        },
                                                    },
                                                }}
                                            />
                                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', mt: 0.5 }}>
                                                Guide the AI on tone, specific points to cover, or key outcomes.
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                                (Optional) Upload Presentation (PDF)
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', mt: -1 }}>
                                                Enhances Bridge knowledge (PDF format, max 20MB).
                                            </Typography>
                                            <Button
                                                component="label"
                                                htmlFor="pdf-upload-input"
                                                variant={file ? "contained" : "outlined"}
                                                color="secondary"
                                                startIcon={<FileText size={16} />}
                                                size="medium"
                                                sx={{
                                                    justifyContent: 'center',
                                                    py: 1,
                                                    textTransform: 'none',
                                                    borderColor: file ? 'transparent' : theme.palette.secondary.main,
                                                    bgcolor: file ? theme.palette.secondary.main + '20' : 'transparent',
                                                    color: file ? theme.palette.secondary.dark : theme.palette.secondary.main,
                                                    fontWeight: 400,
                                                    '&:hover': {
                                                        bgcolor: file ? theme.palette.secondary.main + '35' : theme.palette.secondary.main + '10',
                                                        borderColor: theme.palette.secondary.light
                                                    }
                                                }}
                                            >
                                                {file ? `Selected: ${file.name}` : `Upload PDF Document`}
                                                <TextField
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => setFile(e.target.files[0])}
                                                    sx={{ display: 'none' }}
                                                    id="pdf-upload-input"
                                                />
                                            </Button>
                                        </Box>

                                        <Box sx={{ mt: 2 }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                disabled={loading || !videoFile || !name || !bridgeType}
                                                fullWidth
                                                size="large"
                                                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowRight size={18} />}
                                                sx={{
                                                    py: 1.5,
                                                    fontSize: '1rem',
                                                    fontWeight: 600,
                                                    borderRadius: theme.shape.borderRadius * 1.5
                                                }}
                                            >
                                                {loading ? (createdBrdgeId ? 'Processing...' : 'Uploading...') : 'Create Bridge'}
                                            </Button>
                                        </Box>
                                    </Box>
                                </Paper>
                            )}
                        </Grid>

                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
}

export default CreateBrdgePage;
