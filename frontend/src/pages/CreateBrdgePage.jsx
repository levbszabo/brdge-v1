// CreateBrdgePage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';
import { useSnackbar } from '../utils/snackbar';
import { ArrowRight, Upload, Video, FileText, StopCircle } from 'lucide-react';

const MAX_PDF_SIZE = 20 * 1024 * 1024;  // 20MB in bytes
const MAX_VIDEO_SIZE = 20 * 1024 * 1024;  // 20MB in bytes

function CreateBrdgePage() {
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [screenRecording, setScreenRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingFormat, setRecordingFormat] = useState(window.innerWidth <= 768 ? '9:16' : '16:9');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recordingTime, setRecordingTime] = useState(0);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const recordingPreviewRef = useRef(null);
    const timerRef = useRef(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const [isMobile, setIsMobile] = useState(false);

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
        };
    }, [mediaRecorder]);

    useEffect(() => {
        const checkMobile = () => {
            const isMobileDevice = window.innerWidth <= 768;
            setIsMobile(isMobileDevice);
            if (isMobileDevice) {
                setRecordingFormat('9:16');
            }
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
            const constraints = {
                audio: true,
                video: {
                    width: 1280,  // Reduced from 1920
                    height: 720,  // Reduced from 1080
                    frameRate: 15,  // Reduced from default
                    aspectRatio: recordingFormat === '16:9' ? 16 / 9 : 9 / 16
                }
            };

            const screenStream = await navigator.mediaDevices.getDisplayMedia(constraints);
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const combinedStream = new MediaStream([
                ...screenStream.getVideoTracks(),
                ...audioStream.getAudioTracks()
            ]);

            const recorder = new MediaRecorder(combinedStream, {
                mimeType: 'video/webm;codecs=vp9',
                videoBitsPerSecond: 1000000  // ~1 Mbps
            });

            const chunks = [];

            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            recorder.onstart = () => {
                console.log('Recording started');
                setIsRecording(true);
                let seconds = 0;
                timerRef.current = setInterval(() => {
                    seconds++;
                    setRecordingTime(seconds);
                }, 1000);
            };

            recorder.onstop = () => {
                console.log('Recording stopped');
                const blob = new Blob(chunks, { type: 'video/webm' });
                const recordingFile = new File([blob], 'screen-recording.webm', { type: 'video/webm' });
                setScreenRecording(recordingFile);

                // Stop all tracks
                screenStream.getTracks().forEach(track => track.stop());
                audioStream.getTracks().forEach(track => track.stop());

                // Update video preview
                updateVideoPreview(blob);
            };

            setMediaRecorder(recorder);
            setRecordedChunks(chunks);

            recorder.start(1000);

        } catch (error) {
            console.error('Error starting screen recording:', error);
            showSnackbar('Failed to start screen recording. Please grant necessary permissions.', 'error');
        }
    };

    const validateAspectRatio = (file) => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                const aspectRatio = video.videoWidth / video.videoHeight;
                const expectedRatio = recordingFormat === '16:9' ? 16 / 9 : 9 / 16;
                const tolerance = 0.1;
                resolve(Math.abs(aspectRatio - expectedRatio) < tolerance);
            };
            video.src = URL.createObjectURL(file);
        });
    };

    const handleScreenRecordingUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['video/mp4', 'video/webm'];
            if (!validTypes.includes(file.type)) {
                showSnackbar('Please upload a valid video file (.mp4 or .webm)', 'error');
                return;
            }

            if (file.size > MAX_VIDEO_SIZE) {
                showSnackbar('File size exceeds 100MB limit', 'error');
                return;
            }

            const isValidRatio = await validateAspectRatio(file);
            if (!isValidRatio) {
                showSnackbar(`Video must be in ${recordingFormat} format`, 'error');
                return;
            }

            setScreenRecording(file);

            // Update video preview for uploaded file
            const blob = new Blob([file], { type: file.type });
            updateVideoPreview(blob);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Only validate PDF if one is uploaded
        if (file && file.size > MAX_PDF_SIZE) {
            setError('PDF file size exceeds 20MB limit');
            setLoading(false);
            return;
        }

        if (screenRecording && screenRecording.size > MAX_VIDEO_SIZE) {
            setError('Screen recording size exceeds 100MB limit');
            setLoading(false);
            return;
        }

        // Require screen recording
        if (!screenRecording) {
            setError('Please record or upload a video presentation');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', name);

        // PDF is optional now
        if (file) {
            formData.append('presentation', file);
        }

        if (screenRecording) {
            console.log('Adding screen recording to form data:', screenRecording); // Debug log

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

            // Ensure we're sending the actual File object
            formData.append('screen_recording', screenRecording, screenRecording.name);
            formData.append('recording_format', recordingFormat);
            formData.append('recording_metadata', JSON.stringify({
                format: recordingFormat,
                duration: duration,
                file_size: screenRecording.size / (1024 * 1024) // Convert to MB
            }));

            // Debug logs
            console.log('Recording format:', recordingFormat);
            console.log('Recording duration:', duration);
            console.log('Recording size (MB):', screenRecording.size / (1024 * 1024));
        }

        // Debug log
        console.log('Sending data:', {
            name,
            presentation: file,
            recording: screenRecording
        });

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
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0A1929] via-[#121212] to-[#0A1929] flex items-center justify-center relative overflow-hidden">
            {/* Enhanced Background Effect */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Single elegant gradient */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-blue-900/20 blur-[120px] animate-pulse-slow" />
            </div>

            <div className="container max-w-2xl mx-auto px-4 py-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-semibold text-white mb-8 text-center relative">
                        Create New Brdge
                        <div className="absolute left-1/2 -bottom-3 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
                    </h1>

                    <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6 shadow-xl relative">
                        {/* Card inner glow */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-900/20 via-transparent to-transparent opacity-50" />

                        {/* Rest of the form content */}
                        <div className="relative z-10">
                            {error && (
                                <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Brdge Name */}
                                <div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Brdge Name"
                                        required
                                        className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-4 py-3 text-gray-100 
                                            placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 
                                            hover:border-cyan-500/30 transition-all duration-200
                                            shadow-[0_0_15px_rgba(0,0,0,0.2)] focus:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
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

                                    {/* Format Selection */}
                                    <div className="space-y-2">
                                        <div className="text-gray-400 text-xs">
                                            Choose recording format:
                                        </div>
                                        <div className="flex gap-2">
                                            {['16:9', '9:16'].map((format) => {
                                                const isDisabled = isMobile && format === '16:9';
                                                return (
                                                    <button
                                                        key={format}
                                                        type="button"
                                                        onClick={() => !isDisabled && setRecordingFormat(format)}
                                                        className={`
                                                            flex-1 py-2 px-4 rounded-lg border transition-all duration-200 text-sm
                                                            ${recordingFormat === format
                                                                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                                                                : 'border-gray-700/50 text-gray-400 hover:border-cyan-500/30 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                                                            }
                                                            ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                                                        `}
                                                        title={isDisabled ? 'Portrait mode (9:16) is required on mobile devices' : ''}
                                                    >
                                                        {format === '16:9' ? 'Landscape' : 'Portrait'} ({format})
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Recording Controls */}
                                    <div className="flex gap-3">
                                        <motion.button
                                            type="button"
                                            onClick={isRecording ? stopRecording : startRecording}
                                            className={`flex-1 py-3 px-4 rounded-lg border transition-all duration-200
                                                flex items-center justify-center gap-2 text-sm relative
                                                ${isRecording
                                                    ? 'bg-red-500/20 border-red-500/40 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                                                    : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                                                }
                                                hover:shadow-[0_0_25px_rgba(34,211,238,0.25)] hover:scale-[1.02]
                                                active:scale-[0.98]`}
                                        >
                                            {isRecording ? (
                                                <>
                                                    <StopCircle className="w-4 h-4" />
                                                    <span>Stop Recording ({formatTime(recordingTime)})</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Video className="w-4 h-4" />
                                                    <span>{isMobile ? 'Record Video' : 'Record Presentation'}</span>
                                                </>
                                            )}
                                        </motion.button>

                                        <motion.label
                                            htmlFor="video-upload"
                                            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg 
                                                border border-gray-700/50 text-gray-400 cursor-pointer
                                                hover:border-cyan-500/40 hover:text-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]
                                                transition-all duration-200`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Upload className="w-4 h-4" />
                                            <span className="text-sm">Upload Video</span>
                                            <input
                                                type="file"
                                                id="video-upload"
                                                accept="video/*"
                                                onChange={handleScreenRecordingUpload}
                                                className="hidden"
                                            />
                                        </motion.label>
                                    </div>

                                    {/* Video Preview */}
                                    {screenRecording && (
                                        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                                            <div className="flex items-center gap-2 text-cyan-400 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                                Recording ready for review
                                            </div>
                                            <video
                                                ref={recordingPreviewRef}
                                                controls
                                                playsInline
                                                className="w-full mt-3 rounded-lg border border-gray-700/50"
                                                style={{ maxHeight: '300px', backgroundColor: '#1a1a1a' }}
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    )}
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
                                                Create Brdge
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </span>
                                </motion.button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default CreateBrdgePage;
