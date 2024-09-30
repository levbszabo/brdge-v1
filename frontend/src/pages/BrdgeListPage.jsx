// src/pages/BrdgeListPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function BrdgeListPage() {
    const [brdges, setBrdges] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get('http://localhost:5000/api/brdges')
            .then(response => setBrdges(response.data))
            .catch(error => console.error('Error fetching brdges:', error));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Brdges</h1>
                    <Link to="/create" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Create New Brdge
                    </Link>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8">
                {brdges.length === 0 ? (
                    <p className="text-gray-600">No brdges found. Click "Create New Brdge" to get started.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {brdges.map(brdge => (
                            <div key={brdge.id} className="bg-white shadow rounded overflow-hidden">
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2 text-gray-800">{brdge.name}</h2>
                                    <p className="text-gray-600 mb-1">
                                        Presentation: {brdge.presentation_filename}
                                    </p>
                                    <p className="text-gray-600">
                                        Audio: {brdge.audio_filename || 'N/A'}
                                    </p>
                                </div>
                                <div className="p-4 border-t">
                                    <button
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
                                        onClick={() => navigate(`/edit/${brdge.id}`)} // Navigate to edit route
                                    >
                                        Edit
                                    </button>
                                    <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                        Continue with AI Workflow
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default BrdgeListPage;
