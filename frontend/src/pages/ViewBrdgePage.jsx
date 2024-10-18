import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { unauthenticated_api } from '../api';
import { Box, Card, CardMedia, CardContent, Typography, Grid, Button, Slider, Container, CircularProgress } from '@mui/material';
import { PlayArrow, Pause, ChevronLeft, ChevronRight } from '@mui/icons-material';

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

    useEffect(() => {
        const fetchBrdgeData = async () => {
            try {
                let response;
                if (publicId) {
                    response = await unauthenticated_api.get(`/brdges/public/${publicId}`);
                } else {
                    response = await unauthenticated_api.get(`/brdges/${id}`);
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
                const response = await unauthenticated_api.get(`/brdges/${id || publicId}/audio/generated`);
                console.log('Fetched audio files:', response.data);
                const urls = response.data.files.map(file =>
                    `${unauthenticated_api.defaults.baseURL}/brdges/${id || publicId}/audio/generated/${file}`
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
            console.log('Audio metadata loaded. Duration:', audio.duration);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

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

    const handleSeek = (e, newValue) => {
        const time = newValue;
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const renderSlides = () => {
        const imageUrl = brdge
            ? `${unauthenticated_api.defaults.baseURL}/brdges/${id || publicId}/slides/${currentSlide}`
            : '';
        const transcript = brdge && brdge.transcripts ? brdge.transcripts[currentSlide - 1] : '';

        return (
            <Card elevation={3} sx={{ mb: 4, borderRadius: 2, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
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
                />
                <CardContent>
                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                        Transcript for Slide {currentSlide}
                    </Typography>
                    <Typography variant="body2" color="textPrimary">
                        {transcript}
                    </Typography>
                </CardContent>
                <Box p={2} bgcolor="grey.100" borderRadius="0 0 8px 8px">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm="auto">
                            <Button
                                onClick={handlePrevSlide}
                                variant="contained"
                                color="primary"
                                disabled={currentSlide === 1}
                                startIcon={<ChevronLeft />}
                                fullWidth
                                sx={{ mr: { sm: 2, xs: 0 }, mb: { xs: 2, sm: 0 } }}
                            >
                                Previous
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm="auto">
                            {audioUrls.length >= currentSlide && (
                                <Button
                                    onClick={handlePlayPause}
                                    variant="contained"
                                    color="secondary"
                                    startIcon={isPlaying ? <Pause /> : <PlayArrow />}
                                    fullWidth
                                    sx={{ mx: { sm: 2, xs: 0 }, mb: { xs: 2, sm: 0 } }}
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
                                sx={{ ml: { sm: 2, xs: 0 } }}
                            >
                                Next
                            </Button>
                        </Grid>
                    </Grid>
                    {audioUrls.length >= currentSlide && (
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
            </Card>
        );
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Container maxWidth="md" sx={{ py: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Typography
                    variant="h5"
                    gutterBottom
                    align="center"
                    sx={{
                        fontWeight: 600,
                        color: 'primary.main',
                        mb: 3,
                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                        textTransform: 'uppercase',
                        letterSpacing: 1.5,
                    }}
                >
                    {brdge ? `Viewing Brdge: ${brdge.name}` : 'View Brdge'}
                </Typography>
                {!brdge ? (
                    <Typography variant="body2" color="text.secondary" align="center">
                        Loading...
                    </Typography>
                ) : (
                    <Box width="100%">
                        {renderSlides()}
                    </Box>
                )}
            </Box>
        </Container>
    );
}

export default ViewBrdgePage;
