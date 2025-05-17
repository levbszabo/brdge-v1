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
import Footer from '../components/Footer';

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
        <>
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
                                Last Updated: May 17, 2025
                            </Typography>

                            <SectionTitle id="privacy-who">1. Who We Are</SectionTitle>
                            <Typography paragraph>
                                DotBridge is a service provided by Journeyman AI LLC, 382 NE 191st St #931764, Miami FL 33179, USA.
                                Contact us any time at <Link href="mailto:levi@dotbridge.io">levi@dotbridge.io</Link>.
                            </Typography>

                            <SectionTitle id="privacy-scope">2. Scope</SectionTitle>
                            <Typography paragraph>
                                This policy covers personal information we handle when you:
                            </Typography>
                            <List>
                                <ListItem>visit any DotBridge website or app,</ListItem>
                                <ListItem>open an account, or</ListItem>
                                <ListItem>interact with our sales or support teams.</ListItem>
                            </List>
                            <Typography paragraph>
                                It does not cover third-party sites you may reach from our platform.
                            </Typography>

                            <SectionTitle id="privacy-info">3. Information We Collect</SectionTitle>
                            <Typography paragraph>
                                <strong>Account</strong>: name, work-email, password hash - create & secure your login
                            </Typography>
                            <Typography paragraph>
                                <strong>Billing</strong>: last-4 card digits, billing address (processed by our payment provider) - process subscription fees & refunds
                            </Typography>
                            <Typography paragraph>
                                <strong>Content</strong>: videos, decks, PDFs, audio, chat prompts - deliver the AI features you request
                            </Typography>
                            <Typography paragraph>
                                <strong>Usage</strong>: pages visited, feature clicks, device/browser type, IP - improve performance & detect abuse
                            </Typography>
                            <Typography paragraph>
                                <strong>Cookies</strong>: session ID, analytics tags - keep you logged in & understand traffic
                            </Typography>
                            <Typography paragraph>
                                We only collect what we reasonably need to run DotBridge.
                            </Typography>

                            <SectionTitle id="privacy-use">4. How We Use Your Data</SectionTitle>
                            <List>
                                <ListItem><strong>Provide the Service</strong> – host your content, generate AI responses, personalise your workspace.</ListItem>
                                <ListItem><strong>Operate the Business</strong> – bill you, send invoices, handle support tickets.</ListItem>
                                <ListItem><strong>Improve Product</strong> – analyse aggregated, pseudonymised usage to spot bugs and plan new features.</ListItem>
                                <ListItem><strong>Security & Fraud Prevention</strong> – monitor for unusual activity or misuse.</ListItem>
                                <ListItem><strong>Marketing (Optional)</strong> – if you opt in, send product news or offers. You can opt out any time.</ListItem>
                            </List>
                            <Typography paragraph>
                                Our legal bases are: performance of our contract with you, our legitimate interest in running and securing the service,
                                compliance with laws, and consent (for optional emails/cookies).
                            </Typography>

                            <SectionTitle id="privacy-ai">5. AI & Third-Party Providers</SectionTitle>
                            <Typography paragraph>
                                DotBridge uses external AI APIs (e.g. large-language-model or speech services) to process the prompts or files you submit.
                                We send only the minimum data needed for the requested feature and instruct providers not to use it for model training unless you expressly opt in.
                                We also rely on trusted cloud hosts, email tools, and analytics platforms.
                                A current list is available on request at <Link href="mailto:levi@dotbridge.io">levi@dotbridge.io</Link>.
                            </Typography>

                            <SectionTitle id="privacy-sharing">6. Sharing</SectionTitle>
                            <Typography paragraph>
                                We never sell your personal information. We share it only with service partners who help us operate DotBridge
                                (hosting, payments, AI processing, analytics) under strict confidentiality and data-protection terms, or if required by law.
                            </Typography>

                            <SectionTitle id="privacy-security">7. Security</SectionTitle>
                            <Typography paragraph>
                                We apply reasonable administrative, technical, and physical safeguards such as:
                            </Typography>
                            <List>
                                <ListItem>encrypted connections (HTTPS/TLS)</ListItem>
                                <ListItem>encryption of stored files</ListItem>
                                <ListItem>role-based access for staff</ListItem>
                                <ListItem>periodic security reviews</ListItem>
                            </List>
                            <Typography paragraph>
                                No online service is 100% secure, so we cannot guarantee absolute protection.
                            </Typography>

                            <SectionTitle id="privacy-retention">8. Retention</SectionTitle>
                            <Typography paragraph>
                                <strong>Account & Billing</strong> – kept while your subscription is active and for up to 7 years to meet tax or audit rules.
                            </Typography>
                            <Typography paragraph>
                                <strong>Uploaded Content</strong> – stored until you delete it or your plan's retention limit expires.
                            </Typography>
                            <Typography paragraph>
                                <strong>Analytics Logs</strong> – typically deleted or anonymised after 24 months.
                            </Typography>

                            <SectionTitle id="privacy-rights">9. Your Choices & Rights</SectionTitle>
                            <Typography paragraph>
                                Subject to local law, you can:
                            </Typography>
                            <List>
                                <ListItem>access or export your data,</ListItem>
                                <ListItem>correct inaccurate info,</ListItem>
                                <ListItem>delete content or close your account,</ListItem>
                                <ListItem>object to or restrict certain processing,</ListItem>
                                <ListItem>opt out of marketing emails or analytics cookies.</ListItem>
                            </List>
                            <Typography paragraph>
                                Email <Link href="mailto:levi@dotbridge.io">levi@dotbridge.io</Link> and we'll respond within 30 days.
                            </Typography>

                            <SectionTitle id="privacy-transfers">10. International Transfers</SectionTitle>
                            <Typography paragraph>
                                We and many of our providers are based in the United States. When data moves across borders, we rely on
                                standard contractual clauses or similar safeguards recognised by applicable regulations.
                                Questions about transfers? Write to <Link href="mailto:levi@dotbridge.io">levi@dotbridge.io</Link>.
                            </Typography>

                            <SectionTitle id="privacy-children">11. Children</SectionTitle>
                            <Typography paragraph>
                                DotBridge is for users 18 or older. We do not knowingly collect data from minors.
                                If you believe a minor has provided data, contact <Link href="mailto:levi@dotbridge.io">levi@dotbridge.io</Link> and we'll delete it.
                            </Typography>

                            <SectionTitle id="privacy-changes">12. Changes</SectionTitle>
                            <Typography paragraph>
                                If we make material changes, we'll post the updated policy here and notify account owners
                                (e.g. email or in-app banner) at least 15 days before it takes effect.
                                For clarifications, email <Link href="mailto:levi@dotbridge.io">levi@dotbridge.io</Link>.
                            </Typography>

                            <SectionTitle id="privacy-contact">13. Contact</SectionTitle>
                            <Typography paragraph>
                                Questions, requests, or concerns? Email <Link href="mailto:levi@dotbridge.io">levi@dotbridge.io</Link> – we're here to help.
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 8 }} />

                        <Box id="terms">
                            <Typography variant="h2" sx={{ color: 'text.primary', mb: 1 }}>
                                Terms of Service
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
                                Last Updated: May 17, 2025
                            </Typography>

                            <Typography paragraph>
                                These Terms of Service ("Terms") form a binding contract between Journeyman AI LLC ("DotBridge, we, our, us")
                                and you or the entity you represent ("Customer, you, your"). By accessing or using any DotBridge website,
                                application, or related services (collectively, the "Service"), you agree to these Terms.
                                If you do not accept them, do not use the Service.
                            </Typography>

                            <Typography paragraph>
                                Need help? Email <Link href="mailto:levi@dotbridge.io">levi@dotbridge.io</Link>.
                            </Typography>

                            <SectionTitle id="terms-accounts">1. Eligibility & Accounts</SectionTitle>
                            <Typography paragraph>
                                You must be 18 years or older and able to enter a contract.
                            </Typography>
                            <Typography paragraph>
                                Keep credentials confidential and notify <Link href="mailto:levi@dotbridge.io">levi@dotbridge.io</Link> of any unauthorised use.
                            </Typography>
                            <Typography paragraph>
                                We may suspend or terminate accounts that violate these Terms or the law.
                            </Typography>

                            <SectionTitle id="terms-license">2. Licence to Use the Service</SectionTitle>
                            <Typography paragraph>
                                We grant you a limited, non-exclusive, revocable, non-transferable licence to access and use the Service
                                for your own business purposes during your subscription term, subject to these Terms and any plan limits.
                            </Typography>

                            <SectionTitle id="terms-content">3. Your Content & Data</SectionTitle>
                            <Typography paragraph>
                                <strong>Ownership.</strong> You keep all rights in videos, decks, PDFs, lead lists, prompts, and other materials you upload ("User Content").
                            </Typography>
                            <Typography paragraph>
                                <strong>Permission to Operate.</strong> You grant us and our subprocessors a worldwide right to host, process,
                                transcribe, transform, and stream User Content solely to provide and improve the Service.
                            </Typography>
                            <Typography paragraph>
                                <strong>Responsibility.</strong> You must have all necessary rights and lawful bases to upload or share User Content
                                (including prospect data) and to send any automated messages generated through the Service.
                            </Typography>
                            <Typography paragraph>
                                <strong>Removal.</strong> Delete content any time via the dashboard or by emailing <Link href="mailto:levi@dotbridge.io">levi@dotbridge.io</Link>.
                            </Typography>

                            <SectionTitle id="terms-acceptableuse">4. Acceptable Use</SectionTitle>
                            <Typography paragraph>
                                You agree not to:
                            </Typography>
                            <List>
                                <ListItem>break any law or third-party right;</ListItem>
                                <ListItem>upload malware or attempt to hack, scrape, or reverse-engineer the Service;</ListItem>
                                <ListItem>use DotBridge to generate or distribute content that is defamatory, hateful, or illegal;</ListItem>
                                <ListItem>infringe any copyright, trademark, or privacy right;</ListItem>
                                <ListItem>interfere with another user's access or abuse our infrastructure.</ListItem>
                            </List>
                            <Typography paragraph>
                                We reserve the right to investigate and remove content or accounts that breach this section.
                            </Typography>

                            <SectionTitle id="terms-plans">5. Plans, Fees & Payment</SectionTitle>
                            <Typography paragraph>
                                Plans, usage allowances, and current prices are listed on dotbridge.io/pricing.
                            </Typography>
                            <Typography paragraph>
                                Fees are charged in advance (monthly or annually) via our payment provider.
                            </Typography>
                            <Typography paragraph>
                                Overage (extra AI minutes, storage, or seats) may be billed automatically at the rates shown in your account.
                            </Typography>
                            <Typography paragraph>
                                All fees are non-refundable except where required by law. Write to <Link href="mailto:levi@dotbridge.io">levi@dotbridge.io</Link> for billing issues.
                            </Typography>

                            <SectionTitle id="terms-ai">6. AI Outputs & Disclaimers</SectionTitle>
                            <Typography paragraph>
                                The Service relies on machine-learning models (internal and third-party) that may generate inaccurate or incomplete results.
                            </Typography>
                            <Typography paragraph>
                                You assume all risk for how you use any AI output, transcripts, or recommendations.
                            </Typography>
                            <Typography paragraph>
                                We do not guarantee the accuracy, legality, or effectiveness of outputs. Always verify critical information.
                            </Typography>

                            <SectionTitle id="terms-ip">7. Intellectual Property</SectionTitle>
                            <Typography paragraph>
                                DotBridge retains all rights in the Service, software, design, and branding.
                            </Typography>
                            <Typography paragraph>
                                You may display, download, or export AI outputs created from your own User Content,
                                subject to these Terms and applicable law.
                            </Typography>
                            <Typography paragraph>
                                Suggestions or feedback you provide may be used by us without obligation.
                            </Typography>

                            <SectionTitle id="terms-confidentiality">8. Confidentiality</SectionTitle>
                            <Typography paragraph>
                                Each party agrees to protect the other's non-public information with reasonable care and to use it
                                only for purposes of the relationship. This duty survives termination.
                            </Typography>

                            <SectionTitle id="terms-disclaimers">9. No Warranties</SectionTitle>
                            <Typography paragraph>
                                The Service is provided "as is" and "as available." We expressly disclaim all warranties,
                                including merchantability, fitness for a particular purpose, and non-infringement.
                                We do not promise that the Service will be uninterrupted, secure, or error-free.
                            </Typography>

                            <SectionTitle id="terms-liability">10. Limitation of Liability</SectionTitle>
                            <Typography paragraph>
                                To the fullest extent permitted by law:
                            </Typography>
                            <Typography paragraph>
                                <strong>Indirect damages excluded.</strong> We are not liable for any indirect, incidental,
                                consequential, or special damages, even if advised of the possibility.
                            </Typography>
                            <Typography paragraph>
                                <strong>Liability cap.</strong> Our total liability for any claim arising out of the Service is limited to
                                the fees you paid us in the 12 months preceding the event giving rise to the claim.
                            </Typography>
                            <Typography paragraph>
                                Some jurisdictions do not allow certain exclusions; those limits apply only up to the maximum permitted by law.
                            </Typography>

                            <SectionTitle id="terms-indemnification">11. Indemnification</SectionTitle>
                            <Typography paragraph>
                                You will defend and indemnify DotBridge, its affiliates, and personnel against any third-party claim arising from:
                            </Typography>
                            <List>
                                <ListItem>your breach of these Terms,</ListItem>
                                <ListItem>your User Content or prospect data, or</ListItem>
                                <ListItem>your use of AI outputs in violation of law.</ListItem>
                            </List>
                            <Typography paragraph>
                                We will promptly notify you of any claim and cooperate in your defence at your expense.
                            </Typography>

                            <SectionTitle id="terms-termination">12. Term & Termination</SectionTitle>
                            <Typography paragraph>
                                Your subscription renews automatically until cancelled in your account settings or by
                                emailing <Link href="mailto:levi@dotbridge.io">levi@dotbridge.io</Link>.
                            </Typography>
                            <Typography paragraph>
                                We may suspend or terminate the Service (or any part) if you materially breach these Terms
                                and fail to cure within 10 days after notice.
                            </Typography>
                            <Typography paragraph>
                                Upon termination, your licence ends and access ceases. Sections 3, 7, 8, 9, 10, 11, 13 survive.
                            </Typography>

                            <SectionTitle id="terms-governing-law">13. Governing Law & Disputes</SectionTitle>
                            <Typography paragraph>
                                <strong>Law.</strong> Florida, USA law governs these Terms (without conflicts-of-law rules).
                            </Typography>
                            <Typography paragraph>
                                <strong>Resolution.</strong> Any dispute we cannot resolve informally within 30 days will be settled by
                                binding arbitration in Miami, Florida, under the Commercial Arbitration Rules of the American Arbitration Association.
                                Either party may seek relief in small-claims court if eligible.
                            </Typography>
                            <Typography paragraph>
                                <strong>Opt-out.</strong> You may opt out of arbitration by emailing <Link href="mailto:levi@dotbridge.io">levi@dotbridge.io</Link>
                                within 30 days of first accepting these Terms.
                            </Typography>

                            <SectionTitle id="terms-changes">14. Changes to These Terms</SectionTitle>
                            <Typography paragraph>
                                We may update these Terms to reflect new features or legal requirements. We will:
                            </Typography>
                            <List>
                                <ListItem>post the revised version on dotbridge.io/policy, and</ListItem>
                                <ListItem>notify account owners by email or in-app at least 15 days before changes take effect.</ListItem>
                            </List>
                            <Typography paragraph>
                                Continued use after the effective date means you accept the revision.
                            </Typography>

                            <SectionTitle id="terms-misc">15. Miscellaneous</SectionTitle>
                            <Typography paragraph>
                                <strong>Entire Agreement.</strong> These Terms plus any order form are the entire agreement between us.
                            </Typography>
                            <Typography paragraph>
                                <strong>Severability.</strong> If any clause is unenforceable, the rest remains in effect.
                            </Typography>
                            <Typography paragraph>
                                <strong>Assignment.</strong> You may not assign these Terms without our written consent; we may assign as part of a merger or sale.
                            </Typography>
                            <Typography paragraph>
                                <strong>Force Majeure.</strong> Neither party is liable for delays caused by events beyond reasonable control.
                            </Typography>

                            <SectionTitle id="terms-contact">16. Contact</SectionTitle>
                            <Typography paragraph>
                                All legal notices, questions, or feedback: <Link href="mailto:levi@dotbridge.io">levi@dotbridge.io</Link>.
                                We aim to reply within two business days.
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 6, textAlign: 'center' }}>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                For questions about these policies, contact us at <Link href="mailto:levi@dotbridge.io" sx={{ fontWeight: 500 }}>levi@dotbridge.io</Link>.
                            </Typography>
                        </Box>
                    </Paper>
                </Container>
            </Box>
            <Footer />
        </>
    );
}

export default PolicyPage;
