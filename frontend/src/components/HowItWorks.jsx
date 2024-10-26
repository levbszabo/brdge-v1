import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Box, useTheme, useMediaQuery, Grid } from '@mui/material';
import { CloudUpload, Mic, Description, VolumeUp, Share } from '@mui/icons-material';
import { useInView } from 'react-intersection-observer';
import './HowItWorks.css';

const HowItWorks = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const steps = [
        {
            title: "Upload Documents",
            description: "Transform your documents into interactive AI experiences.",
            icon: <CloudUpload fontSize="large" />,
        },
        {
            title: "Record Walkthrough",
            description: "Easily add your voice explanations.",
            icon: <Mic fontSize="large" />,
        },
        {
            title: "Generate Transcripts",
            description: "Create precise transcripts automatically.",
            icon: <Description fontSize="large" />,
        },
        {
            title: "Generate Audio",
            description: "Turn your text into natural-sounding audio.",
            icon: <VolumeUp fontSize="large" />,
        },
        {
            title: "Share Your Brdge",
            description: "Easily share your content with your audience.",
            icon: <Share fontSize="large" />,
        },
    ];

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <Box ref={ref} sx={{ my: { xs: 8, md: 16 }, px: 2 }}>
            <Typography variant="h2" component="h2" gutterBottom align="center" sx={{ mb: 6, fontWeight: 'bold', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                How It Works
            </Typography>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
            >
                <Grid container spacing={3} justifyContent="center">
                    {steps.map((step, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                            <motion.div variants={itemVariants} className="how-it-works-card-wrapper">
                                <Box className="how-it-works-card">
                                    <Box className="icon-container">
                                        {step.icon}
                                    </Box>
                                    <Typography variant="h6" className="step-title">
                                        {step.title}
                                    </Typography>
                                    <Typography variant="body2" className="step-description">
                                        {step.description}
                                    </Typography>
                                </Box>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </motion.div>
        </Box>
    );
};

export default HowItWorks;
