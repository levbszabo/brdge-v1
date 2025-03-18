import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Button, Card, CardMedia, CardContent, Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { getAuthToken } from '../utils/auth';
import { api } from '../api';

function ViewCoursePage() {
    const { publicId } = useParams();
    const navigate = useNavigate();
    const token = getAuthToken();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [course, setCourse] = useState(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                // Get the course details using the public ID
                const response = await api.get(`/courses/${publicId}`);
                const courseData = response.data;

                // If course is not shareable and user is not the owner, deny access
                if (!courseData.shareable && token) {
                    const userResponse = await api.get('/user/current');
                    if (userResponse.data.id !== courseData.user_id) {
                        setError('Course Is Not Public: Access Denied');
                        setLoading(false);
                        return;
                    }
                } else if (!courseData.shareable && !token) {
                    setError('Course Is Not Public: Access Denied');
                    setLoading(false);
                    return;
                }

                setCourse(courseData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching course:', error);
                setError('Course Not Found or Access Denied');
                setLoading(false);
            }
        };

        if (publicId) {
            fetchCourse();
        } else {
            setError('Invalid Course ID');
            setLoading(false);
        }
    }, [publicId, token]);

    const handleStartModule = (publicId) => {
        navigate(`/b/${publicId}`);
    };

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: 'background.default'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: 'background.default',
                px: 3
            }}>
                <Typography variant="h5" gutterBottom>
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            maxWidth: 1200,
            mx: 'auto',
            my: 4,
            p: 2
        }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {course.name}
            </Typography>

            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                {course.description}
            </Typography>

            <Divider sx={{ mb: 4 }} />

            <Typography variant="h5" component="h2" gutterBottom>
                Course Modules
            </Typography>

            {course.modules && course.modules.length > 0 ? (
                course.modules.map((module, index) => (
                    <Accordion
                        key={module.id}
                        expanded={expanded === `panel${index}`}
                        onChange={handleAccordionChange(`panel${index}`)}
                        sx={{ mb: 2 }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${index}-content`}
                            id={`panel${index}-header`}
                        >
                            <Typography variant="h6">
                                {index + 1}. {module.brdge.name}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                                <CardMedia
                                    component="img"
                                    sx={{
                                        width: { xs: '100%', sm: 200 },
                                        height: { xs: 200, sm: 150 },
                                        objectFit: 'cover'
                                    }}
                                    image={`/api/brdges/${module.brdge.public_id}/slides/1`}
                                    alt={module.brdge.name}
                                />
                                <CardContent sx={{ flex: '1 0 auto' }}>
                                    <Typography variant="body1" paragraph>
                                        {module.brdge.description || "No description available"}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<PlayArrowIcon />}
                                        onClick={() => handleStartModule(module.brdge.public_id)}
                                    >
                                        Start Module
                                    </Button>
                                </CardContent>
                            </Card>
                        </AccordionDetails>
                    </Accordion>
                ))
            ) : (
                <Typography variant="body1">No modules available in this course.</Typography>
            )}
        </Box>
    );
}

export default ViewCoursePage; 