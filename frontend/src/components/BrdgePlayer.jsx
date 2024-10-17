import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardMedia, CardContent, Typography, Grid, Button, Slider, Container, CircularProgress } from '@mui/material';
import { PlayArrow, Pause, ChevronLeft, ChevronRight } from '@mui/icons-material';
import api from '../api';

function BrdgePlayer({ brdgeId, publicId }) {
    const [brdge, setBrdge] = useState(null);
    const [numSlides, setNumSlides] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [generatedAudioFiles, setGeneratedAudioFiles] = useState([]);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBrdgeData = async () => {
            try {
                const response = publicId
                    ? await api.get(`/brdges/public/${publicId}`)
                    : await api.get(`/brdges/${brdgeId}`);
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
                const response = publicId
                    ? await api.get(`/brdges/public/${publicId}/audio/generated`)
                    : await api.get(`/brdges/${brdgeId}/audio/generated`);
                console.log('Fetched audio files:', response.data);
                setGeneratedAudioFiles(response.data.files);
            } catch (err) {
                console.error('Error fetching generated audio files:', err);
            }
        };

        fetchBrdgeData();
        fetchGeneratedAudioFiles();
    }, [brdgeId, publicId]);

    useEffect(() => {
        if (generatedAudioFiles.length > 0) {
            loadAudioForSlide(currentSlide);
        }
    }, [generatedAudioFiles, currentSlide]);

    const loadAudioForSlide = (slideNumber) => {
        if (generatedAudioFiles.length >= slideNumber) {
            const audioFile = generatedAudioFiles[slideNumber - 1];
            const audioUrl = `${api.defaults.baseURL}/brdges/${publicId || brdgeId}/audio/generated/${audioFile}`;
            setCurrentAudio(audioUrl);

            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.load();
                setIsPlaying(false);
            }
        } else {
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
                console.log('Attempting to play audio:', currentAudio);
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('Audio started playing successfully');
                            setIsPlaying(true);
                        })
                        .catch((error) => {
                            console.error('Error playing audio:', error);
                        });
                }
            }
        } else {
            console.error('Audio reference is not available');
        }
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

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
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

    const handleAudioEnded = () => {
        setIsPlaying(false);
        if (currentSlide < numSlides) {
            handleNextSlide();
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Card elevation={3} sx={{ borderRadius: 2, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
            <CardMedia
                component="img"
                image={`${api.defaults.baseURL}/brdges/${publicId || brdgeId}/slides/${currentSlide}`}
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
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {brdge ? brdge.name : 'Loading...'}
                </Typography>
                <Box p={2} bgcolor="grey.100" borderRadius="8px">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm="auto">
                            <Button
                                onClick={handlePrevSlide}
                                variant="contained"
                                color="primary"
                                disabled={currentSlide === 1}
                                startIcon={<ChevronLeft />}
                                fullWidth
                            >
                                Previous
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm="auto">
                            {currentAudio && (
                                <Button
                                    onClick={handlePlayPause}
                                    variant="contained"
                                    color="secondary"
                                    startIcon={isPlaying ? <Pause /> : <PlayArrow />}
                                    fullWidth
                                >
                                    {isPlaying ? 'Pause' : 'Play'}
                                </Button>
                            )}
                        </Grid>
                        <Grid item xs={12} sm="auto">
                            <Button
                                onClick={handleNextSlide}
                                variant="contained"
                                color="primary"
                                disabled={currentSlide === numSlides}
                                endIcon={<ChevronRight />}
                                fullWidth
                            >
                                Next
                            </Button>
                        </Grid>
                    </Grid>
                    {currentAudio && (
                        <Box mt={2}>
                            <Slider
                                value={currentTime}
                                min={0}
                                max={audioDuration}
                                onChange={handleSeek}
                                aria-labelledby="audio-slider"
                                sx={{ color: 'primary.main' }}
                            />
                            <Grid container justifyContent="space-between">
                                <Typography variant="caption">{formatTime(currentTime)}</Typography>
                                <Typography variant="caption">{formatTime(audioDuration)}</Typography>
                            </Grid>
                        </Box>
                    )}
                </Box>
            </CardContent>
            {currentAudio && (
                <audio
                    ref={audioRef}
                    src={currentAudio}
                    onLoadedMetadata={(e) => {
                        console.log('Audio metadata loaded:', e.target.duration);
                        setAudioDuration(e.target.duration);
                    }}
                    onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                    onEnded={handleAudioEnded}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onError={(e) => console.error('Audio error:', e)}
                />
            )}
        </Card>
    );
}

export default BrdgePlayer;
