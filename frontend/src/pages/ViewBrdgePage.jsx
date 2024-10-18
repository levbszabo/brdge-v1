import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api, unauthenticated_api } from '../api';
import { Box, Typography, IconButton, Container, CircularProgress, Paper, useTheme, useMediaQuery, Fade } from '@mui/material';
import { PlayArrow, Pause, SkipPrevious, SkipNext } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuthToken } from '../utils/auth';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px #ffd700; }
  50% { box-shadow: 0 0 20px #ffd700, 0 0 30px #ffd700; }
  100% { box-shadow: 0 0 5px #ffd700; }
`;

const PlayButton = styled(IconButton)`
  background-color: ${props => props.theme.palette.primary.main};
  color: white;
  &:hover {
    background-color: ${props => props.theme.palette.primary.dark};
    animation: ${glowAnimation} 2s infinite;
  }
`;

const ControlButton = styled(IconButton)`
  color: ${props => props.theme.palette.text.secondary};
  &:hover {
    color: ${props => props.theme.palette.primary.main};
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${props => props.theme.palette.grey[300]};
  position: relative;
  cursor: pointer;
`;

const Progress = styled.div`
  height: 100%;
  background-color: ${props => props.theme.palette.primary.main};
  transition: width 0.1s linear;
`;

function ViewBrdgePage() {
    const { id, publicId } = useParams();
    const [brdge, setBrdge] = useState(null);
    const [numSlides, setNumSlides] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [audioUrls, setAudioUrls] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio());
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const progressBarRef = useRef(null);

    useEffect(() => {
        const fetchBrdgeData = async () => {
            try {
                let response;
                if (publicId) {
                    response = await unauthenticated_api.get(`/brdges/public/${publicId}`);
                } else {
                    const token = getAuthToken();
                    if (token) {
                        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                        response = await api.get(`/brdges/${id}`);
                    } else {
                        throw new Error('Authentication required');
                    }
                }
                setBrdge(response.data);
                setNumSlides(response.data.num_slides);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching Brdge data:', err);
                setError('Failed to fetch the Brdge. Please try again later.');
                setLoading(false);
            }
        };

        const fetchGeneratedAudioFiles = async () => {
            try {
                let response;
                if (publicId) {
                    response = await unauthenticated_api.get(`/brdges/${publicId}/audio/generated`);
                } else {
                    const token = getAuthToken();
                    if (token) {
                        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                        response = await api.get(`/brdges/${id}/audio/generated`);
                    } else {
                        throw new Error('Authentication required');
                    }
                }
                const urls = response.data.files.map(file =>
                    `${publicId ? unauthenticated_api.defaults.baseURL : api.defaults.baseURL}/brdges/${id || publicId}/audio/generated/${file}`
                );
                setAudioUrls(urls);
            } catch (err) {
                console.error('Error fetching generated audio files:', err);
            }
        };

        fetchBrdgeData();
        fetchGeneratedAudioFiles();
    }, [id, publicId]);

    useEffect(() => {
        const audio = audioRef.current;

        const handleLoadedMetadata = () => {
            setAudioDuration(audio.duration);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            if (currentSlide < numSlides) {
                setCurrentSlide(prev => prev + 1);
            }
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentSlide, numSlides]);

    useEffect(() => {
        if (audioUrls.length > 0 && currentSlide <= audioUrls.length) {
            audioRef.current.src = audioUrls[currentSlide - 1];
            audioRef.current.load();
        }
    }, [audioUrls, currentSlide]);

    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(error => console.error('Error playing audio:', error));
        }
        setIsPlaying(!isPlaying);
    };

    const handleNextSlide = () => {
        if (currentSlide < numSlides) {
            setCurrentSlide(currentSlide + 1);
            setIsPlaying(false);
        }
    };

    const handlePrevSlide = () => {
        if (currentSlide > 1) {
            setCurrentSlide(currentSlide - 1);
            setIsPlaying(false);
        }
    };

    const handleProgressClick = (e) => {
        const progressBar = progressBarRef.current;
        const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
        const newTime = clickPosition * audioDuration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const renderSlides = () => {
        const imageUrl = brdge
            ? `${publicId ? unauthenticated_api.defaults.baseURL : api.defaults.baseURL}/brdges/${id || publicId}/slides/${currentSlide}`
            : '';
        const transcript = brdge && brdge.transcripts ? brdge.transcripts[currentSlide - 1] : '';

        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                >
                    <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                        <Box
                            component="img"
                            src={imageUrl}
                            alt={`Slide ${currentSlide}`}
                            sx={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: isMobile ? 'calc(100vh - 200px)' : 'calc(100vh - 150px)',
                                objectFit: 'contain',
                                backgroundColor: 'background.paper',
                            }}
                        />
                        <Box p={2}>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                Slide {currentSlide} of {numSlides}
                            </Typography>
                            <Typography variant="body2" color="textPrimary">
                                {transcript}
                            </Typography>
                        </Box>
                    </Paper>
                </motion.div>
            </AnimatePresence>
        );
    };

    const renderControls = () => (
        <Paper
            elevation={3}
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                p: 1,
                borderRadius: '16px 16px 0 0',
                zIndex: 1000,
            }}
        >
            <ProgressBar ref={progressBarRef} onClick={handleProgressClick}>
                <Progress style={{ width: `${(currentTime / audioDuration) * 100}%` }} />
            </ProgressBar>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{formatTime(currentTime)}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ControlButton onClick={handlePrevSlide} disabled={currentSlide === 1} size="small">
                        <SkipPrevious fontSize="small" />
                    </ControlButton>
                    <PlayButton onClick={handlePlayPause} size="small">
                        {isPlaying ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
                    </PlayButton>
                    <ControlButton onClick={handleNextSlide} disabled={currentSlide === numSlides} size="small">
                        <SkipNext fontSize="small" />
                    </ControlButton>
                </Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{formatTime(audioDuration)}</Typography>
            </Box>
        </Paper>
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', py: 1, mb: isMobile ? 6 : 8 }}>
                <Fade in={true} timeout={1000}>
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        align="center"
                        sx={{
                            fontWeight: 600,
                            color: 'primary.main',
                            mb: 1,
                            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
                        }}
                    >
                        {brdge ? brdge.name : 'View Brdge'}
                    </Typography>
                </Fade>
                <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                    {brdge && renderSlides()}
                </Box>
            </Container>
            {renderControls()}
        </Box>
    );
}

export default ViewBrdgePage;
