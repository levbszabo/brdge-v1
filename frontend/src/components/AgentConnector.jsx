import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { api } from '../api';

function AgentConnector({ brdgeId, agentType = 'edit', token, userId }) {
    const [connectorUrl, setConnectorUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const iframeRef = useRef(null);
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);
    const [personalizationId, setPersonalizationId] = useState(null);

    // Extract personalization ID from URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (id) {
            setPersonalizationId(id);
            console.log('Extracted personalization ID from URL:', id);
        }
    }, []);

    // Add a CSS class to hide iframe controls
    useEffect(() => {
        if (iframeRef.current) {
            // Apply a style to hide any potential bottom controls
            const style = document.createElement('style');
            style.textContent = `
                .iframe-container iframe::-webkit-media-controls-panel {
                    display: none !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
                .iframe-container iframe::-webkit-media-controls {
                    display: none !important;
                }
                .iframe-container iframe::-webkit-media-controls-enclosure {
                    display: none !important;
                }
                .iframe-container iframe::part(control-panel) {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);

            return () => {
                document.head.removeChild(style);
            };
        }
    }, [iframeRef.current]);

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
            setIsLoading(true);
            setError(null);
            setConnectorUrl('');

            let missingRequiredProps = false;
            if (agentType === 'edit') {
                if (!brdgeId || !token || !userId) {
                    missingRequiredProps = true;
                    console.log('AgentConnector (Edit Mode) waiting for props:', { brdgeId, tokenExists: !!token, userIdExists: !!userId });
                }
            } else {
                if (!brdgeId) {
                    missingRequiredProps = true;
                    console.log('AgentConnector (View Mode) waiting for brdgeId');
                }
            }

            if (missingRequiredProps) {
                return;
            }

            console.log(`AgentConnector (${agentType} Mode) proceeding with props:`, { brdgeId, tokenExists: !!token, userIdExists: !!userId });

            try {
                if (!api.defaults.baseURL) {
                    throw new Error('API base URL is not configured');
                }

                const cleanApiBaseUrl = api.defaults.baseURL.replace(/\/$/, '');
                const baseUrl = process.env.REACT_APP_PLAYGROUND_URL;
                if (!baseUrl) {
                    throw new Error('Playground URL (REACT_APP_PLAYGROUND_URL) is not configured');
                }
                const params = new URLSearchParams({
                    brdgeId: brdgeId.toString(),
                    apiBaseUrl: cleanApiBaseUrl,
                    agentType: agentType,
                    mobile: isMobile ? '1' : '0',
                    userId: userId || `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                });

                // Add personalization ID if available
                if (personalizationId) {
                    params.append('id', personalizationId);
                    console.log('Adding personalization ID to iframe URL:', personalizationId);
                }

                const url = `${baseUrl}?${params.toString()}`;
                console.log('Connector URL (token removed):', url);
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
    }, [brdgeId, agentType, isMobile, userId, personalizationId]);

    useEffect(() => {
        if (isIframeLoaded && token && iframeRef.current && iframeRef.current.contentWindow) {
            const targetOrigin = process.env.NODE_ENV === 'development' ? '*' : window.location.origin;

            // Send initial message
            sendTokenMessage();

            // Set up retry with increasing delay
            const retryIntervals = [500, 1000]; // ms
            retryIntervals.forEach((delay, index) => {
                setTimeout(() => {
                    console.log(`Retry ${index + 1} sending AUTH_TOKEN`);
                    sendTokenMessage();
                }, delay);
            });

            function sendTokenMessage() {
                if (iframeRef.current?.contentWindow) {
                    console.log(`Sending AUTH_TOKEN to origin: ${targetOrigin}`);
                    iframeRef.current.contentWindow.postMessage(
                        { token: token, type: 'AUTH_TOKEN' },
                        targetOrigin // Now using wildcard (*) in development mode
                    );
                }
            }
        } else {
            console.log('Conditions not met for sending token via postMessage:', { isIframeLoaded, tokenExists: !!token, iframeExists: !!iframeRef.current });
        }
    }, [token, isIframeLoaded]);

    if (isLoading && !connectorUrl) {
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
                <Typography variant="h6">Initializing Connection...</Typography>
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
            className="iframe-container"
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
            {connectorUrl && (
                <iframe
                    ref={iframeRef}
                    src={connectorUrl}
                    title="Agent Connector"
                    allow="camera; microphone; display-capture; fullscreen; autoplay; encrypted-media"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-top-navigation-by-user-activation allow-downloads"
                    referrerPolicy="origin"
                    onLoad={() => setIsIframeLoaded(true)}
                    style={{
                        WebkitAppearance: 'none',
                        backgroundColor: 'transparent'
                    }}
                />
            )}
        </Box>
    );
}

export default AgentConnector; 