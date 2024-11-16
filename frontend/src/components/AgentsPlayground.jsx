import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { api } from '../api';

function AgentsPlayground({ brdgeId }) {
    const [playgroundUrl, setPlaygroundUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initPlayground = async () => {
            if (!brdgeId) {
                console.error('No brdgeId provided to AgentsPlayground');
                return;
            }

            setIsLoading(true);
            try {
                // First, ensure we have a valid API base URL
                if (!api.defaults.baseURL) {
                    console.error('API base URL is not configured');
                    return;
                }

                console.log('Fetching brdge data for ID:', brdgeId);
                const response = await api.get(`/brdges/${brdgeId}`);
                const brdgeData = response.data;
                console.log('Received brdge data:', brdgeData);

                if (!brdgeData.num_slides) {
                    console.error('No slides found in brdge data:', brdgeData);
                    return;
                }

                // Ensure API base URL doesn't end with a slash
                const cleanApiBaseUrl = api.defaults.baseURL.replace(/\/$/, '');

                // Construct URL with brdge data
                const baseUrl = 'http://localhost:3001';
                const params = new URLSearchParams({
                    brdgeId: brdgeId.toString(),
                    numSlides: brdgeData.num_slides.toString(),
                    apiBaseUrl: cleanApiBaseUrl
                });

                const url = `${baseUrl}?${params.toString()}`;
                console.log('Constructed playground URL:', url);

                setPlaygroundUrl(url);
            } catch (error) {
                console.error('Error fetching brdge data:', error.response || error);
            } finally {
                setIsLoading(false);
            }
        };

        initPlayground();
    }, [brdgeId]);

    if (isLoading) {
        return (
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                Loading Brdge...
            </Box>
        );
    }

    if (!playgroundUrl) {
        return (
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'error.main'
            }}>
                Error: Unable to load Brdge data
            </Box>
        );
    }

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
            <iframe
                src={playgroundUrl}
                title="Agents Playground"
                allow="camera; microphone; display-capture; fullscreen"
            />
        </Box>
    );
}

export default AgentsPlayground; 