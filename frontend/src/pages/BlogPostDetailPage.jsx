import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Divider, Chip, Button } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Sample posts data - In a real app, this would come from a CMS, API, or a shared data store.
// For now, we'll include the article you provided here.
// We will move this data to BlogPage.jsx later and pass it down or use a global state.
const postsData = [
    {
        id: 1,
        slug: 'dotbridge-future-of-business-communication',
        title: 'DotBridge: The Future of Business Communication',
        date: 'May 15, 2025',
        category: 'Strategy',
        type: 'whitepaper',
        summary: 'An overview of how DotBridge is transforming one-way content into two-way AI-powered conversations that scale.',
        content: '<p>We\'re fixing a problem you experience every day: businesses talk at you, not with you. DotBridge transforms one-way content into two-way conversations. This whitepaper explores our vision and technology.</p><h3>Our 3-Phased Approach:</h3><ul><li><strong>NEW INTERFACE:</strong> DotBridge is the next interface for business communication</li><li><strong>SYSTEM LAYER:</strong> Let you create autonomous, human-like Bridges</li><li><strong>PRODUCT WEDGE:</strong> Build AI sales funnels that close faster</li></ul><p>Read the full whitepaper for a deep dive into our methodology and the future of interactive AI.</p>',
        pdfUrl: '/dotbridge-whitepaper.pdf'
    },
    {
        id: 2,
        slug: 'you-dont-need-to-know-everything',
        title: 'You Don\'t Need to Know Everything - You Just Need the Right Bridges',
        date: 'January 24, 2024',
        category: 'Vision',
        type: 'article',
        summary: 'Something massive is happening in how we transfer knowledge. Quietly, a new layer of intelligence is being built on top of our world.',
        content: '<p>Something massive is happening in how we transfer knowledge.</p>\n' +
            '<p>Quietly, a new layer of intelligence is being built on top of our world.</p>\n' +
            '<p>Not in the cloud. Not in your brain.</p>\n' +
            '<p>Right on top of your content. Your conversations. Your creations.</p>\n' +
            '<p>And once you see it, you\'ll never go back.</p>\n' +
            '<br/>\n' +
            '<h2>We\'re Entering the Era of Overlay Intelligence</h2>\n' +
            '<p>Right now, most knowledge is static:</p>\n' +
            '<ul>\n' +
            '    <li>A PDF someone has to read.</li>\n' +
            '    <li>A video someone has to sit through.</li>\n' +
            '    <li>A note that gets buried in Notion.</li>\n' +
            '</ul>\n' +
            '<p>In this old model, knowledge transfer is painful.</p>\n' +
            '<p>You need time. Context. Endless repetition.</p>\n' +
            '<p>Most of it gets lost or forgotten.</p>\n' +
            '<p>Now imagine this instead:</p>\n' +
            '<ul>\n' +
            '    <li>Every important document has an intelligent overlay.</li>\n' +
            '    <li>Every great lecture answers questions like a private tutor.</li>\n' +
            '    <li>Every SOP, sales call, or investor memo talks back.</li>\n' +
            '</ul>\n' +
            '<p>This isn\'t science fiction.</p>\n' +
            '<p>It\'s possible today — with a technology called a Bridge.</p>\n' +
            '<br/>\n' +
            '<h2>So... What\'s a Bridge?</h2>\n' +
            '<p>A Bridge is a persistent AI agent that lives on top of any piece of content —</p>\n' +
            '<p>and understands it, remembers it, and answers for it.</p>\n' +
            '<p>It\'s not a search bar.</p>\n' +
            '<p>It\'s not a chatbot hallucinating answers.</p>\n' +
            '<p>It\'s a structured intelligence layer that\'s anchored to the source.</p>\n' +
            '<p>You give it a video, doc, or deck.</p>\n' +
            '<p>It distills key insights, facts, and questions.</p>\n' +
            '<p>Then it becomes the interactive version of that knowledge.</p>\n' +
            '<p>Ask it anything — it responds in context.</p>\n' +
            '<p>Give it feedback — it improves.</p>\n' +
            '<p>Ask again later — it remembers.</p>\n' +
            '<p>A Bridge is a digital knower.</p>\n' +
            '<p>And once created, it can be used by you, your team, or anyone you share it with.</p>\n' +
            '<br/>\n' +
            '<h2>Knowledge Transfer Just Leveled Up</h2>\n' +
            '<p>This is more than a better chatbot.</p>\n' +
            '<p>This is a new interface layer for intelligence.</p>\n' +
            '<p>Think about how much time is wasted today just moving information:</p>\n' +
            '<ul>\n' +
            '    <li>You ask five people the same question in Slack.</li>\n' +
            '    <li>You reread a doc because you forgot what it said.</li>\n' +
            '    <li>You hire someone just to "onboard" the next 20.</li>\n' +
            '</ul>\n' +
            '<p>Bridges change that:</p>\n' +
            '<ul>\n' +
            '    <li>✅ Knowledge is always on.</li>\n' +
            '    <li>✅ Responses are grounded and personalized.</li>\n' +
            '    <li>✅ Feedback improves the system — without retraining a model.</li>\n' +
            '</ul>\n' +
            '<p>And when you connect multiple Bridges — across videos, decks, documents, tools — you create a Flow:</p>\n' +
            '<p>A living network of knowers that shares memory and learns as a system.</p>\n' +
            '<p>In a Flow, your knowledge isn\'t just searchable. It\'s interactive. It\'s conversational. It\'s alive.</p>\n' +
            '<br/>\n' +
            '<h2>Expertise Just Became a Superpower</h2>\n' +
            '<p>People worry this tech replaces experts.</p>\n' +
            '<p>That couldn\'t be more wrong.</p>\n' +
            '<p>It makes expertise matter more.</p>\n' +
            '<p>Because in the Bridge world:</p>\n' +
            '<ul>\n' +
            '    <li>The best structured thinkers will build the most valuable overlays.</li>\n' +
            '    <li>The best curators will control how knowledge is consumed.</li>\n' +
            '    <li>The best communicators will scale through AI agents that talk on their behalf.</li>\n' +
            '</ul>\n' +
            '<p>Bridges don\'t replace you — they extend you.</p>\n' +
            '<p>They turn your insights into assets.</p>\n' +
            '<p>They let your brain stay online, even when you\'re asleep.</p>\n' +
            '<p>For the first time ever, you can own the interface between your mind and the world.</p>\n' +
            '<br/>\n' +
            '<h2>Real-World Examples</h2>\n' +
            '<p>Designing a new building?</p>\n' +
            '<p>Instead of meeting 30 experts, your Flow connects hundreds of Bridges across zoning, sustainability, acoustics, psychology.</p>\n' +
            '<p>Ask questions like you\'re talking to the industry itself.</p>\n' +
            '<p>Running an onboarding program?</p>\n' +
            '<p>Each video, document, and tool gets its own Bridge.</p>\n' +
            '<p>Your new hire learns by asking, not by waiting.</p>\n' +
            '<p>Selling a product?</p>\n' +
            '<p>Let your sales deck speak back. Let your data room explain itself.</p>\n' +
            '<p>The investor gets answers in seconds — no call required.</p>\n' +
            '<p>Building a personal knowledge stack?</p>\n' +
            '<p>Turn every lecture you love, every note you\'ve written, every project you\'ve built… into a network of Bridges that knows it all better than you remember it.</p>\n' +
            '<br/>\n' +
            '<h2>The Big Shift</h2>\n' +
            '<p>You used to need to memorize everything.</p>\n' +
            '<p>Now, you just need to own the right knower.</p>\n' +
            '<p>Curate your own Bridge on persuasion.</p>\n' +
            '<p>Subscribe to someone else\'s Bridge on AI agents.</p>\n' +
            '<p>Link them together into a Flow that helps you learn, build, and execute faster than ever.</p>\n' +
            '<br/>\n' +
            '<p>Your brain becomes the orchestrator.</p>\n' +
            '<p>The Bridges become your memory.</p>\n' +
            '<p>And the Flow becomes your intelligence infrastructure.</p>\n' +
            '<br/>\n' +
            '<h2>The Future of Knowledge Is Interactive, External, and Owned</h2>\n' +
            '<p>This isn\'t just better search.</p>\n' +
            '<p>This is the first time we can put our mind on the outside — and give it to others.</p>\n' +
            '<p>You won\'t send PDFs.</p>\n' +
            '<p>You\'ll send knowers.</p>\n' +
            '<p>You won\'t Google.</p>\n' +
            '<p>You\'ll ask your Flow.</p>\n' +
            '<p>You won\'t explain the same thing twice.</p>\n' +
            '<p>You\'ll Bridge it — and it\'ll handle the rest.</p>\n' +
            '<br/>\n' +
            '<p>You are not what you remember.</p>\n' +
            '<p>You are what you\'ve structured.</p>\n' +
            '<p>What you\'ve shared.</p>\n' +
            '<p>What you\'ve extended into the world.</p>\n' +
            '<p>Start building your Bridges.</p>\n' +
            '<p>Start collecting your Flows.</p>\n' +
            '<p>Own the interface.</p>\n' +
            '<p>Own the knower.</p>\n' +
            '<p>Own the future.</p>\n'
    },
    {
        id: 3,
        slug: 'stop-losing-leads-after-demo',
        title: 'Stop Losing Leads After the Demo',
        date: 'January 25, 2024',
        category: 'SaaS Sales',
        type: 'article',
        summary: 'Your leads don\'t need more videos. They need answers. DotBridge turns your decks and demos into interactive, AI-powered closers.',
        content: '<h2>The Demo Went Great... So Why Did They Disappear?</h2>\n' +
            '<p>Your team nailed the pitch.</p>\n' +
            '<p>The deck was solid.</p>\n' +
            '<p>The Loom follow-up was clean.</p>\n' +
            '<p>The prospect even said they were excited.</p>\n' +
            '<p>Then... nothing.</p>\n' +
            '<p>No reply.</p>\n' +
            '<p>No questions.</p>\n' +
            '<p>No call booked.</p>\n' +
            '<p>Sound familiar?</p>\n' +
            '<p>You\'re not alone. SaaS sales teams everywhere are seeing this pattern.</p>\n' +
            '<p>Not because your product is bad — but because your follow-up content is static.</p>\n' +
            '<br/>\n' +
            '<h2>Static Content Kills Momentum</h2>\n' +
            '<p>Sales teams are relying on content that can\'t sell.</p>\n' +
            '<p>Demo videos don\'t answer questions.</p>\n' +
            '<p>Decks don\'t adapt to objections.</p>\n' +
            '<p>Case studies don\'t qualify leads.</p>\n' +
            '<p>Tools like Loom and Vidyard are great for showing, but they stop the moment the video ends.</p>\n' +
            '<p>No follow-up. No conversation. No conversion.</p>\n' +
            '<p>You don\'t need passive media.</p>\n' +
            '<p>You need a digital rep that keeps the conversation going.</p>\n' +
            '<br/>\n' +
            '<h2>Meet DotBridge: Your AI-Powered Follow-Up That Actually Closes</h2>\n' +
            '<p>DotBridge turns any sales deck, demo, or video into an interactive AI experience — what we call a Bridge.</p>\n' +
            '<p>Instead of sending a static link, you send an AI-powered interface that:</p>\n' +
            '<ul>\n' +
            '    <li>✅ Answers prospect questions instantly</li>\n' +
            '    <li>✅ Handles objections using your own material</li>\n' +
            '    <li>✅ Remembers past interactions</li>\n' +
            '    <li>✅ Books meetings automatically</li>\n' +
            '    <li>✅ Improves with feedback — without retraining</li>\n' +
            '</ul>\n' +
            '<p>It\'s not a chatbot.</p>\n' +
            '<p>It\'s not just another video.</p>\n' +
            '<p>It\'s your actual sales narrative, upgraded.</p>\n' +
            '<br/>\n' +
            '<h2>What Makes a Bridge Different?</h2>\n' +
            '<table>\n' +
            '    <thead>\n' +
            '        <tr>\n' +
            '            <th>Feature</th>\n' +
            '            <th>Loom/Vidyard</th>\n' +
            '            <th>DotBridge</th>\n' +
            '        </tr>\n' +
            '    </thead>\n' +
            '    <tbody>\n' +
            '        <tr>\n' +
            '            <td>Async Video Delivery</td>\n' +
            '            <td>✅</td>\n' +
            '            <td>✅</td>\n' +
            '        </tr>\n' +
            '        <tr>\n' +
            '            <td>Prospect Interaction</td>\n' +
            '            <td>❌</td>\n' +
            '            <td>✅</td>\n' +
            '        </tr>\n' +
            '        <tr>\n' +
            '            <td>Real-Time Q&A</td>\n' +
            '            <td>❌</td>\n' +
            '            <td>✅</td>\n' +
            '        </tr>\n' +
            '        <tr>\n' +
            '            <td>Memory of Prior Answers</td>\n' +
            '            <td>❌</td>\n' +
            '            <td>✅</td>\n' +
            '        </tr>\n' +
            '        <tr>\n' +
            '            <td>Meeting Booking</td>\n' +
            '            <td>❌</td>\n' +
            '            <td>✅</td>\n' +
            '        </tr>\n' +
            '        <tr>\n' +
            '            <td>Sales Rep Extension</td>\n' +
            '            <td>❌</td>\n' +
            '            <td>✅</td>\n' +
            '        </tr>\n' +
            '    </tbody>\n' +
            '</table>\n' +
            '<p>Your Loom might explain the deck.</p>\n' +
            '<p>But your Bridge <strong>becomes</strong> the deck — and talks back.</p>\n' +
            '<br/>\n' +
            '<h2>Real-World Use Cases for SaaS Sales Teams</h2>\n' +
            '<h3>🎯 Post-Demo Follow-Up</h3>\n' +
            '<p>Replace that "Just following up" email with a Bridge that actually answers the 5 questions they\'re silently wondering.</p>\n' +
            '<h3>Outbound Campaigns</h3>\n' +
            '<p>Send personalized Bridges in your outbound — where prospects can explore your pitch before booking time with a rep.</p>\n' +
            '<h3>🤝 Buyer Enablement</h3>\n' +
            '<p>Your champion is sharing the deck with their team. Give them a Bridge instead, so they don\'t have to be the expert.</p>\n' +
            '<h3>🔁 Nurture Re-Engagement</h3>\n' +
            '<p>Reignite cold leads with Bridges that show what\'s new — and talk through it without scheduling another call.</p>\n' +
            '<br/>\n' +
            '<h2>How DotBridge Impacts Your Metrics</h2>\n' +
            '<p>DotBridge users report:</p>\n' +
            '<ul>\n' +
            '    <li>25–40% increase in demo-to-next-meeting rate</li>\n' +
            '    <li>50% reduction in repetitive follow-up questions</li>\n' +
            '    <li>Shorter sales cycles by 1–2 weeks</li>\n' +
            '    <li>More engaged, better-qualified prospects — before the call even happens</li>\n' +
            '</ul>\n' +
            '<p>And it takes under 10 minutes to launch your first Bridge.</p>\n' +
            '<br/>\n' +
            '<h2>Why This Matters More in 2025</h2>\n' +
            '<p>Sales leaders know the game is changing.</p>\n' +
            '<p>Buyers are:</p>\n' +
            '<ul>\n' +
            '    <li>Overwhelmed with static content</li>\n' +
            '    <li>Unresponsive to cold outreach</li>\n' +
            '    <li>Unwilling to book yet another meeting just to get clarity</li>\n' +
            '</ul>\n' +
            '<p>You can\'t keep relying on passive decks and videos to do active work.</p>\n' +
            '<p>Sales doesn\'t stop at the demo.</p>\n' +
            '<p>Your content should keep selling when you\'re not in the room.</p>\n' +
            '<br/>\n' +
            '<h2>The Bottom Line</h2>\n' +
            '<p>If you\'re using Loom or Vidyard today — great.</p>\n' +
            '<p>They\'re solid for async video.</p>\n' +
            '<p>But if you want to interact, qualify, and convert, you need a smarter layer.</p>\n' +
            '<p>DotBridge gives your sales content a voice.</p>\n' +
            '<p>It turns decks into dialogues.</p>\n' +
            '<p>And it helps your team scale without adding headcount.</p>\n' +
            '<br/>\n' +
            '<h2>Ready to Upgrade Your Sales Stack?</h2>\n' +
            '<p>Start using DotBridge to turn every deck, demo, and follow-up into a closer.</p>\n' +
            '<p>No code. No complex setup. Just smarter selling.</p>'
    },
    {
        id: 4,
        slug: 'your-lead-magnet-is-boring-heres-what-to-do-instead',
        title: 'Your Lead Magnet Is Boring. Here\'s What to Do Instead.',
        date: 'January 26, 2024',
        category: 'Lead Generation',
        type: 'article',
        summary: 'Stop creating dead-on-arrival lead magnets. Discover how interactive AI experiences can transform your content and start real conversations.',
        content: '<p>Let\'s be honest:</p>\n' +
            '<ul>\n' +
            '    <li>Nobody wants to download another PDF.</li>\n' +
            '    <li>Nobody watches your whole webinar.</li>\n' +
            '    <li>Nobody clicks your "free audit" link unless they\'re really desperate.</li>\n' +
            '</ul>\n' +
            '<p>You worked hard on your content.</p>\n' +
            '<p>But it\'s not converting — because it\'s dead on arrival.</p>\n' +
            '<br/>\n' +
            '<h2>Here\'s What\'s Working in 2025: Interactive Content That Talks Back</h2>\n' +
            '<p>Imagine this:</p>\n' +
            '<p>You take your best-performing webinar, PDF, or deck...</p>\n' +
            '<p>And turn it into an interactive AI experience — something that actually talks to the lead.</p>\n' +
            '<br/>\n' +
            '<p>That\'s what we built with DotBridge.</p>\n' +
            '<br/>\n' +
            '<p>Upload your content.</p>\n' +
            '<p>DotBridge turns it into a Bridge — a smart, conversational layer that…</p>\n' +
            '<ul>\n' +
            '    <li>✅ Answers questions</li>\n' +
            '    <li>✅ Qualifies the lead</li>\n' +
            '    <li>✅ Captures intent</li>\n' +
            '    <li>✅ Books the call</li>\n' +
            '</ul>\n' +
            '<p>It\'s like a smarter version of your best funnel — but without the drop-off.</p>\n' +
            '<br/>\n' +
            '<h2>Don\'t Just Capture Emails. Start Conversations.</h2>\n' +
            '<p>Your leads don\'t want to read.</p>\n' +
            '<p>They want clarity, relevance, and confidence to take the next step.</p>\n' +
            '<br/>\n' +
            '<p>With a Bridge, they get answers instantly, feel understood, and move forward faster.</p>\n' +
            '<br/>\n' +
            '<p>Use it for:</p>\n' +
            '<ul>\n' +
            '    <li>Interactive lead magnets</li>\n' +
            '    <li>Smart landing pages</li>\n' +
            '    <li>Quiz-style experiences with real answers</li>\n' +
            '    <li>Post-click flows that sell, not just educate</li>\n' +
            '</ul>'
    },
    // ... other posts can be added here
];


const StyledPostContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4, 6),
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(8),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[1],
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(3, 4),
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3, 2.5),
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(6),
    },

    '& .post-content h2': {
        ...theme.typography.h3,
        fontWeight: 700,
        color: theme.palette.text.primary,
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(3),
        lineHeight: 1.2,
        borderBottom: `3px solid ${theme.palette.primary.main}`,
        paddingBottom: theme.spacing(1.5),
        display: 'inline-block',
        letterSpacing: '-0.01em',
    },
    '& .post-content h3': {
        ...theme.typography.h4,
        fontWeight: 700,
        color: theme.palette.text.primary,
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(2.5),
        lineHeight: 1.3,
        position: 'relative',
        paddingLeft: theme.spacing(2),
        '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '15%',
            bottom: '15%',
            width: '6px',
            backgroundColor: theme.palette.primary.main,
            borderRadius: theme.shape.borderRadius,
        }
    },
    '& .post-content p': {
        ...theme.typography.body1,
        fontSize: '1.125rem',
        lineHeight: 1.8,
        marginBottom: theme.spacing(2.5),
        color: theme.palette.text.primary,
        maxWidth: '800px',
    },
    '& .post-content ul': {
        listStyleType: 'disc',
        paddingLeft: theme.spacing(3.5),
        marginBottom: theme.spacing(3),
        color: theme.palette.text.primary,
    },
    '& .post-content li': {
        marginBottom: theme.spacing(1.5),
        lineHeight: 1.8,
        fontSize: '1.125rem',
        paddingLeft: theme.spacing(0.5),
    },
    '& .post-content li::marker': {
        color: theme.palette.primary.main,
        fontSize: '1.2em',
    },
    '& .post-content a': {
        color: theme.palette.primary.main,
        textDecoration: 'underline',
        textDecorationColor: alpha(theme.palette.primary.main, 0.4),
        textDecorationThickness: '2px',
        fontWeight: 600,
        transition: theme.transitions.create(['color', 'text-decoration-color'], {
            duration: theme.transitions.duration.short,
        }),
        '&:hover': {
            color: theme.palette.primary.dark,
            textDecorationColor: theme.palette.primary.main,
        },
    },
    '& .post-content strong': {
        fontWeight: 700,
        color: theme.palette.text.primary,
    },
    '& .post-content em': {
        fontStyle: 'italic',
        color: theme.palette.text.primary,
    },
    '& .post-content blockquote': {
        margin: theme.spacing(4, 0, 4, 0),
        padding: theme.spacing(2.5, 3),
        borderLeft: `6px solid ${theme.palette.primary.main}`,
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`,
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`,
        '& p': {
            marginBottom: theme.spacing(1),
            fontSize: '1.125rem',
            fontStyle: 'italic',
            color: theme.palette.text.primary,
            fontWeight: 500,
        }
    },
    '& .post-content table': {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: theme.spacing(3.5),
        marginTop: theme.spacing(2.5),
        fontSize: '1rem',
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`,
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
    },
    '& .post-content th, & .post-content td': {
        border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
        padding: theme.spacing(1.5, 2),
        textAlign: 'left',
        verticalAlign: 'top',
    },
    '& .post-content th': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        fontWeight: 700,
        color: theme.palette.text.primary,
    },
    '& .post-content td': {
        backgroundColor: theme.palette.background.paper,
    },
    '& .post-content caption': {
        captionSide: 'bottom',
        padding: theme.spacing(1),
        fontSize: '0.9rem',
        color: theme.palette.text.secondary,
        fontStyle: 'italic',
    },
    '& .download-pdf-container': {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        padding: theme.spacing(3),
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
        borderRadius: theme.shape.borderRadius * 1.5,
        textAlign: 'center',
        boxShadow: `0 3px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
    }
}));

const PostHeader = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    textAlign: 'center',
}));

const PostTitle = styled(Typography)(({ theme }) => ({
    ...theme.typography.h1,
    fontWeight: 700,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(2),
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    fontSize: { xs: '2.4rem', md: '3.5rem' },
}));

const PostMeta = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(3),
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(5),
}));

const MetaItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontSize: '0.95rem',
    fontWeight: 500,
}));

const BlogPostDetailPage = () => {
    const { slug } = useParams();
    const post = postsData.find(p => p.slug === slug);

    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    return (
        <Container maxWidth="lg">
            <StyledPostContainer elevation={0}>
                <PostHeader>
                    {post.category && (
                        <Chip
                            label={post.category}
                            color="primary"
                            size="medium"
                            sx={{
                                mb: 2.5,
                                fontWeight: 600,
                                letterSpacing: '0.5px',
                                fontSize: '0.85rem',
                                px: 1.5,
                                py: 2.5,
                                borderRadius: '99px',
                                background: theme => alpha(theme.palette.primary.main, 0.1),
                                color: theme => theme.palette.primary.main,
                                border: theme => `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                            }}
                        />
                    )}
                    <PostTitle variant="h1" component="h1">
                        {post.title}
                    </PostTitle>
                    <PostMeta>
                        <MetaItem>
                            <CalendarTodayIcon sx={{ fontSize: '1.2rem', color: theme => theme.palette.primary.main }} />
                            <Typography variant="body2" component="span" sx={{ fontWeight: 500 }}>
                                Published on {post.date}
                            </Typography>
                        </MetaItem>
                        {post.type && (
                            <MetaItem>
                                <Chip
                                    label={post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                                    size="small"
                                    sx={{
                                        fontWeight: 600,
                                        px: 1.5,
                                        backgroundColor: theme =>
                                            post.type === 'whitepaper'
                                                ? alpha(theme.palette.success.main, 0.1)
                                                : post.type === 'demo'
                                                    ? alpha(theme.palette.secondary.main, 0.1)
                                                    : alpha(theme.palette.primary.main, 0.1),
                                        color: theme =>
                                            post.type === 'whitepaper'
                                                ? theme.palette.success.main
                                                : post.type === 'demo'
                                                    ? theme.palette.secondary.main
                                                    : theme.palette.primary.main,
                                        border: theme =>
                                            post.type === 'whitepaper'
                                                ? `1px solid ${alpha(theme.palette.success.main, 0.3)}`
                                                : post.type === 'demo'
                                                    ? `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`
                                                    : `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                                    }}
                                />
                            </MetaItem>
                        )}
                    </PostMeta>
                </PostHeader>
                <Divider sx={{ mb: { xs: 4, md: 5 } }} />

                {post.type === 'whitepaper' && post.pdfUrl && (
                    <Box className="download-pdf-container">
                        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
                            Full Whitepaper Available
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2, maxWidth: '700px', mx: 'auto' }}>
                            Get the complete details and insights in our downloadable whitepaper document
                        </Typography>
                        <Button
                            variant="contained"
                            href={post.pdfUrl}
                            download={`${post.slug || 'whitepaper'}.pdf`}
                            size="large"
                            sx={{
                                mt: 1,
                                mb: 2,
                                px: 3,
                                py: 1.2,
                                fontWeight: 600,
                                borderRadius: '50px',
                                boxShadow: theme => `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
                            }}
                        >
                            Download PDF: {post.title}
                        </Button>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            The key highlights and abstract are presented below. For the complete details, please download the full PDF document.
                        </Typography>
                    </Box>
                )}

                <Box className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

            </StyledPostContainer>
        </Container>
    );
};

export default BlogPostDetailPage; 