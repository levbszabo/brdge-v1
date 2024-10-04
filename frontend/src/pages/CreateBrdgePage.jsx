// CreateBrdgePage.jsx

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import MicRecorder from 'mic-recorder-to-mp3';
import {
    FaPlay,
    FaPause,
    FaChevronLeft,
    FaChevronRight,
    FaShareAlt,
} from 'react-icons/fa';
import {
    Grid,
    Card,
    CardHeader,
    CardContent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Button,
    TextField,
    Box,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    IconButton,
    Tooltip,
    CircularProgress,
    Snackbar,
    Alert,
    Collapse,
    Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import { styled } from '@mui/material/styles';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    '&:before': {
        display: 'none',
    },
    '&.Mui-expanded': {
        margin: theme.spacing(1, 0),
    },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],
    '&.Mui-expanded': {
        minHeight: 48,
    },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

function CreateBrdgePage() {
    // State variables
    const [name, setName] = useState('');
    const [presentation, setPresentation] = useState(null);
    const [brdgeId, setBrdgeId] = useState(null);
    const [numSlides, setNumSlides] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [transcripts, setTranscripts] = useState([]);
    const [message, setMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [showCountdown, setShowCountdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [existingAudioUrl, setExistingAudioUrl] = useState(null);
    const [newAudioName, setNewAudioName] = useState('');
    const [isRenaming, setIsRenaming] = useState(false);
    const [loadingOverlay, setLoadingOverlay] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [transcriptsGenerated, setTranscriptsGenerated] = useState(false);
    const [voiceCloneGenerated, setVoiceCloneGenerated] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);
    const audioRef = useRef(null);
    const [generatedAudioFiles, setGeneratedAudioFiles] = useState([]);
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isTranscriptModified, setIsTranscriptModified] = useState(false); // Tracks transcript changes
    const [voiceId, setVoiceId] = useState(''); // Stores the voice ID input by the user
    const [deployLink, setDeployLink] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isAudioLoaded, setIsAudioLoaded] = useState(false);
    const [isAudioUploaded, setIsAudioUploaded] = useState(false);
    const [expandedStep, setExpandedStep] = useState(0);

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    // Initialize MicRecorder
    const mp3Recorder = useRef(new MicRecorder({ bitRate: 128 }));

    // Modify this useEffect to check for existing audio when the component mounts
    useEffect(() => {
        if (isEditMode) {
            fetchBrdgeData();
        }
    }, [id, isEditMode]);

    const fetchBrdgeData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/brdges/${id}`);
            const brdge = response.data;
            console.log('Fetched brdge data:', brdge);
            setName(brdge.name);
            setBrdgeId(brdge.id);
            setNumSlides(brdge.num_slides);
            if (brdge.audio_filename) {
                const audioFileUrl = `http://localhost:5000/api/brdges/${brdge.id}/audio`;
                setExistingAudioUrl(audioFileUrl);
                setNewAudioName(brdge.audio_filename);
                setIsAudioUploaded(true); // Set this to true if audio exists
                setCurrentStep(1); // Move to the Transcripts step if audio exists
            }

            // Attempt to fetch aligned transcripts
            try {
                const transcriptsResponse = await axios.get(`http://localhost:5000/api/brdges/${id}/transcripts/aligned`);
                const alignedData = transcriptsResponse.data;
                const updatedTranscripts = alignedData.image_transcripts.map(item => item.transcript);
                setTranscripts(updatedTranscripts);
                setTranscriptsGenerated(true);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log('Aligned transcripts not found. They need to be generated.');
                    setTranscriptsGenerated(false); // Indicate that transcripts are not yet generated
                } else {
                    console.error('Error fetching aligned transcripts:', error);
                    showSnackbar('Error fetching aligned transcripts.', 'error');
                }
            }

        } catch (error) {
            console.error('Error fetching brdge data:', error);
            showSnackbar('Error loading brdge data.', 'error');
        }
    };

    useEffect(() => {
        if (brdgeId) {
            fetchGeneratedAudioFiles();
        }
    }, [brdgeId]);

    const fetchGeneratedAudioFiles = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/brdges/${brdgeId}/audio/generated`);
            setGeneratedAudioFiles(response.data.files);
            console.log('Fetched generated audio files:', response.data.files);
        } catch (error) {
            console.error('Error fetching generated audio files:', error);
            showSnackbar('Error fetching generated audio files.', 'error');
        }
    };

    // Snackbar for notifications
    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    // Function to handle deploying Brdge
    const handleDeployBrdge = () => {
        const link = `${window.location.origin}/viewBrdge/${brdgeId}`;
        setDeployLink(link);
        navigator.clipboard.writeText(link);
        showSnackbar('Brdge deployed! Link copied to clipboard.', 'success');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            showSnackbar('Please provide a name.', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);

        if (presentation) {
            formData.append('presentation', presentation);
        }

        try {
            setIsProcessing(true);
            let response;

            if (isEditMode) {
                // Update existing brdge
                response = await axios.put(`http://localhost:5000/api/brdges/${id}`, formData);
            } else {
                // Create new brdge
                response = await axios.post('http://localhost:5000/api/brdges', formData);
            }

            showSnackbar(response.data.message, 'success');
            const { brdge, num_slides } = response.data;
            setBrdgeId(brdge.id);
            setNumSlides(num_slides);
            setTranscripts(new Array(num_slides).fill('')); // Initialize transcripts array
            setIsProcessing(false);
        } catch (error) {
            console.error('Error saving brdge:', error);
            showSnackbar('Error saving brdge.', 'error');
            setIsProcessing(false);
        }
    };

    // Handle transcript input changes
    const handleTranscriptChange = (index, value) => {
        const updatedTranscripts = [...transcripts];
        updatedTranscripts[index] = value;
        setTranscripts(updatedTranscripts);
        setIsTranscriptModified(true); // Mark transcripts as modified
    };

    // Save updated transcripts to the backend
    const handleSaveTranscripts = async () => {
        setLoadingOverlay(true);
        setLoadingMessage('Saving transcripts...');
        try {
            await axios.put(
                `http://localhost:5000/api/brdges/${brdgeId}/transcripts/aligned`,
                { transcripts }
            );
            showSnackbar('Transcripts saved successfully.', 'success');
            setIsTranscriptModified(false);
        } catch (error) {
            console.error('Error saving transcripts:', error);
            showSnackbar('Error saving transcripts.', 'error');
        } finally {
            setTimeout(() => {
                setLoadingOverlay(false);
                setLoadingMessage('');
            }, 2000);
        }
    };

    const handleGenerateTranscripts = async () => {
        if (!existingAudioUrl) {
            showSnackbar('Please upload or record audio before generating transcripts.', 'warning');
            return;
        }

        setLoadingOverlay(true);
        setLoadingMessage('Generating and aligning transcripts...');

        try {
            // Step 1: Transcribe audio
            await axios.post(`http://localhost:5000/api/brdges/${brdgeId}/audio/transcribe`);

            // Step 2: Align transcript with slides
            const response = await axios.post(
                `http://localhost:5000/api/brdges/${brdgeId}/audio/align_transcript`
            );

            // Update the transcripts with aligned transcripts
            const alignedData = response.data;
            const updatedTranscripts = [];

            if (alignedData.image_transcripts && Array.isArray(alignedData.image_transcripts)) {
                alignedData.image_transcripts.sort((a, b) => a.image_number - b.image_number);
                for (let i = 1; i <= numSlides; i++) {
                    const slideData = alignedData.image_transcripts.find(
                        (item) => item.image_number === i
                    );
                    const slideTranscript = slideData ? slideData.transcript : '';
                    updatedTranscripts.push(slideTranscript);
                }
            } else {
                for (let i = 0; i < numSlides; i++) {
                    updatedTranscripts.push('');
                }
            }

            setTranscripts(updatedTranscripts);
            setTranscriptsGenerated(true);
            setCurrentStep(2); // Move to Voice Generation step
            showSnackbar('Transcripts generated and aligned successfully.', 'success');
        } catch (error) {
            console.error('Error generating transcripts:', error);
            if (error.response && error.response.status === 404) {
                showSnackbar('Transcripts not found. Please ensure audio is uploaded correctly.', 'error');
            } else {
                showSnackbar('Error generating transcripts.', 'error');
            }
        } finally {
            setLoadingOverlay(false);
            setLoadingMessage('');
        }
    };

    const handleGenerateVoiceClone = async () => {
        setLoadingOverlay(true);
        setLoadingMessage('Generating voice clone...');

        try {
            // Check if voice ID is provided
            if (voiceId) {
                // Skip voice cloning and proceed to generate voice
                await handleGenerateVoice();
            } else {
                // Clone voice first
                await axios.post(`http://localhost:5000/api/brdges/${brdgeId}/audio/clone_voice`);
                // Then generate voice
                await handleGenerateVoice();
            }
        } catch (error) {
            console.error('Error generating voice clone:', error);
            showSnackbar('Error generating voice clone.', 'error');
        } finally {
            setTimeout(() => {
                setLoadingOverlay(false);
                setLoadingMessage('');
            }, 2000);
        }
    };

    const handleGenerateVoice = async () => {
        setLoadingOverlay(true);
        setLoadingMessage('Generating voice...');

        try {
            const response = await axios.post(
                `http://localhost:5000/api/brdges/${brdgeId}/audio/generate_voice`,
                { voice_id: voiceId } // Include voice ID if provided
            );

            // Fetch the list of generated audio files
            const audioFilesResponse = await axios.get(
                `http://localhost:5000/api/brdges/${brdgeId}/audio/generated`
            );
            console.log('Received audio files:', audioFilesResponse.data.files);
            setGeneratedAudioFiles(audioFilesResponse.data.files);

            setVoiceCloneGenerated(true);
            showSnackbar('Voice generated successfully.', 'success');
        } catch (error) {
            console.error('Error generating voice:', error);
            showSnackbar('Error generating voice.', 'error');
        } finally {
            setTimeout(() => {
                setLoadingOverlay(false);
                setLoadingMessage('');
            }, 2000);
        }
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
        if (option === 'record') {
            startCountdown();
        } else if (option === 'upload') {
            // Open the file input dialog
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'audio/*';
            fileInput.onchange = (e) => handleUploadAudio(e);
            fileInput.click();
        }
    };

    const handleRecordWalkthrough = () => {
        setSelectedOption('record');
        startCountdown();
    };

    const startCountdown = () => {
        setCountdown(3);
        setShowCountdown(true);
        const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(countdownInterval);
                    setShowCountdown(false);
                    startRecording();
                }
                return prev - 1;
            });
        }, 1000);
    };

    const startRecording = () => {
        mp3Recorder.current
            .start()
            .then(() => {
                setIsRecording(true);
                setCurrentSlide(1); // Start from slide 1
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
                setRecordedAudio(audioFile);
                setAudioUrl(URL.createObjectURL(blob));
                setIsRecording(false);
                handleUploadAudio({ target: { files: [audioFile] } });
            })
            .catch((e) => {
                console.error('Error stopping recording:', e);
                setIsRecording(false);
                showSnackbar('Error stopping recording.', 'error');
            });
    };

    const handleNextSlide = () => {
        if (currentSlide < numSlides) {
            setCurrentSlide((prevSlide) => {
                const nextSlide = prevSlide + 1;
                loadAudioForSlide(nextSlide, true);
                return nextSlide;
            });
        }
    };

    const handlePrevSlide = () => {
        if (currentSlide > 1) {
            setCurrentSlide((prevSlide) => {
                const prevSlideNumber = prevSlide - 1;
                loadAudioForSlide(prevSlideNumber, true);
                return prevSlideNumber;
            });
        }
    };

    const handleReplaceAudio = () => {
        // Reset the audio state
        setExistingAudioUrl(null);
        setRecordedAudio(null);
        setAudioUrl(null);
        setNewAudioName('');

        // Open the file input dialog
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'audio/*';
        fileInput.onchange = (e) => handleUploadAudio(e);
        fileInput.click();
    };

    const handleDeleteAudio = async () => {
        if (!brdgeId) return;

        try {
            await axios.delete(`http://localhost:5000/api/brdges/${brdgeId}/audio`);
            showSnackbar('Audio deleted successfully.', 'success');
            setExistingAudioUrl(null);
            setNewAudioName('');
        } catch (error) {
            console.error('Error deleting audio:', error);
            showSnackbar('Error deleting audio.', 'error');
        }
    };

    const handleUploadAudio = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setRecordedAudio(file);
            setAudioUrl(URL.createObjectURL(file));
            setNewAudioName(file.name);

            const formData = new FormData();
            formData.append('audio', file);

            try {
                await axios.post(`http://localhost:5000/api/brdges/${brdgeId}/audio`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                showSnackbar('Audio uploaded successfully.', 'success');
                setExistingAudioUrl(`http://localhost:5000/api/brdges/${brdgeId}/audio`);
                setIsAudioUploaded(true);
                setCurrentStep(1); // Move to the Transcripts step
            } catch (error) {
                console.error('Error uploading audio:', error);
                showSnackbar('Error uploading audio.', 'error');
            }
        }
    };

    const handleRenameAudio = () => {
        setIsRenaming(true);
    };

    const handleSaveAudioName = async () => {
        if (!brdgeId || !newAudioName) return;

        try {
            await axios.put(`http://localhost:5000/api/brdges/${brdgeId}/audio/rename`, {
                new_name: newAudioName,
            });
            showSnackbar('Audio renamed successfully.', 'success');
            setIsRenaming(false);
        } catch (error) {
            console.error('Error renaming audio:', error);
            showSnackbar('Error renaming audio.', 'error');
        }
    };

    const handleFinishRecording = () => {
        stopRecording();
    };

    const loadAudioForSlide = (slideNumber, autoplay = false) => {
        console.log(`Loading audio for slide ${slideNumber}`);
        console.log(`Generated audio files:`, generatedAudioFiles);

        if (generatedAudioFiles.length >= slideNumber) {
            const audioFile = generatedAudioFiles[slideNumber - 1];
            console.log(`Selected audio file: ${audioFile}`);
            const audioUrl = `http://localhost:5000/api/brdges/${brdgeId}/audio/generated/${audioFile}`;
            console.log(`Audio URL: ${audioUrl}`);
            setCurrentAudio(audioUrl);
            setIsAudioLoaded(false);

            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.load();

                if (autoplay) {
                    const playPromise = audioRef.current.play();
                    if (playPromise !== undefined) {
                        playPromise
                            .then(() => {
                                setIsPlaying(true);
                                console.log('Audio started playing');
                            })
                            .catch((error) => {
                                console.error('Error playing audio:', error);
                            });
                    }
                } else {
                    setIsPlaying(false);
                }
            }
        } else {
            console.log(`No audio file for slide ${slideNumber}`);
            setCurrentAudio(null);
            setIsPlaying(false);
        }
    };

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsPlaying(true);
                            console.log('Audio started playing');
                        })
                        .catch((error) => {
                            console.error('Error playing audio:', error);
                        });
                }
            }
        }
    };

    useEffect(() => {
        if (generatedAudioFiles.length > 0) {
            loadAudioForSlide(currentSlide);
        }
    }, [generatedAudioFiles, currentSlide]);

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    useEffect(() => {
        if (currentAudio && audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch((error) => {
                    console.error('Error playing audio:', error);
                    setIsPlaying(false);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentAudio]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
        if (currentSlide < numSlides) {
            handleNextSlide();
        }
    };

    // Define steps for Stepper
    const steps = ['Audio', 'Transcripts', 'Voice Generation'];
    const [currentStep, setCurrentStep] = useState(0); // Track current step

    const handleStepChange = (step) => {
        setExpandedStep(expandedStep === step ? -1 : step);
    };

    const renderSlides = () => {
        const imageUrl = `http://localhost:5000/api/brdges/${brdgeId}/slides/${currentSlide}`;
        return (
            <Card variant="outlined" sx={{ mb: 4 }}>
                <CardHeader title={`Slide ${currentSlide}`} />
                <CardContent>
                    <Box sx={{ textAlign: 'center' }}>
                        <img
                            src={imageUrl}
                            alt={`Slide ${currentSlide}`}
                            style={{ maxWidth: '100%', maxHeight: '400px' }}
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
                            value={transcripts[currentSlide - 1] || ''}
                            onChange={(e) => handleTranscriptChange(currentSlide - 1, e.target.value)}
                            placeholder={`Enter transcript for slide ${currentSlide}...`}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<FaChevronLeft />}
                            onClick={handlePrevSlide}
                            disabled={currentSlide === 1}
                        >
                            Previous
                        </Button>
                        {currentAudio && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={isPlaying ? <FaPause /> : <FaPlay />}
                                onClick={handlePlayPause}
                            >
                                {isPlaying ? 'Pause' : 'Play'}
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            endIcon={<FaChevronRight />}
                            onClick={handleNextSlide}
                            disabled={currentSlide === numSlides}
                        >
                            Next
                        </Button>
                    </Box>
                    {currentAudio && (
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                type="range"
                                inputProps={{ min: 0, max: audioDuration, step: 1 }}
                                value={currentTime}
                                onChange={handleSeek}
                                fullWidth
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption">{formatTime(currentTime)}</Typography>
                                <Typography variant="caption">{formatTime(audioDuration)}</Typography>
                            </Box>
                        </Box>
                    )}
                </CardContent>
            </Card>
        );
    };

    const renderWorkflow = () => {
        return (
            <Paper elevation={3} sx={{ ml: 4, p: 2, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Workflow
                </Typography>
                <Stepper orientation="vertical" activeStep={currentStep}>
                    {/* Step 1: Audio */}
                    <Step key="Audio" completed={isAudioUploaded}>
                        <StepLabel onClick={() => handleStepChange(0)}>Audio</StepLabel>
                        <StepContent TransitionComponent={Collapse} TransitionProps={{ unmountOnExit: true }}>
                            <StyledAccordion expanded={expandedStep === 0} onChange={() => handleStepChange(0)}>
                                <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>Manage Audio</Typography>
                                </StyledAccordionSummary>
                                <StyledAccordionDetails>
                                    {existingAudioUrl ? (
                                        <Box>
                                            <audio controls src={existingAudioUrl} style={{ width: '100%' }}></audio>
                                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleReplaceAudio}
                                                >
                                                    Replace
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={handleDeleteAudio}
                                                >
                                                    Delete
                                                </Button>
                                                {isRenaming ? (
                                                    <>
                                                        <TextField
                                                            label="New Audio Name"
                                                            value={newAudioName}
                                                            onChange={(e) => setNewAudioName(e.target.value)}
                                                            variant="outlined"
                                                        />
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            onClick={handleSaveAudioName}
                                                            startIcon={<SaveIcon />}
                                                        >
                                                            Save
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        variant="contained"
                                                        color="warning"
                                                        onClick={handleRenameAudio}
                                                    >
                                                        Rename
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleOptionChange('upload')}
                                            >
                                                Upload Audio
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={handleRecordWalkthrough}
                                            >
                                                Record Walkthrough
                                            </Button>
                                        </Box>
                                    )}
                                </StyledAccordionDetails>
                            </StyledAccordion>
                        </StepContent>
                    </Step>

                    {/* Step 2: Transcripts */}
                    <Step key="Transcripts" completed={transcriptsGenerated}>
                        <StepLabel onClick={() => handleStepChange(1)}>Transcripts</StepLabel>
                        <StepContent TransitionComponent={Collapse} TransitionProps={{ unmountOnExit: true }}>
                            <StyledAccordion expanded={expandedStep === 1} onChange={() => handleStepChange(1)}>
                                <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>Manage Transcripts</Typography>
                                </StyledAccordionSummary>
                                <StyledAccordionDetails>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleGenerateTranscripts}
                                        disabled={!isAudioUploaded}
                                    >
                                        Generate Transcripts
                                    </Button>
                                    {transcriptsGenerated && (
                                        <Box sx={{ mt: 2 }}>
                                            {/* Transcript editing UI */}
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<SaveIcon />}
                                                onClick={handleSaveTranscripts}
                                                disabled={!isTranscriptModified}
                                            >
                                                Save Transcripts
                                            </Button>
                                        </Box>
                                    )}
                                </StyledAccordionDetails>
                            </StyledAccordion>
                        </StepContent>
                    </Step>

                    {/* Step 3: Voice Generation */}
                    <Step key="Voice Generation" completed={voiceCloneGenerated}>
                        <StepLabel onClick={() => handleStepChange(2)}>Voice Generation</StepLabel>
                        <StepContent TransitionComponent={Collapse} TransitionProps={{ unmountOnExit: true }}>
                            <StyledAccordion expanded={expandedStep === 2} onChange={() => handleStepChange(2)}>
                                <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>Manage Voice Generation</Typography>
                                </StyledAccordionSummary>
                                <StyledAccordionDetails>
                                    <Box sx={{ mb: 2 }}>
                                        <TextField
                                            label="Voice ID (optional)"
                                            variant="outlined"
                                            fullWidth
                                            value={voiceId}
                                            onChange={(e) => setVoiceId(e.target.value)}
                                            placeholder="Enter voice ID for voice generation"
                                        />
                                    </Box>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleGenerateVoiceClone}
                                        disabled={!transcriptsGenerated}
                                    >
                                        Generate Voice
                                    </Button>
                                </StyledAccordionDetails>
                            </StyledAccordion>
                        </StepContent>
                    </Step>
                </Stepper>
            </Paper>
        );
    };

    return (
        <Grid container justifyContent="center" sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
            <Grid item xs={12} md={10} lg={8}>
                <Card sx={{ p: 4, position: 'relative' }}>
                    <Typography variant="h4" gutterBottom>
                        {isEditMode ? 'Edit Brdge' : 'Create New Brdge'}
                    </Typography>
                    {message && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            {message}
                        </Alert>
                    )}

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            {/* Brdge creation form */}
                            {!brdgeId && (
                                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField
                                        label="Brdge Name"
                                        variant="outlined"
                                        fullWidth
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <Button variant="contained" component="label">
                                        Upload Presentation (PDF)
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            hidden
                                            onChange={(e) => setPresentation(e.target.files[0])}
                                        />
                                    </Button>
                                    {isEditMode && !presentation && (
                                        <Typography variant="body2" color="textSecondary">
                                            Current presentation will be used if no new file is selected.
                                        </Typography>
                                    )}
                                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={isProcessing}
                                            startIcon={isProcessing && <CircularProgress size={20} />}
                                        >
                                            {isProcessing ? 'Processing...' : isEditMode ? 'Update Brdge' : 'Create Brdge'}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => navigate(-1)}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                </Box>
                            )}

                            {/* Display Slides and Transcripts */}
                            {brdgeId && numSlides > 0 && (
                                <>
                                    {renderSlides()}

                                    {/* Save Transcripts Button */}
                                    {isTranscriptModified && (
                                        <Box sx={{ mt: 2 }}>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={handleSaveTranscripts}
                                                startIcon={<SaveIcon />}
                                            >
                                                Save Changes
                                            </Button>
                                        </Box>
                                    )}

                                    {/* Regenerate Audio Button */}
                                    <Box sx={{ mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            onClick={handleGenerateVoiceClone}
                                            disabled={!transcriptsGenerated}
                                        >
                                            Regenerate Audio
                                        </Button>
                                    </Box>

                                    {/* Deploy Brdge Button */}
                                    <Box sx={{ mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="info"
                                            startIcon={<FaShareAlt />}
                                            onClick={handleDeployBrdge}
                                            disabled={generatedAudioFiles.length === 0}
                                        >
                                            Deploy Brdge
                                        </Button>
                                        {deployLink && (
                                            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                                                Shareable Link:{' '}
                                                <a href={deployLink} target="_blank" rel="noopener noreferrer">
                                                    {deployLink}
                                                </a>
                                            </Typography>
                                        )}
                                    </Box>
                                </>
                            )}
                        </Grid>

                        <Grid item xs={12} md={6}>
                            {/* Workflow steps */}
                            {brdgeId && renderWorkflow()}
                        </Grid>
                    </Grid>

                    {/* Loading Overlay */}
                    {loadingOverlay && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1300,
                            }}
                        >
                            <CircularProgress color="inherit" />
                            <Typography variant="h6" color="white" sx={{ mt: 2 }}>
                                {loadingMessage}
                            </Typography>
                        </Box>
                    )}

                    {/* Countdown Overlay */}
                    {showCountdown && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1400,
                            }}
                        >
                            <Typography variant="h1" color="white">
                                {countdown}
                            </Typography>
                        </Box>
                    )}

                    {/* Recording Indicator */}
                    {isRecording && (
                        <Box
                            sx={{
                                position: 'fixed',
                                top: 16,
                                right: 16,
                                backgroundColor: 'error.main',
                                color: 'white',
                                px: 3,
                                py: 1,
                                borderRadius: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                zIndex: 1500,
                            }}
                        >
                            <Typography variant="body1">Recording...</Typography>
                            <Button
                                variant="contained"
                                color="inherit"
                                size="small"
                                onClick={handleFinishRecording}
                            >
                                Stop
                            </Button>
                        </Box>
                    )}

                    {/* Audio Element */}
                    {currentAudio && (
                        <audio
                            ref={audioRef}
                            src={currentAudio}
                            onLoadedMetadata={(e) => setAudioDuration(e.target.duration)}
                            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                            onEnded={handleAudioEnded}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                        />
                    )}

                    {/* Snackbar for notifications */}
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </Card>
            </Grid>
        </Grid>
    );
}

export default CreateBrdgePage;