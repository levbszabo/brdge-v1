import React from 'react';
import { Container, Typography, Box, Paper, Grid, Chip, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'; // For job type/equity
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'; // For salary
import { MotionPageHeader, AnimatedPageTitle, AnimatedPageSubtitle } from '../styles/sharedStyles';
import { useInView } from 'react-intersection-observer';
import Footer from '../components/Footer';

const CareerPageContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(8),
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(10),
    },
}));

const JobListingCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3.5),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 1.5,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[2],
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
}));

const JobTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1.5),
}));

const JobMeta = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(0.5),
    fontSize: '0.9rem',
}));

const EmailSection = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(4),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 1.5,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[1],
}));

const jobOpenings = [
    {
        id: 1,
        title: 'Founding AI Engineer',
        location: 'Miami, FL',
        type: 'Hybrid',
        salaryNote: 'Competitive',
        equityNote: 'Equity packages offered',
        description: 'Join us in person to build the future of AI in Miami. We\'re looking for a versatile engineer with a passion for innovation and a strong background in AI/ML.',
        responsibilities: [
            'Design, develop, and deploy machine learning models and AI-powered features.',
            'Work with Large Language Models (LLMs), multimodal AI, and vector stores.',
            'Implement and optimize large-scale data processing pipelines.',
            'Collaborate with cross-functional teams to integrate AI solutions into our products.',
            'Stay current with the latest advancements in AI and machine learning.',
        ],
        skills: ['Python', 'Machine Learning', 'LLMs', 'Multimodal AI', 'Vector Stores', 'Large-scale data processing', 'Cloud Platforms (AWS, GCP, or Azure)'],
    },
    {
        id: 2,
        title: 'Founding Software Engineer',
        location: 'Miami, FL',
        type: 'Hybrid',
        salaryNote: 'Competitive',
        equityNote: 'Equity packages offered',
        description: 'Become a founding member of our team in Miami, building cutting-edge applications with a focus on robust and scalable solutions.',
        responsibilities: [
            'Develop and maintain full-stack web and mobile applications.',
            'Work extensively with JavaScript, WebRTC, and cloud infrastructure.',
            'Contribute to UI/UX design and ensure a seamless user experience.',
            'Build and manage large-scale data systems and APIs.',
            'Participate in the entire software development lifecycle, from concept to deployment.',
        ],
        skills: ['JavaScript (React, Node.js, etc.)', 'WebRTC', 'Cloud Infrastructure (AWS, GCP, or Azure)', 'Mobile App Development (iOS/Android)', 'Databases (SQL/NoSQL)', 'UI/UX Design Principles', 'Large-scale data processing'],
    }
];

const CareerPage = () => {
    const [headerRef, headerInView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    return (
        <>
            <CareerPageContainer maxWidth="lg">
                <Box ref={headerRef}>
                    <MotionPageHeader>
                        <AnimatedPageTitle>
                            Join Our Team
                        </AnimatedPageTitle>
                        <AnimatedPageSubtitle>
                            We're building the future of AI-driven communication and looking for passionate, innovative individuals to help us achieve our vision. Be part of a dynamic team in Miami, FL, and make a significant impact.
                        </AnimatedPageSubtitle>
                    </MotionPageHeader>
                </Box>

                <Grid container spacing={4}>
                    {jobOpenings.map((job) => (
                        <Grid item xs={12} md={6} key={job.id} sx={{ display: 'flex' }}>
                            <JobListingCard>
                                <JobTitle variant="h5" component="h2">
                                    {job.title}
                                </JobTitle>
                                <Box sx={{ mb: 2 }}>
                                    <JobMeta>
                                        <LocationOnIcon fontSize="inherit" /> {job.location}
                                    </JobMeta>
                                    <JobMeta>
                                        <BusinessCenterIcon fontSize="inherit" /> {job.type}
                                    </JobMeta>
                                    <JobMeta>
                                        <MonetizationOnIcon fontSize="inherit" /> {job.salaryNote}
                                    </JobMeta>
                                    <JobMeta>
                                        <BusinessCenterIcon fontSize="inherit" /> {job.equityNote}
                                    </JobMeta>
                                </Box>

                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {job.description}
                                </Typography>

                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>Key Responsibilities:</Typography>
                                <Box component="ul" sx={{ pl: 2.5, mb: 2, listStyleType: 'disc' }}>
                                    {job.responsibilities.map((resp, index) => (
                                        <Typography component="li" variant="body2" key={index} sx={{ mb: 0.5 }}>{resp}</Typography>
                                    ))}
                                </Box>

                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>Skills & Experience:</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                    {job.skills.map((skill, index) => (
                                        <Chip label={skill} key={index} size="small" variant="outlined" />
                                    ))}
                                </Box>
                            </JobListingCard>
                        </Grid>
                    ))}
                </Grid>

                <EmailSection>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                        Interested in joining our team?
                    </Typography>
                    <Typography variant="body1">
                        If you're interested in any of these positions or would like to inquire about other opportunities,<br />
                        please send your resume directly to <a href="mailto:levi@dotbridge.io"><strong>levi@dotbridge.io</strong></a>
                    </Typography>
                </EmailSection>
            </CareerPageContainer>
            <Footer />
        </>
    );
};

export default CareerPage; 