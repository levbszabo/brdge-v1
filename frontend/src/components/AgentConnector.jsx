import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { api } from '../api';
import { isSafari, isIOS } from '../utils/browserDetection';

function AgentConnector({ brdgeId, agentType = 'edit', token, userId, isEmbed = false, preventSafariScroll = false, personalizationId: propPersonalizationId }) {
    const [connectorUrl, setConnectorUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const iframeRef = useRef(null);
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);
    const [personalizationId, setPersonalizationId] = useState(null);
    const messageQueueRef = useRef([]);
    const authSentRef = useRef(false);
    const containerRef = useRef(null);

    // Handle personalization ID from props or URL with improved logic
    useEffect(() => {
        let finalPersonalizationId = null;

        if (propPersonalizationId) {
            // Use personalization ID from props (preferred for embedded scenarios)
            console.log('🔗 AgentConnector: Using personalization ID from props:', propPersonalizationId);
            finalPersonalizationId = propPersonalizationId;
        } else {
            // Fallback to URL extraction for backwards compatibility (ViewBrdgePage scenarios)
            const urlParams = new URLSearchParams(window.location.search);

            // Check for both parameter names for maximum compatibility
            const pidParam = urlParams.get('pid');  // ViewBrdgePage format
            const idParam = urlParams.get('id');    // Direct playground format

            finalPersonalizationId = pidParam || idParam;

            if (finalPersonalizationId) {
                console.log('🔍 AgentConnector: Found personalization ID in URL:', {
                    source: pidParam ? 'pid parameter' : 'id parameter',
                    value: finalPersonalizationId
                });
            } else {
                console.log('⚠️ AgentConnector: No personalization ID found in URL or props');
            }
        }

        setPersonalizationId(finalPersonalizationId);
    }, [propPersonalizationId]);

    // Apply embed-specific styles and scroll prevention
    useEffect(() => {
        // Only prevent focus-based auto-scrolling, never lock parent scroll
        if (containerRef.current) {
            // Prevent the iframe container from participating in scroll events
            containerRef.current.style.overflow = 'hidden';
            containerRef.current.style.position = 'relative';

            // Prevent focus from triggering scroll
            const preventFocusScroll = (e) => {
                // Ensure e.target is a valid DOM Node before using contains
                if (!e.target || !e.target.nodeType) {
                    return;
                }

                if (e.target === iframeRef.current ||
                    (containerRef.current && containerRef.current.contains && containerRef.current.contains(e.target))) {
                    // Save current scroll position
                    const scrollX = window.pageXOffset;
                    const scrollY = window.pageYOffset;

                    // Restore scroll position on next frame if it changed
                    requestAnimationFrame(() => {
                        if (window.pageXOffset !== scrollX || window.pageYOffset !== scrollY) {
                            window.scrollTo(scrollX, scrollY);
                        }
                    });
                }
            };

            // Only add focus scroll prevention
            window.addEventListener('focus', preventFocusScroll, true);
            window.addEventListener('focusin', preventFocusScroll, true);

            return () => {
                window.removeEventListener('focus', preventFocusScroll, true);
                window.removeEventListener('focusin', preventFocusScroll, true);
            };
        }
    }, [isEmbed, brdgeId]);

    // Add CSS to prevent iframe controls
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .iframe-container {
                position: relative;
                width: 100%;
                height: 100%;
                overflow: hidden;
                -webkit-overflow-scrolling: auto;
            }
            .iframe-container iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
                background: transparent;
                overflow: hidden;
            }
            .iframe-container iframe::-webkit-media-controls-panel,
            .iframe-container iframe::-webkit-media-controls,
            .iframe-container iframe::-webkit-media-controls-enclosure,
            .iframe-container iframe::part(control-panel) {
                display: none !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
            /* Prevent focus outline that might trigger scrolling */
            .iframe-container iframe:focus {
                outline: none;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

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
            authSentRef.current = false;

            // Validate required props based on agent type
            let missingRequiredProps = false;
            if (agentType === 'edit') {
                if (!brdgeId || !token || !userId) {
                    console.log('⚠️ AgentConnector: Missing required props for edit mode:', {
                        brdgeId: !!brdgeId,
                        token: !!token,
                        userId: !!userId
                    });
                    missingRequiredProps = true;
                }
            } else {
                if (!brdgeId) {
                    console.log('⚠️ AgentConnector: Missing brdgeId for view mode');
                    missingRequiredProps = true;
                }
            }

            if (missingRequiredProps) {
                setIsLoading(false);
                setError('Missing required configuration parameters');
                return;
            }

            try {
                if (!api.defaults.baseURL) {
                    throw new Error('API base URL is not configured');
                }

                const cleanApiBaseUrl = api.defaults.baseURL.replace(/\/$/, '');
                const baseUrl = process.env.REACT_APP_PLAYGROUND_URL;
                if (!baseUrl) {
                    throw new Error('Playground URL (REACT_APP_PLAYGROUND_URL) is not configured');
                }

                // Build iframe URL parameters
                const params = new URLSearchParams({
                    brdgeId: brdgeId.toString(),
                    apiBaseUrl: cleanApiBaseUrl,
                    agentType: agentType,
                    mobile: isMobile ? '1' : '0',
                    userId: userId || `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    embed: isEmbed ? '1' : '0'
                });

                // Add personalization ID if available
                if (personalizationId) {
                    console.log('🎯 AgentConnector: Adding personalization ID to iframe URL:', {
                        personalizationId,
                        source: propPersonalizationId ? 'props' : 'URL',
                        agentType,
                        isEmbed
                    });
                    params.append('id', personalizationId);
                } else {
                    console.log('ℹ️ AgentConnector: No personalization ID - creating standard session');
                }

                const url = `${baseUrl}?${params.toString()}`;
                console.log('🔗 AgentConnector: Final iframe URL constructed:', url);

                setConnectorUrl(url);
                setError(null);
            } catch (error) {
                console.error('❌ AgentConnector: Connection error:', error);
                setError(error.message || 'Failed to initialize connection');
            } finally {
                setIsLoading(false);
            }
        };

        initConnection();
    }, [brdgeId, agentType, isMobile, userId, personalizationId, isEmbed, token]);

    // Enhanced message sending for Safari compatibility
    const sendAuthMessage = () => {
        if (!token || !iframeRef.current?.contentWindow || authSentRef.current) {
            return;
        }

        const targetOrigin = process.env.NODE_ENV === 'development' ? '*' : window.location.origin;
        const message = { token: token, type: 'AUTH_TOKEN' };

        try {
            iframeRef.current.contentWindow.postMessage(message, targetOrigin);
            authSentRef.current = true;
            console.log('✅ AgentConnector: Auth message sent to iframe');
        } catch (error) {
            console.error('❌ AgentConnector: Error sending auth message:', error);
        }
    };

    // Queue messages until iframe is ready
    const queueMessage = (message) => {
        if (isIframeLoaded) {
            sendAuthMessage();
        } else {
            messageQueueRef.current.push(message);
        }
    };

    // Process queued messages when iframe loads
    useEffect(() => {
        if (isIframeLoaded && messageQueueRef.current.length > 0) {
            messageQueueRef.current.forEach(() => sendAuthMessage());
            messageQueueRef.current = [];
        }
    }, [isIframeLoaded]);

    // Send auth token when conditions are met
    useEffect(() => {
        if (isIframeLoaded && token && iframeRef.current) {
            // Use requestAnimationFrame to ensure DOM is settled
            requestAnimationFrame(() => {
                sendAuthMessage();

                // Retry mechanism for Safari
                if (isSafari() || isIOS()) {
                    const retryCount = 3;
                    for (let i = 1; i <= retryCount; i++) {
                        setTimeout(() => {
                            if (!authSentRef.current) {
                                sendAuthMessage();
                            }
                        }, i * 200);
                    }
                }
            });
        }
    }, [token, isIframeLoaded]);

    const handleIframeLoad = () => {
        console.log('🔌 AgentConnector: Iframe loaded successfully');
        setIsIframeLoaded(true);

        // Only prevent auto-focus, don't interfere with scrolling
        if (iframeRef.current) {
            // Prevent iframe from stealing focus on load
            iframeRef.current.blur();

            // If something inside the iframe has focus, blur it
            if (document.activeElement === iframeRef.current || iframeRef.current.contains(document.activeElement)) {
                document.activeElement.blur();
            }
        }
    };

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
            ref={containerRef}
            className="iframe-container"
            sx={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                position: 'relative'
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
                    onLoad={handleIframeLoad}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        backgroundColor: 'transparent',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                    scrolling="no"
                    loading="eager"
                    tabIndex={-1}
                />
            )}
        </Box>
    );
}

export default AgentConnector; 