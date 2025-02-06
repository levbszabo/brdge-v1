// CreateBrdgePage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';
import { useSnackbar } from '../utils/snackbar';
import { ArrowRight, Upload, Video, FileText, StopCircle } from 'lucide-react';
import { Box } from '@mui/material';

const MAX_PDF_SIZE = 20 * 1024 * 1024;  // 20MB in bytes
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;  // 100MB in bytes
const MAX_RECORDING_MINUTES = 5;

function CreateBrdgePage() {
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [screenRecording, setScreenRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingFormat, setRecordingFormat] = useState('16:9');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recordingTime, setRecordingTime] = useState(0);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [recordingMode, setRecordingMode] = useState('upload');
    const recordingPreviewRef = useRef(null);
    const timerRef = useRef(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const [isMobile, setIsMobile] = useState(false);
    const [loadingPhase, setLoadingPhase] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [webcamStream, setWebcamStream] = useState(null);
    const [showWebcam, setShowWebcam] = useState(false);
    const [showScreen, setShowScreen] = useState(true);
    const [isDragging, setIsDragging] = useState(false);

    const loadingPhases = [
        { message: "Processing video...", duration: 4500 },
        { message: "Generating transcript...", duration: 4500 },
        { message: "Processing document...", duration: 4500 },
        { message: "Creating Brdge...", duration: 4500 }
    ];

    useEffect(() => {
        if (id) {
            fetchBrdgeData();
        }
    }, [id]);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            }
            if (webcamStream) {
                webcamStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [mediaRecorder, webcamStream]);

    useEffect(() => {
        const checkMobile = () => {
            const isMobileDevice = window.innerWidth <= 768;
            setIsMobile(isMobileDevice);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const fetchBrdgeData = async () => {
        try {
            const response = await api.get(`/brdges/${id}`);
            setName(response.data.name);
        } catch (error) {
            console.error('Error fetching brdge data:', error);
            setError('Failed to fetch brdge data. Please try again.');
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            console.log('Stopping recording...');
            mediaRecorder.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                setRecordingTime(0);
            }
        }
    };

    const updateVideoPreview = (blob) => {
        if (recordingPreviewRef.current) {
            // Create a new URL for the blob
            const url = URL.createObjectURL(blob);

            // Set the video source directly
            recordingPreviewRef.current.src = url;

            // Ensure the video loads and plays
            recordingPreviewRef.current.load();

            // Clean up the old URL when the component unmounts
            return () => URL.revokeObjectURL(url);
        }
    };

    const startRecording = async () => {
        try {
            let stream;
            const audioConstraints = {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 48000,
                channelCount: 2,
                bitrate: 256000
            };

            const videoConstraints = {
                width: 1920,
                height: 1080,
                frameRate: 30,
            };

            if (showScreen) {
                const displayStream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        ...videoConstraints,
                        cursor: 'always',
                        displaySurface: 'monitor'
                    },
                    audio: {
                        ...audioConstraints,
                        autoGainControl: false
                    }
                });

                const micStream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        ...audioConstraints,
                        autoGainControl: true
                    },
                    video: false
                });

                const tracks = [
                    ...displayStream.getVideoTracks(),
                    ...displayStream.getAudioTracks(),
                    ...micStream.getAudioTracks()
                ];

                stream = new MediaStream(tracks);
            } else {
                // Webcam recording (simplified)
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: audioConstraints,
                    video: {
                        ...videoConstraints,
                        facingMode: 'user'
                    }
                });
            }

            const recorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9,opus',
                audioBitsPerSecond: 256000,
                videoBitsPerSecond: 3500000
            });

            const chunks = [];

            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            recorder.onstart = () => {
                setRecordingMode('record');
                setIsRecording(true);
                let seconds = 0;
                timerRef.current = setInterval(() => {
                    seconds++;
                    setRecordingTime(seconds);
                }, 1000);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                const recordingFile = new File([blob], `${showScreen ? 'screen' : 'webcam'}-recording.webm`, { type: 'video/webm' });
                setScreenRecording(recordingFile);

                // Clean up tracks
                stream.getTracks().forEach(track => {
                    track.stop();
                });

                updateVideoPreview(blob);
            };

            setMediaRecorder(recorder);
            recorder.start(1000);

            // Add recording time limit
            const timeLimit = MAX_RECORDING_MINUTES * 60;
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => {
                    if (prev >= timeLimit - 1) {
                        stopRecording();
                        return 0;
                    }
                    return prev + 1;
                });
            }, 1000);

        } catch (error) {
            console.error('Error starting recording:', error);
            if (error.name === 'NotAllowedError') {
                showSnackbar('Please allow access to your camera and microphone to record.', 'error');
            } else {
                showSnackbar('Failed to start recording. Please check your permissions and try again.', 'error');
            }
        }
    };

    const validateAspectRatio = (file) => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';

            // Add error handling
            video.onerror = (e) => {
                console.error('Error loading video:', e);
                resolve(true); // Allow the upload to continue if validation fails
            };

            video.onloadedmetadata = () => {
                console.log('Video metadata loaded:', {
                    width: video.videoWidth,
                    height: video.videoHeight,
                    aspectRatio: video.videoWidth / video.videoHeight
                });
                window.URL.revokeObjectURL(video.src);
                const aspectRatio = video.videoWidth / video.videoHeight;
                const expectedRatio = recordingFormat === '16:9' ? 16 / 9 : 9 / 16;
                const tolerance = 0.1;
                const isValid = Math.abs(aspectRatio - expectedRatio) < tolerance;
                console.log('Aspect ratio validation:', { aspectRatio, expectedRatio, isValid });
                resolve(isValid);
            };
            video.src = URL.createObjectURL(file);
        });
    };

    const validateVideoFile = (file) => {
        const validTypes = ['video/mp4', 'video/webm'];
        const maxSize = 100 * 1024 * 1024; // 100MB in bytes

        if (!validTypes.includes(file.type)) {
            return {
                isValid: false,
                error: 'Invalid file type. Please upload MP4 or WebM video files only.'
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

    const handleScreenRecordingUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validation = validateVideoFile(file);
        if (!validation.isValid) {
            showSnackbar(validation.error, 'error');
            e.target.value = ''; // Clear the input
            return;
        }

        setRecordingMode('upload'); // Set mode to upload when file is selected
        setScreenRecording(file);
        const blob = new Blob([file], { type: file.type });
        updateVideoPreview(blob);
    };

    // Also let's add a useEffect to monitor screenRecording changes
    useEffect(() => {
        console.log('screenRecording changed:', screenRecording?.name); // Debug log
    }, [screenRecording]);

    const startLoadingSequence = () => {
        let currentPhase = 0;

        const updatePhase = () => {
            if (currentPhase < loadingPhases.length) {
                setLoadingPhase(currentPhase);
                setLoadingMessage(loadingPhases[currentPhase].message);
                currentPhase++;
            }
        };

        // Start the sequence
        updatePhase();

        // Schedule subsequent phases
        loadingPhases.forEach((phase, index) => {
            if (index > 0) {
                setTimeout(() => {
                    updatePhase();
                }, loadingPhases.slice(0, index).reduce((acc, p) => acc + p.duration, 0));
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        startLoadingSequence();

        if (file && file.size > MAX_PDF_SIZE) {
            showSnackbar('PDF file size exceeds 20MB limit', 'error');
            setLoading(false);
            setLoadingPhase(0);
            setLoadingMessage('');
            return;
        }

        if (screenRecording && screenRecording.size > MAX_VIDEO_SIZE) {
            showSnackbar('Video file size exceeds 100MB limit', 'error');
            setLoading(false);
            setLoadingPhase(0);
            setLoadingMessage('');
            return;
        }

        // Require screen recording
        if (!screenRecording) {
            setError('Please record or upload a video presentation');
            setLoading(false);
            setLoadingPhase(0);
            setLoadingMessage('');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);

        // PDF is optional
        if (file) {
            formData.append('presentation', file);
        }

        if (screenRecording) {
            console.log('Adding screen recording to form data:', screenRecording);

            // Get video duration
            const duration = await new Promise((resolve) => {
                const video = document.createElement('video');
                video.preload = 'metadata';
                video.onloadedmetadata = () => {
                    window.URL.revokeObjectURL(video.src);
                    resolve(Math.round(video.duration));
                };
                video.src = URL.createObjectURL(screenRecording);
            });

            // Ensure we're sending the actual File object with correct type
            const contentType = screenRecording.type || 'video/mp4';
            const fileExtension = screenRecording.name.split('.').pop().toLowerCase();
            const fileName = `${screenRecording.name}`;

            // Create new File object with explicit type
            const videoFile = new File([screenRecording], fileName, {
                type: contentType
            });

            formData.append('screen_recording', videoFile);
            formData.append('recording_metadata', JSON.stringify({
                format: recordingFormat,
                duration: duration,
                file_size: screenRecording.size / (1024 * 1024), // Convert to MB
                content_type: contentType,
                file_extension: fileExtension
            }));
        }

        try {
            if (id) {
                await api.put(`/brdges/${id}`, formData);
                showSnackbar('Brdge updated successfully', 'success');
                navigate(`/edit/${id}`);
            } else {
                const response = await api.post('/brdges', formData);
                showSnackbar('Brdge created successfully', 'success');
                navigate(`/edit/${response.data.brdge.id}`);
            }
        } catch (error) {
            console.error('Error creating/updating brdge:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
            setLoadingPhase(0);
            setLoadingMessage('');
        }
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

        setRecordingMode('upload'); // Set mode to upload when file is dropped
        setScreenRecording(file);
        const blob = new Blob([file], { type: file.type });
        updateVideoPreview(blob);
    };

    const LoadingBar = ({ phase, message }) => {
        const baseProgress = (phase / loadingPhases.length) * 100;
        const progressPerPhase = 100 / loadingPhases.length;
        const progress = Math.min(baseProgress + progressPerPhase, 100);

        return (
            <div className="w-full space-y-3">
                <div className="relative h-1 bg-gray-800/50 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{
                            duration: 4.5, // Updated to match new phase duration
                            ease: "linear",
                            type: "tween"
                        }}
                    />

                    {/* Animated glow effect */}
                    <motion.div
                        className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </div>

                {/* Message and percentage */}
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={message} // Add key to trigger animation on message change
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center"
                >
                    <motion.span
                        className="text-[11px] text-cyan-400/90 font-medium tracking-wide"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={message} // Add key to trigger animation on message change
                    >
                        {message}
                    </motion.span>
                    <span className="text-[11px] text-gray-500">
                        {Math.round(progress)}%
                    </span>
                </motion.div>
            </div>
        );
    };

    const RecordingOptions = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upload Option Box */}
            <div className={`
                p-4 rounded-lg border transition-all duration-300
                min-h-[200px] flex flex-col
                ${recordingMode === 'upload'
                    ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)]'
                    : 'bg-gray-900/40 border-gray-700/50 hover:border-cyan-500/20'
                }
            `}>
                <button
                    onClick={() => {
                        setRecordingMode('upload');
                        if (isRecording) stopRecording();
                        setShowScreen(false);
                        setShowWebcam(false);
                    }}
                    className="w-full flex items-center gap-3"
                >
                    <div className={`
                        p-2.5 rounded-lg transition-all duration-300
                        ${recordingMode === 'upload'
                            ? 'bg-cyan-500/20 border border-cyan-500/30'
                            : 'bg-gray-800/50 border border-gray-700/50'
                        }
                    `}>
                        <Upload className={`w-5 h-5 ${recordingMode === 'upload' ? 'text-cyan-400' : 'text-gray-400'}`} />
                    </div>
                    <div className="text-left flex-1">
                        <h3 className={`text-base font-medium mb-0.5 transition-colors duration-300 
                            ${recordingMode === 'upload' ? 'text-cyan-400' : 'text-gray-200'}`}>
                            Upload Video
                        </h3>
                        <p className="text-xs text-gray-400">MP4 or WebM, max 100MB</p>
                    </div>
                </button>

                <div className="mt-3 pt-3 border-t border-gray-700/50 flex-1">
                    {(!screenRecording || recordingMode !== 'upload') ? (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`
                                h-full relative
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
                                        Supported formats: MP4, WebM
                                    </p>
                                    <p className="text-[11px] text-gray-500">
                                        Maximum file size: 100MB
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    onChange={handleScreenRecordingUpload}
                                    accept="video/mp4,video/webm"
                                    className="hidden"
                                />
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                                <div className="p-2 rounded-lg bg-cyan-500/20">
                                    <Video className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-cyan-400 truncate">
                                        {screenRecording.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {(screenRecording.size / (1024 * 1024)).toFixed(1)} MB
                                    </p>
                                </div>
                                <button
                                    onClick={() => setScreenRecording(null)}
                                    className="p-2 hover:bg-red-500/20 rounded-lg text-red-400"
                                >
                                    <StopCircle className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Record Option Box */}
            <div className={`
                p-4 rounded-lg border transition-all duration-300
                min-h-[200px] flex flex-col
                ${recordingMode === 'record'
                    ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)]'
                    : 'bg-gray-900/40 border-gray-700/50 hover:border-cyan-500/20'
                }
            `}>
                <button
                    onClick={() => {
                        setRecordingMode('record');
                        setScreenRecording(null);
                    }}
                    className="w-full flex items-center gap-3"
                >
                    <div className={`
                        p-2.5 rounded-lg transition-all duration-300
                        ${recordingMode === 'record'
                            ? 'bg-cyan-500/20 border border-cyan-500/30'
                            : 'bg-gray-800/50 border border-gray-700/50'
                        }
                    `}>
                        <Video className={`w-5 h-5 ${recordingMode === 'record' ? 'text-cyan-400' : 'text-gray-400'}`} />
                    </div>
                    <div className="text-left">
                        <h3 className={`text-base font-medium mb-0.5 transition-colors duration-300 
                            ${recordingMode === 'record' ? 'text-cyan-400' : 'text-gray-200'}`}>
                            Record Video
                        </h3>
                        <p className="text-xs text-gray-400">Screen or webcam recording</p>
                    </div>
                </button>

                <div className="mt-3 pt-3 border-t border-gray-700/50 flex-1">
                    {(!screenRecording || recordingMode !== 'record') ? (
                        <div className="space-y-3 h-full">
                            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-900/40">
                                <button
                                    onClick={() => {
                                        setShowScreen(true);
                                        setShowWebcam(false);
                                    }}
                                    className={`
                                        flex-1 py-2 px-3 rounded-lg transition-all duration-200
                                        flex items-center justify-center gap-2 text-sm
                                        ${showScreen ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-cyan-400'}
                                    `}
                                >
                                    <Video className="w-4 h-4" />
                                    Screen
                                </button>
                                <button
                                    onClick={() => {
                                        setShowScreen(false);
                                        setShowWebcam(true);
                                    }}
                                    className={`
                                        flex-1 py-2 px-3 rounded-lg transition-all duration-200
                                        flex items-center justify-center gap-2 text-sm
                                        ${showWebcam && !showScreen ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-cyan-400'}
                                    `}
                                >
                                    <Video className="w-4 h-4" />
                                    Webcam
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={isRecording ? stopRecording : startRecording}
                                className={`
                                    w-full py-2.5 px-4 rounded-lg border transition-all duration-200
                                    flex items-center justify-center gap-2 text-sm
                                    ${isRecording
                                        ? 'bg-red-500/20 border-red-500/40 text-red-400'
                                        : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                                    }
                                    hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]
                                `}
                            >
                                {isRecording ? (
                                    <>
                                        <StopCircle className="w-4 h-4" />
                                        <span>
                                            Stop Recording ({formatTime(recordingTime)})
                                            <span className="text-xs opacity-70 ml-1">
                                                / {MAX_RECORDING_MINUTES}:00
                                            </span>
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Video className="w-4 h-4" />
                                        <span>
                                            Start Recording
                                            <span className="text-xs opacity-70 ml-1">
                                                (max {MAX_RECORDING_MINUTES} min)
                                            </span>
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                                <div className="p-2 rounded-lg bg-cyan-500/20">
                                    <Video className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-cyan-400 truncate">
                                        {screenRecording.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {(screenRecording.size / (1024 * 1024)).toFixed(1)} MB
                                    </p>
                                </div>
                                <button
                                    onClick={() => setScreenRecording(null)}
                                    className="p-2 hover:bg-red-500/20 rounded-lg text-red-400"
                                >
                                    <StopCircle className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 italic text-center">
                                Click the remove button above to record again
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

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
                        Create New Bridge
                        <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 w-40 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
                    </h1>

                    <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-8 shadow-xl">
                        <div className="relative z-10">
                            {error && (
                                <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-10">
                                {/* Bridge Name with improved styling */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Bridge Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter a name for your Bridge"
                                        required
                                        className="w-full bg-gray-900/40 border border-gray-700/50 rounded-lg 
                                            px-4 py-2.5 text-base text-gray-100
                                            placeholder:text-gray-500 
                                            focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 
                                            hover:border-cyan-500/30 
                                            transition-all duration-200"
                                    />
                                </div>

                                {/* Screen Recording Section - Now First */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="text-gray-300 text-sm">
                                            1. {isMobile ? 'Record or upload a video' : 'Record or upload a video presentation of your slides'}
                                        </div>
                                        <div className="text-gray-400/70 text-xs italic">
                                            {isMobile
                                                ? "We'll transcribe your content and create an AI voice assistant that can engage with your audience"
                                                : "We'll transcribe your presentation and create an AI voice assistant that can guide viewers through your slides"
                                            }
                                        </div>
                                    </div>

                                    <RecordingOptions />
                                </div>

                                {/* Presentation Upload - Now Second and Optional */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="text-gray-300 text-sm">
                                            2. (Optional) Upload your {isMobile ? 'content' : 'presentation'} (PDF)
                                        </div>
                                        <div className="text-gray-400/70 text-xs italic">
                                            {isMobile
                                                ? "Adding a PDF enhances your Brdge's understanding and improves its ability to assist your audience"
                                                : "Adding a PDF enhances your Brdge's understanding and improves its ability to assist your audience"
                                            }
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
                                            {file ? `Selected: ${file.name}` : `Upload ${isMobile ? 'Content' : 'Presentation'} (PDF)`}
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
                                        disabled={loading || !screenRecording}
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
                                                    Create Bridge
                                                    <ArrowRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </span>
                                    </motion.button>

                                    {/* Loading Progress */}
                                    {loading && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="p-4 rounded-lg bg-gray-900/40 backdrop-blur-sm border border-gray-800/50"
                                        >
                                            <LoadingBar phase={loadingPhase} message={loadingMessage} />
                                        </motion.div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default CreateBrdgePage;
