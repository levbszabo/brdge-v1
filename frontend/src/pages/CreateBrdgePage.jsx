// CreateBrdgePage.jsx - Updated to remove recording functionality and improve log display

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';
import { useSnackbar } from '../utils/snackbar';
import { ArrowRight, Upload, Video, FileText, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const MAX_PDF_SIZE = 20 * 1024 * 1024;  // 20MB in bytes
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;  // 100MB in bytes

function CreateBrdgePage() {
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
        const maxSize = MAX_VIDEO_SIZE; // 100MB in bytes

        if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.mp4')) {
            return {
                isValid: false,
                error: 'Invalid file type. Please upload MP4 video files only.'
            };
        }

        if (file.size > maxSize) {
            return {
                isValid: false,
                error: `File is too large. Maximum size is 100MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`
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
            showSnackbar('Video file size exceeds 100MB limit', 'error');
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
            <div className="space-y-5">
                <div className="relative h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-cyan-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${processingStatus.progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-cyan-400 font-medium">{Math.round(processingStatus.progress)}% Complete</span>
                    <span className="text-gray-400">
                        Status: {processingStatus.status === "completed" ? "Complete" :
                            processingStatus.status === "failed" ? "Failed" :
                                "Processing..."}
                    </span>
                </div>

                <div
                    ref={logContainerRef}
                    className="max-h-96 overflow-y-auto bg-gray-900/40 rounded-lg p-4 border border-gray-800/50"
                >
                    <div className="space-y-3">
                        {displayLogs.length > 0 ? (
                            displayLogs.map((log, index) => {
                                return (
                                    <motion.div
                                        key={index}
                                        className="flex items-start gap-2 text-green-400"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{log.message}</span>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="text-sm text-gray-300 animate-pulse">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-cyan-400" />
                                    <span>Initializing AI module creation...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center text-sm text-cyan-400 font-medium">
                    {processingStatus.status === "completed" ? "Processing complete! Redirecting..." :
                        "We're analyzing your content and building your AI Module"}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0A1929] via-[#121212] to-[#0A1929] flex items-center justify-center relative overflow-hidden">
            {/* Enhanced Background Effect */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Single elegant gradient */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-blue-900/20 blur-[120px] animate-pulse-slow" />
            </div>

            <div className="container max-w-3xl mx-auto px-4 py-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-semibold text-white mb-12 text-center relative">
                        Create New AI Module
                        <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 w-40 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
                    </h1>

                    <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-8 shadow-xl">
                        <div className="relative z-10">
                            {error && (
                                <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {loading && createdBrdgeId ? (
                                <ProcessingDisplay />
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-10">
                                    {/* Module Name */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            AI Module Name
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter a name for your AI Module"
                                            required
                                            className="w-full bg-gray-900/40 border border-gray-700/50 rounded-lg 
                                            px-4 py-2.5 text-base text-gray-100
                                            placeholder:text-gray-500 
                                            focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 
                                            hover:border-cyan-500/30 
                                            transition-all duration-200"
                                        />
                                    </div>

                                    {/* Video Upload Section */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="text-gray-300 text-sm">
                                                1. Upload your video presentation (MP4)
                                            </div>
                                            <div className="text-gray-400/70 text-xs italic">
                                                Upload a video of your presentation or lecture. We'll analyze this to create an AI assistant that can engage with your audience.
                                            </div>
                                        </div>

                                        {!videoFile ? (
                                            <div
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                                className={`
                                                    relative h-40
                                                    ${isDragging ? 'bg-cyan-500/10' : ''}
                                                    transition-colors duration-200
                                                `}
                                            >
                                                <label className={`
                                                    h-full flex flex-col items-center justify-center gap-4 
                                                    border-2 border-dashed rounded-lg p-8
                                                    cursor-pointer transition-all duration-200
                                                    ${isDragging
                                                        ? 'border-cyan-400 bg-cyan-500/5'
                                                        : 'border-gray-700/50 hover:border-cyan-500/30'
                                                    }
                                                    group
                                                `}>
                                                    <div className="p-4 rounded-full bg-gray-800/50 group-hover:bg-cyan-500/10 transition-all duration-200">
                                                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-cyan-400" />
                                                    </div>
                                                    <div className="text-center space-y-2">
                                                        <p className="text-sm font-medium text-gray-300 group-hover:text-cyan-400">
                                                            {isDragging ? 'Drop your video here' : 'Drag and drop or click to upload'}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Supported format: MP4 only
                                                        </p>
                                                        <p className="text-[11px] text-gray-500">
                                                            Maximum file size: 100MB
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        onChange={handleVideoFileUpload}
                                                        accept="video/mp4"
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                                                <div className="p-2 rounded-lg bg-cyan-500/20">
                                                    <Video className="w-5 h-5 text-cyan-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-cyan-400 truncate">
                                                        {videoFile.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setVideoFile(null)}
                                                    className="p-2 hover:bg-red-500/20 rounded-lg text-red-400"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M18 6L6 18"></path>
                                                        <path d="M6 6l12 12"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Presentation Upload - Optional */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="text-gray-300 text-sm">
                                                2. (Optional) Upload your presentation (PDF)
                                            </div>
                                            <div className="text-gray-400/70 text-xs italic">
                                                Adding a PDF enhances your AI Module's understanding and improves its ability to assist your audience
                                            </div>
                                        </div>
                                        <motion.label
                                            htmlFor="pdf-upload"
                                            className={`flex items-center justify-center gap-2 py-3 rounded-lg 
                                            border cursor-pointer transition-all duration-200
                                            ${file
                                                    ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                                                    : 'border-gray-700/50 text-gray-400 hover:border-cyan-500/40 hover:text-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                                                }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <FileText className="w-4 h-4" />
                                            <span className="text-sm">
                                                {file ? `Selected: ${file.name}` : `Upload Presentation (PDF)`}
                                            </span>
                                            <input
                                                type="file"
                                                id="pdf-upload"
                                                accept=".pdf"
                                                onChange={(e) => setFile(e.target.files[0])}
                                                className="hidden"
                                            />
                                        </motion.label>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="space-y-4">
                                        <motion.button
                                            type="submit"
                                            disabled={loading || !videoFile}
                                            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500
                                            text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed
                                            shadow-lg shadow-cyan-500/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]
                                            transition-all duration-200 relative overflow-hidden
                                            border border-cyan-500/20"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                {loading ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        Create AI Module
                                                        <ArrowRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </span>
                                        </motion.button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default CreateBrdgePage;
