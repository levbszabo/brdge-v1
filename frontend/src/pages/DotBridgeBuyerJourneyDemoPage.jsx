import React from 'react';
import { useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import JourneyStep from '../components/JourneyStep';

const journeyStepsData = [
    { id: 'awareness', title: 'Awareness Bridge', subtitle: 'Capture attention with an engaging, short-form explainer', videoUrl: '#awareness_video', alignment: 'left' },
    { id: 'discovery', title: 'Discovery Bridge', subtitle: 'Qualify the lead and gather requirements', videoUrl: '#discovery_video', alignment: 'right' },
    { id: 'demo', title: 'Demo Bridge', subtitle: 'Tailored walkthrough of DotBridge based on Discovery answers', videoUrl: '#demo_video', alignment: 'left' },
    { id: 'sales', title: 'Sales Bridge', subtitle: 'Answer objections, show pricing, and close', videoUrl: '#sales_video', alignment: 'right' },
    { id: 'onboarding', title: 'Onboarding Bridge', subtitle: 'Help new users get set up', videoUrl: '#onboarding_video', alignment: 'left' },
    { id: 'success', title: 'Customer Success', subtitle: 'Post-purchase support and upsell', videoUrl: '#success_video', alignment: 'right', isLast: true },
];

const DotBridgeBuyerJourneyDemoPage = () => {
    const theme = useTheme();

    return (
        <>
            <CssBaseline />
            <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 }, color: theme.palette.text.primary }}>
                {/* Header Section */}
                <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 8 } }}>
                    <Typography variant="h2" component="h1" sx={{ mb: 1.5, color: theme.palette.text.primary }}>
                        DotBridge Buyer Journey Demo
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, maxWidth: '720px', margin: 'auto' }}>
                        Experience the future of interactive video. Below, explore each stage
                        of a buyer’s journey – powered by DotBridge AI agents. Each Bridge is
                        a live demo. Click, watch, and interact.
                    </Typography>
                </Box>

                {/* Journey Steps Section */}
                <Box sx={{ position: 'relative', maxWidth: '680px', margin: 'auto' }}>
                    {journeyStepsData.map((step, index) => (
                        <JourneyStep
                            key={step.id}
                            title={step.title}
                            subtitle={step.subtitle}
                            videoUrl={step.videoUrl}
                            alignment={step.alignment}
                            isLast={step.isLast}
                        />
                    ))}
                </Box>

                {/* Footer CTA Section */}
                <Box sx={{ textAlign: 'center', mt: { xs: 6, md: 10 }, py: 4 }}>
                    <Typography variant="h4" component="h2" sx={{ mb: 3, color: theme.palette.text.primary }}>
                        Want a flow like this for your business?
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} sm="auto">
                            <Button variant="contained" color="primary" size="large" sx={{ minWidth: '200px' }}>
                                Book a Call
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm="auto">
                            <Button variant="outlined" color="primary" size="large" sx={{ minWidth: '200px' }}>
                                Create Your First Bridge (Free)
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
};

export default DotBridgeBuyerJourneyDemoPage;
