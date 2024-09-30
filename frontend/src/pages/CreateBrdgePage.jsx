// src/pages/CreateBrdgePage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { S3_BUCKET_URL } from '../config'; // Import the S3 bucket URL

function CreateBrdgePage() {
    const [name, setName] = useState('');
    const [presentation, setPresentation] = useState(null);
    const [slideImages, setSlideImages] = useState([]);
    const [transcripts, setTranscripts] = useState([]);
    const [message, setMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !presentation) {
            setMessage('Please fill out all fields.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('presentation', presentation);

        try {
            setIsProcessing(true);
            const response = await axios.post('http://localhost:5000/api/brdges', formData);
            setMessage(response.data.message);

            let slideUrls = response.data.slide_image_urls;

            if (slideUrls && slideUrls.length > 0) {
                // Check if slideUrls are full URLs or keys
                if (slideUrls[0].startsWith('http')) {
                    // slideUrls are full URLs
                    setSlideImages(slideUrls);
                } else {
                    // slideUrls are keys, construct full URLs
                    const slideUrlsFull = slideUrls.map(key => `${S3_BUCKET_URL}/${key}`);
                    setSlideImages(slideUrlsFull);
                }
                setTranscripts(new Array(slideUrls.length).fill('')); // Initialize transcripts array
            } else {
                setMessage('No slide images were returned from the server.');
            }
            setIsProcessing(false);
        } catch (error) {
            console.error('Error creating brdge:', error);
            setMessage('Error creating brdge.');
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
        // You can send the transcripts to the backend here if needed
        // For now, we'll navigate to the next page
        navigate('/upload-audio', { state: { brdgeName: name, transcripts } });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
            <div className="bg-white shadow rounded p-8 max-w-4xl w-full">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Brdge</h1>
                {message && <p className="mb-4 text-green-600">{message}</p>}
                {!slideImages.length && (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Brdge Name</label>
                            <input
                                type="text"
                                className="w-full mt-2 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700">Presentation (PDF)</label>
                            <input
                                type="file"
                                accept=".pdf"
                                className="w-full mt-2"
                                onChange={e => setPresentation(e.target.files[0])}
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className={`px-4 py-2 ${isProcessing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded`}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Processing...' : 'Upload and Convert'}
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
                {slideImages.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Slide Images</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {slideImages.map((imageUrl, index) => (
                                <div key={index} className="border rounded overflow-hidden">
                                    <img src={imageUrl} alt={`Slide ${index + 1}`} className="w-full" />
                                    <div className="p-4">
                                        <label className="block text-gray-700 mb-2">
                                            Transcript for Slide {index + 1}
                                        </label>
                                        <textarea
                                            className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows="4"
                                            value={transcripts[index]}
                                            onChange={(e) => handleTranscriptChange(index, e.target.value)}
                                            placeholder={`Enter transcript for slide ${index + 1}...`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
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
