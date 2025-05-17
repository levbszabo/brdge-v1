import React from 'react';
import { Container, Typography, Box, Grid, Paper, Button, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { MotionPageHeader, AnimatedPageTitle, AnimatedPageSubtitle } from '../styles/sharedStyles';
import { useInView } from 'react-intersection-observer';
import Footer from '../components/Footer';

const BlogPageContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(8),
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(10),
    },
}));

const BlogPostCard = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(3.5),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 1.5,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[2],
    transition: theme.transitions.create(['transform', 'box-shadow', 'border-color'], {
        duration: theme.transitions.duration.enteringScreen,
    }),
    '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: theme.shadows[6],
        borderColor: theme.palette.primary.light,
    },
}));

const CardContent = styled(Box)({
    flexGrow: 1,
});

const BlogPage = () => {
    const [headerRef, headerInView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    // Helper function to determine Chip color based on post type
    const getTypeChipColor = (type) => {
        switch (type ? type.toLowerCase() : '') {
            case 'article':
                return 'primary';
            case 'demo':
                return 'secondary';
            case 'whitepaper':
                return 'success'; // MUI 'success' color (typically green)
            case 'press release': // Example for another type
                return 'info';    // MUI 'info' color (typically blue)
            default:
                return 'default';
        }
    };

    // Placeholder blog posts - we will replace these with actual content
    const posts = [
        {
            id: 0,
            slug: 'dotbridge-future-of-business-communication',
            title: 'DotBridge: The Future of Business Communication',
            date: 'May 15, 2025',
            type: 'whitepaper',
            summary: 'Download our comprehensive whitepaper on how DotBridge is reshaping business communication with AI-powered interactive content.',
        },
        {
            id: 1,
            slug: 'you-dont-need-to-know-everything',
            title: 'You Don\'t Need to Know Everything - You Just Need the Right Bridges',
            date: 'May 16, 2025',
            type: 'article',
            summary: 'Something massive is happening in how we transfer knowledge. Quietly, a new layer of intelligence is being built on top of our world. Not in the cloud. Not in your brain. Right on top of your content... Reach the full article to learn more.',
        },
        {
            id: 2,
            slug: 'stop-losing-leads-after-demo',
            title: 'Stop Losing Leads After the Demo',
            date: 'May 16, 2025',
            type: 'article',
            summary: 'Your leads don\'t need more videos. They need answers. DotBridge turns your decks and demos into interactive, AI-powered closers.',
        },
        {
            id: 3,
            slug: 'your-lead-magnet-is-boring-heres-what-to-do-instead',
            title: 'Your Lead Magnet Is Boring. Here\'s What to Do Instead.',
            date: 'May 17, 2025',
            type: 'article',
            summary: 'Stop creating dead-on-arrival lead magnets. Discover how interactive AI experiences can transform your content and start real conversations.',
        },

    ];

    return (
        <>
            <BlogPageContainer maxWidth="lg">
                <Box ref={headerRef}>
                    <MotionPageHeader>
                        <AnimatedPageTitle>
                            DotBridge Insights
                        </AnimatedPageTitle>
                        <AnimatedPageSubtitle>
                            Stay informed with the latest articles, news, and perspectives from the DotBridge team. We explore the frontiers of AI for business communication.
                        </AnimatedPageSubtitle>
                    </MotionPageHeader>
                </Box>

                <Grid container spacing={4}>
                    {posts.map((post) => (
                        <Grid item xs={12} sm={6} md={4} key={post.id}>
                            <BlogPostCard>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            {post.date}
                                        </Typography>
                                        {post.type && (
                                            <Chip
                                                label={post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                                                size="small"
                                                color={getTypeChipColor(post.type)}
                                                sx={{ fontWeight: 500, ml: 1 }}
                                            />
                                        )}
                                    </Box>
                                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
                                        {post.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5 }}>
                                        {post.summary}
                                    </Typography>
                                </CardContent>
                                <Box sx={{ mt: 'auto', pt: 1 }}>
                                    <Button
                                        variant="text"
                                        component={RouterLink}
                                        to={`/blog/${post.slug}`}
                                        endIcon={<ArrowForwardIcon />}
                                        sx={(theme) => ({
                                            color: 'primary.main',
                                            fontWeight: 500,
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                            }
                                        })}
                                    >
                                        Read More
                                    </Button>
                                </Box>
                            </BlogPostCard>
                        </Grid>
                    ))}
                </Grid>

                <Box textAlign="center" mt={{ xs: 6, md: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                        More articles coming soon. Stay tuned!
                    </Typography>
                </Box>
            </BlogPageContainer>
            <Footer />
        </>
    );
};

export default BlogPage; 