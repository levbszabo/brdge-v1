import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Grid, Card, CardHeader, CardContent, CardMedia, Typography, Button, TextField, Box,
    Container, useTheme, styled
} from '@mui/material';
import { FaMicrophone, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { api } from '../api';
import { useSnackbar } from '../utils/snackbar';
import Room from './Room';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(145deg, #f3f4f6 0%, #fff 100%)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderRadius: theme.spacing(2),
    overflow: 'hidden',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.spacing(3),
    textTransform: 'none',
    fontWeight: 600,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
}));

function EditBrdgePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const theme = useTheme();

    const [brdgeData, setBrdgeData] = useState({
        name: '',
        numSlides: 0,
        slides: [],
    });
    const [currentSlide, setCurrentSlide] = useState(1);
    const [isRoomActive, setIsRoomActive] = useState(false);

    useEffect(() => {
        fetchBrdgeData();
    }, [id]);

    const fetchBrdgeData = async () => {
        try {
            const response = await api.get(`/brdges/${id}`);
            const data = response.data;
            setBrdgeData({
                name: data.name,
                numSlides: data.num_slides,
                slides: data.slides || [],
            });
        } catch (error) {
            console.error('Error fetching brdge data:', error);
            showSnackbar('Error loading brdge data.', 'error');
        }
    };

    const handleRecordWalkthrough = () => {
        console.log("Activating room...");
        setIsRoomActive(true);
    };

    const renderSlides = () => {
        const imageUrl = `${api.defaults.baseURL}/brdges/${id}/slides/${currentSlide}`;
        return (
            <Card variant="outlined" sx={{ mb: 4 }}>
                <CardHeader title={`Slide ${currentSlide} of ${brdgeData.numSlides}`} />
                <CardContent>
                    <Box sx={{ textAlign: 'center' }}>
                        <CardMedia
                            component="img"
                            image={imageUrl}
                            alt={`Slide ${currentSlide}`}
                            sx={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: { xs: 300, md: 500 },
                                objectFit: 'contain',
                                backgroundColor: 'background.paper',
                            }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/600x400?text=No+Slide+Available';
                                console.error(`Error loading slide ${currentSlide}`);
                            }}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            label={`Transcript for Slide ${currentSlide}`}
                            multiline
                            fullWidth
                            minRows={4}
                            variant="outlined"
                            placeholder={`Enter transcript for slide ${currentSlide}...`}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button
                            onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 1))}
                            disabled={currentSlide === 1}
                            startIcon={<FaChevronLeft />}
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={() => setCurrentSlide(prev => Math.min(prev + 1, brdgeData.numSlides))}
                            disabled={currentSlide === brdgeData.numSlides}
                            endIcon={<FaChevronRight />}
                        >
                            Next
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <StyledCard sx={{ p: { xs: 2, md: 4 } }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        Edit Brdge
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2 }}>
                        <StyledButton
                            onClick={handleRecordWalkthrough}
                            fullWidth
                            sx={{
                                mb: 1,
                                backgroundColor: theme.palette.primary.main,
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                },
                            }}
                            startIcon={<FaMicrophone />}
                        >
                            Start Recording
                        </StyledButton>
                    </Box>

                    {brdgeData.numSlides > 0 && renderSlides()}
                </StyledCard>
            </Container>

            {/* Render Room in a modal or overlay */}
            {isRoomActive && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        zIndex: 1000,
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '80%',
                            maxWidth: '800px',
                            bgcolor: 'background.paper',
                            borderRadius: '8px',
                            p: 4,
                        }}
                    >
                        <Room />
                        <Button
                            onClick={() => setIsRoomActive(false)}
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                        >
                            Close
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default EditBrdgePage;