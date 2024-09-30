// src/pages/CreateBrdgePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function CreateBrdgePage() {
    const [name, setName] = useState('');
    const [presentation, setPresentation] = useState(null);
    const [brdgeId, setBrdgeId] = useState(null);
    const [numSlides, setNumSlides] = useState(0);
    const [transcripts, setTranscripts] = useState([]);
    const [message, setMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
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
        // Navigate to the upload audio page with brdge details
        navigate('/upload-audio', { state: { brdgeName: name, brdgeId, transcripts } });
    };

    const renderSlides = () => {
        const slides = [];
        for (let i = 1; i <= numSlides; i++) {
            const imageUrl = `http://localhost:5000/api/brdges/${brdgeId}/slides/${i}`;
            slides.push(
                <div key={i} className="border rounded overflow-hidden">
                    <img src={imageUrl} alt={`Slide ${i}`} className="w-full" />
                    <div className="p-4">
                        <label className="block text-gray-700 mb-2">Transcript for Slide {i}</label>
                        <textarea
                            className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            value={transcripts[i - 1] || ''}
                            onChange={(e) => handleTranscriptChange(i - 1, e.target.value)}
                            placeholder={`Enter transcript for slide ${i}...`}
                        />
                    </div>
                </div>
            );
        }
        return slides;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
            <div className="bg-white shadow rounded p-8 max-w-4xl w-full">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    {isEditMode ? 'Edit Brdge' : 'Create New Brdge'}
                </h1>
                {message && <p className="mb-4 text-green-600">{message}</p>}
                {!brdgeId && (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Brdge Name</label>
                            <input
                                type="text"
                                className="w-full mt-2 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700">Presentation (PDF)</label>
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
                                className={`px-4 py-2 ${isProcessing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                                    } text-white rounded`}
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
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Display Slide Images with Transcripts */}
                {brdgeId && numSlides > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Slide Images</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{renderSlides()}</div>
                        {/* Proceed with Audio Upload */}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleProceed}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Proceed to Upload Audio
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateBrdgePage;
