import React from 'react';
import { Container, Typography, Box, Paper, Divider, useTheme } from '@mui/material';

function PolicyPage() {
    const theme = useTheme();

    const SectionTitle = ({ children }) => (
        <Typography variant="h4" component="h2" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mt: 4 }}>
            {children}
        </Typography>
    );

    const SubSectionTitle = ({ children }) => (
        <Typography variant="h6" component="h3" gutterBottom sx={{ color: theme.palette.secondary.main, fontWeight: 'bold', mt: 2 }}>
            {children}
        </Typography>
    );

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' }}>
                <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                    Privacy Policy & Terms of Service
                </Typography>
                <Typography variant="subtitle1" align="center" gutterBottom>
                    Last Updated: [Date]
                </Typography>

                <Divider sx={{ my: 4 }} />

                <SectionTitle>Privacy Policy</SectionTitle>
                <Typography paragraph>
                    At Brdge AI, owned and operated by Journeyman AI LLC, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and protect the data you provide to us when using our platform.
                </Typography>

                <SubSectionTitle>1. Data Collection and Usage</SubSectionTitle>
                <Typography paragraph>
                    <strong>Personal Information:</strong> When you sign up or log in through Google, we collect your name, email address, and Google ID for authentication purposes. We do not share this information directly with third parties.
                </Typography>
                <Typography paragraph>
                    <strong>Content Data:</strong> Brdge AI uses secure AI processing services to generate and process content. Content data (such as documents or presentations) is processed solely for the purpose of creating AI-driven presentations and is not shared or stored for any use outside of Brdge AI's features.
                </Typography>

                <SubSectionTitle>2. Data Sharing and Security</SubSectionTitle>
                <Typography paragraph>
                    <strong>No Unauthorized Sharing:</strong> Brdge AI does not share or sell your personal data to any third parties. All data processing is handled within authorized, secure frameworks.
                </Typography>
                <Typography paragraph>
                    <strong>Secure Processing:</strong> Data is securely transmitted to our AI processing models, ensuring that your data is handled with strict security protocols.
                </Typography>

                <SubSectionTitle>3. Data Retention</SubSectionTitle>
                <Typography paragraph>
                    <strong>Account Data:</strong> We retain your account data (name, email, Google ID) as long as your account remains active. You may request deletion of your account at any time.
                </Typography>
                <Typography paragraph>
                    <strong>Content Data:</strong> Documents or presentations you upload are stored as needed for active use on the platform and may be deleted according to our data retention policy.
                </Typography>

                <SubSectionTitle>4. Your Rights</SubSectionTitle>
                <Typography paragraph>
                    <strong>Access and Control:</strong> You have the right to view, modify, or delete your personal data at any time by accessing your user profile or contacting support.
                </Typography>
                <Typography paragraph>
                    If you have questions about your privacy, please reach out to our support team.
                </Typography>

                <Divider sx={{ my: 4 }} />

                <SectionTitle>Terms of Service</SectionTitle>
                <Typography paragraph>
                    Welcome to Brdge AI! Brdge AI is owned and operated by Journeyman AI LLC. By using our platform, you agree to the following terms and conditions. Please read them carefully.
                </Typography>

                <SubSectionTitle>1. Use of the Platform</SubSectionTitle>
                <Typography paragraph>
                    <strong>Authorized Use:</strong> Brdge AI is designed to help users create interactive presentations using AI-driven models. By using this platform, you agree not to misuse the services or content generated.
                </Typography>
                <Typography paragraph>
                    <strong>Data Processing:</strong> Brdge AI uses secure AI models to process content. By uploading content, you acknowledge and consent to the use of these models solely for enhancing your experience on Brdge AI.
                </Typography>

                <SubSectionTitle>2. User Responsibilities</SubSectionTitle>
                <Typography paragraph>
                    <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities conducted under your account.
                </Typography>
                <Typography paragraph>
                    <strong>Prohibited Activities:</strong> You may not use Brdge AI to create, share, or distribute any content that is illegal, infringing, or violates others' rights.
                </Typography>

                <SubSectionTitle>3. Intellectual Property</SubSectionTitle>
                <Typography paragraph>
                    <strong>User Content:</strong> Any content you upload remains your intellectual property. Brdge AI only uses your content for processing and presentation purposes as permitted by these terms.
                </Typography>
                <Typography paragraph>
                    <strong>Platform Content:</strong> Journeyman AI LLC retains all rights to the Brdge AI platform, services, and proprietary algorithms.
                </Typography>

                <SubSectionTitle>4. Limitation of Liability</SubSectionTitle>
                <Typography paragraph>
                    Brdge AI provides its services "as is" and makes no warranties regarding the accuracy, reliability, or quality of content generated by AI models.
                </Typography>

                <SubSectionTitle>5. Changes to Terms</SubSectionTitle>
                <Typography paragraph>
                    Journeyman AI LLC reserves the right to update these Terms of Service at any time. Notice of changes will be provided to users.
                </Typography>
            </Paper>
        </Container>
    );
}

export default PolicyPage;
