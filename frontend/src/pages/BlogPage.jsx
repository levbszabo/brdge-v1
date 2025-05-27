import React from 'react';
import { Box, Container, Grid, useTheme, useMediaQuery } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import DotBridgeTypography from '../components/DotBridgeTypography';
import DotBridgeButton from '../components/DotBridgeButton';
import DotBridgeIcon from '../components/DotBridgeIcon';
import Footer from '../components/Footer';

// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerChildren = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const BlogPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [headerRef, headerInView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    const [postsRef, postsInView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    // Helper function to determine chip colors based on post type
    const getTypeChipStyles = (type) => {
        switch (type ? type.toLowerCase() : '') {
            case 'article':
                return {
                    background: `${theme.palette.primary.main}15`,
                    color: theme.palette.primary.main,
                    borderColor: `${theme.palette.primary.main}30`
                };
            case 'demo':
                return {
                    background: `${theme.palette.secondary.main}15`,
                    color: theme.palette.secondary.main,
                    borderColor: `${theme.palette.secondary.main}30`
                };
            case 'whitepaper':
                return {
                    background: `${theme.palette.success.main}15`,
                    color: theme.palette.success.main,
                    borderColor: `${theme.palette.success.main}30`
                };
            default:
                return {
                    background: theme.palette.grey[100],
                    color: theme.palette.text.secondary,
                    borderColor: theme.palette.divider
                };
        }
    };

    // Blog posts data
    const posts = [
        {
            id: 0,
            slug: 'dotbridge-future-of-business-communication',
            title: 'DotBridge: The Future of Business Communication',
            date: 'May 15, 2025',
            type: 'whitepaper',
            icon: 'FileText',
            summary: 'Download our comprehensive whitepaper on how DotBridge is reshaping business communication with AI-powered interactive content.',
        },
        {
            id: 1,
            slug: 'you-dont-need-to-know-everything',
            title: 'You Don\'t Need to Know Everything - You Just Need the Right Bridges',
            date: 'May 16, 2025',
            type: 'article',
            icon: 'BookOpen',
            summary: 'Something massive is happening in how we transfer knowledge. Quietly, a new layer of intelligence is being built on top of our world. Not in the cloud. Not in your brain. Right on top of your content... Read the full article to learn more.',
        },
        {
            id: 2,
            slug: 'stop-losing-leads-after-demo',
            title: 'Stop Losing Leads After the Demo',
            date: 'May 16, 2025',
            type: 'article',
            icon: 'TrendingUp',
            summary: 'Your leads don\'t need more videos. They need answers. DotBridge turns your decks and demos into interactive, AI-powered closers.',
        },
        {
            id: 3,
            slug: 'your-lead-magnet-is-boring-heres-what-to-do-instead',
            title: 'Your Lead Magnet Is Boring. Here\'s What to Do Instead.',
            date: 'May 17, 2025',
            type: 'article',
            icon: 'Zap',
            summary: 'Stop creating dead-on-arrival lead magnets. Discover how interactive AI experiences can transform your content and start real conversations.',
        },
    ];

    return (
        <>
            <Box
                sx={{
                    minHeight: '100vh',
                    background: theme.palette.mode === 'dark'
                        ? theme.palette.background.default
                        : `linear-gradient(to bottom, ${theme.palette.grey[50]}, ${theme.palette.background.default})`,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Background decoration */}
                {!isMobile && (
                    <>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -200,
                                right: -200,
                                width: 400,
                                height: 400,
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${theme.palette.primary.main}08 0%, transparent 70%)`,
                                filter: 'blur(40px)',
                                pointerEvents: 'none'
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -150,
                                left: -150,
                                width: 300,
                                height: 300,
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${theme.palette.primary.light}08 0%, transparent 70%)`,
                                filter: 'blur(40px)',
                                pointerEvents: 'none'
                            }}
                        />
                    </>
                )}

                <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, position: 'relative' }}>
                    {/* Header Section */}
                    <Box ref={headerRef} sx={{ mb: { xs: 6, md: 8 } }}>
                        <motion.div
                            initial="initial"
                            animate={headerInView ? "animate" : "initial"}
                            variants={staggerChildren}
                        >
                            <motion.div variants={fadeInUp}>
                                <DotBridgeTypography
                                    variant="h1"
                                    align="center"
                                    gradient
                                    sx={{
                                        fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                                        fontWeight: 700,
                                        mb: 3,
                                        letterSpacing: '-0.02em'
                                    }}
                                >
                                    DotBridge Insights
                                </DotBridgeTypography>
                            </motion.div>

                            <motion.div variants={fadeInUp}>
                                <DotBridgeTypography
                                    variant="h5"
                                    align="center"
                                    color="text.secondary"
                                    sx={{
                                        maxWidth: '750px',
                                        mx: 'auto',
                                        lineHeight: 1.6,
                                        fontSize: { xs: '1.1rem', md: '1.25rem' }
                                    }}
                                >
                                    Stay informed with the latest articles, news, and perspectives from the DotBridge team.
                                    We explore the frontiers of AI for business communication.
                                </DotBridgeTypography>
                            </motion.div>
                        </motion.div>
                    </Box>

                    {/* Blog Posts Grid */}
                    <Box ref={postsRef}>
                        <motion.div
                            initial="initial"
                            animate={postsInView ? "animate" : "initial"}
                            variants={staggerChildren}
                        >
                            <Grid container spacing={{ xs: 3, md: 4 }}>
                                {posts.map((post, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                                        <motion.div
                                            variants={fadeInUp}
                                            whileHover={{ y: -8 }}
                                            transition={{ duration: 0.2 }}
                                            style={{ height: '100%' }}
                                        >
                                            <Box
                                                sx={{
                                                    height: '100%',
                                                    p: { xs: 3, sm: 4 },
                                                    borderRadius: theme.shape.borderRadius * 3,
                                                    background: theme.palette.background.paper,
                                                    border: `1px solid ${theme.palette.divider}`,
                                                    boxShadow: theme.shadows[1],
                                                    transition: 'all 0.3s ease',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        boxShadow: theme.shadows[4],
                                                        borderColor: theme.palette.primary.light,
                                                        '& .blog-icon': {
                                                            transform: 'scale(1.1)',
                                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                            color: 'white'
                                                        }
                                                    }
                                                }}
                                            >
                                                {/* Header with date and type */}
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                                    <DotBridgeTypography
                                                        variant="caption"
                                                        sx={{
                                                            color: 'text.secondary',
                                                            fontWeight: 500,
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        {post.date}
                                                    </DotBridgeTypography>
                                                    {post.type && (
                                                        <Box
                                                            sx={{
                                                                px: 1.5,
                                                                py: 0.5,
                                                                borderRadius: 2,
                                                                border: '1px solid',
                                                                ...getTypeChipStyles(post.type),
                                                                fontSize: '0.75rem',
                                                                fontWeight: 600,
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.05em'
                                                            }}
                                                        >
                                                            {post.type}
                                                        </Box>
                                                    )}
                                                </Box>

                                                {/* Icon */}
                                                <Box
                                                    className="blog-icon"
                                                    sx={{
                                                        width: 56,
                                                        height: 56,
                                                        borderRadius: 2,
                                                        background: `${theme.palette.primary.main}10`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mb: 3,
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    <DotBridgeIcon
                                                        name={post.icon}
                                                        size={28}
                                                        color="primary.main"
                                                    />
                                                </Box>

                                                {/* Content */}
                                                <DotBridgeTypography
                                                    variant="h5"
                                                    sx={{
                                                        fontWeight: 600,
                                                        mb: 2,
                                                        color: 'text.primary',
                                                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                                                        lineHeight: 1.3
                                                    }}
                                                >
                                                    {post.title}
                                                </DotBridgeTypography>

                                                <DotBridgeTypography
                                                    variant="body1"
                                                    color="text.secondary"
                                                    sx={{
                                                        mb: 3,
                                                        lineHeight: 1.6,
                                                        flexGrow: 1
                                                    }}
                                                >
                                                    {post.summary}
                                                </DotBridgeTypography>

                                                {/* Read More Button */}
                                                <DotBridgeButton
                                                    variant="text"
                                                    component={RouterLink}
                                                    to={`/blog/${post.slug}`}
                                                    endIcon={<DotBridgeIcon name="ArrowRight" size={18} />}
                                                    sx={{
                                                        color: 'primary.main',
                                                        fontWeight: 600,
                                                        alignSelf: 'flex-start',
                                                        '&:hover': {
                                                            background: `${theme.palette.primary.main}08`
                                                        }
                                                    }}
                                                >
                                                    Read More
                                                </DotBridgeButton>
                                            </Box>
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>

                        {/* Coming Soon Message */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={postsInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Box sx={{ textAlign: 'center', mt: { xs: 6, md: 10 } }}>
                                <DotBridgeTypography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 1.5
                                    }}
                                >
                                    <DotBridgeIcon name="Sparkles" size={24} color="primary.main" />
                                    More articles coming soon. Stay tuned!
                                    <DotBridgeIcon name="Sparkles" size={24} color="primary.main" />
                                </DotBridgeTypography>
                            </Box>
                        </motion.div>
                    </Box>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default BlogPage; 