import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { api } from '../api';

function AgentsPlayground({ brdgeId }) {
    const [playgroundUrl, setPlaygroundUrl] = useState('');

    useEffect(() => {
        const initPlayground = async () => {
            try {
                // Fetch brdge data
                const response = await api.get(`/brdges/${brdgeId}`);
                const brdgeData = response.data;

                console.log('Brdge data:', brdgeData); // Debug log

                // Construct URL with brdge data
                const baseUrl = 'http://localhost:3001';
                const params = new URLSearchParams({
                    brdgeId,
                    numSlides: brdgeData.num_slides,
                    apiBaseUrl: api.defaults.baseURL // Pass our API base URL to the playground
                });

                const url = `${baseUrl}?${params.toString()}`;
                console.log('Playground URL:', url); // Debug log

                setPlaygroundUrl(url);
            } catch (error) {
                console.error('Error fetching brdge data:', error);
            }
        };

        if (brdgeId) {
            initPlayground();
        }
    }, [brdgeId]);

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                '& > iframe': {
                    width: '100%',
                    height: '100%',
                    border: 'none'
                }
            }}
        >
            {playgroundUrl && (
                <iframe
                    src={playgroundUrl}
                    title="Agents Playground"
                    allow="camera; microphone; display-capture; fullscreen"
                />
            )}
        </Box>
    );
}

export default AgentsPlayground; 