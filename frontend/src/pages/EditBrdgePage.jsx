import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MicRecorder from 'mic-recorder-to-mp3';
import {
    Grid, Card, CardHeader, CardContent, CardMedia, Typography, Button, TextField, Box,
    Stepper, Step, StepLabel, CircularProgress, Paper, Switch, FormControlLabel, IconButton, Dialog, DialogContent, DialogContentText, Backdrop, Tooltip, styled
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FaPlay, FaPause, FaChevronLeft, FaChevronRight, FaStop } from 'react-icons/fa';
import { api } from '../api';
import { useSnackbar } from '../utils/snackbar';

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

function EditBrdgePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

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
                transcripts: [], // Initialize as empty, will set after fetching aligned transcripts
                generatedAudioFiles: data.generated_audio_files || []
            });
            setIsAudioUploaded(!!data.audio_filename);

            // Fetch aligned transcripts
            const transcriptsResponse = await api.get(`/brdges/${id}/transcripts/aligned`);
            if (transcriptsResponse.data && Array.isArray(transcriptsResponse.data.image_transcripts)) {
                const transcriptsArray = transcriptsResponse.data.image_transcripts.map(item => item.transcript);
                setBrdgeData(prev => ({
                    ...prev,
                    transcripts: transcriptsArray
                }));
            } else {
                console.warn('Unexpected transcript data format:', transcriptsResponse.data);
                showSnackbar('Unexpected transcript data format.', 'warning');
            }
        } catch (error) {
            console.error('Error fetching brdge data:', error);
            showSnackbar('Error loading brdge data.', 'error');
        }
    };

    const fetchGeneratedAudioFiles = async () => {
        try {
            const response = await api.get(`/brdges/${id}/audio/generated`);
            const urls = response.data.files.map(file =>
                `${api.defaults.baseURL}/brdges/${id}/audio/generated/${file}`
            );
            setAudioUrls(urls);
        } catch (err) {
            console.error('Error fetching generated audio files:', err);
            showSnackbar('Error fetching audio files.', 'error');
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
    };

    const startRecording = () => {
        mp3Recorder.current
            .start()
            .then(() => {
                setIsRecording(true);
                showSnackbar('Recording started...', 'info');
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
                showSnackbar('Recording stopped and uploaded successfully.', 'success');
            })
            .catch((e) => {
                console.error('Error stopping recording:', e);
                setIsRecording(false);
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
            const response = await api.post(`/brdges/${id}/audio/generate_voice`);
            if (response.data && response.data.message) {
                showSnackbar(response.data.message, 'success');
                // Fetch the updated list of generated audio files
                const audioFilesResponse = await api.get(`/brdges/${id}/audio/generated`);
                if (audioFilesResponse.data && Array.isArray(audioFilesResponse.data.files)) {
                    setBrdgeData(prev => ({ ...prev, generatedAudioFiles: audioFilesResponse.data.files }));
                    setCompletedSteps(prev => ({ ...prev, voiceGenerated: true }));
                    setActiveStep(prev => Math.max(prev, 3));
                } else {
                    showSnackbar('No generated audio files received.', 'warning');
                }
            } else {
                showSnackbar('No response from voice generation.', 'warning');
            }
        } catch (error) {
            console.error('Error generating voice:', error);
            showSnackbar('Error generating voice.', 'error');
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
                            placeholder={`Enter transcript for slide ${currentSlide}...`}
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
                            <Typography variant="caption">
                                {formatTime(currentTime)} / {formatTime(audioDuration)}
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        );
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const renderWorkflow = () => {
        const steps = ['Upload Audio', 'Generate Transcripts', 'Edit Transcripts', 'Generate Voice'];
        return (
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => {
                    const isCompleted = completedSteps[Object.keys(completedSteps)[index]];
                    return (
                        <Step key={label} completed={isCompleted}>
                            <CustomStepLabel completed={isCompleted ? true : undefined}>
                                {label}
                            </CustomStepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        );
    };

    return (
        <Grid container justifyContent="center" sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
            <Grid item xs={12} md={10} lg={8}>
                <Card sx={{ p: 4, position: 'relative' }}>
                    <Typography variant="h4" gutterBottom>Edit Brdge</Typography>
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
                                <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                                    Upload New Presentation (PDF)
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        hidden
                                        onChange={(e) => setPresentation(e.target.files[0])}
                                    />
                                </Button>
                                {!presentation && (
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
                                        startIcon={isProcessing ? <CircularProgress size={20} /> : <SaveIcon />}
                                    >
                                        {isProcessing ? 'Updating...' : 'Update Brdge'}
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
                            {brdgeData.numSlides > 0 && renderSlides()}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                {renderWorkflow()}
                                <Box sx={{ mt: 2 }}>
                                    <Button onClick={handleRecordWalkthrough} fullWidth sx={{ mb: 1 }}>
                                        Record Walkthrough
                                    </Button>
                                    <Button component="label" fullWidth>
                                        Upload Audio
                                        <input type="file" hidden accept="audio/*" onChange={handleUploadAudio} />
                                    </Button>
                                    <Tooltip title="Generate Transcripts">
                                        <span>
                                            <Button
                                                onClick={handleGenerateTranscripts}
                                                fullWidth
                                                disabled={!completedSteps.audioUploaded || isProcessing}
                                            >
                                                {isProcessing ? <CircularProgress size={20} /> : 'Generate Transcripts'}
                                            </Button>
                                        </span>
                                    </Tooltip>
                                    <Tooltip title="Save Transcripts">
                                        <span>
                                            <Button
                                                onClick={handleSaveTranscripts}
                                                fullWidth
                                                disabled={!isTranscriptModified || isProcessing}
                                                sx={{ mb: 1 }}
                                            >
                                                {isProcessing ? <CircularProgress size={20} /> : 'Save Transcripts'}
                                            </Button>
                                        </span>
                                    </Tooltip>
                                    <Tooltip title="Generate Voice">
                                        <span>
                                            <Button
                                                onClick={handleGenerateVoice}
                                                fullWidth
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? <CircularProgress size={20} /> : 'Generate Voice'}
                                            </Button>
                                        </span>
                                    </Tooltip>
                                    {activeStep === 3 && (
                                        <Typography variant="body2" color="textSecondary">
                                            All steps completed.
                                        </Typography>
                                    )}
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={brdgeData.isShareable}
                                onChange={async () => {
                                    try {
                                        const response = await api.post(`/brdges/${id}/toggle_shareable`);
                                        setBrdgeData(prev => ({ ...prev, isShareable: response.data.shareable }));
                                        showSnackbar('Shareable status updated successfully.', 'success');
                                    } catch (error) {
                                        console.error('Error updating shareable status:', error);
                                        showSnackbar('Error updating shareable status.', 'error');
                                    }
                                }}
                                name="shareable"
                                color="primary"
                            />
                        }
                        label="Make Brdge Shareable"
                        sx={{ mt: 2 }}
                    />
                </Card>
            </Grid>

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
        </Grid>
    );
}

// Move the export statement outside of the function
export default EditBrdgePage;
