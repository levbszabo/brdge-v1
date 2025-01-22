import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { api } from '../api';

function AgentConnector({ brdgeId, agentType = 'edit', token }) {
    const [connectorUrl, setConnectorUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initConnection = async () => {
            if (!brdgeId) {
                setError('No brdgeId provided');
                setIsLoading(false);
                return;
            }

            try {
                if (!api.defaults.baseURL) {
                    throw new Error('API base URL is not configured');
                }

                const cleanApiBaseUrl = api.defaults.baseURL.replace(/\/$/, '');
                const baseUrl = process.env.REACT_APP_PLAYGROUND_URL;
                const params = new URLSearchParams({
                    brdgeId: brdgeId.toString(),
                    apiBaseUrl: cleanApiBaseUrl,
                    agentType: agentType,
                    token: token || ''
                });

                const url = `${baseUrl}?${params.toString()}`;
                setConnectorUrl(url);
                setError(null);
            } catch (error) {
                setError(error.message || 'Failed to initialize connection');
                console.error('Connection error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initConnection();
    }, [brdgeId, agentType, token]);

    if (isLoading) {
        return (
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                gap: 2
            }}>
                <CircularProgress color="inherit" size={24} />
                <Typography variant="h6">Connecting to Agent...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'error.main'
            }}>
                <Typography variant="h6">Error: {error}</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                position: 'relative',
                '& > iframe': {
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    overflow: 'hidden',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }
            }}
        >
            <iframe
                src={connectorUrl}
                title="Agent Connector"
                allow="camera; microphone; display-capture; fullscreen; autoplay; encrypted-media"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-top-navigation-by-user-activation"
                referrerPolicy="origin"
            />
        </Box>
    );
}

export default AgentConnector; 