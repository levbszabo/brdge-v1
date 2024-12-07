import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { api } from '../api';

function AgentsPlayground({ brdgeId, agentType = 'edit', token }) {
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
                if (!api.defaults.baseURL) {
                    console.error('API base URL is not configured');
                    return;
                }

                const response = await api.get(`/brdges/${brdgeId}`);
                const brdgeData = response.data;

                if (!brdgeData.num_slides) {
                    console.error('No slides found in brdge data:', brdgeData);
                    return;
                }

                const cleanApiBaseUrl = api.defaults.baseURL.replace(/\/$/, '');
                const baseUrl = process.env.REACT_APP_PLAYGROUND_URL || 'http://localhost:3001';
                const params = new URLSearchParams({
                    brdgeId: brdgeId.toString(),
                    numSlides: brdgeData.num_slides.toString(),
                    apiBaseUrl: cleanApiBaseUrl,
                    agentType: agentType,
                    token: token || ''
                });

                const url = `${baseUrl}?${params.toString()}`;
                setPlaygroundUrl(url);
            } catch (error) {
                console.error('Error fetching brdge data:', error.response || error);
            } finally {
                setIsLoading(false);
            }
        };

        initPlayground();
    }, [brdgeId, agentType, token]);

    if (isLoading) {
        return (
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
            }}>
                <Typography variant="h6">Loading Brdge...</Typography>
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
                <Typography variant="h6">Error: Unable to load Brdge data</Typography>
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