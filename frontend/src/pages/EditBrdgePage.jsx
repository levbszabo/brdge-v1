import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MicRecorder from 'mic-recorder-to-mp3';
import {
    Grid, Card, CardHeader, CardContent, CardMedia, Typography, Button, TextField, Box,
    Stepper, Step, StepLabel, CircularProgress, Paper, Switch, FormControlLabel, IconButton, Dialog, DialogContent, DialogContentText, Backdrop, Tooltip, styled, LinearProgress, Accordion, AccordionSummary, AccordionDetails, InputAdornment, useTheme, useMediaQuery, Container, Avatar, Tabs, Tab
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FaPlay, FaPause, FaChevronLeft, FaChevronRight, FaStop, FaMicrophone } from 'react-icons/fa';
import { api } from '../api';
import { useSnackbar } from '../utils/snackbar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTTS } from '@cartesia/cartesia-js/react';
import { CARTESIA_API_KEY, CARTESIA_VOICE_ID } from '../config';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { DEEPGRAM_API_KEY } from '../config';

// Custom styled components
const CustomStepLabel = styled(StepLabel)(({ theme, completed }) => ({
    '& .MuiStepLabel-label': {
        color: completed ? theme.palette.primary.main : theme.palette.text.secondary,
        fontWeight: completed ? 'bold' : 'normal',
    },
    '& .MuiStepIcon-root': {
        color: completed ? theme.palette.primary.main : theme.palette.text.disabled,
    },
}));

const StyledCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(145deg, #f3f4f6 0%, #fff 100%)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderRadius: theme.spacing(2),
    overflow: 'hidden',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.spacing(3),
    textTransform: 'none',
    fontWeight: 600,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
}));

// Add this near the top of the file, after the imports
const ResizeObserverHandler = () => {
    const errorHandler = (e) => {
        if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
            e.stopPropagation();
        }
    };

    useEffect(() => {
        window.addEventListener('error', errorHandler);
        return () => window.removeEventListener('error', errorHandler);
    }, []);

    return null;
};

function EditBrdgePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [brdgeData, setBrdgeData] = useState({
        name: '',
        numSlides: 0,
        isShareable: false,
        slides: [],
        transcripts: [],
        generatedAudioFiles: []
    });
    const [currentSlide, setCurrentSlide] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [presentation, setPresentation] = useState(null);
    const [isAudioUploaded, setIsAudioUploaded] = useState(false);
    const [isTranscriptModified, setIsTranscriptModified] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [activeStep, setActiveStep] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isRecordingDialogOpen, setIsRecordingDialogOpen] = useState(false);
    const [audioUrls, setAudioUrls] = useState([]);
    const [completedSteps, setCompletedSteps] = useState({
        audioUploaded: false,
        transcriptsGenerated: false,
        transcriptsSaved: false,
        voiceGenerated: false,
    });
    const [voiceId, setVoiceId] = useState('');
    const [recordingTime, setRecordingTime] = useState(0);
    const recordingIntervalRef = useRef(null);
    const [shareableLink, setShareableLink] = useState('');

    const audioRef = useRef(null);
    const mp3Recorder = useRef(new MicRecorder({ bitRate: 128 }));
    const countdownIntervalRef = useRef(null);

    const tts = useTTS({
        apiKey: CARTESIA_API_KEY,
        sampleRate: 44100,
    });

    const [ttsStatus, setTtsStatus] = useState('idle');

    const [activeTab, setActiveTab] = useState(0);
    const [agentSettings, setAgentSettings] = useState({
        questions: [],
        settings: {},
        knowledgeBase: ''
    });

    const [liveTranscript, setLiveTranscript] = useState('');
    const deepgramClientRef = useRef(null);
    const liveTranscriptionRef = useRef(null);

    useEffect(() => {
        fetchBrdgeData();
        fetchGeneratedAudioFiles();
        return () => {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
        };
    }, [id]);

    useEffect(() => {
        if (audioUrls.length > 0 && currentSlide <= audioUrls.length) {
            loadAudioForSlide(currentSlide);
        }
    }, [audioUrls, currentSlide]);

    useEffect(() => {
        if (isPlaying) {
            tts.pause();
            setIsPlaying(false);
            setTtsStatus('idle');
        }
    }, [currentSlide]);

    useEffect(() => {
        return () => {
            if (isPlaying) {
                tts.pause();
            }
        };
    }, []);

    useEffect(() => {
        deepgramClientRef.current = createClient(DEEPGRAM_API_KEY);
        return () => {
            if (liveTranscriptionRef.current) {
                liveTranscriptionRef.current.requestClose();
            }
        };
    }, []);

    const fetchBrdgeData = async () => {
        try {
            const response = await api.get(`/brdges/${id}`);
            const data = response.data;
            setBrdgeData({
                name: data.name,
                numSlides: data.num_slides,
                isShareable: data.shareable,
                slides: data.slides || [],
                transcripts: [], // Initialize as empty
                generatedAudioFiles: data.generated_audio_files || []
            });
            setIsAudioUploaded(!!data.audio_filename);

            // Fetch aligned transcripts separately
            fetchAlignedTranscripts();
        } catch (error) {
            console.error('Error fetching brdge data:', error);
            showSnackbar('Error loading brdge data.', 'error');
        }
    };

    const fetchAlignedTranscripts = async () => {
        try {
            const transcriptsResponse = await api.get(`/brdges/${id}/transcripts/aligned`);
            if (transcriptsResponse.data && Array.isArray(transcriptsResponse.data.image_transcripts)) {
                const transcriptsArray = transcriptsResponse.data.image_transcripts.map(item => item.transcript);
                setBrdgeData(prev => ({
                    ...prev,
                    transcripts: transcriptsArray
                }));
                setCompletedSteps(prev => ({ ...prev, transcriptsGenerated: true }));
            } else {
                console.warn('Transcripts not available yet:', transcriptsResponse.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn('Aligned transcripts not available yet.');
            } else {
                console.error('Error fetching aligned transcripts:', error);
                showSnackbar('Error fetching aligned transcripts.', 'error');
            }
        }
    };

    const fetchGeneratedAudioFiles = async () => {
        try {
            const response = await api.get(`/brdges/${id}/audio/generated`);
            if (response.data && Array.isArray(response.data.files)) {
                const urls = response.data.files.map(file =>
                    `${api.defaults.baseURL}/brdges/${id}/audio/generated/${file}`
                );
                setAudioUrls(urls);
                setBrdgeData(prev => ({ ...prev, generatedAudioFiles: response.data.files }));
            } else {
                console.warn('Unexpected generated audio files data format:', response.data);
                showSnackbar('Unexpected generated audio files data format.', 'warning');
            }
        } catch (error) {
            console.error('Error fetching generated audio files:', error);
            showSnackbar('Error fetching generated audio files.', 'error');
        }
    };

    const loadAudioForSlide = (slideNumber) => {
        if (audioUrls.length >= slideNumber) {
            const audioUrl = audioUrls[slideNumber - 1];
            setCurrentAudio(audioUrl);
            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.load();
            }
        } else {
            setCurrentAudio(null);
        }
    };

    const handleRecordWalkthrough = () => {
        if (isRecording) {
            stopRecording();
        } else {
            setCountdown(3);
            setIsRecordingDialogOpen(true);
            countdownIntervalRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownIntervalRef.current);
                        setIsRecordingDialogOpen(false);
                        startRecording();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    };

    const startRecording = async () => {
        try {
            console.log('Starting recording and transcription...');

            liveTranscriptionRef.current = deepgramClientRef.current.listen.live({
                model: "nova-2",
                language: "en",
                punctuate: true,
                smart_format: true,
                interim_results: true
            });

            liveTranscriptionRef.current.on(LiveTranscriptionEvents.Open, async () => {
                console.log('Deepgram connection opened');

                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    console.log('Got audio stream');

                    // Start MP3 recording
                    await mp3Recorder.current.start();
                    setIsRecording(true);
                    showSnackbar('Recording started...', 'info');
                    recordingIntervalRef.current = setInterval(() => {
                        setRecordingTime((prevTime) => prevTime + 1);
                    }, 1000);

                    // Modern audio processing
                    const audioContext = new AudioContext();
                    const source = audioContext.createMediaStreamSource(stream);

                    // Create buffer for processing
                    const bufferSize = 2048;
                    const numberOfInputChannels = 1;
                    const numberOfOutputChannels = 1;

                    if (audioContext.audioWorklet) {
                        // Use AudioWorklet if supported
                        await audioContext.audioWorklet.addModule('/audioProcessor.js');
                        const audioProcessor = new AudioWorkletNode(audioContext, 'audio-processor');

                        audioProcessor.port.onmessage = (event) => {
                            if (event.data && liveTranscriptionRef.current) {
                                liveTranscriptionRef.current.send(event.data);
                            }
                        };

                        source.connect(audioProcessor);
                        audioProcessor.connect(audioContext.destination);
                    } else {
                        // Fallback to ScriptProcessor
                        const processor = audioContext.createScriptProcessor(
                            bufferSize,
                            numberOfInputChannels,
                            numberOfOutputChannels
                        );

                        processor.onaudioprocess = (e) => {
                            if (liveTranscriptionRef.current) {
                                const inputData = e.inputBuffer.getChannelData(0);
                                const pcmData = new Int16Array(inputData.length);
                                for (let i = 0; i < inputData.length; i++) {
                                    pcmData[i] = Math.max(-32768, Math.min(32767, Math.floor(inputData[i] * 32768)));
                                }
                                liveTranscriptionRef.current.send(pcmData.buffer);
                            }
                        };

                        source.connect(processor);
                        processor.connect(audioContext.destination);
                    }
                } catch (err) {
                    console.error('Error accessing microphone:', err);
                    showSnackbar('Error accessing microphone', 'error');
                }
            });

            liveTranscriptionRef.current.on(LiveTranscriptionEvents.Transcript, (data) => {
                console.log('Received transcript:', data);
                if (data.channel?.alternatives?.[0]?.transcript) {
                    const transcript = data.channel.alternatives[0].transcript;
                    console.log('Processing transcript:', transcript);

                    setLiveTranscript(prev => {
                        // Only add new text if it's not empty
                        if (transcript.trim()) {
                            // If it's a new sentence (starts with capital), add newline
                            const shouldAddNewline =
                                prev.length > 0 &&
                                transcript.match(/^[A-Z]/) &&
                                !prev.endsWith('\n');

                            const newText = shouldAddNewline
                                ? `\n${transcript}`
                                : `${prev ? ' ' : ''}${transcript}`;

                            console.log('Updated transcript:', prev + newText);
                            return prev + newText;
                        }
                        return prev;
                    });
                }
            });

            liveTranscriptionRef.current.on(LiveTranscriptionEvents.Error, error => {
                console.error('Deepgram error:', error);
                showSnackbar('Transcription error occurred', 'error');
            });

            liveTranscriptionRef.current.on(LiveTranscriptionEvents.Close, () => {
                console.log('Deepgram connection closed');
            });

        } catch (error) {
            console.error('Error starting recording:', error);
            showSnackbar('Error starting recording and transcription', 'error');
        }
    };

    const stopRecording = () => {
        // Close Deepgram connection
        if (liveTranscriptionRef.current) {
            liveTranscriptionRef.current.requestClose();
        }

        mp3Recorder.current
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                const audioFile = new File(buffer, 'walkthrough_recording.mp3', {
                    type: blob.type,
                    lastModified: Date.now(),
                });

                // Update the transcript for the current slide
                handleTranscriptChange(currentSlide - 1, liveTranscript.trim());
                setLiveTranscript(''); // Clear live transcript

                handleUploadAudio({ target: { files: [audioFile] } });
                setIsRecording(false);
                clearInterval(recordingIntervalRef.current);
                setRecordingTime(0);
                showSnackbar('Recording stopped and uploaded successfully.', 'success');
            })
            .catch((e) => {
                console.error('Error stopping recording:', e);
                setIsRecording(false);
                clearInterval(recordingIntervalRef.current);
                setRecordingTime(0);
                showSnackbar('Error stopping recording.', 'error');
            });
    };

    const handleUploadAudio = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('audio', file);

            try {
                setIsProcessing(true);
                await api.post(`/brdges/${id}/audio`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                showSnackbar('Audio uploaded successfully.', 'success');
                setIsAudioUploaded(true);
                setCompletedSteps(prev => ({ ...prev, audioUploaded: true }));
                setActiveStep(prev => Math.max(prev, 1));
                // Optionally, refetch brdge data to get updated generatedAudioFiles
                fetchBrdgeData();
            } catch (error) {
                console.error('Error uploading audio:', error);
                showSnackbar('Error uploading audio.', 'error');
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleGenerateTranscripts = async () => {
        if (!isAudioUploaded) {
            showSnackbar('Please upload audio before generating transcripts.', 'warning');
            return;
        }

        try {
            setIsProcessing(true);
            // Step 1: Transcribe audio
            const transcribeResponse = await api.post(`/brdges/${id}/audio/transcribe`);
            if (transcribeResponse.data && transcribeResponse.data.transcript) {
                showSnackbar('Audio transcribed successfully.', 'success');
            } else {
                showSnackbar('No transcript received from the server.', 'warning');
                return;
            }

            // Step 2: Align transcript with slides
            const alignResponse = await api.post(`/brdges/${id}/audio/align_transcript`);
            if (alignResponse.data && alignResponse.data.image_transcripts) {
                showSnackbar('Transcript aligned with slides successfully.', 'success');
            } else {
                showSnackbar('No alignment data received from the server.', 'warning');
            }

            // Step 3: Fetch aligned transcripts
            const transcriptsResponse = await api.get(`/brdges/${id}/transcripts/aligned`);
            if (transcriptsResponse.data && Array.isArray(transcriptsResponse.data.image_transcripts)) {
                const transcriptsArray = transcriptsResponse.data.image_transcripts.map(item => item.transcript);
                setBrdgeData(prev => ({
                    ...prev,
                    transcripts: transcriptsArray
                }));
                setCompletedSteps(prev => ({ ...prev, transcriptsGenerated: true }));
                setActiveStep(prev => Math.max(prev, 2));
                showSnackbar('Transcripts fetched successfully.', 'success');
            } else {
                console.warn('Unexpected transcript data format:', transcriptsResponse.data);
                showSnackbar('Unexpected transcript data format.', 'warning');
            }

        } catch (error) {
            console.error('Error generating transcripts:', error);
            showSnackbar('Error generating transcripts.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!brdgeData.name) {
            showSnackbar('Please provide a name.', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('name', brdgeData.name);
        if (presentation) {
            formData.append('presentation', presentation);
        }

        try {
            setIsProcessing(true);
            const response = await api.put(`/brdges/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            showSnackbar(response.data.message || 'Brdge updated successfully.', 'success');
            // Refetch the brdge data to update the state
            fetchBrdgeData();
        } catch (error) {
            console.error('Error updating brdge:', error);
            showSnackbar('Error updating brdge.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTranscriptChange = (index, value) => {
        const updatedTranscripts = [...brdgeData.transcripts];
        updatedTranscripts[index] = value;
        setBrdgeData(prev => ({ ...prev, transcripts: updatedTranscripts }));
        setIsTranscriptModified(true);
    };

    const handleSaveTranscripts = async () => {
        try {
            setIsProcessing(true);

            // Format the transcripts data properly
            const transcriptsData = {
                image_transcripts: brdgeData.transcripts.map((transcript, index) => ({
                    slide_number: index + 1,
                    transcript: transcript || ''
                }))
            };

            await api.put(`/brdges/${id}/transcripts/aligned`, transcriptsData);
            setIsTranscriptModified(false);
            setCompletedSteps(prev => ({ ...prev, transcriptsSaved: true }));
            showSnackbar('Transcripts saved successfully.', 'success');
        } catch (error) {
            console.error('Error saving transcripts:', error);
            showSnackbar(
                error.response?.data?.error || 'Error saving transcripts. Please try again.',
                'error'
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePlayPause = async () => {
        if (!brdgeData.transcripts[currentSlide - 1]) {
            showSnackbar('No transcript available for this slide.', 'warning');
            return;
        }

        if (isPlaying) {
            await tts.pause();
            setIsPlaying(false);
            return;
        }

        try {
            setIsProcessing(true);
            setTtsStatus('Generating audio...');

            // Buffer the audio using the hook
            await tts.buffer({
                model_id: "sonic-english",
                voice: {
                    mode: "id",
                    id: CARTESIA_VOICE_ID,
                },
                transcript: brdgeData.transcripts[currentSlide - 1],
            });

            // Play the buffered audio
            await tts.play();
            setIsPlaying(true);
            setTtsStatus('Playing...');

        } catch (error) {
            console.error('Error playing audio:', error);
            showSnackbar('Error playing audio. Please try again.', 'error');
            setTtsStatus('Error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    // Update the formatTime function
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const renderSlides = () => {
        const imageUrl = `${api.defaults.baseURL}/brdges/${id}/slides/${currentSlide}`;
        return (
            <Card variant="outlined" sx={{ mb: 4 }}>
                <CardHeader
                    title={`Slide ${currentSlide}`}
                    subheader={tts.bufferStatus !== 'inactive' ? 'Buffering audio...' : null}
                />
                <CardContent>
                    <Box sx={{ textAlign: 'center' }}>
                        <CardMedia
                            component="img"
                            image={imageUrl}
                            alt={`Slide ${currentSlide}`}
                            sx={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: { xs: 300, md: 500 },
                                objectFit: 'contain',
                                backgroundColor: 'background.paper',
                            }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/600x400?text=No+Slide+Available';
                            }}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            label={`Transcript for Slide ${currentSlide}`}
                            multiline
                            fullWidth
                            minRows={4}
                            variant="outlined"
                            value={brdgeData.transcripts[currentSlide - 1] || ''}
                            onChange={(e) => handleTranscriptChange(currentSlide - 1, e.target.value)}
                            placeholder={brdgeData.transcripts.length === 0 ? 'Transcripts not available yet. Generate them first.' : `Enter transcript for slide ${currentSlide}...`}
                            disabled={brdgeData.transcripts.length === 0}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <IconButton
                            onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 1))}
                            disabled={currentSlide === 1}
                            aria-label="Previous Slide"
                        >
                            <FaChevronLeft />
                        </IconButton>
                        <IconButton
                            onClick={handlePlayPause}
                            disabled={tts.bufferStatus === 'buffering'}
                            aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
                        >
                            {tts.bufferStatus === 'buffering' ? (
                                <CircularProgress size={24} />
                            ) : isPlaying ? (
                                <FaPause />
                            ) : (
                                <FaPlay />
                            )}
                        </IconButton>
                        <IconButton
                            onClick={() => setCurrentSlide(prev => Math.min(prev + 1, brdgeData.numSlides))}
                            disabled={currentSlide === brdgeData.numSlides}
                            aria-label="Next Slide"
                        >
                            <FaChevronRight />
                        </IconButton>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    // Add this function to calculate progress
    const calculateProgress = () => {
        const totalSteps = 4;
        const completedStepsCount = Object.values(completedSteps).filter(Boolean).length;
        return (completedStepsCount / totalSteps) * 100;
    };

    // Replace the renderWorkflow function with LinearProgress
    const renderProgress = () => (
        <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress variant="determinate" value={calculateProgress()} />
        </Box>
    );

    const renderToolbar = () => (
        <Paper elevation={3} sx={{ p: 2, borderRadius: theme.spacing(2) }}>
            {renderProgress()}
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Input Audio</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Record your walkthrough or upload an existing audio file to get started.
                    </Typography>
                    <StyledButton
                        onClick={handleRecordWalkthrough}
                        fullWidth
                        sx={{
                            mb: 1,
                            backgroundColor: isRecording ? theme.palette.error.main : theme.palette.primary.main,
                            color: 'white',
                            '&:hover': {
                                backgroundColor: isRecording ? theme.palette.error.dark : theme.palette.primary.dark,
                            },
                        }}
                        startIcon={isRecording ? <FaStop /> : <FaMicrophone />}
                    >
                        {isRecording ? `Stop Recording (${formatTime(recordingTime)})` : 'Record Walkthrough'}
                    </StyledButton>
                    <StyledButton component="label" fullWidth variant="outlined">
                        Upload Audio
                        <input type="file" hidden accept="audio/*" onChange={handleUploadAudio} />
                    </StyledButton>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Transcripts</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Generate and edit transcripts for your audio.
                    </Typography>
                    <Tooltip title="Generate Transcripts">
                        <span>
                            <StyledButton
                                onClick={handleGenerateTranscripts}
                                fullWidth
                                disabled={!completedSteps.audioUploaded || isProcessing}
                                sx={{ mb: 1 }}
                            >
                                {isProcessing ? <CircularProgress size={20} /> : 'Generate Transcripts'}
                            </StyledButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Save Transcripts">
                        <span>
                            <StyledButton
                                onClick={handleSaveTranscripts}
                                fullWidth
                                disabled={!isTranscriptModified || isProcessing}
                                variant="outlined"
                            >
                                {isProcessing ? <CircularProgress size={20} /> : 'Save Transcripts'}
                            </StyledButton>
                        </span>
                    </Tooltip>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Output Audio</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Click the play button under each slide to hear the generated voice.
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="textSecondary">
                            TTS Status: {tts.playbackStatus} | Buffer: {tts.bufferStatus}
                        </Typography>
                        {tts.bufferStatus === 'buffering' && (
                            <LinearProgress
                                variant="indeterminate"
                                sx={{ mt: 1 }}
                            />
                        )}
                    </Box>
                    <Typography variant="body2" color="info.main">
                        Note: Audio is generated on-demand when you click play on each slide.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            {activeStep === 3 && (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    All steps completed. Your Brdge is ready!
                </Typography>
            )}
        </Paper>
    );

    const handleToggleShareable = async () => {
        try {
            const response = await api.post(`/brdges/${id}/toggle_shareable`);
            setBrdgeData(prev => ({ ...prev, isShareable: response.data.shareable }));
            if (response.data.shareable) {
                setShareableLink(`${window.location.origin}/b/${response.data.public_id}`);
            } else {
                setShareableLink('');
            }
            showSnackbar('Shareable status updated successfully.', 'success');
        } catch (error) {
            console.error('Error updating shareable status:', error);
            showSnackbar('Error updating shareable status.', 'error');
        }
    };

    const copyShareableLink = () => {
        navigator.clipboard.writeText(shareableLink);
        showSnackbar('Shareable link copied to clipboard!', 'success');
    };

    const renderHeader = () => (
        <Box sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Typography variant="h5">
                {brdgeData.name || 'Untitled Brdge'}
            </Typography>
            <Button
                variant="contained"
                onClick={handleSaveTranscripts}
                startIcon={<SaveIcon />}
                disabled={!isTranscriptModified}
            >
                Save Changes
            </Button>
        </Box>
    );

    const renderMainContent = () => (
        <Grid container spacing={2}>
            {/* Left Column - Slides */}
            <Grid item xs={12} md={8}>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Brdge Name"
                        value={brdgeData.name}
                        onChange={(e) => setBrdgeData(prev => ({ ...prev, name: e.target.value }))}
                    />
                </Box>
                <Paper sx={{ p: 2, mb: 2 }}>
                    {/* Slide Display */}
                    <CardMedia
                        component="img"
                        image={`${api.defaults.baseURL}/brdges/${id}/slides/${currentSlide}`}
                        alt={`Slide ${currentSlide}`}
                        sx={{ maxHeight: 400, objectFit: 'contain' }}
                    />
                    {/* Slide Controls */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 2,
                        borderTop: 1,
                        borderBottom: 1,
                        borderColor: 'divider',
                        py: 1
                    }}>
                        <IconButton onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 1))}>
                            <FaChevronLeft />
                        </IconButton>
                        <IconButton onClick={handlePlayPause}>
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </IconButton>
                        <IconButton onClick={() => setCurrentSlide(prev => Math.min(prev + 1, brdgeData.numSlides))}>
                            <FaChevronRight />
                        </IconButton>
                    </Box>
                    {/* Transcript Area */}
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            label={isRecording ? "Live Transcription" : "Transcript"}
                            value={isRecording ? liveTranscript : (brdgeData.transcripts[currentSlide - 1] || '')}
                            onChange={(e) => {
                                if (!isRecording) {
                                    handleTranscriptChange(currentSlide - 1, e.target.value);
                                }
                            }}
                            disabled={isRecording}
                            placeholder={isRecording ? "Speaking..." : "Enter transcript..."}
                            sx={{
                                '& .MuiInputBase-input': {
                                    color: isRecording ? theme.palette.primary.main : 'inherit',
                                    fontWeight: isRecording ? 500 : 400,
                                    lineHeight: '1.5',
                                    transition: 'all 0.2s ease',
                                },
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: isRecording ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                                    transition: 'all 0.3s ease',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: isRecording ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.23)',
                                    borderWidth: isRecording ? 2 : 1,
                                },
                                '& .MuiInputBase-root': {
                                    maxHeight: '300px',  // Increased height
                                    overflow: 'auto',
                                    scrollBehavior: 'smooth',
                                },
                            }}
                            InputProps={{
                                endAdornment: isRecording && (
                                    <InputAdornment position="end">
                                        <CircularProgress size={20} color="primary" />
                                    </InputAdornment>
                                ),
                                // Auto-scroll to bottom
                                inputRef: (input) => {
                                    if (input && isRecording) {
                                        setTimeout(() => {
                                            input.scrollTop = input.scrollHeight;
                                        }, 100);
                                    }
                                },
                            }}
                        />
                        {isRecording && (
                            <Typography
                                variant="caption"
                                color="primary"
                                sx={{
                                    display: 'block',
                                    mt: 1,
                                    textAlign: 'right',
                                    animation: 'pulse 1.5s infinite',
                                    '@keyframes pulse': {
                                        '0%': { opacity: 0.6 },
                                        '50%': { opacity: 1 },
                                        '100%': { opacity: 0.6 },
                                    },
                                }}
                            >
                                Recording in progress...
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Grid>

            {/* Right Column - Controls */}
            <Grid item xs={12} md={4}>
                {/* Record Button */}
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleRecordWalkthrough}
                    startIcon={isRecording ? <FaStop /> : <FaMicrophone />}
                    sx={{ mb: 2 }}
                >
                    {isRecording ? 'Stop Recording' : 'Record Walkthrough'}
                </Button>

                {/* Settings Card */}
                <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>Settings</Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={brdgeData.isShareable}
                                onChange={handleToggleShareable}
                            />
                        }
                        label="Make it shareable (public)"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={voiceId === CARTESIA_VOICE_ID}
                                onChange={(e) => setVoiceId(e.target.checked ? CARTESIA_VOICE_ID : '')}
                            />
                        }
                        label="Clone voice by default"
                    />
                </Paper>

                {/* Agent Config */}
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Agent Config</Typography>
                    <Tabs
                        value={activeTab}
                        onChange={(e, newValue) => setActiveTab(newValue)}
                        variant="fullWidth"
                    >
                        <Tab icon={<QuestionAnswerIcon />} label="Questions" />
                        <Tab icon={<SettingsIcon />} label="Settings" />
                        <Tab icon={<MenuBookIcon />} label="Knowledge" />
                    </Tabs>
                    <Box sx={{ mt: 2 }}>
                        {activeTab === 0 && (
                            <Typography>
                                Configure questions for users to answer
                            </Typography>
                        )}
                        {activeTab === 1 && (
                            <Typography>
                                Configure agent settings
                            </Typography>
                        )}
                        {activeTab === 2 && (
                            <Typography>
                                Configure knowledge base
                            </Typography>
                        )}
                    </Box>
                </Paper>

                {/* Bridge Icon */}
                <Box sx={{
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Avatar
                        sx={{
                            width: 60,
                            height: 60,
                            bgcolor: theme.palette.primary.main
                        }}
                    >
                        B
                    </Avatar>
                </Box>
            </Grid>
        </Grid>
    );

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Paper sx={{ overflow: 'hidden' }}>
                {renderHeader()}
                <Box sx={{ p: 2 }}>
                    {renderMainContent()}
                </Box>
            </Paper>

            {/* Keep existing dialogs */}
            <Dialog
                open={isRecordingDialogOpen}
                onClose={() => {
                    if (!isRecording) {
                        setIsRecordingDialogOpen(false);
                        clearInterval(countdownIntervalRef.current);
                        setCountdown(3);
                    }
                }}
                aria-labelledby="recording-dialog-title"
            >
                <DialogContent>
                    {countdown > 0 ? (
                        <Typography variant="h4" align="center">
                            Recording starts in {countdown}...
                        </Typography>
                    ) : (
                        <Box>
                            <Typography variant="h6" align="center">
                                Recording in progress...
                            </Typography>
                            {isRecording && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<FaStop />}
                                        onClick={stopRecording}
                                    >
                                        Stop Recording
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                }}
                open={countdown > 0}
            >
                <Typography variant="h2">
                    {countdown}
                </Typography>
                <Typography variant="h5">
                    Get ready to record...
                </Typography>
            </Backdrop>
        </Container>
    );
}

export default EditBrdgePage;