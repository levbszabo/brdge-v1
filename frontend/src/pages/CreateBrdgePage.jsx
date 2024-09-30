// src/pages/CreateBrdgePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import MicRecorder from 'mic-recorder-to-mp3';

function CreateBrdgePage() {
    const [name, setName] = useState('');
    const [presentation, setPresentation] = useState(null);
    const [brdgeId, setBrdgeId] = useState(null);
    const [numSlides, setNumSlides] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [transcripts, setTranscripts] = useState([]);
    const [message, setMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState(null);
    const [countdown, setCountdown] = useState(0);
    const [showCountdown, setShowCountdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [existingAudioUrl, setExistingAudioUrl] = useState(null);
    const [newAudioName, setNewAudioName] = useState('');
    const [isRenaming, setIsRenaming] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode) {
            // Fetch existing brdge data when in edit mode
            axios
                .get(`http://localhost:5000/api/brdges/${id}`)
                .then((response) => {
                    const brdge = response.data;
                    setName(brdge.name);
                    setBrdgeId(brdge.id);
                    setNumSlides(brdge.num_slides);
                    setTranscripts(brdge.transcripts || new Array(brdge.num_slides).fill(''));
                    if (brdge.audio_filename) {
                        const audioFileUrl = `http://localhost:5000/api/brdges/${brdge.id}/audio`;
                        setExistingAudioUrl(audioFileUrl);
                        setNewAudioName(brdge.audio_filename);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching brdge data:', error);
                    setMessage('Error loading brdge data.');
                });
        }
    }, [id, isEditMode]);

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
    };

    const handleProceed = () => {
        // Navigate to the next page with brdge details
        navigate('/next-step', { state: { brdgeName: name, brdgeId, transcripts } });
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
        if (option === 'record') {
            startCountdown();
        }
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
                    setCurrentSlide(1); // Start from slide 1
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
                const audioFile = new File(buffer, 'recording.mp3', {
                    type: blob.type,
                    lastModified: Date.now(),
                });
                setRecordedAudio(audioFile);
                const audioUrl = URL.createObjectURL(blob);
                setAudioUrl(audioUrl);
                setIsRecording(false);
            })
            .catch((e) => {
                console.error('Error stopping recording:', e);
                setIsRecording(false);
            });
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

    const handleUploadAudio = (e) => {
        const file = e.target.files[0];
        if (file) {
            setRecordedAudio(file);
            setAudioUrl(URL.createObjectURL(file));
        }
    };

    const handleUploadAudioFile = async () => {
        if (!recordedAudio || !brdgeId) return;
        const formData = new FormData();
        // Append the audio file
        formData.append('audio', recordedAudio, newAudioName || recordedAudio.name || 'audio_file.mp3');

        try {
            await axios.post(
                `http://localhost:5000/api/brdges/${brdgeId}/audio`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setMessage('Audio uploaded successfully.');
            setExistingAudioUrl(`http://localhost:5000/api/brdges/${brdgeId}/audio`);
            setRecordedAudio(null);
            setAudioUrl(null);
        } catch (error) {
            console.error('Error uploading audio:', error);
            setMessage('Error uploading audio.');
        }
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

    const renderSlides = () => {
        const imageUrl = `http://localhost:5000/api/brdges/${brdgeId}/slides/${currentSlide}`;
        return (
            <div className="border rounded overflow-hidden shadow-lg">
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
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
            <div className="bg-white shadow-xl rounded-lg p-8 max-w-5xl w-full">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    {isEditMode ? 'Edit Brdge' : 'Create New Brdge'}
                </h1>
                {message && <p className="mb-4 text-green-600">{message}</p>}
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
                            <label className="block text-gray-700 font-semibold">Presentation (PDF)</label>
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
                                className={`px-6 py-2 ${isProcessing ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
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

                {/* Display Audio Options and Slide Images with Transcripts */}
                {brdgeId && numSlides > 0 && (
                    <div>
                        {/* Informational Message */}
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-gray-700">
                                Upload an audio file or record a walkthrough to create a voice clone and
                                transcription. This will allow us to make a 'brdge' of communication to others.
                            </p>
                        </div>

                        {/* Existing Audio */}
                        {existingAudioUrl && (
                            <div className="mt-6">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Existing Audio</h2>
                                <audio controls src={existingAudioUrl} className="w-full mt-2 rounded-lg"></audio>
                                <div className="mt-4 flex items-center space-x-4">
                                    {isRenaming ? (
                                        <>
                                            <input
                                                type="text"
                                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                value={newAudioName}
                                                onChange={(e) => setNewAudioName(e.target.value)}
                                            />
                                            <button
                                                onClick={handleSaveAudioName}
                                                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                                            >
                                                Save Name
                                            </button>
                                            <button
                                                onClick={() => setIsRenaming(false)}
                                                className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-gray-700 font-semibold">{newAudioName}</p>
                                            <button
                                                onClick={handleRenameAudio}
                                                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                                            >
                                                Rename Audio
                                            </button>
                                            <button
                                                onClick={handleDeleteAudio}
                                                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
                                            >
                                                Delete Audio
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Audio Options */}
                        {!existingAudioUrl && !isRecording && (
                            <div className="mt-6">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Audio Options</h2>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => handleOptionChange('upload')}
                                        className={`px-4 py-2 ${selectedOption === 'upload'
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-300 text-gray-800'
                                            } font-semibold rounded-lg hover:bg-indigo-700`}
                                    >
                                        Upload Audio
                                    </button>
                                    <button
                                        onClick={() => handleOptionChange('record')}
                                        className={`px-4 py-2 ${selectedOption === 'record'
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-300 text-gray-800'
                                            } font-semibold rounded-lg hover:bg-indigo-700`}
                                    >
                                        Record Walkthrough
                                    </button>
                                </div>
                                {/* Upload Audio Option */}
                                {selectedOption === 'upload' && (
                                    <div className="mt-4">
                                        <label className="block text-gray-700 font-semibold">Select Audio File</label>
                                        <input
                                            type="file"
                                            accept="audio/*"
                                            className="w-full mt-2"
                                            onChange={handleUploadAudio}
                                        />
                                        {recordedAudio && (
                                            <div className="mt-4">
                                                <p className="text-gray-700 font-semibold">
                                                    Selected File: {recordedAudio.name}
                                                </p>
                                                <input
                                                    type="text"
                                                    className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    placeholder="Enter audio name"
                                                    value={newAudioName}
                                                    onChange={(e) => setNewAudioName(e.target.value)}
                                                />
                                                <audio controls src={audioUrl} className="w-full mt-2 rounded-lg"></audio>
                                                <button
                                                    onClick={handleUploadAudioFile}
                                                    className="px-4 py-2 mt-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                                                >
                                                    Upload Audio File
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Recording Walkthrough */}
                        {isRecording && (
                            <div className="mt-6">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recording...</h2>
                                <p className="text-gray-600 mb-4">
                                    Navigate through the slides as you record your walkthrough.
                                </p>
                                <button
                                    onClick={handleFinishRecording}
                                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
                                >
                                    Stop Recording
                                </button>
                            </div>
                        )}

                        {/* Display Recorded Audio */}
                        {!isRecording && recordedAudio && selectedOption === 'record' && (
                            <div className="mt-6">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recorded Audio</h2>
                                <input
                                    type="text"
                                    className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter audio name"
                                    value={newAudioName}
                                    onChange={(e) => setNewAudioName(e.target.value)}
                                />
                                <audio controls src={audioUrl} className="w-full mt-2 rounded-lg"></audio>
                                <div className="mt-4">
                                    <button
                                        onClick={handleUploadAudioFile}
                                        className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                                    >
                                        Upload Recorded Audio
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Countdown Display */}
                        {showCountdown && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
                                <div className="text-white text-6xl font-bold animate-pulse">{countdown}</div>
                            </div>
                        )}

                        {/* Slides */}
                        <div className="mt-8">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                                Slide {currentSlide} of {numSlides}
                            </h2>
                            {renderSlides()}
                            <div className="mt-4 flex items-center justify-between">
                                <button
                                    onClick={handlePrevSlide}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400"
                                    disabled={currentSlide === 1}
                                >
                                    Previous Slide
                                </button>
                                <button
                                    onClick={handleNextSlide}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400"
                                    disabled={currentSlide === numSlides}
                                >
                                    Next Slide
                                </button>
                            </div>
                        </div>

                        {/* Proceed Button */}
                        {!isRecording && (
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={handleProceed}
                                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                                >
                                    Proceed to Next Step
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateBrdgePage;
