import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Mic, Description, Slideshow, Refresh } from '@mui/icons-material';

const TimelineNode = ({ data, index, total, isLast }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: isMobile ? '100%' : `${100 / total}%`,
            mb: isMobile ? 6 : 0,
            position: 'relative',
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
            >
                <Box
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: '50%',
                        width: 70,
                        height: 70,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        mb: 2,
                        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                        position: 'relative',
                        ...(isLast && {
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: -8,
                                left: -8,
                                right: -8,
                                bottom: -8,
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(255,215,0,0) 70%)',
                                zIndex: -1,
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: -4,
                                left: -4,
                                right: -4,
                                bottom: -4,
                                borderRadius: '50%',
                                border: '2px solid gold',
                                zIndex: -1,
                            }
                        })
                    }}
                >
                    {data.icon}
                </Box>
            </motion.div>
            <Typography variant="subtitle1" align="center" fontWeight="bold">
                {data.title}
            </Typography>
            <Typography variant="caption" color="text.secondary" align="center">
                {data.year}
            </Typography>
            {!isLast && isMobile && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -40,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 2,
                        height: 34,
                        backgroundColor: theme.palette.primary.main,
                    }}
                />
            )}
        </Box>
    );
};

const EvolutionTimeline = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const timelineNodes = [
        { id: '1', title: "Spoken Word", year: "Prehistoric", icon: <Mic /> },
        { id: '2', title: "Written Docs", year: "3200 BCE", icon: <Description /> },
        { id: '3', title: "Digital Slides", year: "1980s", icon: <Slideshow /> },
        { id: '4', title: "Brdge AI", year: "Present", icon: <Refresh /> },
    ];

    return (
        <Box sx={{ my: 8, position: 'relative', overflow: 'hidden' }}>
            <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 6, fontWeight: 'bold' }}>
                Evolution of Information Transfer
            </Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                ...(isMobile && {
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: '50%',
                        width: 2,
                        backgroundColor: theme.palette.primary.main,
                        transform: 'translateX(-50%)',
                        zIndex: -1,
                    }
                })
            }}>
                {timelineNodes.map((node, index) => (
                    <TimelineNode
                        key={node.id}
                        data={node}
                        index={index}
                        total={timelineNodes.length}
                        isLast={index === timelineNodes.length - 1}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default EvolutionTimeline;
