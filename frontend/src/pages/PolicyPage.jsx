import React from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Divider,
    List,
    ListItem
} from '@mui/material';
import { motion } from 'framer-motion';

function PolicyPage() {
    React.useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const element = document.getElementById(hash.slice(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, []);

    const SectionTitle = ({ children }) => (
        <Typography variant="h4" sx={{ color: '#00ffcc', mb: 2, mt: 4, fontWeight: 600 }}>
            {children}
        </Typography>
    );

    const SubSection = ({ title, children }) => (
        <>
            <Typography variant="h6" sx={{ color: '#00ffcc', mb: 1, mt: 2, fontWeight: 500 }}>
                {title}
            </Typography>
            {children}
        </>
    );

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #001B3D 0%, #000C1F 15%, #001F5C 35%, #0041C2 60%, #00B4DB 100%)',
            position: 'relative',
            pt: { xs: 12, sm: 14, md: 16 },
            pb: 8,
            color: 'white',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: '10%',
                left: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(0,255,204,0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                animation: 'float 15s infinite alternate'
            },
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '10%',
                right: '-10%',
                width: '700px',
                height: '700px',
                background: 'radial-gradient(circle, rgba(0,180,219,0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                animation: 'float 20s infinite alternate-reverse'
            }
        }}>
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            textAlign: 'center',
                            mb: { xs: 4, sm: 6 },
                            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                            fontWeight: 700,
                            color: 'white',
                            textTransform: 'none',
                            letterSpacing: '-0.02em',
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-16px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '120px',
                                height: '1px',
                                background: 'linear-gradient(90deg, transparent, rgba(0,255,204,0.3), transparent)',
                                boxShadow: '0 0 10px rgba(0,255,204,0.2)',
                                borderRadius: '1px'
                            }
                        }}
                    >
                        Policies
                    </Typography>

                    <Paper sx={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        p: { xs: 3, sm: 4, md: 5 },
                        mb: 4,
                        color: 'white',
                        boxShadow: `
                            0 8px 32px rgba(0,0,0,0.1),
                            0 0 0 1px rgba(255,255,255,0.1),
                            0 0 40px rgba(0,180,219,0.1)
                        `,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            boxShadow: `
                                0 12px 40px rgba(0,0,0,0.15),
                                0 0 0 1px rgba(255,255,255,0.2),
                                0 0 60px rgba(0,180,219,0.2)
                            `
                        },
                        '& h3': {
                            color: '#00ffcc',
                            mb: 3,
                            mt: 5,
                            fontWeight: 700,
                            fontSize: { xs: '1.75rem', sm: '2rem' },
                            letterSpacing: '-0.01em',
                            textShadow: '0 0 20px rgba(0,255,204,0.2)'
                        },
                        '& h4': {
                            color: '#00ffcc',
                            mb: 2,
                            mt: 4,
                            fontWeight: 600,
                            fontSize: { xs: '1.25rem', sm: '1.5rem' },
                            letterSpacing: '-0.01em'
                        },
                        '& p': {
                            color: 'rgba(255, 255, 255, 0.8)',
                            mb: 2,
                            lineHeight: 1.7,
                            fontSize: { xs: '0.95rem', sm: '1rem' }
                        }
                    }}>
                        {/* Privacy Policy Section */}
                        <Box id="privacy">
                            <Typography variant="h3" sx={{ mt: 0 }}>Privacy Policy</Typography>
                            <Typography variant="body2" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.6)' }}>
                                Last Updated: January 19, 2025
                            </Typography>

                            <SectionTitle>1. Introduction</SectionTitle>
                            <Typography paragraph>
                                Brdge AI ("we," "us," or "our") is operated by Journeyman AI LLC. We are committed to protecting your privacy and safeguarding your personal information. This Privacy Policy outlines how we collect, use, disclose, and protect your data when you use our services. By accessing or using Brdge AI, you agree to the practices described in this policy.
                            </Typography>

                            <SectionTitle>2. Information We Collect</SectionTitle>
                            <SubSection title="a. Account Details">
                                <Typography paragraph>
                                    Personal Information: Email address, display name, and basic profile information required to create and maintain your account.
                                </Typography>
                            </SubSection>
                            <SubSection title="b. Usage Data">
                                <Typography paragraph>
                                    Analytics: Logs of feature usage (e.g., number of minutes of AI usage, chat queries), browser type, IP address, and device information to analyze and improve our services.
                                </Typography>
                            </SubSection>
                            <SubSection title="c. Content">
                                <Typography paragraph>
                                    User-Uploaded Materials: Presentations, PDFs, audio recordings, and any other materials you upload for AI processing.
                                </Typography>
                            </SubSection>
                            <SubSection title="d. Payment Information">
                                <Typography paragraph>
                                    Financial Data: We utilize secure third-party payment processors (e.g., Stripe). We do not store full payment card details on our servers.
                                </Typography>
                            </SubSection>
                            <SubSection title="e. Cookies and Tracking Technologies">
                                <Typography paragraph>
                                    Cookies: We use cookies and similar technologies to enhance user experience, analyze website usage, and deliver personalized content. You can manage your cookie preferences through your browser settings.
                                </Typography>
                            </SubSection>

                            <SectionTitle>3. How We Use Your Data</SectionTitle>
                            <Typography paragraph>We use the collected data to:</Typography>
                            <List sx={{ pl: 2, '& li': { color: 'rgba(255, 255, 255, 0.8)', mb: 1 } }}>
                                <ListItem>Provide and enhance our services.</ListItem>
                                <ListItem>Process payments and manage billing.</ListItem>
                                <ListItem>Analyze usage patterns to improve user experience.</ListItem>
                                <ListItem>Communicate with you about updates, offers, and support.</ListItem>
                                <ListItem>Ensure security and prevent fraud.</ListItem>
                            </List>

                            <SectionTitle>4. Data Protection</SectionTitle>
                            <Typography paragraph>
                                We implement industry-standard security measures to protect your data, including encryption and secure storage solutions. However, no method of transmission over the internet or electronic storage is entirely secure, and we cannot guarantee absolute security.
                            </Typography>

                            <SectionTitle>5. Your Rights</SectionTitle>
                            <Typography paragraph>You have the following rights regarding your personal data:</Typography>
                            <List sx={{ pl: 2, '& li': { color: 'rgba(255, 255, 255, 0.8)', mb: 1 } }}>
                                <ListItem>Access: Request access to your personal information.</ListItem>
                                <ListItem>Deletion: Request deletion of your personal data.</ListItem>
                                <ListItem>Opt-Out: Opt out of marketing communications.</ListItem>
                                <ListItem>Data Portability: Export your data in a structured, commonly used format.</ListItem>
                            </List>
                            <Typography paragraph>
                                To exercise these rights, please contact us at levi@brdge-ai.com.
                            </Typography>

                            <SectionTitle>6. Children's Privacy</SectionTitle>
                            <Typography paragraph>
                                Brdge AI is not intended for individuals under 18 years of age. We do not knowingly collect personal information from minors. If we become aware that we have inadvertently collected such data, we will delete it promptly.
                            </Typography>

                            <SectionTitle>7. Data Retention Policy</SectionTitle>
                            <Typography paragraph>
                                We retain your personal data only for as long as necessary to provide our services or comply with legal obligations. Uploaded content may be stored until you explicitly delete it or as required by our retention policy.
                            </Typography>

                            <SectionTitle>8. Third-Party Sharing</SectionTitle>
                            <Typography paragraph>
                                We may share your information with trusted third-party service providers who assist us in delivering our services, such as cloud hosting, analytics, or payment processing. These providers are obligated to maintain your data securely and comply with applicable laws. We do not sell or rent your personal information to third parties for their marketing purposes.
                            </Typography>

                            <SectionTitle>9. Data Breach Notification</SectionTitle>
                            <Typography paragraph>
                                In the event of a data breach that may affect your rights or privacy, we will notify affected users promptly in accordance with applicable laws and regulations.
                            </Typography>

                            <SectionTitle>10. Use of Third-Party AI Services</SectionTitle>
                            <SubSection title="a. AI Service Providers">
                                <Typography paragraph>
                                    Brdge AI leverages third-party AI models, including but not limited to OpenAI, to deliver and enhance our services. These AI providers process your data to generate responses, analyze content, and perform other functionalities essential to the Service.
                                </Typography>
                            </SubSection>
                            <SubSection title="b. Data Transmission to AI Providers">
                                <Typography paragraph>
                                    When you use Brdge AI, certain data you provide—such as text inputs, uploaded files, and interaction logs—may be transmitted to our AI service providers for processing. This data transmission is necessary for the AI models to function effectively and provide the desired outputs.
                                </Typography>
                            </SubSection>
                            <SubSection title="c. Data Handling by AI Providers">
                                <Typography paragraph>
                                    Our AI service providers are contractually obligated to handle your data in accordance with applicable data protection laws and our privacy standards. They may use your data solely to perform the services outlined in this Privacy Policy and Terms of Service.
                                </Typography>
                            </SubSection>

                            <SectionTitle>11. International Data Transfers</SectionTitle>
                            <Typography paragraph>
                                Some of our AI service providers may operate in countries outside of your home jurisdiction. By using our Service, you consent to the transfer of your data to these countries, which may have different data protection laws than your country of residence. We ensure that such transfers are conducted in compliance with applicable data protection regulations, including implementing appropriate safeguards.
                            </Typography>

                            <SectionTitle>12. Prohibited Jurisdictions</SectionTitle>
                            <Typography paragraph>
                                Brdge AI is not intended for use in certain countries and jurisdictions where such use is prohibited by applicable law. By accessing or using our Service, you represent and warrant that you are not located in any of the following jurisdictions, where the provision of AI services like ours may be restricted or prohibited:
                            </Typography>
                            <Typography paragraph>
                                *This list is being updated and will be available soon.*
                            </Typography>
                            <Typography paragraph>
                                If you are accessing the Service from a prohibited jurisdiction, you are not authorized to use Brdge AI, and your access may be terminated immediately.
                            </Typography>

                            <SectionTitle>13. Changes to This Privacy Policy</SectionTitle>
                            <Typography paragraph>
                                We may update this Privacy Policy from time to time. Significant changes will be posted on our website and, if applicable, notified via email. Continued use of the Service after such changes indicates your acceptance of the updated policy.
                            </Typography>

                            <SectionTitle>14. Contact Us</SectionTitle>
                            <Typography paragraph>
                                For any questions or concerns about this Privacy Policy, please contact us at:
                            </Typography>
                            <Typography paragraph>
                                Email: levi@brdge-ai.com
                            </Typography>
                            <Typography paragraph>
                                Address: 382 NE 191ST St #931764, Miami, FL, 33179
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 6, borderColor: 'rgba(255,255,255,0.1)' }} />

                        {/* Terms of Service Section */}
                        <Box id="terms">
                            <Typography variant="h3">Terms of Service</Typography>
                            <Typography variant="body2" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.6)' }}>
                                Last Updated: January 19, 2025
                            </Typography>

                            <SectionTitle>1. Acceptance of Terms</SectionTitle>
                            <Typography paragraph>
                                By accessing or using Brdge AI ("Service"), you agree to comply with and be bound by these Terms of Service and any additional terms and conditions referenced herein. If you do not agree to these terms, do not use the Service.
                            </Typography>

                            <SectionTitle>2. User Accounts</SectionTitle>
                            <SubSection title="a. Eligibility">
                                <Typography paragraph>
                                    You must be at least 18 years old to create an account and use the Service.
                                </Typography>
                            </SubSection>
                            <SubSection title="b. Account Security">
                                <Typography paragraph>
                                    You are responsible for safeguarding your login credentials and any content you upload. Notify us immediately of any unauthorized use of your account.
                                </Typography>
                            </SubSection>
                            <SubSection title="c. Account Termination">
                                <Typography paragraph>
                                    We reserve the right to suspend or terminate your account if you violate these Terms or engage in prohibited conduct.
                                </Typography>
                            </SubSection>

                            <SectionTitle>3. Use of the Service</SectionTitle>
                            <SubSection title="a. License">
                                <Typography paragraph>
                                    We grant you a non-exclusive, non-transferable right to use Brdge AI for your personal or business needs, subject to these Terms.
                                </Typography>
                            </SubSection>
                            <SubSection title="b. Permitted Content">
                                <Typography paragraph>
                                    You are solely responsible for the legality, reliability, and appropriateness of the files and audio you upload.
                                </Typography>
                            </SubSection>
                            <SubSection title="c. Prohibited Conduct">
                                <Typography paragraph>You agree not to:</Typography>
                                <List sx={{ pl: 2, '& li': { color: 'rgba(255, 255, 255, 0.8)', mb: 1 } }}>
                                    <ListItem>Use the Service for unlawful purposes.</ListItem>
                                    <ListItem>Infringe on third-party intellectual property rights.</ListItem>
                                    <ListItem>Upload harmful, offensive, or malicious content.</ListItem>
                                    <ListItem>Attempt to interfere with the Service's operation or security.</ListItem>
                                </List>
                            </SubSection>

                            <SectionTitle>4. Fees & Billing</SectionTitle>
                            <SubSection title="a. Usage Minutes">
                                <Typography paragraph>
                                    Brdge AI may charge based on usage minutes. If a viewer does not ask questions, no usage fees will apply.
                                </Typography>
                            </SubSection>
                            <SubSection title="b. Payment Terms">
                                <Typography paragraph>
                                    You agree to pay all applicable fees on time. Late or failed payments may result in service interruption or account termination.
                                </Typography>
                            </SubSection>
                            <SubSection title="c. Refund Policy">
                                <Typography paragraph>
                                    All fees are non-refundable unless explicitly stated otherwise. For billing disputes, please contact support at levi@brdge-ai.com.
                                </Typography>
                            </SubSection>

                            <SectionTitle>5. Intellectual Property</SectionTitle>
                            <SubSection title="a. Ownership">
                                <Typography paragraph>
                                    All AI outputs, voice clones, transcripts, and other generated content are subject to your rights in the original files. However, we retain ownership of our technology, trademarks, and AI processes.
                                </Typography>
                            </SubSection>
                            <SubSection title="b. License to Host Content">
                                <Typography paragraph>
                                    By uploading content, you grant us a limited license to process and store it solely for delivering the Service.
                                </Typography>
                            </SubSection>
                            <SubSection title="c. Ownership of AI Improvements">
                                <Typography paragraph>
                                    By using the Service, you agree that feedback and usage data may be used to improve our AI models. These improvements are owned exclusively by Journeyman AI LLC.
                                </Typography>
                            </SubSection>
                            <SubSection title="d. Use of Third-Party AI Models">
                                <Typography paragraph>
                                    By using the Service, you acknowledge that Brdge AI employs third-party AI models, including those provided by OpenAI, to generate outputs such as text, voice clones, and transcripts. These AI models are proprietary technologies owned by their respective providers. Your use of these AI-generated outputs is subject to the terms and conditions of both Brdge AI and the AI service providers.
                                </Typography>
                            </SubSection>

                            <SectionTitle>6. Warranties & Disclaimers</SectionTitle>
                            <SubSection title="a. 'As Is' Basis">
                                <Typography paragraph>
                                    The Service is provided "as is" and "as available" without warranties of any kind. We do not guarantee uninterrupted or error-free operation.
                                </Typography>
                            </SubSection>
                            <SubSection title="b. AI Output Disclaimer">
                                <Typography paragraph>
                                    AI outputs are generated using automated processes and may contain inaccuracies. You are responsible for validating the results and should not rely on them for legal, medical, or other critical decisions.
                                </Typography>
                            </SubSection>
                            <SubSection title="c. Third-Party AI Models Disclaimer">
                                <Typography paragraph>
                                    While we strive to ensure the accuracy and reliability of AI-generated outputs, these results are produced by third-party AI models and may contain errors or inaccuracies. Brdge AI does not endorse or assume responsibility for the performance or outcomes of these third-party AI services. Users are encouraged to verify the information provided by AI outputs before making critical decisions based on them.
                                </Typography>
                            </SubSection>

                            <SectionTitle>7. Limitation of Liability</SectionTitle>
                            <Typography paragraph>
                                To the maximum extent permitted by law, Brdge AI and Journeyman AI LLC shall not be liable for indirect, incidental, or consequential damages arising out of or related to your use of the Service. This limitation of liability extends to any issues arising from the use of third-party AI models integrated into the Service.
                            </Typography>

                            <SectionTitle>8. Indemnification</SectionTitle>
                            <Typography paragraph>
                                You agree to indemnify and hold Brdge AI and Journeyman AI LLC harmless from any claims, liabilities, damages, or legal fees resulting from your misuse of the Service, breach of these Terms, or your use of third-party AI models integrated into the Service.
                            </Typography>

                            <SectionTitle>9. Refund Policy</SectionTitle>
                            <Typography paragraph>
                                All fees are non-refundable unless explicitly stated otherwise. For billing disputes, please contact support at levi@brdge-ai.com.
                            </Typography>

                            <SectionTitle>10. Fair Use & Abuse Policy</SectionTitle>
                            <Typography paragraph>
                                Excessive or abusive use of AI processing beyond reasonable limits may result in temporary suspension or termination of your account. Examples include attempts to overload the Service or bypass usage fees.
                            </Typography>

                            <SectionTitle>11. Force Majeure</SectionTitle>
                            <Typography paragraph>
                                Brdge AI shall not be held liable for delays or failure to perform due to causes beyond our reasonable control, including but not limited to acts of God, internet outages, or government restrictions.
                            </Typography>

                            <SectionTitle>12. Termination by User</SectionTitle>
                            <Typography paragraph>
                                You may terminate your account at any time by contacting support. Upon termination, we will delete your personal data and uploaded content, except where retention is required by law.
                            </Typography>

                            <SectionTitle>13. Export Controls</SectionTitle>
                            <Typography paragraph>
                                You agree to comply with all applicable export control laws and regulations, including restrictions on exporting AI technology to certain countries.
                            </Typography>

                            <SectionTitle>14. Beta Features</SectionTitle>
                            <Typography paragraph>
                                Certain features of the Service may be offered as beta. These features are provided "as is" and may be modified, removed, or discontinued at any time without notice.
                            </Typography>

                            <SectionTitle>15. Modifications</SectionTitle>
                            <Typography paragraph>
                                We may modify these Terms of Service or the Privacy Policy at any time. Notice of significant changes will be posted on our website or sent via email. Continued use of the Service indicates acceptance of the updated terms. We may update our use of third-party AI services as part of our ongoing efforts to improve the Service. Significant changes regarding the integration of AI models and data handling practices will be communicated through updates to this Terms of Service and/or Privacy Policy. Continued use of the Service after such changes signifies your acceptance of the updated terms.
                            </Typography>

                            <SectionTitle>16. Governing Law & Dispute Resolution</SectionTitle>
                            <Typography paragraph>
                                These Terms shall be governed by and construed in accordance with the laws of Florida, USA, without regard to its conflict of law principles. Any disputes arising out of or related to the use of third-party AI models within the Service will also be subject to these governing laws and dispute resolution mechanisms. Disputes will be resolved through binding arbitration under the rules of the American Arbitration Association in Miami, Florida, or through small claims court, as agreed upon by both parties.
                            </Typography>

                            <SectionTitle>17. Accessibility</SectionTitle>
                            <Typography paragraph>
                                We are committed to ensuring that Brdge AI is accessible to all users. If you encounter any accessibility issues, please contact us at levi@brdge-ai.com so we can address your concerns.
                            </Typography>

                            <SectionTitle>18. Data Portability</SectionTitle>
                            <Typography paragraph>
                                You can export your data by requesting it through your account settings or by contacting support. We aim to provide your data in a structured, commonly used format to facilitate its portability.
                            </Typography>

                            <SectionTitle>19. Prohibited Jurisdictions</SectionTitle>
                            <Typography paragraph>
                                Brdge AI is not intended for use in certain countries and jurisdictions where such use is prohibited by applicable law. By accessing or using our Service, you represent and warrant that you are not located in any of the following jurisdictions, where the provision of AI services like ours may be restricted or prohibited:
                            </Typography>
                            <Typography paragraph>
                                *This list is being updated and will be available soon.*
                            </Typography>
                            <Typography paragraph>
                                If you are accessing the Service from a prohibited jurisdiction, you are not authorized to use Brdge AI, and your access may be terminated immediately.
                            </Typography>
                        </Box>

                        <Box sx={{
                            mt: 6,
                            p: 4,
                            background: 'linear-gradient(135deg, rgba(0,255,204,0.05) 0%, rgba(0,180,219,0.05) 100%)',
                            borderRadius: '16px',
                            border: '1px solid rgba(0,255,204,0.1)',
                            boxShadow: '0 0 30px rgba(0,255,204,0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                border: '1px solid rgba(0,255,204,0.2)',
                                boxShadow: '0 0 40px rgba(0,255,204,0.15)'
                            }
                        }}>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#00ffcc',
                                    textAlign: 'center',
                                    fontSize: { xs: '0.95rem', sm: '1rem' },
                                    fontWeight: 500,
                                    textShadow: '0 0 10px rgba(0,255,204,0.2)'
                                }}
                            >
                                For any questions about these policies, please contact us at levi@brdge-ai.com
                            </Typography>
                        </Box>
                    </Paper>
                </motion.div>
            </Container>

            <style>
                {`
                    @keyframes float {
                        0% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(5deg); }
                        100% { transform: translateY(0px) rotate(0deg); }
                    }
                `}
            </style>
        </Box>
    );
}

export default PolicyPage;
