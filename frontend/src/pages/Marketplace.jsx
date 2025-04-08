import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Grid, Card, CardContent, CardMedia,
    Button, TextField, InputAdornment, CircularProgress, Tooltip,
    Tabs, Tab, useTheme, Chip, Avatar, IconButton, Paper, Divider
} from '@mui/material';
import { Search, BookOpen, User, ExternalLink, Star, Clock, ChevronRight, Filter, Briefcase, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../api';
import { AuthContext } from '../App';
import { createParchmentContainerStyles } from '../theme';
import { useSnackbar } from '../utils/snackbar';
import ivyStraightSvg from '../assets/ivy/ivy_straight2_2tone.svg';

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

    // Create styles for the page components
    const pageContainerStyles = {
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        position: 'relative',
        pt: '0px',
        pb: '60px',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url(${theme.textures.darkParchment})`,
            backgroundSize: 'cover',
            opacity: 0.15,
            pointerEvents: 'none',
            zIndex: 0,
            mixBlendMode: 'multiply',
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(40, 30, 20, 0.05)',
            pointerEvents: 'none',
            zIndex: 0,
        }
    };

    const heroSectionStyles = {
        position: 'relative',
        zIndex: 1,
        minHeight: { xs: '320px', sm: '340px', md: '380px' },
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: theme.palette.text.primary,
        px: 3,
        pt: { xs: '60px', sm: '60px', md: '40px' },
        pb: { xs: 4, sm: 5, md: 5 },
        backgroundImage: `linear-gradient(135deg, ${theme.palette.common.offWhite} 0%, ${theme.palette.sepia.light} 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        marginBottom: 4,
        borderBottom: `2px solid ${theme.palette.secondary.dark}80`,
        boxShadow: `inset 0 0 80px rgba(0,0,0,0.1), 0 2px 5px rgba(0,0,0,0.2)`,
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url(${theme.textures.darkParchment})`,
            backgroundSize: 'cover',
            opacity: 0.25,
            mixBlendMode: 'overlay',
            zIndex: -1
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '25px',
            background: `linear-gradient(to bottom, transparent, ${theme.palette.background.default})`,
            zIndex: 1,
            pointerEvents: 'none'
        }
    };

    const filterContainerStyles = {
        ...createParchmentContainerStyles(theme),
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', md: 'center' },
        gap: { xs: 2, md: 3 },
        p: { xs: 2, md: 3 },
        mb: 4,
        zIndex: 1,
        position: 'relative',
        border: `1px solid ${theme.palette.secondary.dark}`,
        borderLeft: `3px solid ${theme.palette.secondary.dark}`,
        boxShadow: theme.shadows[2],
        '&::before': {
            ...createParchmentContainerStyles(theme)['&::before'],
            opacity: 0.12,
        }
    };

    const sectionStyles = {
        ...createParchmentContainerStyles(theme),
        mb: 6,
        p: { xs: 2, md: 3 },
        zIndex: 1,
        position: 'relative',
        border: `1px solid ${theme.palette.secondary.dark}60`,
        borderTop: `3px solid ${theme.palette.secondary.dark}cc`,
        boxShadow: theme.shadows[3],
        '&::before': {
            ...createParchmentContainerStyles(theme)['&::before'],
            opacity: 0.15,
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            top: 15,
            right: 15,
            width: 50,
            height: 50,
            backgroundImage: `url(${theme.textures.stampLogo})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            opacity: 0.75,
            pointerEvents: 'none',
            zIndex: 0,
        }
    };

    useEffect(() => {
        fetchMarketplaceCourses();
    }, []);

    const fetchMarketplaceCourses = async () => {
        setLoading(true);
        try {
            const response = await api.get('/courses/marketplace');
            const courses = response.data.courses || [];

            // Set all courses
            setMarketplaceCourses(courses);
        } catch (error) {
            console.error('Error fetching marketplace courses:', error);
            showSnackbar('Failed to load marketplace courses', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Filter courses based on search term and category
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

    // Utility function to normalize thumbnail URLs
    const normalizeThumbnailUrl = (url) => {
        if (!url) return null;

        // If it's already an absolute URL, return it as is
        if (url.startsWith('http')) return url;

        // If it's a relative URL, prepend the API base URL
        if (url.startsWith('/api')) {
            return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${url}`;
        }

        return url;
    };

    const handleViewCourse = (course) => {
        navigate(`/c/${course.public_id}`);
    };

    // Animation variants for motion components
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

    // CourseCard component
    const CourseCard = ({ course }) => {
        return (
            <motion.div
                variants={itemVariants}
                whileHover={{
                    y: -8,
                    boxShadow: theme.shadows[6],
                    transition: { duration: 0.3 }
                }}
            >
                <Card
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        pb: 0,
                        position: 'relative',
                        backgroundColor: theme.palette.background.paper,
                        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                        border: `1px solid ${theme.palette.secondary.dark}40`,
                        borderRadius: '8px',
                        boxShadow: `0 1px 3px ${theme.palette.secondary.dark}20`,
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url(${theme.textures.lightParchment || theme.textures.darkParchment})`,
                            backgroundSize: 'cover',
                            opacity: 0.15,
                            mixBlendMode: 'multiply',
                            pointerEvents: 'none',
                            zIndex: 0,
                            borderRadius: 'inherit'
                        },
                        '& .corner-flourish': {
                            position: 'absolute',
                            width: '16px',
                            height: '16px',
                            opacity: 0.7,
                            zIndex: 2,
                            filter: 'sepia(20%) contrast(80%) saturate(90%) brightness(0.8)',
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundImage: `url(${theme.textures.stampLogo})`,
                        },
                        '& .corner-flourish-top-left': {
                            top: 6,
                            left: 6,
                            transform: 'rotate(-45deg)',
                        },
                        '& .corner-flourish-bottom-right': {
                            bottom: 6,
                            right: 6,
                            transform: 'rotate(135deg)',
                        },
                        '& > *': {
                            position: 'relative',
                            zIndex: 1,
                        },
                    }}
                    onClick={() => handleViewCourse(course)}
                >
                    <Box className="corner-flourish corner-flourish-top-left" />
                    <Box className="corner-flourish corner-flourish-bottom-right" />

                    <Box sx={{ position: 'relative', width: '100%', pt: '56.25%', borderBottom: `1px solid ${theme.palette.secondary.dark}30` }}>
                        {course.thumbnail_url ? (
                            <CardMedia
                                component="img"
                                image={normalizeThumbnailUrl(course.thumbnail_url)}
                                alt={`Thumbnail for ${course.name}`}
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: theme.palette.background.default,
                                    color: theme.palette.secondary.main
                                }}
                            >
                                <BookOpen size={40} />
                            </Box>
                        )}

                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: `linear-gradient(to bottom, rgba(42, 58, 37, 0.1) 0%, rgba(42, 58, 37, 0.6) 100%)`,
                                zIndex: 1
                            }}
                        />
                    </Box>

                    <CardContent sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        p: { xs: 1.5, sm: 2 },
                        position: 'relative',
                        zIndex: 1,
                    }}>
                        <Typography
                            variant="h6"
                            component="h2"
                            gutterBottom
                            sx={{
                                fontFamily: theme.typography.headingFontFamily,
                                fontWeight: 600,
                                color: theme.palette.secondary.dark,
                                lineHeight: 1.3,
                                mb: 1,
                                fontSize: '1.2rem',
                                letterSpacing: '-0.01em',
                                position: 'relative',
                                display: 'inline-block',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-4px',
                                    left: '2px',
                                    width: '40%',
                                    height: '1px',
                                    background: `linear-gradient(90deg, ${theme.palette.secondary.main}80, transparent)`,
                                    opacity: 0.7,
                                }
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
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: 1.6,
                                fontSize: '0.9rem',
                                letterSpacing: '0.01em',
                                fontWeight: 300,
                                color: theme.palette.text.secondary,
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
                            borderTop: `1px solid ${theme.palette.secondary.main}40`,
                            gap: 1
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <GraduationCap size={14} color={theme.palette.secondary.dark} />
                                <Typography variant="caption" color="text.secondary">
                                    {course.modules?.length || 0} Module{course.modules?.length !== 1 ? 's' : ''}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <User size={14} color={theme.palette.secondary.dark} />
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
            <Box sx={pageContainerStyles}>
                {/* Hero Section */}
                <Box sx={heroSectionStyles}>
                    <Container maxWidth="md">
                        <motion.div variants={itemVariants}>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontFamily: '"Canela Text", serif',
                                    fontWeight: 700,
                                    color: theme.palette.ink,
                                    mb: { xs: 3, sm: 2 },
                                    mt: { xs: 2, sm: 1 },
                                    fontSize: { xs: '2rem', sm: '2.6rem', md: '3.5rem' },
                                    letterSpacing: '-0.01em',
                                    position: 'relative',
                                    maxWidth: { xs: '95%', sm: '100%' },
                                    lineHeight: { xs: 1.2, sm: 1.1 },
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '-10px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: { xs: '40px', sm: '60px' },
                                        height: '1px',
                                        background: `linear-gradient(90deg, transparent, ${theme.palette.ink}60, transparent)`,
                                    },
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: '-10px',
                                        left: '25%',
                                        width: '50%',
                                        height: '2px',
                                        background: `linear-gradient(90deg, transparent, ${theme.palette.ink}, transparent)`,
                                        borderRadius: '1px',
                                    }
                                }}
                            >
                                Knowledge Marketplace
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    mb: { xs: 4, sm: 3 },
                                    maxWidth: { xs: '90%', sm: '700px' },
                                    mx: 'auto',
                                    fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.15rem' },
                                    lineHeight: 1.6,
                                    letterSpacing: '0.01em',
                                    fontWeight: 400,
                                    mt: { xs: 2, sm: 3 },
                                }}
                            >
                                A curated library of voice-guided courses—each one transformed into a living, interactive learning experience with Brdge AI.
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<BookOpen />}
                                    onClick={() => {
                                        document.getElementById('course-section').scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    sx={{
                                        backgroundColor: theme.palette.secondary.main,
                                        color: theme.palette.primary.contrastText,
                                        '&:hover': {
                                            backgroundColor: theme.palette.secondary.dark
                                        },
                                        px: { xs: 2, sm: 3 },
                                        py: { xs: 1.2, sm: 1.5 },
                                        borderRadius: '8px',
                                        fontSize: { xs: '0.9rem', sm: '1rem' },
                                    }}
                                >
                                    Browse Courses
                                </Button>

                                {!isAuthenticated && (
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => navigate('/signup')}
                                        sx={{
                                            borderColor: 'rgba(255,255,255,0.7)',
                                            color: 'white',
                                            '&:hover': {
                                                borderColor: 'white',
                                                backgroundColor: 'rgba(255,255,255,0.1)'
                                            },
                                            px: 3,
                                            py: 1.5,
                                            borderRadius: '8px'
                                        }}
                                    >
                                        Sign Up Free
                                    </Button>
                                )}
                            </Box>
                        </motion.div>
                    </Container>
                </Box>

                {/* Main Content */}
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    {/* Search & Filter Section */}
                    <motion.div variants={itemVariants}>
                        <Box sx={filterContainerStyles}>
                            <TextField
                                placeholder="Search courses..."
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: theme.palette.background.default,
                                        borderRadius: '8px',
                                        '& fieldset': {
                                            borderColor: theme.palette.divider
                                        },
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.secondary.dark
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: theme.palette.secondary.dark
                                        }
                                    },
                                    maxWidth: { xs: '100%', md: '300px' }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search size={20} color={theme.palette.secondary.main} />
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
                                            color: theme.palette.secondary.dark
                                        },
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        fontWeight: 500
                                    },
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: theme.palette.secondary.dark
                                    }
                                }}
                            >
                                {categories.map(category => (
                                    <Tab key={category.id} value={category.id} label={category.name} />
                                ))}
                            </Tabs>
                        </Box>
                    </motion.div>

                    {/* All Courses Section */}
                    <motion.div variants={itemVariants}>
                        <Box sx={sectionStyles} id="course-section">
                            <Typography
                                variant="h4"
                                component="h2"
                                sx={{
                                    fontFamily: theme.typography.headingFontFamily,
                                    fontWeight: 600,
                                    mb: 1,
                                    color: theme.palette.secondary.dark,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: '-8px',
                                        left: '0',
                                        width: '60px',
                                        height: '2px',
                                        background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light}80)`,
                                        borderRadius: '1px',
                                    }
                                }}
                            >
                                <BookOpen size={24} color={theme.palette.secondary.dark} />
                                {selectedCategory === 'all' ? 'All Courses' :
                                    selectedCategory === 'new' ? 'New Arrivals' : 'Popular Courses'}
                            </Typography>

                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{
                                    mb: 3,
                                    fontFamily: theme.typography.fontFamily,
                                    fontSize: '1.05rem',
                                    letterSpacing: '0.01em',
                                    fontWeight: 300,
                                }}
                            >
                                {filteredCourses.length} courses available
                            </Typography>

                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                                    <CircularProgress sx={{ color: theme.palette.secondary.main }} />
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
                                <Box sx={{
                                    textAlign: 'center',
                                    py: 6,
                                    backgroundColor: theme.palette.background.default,
                                    borderRadius: '12px',
                                    border: `1px dashed ${theme.palette.divider}`
                                }}>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        No courses found
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Try adjusting your search or filter criteria
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div variants={itemVariants}>
                        <Box
                            sx={{
                                mt: 6,
                                mb: 8,
                                p: 4,
                                borderRadius: '16px',
                                background: `linear-gradient(45deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                                border: `1px solid ${theme.palette.secondary.main}30`,
                                boxShadow: theme.shadows[2],
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundImage: `url(${theme.textures.darkParchment})`,
                                    backgroundSize: 'cover',
                                    opacity: 0.1,
                                    mixBlendMode: 'multiply',
                                    zIndex: 0,
                                }
                            }}
                        >
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Typography
                                    variant="h4"
                                    gutterBottom
                                    sx={{
                                        fontFamily: theme.typography.headingFontFamily,
                                        fontWeight: 600,
                                        color: theme.palette.text.primary,
                                        mb: 2,
                                        position: 'relative',
                                        display: 'inline-block',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: '-8px',
                                            left: '25%',
                                            width: '50%',
                                            height: '1px',
                                            background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.main}80, transparent)`,
                                            borderRadius: '1px',
                                        }
                                    }}
                                >
                                    Create Your Own Course
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        mb: 4,
                                        maxWidth: '700px',
                                        mx: 'auto',
                                        fontSize: '1.05rem',
                                        lineHeight: 1.6,
                                        fontWeight: 300,
                                        letterSpacing: '0.01em',
                                    }}
                                >
                                    Want to share your knowledge with the world? Create your own AI-powered interactive courses with our easy-to-use platform.
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate(isAuthenticated ? '/home' : '/signup')}
                                    sx={{
                                        backgroundColor: theme.palette.secondary.main,
                                        color: theme.palette.primary.contrastText,
                                        '&:hover': {
                                            backgroundColor: theme.palette.secondary.dark
                                        },
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: '8px'
                                    }}
                                >
                                    {isAuthenticated ? 'Get Started' : 'Sign Up to Create'}
                                </Button>
                            </Box>
                        </Box>
                    </motion.div>
                </Container>
            </Box>
        </motion.div>
    );
}

export default MarketplacePage;