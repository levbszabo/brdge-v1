import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Box,
    Typography,
    Paper,
    Chip,
    useTheme,
    CircularProgress,
    Alert,
    Tooltip,
    Badge,
    IconButton,
    Dialog,
    DialogContent,
    AppBar,
    Toolbar,
    Slider,
    ButtonGroup,
    Button
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Database,
    Cloud,
    Cpu,
    Globe,
    Smartphone,
    Bot,
    Zap,
    BarChart3,
    Shield,
    GitBranch,
    Server,
    Monitor,
    HardDrive,
    CreditCard,
    MessageSquare,
    Box as BoxIcon,
    ExternalLink,
    User,
    Brain,
    Share2,
    Maximize2,
    Minimize2,
    ZoomIn,
    ZoomOut,
    Move,
    RotateCcw,
    Download,
    X
} from 'lucide-react';

const SystemDiagramPanel = ({ chatHistory = [] }) => {
    const theme = useTheme();
    const [diagramData, setDiagramData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastChatLength, setLastChatLength] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoom, setZoom] = useState(0.75); // Start at 75% zoom for better overview
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const svgRef = useRef(null);
    const containerRef = useRef(null);

    const iconMap = useMemo(() => ({
        'user': User,
        'monitor': Monitor,
        'server': Server,
        'database': Database,
        'globe': Globe,
        'brain': Brain,
        'flow': Share2,
        'hard-drive': HardDrive,
        'shield': Shield,
        'credit-card': CreditCard,
        'message-square': MessageSquare,
        'bar-chart': BarChart3,
        'cloud': Cloud,
        'box': BoxIcon,
        'external-link': ExternalLink,
        'cpu': Cpu,
        'smartphone': Smartphone,
        'bot': Bot,
        'zap': Zap,
        'git-branch': GitBranch
    }), []);

    useEffect(() => {
        const shouldGenerate = chatHistory.length > 0 &&
            chatHistory.length !== lastChatLength &&
            (chatHistory.length >= 3 || chatHistory.length % 2 === 0);

        if (shouldGenerate) {
            generateDiagram();
            setLastChatLength(chatHistory.length);
        }
    }, [chatHistory, lastChatLength]);

    const generateDiagram = async () => {
        if (chatHistory.length < 2) return;
        setIsLoading(true);
        setError(null);
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/generate-system-diagram`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_history: chatHistory })
            });
            if (!response.ok) throw new Error('Failed to generate diagram');
            const data = await response.json();
            setDiagramData(data);
            // Auto-fit the diagram to view
            if (data.components && data.components.length > 0) {
                // Calculate optimal zoom based on component distribution
                const xCoords = data.components.map(c => c.position.x);
                const yCoords = data.components.map(c => c.position.y);
                const minX = Math.min(...xCoords);
                const maxX = Math.max(...xCoords.map((x, i) => x + data.components[i].size.width));
                const minY = Math.min(...yCoords);
                const maxY = Math.max(...yCoords.map((y, i) => y + data.components[i].size.height));

                const diagramWidth = maxX - minX + 100; // Add padding
                const diagramHeight = maxY - minY + 100;

                // Calculate zoom to fit
                const containerWidth = 1000; // Approximate container width  
                const containerHeight = 700; // Approximate container height
                const zoomX = containerWidth / diagramWidth;
                const zoomY = containerHeight / diagramHeight;
                const optimalZoom = Math.min(zoomX, zoomY, 1); // Don't zoom in more than 100%

                setZoom(Math.max(0.5, Math.min(optimalZoom, 0.9))); // Keep between 50% and 90%
                setPanOffset({ x: 0, y: 0 });
            } else {
                handleResetView();
            }
        } catch (err) {
            console.error('Diagram generation error:', err);
            setError('Failed to generate architecture diagram');
        } finally {
            setIsLoading(false);
        }
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.25, 0.25));
    };

    const handleResetView = () => {
        setZoom(0.75);
        setPanOffset({ x: 0, y: 0 });
    };

    const handleMouseDown = (e) => {
        if (e.button === 0) { // Left click only
            setIsPanning(true);
            setDragStart({
                x: e.clientX - panOffset.x,
                y: e.clientY - panOffset.y
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isPanning) {
            setPanOffset({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom(prev => Math.max(0.25, Math.min(3, prev + delta)));
    };

    const downloadDiagramAsSVG = () => {
        if (!diagramData) return;

        const canvasWidth = diagramData?.layout_config?.canvas_size?.width || 900;
        const canvasHeight = diagramData?.layout_config?.canvas_size?.height || 750;

        // Create a complete SVG with all elements
        const svgContent = `
            <svg width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#666666" />
                    </marker>
                </defs>
                <rect width="100%" height="100%" fill="white"/>
                ${diagramData.connections?.map(connection => {
            const sourceComp = diagramData.components.find(c => c.id === connection.source);
            const targetComp = diagramData.components.find(c => c.id === connection.target);
            if (!sourceComp || !targetComp) return '';

            const sourceX = sourceComp.position.x + sourceComp.size.width / 2;
            const sourceY = sourceComp.position.y + sourceComp.size.height / 2;
            const targetX = targetComp.position.x + targetComp.size.width / 2;
            const targetY = targetComp.position.y + targetComp.size.height / 2;
            const midX = (sourceX + targetX) / 2;
            const midY = (sourceY + targetY) / 2;
            const distance = Math.sqrt(Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2));
            const curveHeight = Math.min(80, Math.max(30, distance * 0.2));
            const controlX = midX;
            const controlY = midY - curveHeight;
            const path = `M ${sourceX} ${sourceY} Q ${controlX} ${controlY} ${targetX} ${targetY}`;

            return `
                        <path d="${path}" stroke="${connection.style?.strokeColor || '#666666'}" stroke-width="${connection.style?.strokeWidth || 2}" fill="none" marker-end="url(#arrowhead)" />
                        ${connection.label ? `
                            <rect x="${midX - 45}" y="${midY - 12}" width="90" height="24" fill="white" stroke="#e0e0e0" stroke-width="1" rx="12" opacity="0.95" />
                            <text x="${midX}" y="${midY + 3}" text-anchor="middle" font-size="11" fill="#333333" font-weight="500">${connection.label}</text>
                        ` : ''}
                    `;
        }).join('')}
                ${diagramData.components?.map(component => `
                    <g>
                        <rect x="${component.position.x}" y="${component.position.y}" width="${component.size.width}" height="${component.size.height}" 
                              fill="${component.color}" stroke="${component.color}" stroke-width="1" rx="12" 
                              filter="drop-shadow(0 4px 8px rgba(0,0,0,0.1))" />
                        <text x="${component.position.x + component.size.width / 2}" y="${component.position.y + component.size.height / 2 - 5}" 
                              text-anchor="middle" font-size="14" font-weight="700" fill="white">${component.name}</text>
                        <text x="${component.position.x + component.size.width / 2}" y="${component.position.y + component.size.height / 2 + 10}" 
                              text-anchor="middle" font-size="10" fill="white" opacity="0.8">${component.type.toUpperCase()}</text>
                        ${component.technology ? `
                            <text x="${component.position.x + component.size.width / 2}" y="${component.position.y + component.size.height / 2 + 22}" 
                                  text-anchor="middle" font-size="8" fill="white" opacity="0.7">${component.technology}</text>
                        ` : ''}
                    </g>
                `).join('')}
            </svg>
        `;

        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `system-architecture-${Date.now()}.svg`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const renderComponentNode = (component, isInFullscreen = false) => {
        const IconComponent = iconMap[component.icon] || BoxIcon;
        const componentColor = component.color || theme.palette.grey[500];

        // Better text color calculation for readability
        const luminance = (r, g, b) => {
            const [rs, gs, bs] = [r, g, b].map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        };

        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };

        const rgb = hexToRgb(componentColor);
        const colorLuminance = rgb ? luminance(rgb.r, rgb.g, rgb.b) : 0;
        const textColor = colorLuminance > 0.5 ? '#1a1a1a' : '#ffffff';
        const iconBgColor = colorLuminance > 0.5 ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)';

        // Truncate text to fit in component
        const truncateText = (text, maxLength) => {
            return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
        };

        const tooltipTitle = (
            <React.Fragment>
                <Typography color="inherit" sx={{ fontWeight: 600 }}>{component.name}</Typography>
                <Typography variant="body2" sx={{ my: 0.5 }}>{component.description}</Typography>
                {component.technology && <Typography variant="caption" display="block">Tech: {component.technology}</Typography>}
                <Typography variant="caption" display="block">Confidence: {Math.round(component.confidence * 100)}%</Typography>
            </React.Fragment>
        );

        return (
            <Tooltip title={tooltipTitle} arrow placement="top" enterDelay={300} key={component.id}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
                    style={{
                        position: 'absolute',
                        top: component.position.y,
                        left: component.position.x,
                        width: component.size.width,
                        height: component.size.height,
                        zIndex: 2,
                        cursor: isPanning ? 'grabbing' : 'pointer'
                    }}
                >
                    <Paper
                        elevation={8}
                        sx={{
                            width: '100%',
                            height: '100%',
                            p: 2,
                            borderRadius: '16px',
                            bgcolor: componentColor,
                            color: textColor,
                            boxShadow: `0 12px 32px ${componentColor}30, 0 4px 16px rgba(0,0,0,0.1)`,
                            border: `2px solid ${componentColor}`,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '3px',
                                background: `linear-gradient(90deg, transparent, ${textColor}40, transparent)`,
                                opacity: 0.6
                            },
                            '&:hover': {
                                transform: 'translateY(-6px) scale(1.02)',
                                boxShadow: `0 20px 48px ${componentColor}40, 0 8px 24px rgba(0,0,0,0.15)`,
                                '& .component-icon': {
                                    transform: 'scale(1.1) rotate(5deg)',
                                }
                            }
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 1
                        }}>
                            <Box
                                className="component-icon"
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '10px',
                                    background: iconBgColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'transform 0.3s ease',
                                    boxShadow: `0 2px 8px rgba(0,0,0,0.1)`
                                }}
                            >
                                <IconComponent size={20} />
                            </Box>
                            {component.technology && (
                                <Chip
                                    label={truncateText(component.technology, 8)}
                                    size="small"
                                    sx={{
                                        bgcolor: iconBgColor,
                                        color: textColor,
                                        fontSize: '0.65rem',
                                        fontWeight: 600,
                                        height: '22px',
                                        maxWidth: '60%',
                                        '& .MuiChip-label': {
                                            px: 1
                                        }
                                    }}
                                />
                            )}
                        </Box>
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography sx={{
                                fontWeight: 800,
                                fontSize: '1.1rem',
                                lineHeight: 1.2,
                                mb: 0.5,
                                textAlign: 'center',
                                wordBreak: 'break-word',
                                hyphens: 'auto'
                            }}>
                                {truncateText(component.name, 18)}
                            </Typography>
                            <Typography variant="caption" sx={{
                                opacity: 0.85,
                                textTransform: 'uppercase',
                                fontWeight: 600,
                                textAlign: 'center',
                                letterSpacing: '0.5px',
                                fontSize: '0.7rem'
                            }}>
                                {component.type}
                            </Typography>
                        </Box>
                    </Paper>
                </motion.div>
            </Tooltip>
        );
    };

    const renderConnection = (connection, components) => {
        const sourceComp = components.find(c => c.id === connection.source);
        const targetComp = components.find(c => c.id === connection.target);
        if (!sourceComp || !targetComp) return null;

        // Calculate connection points from edge of components, not center
        const sourceX = sourceComp.position.x + sourceComp.size.width / 2;
        const sourceY = sourceComp.position.y + sourceComp.size.height / 2;
        const targetX = targetComp.position.x + targetComp.size.width / 2;
        const targetY = targetComp.position.y + targetComp.size.height / 2;

        // Calculate angle and adjust connection points to component edges
        const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
        const sourceEdgeX = sourceX + Math.cos(angle) * (sourceComp.size.width / 2);
        const sourceEdgeY = sourceY + Math.sin(angle) * (sourceComp.size.height / 2);
        const targetEdgeX = targetX - Math.cos(angle) * (targetComp.size.width / 2);
        const targetEdgeY = targetY - Math.sin(angle) * (targetComp.size.height / 2);

        const midX = (sourceEdgeX + targetEdgeX) / 2;
        const midY = (sourceEdgeY + targetEdgeY) / 2;

        // Calculate curve height based on distance - less pronounced curves
        const distance = Math.sqrt(Math.pow(targetEdgeX - sourceEdgeX, 2) + Math.pow(targetEdgeY - sourceEdgeY, 2));
        const curveHeight = Math.min(50, Math.max(20, distance * 0.15));

        // Adjust control point
        const controlX = midX;
        const controlY = midY - curveHeight;

        const path = `M ${sourceEdgeX} ${sourceEdgeY} Q ${controlX} ${controlY} ${targetEdgeX} ${targetEdgeY}`;

        // Smart label positioning to avoid overlap
        const labelX = controlX;
        const labelY = controlY + 5;

        return (
            <motion.g key={connection.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
                {/* Subtle glow effect */}
                <motion.path
                    d={path}
                    stroke={connection.style?.strokeColor || theme.palette.primary.main}
                    strokeWidth={(connection.style?.strokeWidth || 1.5) + 2}
                    strokeDasharray={connection.style?.strokeDashArray || '0'}
                    fill="none"
                    opacity="0.3"
                />
                {/* Main path */}
                <motion.path
                    d={path}
                    stroke={connection.style?.strokeColor || theme.palette.primary.main}
                    strokeWidth={connection.style?.strokeWidth || 1.5}
                    strokeDasharray={connection.style?.strokeDashArray || '0'}
                    fill="none"
                    markerEnd="url(#arrowhead)"
                    strokeLinecap="round"
                    style={{
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                />
                {connection.label && (
                    <g>
                        {/* Label background with better positioning */}
                        <rect
                            x={labelX - (connection.label.length * 3.5)}
                            y={labelY - 12}
                            width={connection.label.length * 7}
                            height="20"
                            fill={theme.palette.background.paper}
                            stroke={theme.palette.divider}
                            strokeWidth="1"
                            rx="10"
                            opacity="0.95"
                            style={{
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                            }}
                        />
                        <text
                            x={labelX}
                            y={labelY}
                            textAnchor="middle"
                            fontSize="9"
                            fill={theme.palette.text.primary}
                            style={{
                                pointerEvents: 'none',
                                fontWeight: 600,
                                fontFamily: 'system-ui, -apple-system, sans-serif'
                            }}
                        >
                            {connection.label}
                        </text>
                    </g>
                )}
            </motion.g>
        );
    };

    const renderDiagramContent = (isInFullscreen = false) => {
        const canvasWidth = diagramData?.layout_config?.canvas_size?.width || 1000;
        const canvasHeight = diagramData?.layout_config?.canvas_size?.height || 800;

        return (
            <Box
                ref={containerRef}
                sx={{
                    flex: 1,
                    position: 'relative',
                    borderRadius: 2,
                    border: `2px solid ${theme.palette.divider}`,
                    background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[50]} 100%)`,
                    overflow: 'hidden',
                    cursor: isPanning ? 'grabbing' : 'grab',
                    minHeight: '400px',
                    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            >
                <div
                    style={{
                        transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                        transformOrigin: 'center center',
                        transition: isPanning ? 'none' : 'transform 0.2s ease-out',
                        width: '100%',
                        height: '100%',
                        position: 'relative'
                    }}
                >
                    <svg
                        ref={svgRef}
                        width={canvasWidth}
                        height={canvasHeight}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1
                        }}
                        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                    >
                        <defs>
                            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                                <polygon points="0 0, 8 3, 0 6" fill={theme.palette.primary.main} />
                            </marker>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke={theme.palette.divider} strokeWidth="0.5" opacity="0.2" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        <AnimatePresence>
                            {diagramData?.connections?.map(connection => renderConnection(connection, diagramData.components))}
                        </AnimatePresence>
                    </svg>

                    <div style={{
                        position: 'absolute',
                        width: canvasWidth,
                        height: canvasHeight,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}>
                        <AnimatePresence>
                            {diagramData?.components?.map(component => renderComponentNode(component, isInFullscreen))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Zoom Controls */}
                <Box sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.divider}`,
                    p: 1
                }}>
                    <ButtonGroup orientation="vertical" size="small" variant="outlined">
                        <Button onClick={handleZoomIn} startIcon={<ZoomIn size={16} />}>
                            Zoom In
                        </Button>
                        <Button onClick={handleZoomOut} startIcon={<ZoomOut size={16} />}>
                            Zoom Out
                        </Button>
                        <Button onClick={handleResetView} startIcon={<RotateCcw size={16} />}>
                            Reset
                        </Button>
                    </ButtonGroup>
                    <Slider
                        orientation="vertical"
                        value={zoom}
                        onChange={(e, value) => setZoom(value)}
                        min={0.25}
                        max={3}
                        step={0.25}
                        marks
                        sx={{ height: 100, mx: 'auto' }}
                    />
                    <Typography variant="caption" align="center">{Math.round(zoom * 100)}%</Typography>
                </Box>

                {/* Fullscreen & Download buttons */}
                <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
                    <IconButton
                        onClick={downloadDiagramAsSVG}
                        size="small"
                        sx={{
                            bgcolor: 'background.paper',
                            border: `1px solid ${theme.palette.divider}`,
                            '&:hover': { bgcolor: 'action.hover' }
                        }}
                    >
                        <Download size={20} />
                    </IconButton>
                    <IconButton
                        onClick={() => setIsFullscreen(true)}
                        size="small"
                        sx={{
                            bgcolor: 'background.paper',
                            border: `1px solid ${theme.palette.divider}`,
                            '&:hover': { bgcolor: 'action.hover' }
                        }}
                    >
                        <Maximize2 size={20} />
                    </IconButton>
                </Box>
            </Box>
        );
    };

    if (!chatHistory || chatHistory.length < 1) {
        return (
            <Paper sx={{
                height: '100%',
                minHeight: { xs: 500, sm: 650, md: 800 },
                p: 3,
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'
            }}>
                <Box>
                    <Bot size={48} color={theme.palette.text.secondary} style={{ marginBottom: 16 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>System Architecture</Typography>
                    <Typography variant="body2" color="text.secondary">Start chatting to see your system design visualized in real-time</Typography>
                </Box>
            </Paper>
        );
    }

    return (
        <>
            <Paper sx={{
                height: '100%',
                minHeight: { xs: 500, sm: 650, md: 800 },
                p: 3,
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                            {diagramData?.diagram_metadata?.title || 'System Architecture'}
                        </Typography>
                        {diagramData?.diagram_metadata?.complexity_score && (
                            <Badge badgeContent={diagramData.diagram_metadata.complexity_score} color="primary">
                                <Chip label={diagramData.diagram_metadata.complexity_level || 'Basic'} size="small" color="primary" variant="outlined" />
                            </Badge>
                        )}
                    </Box>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                        {diagramData?.diagram_metadata?.subtitle || 'Building your solution in real-time'}
                    </Typography>
                    {diagramData?.components && (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {['Frontend', 'Backend', 'Database', 'Integrations'].map((category) => {
                                const count = diagramData.components.filter(comp => {
                                    switch (category.toLowerCase()) {
                                        case 'frontend': return comp.type === 'frontend';
                                        case 'backend': return comp.type === 'backend' || comp.type === 'microservice';
                                        case 'database': return comp.type === 'database' || comp.type === 'storage';
                                        case 'integrations': return comp.type === 'external_api' || comp.type === 'third_party';
                                        default: return false;
                                    }
                                }).length;
                                return count > 0 ? <Chip key={category} label={`${category}: ${count}`} size="small" variant="filled" sx={{ fontSize: '0.65rem', height: '20px' }} /> : null;
                            })}
                        </Box>
                    )}
                </Box>

                {isLoading && (
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                        <CircularProgress size={40} />
                        <Typography variant="body2" color="text.secondary">Analyzing architecture...</Typography>
                    </Box>
                )}
                {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

                {diagramData && !isLoading && renderDiagramContent()}

                {diagramData?.diagram_metadata && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            {diagramData.diagram_metadata.component_count || 0} components, {diagramData.diagram_metadata.connection_count || 0} connections
                        </Typography>
                        {diagramData.diagram_metadata.estimated_timeline && (
                            <Chip label={diagramData.diagram_metadata.estimated_timeline} size="small" variant="outlined" sx={{ fontSize: '0.75rem', fontWeight: 500 }} />
                        )}
                    </Box>
                )}
            </Paper>

            {/* Fullscreen Dialog */}
            <Dialog
                fullScreen
                open={isFullscreen}
                onClose={() => setIsFullscreen(false)}
                sx={{ zIndex: theme.zIndex.modal + 1 }}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setIsFullscreen(false)}
                            aria-label="close"
                        >
                            <X />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {diagramData?.diagram_metadata?.title || 'System Architecture'} - Full View
                        </Typography>
                        <Button color="inherit" onClick={downloadDiagramAsSVG} startIcon={<Download />}>
                            Download SVG
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent sx={{ p: 2, bgcolor: 'background.default', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {diagramData && !isLoading && (
                        <Box sx={{ flex: 1, position: 'relative' }}>
                            {renderDiagramContent(true)}
                        </Box>
                    )}
                    {isLoading && (
                        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CircularProgress size={60} />
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default SystemDiagramPanel; 