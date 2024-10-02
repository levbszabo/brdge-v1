// CreateBrdgePage.jsx

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import MicRecorder from 'mic-recorder-to-mp3';
import { FaPlay, FaPause, FaChevronLeft, FaChevronRight, FaShareAlt } from 'react-icons/fa';

function CreateBrdgePage() {
    // State variables
    const [name, setName] = useState('');
    const [presentation, setPresentation] = useState(null);
    const [brdgeId, setBrdgeId] = useState(null);
    const [numSlides, setNumSlides] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [transcripts, setTranscripts] = useState([]);
    const [message, setMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [showCountdown, setShowCountdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [existingAudioUrl, setExistingAudioUrl] = useState(null);
    const [newAudioName, setNewAudioName] = useState('');
    const [isRenaming, setIsRenaming] = useState(false);
    const [loadingOverlay, setLoadingOverlay] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [transcriptsGenerated, setTranscriptsGenerated] = useState(false);
    const [voiceCloneGenerated, setVoiceCloneGenerated] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);
    const audioRef = useRef(null);
    const [generatedAudioFiles, setGeneratedAudioFiles] = useState([]);
    const [generatedAudioDir, setGeneratedAudioDir] = useState(null);
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isTranscriptModified, setIsTranscriptModified] = useState(false); // Tracks transcript changes
    const [voiceId, setVoiceId] = useState(''); // Stores the voice ID input by the user
    const [deployLink, setDeployLink] = useState('');

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode) {
            // Fetch existing brdge data when in edit mode
            axios
                .get(`http://localhost:5000/api/brdges/${id}`)
                .then(async (response) => {
                    const brdge = response.data;
                    setName(brdge.name);
                    setBrdgeId(brdge.id);
                    setNumSlides(brdge.num_slides);
                    if (brdge.audio_filename) {
                        const audioFileUrl = `http://localhost:5000/api/brdges/${brdge.id}/audio`;
                        setExistingAudioUrl(audioFileUrl);
                        setNewAudioName(brdge.audio_filename);
                    }
                    // Fetch aligned transcripts if available
                    try {
                        const transcriptResponse = await axios.get(
                            `http://localhost:5000/api/brdges/${id}/transcripts/aligned`
                        );
                        const alignedData = transcriptResponse.data;
                        const updatedTranscripts = [];

                        // Process the aligned transcripts
                        if (
                            alignedData.image_transcripts &&
                            Array.isArray(alignedData.image_transcripts)
                        ) {
                            // Sort transcripts by image_number to ensure correct order
                            alignedData.image_transcripts.sort(
                                (a, b) => a.image_number - b.image_number
                            );
                            for (let i = 1; i <= brdge.num_slides; i++) {
                                const slideData = alignedData.image_transcripts.find(
                                    (item) => item.image_number === i
                                );
                                const slideTranscript = slideData ? slideData.transcript : '';
                                updatedTranscripts.push(slideTranscript);
                            }
                        } else {
                            // If data format is different or missing, initialize empty transcripts
                            for (let i = 0; i < brdge.num_slides; i++) {
                                updatedTranscripts.push('');
                            }
                        }

                        setTranscripts(updatedTranscripts);
                    } catch (error) {
                        console.error('Error fetching aligned transcripts:', error);
                        setMessage('Error fetching aligned transcripts.');
                        setTranscripts(new Array(brdge.num_slides).fill(''));
                    }
                })
                .catch((error) => {
                    console.error('Error fetching brdge data:', error);
                    setMessage('Error loading brdge data.');
                });
        }
    }, [id, isEditMode]);

    useEffect(() => {
        if (brdgeId) {
            // Fetch generated audio files
            axios
                .get(`http://localhost:5000/api/brdges/${brdgeId}/audio/generated`)
                .then((response) => {
                    setGeneratedAudioFiles(response.data.files);
                })
                .catch((error) => {
                    console.error('Error fetching generated audio files:', error);
                    setMessage('Error fetching generated audio files.');
                });
        }
    }, [brdgeId]);

    // Function to handle deploying Brdge
    const handleDeployBrdge = () => {
        const link = `${window.location.origin}/viewBrdge/${brdgeId}`;
        setDeployLink(link);
        navigator.clipboard.writeText(link);
        setMessage('Brdge deployed! Link copied to clipboard.');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            setMessage('Please provide a name.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);

        if (presentation) {
            formData.append('presentation', presentation);
        }

        try {
            setIsProcessing(true);
            let response;

            if (isEditMode) {
                // Update existing brdge
                response = await axios.put(`http://localhost:5000/api/brdges/${id}`, formData);
            } else {
                // Create new brdge
                response = await axios.post('http://localhost:5000/api/brdges', formData);
            }

            setMessage(response.data.message);
            const { brdge, num_slides } = response.data;
            setBrdgeId(brdge.id);
            setNumSlides(num_slides);
            setTranscripts(new Array(num_slides).fill('')); // Initialize transcripts array
            setIsProcessing(false);
        } catch (error) {
            console.error('Error saving brdge:', error);
            setMessage('Error saving brdge.');
            setIsProcessing(false);
        }
    };

    // Handle transcript input changes
    const handleTranscriptChange = (index, value) => {
        const updatedTranscripts = [...transcripts];
        updatedTranscripts[index] = value;
        setTranscripts(updatedTranscripts);
        setIsTranscriptModified(true); // Mark transcripts as modified
    };

    // Save updated transcripts to the backend
    const handleSaveTranscripts = async () => {
        setLoadingOverlay(true);
        setLoadingMessage('Saving transcripts...');
        try {
            await axios.put(
                `http://localhost:5000/api/brdges/${brdgeId}/transcripts/aligned`,
                { transcripts }
            );
            setLoadingMessage('Transcripts saved successfully.');
            setIsTranscriptModified(false);
        } catch (error) {
            console.error('Error saving transcripts:', error);
            setMessage('Error saving transcripts.');
        } finally {
            setTimeout(() => {
                setLoadingOverlay(false);
                setLoadingMessage('');
            }, 2000);
        }
    };

    const handleGenerateTranscripts = async () => {
        if (!existingAudioUrl) {
            setMessage('Please upload or record audio before proceeding.');
            return;
        }

        setLoadingOverlay(true);
        setLoadingMessage('Generating and aligning transcripts...');

        try {
            // Step 1: Transcribe audio
            await axios.post(`http://localhost:5000/api/brdges/${brdgeId}/audio/transcribe`);

            // Step 2: Align transcript with slides
            const response = await axios.post(
                `http://localhost:5000/api/brdges/${brdgeId}/audio/align_transcript`
            );

            // Update the transcripts with aligned transcripts
            const alignedData = response.data;
            const updatedTranscripts = [];

            if (alignedData.image_transcripts && Array.isArray(alignedData.image_transcripts)) {
                alignedData.image_transcripts.sort((a, b) => a.image_number - b.image_number);
                for (let i = 1; i <= numSlides; i++) {
                    const slideData = alignedData.image_transcripts.find(
                        (item) => item.image_number === i
                    );
                    const slideTranscript = slideData ? slideData.transcript : '';
                    updatedTranscripts.push(slideTranscript);
                }
            } else {
                for (let i = 0; i < numSlides; i++) {
                    updatedTranscripts.push('');
                }
            }

            setTranscripts(updatedTranscripts);
            setTranscriptsGenerated(true);
            setLoadingMessage('Transcripts generated and aligned successfully.');
        } catch (error) {
            console.error('Error generating transcripts:', error);
            setMessage('Error generating transcripts.');
        } finally {
            setTimeout(() => {
                setLoadingOverlay(false);
                setLoadingMessage('');
            }, 2000);
        }
    };

    const handleGenerateVoiceClone = async () => {
        setLoadingOverlay(true);
        setLoadingMessage('Generating voice clone...');

        try {
            // Check if voice ID is provided
            if (voiceId) {
                // Skip voice cloning and proceed to generate voice
                await handleGenerateVoice();
            } else {
                // Clone voice first
                await axios.post(`http://localhost:5000/api/brdges/${brdgeId}/audio/clone_voice`);
                // Then generate voice
                await handleGenerateVoice();
            }
        } catch (error) {
            console.error('Error generating voice clone:', error);
            setMessage('Error generating voice clone.');
        } finally {
            setTimeout(() => {
                setLoadingOverlay(false);
                setLoadingMessage('');
            }, 2000);
        }
    };

    const handleGenerateVoice = async () => {
        setLoadingOverlay(true);
        setLoadingMessage('Generating voice...');

        try {
            const response = await axios.post(
                `http://localhost:5000/api/brdges/${brdgeId}/audio/generate_voice`,
                { voice_id: voiceId } // Include voice ID if provided
            );

            // Fetch the list of generated audio files
            const audioFilesResponse = await axios.get(
                `http://localhost:5000/api/brdges/${brdgeId}/audio/generated`
            );
            console.log('Received audio files:', audioFilesResponse.data.files);
            setGeneratedAudioFiles(audioFilesResponse.data.files);

            setVoiceCloneGenerated(true);
            setLoadingMessage('Voice generated successfully.');
        } catch (error) {
            console.error('Error generating voice:', error);
            setMessage('Error generating voice.');
        } finally {
            setTimeout(() => {
                setLoadingOverlay(false);
                setLoadingMessage('');
            }, 2000);
        }
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
        if (option === 'record') {
            startCountdown();
        } else if (option === 'upload') {
            // Open the file input dialog
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'audio/*';
            fileInput.onchange = (e) => handleUploadAudio(e);
            fileInput.click();
        }
    };

    const handleRecordWalkthrough = () => {
        setSelectedOption('record');
        startCountdown();
    };

    const startCountdown = () => {
        setCountdown(3);
        setShowCountdown(true);
        const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(countdownInterval);
                    setShowCountdown(false);
                    startRecording();
                }
                return prev - 1;
            });
        }, 1000);
    };

    const mp3Recorder = useRef(new MicRecorder({ bitRate: 128 }));

    const startRecording = () => {
        mp3Recorder.current
            .start()
            .then(() => {
                setIsRecording(true);
                setCurrentSlide(1); // Start from slide 1
            })
            .catch((error) => {
                console.error('Error starting recording:', error);
                setMessage('Microphone access is required to record audio.');
            });
    };

    const stopRecording = () => {
        mp3Recorder.current
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                const audioFile = new File(buffer, 'walkthrough_recording.mp3', {
                    type: blob.type,
                    lastModified: Date.now(),
                });
                setRecordedAudio(audioFile);
                setAudioUrl(URL.createObjectURL(blob));
                setIsRecording(false);
                handleUploadAudio({ target: { files: [audioFile] } });
            })
            .catch((e) => {
                console.error('Error stopping recording:', e);
                setIsRecording(false);
            });
    };

    const handleNextSlide = () => {
        if (currentSlide < numSlides) {
            setCurrentSlide((prevSlide) => {
                const nextSlide = prevSlide + 1;
                loadAudioForSlide(nextSlide, true);
                return nextSlide;
            });
        }
    };

    const handlePrevSlide = () => {
        if (currentSlide > 1) {
            setCurrentSlide((prevSlide) => {
                const prevSlideNumber = prevSlide - 1;
                loadAudioForSlide(prevSlideNumber, true);
                return prevSlideNumber;
            });
        }
    };

    const handleReplaceAudio = () => {
        // Reset the audio state
        setExistingAudioUrl(null);
        setRecordedAudio(null);
        setAudioUrl(null);
        setNewAudioName('');

        // Open the file input dialog
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'audio/*';
        fileInput.onchange = (e) => handleUploadAudio(e);
        fileInput.click();
    };

    const handleDeleteAudio = async () => {
        if (!brdgeId) return;

        try {
            await axios.delete(`http://localhost:5000/api/brdges/${brdgeId}/audio`);
            setMessage('Audio deleted successfully.');
            setExistingAudioUrl(null);
            setNewAudioName('');
        } catch (error) {
            console.error('Error deleting audio:', error);
            setMessage('Error deleting audio.');
        }
    };

    const handleUploadAudio = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setRecordedAudio(file);
            setAudioUrl(URL.createObjectURL(file));
            setNewAudioName(file.name);

            // Upload the new audio file
            const formData = new FormData();
            formData.append('audio', file);

            try {
                await axios.post(`http://localhost:5000/api/brdges/${brdgeId}/audio`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setMessage('Audio uploaded successfully.');
                setExistingAudioUrl(`http://localhost:5000/api/brdges/${brdgeId}/audio`);
            } catch (error) {
                console.error('Error uploading audio:', error);
                setMessage('Error uploading audio.');
            }
        }
    };

    const handleRenameAudio = () => {
        setIsRenaming(true);
    };

    const handleSaveAudioName = async () => {
        if (!brdgeId || !newAudioName) return;

        try {
            await axios.put(`http://localhost:5000/api/brdges/${brdgeId}/audio/rename`, {
                new_name: newAudioName,
            });
            setMessage('Audio renamed successfully.');
            setIsRenaming(false);
        } catch (error) {
            console.error('Error renaming audio:', error);
            setMessage('Error renaming audio.');
        }
    };

    const handleFinishRecording = () => {
        stopRecording();
    };

    const loadAudioForSlide = (slideNumber, autoplay = false) => {
        console.log(`Loading audio for slide ${slideNumber}`);
        console.log(`Generated audio files:`, generatedAudioFiles);

        if (generatedAudioFiles.length >= slideNumber) {
            const audioFile = generatedAudioFiles[slideNumber - 1];
            console.log(`Selected audio file: ${audioFile}`);
            const audioUrl = `http://localhost:5000/api/brdges/${brdgeId}/audio/generated/${audioFile}`;
            console.log(`Audio URL: ${audioUrl}`);
            setCurrentAudio(audioUrl);

            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.load();

                if (autoplay) {
                    const playPromise = audioRef.current.play();
                    if (playPromise !== undefined) {
                        playPromise
                            .then(() => {
                                setIsPlaying(true);
                                console.log('Audio started playing');
                            })
                            .catch((error) => {
                                console.error('Error playing audio:', error);
                            });
                    }
                } else {
                    setIsPlaying(false);
                }
            }
        } else {
            console.log(`No audio file for slide ${slideNumber}`);
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
                            console.log('Audio started playing');
                        })
                        .catch((error) => {
                            console.error('Error playing audio:', error);
                        });
                }
            }
        }
    };

    useEffect(() => {
        if (generatedAudioFiles.length > 0) {
            loadAudioForSlide(currentSlide);
        }
    }, [generatedAudioFiles, currentSlide]);

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    useEffect(() => {
        if (currentAudio) {
            audioRef.current.load();
            if (isPlaying) {
                audioRef.current.play().catch((error) => {
                    console.error('Error playing audio:', error);
                });
            }
        }
    }, [currentAudio]);

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

    const renderSlides = () => {
        const imageUrl = `http://localhost:5000/api/brdges/${brdgeId}/slides/${currentSlide}`;
        return (
            <div className="border rounded-lg overflow-hidden shadow-lg">
                <img src={imageUrl} alt={`Slide ${currentSlide}`} className="w-full" />
                <div className="p-4 bg-white">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Transcript for Slide {currentSlide}
                    </label>
                    <textarea
                        className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows="4"
                        value={transcripts[currentSlide - 1] || ''}
                        onChange={(e) => handleTranscriptChange(currentSlide - 1, e.target.value)}
                        placeholder={`Enter transcript for slide ${currentSlide}...`}
                    />
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

    const renderWorkflow = () => {
        return (
            <div className="w-1/3 ml-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Workflow</h2>

                {/* Step 1: Upload/Record Audio */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-700">Step 1: Audio</h3>
                    {existingAudioUrl ? (
                        <div>
                            <audio controls src={existingAudioUrl} className="w-full mb-2"></audio>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleReplaceAudio}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Replace
                                </button>
                                <button
                                    onClick={handleDeleteAudio}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                                {isRenaming ? (
                                    <>
                                        <input
                                            type="text"
                                            value={newAudioName}
                                            onChange={(e) => setNewAudioName(e.target.value)}
                                            className="px-2 py-1 border rounded"
                                        />
                                        <button
                                            onClick={handleSaveAudioName}
                                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            Save
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleRenameAudio}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                    >
                                        Rename
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleOptionChange('upload')}
                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Upload Audio
                            </button>
                            <button
                                onClick={handleRecordWalkthrough}
                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Record Walkthrough
                            </button>
                        </div>
                    )}
                </div>

                {/* Step 2: Generate Transcripts */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-700">Step 2: Transcripts</h3>
                    <button
                        onClick={handleGenerateTranscripts}
                        className={`px-3 py-1 ${existingAudioUrl
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'bg-gray-300 cursor-not-allowed'
                            } text-white rounded`}
                        disabled={!existingAudioUrl}
                    >
                        Generate Transcripts
                    </button>
                </div>

                {/* Step 3: Generate Voice Clone */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-700">Step 3: Voice Generation</h3>
                    <button
                        onClick={handleGenerateVoiceClone}
                        className={`px-3 py-1 ${transcripts.some((t) => t.trim() !== '')
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-gray-300 cursor-not-allowed'
                            } text-white rounded`}
                        disabled={!transcripts.some((t) => t.trim() !== '')}
                    >
                        Generate Voice
                    </button>
                </div>

                {/* Voice ID Input */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-700">Voice ID (optional)</h3>
                    <input
                        type="text"
                        value={voiceId}
                        onChange={(e) => setVoiceId(e.target.value)}
                        className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter voice ID to use for voice generation"
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
            <div className="bg-white shadow-xl rounded-lg p-8 max-w-6xl w-full relative">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    {isEditMode ? 'Edit Brdge' : 'Create New Brdge'}
                </h1>
                {message && <p className="mb-4 text-green-600">{message}</p>}

                <div className="flex">
                    <div className="w-2/3">
                        {/* Brdge creation form */}
                        {!brdgeId && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 font-semibold">Brdge Name</label>
                                    <input
                                        type="text"
                                        className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold">
                                        Presentation (PDF)
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        className="w-full mt-2"
                                        onChange={(e) => setPresentation(e.target.files[0])}
                                    />
                                    {isEditMode && !presentation && (
                                        <p className="text-gray-600 mt-2">
                                            Current presentation will be used if no new file is selected.
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        className={`px-6 py-2 ${isProcessing
                                            ? 'bg-gray-400'
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                            } text-white font-semibold rounded-lg`}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing
                                            ? 'Processing...'
                                            : isEditMode
                                                ? 'Update Brdge'
                                                : 'Create Brdge'}
                                    </button>
                                    <button
                                        type="button"
                                        className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700"
                                        onClick={() => navigate(-1)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Display Slides and Transcripts */}
                        {brdgeId && numSlides > 0 && (
                            <>
                                {renderSlides()}

                                {/* Save Transcripts Button */}
                                {isTranscriptModified && (
                                    <div className="mt-4">
                                        <button
                                            onClick={handleSaveTranscripts}
                                            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                )}

                                {/* Regenerate Audio Button */}
                                <div className="mt-4">
                                    <button
                                        onClick={handleGenerateVoiceClone}
                                        className={`px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 ${!transcriptsGenerated ? 'cursor-not-allowed opacity-50' : ''
                                            }`}
                                        disabled={!transcriptsGenerated}
                                    >
                                        Regenerate Audio
                                    </button>
                                </div>

                                {/* Deploy Brdge Button */}
                                <div className="mt-4">
                                    <button
                                        onClick={handleDeployBrdge}
                                        className={`px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 ${!transcriptsGenerated || generatedAudioFiles.length === 0 ? 'cursor-not-allowed opacity-50' : ''
                                            }`}
                                        disabled={!transcriptsGenerated || generatedAudioFiles.length === 0}
                                    >
                                        <FaShareAlt className="inline mr-2" />
                                        Deploy Brdge
                                    </button>
                                    {deployLink && (
                                        <p className="mt-2 text-blue-600 break-all">
                                            Shareable Link: <a href={deployLink} target="_blank" rel="noopener noreferrer">{deployLink}</a>
                                        </p>
                                    )}
                                </div>

                                {/* Workflow steps */}
                                {renderWorkflow()}
                            </>
                        )}
                    </div>

                    {/* Loading Overlay */}
                    {loadingOverlay && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="text-white text-xl">{loadingMessage}</div>
                        </div>
                    )}

                    {/* Countdown Overlay */}
                    {showCountdown && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="text-white text-6xl font-bold">{countdown}</div>
                        </div>
                    )}

                    {/* Recording Indicator */}
                    {isRecording && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full animate-pulse">
                            Recording...
                            <button
                                onClick={handleFinishRecording}
                                className="ml-2 bg-white text-red-500 px-2 py-1 rounded-full text-sm"
                            >
                                Stop
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CreateBrdgePage;