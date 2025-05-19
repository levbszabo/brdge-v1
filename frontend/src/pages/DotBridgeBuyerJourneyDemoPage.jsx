import React from 'react';
import { useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Link as RouterLink } from 'react-router-dom';
import { MotionPageHeader, AnimatedPageTitle, AnimatedPageSubtitle } from '../styles/sharedStyles';
import { useInView } from 'react-intersection-observer';
import Footer from '../components/Footer';

import JourneyStep from '../components/JourneyStep';

const journeyStepsData = [
    { id: 'awareness', title: 'Awareness Bridge', subtitle: 'Capture attention with an engaging, short-form explainer', videoUrl: 'https://dotbridge.io/viewBridge/431-b9759d', alignment: 'left' },
    { id: 'discovery', title: 'Discovery Bridge', subtitle: 'Qualify the lead and gather requirements', videoUrl: '#discovery_video', alignment: 'right' },
    { id: 'demo', title: 'Demo Bridge', subtitle: 'Tailored walkthrough of DotBridge based on Discovery answers', videoUrl: '#demo_video', alignment: 'left' },
    { id: 'sales', title: 'Sales Bridge', subtitle: 'Answer objections, show pricing, and close', videoUrl: '#sales_video', alignment: 'right' },
    { id: 'onboarding', title: 'Onboarding Bridge', subtitle: 'Help new users get set up', videoUrl: '#onboarding_video', alignment: 'left' },
    { id: 'success', title: 'Customer Success', subtitle: 'Post-purchase support and upsell', videoUrl: '#success_video', alignment: 'right', isLast: true },
];

const DotBridgeBuyerJourneyDemoPage = () => {
    const theme = useTheme();
    const stepMarginBottom = { xs: 8, md: 12 };
    const [headerRef, headerInView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    return (
        <>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, color: theme.palette.text.primary }}>
                {/* Header Section - Using new animated components */}
                <Box ref={headerRef}>
                    <MotionPageHeader>
                        <AnimatedPageTitle sx={{
                            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                            fontWeight: 500
                        }}>
                            The Buyer Journey
                        </AnimatedPageTitle>
                        <AnimatedPageSubtitle>
                            Experience the future of the digital sales funnel. Below, explore each stage
                            of a buyer's journey – powered by DotBridge AI agents. Each Bridge is
                            a live demo. Click, watch, and interact.
                        </AnimatedPageSubtitle>
                    </MotionPageHeader>
                </Box>

                {/* Main content Grid for side text and journey diagram */}
                <Grid container spacing={4} justifyContent="center" alignItems="stretch">
                    {/* Left Side Content - Hidden on xs, visible md and up */}
                    <Grid item md={2} sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: theme.shape.borderRadius, mt: 4 }}>
                            <Typography variant="h6" gutterBottom>Start Here</Typography>
                            <Typography variant="body2" color="text.secondary">
                                The beginning of the buyers journey starts with awareness, is this product right for your customers?
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Journey Steps Section - Central Column */}
                    <Grid item xs={12} md={8} lg={7}>
                        <Box sx={{ position: 'relative', maxWidth: '680px', margin: 'auto' }}>
                            {journeyStepsData.map((step) => (
                                <Box key={step.id} sx={{ mb: stepMarginBottom }}>
                                    <JourneyStep
                                        title={step.title}
                                        subtitle={step.subtitle}
                                        videoUrl={step.videoUrl}
                                        alignment={step.alignment}
                                        isLast={step.isLast}
                                        isComingSoonProp={step.id !== 'awareness'}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    {/* Right Side Content - Adjusted for bottom alignment */}
                    <Grid item md={2} sx={{
                        display: { xs: 'none', md: 'block' },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end'
                    }}>
                        <Box sx={{
                            p: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: theme.shape.borderRadius,
                            mb: stepMarginBottom.md // Match last step's bottom margin for alignment
                        }}>
                            <Typography variant="h6" gutterBottom>End Here</Typography>
                            <Typography variant="body2" color="text.secondary">
                                The end of the buyers journey is a happy customer. DotBridge extracts valuable insights and feeds them back into the system, creating a self-reinforcing value flywheel.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {/* Footer CTA Section */}
                <Box sx={{ textAlign: 'center', mt: { xs: 6, md: 10 }, py: 4 }}>
                    <Typography variant="h4" component="h2" sx={{ mb: 3, color: theme.palette.text.primary }}>
                        Want a flow like this for your business?
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} sm="auto">
                            <Button variant="contained" color="primary" size="large" sx={{ minWidth: '200px' }} component={RouterLink} to="/contact">
                                Request a Demo
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm="auto">
                            <Button variant="outlined" color="primary" size="large" sx={{ minWidth: '200px' }} component={RouterLink} to="/signup">
                                Create Your First Bridge (Free)
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
            <Footer />
        </>
    );
};

export default DotBridgeBuyerJourneyDemoPage;
