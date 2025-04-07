// CreateBrdgePage.jsx - Updated to remove recording functionality and improve log display

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';
import { useSnackbar } from '../utils/snackbar';
import { ArrowRight, Upload, Video, FileText, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Button, TextField, CircularProgress, Paper } from '@mui/material';

const MAX_PDF_SIZE = 20 * 1024 * 1024;  // 20MB in bytes
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;  // 500MB in bytes

function CreateBrdgePage() {
    const theme = useTheme();
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

            // Wait a moment to let user see "Complete" status, then navigate
            setTimeout(() => {
                setLoading(false);
                showSnackbar('AI Module created successfully', 'success');
                navigate(`/edit/${createdBrdgeId}`);
            }, 2000);
        } else if (processingStatus.status === "failed" && createdBrdgeId) {
            // Stop polling on failure
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }

            setLoading(false);
            setError('Processing failed. Please try again or contact support.');
        }
    }, [processingStatus.status, createdBrdgeId, pollingInterval, navigate, showSnackbar]);

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
        // Get all relevant logs to show to the user
        const displayLogs = processingStatus.logs.filter(log => {
            const message = log.message || '';

            // Exclude anything explicitly mentioning Gemini API
            if (message.includes('Gemini API') || message.includes('gemini')) {
                return false;
            }

            // Include all success messages (but will clean them later)
            if (log.status === 'success') return true;

            // Include high-level progress messages
            if (log.status === 'info') {
                // Include extraction pass headers but not detailed technical ones
                if (message.includes('EXTRACTION PASS') && !message.includes('TIMING')) {
                    return true;
                }

                // Include general processing messages
                if (message.includes('Processing') ||
                    message.includes('Analyzing') ||
                    message.includes('Building') ||
                    message.includes('Uploading') ||
                    message.includes('Starting')) {
                    return true;
                }
            }

            // Exclude all other logs
            return false;
        }).map(log => {
            // Make a copy of the log
            const cleanedLog = { ...log };
            let message = cleanedLog.message;

            // Remove emojis
            message = message.replace(/[^\u0000-\u007F]+/g, '').trim();

            // Remove TIMING prefixes
            message = message.replace('⏱️ TIMING:', '').trim();

            // Clean up EXTRACTION PASS messages to be more user-friendly
            if (message.includes('EXTRACTION PASS')) {
                message = message.replace(/🔍 EXTRACTION PASS \d+:/, '').trim();

                // Remove too technical details
                message = message.replace(/parallel content timelines|concept network/g, 'content').trim();

                // Transform technical to user-friendly phrases
                message = message
                    .replace('Extracting knowledge base', 'Analyzing content knowledge')
                    .replace('Extracting teaching persona', 'Identifying teaching style')
                    .replace('Extracting engagement opportunities', 'Finding key learning moments')
                    .replace('Combining extraction components', 'Finalizing AI module');
            }

            // Transform technical completion messages to user-friendly ones
            if (message.includes('extraction complete')) {
                message = message.replace(/\d+ .* identified/g, 'completed successfully');
            }

            cleanedLog.message = message;
            return cleanedLog;
        });

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
                <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
                    Building Your AI Module...
                </Typography>
                <Box sx={{ width: '100%', position: 'relative' }}>
                    <Box sx={{ height: 8, width: '100%', bgcolor: `${theme.palette.secondary.main}30`, borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div
                            style={{ height: '100%', backgroundColor: theme.palette.secondary.main }}
                            initial={{ width: 0 }}
                            animate={{ width: `${processingStatus.progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </Box>
                    <Typography variant="caption" sx={{ position: 'absolute', right: 0, top: 10, color: theme.palette.text.secondary }}>
                        {Math.round(processingStatus.progress)}%
                    </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Status: {processingStatus.status === "completed" ? "Complete" :
                        processingStatus.status === "failed" ? "Failed" :
                            "Processing..."}
                </Typography>

                <Paper
                    ref={logContainerRef}
                    elevation={0}
                    sx={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                        bgcolor: 'rgba(0,0,0,0.05)', // Subtle background for logs
                        borderRadius: '8px',
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
                                    style={{ display: 'flex', alignItems: 'flex-start', gap: 1, color: theme.palette.text.secondary }}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <CheckCircle style={{ width: 16, height: 16, marginTop: 2, color: theme.palette.secondary.main }} />
                                    <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>{log.message}</Typography>
                                </motion.div>
                            ))
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                                <Clock style={{ width: 16, height: 16, color: theme.palette.secondary.main }} />
                                <Typography variant="body2">Initializing AI module creation...</Typography>
                            </Box>
                        )}
                    </Box>
                </Paper>

                <Typography variant="body1" sx={{ color: theme.palette.secondary.light, fontStyle: 'italic' }}>
                    {processingStatus.status === "completed" ? "Processing complete! Redirecting..." :
                        "We're analyzing your content and building your AI Module"}
                </Typography>
            </Box>
        );
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: theme.palette.background.default,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 6,
            px: 2,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: `url(${theme.textures.darkParchment})`,
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                opacity: 0.1,
                pointerEvents: 'none',
                zIndex: 0,
                mixBlendMode: 'multiply',
            }
        }}>
            <Box maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h2" component="h1" sx={{
                        color: theme.palette.text.primary,
                        textAlign: 'center',
                        mb: 5,
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            display: 'block',
                            width: '60px',
                            height: '2px',
                            background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.main}, transparent)`,
                            margin: '10px auto 0',
                            borderRadius: '1px',
                            opacity: 0.8,
                        }
                    }}>
                        Create New AI Module
                    </Typography>

                    <Paper elevation={0} sx={{
                        p: { xs: 3, sm: 4 },
                        borderRadius: '12px',
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: theme.shadows[2]
                    }}>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            {error && (
                                <Box sx={{
                                    mb: 3,
                                    p: 2,
                                    borderRadius: '8px',
                                    bgcolor: `${theme.palette.error.main}20`,
                                    border: `1px solid ${theme.palette.error.main}40`,
                                    color: theme.palette.error.main,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <AlertTriangle size={18} />
                                    <Typography variant="body2">{error}</Typography>
                                </Box>
                            )}

                            {loading && createdBrdgeId ? (
                                <ProcessingDisplay />
                            ) : (
                                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <Box>
                                        <Typography variant="h6" component="label" htmlFor="module-name" sx={{ color: theme.palette.text.primary, mb: 1, display: 'block' }}>
                                            Module Name
                                        </Typography>
                                        <TextField
                                            id="module-name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter a name..."
                                            required
                                            fullWidth
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box>
                                            <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                                                1. Upload Video (MP4)
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                                                Upload your presentation or lecture (max 500MB).
                                            </Typography>
                                        </Box>

                                        {!videoFile ? (
                                            <Box
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                                sx={{
                                                    position: 'relative',
                                                    transition: 'background-color 0.2s ease',
                                                    bgcolor: isDragging ? `${theme.palette.secondary.main}15` : 'transparent',
                                                }}
                                            >
                                                <Box component="label" sx={{
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                                                    minHeight: '160px',
                                                    border: `2px dashed ${isDragging ? theme.palette.secondary.main : theme.palette.divider}`,
                                                    borderRadius: '8px',
                                                    p: 3,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        borderColor: theme.palette.secondary.light,
                                                        bgcolor: `${theme.palette.secondary.main}08`
                                                    }
                                                }}>
                                                    <Box sx={{
                                                        p: 1.5,
                                                        borderRadius: '50%',
                                                        bgcolor: 'rgba(0,0,0,0.1)',
                                                        border: `1px solid ${theme.palette.divider}`
                                                    }}>
                                                        <Upload style={{ width: 24, height: 24, color: theme.palette.text.secondary }} />
                                                    </Box>
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="body1" sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                                            {isDragging ? 'Drop video here' : 'Drag & drop or click'}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                                            MP4 format, max 500MB
                                                        </Typography>
                                                    </Box>
                                                    <TextField
                                                        type="file"
                                                        onChange={handleVideoFileUpload}
                                                        accept="video/mp4"
                                                        sx={{ display: 'none' }}
                                                        inputProps={{ id: 'video-upload-input' }}
                                                    />
                                                </Box>
                                            </Box>
                                        ) : (
                                            <Paper elevation={0} sx={{
                                                display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: '8px',
                                                bgcolor: `${theme.palette.secondary.main}15`, border: `1px solid ${theme.palette.secondary.main}30`
                                            }}>
                                                <Box sx={{ p: 1, borderRadius: '4px', bgcolor: `${theme.palette.secondary.main}25` }}>
                                                    <Video style={{ width: 20, height: 20, color: theme.palette.secondary.main }} />
                                                </Box>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {videoFile.name}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                                        {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                                                    </Typography>
                                                </Box>
                                                <Button variant="text" onClick={() => setVideoFile(null)} sx={{ color: theme.palette.error.main, minWidth: 'auto', p: 0.5 }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M18 6L6 18"></path><path d="M6 6l12 12"></path>
                                                    </svg>
                                                </Button>
                                            </Paper>
                                        )}
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box>
                                            <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                                                2. (Optional) Upload Presentation (PDF)
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                                                Enhances AI understanding (max 20MB).
                                            </Typography>
                                        </Box>
                                        <Button
                                            component="label"
                                            variant={file ? "contained" : "outlined"}
                                            color="secondary"
                                            startIcon={<FileText size={16} />}
                                            sx={{
                                                justifyContent: 'center',
                                                py: 1.5,
                                                borderColor: file ? 'transparent' : theme.palette.secondary.main,
                                                bgcolor: file ? `${theme.palette.secondary.main}25` : 'transparent',
                                                color: file ? theme.palette.secondary.dark : theme.palette.secondary.main,
                                                '&:hover': {
                                                    bgcolor: file ? `${theme.palette.secondary.main}35` : `${theme.palette.secondary.main}10`,
                                                    borderColor: theme.palette.secondary.light
                                                }
                                            }}
                                        >
                                            {file ? `Selected: ${file.name}` : `Upload PDF`}
                                            <TextField
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => setFile(e.target.files[0])}
                                                sx={{ display: 'none' }}
                                                inputProps={{ id: 'pdf-upload-input' }}
                                            />
                                        </Button>
                                    </Box>

                                    <Box sx={{ mt: 2 }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={loading || !videoFile}
                                            fullWidth
                                            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowRight size={16} />}
                                            sx={{ py: 1.5, fontSize: '1rem' }}
                                        >
                                            {loading ? 'Creating...' : 'Create AI Module'}
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </motion.div>
            </Box>
        </Box>
    );
}

export default CreateBrdgePage;
