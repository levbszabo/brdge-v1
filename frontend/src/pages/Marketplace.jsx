import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Grid, Card, CardContent, CardMedia,
    Button, TextField, InputAdornment, CircularProgress, Tooltip,
    Tabs, Tab, useTheme, Chip, Avatar, IconButton, Paper, Divider
} from '@mui/material';
import { Search, BookOpen, User, Star, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../api';
import { AuthContext } from '../App';
import { useSnackbar } from '../utils/snackbar';

function MarketplacePage() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    const { showSnackbar } = useSnackbar();
    const [marketplaceCourses, setMarketplaceCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([
        { id: 'all', name: 'All Courses' },
        { id: 'new', name: 'New Arrivals' },
        { id: 'popular', name: 'Popular' }
    ]);

    useEffect(() => {
        fetchMarketplaceCourses();
    }, []);

    const fetchMarketplaceCourses = async () => {
        setLoading(true);
        try {
            const response = await api.get('/courses/marketplace');
            const courses = response.data.courses || [];
            setMarketplaceCourses(courses);
        } catch (error) {
            console.error('Error fetching marketplace courses:', error);
            showSnackbar('Failed to load marketplace courses', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = marketplaceCourses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));

        if (selectedCategory === 'all') return matchesSearch;
        if (selectedCategory === 'new') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return course.created_at && new Date(course.created_at) >= thirtyDaysAgo && matchesSearch;
        }
        if (selectedCategory === 'popular') {
            return course.enrollment_count && course.enrollment_count > 5 && matchesSearch;
        }
        return matchesSearch;
    });

    const normalizeThumbnailUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        if (url.startsWith('/api')) {
            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            if (baseUrl.endsWith('/api')) {
                const cleanUrl = url.replace(/^\/api/, '');
                return `${baseUrl}${cleanUrl}`;
            }
            return `${baseUrl}${url}`;
        }
        return url;
    };

    const handleViewCourse = (course) => {
        navigate(`/c/${course.public_id}`);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3 }
        }
    };

    const CourseCard = ({ course }) => {
        return (
            <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                style={{ height: '100%' }}
            >
                <Card
                    variant="outlined"
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        pb: 0,
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                            boxShadow: theme.shadows[3],
                            transform: 'translateY(-3px)'
                        }
                    }}
                    onClick={() => handleViewCourse(course)}
                >
                    <Box sx={{ position: 'relative', width: '100%', pt: '56.25%', bgcolor: 'neutral.light' }}>
                        {course.thumbnail_url ? (
                            <CardMedia
                                component="img"
                                image={normalizeThumbnailUrl(course.thumbnail_url)}
                                alt={`Thumbnail for ${course.name}`}
                                sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                                <BookOpen size={40} />
                            </Box>
                        )}
                    </Box>

                    <CardContent sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        p: 2,
                        position: 'relative',
                        zIndex: 1,
                    }}>
                        <Typography
                            variant="h6"
                            component="h2"
                            gutterBottom
                            sx={{
                                color: 'text.primary',
                                fontWeight: 600,
                                lineHeight: 1.3,
                                mb: 0.5,
                            }}
                        >
                            {course.name}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 1.5,
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: 1.5,
                                minHeight: '45px'
                            }}
                        >
                            {course.description || "Explore this interactive AI-powered learning course."}
                        </Typography>

                        <Box sx={{
                            mt: 'auto',
                            pt: 1.5,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderTop: `1px solid ${theme.palette.divider}`,
                            gap: 1
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <GraduationCap size={14} color={theme.palette.text.secondary} />
                                <Typography variant="caption" color="text.secondary">
                                    {course.modules?.length || 0} Module{course.modules?.length !== 1 ? 's' : ''}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <User size={14} color={theme.palette.text.secondary} />
                                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    {course.created_by || "Brdge AI Team"}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </motion.div>
        );
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Box sx={{
                minHeight: 'calc(100vh - 64px)',
                bgcolor: theme.palette.background.default,
                pb: { xs: 6, md: 10 }
            }}>
                <Box sx={{
                    pt: { xs: 10, md: 12 },
                    pb: { xs: 6, md: 8 },
                    textAlign: 'center',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    mb: 6,
                    bgcolor: 'neutral.light'
                }}>
                    <Container maxWidth="md">
                        <motion.div variants={itemVariants}>
                            <Typography
                                variant="h1"
                                component="h1"
                                sx={{ color: 'text.primary', mb: 2 }}
                            >
                                Marketplace
                            </Typography>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Typography
                                variant="h5"
                                sx={{ color: 'text.secondary', mb: 4, maxWidth: '700px', mx: 'auto' }}
                            >
                                Discover interactive AI-powered flows created by experts and the DotBridge team.
                            </Typography>
                        </motion.div>
                    </Container>
                </Box>

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div variants={itemVariants}>
                        <Paper
                            elevation={0}
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                justifyContent: 'space-between',
                                alignItems: { xs: 'stretch', md: 'center' },
                                gap: { xs: 2, md: 3 },
                                p: 2,
                                mb: 4,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: theme.shape.borderRadius,
                                bgcolor: 'background.paper'
                            }}
                        >
                            <TextField
                                placeholder="Search flows..."
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{
                                    maxWidth: { xs: '100%', md: '350px' }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search size={20} color={theme.palette.text.secondary} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Tabs
                                value={selectedCategory}
                                onChange={(e, newValue) => setSelectedCategory(newValue)}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{
                                    '& .MuiTab-root': {
                                        color: theme.palette.text.secondary,
                                        '&.Mui-selected': {
                                            color: theme.palette.primary.main
                                        },
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        fontWeight: 500
                                    },
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: theme.palette.primary.main
                                    }
                                }}
                            >
                                {categories.map(category => (
                                    <Tab key={category.id} value={category.id} label={category.name} />
                                ))}
                            </Tabs>
                        </Paper>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Box sx={{ mb: 6 }} id="course-section">
                            <Typography
                                variant="h4"
                                component="h2"
                                sx={{ color: 'text.primary', fontWeight: 600, mb: 1 }}
                            >
                                {selectedCategory === 'all' ? 'All Flows' :
                                    categories.find(cat => cat.id === selectedCategory)?.name || 'Courses'}
                            </Typography>

                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >
                                {loading ? 'Loading...' : `${filteredCourses.length} course${filteredCourses.length !== 1 ? 's' : ''} found`}
                            </Typography>

                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                                    <CircularProgress color="primary" />
                                </Box>
                            ) : filteredCourses.length > 0 ? (
                                <Grid container spacing={3}>
                                    {filteredCourses.map(course => (
                                        <Grid item xs={12} sm={6} md={4} key={course.id}>
                                            <CourseCard course={course} />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        textAlign: 'center',
                                        py: 6,
                                        bgcolor: 'neutral.light'
                                    }}>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        No flows found
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Try adjusting your search or filter criteria.
                                    </Typography>
                                </Paper>
                            )}
                        </Box>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Paper
                            elevation={0}
                            sx={{
                                mt: 6,
                                mb: 4,
                                p: { xs: 3, sm: 4 },
                                borderRadius: theme.shape.borderRadius,
                                border: `1px solid ${theme.palette.divider}`,
                                bgcolor: 'neutral.light',
                                textAlign: 'center',
                            }}
                        >
                            <Typography
                                variant="h4"
                                gutterBottom
                                sx={{ color: 'text.primary', fontWeight: 600, mb: 1.5 }}
                            >
                                Ready to Create?
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ color: 'text.secondary', mb: 3, maxWidth: '600px', mx: 'auto' }}
                            >
                                Transform your own expertise into an interactive AI-powered flow on the DotBridge platform.
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                color="primary"
                                onClick={() => navigate(isAuthenticated ? '/home' : '/signup')}
                            >
                                {isAuthenticated ? 'Go to Dashboard' : 'Sign Up to Create'}
                            </Button>
                        </Paper>
                    </motion.div>
                </Container>
            </Box>
        </motion.div>
    );
}

export default MarketplacePage;