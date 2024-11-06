import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
    Card, CardHeader, CardContent, CardMedia, Typography, Button, TextField, Box,
    Container, useTheme, styled
} from '@mui/material';
import { FaMicrophone, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { api } from '../api';
import { useSnackbar } from '../utils/snackbar';
import {
    LiveKitRoom,
    RoomAudioRenderer,
    ControlBar,
    DisconnectButton,
    useLocalParticipant,
    useRoomContext,
    StartAudio,
    TrackToggle,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track, DataPacket_Kind } from 'livekit-client';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgress } from '@mui/material';

const serverUrl = 'wss://brdge-bgs5ijzf.livekit.cloud';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(145deg, #f3f4f6 0%, #fff 100%)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderRadius: theme.spacing(2),
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.spacing(3),
    textTransform: 'none',
    fontWeight: 600,
    padding: '12px 24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
}));

const LiveKitControlsWrapper = styled(Box)(({ theme }) => ({
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
}));

const CountdownOverlay = styled(motion.div)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.7)',
    zIndex: 2000,
}));

const TranscriptMessage = styled(Box)(({ isUser }) => ({
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '8px',
    maxWidth: '80%',
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    backgroundColor: isUser ? '#1976d2' : '#f5f5f5',
    color: isUser ? 'white' : 'black',
}));

// Create a separate component for LiveKit functionality
function LiveKitControls({ onSlideChange, currentSlide, id, micSettings, onMicSettingsChange }) {
    const { localParticipant } = useLocalParticipant();
    const room = useRoomContext();
    const [isConnected, setIsConnected] = useState(false);

    const notifySlideChange = useCallback(async (slideNumber) => {
        if (!localParticipant || !isConnected) return;

        try {
            const slideUrl = `${api.defaults.baseURL}/brdges/${id}/slides/${slideNumber}`;
            const data = {
                type: 'slide_change',
                slide_number: slideNumber,
                slide_url: slideUrl
            };

            const encoder = new TextEncoder();
            const payload = encoder.encode(JSON.stringify(data));
            await localParticipant.publishData(payload, DataPacket_Kind.RELIABLE);
        } catch (error) {
            console.error('Error publishing slide change:', error);
        }
    }, [localParticipant, id, isConnected]);

    const handleData = useCallback((payload, participant) => {
        try {
            const data = JSON.parse(new TextDecoder().decode(payload));
            if (data.type === 'transcript') {
                onSlideChange(prev => {
                    const newMessage = {
                        text: data.text,
                        isUser: false,
                        timestamp: new Date().toISOString()
                    };
                    return [...prev, newMessage];
                });
            }
        } catch (error) {
            console.error('Error processing data message:', error);
        }
    }, [onSlideChange]);

    useEffect(() => {
        if (room) {
            const handleConnected = () => {
                setIsConnected(true);
                // Notify about current slide after connection is established
                notifySlideChange(currentSlide);
            };

            const handleDisconnected = () => {
                setIsConnected(false);
            };

            room.on('connected', handleConnected);
            room.on('disconnected', handleDisconnected);
            room.on('dataReceived', handleData);

            // Check if already connected
            if (room.state === 'connected') {
                setIsConnected(true);
                notifySlideChange(currentSlide);
            }

            return () => {
                room.off('connected', handleConnected);
                room.off('disconnected', handleDisconnected);
                room.off('dataReceived', handleData);
            };
        }
    }, [room, onSlideChange, currentSlide, notifySlideChange]);

    useEffect(() => {
        if (isConnected) {
            notifySlideChange(currentSlide);
        }
    }, [currentSlide, notifySlideChange, isConnected]);

    return (
        <LiveKitControlsWrapper>
            <Container maxWidth="lg">
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <StartAudio />
                        <TrackToggle
                            source={Track.Source.Microphone}
                            style={{
                                background: 'white',
                                padding: '8px',
                                borderRadius: '50%',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        />
                    </Box>
                    <RoomAudioRenderer />
                    <DisconnectButton>End Session</DisconnectButton>
                </Box>
            </Container>
        </LiveKitControlsWrapper>
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
    const [transcript, setTranscript] = useState([]);
    const [connectionDetails, setConnectionDetails] = useState(null);
    const [isStarting, setIsStarting] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [micSettings, setMicSettings] = useState({
        muted: false,
        device: null
    });

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

    const handleSlideChange = useCallback((newSlide) => {
        setCurrentSlide(newSlide);
    }, []);

    const startCountdown = useCallback(() => {
        setIsStarting(true);
        setCountdown(3);

        const countdownInterval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    setIsStarting(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    const handleRecordWalkthrough = useCallback(async () => {
        try {
            startCountdown();
            const response = await api.get('/getToken');
            const token = response.data;

            // Wait for countdown
            await new Promise(resolve => setTimeout(resolve, 3000));

            setConnectionDetails({
                token: token,
                serverUrl: serverUrl,
            });
            setIsRoomActive(true);
            setTranscript(prev => [...prev, {
                text: "Starting recording session...",
                isUser: false,
                timestamp: new Date().toISOString()
            }]);
        } catch (error) {
            console.error('Error fetching token:', error);
            showSnackbar('Error starting recording session.', 'error');
            setIsStarting(false);
        }
    }, [showSnackbar, startCountdown]);

    const renderTranscript = () => (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            maxHeight: '300px',
            overflowY: 'auto',
            p: 2,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            {transcript.map((message, index) => (
                <TranscriptMessage
                    key={index}
                    isUser={message.isUser}
                >
                    <Typography variant="body2" sx={{ opacity: 0.7, mb: 0.5, fontSize: '0.8rem' }}>
                        {message.isUser ? 'You' : 'Assistant'} • {new Date(message.timestamp).toLocaleTimeString()}
                    </Typography>
                    <Typography>
                        {message.text}
                    </Typography>
                </TranscriptMessage>
            ))}
        </Box>
    );

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
                        background: 'rgba(255, 255, 255, 0.9)',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/600x400?text=No+Slide+Available';
                        }}
                    />
                </Card>

                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'stretch',
                    mb: isRoomActive ? 10 : 0
                }}>
                    <Button
                        variant="outlined"
                        onClick={() => handleSlideChange(Math.max(currentSlide - 1, 1))}
                        disabled={currentSlide === 1}
                        startIcon={<FaChevronLeft />}
                        sx={{ minWidth: '120px' }}
                    >
                        Previous
                    </Button>
                    {renderTranscript()}
                    <Button
                        variant="outlined"
                        onClick={() => handleSlideChange(Math.min(currentSlide + 1, brdgeData.numSlides))}
                        disabled={currentSlide === brdgeData.numSlides}
                        endIcon={<FaChevronRight />}
                        sx={{ minWidth: '120px' }}
                    >
                        Next
                    </Button>
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
            py: 4,
            position: 'relative'
        }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        {brdgeData.name || 'Edit Brdge'}
                    </Typography>
                    <StyledButton
                        onClick={handleRecordWalkthrough}
                        disabled={isRoomActive}
                        variant="contained"
                        sx={{
                            backgroundColor: isRoomActive ? theme.palette.grey[400] : theme.palette.primary.main,
                            color: 'white',
                        }}
                        startIcon={<FaMicrophone />}
                    >
                        {isRoomActive ? 'Recording in Progress' : 'Start Recording'}
                    </StyledButton>
                </Box>

                {brdgeData.numSlides > 0 && renderSlides()}
            </Container>

            <AnimatePresence>
                {isStarting && (
                    <CountdownOverlay
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Box sx={{ textAlign: 'center', color: 'white' }}>
                            <CircularProgress size={80} thickness={2} sx={{ mb: 2 }} />
                            <Typography variant="h2" sx={{ mb: 2 }}>
                                {countdown}
                            </Typography>
                            <Typography variant="h6">
                                Starting Recording...
                            </Typography>
                        </Box>
                    </CountdownOverlay>
                )}
            </AnimatePresence>

            {isRoomActive && connectionDetails && (
                <LiveKitRoom
                    token={connectionDetails.token}
                    serverUrl={connectionDetails.serverUrl}
                    connect={true}
                    audio={!micSettings.muted}
                    video={false}
                    onDisconnected={() => {
                        setIsRoomActive(false);
                        setConnectionDetails(null);
                    }}
                >
                    <LiveKitControls
                        onSlideChange={setTranscript}
                        currentSlide={currentSlide}
                        id={id}
                        micSettings={micSettings}
                        onMicSettingsChange={setMicSettings}
                    />
                </LiveKitRoom>
            )}
        </Box>
    );
}

export default EditBrdgePage;