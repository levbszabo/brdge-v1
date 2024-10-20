import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardMedia, CardContent, Typography, Button, Slider, CircularProgress } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
import { unauthenticated_api } from '../api';
import { styled } from '@mui/material/styles';

const PlayerCard = styled(Card)(({ theme }) => ({
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    background: '#ffffff',
    width: '100%',
    maxWidth: '90vw',
    margin: 'auto',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
    },
}));

const ControlPanel = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
    minWidth: 'auto',
    padding: theme.spacing(0.5, 1),
}));

const StyledSlider = styled(Slider)(({ theme }) => ({
    color: theme.palette.primary.main,
    height: 4,
    '& .MuiSlider-thumb': {
        width: 8,
        height: 8,
        transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
        '&:hover, &.Mui-focusVisible': {
            boxShadow: `0px 0px 0px 8px ${theme.palette.primary.main}33`,
        },
        '&.Mui-active': {
            width: 12,
            height: 12,
        },
    },
    '& .MuiSlider-rail': {
        opacity: 0.28,
    },
}));

const BrdgeTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    color: theme.palette.text.primary,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    marginBottom: '8px',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: '0 16px',
    [theme.breakpoints.down('sm')]: {
        fontSize: '1rem',
    },
}));

function BrdgePlayer({ brdgeId }) {
    const [brdge, setBrdge] = useState(null);
    const [numSlides, setNumSlides] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio());
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBrdgeData = async () => {
            try {
                const response = await unauthenticated_api.get(`/brdges/${brdgeId}`);
                if (!response.data.shareable) {
                    throw new Error('This brdge is not available for public viewing.');
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

        fetchBrdgeData();
    }, [brdgeId]);

    useEffect(() => {
        loadAudioForSlide(currentSlide);
    }, [currentSlide, brdgeId]);

    const loadAudioForSlide = async (slideNumber) => {
        try {
            const audioUrl = `${unauthenticated_api.defaults.baseURL}/brdges/${brdgeId}/audio/generated/slide_${slideNumber}.mp3`;
            const response = await fetch(audioUrl, { method: 'HEAD' });
            if (response.ok) {
                console.log(`Audio found for slide ${slideNumber}:`, audioUrl);
                setCurrentAudio(audioUrl);
                audioRef.current.src = audioUrl;
                audioRef.current.load();
            } else {
                console.warn(`No audio file found for slide ${slideNumber}`);
                setCurrentAudio(null);
            }
        } catch (error) {
            console.error(`Error checking audio for slide ${slideNumber}:`, error);
            setCurrentAudio(null);
        }
        setIsPlaying(false);
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(error => console.error('Error playing audio:', error));
        }
        setIsPlaying(!isPlaying);
    };

    const handleNextSlide = () => {
        if (currentSlide < numSlides) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const handlePrevSlide = () => {
        if (currentSlide > 1) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const handleSeek = (e, value) => {
        const time = parseFloat(value);
        setCurrentTime(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    useEffect(() => {
        const audio = audioRef.current;
        audio.addEventListener('loadedmetadata', () => setAudioDuration(audio.duration));
        audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
        audio.addEventListener('ended', () => {
            setIsPlaying(false);
            if (currentSlide < numSlides) {
                setCurrentSlide(prev => prev + 1);
            }
        });

        return () => {
            audio.removeEventListener('loadedmetadata', () => { });
            audio.removeEventListener('timeupdate', () => { });
            audio.removeEventListener('ended', () => { });
        };
    }, [currentSlide, numSlides]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <PlayerCard>
            <CardMedia
                component="img"
                image={`${unauthenticated_api.defaults.baseURL}/brdges/${brdgeId}/slides/${currentSlide}`}
                alt={`Slide ${currentSlide}`}
                sx={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '16 / 9',
                    objectFit: 'contain',
                    backgroundColor: '#f0f0f0',
                }}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/600x400?text=No+Slide+Available';
                }}
            />
            <CardContent sx={{ pb: 1, pt: 2 }}>
                <BrdgeTitle variant="h6">
                    {brdge ? brdge.name : 'Loading...'}
                </BrdgeTitle>
                <ControlPanel>
                    <StyledButton onClick={handlePrevSlide} disabled={currentSlide === 1} variant="outlined" size="small">
                        Previous
                    </StyledButton>
                    <StyledButton
                        onClick={handlePlayPause}
                        disabled={!currentAudio}
                        variant="contained"
                        size="small"
                        startIcon={isPlaying ? <Pause /> : <PlayArrow />}
                    >
                        {isPlaying ? 'Pause' : 'Play'}
                    </StyledButton>
                    <StyledButton onClick={handleNextSlide} disabled={currentSlide === numSlides} variant="outlined" size="small">
                        Next
                    </StyledButton>
                </ControlPanel>
                {currentAudio && (
                    <Box sx={{ px: 2, pt: 1 }}>
                        <StyledSlider
                            value={currentTime}
                            min={0}
                            max={audioDuration}
                            onChange={handleSeek}
                            aria-labelledby="audio-slider"
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{formatTime(currentTime)}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{formatTime(audioDuration)}</Typography>
                        </Box>
                    </Box>
                )}
            </CardContent>
        </PlayerCard>
    );
}

export default BrdgePlayer;
