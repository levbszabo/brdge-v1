import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, Card, CardMedia, IconButton, Slider, Typography } from '@mui/material';
import { PlayArrow, Pause, SkipPrevious, SkipNext } from '@mui/icons-material';
import { BACKEND_URL } from '../config';
import './BrdgePlayer.css';

function BrdgePlayer({ brdgeId, onError }) {
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
                setLoading(true);
                const [brdgeResponse, audioResponse] = await Promise.all([
                    axios.get(`${BACKEND_URL}/brdges/${brdgeId}`),
                    axios.get(`${BACKEND_URL}/brdges/${brdgeId}/audio/generated`)
                ]);

                setBrdge(brdgeResponse.data);
                setNumSlides(brdgeResponse.data.num_slides);
                setGeneratedAudioFiles(audioResponse.data.files);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching Brdge data:', error);
                setError('Failed to load Brdge. Please try again later.');
                setLoading(false);
                if (onError) onError(error);
            }
        };

        fetchBrdgeData();
    }, [brdgeId, onError]);

    useEffect(() => {
        if (generatedAudioFiles.length > 0) {
            loadAudioForSlide(currentSlide);
        }
    }, [generatedAudioFiles, currentSlide]);

    const loadAudioForSlide = (slideNumber) => {
        if (generatedAudioFiles.length >= slideNumber) {
            const audioFile = generatedAudioFiles[slideNumber - 1];
            const audioUrl = `${BACKEND_URL}/brdges/${brdgeId}/audio/generated/${audioFile}`;
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
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
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

    const handleSeek = (_, newValue) => {
        const time = newValue;
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

    if (loading) {
        return <div className="brdge-player-loading">Loading Brdge...</div>;
    }

    if (error) {
        return <div className="brdge-player-error">{error}</div>;
    }

    if (!brdge) {
        return null;
    }

    const imageUrl = `${BACKEND_URL}/brdges/${brdgeId}/slides/${currentSlide}`;

    return (
        <div className="brdge-player">
            <Card elevation={3} className="brdge-player-card">
                <CardMedia
                    component="img"
                    image={imageUrl}
                    alt={`Slide ${currentSlide}`}
                    className="brdge-player-image"
                />
                <Box className="brdge-player-controls">
                    <Box className="brdge-player-buttons">
                        <IconButton onClick={handlePrevSlide} disabled={currentSlide === 1} aria-label="Previous slide">
                            <SkipPrevious />
                        </IconButton>
                        <IconButton onClick={handlePlayPause} aria-label={isPlaying ? "Pause" : "Play"}>
                            {isPlaying ? <Pause /> : <PlayArrow />}
                        </IconButton>
                        <IconButton onClick={handleNextSlide} disabled={currentSlide === numSlides} aria-label="Next slide">
                            <SkipNext />
                        </IconButton>
                    </Box>
                    <Box className="brdge-player-slider">
                        <Slider
                            value={currentTime}
                            min={0}
                            max={audioDuration}
                            onChange={handleSeek}
                            aria-labelledby="audio-slider"
                        />
                        <Box className="brdge-player-time">
                            <Typography variant="caption">{formatTime(currentTime)}</Typography>
                            <Typography variant="caption">{formatTime(audioDuration)}</Typography>
                        </Box>
                    </Box>
                </Box>
                {currentAudio && (
                    <audio
                        ref={audioRef}
                        src={currentAudio}
                        onLoadedMetadata={(e) => setAudioDuration(e.target.duration)}
                        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                        onEnded={() => setIsPlaying(false)}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                )}
            </Card>
        </div>
    );
}

export default BrdgePlayer;
