import React, { useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Divider,
    List,
    ListItem,
    useTheme,
    Link
} from '@mui/material';
// Removed motion import as it's not used in the new theme
// import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

// PolicyPage Component
function PolicyPage() {
    const theme = useTheme();

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const element = document.getElementById(hash.slice(1));
            if (element) {
                const yOffset = -80;
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    }, []);

    // SectionTitle component using theme
    const SectionTitle = ({ children, id }) => (
        <Typography
            id={id}
            variant="h4"
            component="h2"
            sx={{
                color: 'text.primary',
                fontWeight: 600,
                mt: 5,
                mb: 2,
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                pb: 0.5,
                display: 'inline-block'
            }}
        >
            {children}
        </Typography>
    );

    // SubSection component using theme
    const SubSection = ({ title, children }) => (
        <Box sx={{ mb: 3, mt: 3 }}>
            <Typography
                variant="h6"
                sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    mb: 1
                }}
            >
                {title}
            </Typography>
            {children}
        </Box>
    );

    return (
        <Box sx={{
            minHeight: 'calc(100vh - 64px)',
            bgcolor: 'background.default',
            py: { xs: 8, md: 12 },
        }}>
            <Container maxWidth="md">
                <Typography
                    variant="h1"
                    component="h1"
                    align="center"
                    sx={{
                        color: 'text.primary',
                        mb: { xs: 6, md: 8 }
                    }}
                >
                    Policies
                </Typography>

                <Paper
                    variant="outlined"
                    sx={{
                        p: { xs: 3, sm: 4, md: 5 },
                        mb: 4,
                        bgcolor: 'background.paper',
                        '& p, & li': {
                            color: 'text.secondary',
                            lineHeight: 1.7,
                            fontSize: '1rem',
                            mb: 2
                        },
                        '& strong': {
                            color: 'text.primary',
                            fontWeight: 500
                        },
                        '& ul, & ol': {
                            pl: 3,
                            mb: 2,
                        },
                        '& li': {
                            mb: 1,
                            pl: 1,
                            listStyleType: 'disc',
                            paddingInlineStart: 0
                        }
                    }}
                >
                    <Box id="privacy">
                        <Typography variant="h2" sx={{ color: 'text.primary', mb: 1 }}>
                            Privacy Policy
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
                            Last Updated: January 19, 2025
                        </Typography>

                        <SectionTitle id="privacy-intro">1. Introduction</SectionTitle>
                        <Typography paragraph>
                            .bridge ("we," "us," or "our") is operated by Journeyman AI LLC. We are committed to protecting your privacy and safeguarding your personal information. This Privacy Policy outlines how we collect, use, disclose, and protect your data when you use our services. By accessing or using .bridge, you agree to the practices described in this policy.
                        </Typography>

                        <SectionTitle id="privacy-info">2. Information We Collect</SectionTitle>
                        <SubSection title="a. Account Details">
                            <Typography paragraph>
                                Personal Information: Email address, display name, and basic profile information required to create and maintain your account.
                            </Typography>
                        </SubSection>
                        <SubSection title="b. Usage Data">
                            <Typography paragraph>
                                Analytics: Logs of feature usage (e.g., AI minutes used, chat queries), browser type, IP address, and device information to analyze and improve our services.
                            </Typography>
                        </SubSection>
                        <SubSection title="c. Content">
                            <Typography paragraph>
                                User-Uploaded Materials: Videos, presentations, PDFs, audio recordings, and any other materials you upload for AI processing.
                            </Typography>
                        </SubSection>
                        <SubSection title="d. Payment Information">
                            <Typography paragraph>
                                Financial Data: We utilize secure third-party payment processors (e.g., Stripe). We do not store full payment card details on our servers.
                            </Typography>
                        </SubSection>
                        <SubSection title="e. Cookies and Tracking Technologies">
                            <Typography paragraph>
                                Cookies: We use essential cookies for site functionality and session management. We may use analytics cookies to understand usage patterns. You can manage cookie preferences through your browser settings.
                            </Typography>
                        </SubSection>

                        <SectionTitle id="privacy-use">3. How We Use Your Data</SectionTitle>
                        <Typography paragraph>We use the collected data to:</Typography>
                        <List>
                            <ListItem>Provide, maintain, and enhance our services.</ListItem>
                            <ListItem>Process payments and manage billing.</ListItem>
                            <ListItem>Analyze usage patterns to improve user experience and service performance.</ListItem>
                            <ListItem>Communicate with you regarding your account, updates, offers, and support requests.</ListItem>
                            <ListItem>Ensure the security and integrity of our platform and prevent fraudulent activity.</ListItem>
                        </List>

                        <SectionTitle id="privacy-protection">4. Data Protection</SectionTitle>
                        <Typography paragraph>
                            We implement industry-standard security measures, including encryption and secure infrastructure practices, to protect your data. However, no internet transmission or electronic storage method is 100% secure. We strive to protect your personal information but cannot guarantee its absolute security.
                        </Typography>

                        <SectionTitle id="privacy-rights">5. Your Rights</SectionTitle>
                        <Typography paragraph>Depending on your jurisdiction, you may have the following rights regarding your personal data:</Typography>
                        <List>
                            <ListItem>Access: Request access to the personal information we hold about you.</ListItem>
                            <ListItem>Correction: Request correction of inaccurate personal data.</ListItem>
                            <ListItem>Deletion: Request deletion of your personal data, subject to legal and contractual restrictions.</ListItem>
                            <ListItem>Opt-Out: Opt out of non-essential communications.</ListItem>
                            <ListItem>Data Portability: Request a copy of your data in a machine-readable format.</ListItem>
                        </List>
                        <Typography paragraph>
                            To exercise these rights, please contact us at levi@brdge-ai.com.
                        </Typography>

                        <SectionTitle id="privacy-children">6. Children's Privacy</SectionTitle>
                        <Typography paragraph>
                            .bridge is not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected such information, please contact us to request its deletion.
                        </Typography>

                        <SectionTitle id="privacy-retention">7. Data Retention Policy</SectionTitle>
                        <Typography paragraph>
                            We retain your personal data for as long as your account is active or as needed to provide you services, comply with our legal obligations, resolve disputes, and enforce our agreements. Uploaded content is retained according to your plan level and actions (e.g., deletion by user).
                        </Typography>

                        <SectionTitle id="privacy-sharing">8. Third-Party Sharing</SectionTitle>
                        <Typography paragraph>
                            We share your information only with trusted third-party service providers essential for delivering our services (e.g., cloud hosting, AI processing, analytics, payment processing). These providers are contractually bound to maintain data security and confidentiality. We do not sell your personal information.
                        </Typography>

                        <SectionTitle id="privacy-breach">9. Data Breach Notification</SectionTitle>
                        <Typography paragraph>
                            In the unlikely event of a data breach impacting your personal information, we will notify you promptly in accordance with applicable laws.
                        </Typography>

                        <SectionTitle id="privacy-ai">10. Use of Third-Party AI Services</SectionTitle>
                        <SubSection title="a. AI Service Providers">
                            <Typography paragraph>
                                .bridge utilizes third-party AI models (e.g., OpenAI, Anthropic, Google) to power features like voice cloning, transcription, and question answering. These providers process data you submit through the service.
                            </Typography>
                        </SubSection>
                        <SubSection title="b. Data Processing">
                            <Typography paragraph>
                                When you upload content or interact with AI features, relevant data is securely transmitted to these providers for processing necessary to deliver the requested functionality.
                            </Typography>
                        </SubSection>
                        <SubSection title="c. Provider Policies">
                            <Typography paragraph>
                                Our AI providers adhere to strict data privacy and security standards. We select providers committed to not using customer data for training their models without explicit consent, where such options are available.
                            </Typography>
                        </SubSection>

                        <SectionTitle id="privacy-transfers">11. International Data Transfers</SectionTitle>
                        <Typography paragraph>
                            Your data may be processed by service providers located outside your jurisdiction. We ensure such transfers comply with applicable data protection laws, utilizing standard contractual clauses or other appropriate safeguards.
                        </Typography>

                        <SectionTitle id="privacy-jurisdictions">12. Prohibited Jurisdictions</SectionTitle>
                        <Typography paragraph>
                            Use of .bridge may be restricted in certain jurisdictions due to local laws or regulations. You are responsible for ensuring compliance with your local laws.
                        </Typography>

                        <SectionTitle id="privacy-changes">13. Changes to This Privacy Policy</SectionTitle>
                        <Typography paragraph>
                            We may update this policy periodically. We will notify you of significant changes via email or through the platform. Your continued use of the service after updates constitutes acceptance.
                        </Typography>

                        <SectionTitle id="privacy-contact">14. Contact Us</SectionTitle>
                        <Typography paragraph>
                            If you have questions about this Privacy Policy, please contact us at:
                        </Typography>
                        <Typography paragraph>Email: levi@brdge-ai.com</Typography>
                        <Typography paragraph>Address: 382 NE 191ST St #931764, Miami, FL, 33179</Typography>
                    </Box>

                    <Divider sx={{ my: 8 }} />

                    <Box id="terms">
                        <Typography variant="h2" sx={{ color: 'text.primary', mb: 1 }}>
                            Terms of Service
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
                            Last Updated: January 19, 2025
                        </Typography>

                        <SectionTitle id="terms-acceptance">1. Acceptance of Terms</SectionTitle>
                        <Typography paragraph>
                            By accessing or using .bridge ("Service"), provided by Journeyman AI LLC, you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.
                        </Typography>

                        <SectionTitle id="terms-accounts">2. User Accounts</SectionTitle>
                        <SubSection title="a. Eligibility">
                            <Typography paragraph>
                                You must be at least 18 years old and capable of entering into a binding contract to use the Service.
                            </Typography>
                        </SubSection>
                        <SubSection title="b. Account Security">
                            <Typography paragraph>
                                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.
                            </Typography>
                        </SubSection>
                        <SubSection title="c. Account Termination">
                            <Typography paragraph>
                                We reserve the right to suspend or terminate accounts for violations of these Terms, illegal activities, or actions harmful to the Service or other users.
                            </Typography>
                        </SubSection>

                        <SectionTitle id="terms-use">3. Use of the Service</SectionTitle>
                        <SubSection title="a. License">
                            <Typography paragraph>
                                Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to use the Service for your personal or internal business purposes according to your subscription plan.
                            </Typography>
                        </SubSection>
                        <SubSection title="b. User Content">
                            <Typography paragraph>
                                You retain ownership of the content you upload ("User Content"). You grant us a worldwide, royalty-free license to use, reproduce, modify, and process User Content solely to provide and improve the Service.
                            </Typography>
                        </SubSection>
                        <SubSection title="c. Prohibited Conduct">
                            <Typography paragraph>You agree not to:</Typography>
                            <List>
                                <ListItem>Use the Service for any illegal or unauthorized purpose.</ListItem>
                                <ListItem>Infringe upon intellectual property rights (copyright, trademark, etc.).</ListItem>
                                <ListItem>Upload malicious code, viruses, or harmful content.</ListItem>
                                <ListItem>Reverse engineer, decompile, or attempt to extract the source code of the Service.</ListItem>
                                <ListItem>Harass, abuse, or harm other users.</ListItem>
                                <ListItem>Use the service to generate content that is defamatory, obscene, pornographic, or promotes hatred or discrimination.</ListItem>
                            </List>
                        </SubSection>

                        <SectionTitle id="terms-fees">4. Fees & Billing</SectionTitle>
                        <SubSection title="a. Subscription Plans">
                            <Typography paragraph>
                                Access to certain features requires a paid subscription. Fees are based on the selected plan and are billed in advance on a recurring basis (e.g., monthly or annually).
                            </Typography>
                        </SubSection>
                        <SubSection title="b. AI Usage Billing">
                            <Typography paragraph>
                                Plans include a specified amount of AI processing minutes (e.g., for Q&A, voice cloning). Overage may be billed separately or require upgrading your plan, as detailed on our Pricing page.
                            </Typography>
                        </SubSection>
                        <SubSection title="c. Payment Terms">
                            <Typography paragraph>
                                You agree to provide accurate payment information and authorize recurring charges. Payments are processed via a secure third-party provider (Stripe). Failure to pay may result in suspension or termination.
                            </Typography>
                        </SubSection>
                        <SubSection title="d. Refund Policy">
                            <Typography paragraph>
                                Subscription fees are generally non-refundable except as required by law or explicitly stated in a specific offer. Contact support for billing inquiries.
                            </Typography>
                        </SubSection>

                        <SectionTitle id="terms-ip">5. Intellectual Property</SectionTitle>
                        <SubSection title="a. Service Ownership">
                            <Typography paragraph>
                                The Service, including its software, design, branding, and underlying technology (excluding User Content), is the exclusive property of Journeyman AI LLC and its licensors.
                            </Typography>
                        </SubSection>
                        <SubSection title="b. AI Outputs">
                            <Typography paragraph>
                                Subject to your rights in the underlying User Content and compliance with these Terms, you generally own the specific outputs (e.g., generated video, transcripts, AI responses) created from your User Content using the Service. Note that similar inputs may produce similar outputs for different users.
                            </Typography>
                        </SubSection>
                        <SubSection title="c. Feedback">
                            <Typography paragraph>
                                Any feedback or suggestions you provide regarding the Service become our property, and we may use them without obligation to you.
                            </Typography>
                        </SubSection>

                        <SectionTitle id="terms-disclaimers">6. Disclaimers</SectionTitle>
                        <Typography paragraph>
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT AI OUTPUTS WILL BE ACCURATE OR RELIABLE.
                        </Typography>

                        <SectionTitle id="terms-liability">7. Limitation of Liability</SectionTitle>
                        <Typography paragraph>
                            TO THE FULLEST EXTENT PERMITTED BY LAW, JOURNEYMAN AI LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (A) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; (C) ANY CONTENT OBTAINED FROM THE SERVICE; OR (D) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT.
                        </Typography>

                        <SectionTitle id="terms-indemnification">8. Indemnification</SectionTitle>
                        <Typography paragraph>
                            You agree to defend, indemnify, and hold harmless Journeyman AI LLC and its affiliates, officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's fees) arising from your use of the Service or your violation of these Terms.
                        </Typography>

                        <SectionTitle id="terms-modifications">9. Modifications to Terms</SectionTitle>
                        <Typography paragraph>
                            We reserve the right to modify these Terms at any time. We will provide notice of material changes (e.g., via email or in-app notification). Your continued use of the Service after changes constitutes acceptance.
                        </Typography>

                        <SectionTitle id="terms-governing-law">10. Governing Law & Dispute Resolution</SectionTitle>
                        <Typography paragraph>
                            These Terms are governed by the laws of the State of Florida, USA, without regard to conflict of law principles. Any disputes arising shall be resolved through binding arbitration in Miami, Florida, according to the rules of the American Arbitration Association, or in small claims court where applicable.
                        </Typography>

                        <SectionTitle id="terms-general">11. General Provisions</SectionTitle>
                        <Typography paragraph>
                            These Terms constitute the entire agreement between you and Journeyman AI LLC regarding the Service. If any provision is held invalid, the remaining provisions remain in effect. Our failure to enforce any right does not constitute a waiver.
                        </Typography>

                    </Box>

                    <Box sx={{ mt: 6, textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            For questions about these policies, contact us at <Link href="mailto:levi@brdge-ai.com" sx={{ fontWeight: 500 }}>levi@brdge-ai.com</Link>.
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default PolicyPage;
