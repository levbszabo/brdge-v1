import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaPlay, FaPause, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
            .get(`http://localhost:5000/api/brdges/${id}`)
            .then((response) => {
                setBrdge(response.data);
                setNumSlides(response.data.num_slides);
            })
            .catch((error) => {
                console.error('Error fetching Brdge data:', error);
            });

        // Fetch generated audio files
        axios
            .get(`http://localhost:5000/api/brdges/${id}/audio/generated`)
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
            const audioUrl = `http://localhost:5000/api/brdges/${id}/audio/generated/${audioFile}`;
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
            ? `http://localhost:5000/api/brdges/${id}/slides/${currentSlide}`
            : '';
        const transcript = brdge && brdge.transcripts ? brdge.transcripts[currentSlide - 1] : '';

        return (
            <div className="border rounded-lg overflow-hidden shadow-lg">
                <img src={imageUrl} alt={`Slide ${currentSlide}`} className="w-full" />
                <div className="p-4 bg-white">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Transcript for Slide {currentSlide}
                    </label>
                    <p className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        {transcript}
                    </p>
                </div>
                <div className="flex flex-col p-4 bg-gray-100">
                    <div className="flex justify-between items-center mb-2">
                        <button
                            onClick={handlePrevSlide}
                            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 flex items-center"
                            disabled={currentSlide === 1}
                        >
                            <FaChevronLeft className="mr-2" /> Previous
                        </button>
                        {currentAudio && (
                            <button
                                onClick={handlePlayPause}
                                className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 flex items-center"
                            >
                                {isPlaying ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
                                {isPlaying ? 'Pause' : 'Play'}
                            </button>
                        )}
                        <button
                            onClick={handleNextSlide}
                            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 flex items-center"
                            disabled={currentSlide === numSlides}
                        >
                            Next <FaChevronRight className="ml-2" />
                        </button>
                    </div>
                    {currentAudio && (
                        <div className="w-full">
                            <input
                                type="range"
                                min="0"
                                max={audioDuration}
                                value={currentTime}
                                onChange={handleSeek}
                                className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(audioDuration)}</span>
                            </div>
                        </div>
                    )}
                </div>
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
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
            <div className="bg-white shadow-xl rounded-lg p-8 max-w-4xl w-full">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    View Brdge: {brdge ? brdge.name : ''}
                </h1>
                {!brdge ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        {renderSlides()}
                    </>
                )}
            </div>
        </div>
    );
}

export default ViewBrdgePage;