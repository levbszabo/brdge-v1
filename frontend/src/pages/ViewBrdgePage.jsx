import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Card, CardMedia, CardContent, Typography, Grid, Button, Slider, Container } from '@mui/material';
import { PlayArrow, Pause, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { BACKEND_URL } from '../config';

function ViewBrdgePage() {
    const { id } = useParams();
    const [brdge, setBrdge] = useState(null);
    const [numSlides, setNumSlides] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [generatedAudioFiles, setGeneratedAudioFiles] = useState([]);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        // Fetch Brdge data
        axios
            .get(`${BACKEND_URL}/brdges/${id}`)
            .then((response) => {
                setBrdge(response.data);
                setNumSlides(response.data.num_slides);
            })
            .catch((error) => {
                console.error('Error fetching Brdge data:', error);
            });

        // Fetch generated audio files
        axios
            .get(`${BACKEND_URL}/brdges/${id}/audio/generated`)
            .then((response) => {
                setGeneratedAudioFiles(response.data.files);
            })
            .catch((error) => {
                console.error('Error fetching generated audio files:', error);
            });
    }, [id]);

    useEffect(() => {
        if (generatedAudioFiles.length > 0) {
            loadAudioForSlide(currentSlide);
        }
    }, [generatedAudioFiles, currentSlide]);

    const loadAudioForSlide = (slideNumber) => {
        if (generatedAudioFiles.length >= slideNumber) {
            const audioFile = generatedAudioFiles[slideNumber - 1];
            const audioUrl = `${BACKEND_URL}/brdges/${id}/audio/generated/${audioFile}`;
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
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsPlaying(true);
                        })
                        .catch((error) => {
                            console.error('Error playing audio:', error);
                        });
                }
            }
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
    };

    const renderSlides = () => {
        const imageUrl = brdge
            ? `${BACKEND_URL}/brdges/${id}/slides/${currentSlide}`
            : '';
        const transcript = brdge && brdge.transcripts ? brdge.transcripts[currentSlide - 1] : '';

        return (
            <Card elevation={3} sx={{ mb: 4, borderRadius: 2 }}>
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
                            {currentAudio && (
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
            </Card>
        );
    };

    return (
        <Container maxWidth="md" sx={{ py: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Typography
                    variant="h5"
                    gutterBottom
                    align="center"
                    sx={{ fontWeight: 500, color: 'text.primary', mb: 2, fontFamily: 'Roboto, Helvetica, Arial, sans-serif' }}
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