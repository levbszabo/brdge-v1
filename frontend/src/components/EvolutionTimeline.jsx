import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Mic, Description, Slideshow } from '@mui/icons-material';
import BrdgeIcon from '../icons/BrdgeIcon';
import './EvolutionTimeline.css';

const milestones = [
    { title: 'Spoken Word', date: 'Prehistoric', icon: <Mic />, position: 'top' },
    { title: 'Written Docs', date: '3200 BCE', icon: <Description />, position: 'bottom' },
    { title: 'Digital Slides', date: '1980s', icon: <Slideshow />, position: 'top' },
    {
        title: 'Brdge AI',
        date: 'Present',
        icon: <BrdgeIcon width={32} height={32} color="#ffffff" />,
        position: 'bottom',
        special: true
    },
];

const EvolutionTimeline = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const lineVariants = {
        hidden: { pathLength: 0 },
        visible: { pathLength: 1, transition: { duration: 2, ease: "easeInOut" } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <Box sx={{ my: { xs: 8, md: 16 }, px: 2 }}>
            <Typography variant="h2" component="h2" gutterBottom align="center" sx={{ mb: 6, fontWeight: 'bold', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                Evolution of Information Transfer
            </Typography>
            <Box className="timeline">
                <svg className="timeline-svg" width="100%" height="100%" preserveAspectRatio="none">
                    <motion.line
                        x1={isMobile ? "50%" : "0"}
                        y1={isMobile ? "0" : "50%"}
                        x2={isMobile ? "50%" : "100%"}
                        y2={isMobile ? "100%" : "50%"}
                        stroke="black"
                        strokeWidth="2"
                        variants={lineVariants}
                        initial="hidden"
                        animate="visible"
                    />
                </svg>
                {milestones.map((milestone, index) => (
                    <motion.div
                        key={index}
                        className={`timeline-item ${milestone.position} ${milestone.special ? 'special' : ''}`}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.2 }}
                    >
                        <Box className="timeline-node">
                            <Box className={`timeline-icon-container ${milestone.special ? 'special' : ''}`}>
                                <Box className="timeline-icon-inner">
                                    {milestone.icon}
                                </Box>
                            </Box>
                        </Box>
                        <Box className="timeline-content">
                            <Typography variant="h6" className="timeline-title">
                                {milestone.title}
                            </Typography>
                            <Typography variant="body1" className="timeline-date">
                                {milestone.date}
                            </Typography>
                        </Box>
                    </motion.div>
                ))}
            </Box>
        </Box>
    );
};

export default EvolutionTimeline;