import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { api } from '../api';

function AgentConnector({ brdgeId, agentType = 'edit', token }) {
    const [connectorUrl, setConnectorUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
                    token: token || '',
                    mobile: isMobile ? '1' : '0'
                });

                const url = `${baseUrl}?${params.toString()}`;
                console.log('Connector URL:', url);
                setConnectorUrl(url);
                setError(null);
            } catch (error) {
                console.error('Connection error:', error);
                setError(error.message || 'Failed to initialize connection');
            } finally {
                setIsLoading(false);
            }
        };

        initConnection();
    }, [brdgeId, agentType, token, isMobile]);

    useEffect(() => {
        const initAudio = async () => {
            try {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                const audioContext = new AudioContextClass();
                await audioContext.resume();
            } catch (error) {
                console.error('Error initializing audio:', error);
            }
        };

        initAudio();
    }, []);

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