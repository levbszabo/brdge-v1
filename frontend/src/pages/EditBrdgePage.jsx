import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
    Card, Typography, Button, Box, Container, useTheme, styled, CardMedia
} from '@mui/material';
import { FaMicrophone, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { api } from '../api';
import { useSnackbar } from '../utils/snackbar';
import {
    LiveKitRoom,
    RoomAudioRenderer,
    ControlBar,
    DisconnectButton,
    StartAudio,
    TrackToggle,
    useChat,
    LayoutContextProvider,
    Chat,
    BarVisualizer,
    useVoiceAssistant,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgress } from '@mui/material';
import { LIVEKIT_URL as serverUrl } from '../config';

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.spacing(3),
    textTransform: 'none',
    fontWeight: 600,
}));

const visualizerStyles = {
    '--lk-bar-visualizer-color': 'var(--lk-theme-color)',
    '--lk-bar-visualizer-gradient': 'linear-gradient(180deg, var(--lk-theme-color) 0%, rgba(var(--lk-theme-color-rgb), 0.2) 100%)',
    '--lk-bar-visualizer-background': 'rgba(var(--lk-theme-color-rgb), 0.1)',
};

function LiveKitControls() {
    const { messages, send: sendMessage } = useChat();
    const voiceAssistant = useVoiceAssistant();
    const theme = useTheme();

    useEffect(() => {
        if (voiceAssistant.state === 'ready') {
            setTimeout(() => {
                voiceAssistant.start();
            }, 1000);
        }
    }, [voiceAssistant.state]);

    return (
        <Box sx={{ position: 'relative', flex: 1 }}>
            <div style={{ padding: '10px', background: '#f0f0f0' }}>
                Voice Assistant Status: {voiceAssistant.state}
                <br />
                Audio Track: {voiceAssistant.audioTrack ? 'Present' : 'Not Present'}
            </div>
            {voiceAssistant.audioTrack && (
                <Box sx={{
                    mb: 2,
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& .lk-bar-visualizer': {
                        width: '100%',
                        '--lk-bar-color': theme.palette.primary.main,
                        '--lk-bar-width': '30px',
                        '--lk-bar-gap': '20px',
                    }
                }}>
                    <BarVisualizer
                        state={voiceAssistant.state}
                        trackRef={voiceAssistant.audioTrack}
                        barCount={5}
                        options={{
                            minHeight: 20,
                            maxHeight: 80,
                            smoothing: 0.5
                        }}
                    />
                </Box>
            )}
            <Chat messages={messages} onSendMessage={sendMessage} />
        </Box>
    );
}

function EditBrdgePage() {
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const theme = useTheme();



    const [brdgeData, setBrdgeData] = useState({
        name: '',
        numSlides: 0,
        slides: [],
    });
    const [currentSlide, setCurrentSlide] = useState(1);
    const [isRoomActive, setIsRoomActive] = useState(false);
    const [connectionDetails, setConnectionDetails] = useState(null);

    useEffect(() => {
        fetchBrdgeData();
    }, [id]);

    const fetchBrdgeData = async () => {
        try {
            const response = await api.get(`/brdges/${id}`);
            const data = response.data;
            setBrdgeData({
                name: data.name,
                numSlides: data.num_slides,
                slides: data.slides || [],
            });
        } catch (error) {
            console.error('Error fetching brdge data:', error);
            showSnackbar('Error loading brdge data.', 'error');
        }
    };

    const handleSlideChange = (newSlide) => {
        setCurrentSlide(newSlide);
    };

    const handleRecordWalkthrough = useCallback(async () => {
        try {
            const response = await api.get('/getToken');
            const token = response.data;

            setConnectionDetails({
                token: token,
                serverUrl: serverUrl,
            });
            setIsRoomActive(true);
        } catch (error) {
            console.error('Error fetching token:', error);
            showSnackbar('Error starting recording session.', 'error');
        }
    }, [showSnackbar]);

    const renderSlides = () => {
        const imageUrl = `${api.defaults.baseURL}/brdges/${id}/slides/${currentSlide}`;
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Card
                    elevation={0}
                    sx={{
                        backgroundColor: 'transparent',
                        position: 'relative',
                        mb: 2
                    }}
                >
                    <Box sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 2,
                        padding: '8px 16px',
                        borderRadius: '20px',
                    }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                            Slide {currentSlide} of {brdgeData.numSlides}
                        </Typography>
                    </Box>
                    <CardMedia
                        component="img"
                        image={imageUrl}
                        alt={`Slide ${currentSlide}`}
                        sx={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '60vh',
                            objectFit: 'contain',
                            borderRadius: 2,
                        }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/600x400?text=No+Slide+Available';
                        }}
                    />
                </Card>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        onClick={() => handleSlideChange(Math.max(currentSlide - 1, 1))}
                        disabled={currentSlide === 1}
                        startIcon={<FaChevronLeft />}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => handleSlideChange(Math.min(currentSlide + 1, brdgeData.numSlides))}
                        disabled={currentSlide === brdgeData.numSlides}
                        endIcon={<FaChevronRight />}
                    >
                        Next
                    </Button>
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        {brdgeData.name || 'Edit Brdge'}
                    </Typography>
                    <StyledButton
                        onClick={handleRecordWalkthrough}
                        disabled={isRoomActive}
                        variant="contained"
                        startIcon={<FaMicrophone />}
                    >
                        {isRoomActive ? 'Recording in Progress' : 'Start Recording'}
                    </StyledButton>
                </Box>

                {brdgeData.numSlides > 0 && renderSlides()}

                {isRoomActive && connectionDetails && (
                    <LiveKitRoom
                        token={connectionDetails.token}
                        serverUrl={connectionDetails.serverUrl}
                        connect={true}
                        audio={true}
                        video={false}
                        onDisconnected={() => setIsRoomActive(false)}
                        options={{
                            adaptiveStream: false,
                            dynacast: false,
                            publishDefaults: {
                                simulcast: false,
                                audioEnabled: true,
                                dtx: false,
                                red: true,
                                audioBitrate: 128000,
                                audioCodec: 'opus',
                            },
                            audio: {
                                echoCancellation: true,
                                noiseSuppression: true,
                                autoGainControl: true,
                                sampleRate: 48000,
                                sampleSize: 24,
                                channelCount: 2,
                                latency: 0,
                                volume: 1.0
                            }
                        }}
                    >
                        <LayoutContextProvider>
                            <LiveKitControls />
                            <RoomAudioRenderer
                                volume={1.0}
                                autoPlay
                                muted={false}
                            />
                            <StartAudio />
                            <ControlBar>
                                <TrackToggle source="microphone" />
                                <DisconnectButton>End Session</DisconnectButton>
                            </ControlBar>
                        </LayoutContextProvider>
                    </LiveKitRoom>
                )}
            </Container>
        </Box>
    );
}

export default EditBrdgePage;
