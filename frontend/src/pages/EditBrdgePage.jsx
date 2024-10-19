import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MicRecorder from 'mic-recorder-to-mp3';
import {
    Grid, Card, CardHeader, CardContent, CardMedia, Typography, Button, TextField, Box,
    Stepper, Step, StepLabel, CircularProgress, Paper, Switch, FormControlLabel, IconButton, Dialog, DialogContent, DialogContentText, Backdrop, Tooltip, styled, LinearProgress, Accordion, AccordionSummary, AccordionDetails, InputAdornment, useTheme, useMediaQuery, Container
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
                    if (prev === 1) {
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

    const startRecording = () => {
        mp3Recorder.current
            .start()
            .then(() => {
                setIsRecording(true);
                showSnackbar('Recording started...', 'info');
                recordingIntervalRef.current = setInterval(() => {
                    setRecordingTime((prevTime) => prevTime + 1);
                }, 1000);
            })
            .catch((error) => {
                console.error('Error starting recording:', error);
                showSnackbar('Microphone access is required to record audio.', 'error');
            });
    };

    const stopRecording = () => {
        mp3Recorder.current
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                const audioFile = new File(buffer, 'walkthrough_recording.mp3', {
                    type: blob.type,
                    lastModified: Date.now(),
                });
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
            await api.put(`/brdges/${id}/transcripts/aligned`, { transcripts: brdgeData.transcripts });
            setIsTranscriptModified(false);
            setCompletedSteps(prev => ({ ...prev, transcriptsSaved: true }));
            showSnackbar('Transcripts saved successfully.', 'success');
        } catch (error) {
            console.error('Error saving transcripts:', error);
            showSnackbar('Error saving transcripts.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleGenerateVoice = async () => {
        try {
            setIsProcessing(true);
            if (!brdgeData.transcripts || brdgeData.transcripts.length === 0) {
                showSnackbar('No transcripts available. Please generate transcripts first.', 'warning');
                return;
            }

            let usedVoiceId = voiceId;

            if (!usedVoiceId) {
                console.log('Cloning voice');
                const cloneResponse = await api.post(`/brdges/${id}/audio/clone_voice`, {}, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Response from clone voice:', cloneResponse.data);

                if (!cloneResponse.data || !cloneResponse.data.voice_id) {
                    showSnackbar('Failed to clone voice. Please try again or provide a voice ID.', 'error');
                    return;
                }

                usedVoiceId = cloneResponse.data.voice_id;
            }

            console.log('Sending request to generate voice');

            const generateResponse = await api.post(`/brdges/${id}/audio/generate_voice`, { voice_id: usedVoiceId }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response from generate voice:', generateResponse.data);

            if (generateResponse.data && generateResponse.data.message) {
                showSnackbar(generateResponse.data.message, 'success');
                await fetchGeneratedAudioFiles();
                setCompletedSteps(prev => ({ ...prev, voiceGenerated: true }));
                setActiveStep(prev => Math.max(prev, 3));
            } else {
                showSnackbar('Unexpected response from voice generation.', 'warning');
            }
        } catch (error) {
            console.error('Error generating voice:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
            showSnackbar(`Error generating voice: ${error.response?.data?.message || error.message}`, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(error => {
                    console.error('Error playing audio:', error);
                    showSnackbar('Error playing audio. Please try again.', 'error');
                });
            }
            setIsPlaying(!isPlaying);
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
                <CardHeader title={`Slide ${currentSlide}`} />
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
                                console.error(`Error loading slide ${currentSlide}`);
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
                        <IconButton onClick={handlePlayPause} aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}>
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </IconButton>
                        <IconButton
                            onClick={() => setCurrentSlide(prev => Math.min(prev + 1, brdgeData.numSlides))}
                            disabled={currentSlide === brdgeData.numSlides}
                            aria-label="Next Slide"
                        >
                            <FaChevronRight />
                        </IconButton>
                    </Box>
                    {currentAudio && (
                        <Box sx={{ mt: 2 }}>
                            <input
                                type="range"
                                min={0}
                                max={audioDuration}
                                value={currentTime}
                                onChange={handleSeek}
                                style={{ width: '100%' }}
                            />
                            <Typography variant="caption" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(audioDuration)}</span>
                            </Typography>
                        </Box>
                    )}
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
                        Generate voice output based on your transcripts.
                    </Typography>
                    <TextField
                        label="Voice ID (optional)"
                        variant="outlined"
                        fullWidth
                        value={voiceId}
                        onChange={(e) => setVoiceId(e.target.value)}
                        sx={{ mb: 1 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="Enter a specific voice ID or leave blank for default">
                                        <HelpOutlineIcon color="action" />
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Tooltip title="Generate Voice">
                        <span>
                            <StyledButton
                                onClick={handleGenerateVoice}
                                fullWidth
                                disabled={isProcessing}
                            >
                                {isProcessing ? <CircularProgress size={20} /> : 'Generate Voice'}
                            </StyledButton>
                        </span>
                    </Tooltip>
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

    return (
        <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <StyledCard sx={{ p: { xs: 2, md: 4 } }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        Edit Brdge
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mb: 2 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={brdgeData.isShareable}
                                    onChange={handleToggleShareable}
                                    name="shareable"
                                    color="primary"
                                />
                            }
                            label="Make Brdge Shareable"
                        />
                        {brdgeData.isShareable && shareableLink && (
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: isMobile ? 0 : 2, mt: isMobile ? 2 : 0, width: isMobile ? '100%' : 'auto' }}>
                                <TextField
                                    value={shareableLink}
                                    variant="outlined"
                                    size="small"
                                    fullWidth={isMobile}
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LinkIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mr: 1 }}
                                />
                                <IconButton onClick={copyShareableLink} size="small">
                                    <ContentCopyIcon />
                                </IconButton>
                            </Box>
                        )}
                    </Box>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={8}>
                            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    label="Brdge Name"
                                    variant="outlined"
                                    fullWidth
                                    value={brdgeData.name}
                                    onChange={(e) => setBrdgeData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                                <StyledButton variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                                    Upload New Presentation (PDF)
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        hidden
                                        onChange={(e) => setPresentation(e.target.files[0])}
                                    />
                                </StyledButton>
                                {!presentation && (
                                    <Typography variant="body2" color="textSecondary">
                                        Current presentation will be used if no new file is selected.
                                    </Typography>
                                )}
                                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                    <StyledButton
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={isProcessing}
                                        startIcon={isProcessing ? <CircularProgress size={20} /> : <SaveIcon />}
                                    >
                                        {isProcessing ? 'Updating...' : 'Update Brdge'}
                                    </StyledButton>
                                    <StyledButton
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => navigate(-1)}
                                    >
                                        Cancel
                                    </StyledButton>
                                </Box>
                            </Box>
                            {brdgeData.numSlides > 0 && renderSlides()}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            {renderToolbar()}
                        </Grid>
                    </Grid>
                </StyledCard>
            </Container>

            {/* Audio Element */}
            {currentAudio && (
                <audio
                    ref={audioRef}
                    src={currentAudio}
                    onLoadedMetadata={(e) => setAudioDuration(e.target.duration)}
                    onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                    onEnded={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onError={(e) => {
                        console.error('Audio error:', e);
                        showSnackbar('Error loading audio. Please try again.', 'error');
                    }}
                />
            )}

            {/* Recording Countdown Dialog */}
            <Dialog
                open={isRecordingDialogOpen}
                onClose={() => { if (!isRecording) setIsRecordingDialogOpen(false); }}
                aria-labelledby="recording-dialog-title"
                aria-describedby="recording-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="recording-dialog-description">
                        {countdown > 0 ? `Recording starts in ${countdown}...` : 'Recording in progress...'}
                    </DialogContentText>
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
                </DialogContent>
            </Dialog>

            {/* Backdrop for Graying Out Screen During Countdown */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isRecordingDialogOpen && countdown > 0}
            >
                <Typography variant="h4">{`Recording starts in ${countdown}`}</Typography>
            </Backdrop>
        </Box>
    );
}

export default EditBrdgePage;