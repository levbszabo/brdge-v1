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
    useChat,
    Chat,
    LayoutContextProvider
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track, DataPacket_Kind, RoomEvent } from 'livekit-client';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgress } from '@mui/material';
import { format } from 'date-fns';
import { Paper, Fade } from '@mui/material';
import ScrollableFeed from 'react-scrollable-feed';

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

const ChatWrapper = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '300px',
    background: 'white',
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(8),
}));

const TranscriptContainer = styled(Paper)(({ theme }) => ({
    height: '400px',
    backgroundColor: '#ffffff',
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
}));

const TranscriptHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));

const TranscriptContent = styled(Box)(({ theme }) => ({
    flex: 1,
    overflow: 'hidden',
    padding: theme.spacing(2),
}));

const TranscriptBubble = styled(Box)(({ isUser, theme }) => ({
    padding: '12px 16px',
    borderRadius: '12px',
    maxWidth: '80%',
    marginBottom: theme.spacing(1.5),
    backgroundColor: isUser ? theme.palette.primary.main : '#f0f2f5',
    color: isUser ? '#fff' : theme.palette.text.primary,
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        [isUser ? 'right' : 'left']: -8,
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: isUser ? '0 0 8px 8px' : '0 8px 8px 0',
        borderColor: `transparent transparent ${isUser ? theme.palette.primary.main : '#f0f2f5'} transparent`,
    },
}));

// Create a separate component for LiveKit functionality
function LiveKitControls({ onSlideChange, currentSlide, id }) {
    const { localParticipant } = useLocalParticipant();
    const room = useRoomContext();
    const [isConnected, setIsConnected] = useState(false);
    const { messages, send, isSending } = useChat();
    const [transcriptions, setTranscriptions] = useState({});

    const notifySlideChange = useCallback(async (slideNumber) => {
        if (!isConnected || isSending) return;

        try {
            const slideUrl = `${api.defaults.baseURL}/brdges/${id}/slides/${slideNumber}`;
            const data = {
                type: 'slide_change',
                slide_number: slideNumber,
                slide_url: slideUrl
            };
            await send(JSON.stringify(data));
        } catch (error) {
            console.error('Error publishing slide change:', error);
        }
    }, [id, isConnected, isSending, send]);

    useEffect(() => {
        if (messages) {
            const newTranscripts = messages.map(msg => {
                try {
                    const data = JSON.parse(msg.message);
                    return {
                        text: data.text,
                        isUser: data.isUser,
                        timestamp: msg.timestamp,
                        from: data.from || msg.from?.identity || 'System'
                    };
                } catch (e) {
                    return {
                        text: msg.message,
                        isUser: msg.from?.identity === localParticipant?.identity,
                        timestamp: msg.timestamp,
                        from: msg.from?.identity || 'System'
                    };
                }
            });
            onSlideChange(newTranscripts);
        }
    }, [messages, localParticipant, onSlideChange]);

    useEffect(() => {
        if (room) {
            const handleConnected = () => {
                setIsConnected(true);
                notifySlideChange(currentSlide);
            };

            const handleDisconnected = () => {
                setIsConnected(false);
            };

            room.on('connected', handleConnected);
            room.on('disconnected', handleDisconnected);

            if (room.state === 'connected') {
                setIsConnected(true);
                notifySlideChange(currentSlide);
            }

            return () => {
                room.off('connected', handleConnected);
                room.off('disconnected', handleDisconnected);
            };
        }
    }, [room, currentSlide, notifySlideChange]);

    useEffect(() => {
        if (isConnected) {
            notifySlideChange(currentSlide);
        }
    }, [currentSlide, notifySlideChange, isConnected]);

    useEffect(() => {
        if (!room) return;

        const updateTranscriptions = (segments, participant, publication) => {
            setTranscriptions((prev) => {
                const newTranscriptions = { ...prev };
                for (const segment of segments) {
                    newTranscriptions[segment.id] = segment;
                }
                return newTranscriptions;
            });
        };

        room.on(RoomEvent.TranscriptionReceived, updateTranscriptions);
        return () => {
            room.off(RoomEvent.TranscriptionReceived, updateTranscriptions);
        };
    }, [room]);

    return (
        <>
            <TranscriptContainer elevation={0}>
                <TranscriptHeader>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Conversation Transcript
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {Object.keys(transcriptions).length} messages
                    </Typography>
                </TranscriptHeader>

                <TranscriptContent>
                    <ScrollableFeed>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {Object.values(transcriptions)
                                .sort((a, b) => a.firstReceivedTime - b.firstReceivedTime)
                                .map((segment) => (
                                    <Fade key={segment.id} in={true} timeout={500}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{
                                                    mb: 0.5,
                                                    alignSelf: segment.participantId === localParticipant?.identity ? 'flex-end' : 'flex-start'
                                                }}
                                            >
                                                {segment.participantId === localParticipant?.identity ? 'You' : 'AI Assistant'}
                                                {' • '}
                                                {format(new Date(segment.firstReceivedTime), 'h:mm a')}
                                            </Typography>
                                            <TranscriptBubble
                                                isUser={segment.participantId === localParticipant?.identity}
                                            >
                                                <Typography variant="body1">
                                                    {segment.text}
                                                </Typography>
                                            </TranscriptBubble>
                                        </Box>
                                    </Fade>
                                ))}
                        </Box>
                    </ScrollableFeed>
                </TranscriptContent>
            </TranscriptContainer>

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
        </>
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
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
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
                        data-lk-theme="default"
                    >
                        <LayoutContextProvider>
                            <LiveKitControls
                                onSlideChange={setTranscript}
                                currentSlide={currentSlide}
                                id={id}
                                micSettings={micSettings}
                                onMicSettingsChange={setMicSettings}
                            />
                        </LayoutContextProvider>
                    </LiveKitRoom>
                )}
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
        </Box>
    );
}

export default EditBrdgePage;