// src/pages/BrdgeListPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    InputAdornment,
    Divider,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tooltip,
    Chip,
    Switch,
    InputBase,
    Snackbar,
    Alert,
    IconButton,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Collapse,
    FormControlLabel,
    useTheme,
    LinearProgress,
} from '@mui/material';
import { Search, Plus, Lock, Globe, User, MessageSquare, LineChart, ChevronDown, Copy, Check, Trash2, BookOpen, GraduationCap, ChevronUp, Share, Edit, ChevronRight, ChevronLeft, ExternalLink, LogOut } from 'lucide-react';
import { api } from '../api';
import { getAuthToken } from '../utils/auth';
import { useSnackbar } from '../utils/snackbar';
import BrdgeList from '../components/BrdgeList';
// At the top with other imports, add these react-dnd imports
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { createParchmentContainerStyles } from '../theme'; // <-- Import the helper function

// Create styles function that uses the theme
const createStyles = (theme) => ({
    pageContainer: {
        background: theme.palette.background.default, // Base dark parchment
        py: 4,
        position: 'relative', // Needed for border styling
        overflow: 'hidden', // Hide overflowing ivy
        borderRadius: '12px', // Added rounded corners
        boxShadow: `inset 0 0 10px rgba(0,0,0,0.3), 0 0 15px rgba(58, 95, 58, 0.3)`, // Added inner shadow and green glow
        // Add global parchment texture background
        '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${theme.textures.darkParchment})`,
            backgroundAttachment: 'fixed', // Keep texture fixed
            backgroundSize: 'cover',
            opacity: 0.1, // Subtle global texture
            mixBlendMode: 'multiply',
            zIndex: 0,
        },
        // Add subtle marble texture to the very background for depth
        '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${theme.textures.lightMarble})`, // Or grainyMarble
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            opacity: 0.05, // Very subtle
            mixBlendMode: 'overlay', // Blend differently
            zIndex: -1, // Behind parchment
        },
        // Main border
        '& .border-container': {
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            '& .main-border': {
                position: 'absolute',
                inset: 0,
                border: '2px solid',
                borderColor: `${theme.palette.secondary.main}30`,
                boxShadow: `inset 0 0 8px ${theme.palette.secondary.main}05`,
            },
            '& .inner-border': {
                position: 'absolute',
                inset: 0,
                margin: 2,
                border: '2px solid',
                borderColor: `${theme.palette.secondary.main}20`,
                borderRadius: '4px',
                boxShadow: `inset 0 0 5px ${theme.palette.secondary.main}10`,
            },
            '& .top-gradient': {
                position: 'absolute',
                top: 1,
                left: 1,
                right: 1,
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.main}35, transparent)`,
            },
            '& .bottom-gradient': {
                position: 'absolute',
                bottom: 1,
                left: 1,
                right: 1,
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.main}35, transparent)`,
            },
            '& .left-gradient': {
                position: 'absolute',
                left: 1,
                top: 1,
                bottom: 1,
                width: '2px',
                background: `linear-gradient(180deg, transparent, ${theme.palette.secondary.main}35, transparent)`,
            },
            '& .right-gradient': {
                position: 'absolute',
                right: 1,
                top: 1,
                bottom: 1,
                width: '2px',
                background: `linear-gradient(180deg, transparent, ${theme.palette.secondary.main}35, transparent)`,
            },
            '& .top-left-corner': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: 20,
                height: 20,
                borderTop: '2px solid',
                borderLeft: '2px solid',
                borderColor: `${theme.palette.secondary.main}40`,
            },
            '& .top-right-corner': {
                position: 'absolute',
                top: 0,
                right: 0,
                width: 20,
                height: 20,
                borderTop: '2px solid',
                borderRight: '2px solid',
                borderColor: `${theme.palette.secondary.main}40`,
            },
            '& .bottom-left-corner': {
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: 20,
                height: 20,
                borderBottom: '2px solid',
                borderLeft: '2px solid',
                borderColor: `${theme.palette.secondary.main}40`,
            },
            '& .bottom-right-corner': {
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 20,
                height: 20,
                borderBottom: '2px solid',
                borderRight: '2px solid',
                borderColor: `${theme.palette.secondary.main}40`,
            },
        },
    },
    header: {
        color: theme.palette.text.primary, // Ink color from theme
        mb: 3,
        fontWeight: 600,
        textAlign: 'center',
        position: 'relative',
        fontFamily: theme.typography.headingFontFamily, // Use heading font
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.main}, transparent)`, // Sepia gradient
        }
    },
    sectionHeader: {
        color: theme.palette.text.primary, // Ink color
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        fontWeight: 600,
        mb: 2,
        fontFamily: theme.typography.headingFontFamily, // Use heading font
        position: 'relative',
        // Replace side line with a subtle quill-like mark or remove
        '&::before': {
            content: '""',
            position: 'absolute',
            left: '-20px', // Adjust position
            top: '50%',
            transform: 'translateY(-50%) rotate(-10deg)',
            width: '15px',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.main}80)`, // Sepia mark
            opacity: 0.7,
        }
    },
    ctaBlock: {
        display: 'flex',
        gap: 2,
        mb: 3,
        flexWrap: { xs: 'wrap', sm: 'nowrap' }
    },
    courseCard: {
        ...createParchmentContainerStyles(theme), // Apply parchment container style
        p: 3,
        borderRadius: '12px', // Keep specific rounding if different from mixin
        // backgroundColor: theme.palette.background.paper, // Handled by mixin
        border: `1px solid ${theme.palette.divider}`, // Handled by mixin, override if needed
        mb: 2,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        // boxShadow: theme.shadows[1], // Handled by mixin
        '&::before': { // Texture overlay from mixin
            ...createParchmentContainerStyles(theme)['&::before'], // Inherit mixin's before
            opacity: 0.1, // Adjust opacity if needed for cards
        },
        // Remove the top gradient line, rely on parchment style
        // '&::before': {
        //     content: '""',
        //     position: 'absolute',
        //     top: 0,
        //     left: 0,
        //     right: 0,
        //     height: '1px',
        //     background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.light}50, transparent)`,
        //     opacity: 0,
        //     transition: 'opacity 0.3s ease'
        // },
        '&:hover': {
            // backgroundColor: theme.palette.background.default, // Use darker parchment on hover
            boxShadow: theme.shadows[3], // Keep enhanced shadow
            borderColor: `${theme.palette.secondary.main}60`, // Sepia border highlight
            transform: 'translateY(-2px)',
            // '&::before': { // Potentially increase texture opacity on hover
            //     opacity: 1
            // }
        },
    },
    moduleUsageBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: '0.7rem',
        py: 0.5,
        px: 1,
        borderRadius: '4px',
        backgroundColor: `${theme.palette.secondary.light}20`,
        color: theme.palette.secondary.main,
        ml: 1,
    },
    tabContainer: {
        mb: 4,
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    tab: {
        color: theme.palette.text.secondary,
        '&.Mui-selected': {
            color: theme.palette.secondary.main,
        },
        textTransform: 'none',
        minWidth: 'auto',
        fontSize: '1rem',
        padding: '12px 16px',
    },
    tabPanel: {
        py: 3,
    },
    marketplaceSection: {
        py: 3,
        borderRadius: '16px',
        backgroundColor: theme.palette.background.paper, // Use paper background
        border: `1px solid ${theme.palette.divider}`, // Standard divider border
        boxShadow: theme.shadows[1],
        mt: 4,
        position: 'relative',
        overflow: 'hidden',
        // Add the dark parchment texture using theme
        '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${theme.textures.darkParchment})`, // Use texture from theme
            backgroundSize: 'cover',
            opacity: 0.08, // Adjust opacity as needed
            mixBlendMode: 'multiply',
            pointerEvents: 'none',
            zIndex: 0,
        },
        // Ensure content is above the pseudo-element
        '& > *': {
            position: 'relative',
            zIndex: 1,
        },
    },
    marketplaceHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        p: 2, // Add padding inside the header
        px: 3,
        borderBottom: `1px solid ${theme.palette.divider}50`, // Use divider with opacity
        // Remove specific background/border from header, let the section handle it
    },
    marketplaceGrid: {
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3,
    },
    marketplaceCard: {
        p: 3,
        borderRadius: '12px',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.background.default,
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[3],
            borderColor: `${theme.palette.secondary.main}60`,
        },
    },
    bulkActionsBar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderRadius: '8px',
        backgroundColor: `${theme.palette.secondary.main}10`,
        mb: 2,
        boxShadow: theme.shadows[1],
    },
    actionButton: {
        backgroundColor: `${theme.palette.secondary.main}10`,
        color: theme.palette.secondary.main,
        borderRadius: '8px',
        border: `1px solid ${theme.palette.secondary.main}40`,
        boxShadow: theme.shadows[1],
        transition: 'all 0.2s ease',
        textTransform: 'none',
        '&:hover': {
            backgroundColor: `${theme.palette.secondary.main}20`,
            borderColor: `${theme.palette.secondary.main}60`,
            boxShadow: theme.shadows[2],
            transform: 'translateY(-1px)'
        }
    },
    statsCard: {
        p: 2,
        borderRadius: '10px',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
    },
    sectionContainer: {
        ...createParchmentContainerStyles(theme), // Apply parchment container style
        mb: 5,
        p: 3,
        // borderRadius: '16px', // Handled by mixin
        // backgroundColor: theme.palette.background.paper, // Handled by mixin
        // border: `1px solid ${theme.palette.divider}`, // Handled by mixin
        // boxShadow: theme.shadows[1], // Handled by mixin
        position: 'relative',
        overflow: 'hidden', // Keep overflow hidden for potential internal effects
        // Remove the radial gradient, rely on parchment style
        // '&::after': {
        //     content: '""',
        //     position: 'absolute',
        //     top: 0,
        //     left: 0,
        //     width: '100%',
        //     height: '100%',
        //     background: `radial-gradient(ellipse at top left, ${theme.palette.secondary.light}10, transparent 70%)`,
        //     pointerEvents: 'none'
        // }
    },
    listContainer: { // Apply parchment style to the module list container too
        ...createParchmentContainerStyles(theme),
        p: 3,
        // borderRadius: '16px', // Handled by mixin
        // backgroundColor: theme.palette.background.paper, // Handled by mixin
        // border: `1px solid ${theme.palette.divider}`, // Handled by mixin
        // boxShadow: theme.shadows[1], // Handled by mixin
        position: 'relative',
        overflow: 'hidden',
        // Remove the radial gradient
        // '&::after': {
        //     content: '""',
        //     position: 'absolute',
        //     top: 0,
        //     left: 0,
        //     width: '100%',
        //     height: '100%',
        //     background: `radial-gradient(ellipse at top left, ${theme.palette.secondary.light}10, transparent 70%)`,
        //     pointerEvents: 'none'
        // }
    },
});

// Add these new styles using the theme
const createSidebarStyles = (theme) => ({
    sidebar: {
        position: 'fixed',
        right: 0,
        top: 0,
        height: '100vh',
        width: 280,
        backgroundColor: `${theme.palette.background.paper}E6`, // With transparency
        backdropFilter: 'blur(10px)',
        borderLeft: `1px solid ${theme.palette.divider}`,
        transition: 'transform 0.3s ease-in-out',
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: theme.shadows[3],
        transform: 'translateX(100%)', // Start offscreen
        pt: '64px', // Account for header height
    },
    toggleButton: {
        position: 'fixed',
        right: 15,
        top: 80,
        width: 36,
        height: 36,
        backgroundColor: theme.palette.background.paper,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.2s ease',
        zIndex: 850,
        boxShadow: theme.shadows[2],
        '&:hover': {
            backgroundColor: `${theme.palette.secondary.main}10`,
            transform: 'scale(1.1)',
        }
    },
    content: {
        padding: 3,
        overflowY: 'auto',
        height: '100%',
        '&::-webkit-scrollbar': {
            width: '6px',
        },
        '&::-webkit-scrollbar-track': {
            background: `${theme.palette.background.paper}50`,
        },
        '&::-webkit-scrollbar-thumb': {
            background: `${theme.palette.secondary.main}30`,
            borderRadius: '3px',
            '&:hover': {
                background: `${theme.palette.secondary.main}50`,
            }
        }
    }
});

// Add this new component for the sidebar
const InfoSidebar = ({ isOpen, onToggle, userStats, courses, navigate }) => {
    const theme = useTheme();

    return (
        <>
            <Box
                onClick={onToggle}
                sx={{
                    ...createSidebarStyles(theme).toggleButton,
                    right: isOpen ? 295 : 15, // Move button when sidebar is open
                }}
            >
                {isOpen ? <ChevronRight size={20} color={theme.palette.secondary.main} /> : <ChevronLeft size={20} color={theme.palette.secondary.main} />}
            </Box>

            <Box
                sx={{
                    ...createSidebarStyles(theme).sidebar,
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    backgroundColor: theme.palette.background.paper + 'E6', // ~90% opacity parchmentDark
                }}
            >
                <Box sx={createSidebarStyles(theme).content}>
                    {/* Welcome Section */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{
                            color: theme.palette.secondary.main,
                            fontWeight: 600,
                            mb: 2,
                            fontFamily: theme.typography.h6.fontFamily
                        }}>
                            Welcome to the Hub
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2, lineHeight: 1.6 }}>
                            Your AI-powered education center for creating, managing, and sharing interactive learning materials.
                        </Typography>
                    </Box>

                    {/* Quick Tips Section */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle2" sx={{
                            color: theme.palette.text.primary,
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            Quick Tips
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{
                                p: 2,
                                borderRadius: '8px',
                                backgroundColor: `${theme.palette.secondary.main}05`,
                                border: `1px solid ${theme.palette.secondary.main}20`,
                            }}>
                                <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                                    💡 Create AI Modules
                                </Typography>
                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                    Start by creating AI-powered learning modules with interactive content and chat capabilities.
                                </Typography>
                            </Box>
                            <Box sx={{
                                p: 2,
                                borderRadius: '8px',
                                backgroundColor: `${theme.palette.secondary.main}05`,
                                border: `1px solid ${theme.palette.secondary.main}20`,
                            }}>
                                <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                                    📚 Organize into Courses
                                </Typography>
                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                    Group your modules into structured courses for better organization and learning flow.
                                </Typography>
                            </Box>
                            <Box sx={{
                                p: 2,
                                borderRadius: '8px',
                                backgroundColor: `${theme.palette.secondary.main}05`,
                                border: `1px solid ${theme.palette.secondary.main}20`,
                            }}>
                                <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                                    🛍️ Marketplace
                                </Typography>
                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                    Browse and enroll in a growing marketplace of AI-powered courses created by educators and experts in various fields.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

// Add this component after the InfoSidebar component
const DraggableModuleItem = ({ module, index, courseId, handleEdit, handleView, handleRemoveModuleFromCourse, moveModule }) => {
    const ref = React.useRef(null);
    const theme = useTheme();

    // Set up drag source
    const [{ isDragging }, drag] = useDrag({
        type: 'MODULE',
        item: { index, id: module.id, courseId },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    // Set up drop target
    const [, drop] = useDrop({
        accept: 'MODULE',
        hover: (item, monitor) => {
            if (!ref.current) {
                return;
            }

            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }

            // Only perform the move when we're hovering over a different course module
            if (item.courseId !== courseId) {
                return;
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            // Time to actually perform the action
            moveModule(dragIndex, hoverIndex, item.courseId);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });

    // Initialize drag and drop
    drag(drop(ref));

    return (
        <Box
            ref={ref}
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
                py: 1,
                px: 1,
                borderRadius: '4px',
                backgroundColor: isDragging ? `${theme.palette.secondary.main}10` : 'transparent',
                opacity: isDragging ? 0.5 : 1,
                border: isDragging ? `1px dashed ${theme.palette.secondary.main}50` : '1px solid transparent',
                cursor: 'move',
                '&:hover': { backgroundColor: `${theme.palette.background.paper}80` }
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    color: theme.palette.text.secondary,
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {index + 1}. {module.name}
                {module.shareable ? (
                    <Tooltip title="Public Module">
                        <Box sx={{ display: 'inline-flex', ml: 1 }}>
                            <Globe size={14} color={theme.palette.secondary.main} />
                        </Box>
                    </Tooltip>
                ) : (
                    <Tooltip title="Private Module">
                        <Box sx={{ display: 'inline-flex', ml: 1 }}>
                            <Lock size={14} color={theme.palette.text.disabled} />
                        </Box>
                    </Tooltip>
                )}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="View Module">
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleView(null, { id: module.brdge_id, public_id: module.public_id });
                        }}
                        sx={{
                            color: theme.palette.text.secondary,
                            padding: '4px',
                            '&:hover': { color: theme.palette.secondary.main, backgroundColor: `${theme.palette.secondary.main}10` }
                        }}
                    >
                        <BookOpen size={16} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit Module">
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(null, { id: module.brdge_id, public_id: module.public_id });
                        }}
                        sx={{
                            color: theme.palette.text.secondary,
                            padding: '4px',
                            '&:hover': { color: theme.palette.secondary.main, backgroundColor: `${theme.palette.secondary.main}10` }
                        }}
                    >
                        <Edit size={16} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Remove from Course">
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveModuleFromCourse(courseId, module.id);
                        }}
                        sx={{
                            color: theme.palette.text.secondary,
                            padding: '4px',
                            '&:hover': { color: theme.palette.error.main, backgroundColor: `${theme.palette.error.main}10` }
                        }}
                    >
                        <Trash2 size={16} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

function BrdgeListPage() {
    const theme = useTheme(); // Add this at the beginning of the component
    const [brdges, setBrdges] = useState([]);
    const [courses, setCourses] = useState([]);
    const [marketplaceCourses, setMarketplaceCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]); // New state for enrolled courses
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteCourseDialogOpen, setDeleteCourseDialogOpen] = useState(false);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [shareCourseDialogOpen, setShareCourseDialogOpen] = useState(false);
    const [brdgeToDelete, setBrdgeToDelete] = useState(null);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [brdgeToShare, setBrdgeToShare] = useState(null);
    const [courseToShare, setCourseToShare] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [orderBy, setOrderBy] = useState('updated_at');
    const [orderDirection, setOrderDirection] = useState('desc');
    const [userStats, setUserStats] = useState({
        brdges_created: 0,
        brdges_limit: '2',
        minutes_used: 0,
        minutes_limit: 30
    });
    const [expandedBrdge, setExpandedBrdge] = useState(null);
    const [conversationData, setConversationData] = useState({});
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [order, setOrder] = useState('desc');
    const [selectedModules, setSelectedModules] = useState([]);
    const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('content');
    const [marketplaceExpanded, setMarketplaceExpanded] = useState(true);
    const [moduleSelectionDialogOpen, setModuleSelectionDialogOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [moduleSearchTerm, setModuleSearchTerm] = useState('');
    const [draggedModuleId, setDraggedModuleId] = useState(null);
    const [dropTargetCourseId, setDropTargetCourseId] = useState(null);
    const [courseDialogOpen, setCourseDialogOpen] = useState(false);
    const [newCourseData, setNewCourseData] = useState({ name: '', description: '' });
    const [sidebarOpen, setSidebarOpen] = useState(false); // Change to start with sidebar closed
    // Add these state variables near other state declarations
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [editedCourseName, setEditedCourseName] = useState('');
    const [savingCourse, setSavingCourse] = useState(false);
    const [courseLinkCopied, setCourseLinkCopied] = useState(false);
    // Add this state variable near other dialog state variables
    const [unenrollDialogOpen, setUnenrollDialogOpen] = useState(false);
    const [courseToUnenroll, setCourseToUnenroll] = useState(null);
    // Add these to the existing state declarations near the beginning of the BrdgeListPage function
    const [enrolledCoursesExpanded, setEnrolledCoursesExpanded] = useState(true);
    const [yourCoursesExpanded, setYourCoursesExpanded] = useState(true);
    const [aiModulesExpanded, setAiModulesExpanded] = useState(true);

    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        fetchBrdges();
        fetchCourses();
        fetchMarketplaceCourses();
        fetchEnrolledCourses(); // Add this new function call
        fetchStats();
    }, []);

    const getBrdgeLimit = (accountType) => {
        switch (accountType) {
            case 'pro':
                return 'Unlimited';
            case 'standard':
                return 10;
            default:
                return 1;
        }
    };

    const getMinutesLimit = (accountType) => {
        switch (accountType) {
            case 'pro':
                return 1000;
            case 'standard':
                return 300;
            default:
                return 30;
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/user/stats');
            const accountType = response.data.account_type || 'free';
            setUserStats({
                ...response.data,
                brdges_limit: getBrdgeLimit(accountType),
                minutes_limit: getMinutesLimit(accountType)
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await api.get('/courses');
            setCourses(response.data.courses || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
            showSnackbar('Failed to fetch courses', 'error');
        }
    };

    const fetchBrdges = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await api.get('/brdges');
            setBrdges(response.data.brdges || []);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch AI Modules');
            setLoading(false);
        }
    };

    const fetchMarketplaceCourses = async () => {
        try {
            const token = getAuthToken();
            const response = await api.get('/courses/marketplace');
            setMarketplaceCourses(response.data.courses || []);
        } catch (error) {
            console.error('Error fetching marketplace courses:', error);
            showSnackbar('Failed to fetch marketplace courses', 'error');
        }
    };

    const fetchEnrolledCourses = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                navigate('/login');
                return;
            }

            // Use our new dedicated API endpoint for enrolled courses
            const response = await api.get('/courses/enrolled');

            // The API now returns enrolled courses directly with enrollment details
            setEnrolledCourses(response.data.enrolled_courses || []);

        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
            showSnackbar('Failed to fetch enrolled courses', 'error');
        }
    };

    const handleSort = (property) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);

        const sortedBrdges = [...brdges].sort((a, b) => {
            if (property === 'name') {
                return isAsc
                    ? b.name.localeCompare(a.name)
                    : a.name.localeCompare(b.name);
            }
            if (property === 'status') {
                return isAsc
                    ? (b.shareable ? 1 : -1) - (a.shareable ? 1 : -1)
                    : (a.shareable ? 1 : -1) - (b.shareable ? 1 : -1);
            }
            return isAsc
                ? new Date(b[property]) - new Date(a[property])
                : new Date(a[property]) - new Date(b[property]);
        });

        setBrdges(sortedBrdges);
    };

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
    };

    const filteredBrdges = brdges.filter(brdge =>
        brdge.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleView = (e, brdge) => {
        if (e) e.stopPropagation();
        const id = brdge.id || brdge.brdge_id;
        const publicIdShort = brdge.public_id ? brdge.public_id.substring(0, 6) : '';
        navigate(`/viewBridge/${id}-${publicIdShort}`);
    };

    const handleEdit = (e, brdge) => {
        if (e) e.stopPropagation();
        navigate(`/edit/${brdge.id}-${brdge.public_id.substring(0, 6)}`);
    };

    const handleShare = (e, brdge) => {
        if (e) e.stopPropagation();
        setBrdgeToShare(brdge);
        setShareDialogOpen(true);
    };

    const handleCloseShare = () => {
        setShareDialogOpen(false);
        setBrdgeToShare(null);
        setLinkCopied(false);
    };

    const handleDelete = (e, brdge) => {
        if (e) e.stopPropagation();
        setBrdgeToDelete(brdge);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/brdges/${brdgeToDelete.id}`);
            setBrdges(brdges.filter((b) => b.id !== brdgeToDelete.id));
            showSnackbar('AI Module deleted successfully', 'success');
            setDeleteDialogOpen(false);
            fetchStats(); // Refresh stats after deletion
        } catch (error) {
            showSnackbar('Failed to delete AI Module', 'error');
        }
    };

    const isOverLimit = () => {
        if (!userStats) return false;

        const isBrdgesOverLimit =
            userStats.brdges_limit !== 'Unlimited' &&
            parseInt(userStats.brdges_created) >= parseInt(userStats.brdges_limit);
        const isMinutesOverLimit = parseInt(userStats.minutes_used) >= parseInt(userStats.minutes_limit);

        return isBrdgesOverLimit || isMinutesOverLimit;
    };

    const canCreateBrdge = () => {
        // Check if we have valid stats
        if (!userStats) return false;

        // If on pro plan or unlimited limit, always return true
        if (userStats.brdges_limit === 'Unlimited') return true;

        // For standard plan (10 brdges) or free plan (1 brdge)
        const currentLimit = parseInt(userStats.brdges_limit);
        const currentCount = parseInt(userStats.brdges_created);

        // Check both brdges and minutes limits
        const underBrdgeLimit = currentCount < currentLimit;
        const underMinuteLimit = parseInt(userStats.minutes_used) < parseInt(userStats.minutes_limit);

        return underBrdgeLimit && underMinuteLimit;
    };


    const handleCopyLink = () => {
        const shareableUrl = `${window.location.origin}/viewBridge/${brdgeToShare?.id}-${brdgeToShare?.public_id.substring(0, 6)}`;
        navigator.clipboard.writeText(shareableUrl);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const handleShareToggle = async () => {
        if (!brdgeToShare) return;

        try {
            // Show loading indicator
            setSavingCourse(true);

            const response = await api.post(`/brdges/${brdgeToShare.id}/toggle_shareable`);
            const newShareableStatus = response.data.shareable;

            // Update states in a single batch
            setBrdges(prevBrdges => prevBrdges.map(b =>
                b.id === brdgeToShare.id ? { ...b, shareable: newShareableStatus } : b
            ));

            setBrdgeToShare(prev => ({
                ...prev,
                shareable: newShareableStatus
            }));

            showSnackbar(
                `Module is now ${newShareableStatus ? 'public' : 'private'}`,
                'success'
            );

            // If now shareable and wasn't before, automatically show "copied" to encourage sharing
            if (newShareableStatus && !brdgeToShare.shareable) {
                setTimeout(() => {
                    handleCopyLink();
                }, 300);
            }
        } catch (error) {
            console.error('Error toggling share status:', error);
            showSnackbar('Failed to update sharing settings', 'error');
        } finally {
            setSavingCourse(false);
        }
    };

    const handleCreateClick = () => {
        if (isOverLimit()) {
            // Check which limit is exceeded to customize the warning message
            const limitType =
                userStats.brdges_limit !== 'Unlimited' &&
                    parseInt(userStats.brdges_created) >= parseInt(userStats.brdges_limit)
                    ? 'AI Modules'
                    : 'AI interaction minutes';
            showSnackbar(
                `You've reached your ${limitType} limit. Upgrade your plan for more!`,
                'warning'
            );
            navigate('/profile');
        } else {
            navigate('/create');
        }
    };

    const handleCreateCourse = async () => {
        try {
            // Create a new course with default values
            const response = await api.post('/courses', {
                name: "New Course",
                description: "Click edit to customize this course"
            });

            // Add the new course to the courses state
            setCourses([...courses, response.data.course]);

            // Show success message
            showSnackbar('Course created successfully. Click "Edit" to customize it.', 'success');

            // Optional: Scroll to the new course
            setTimeout(() => {
                const newCourseElement = document.getElementById(`course-${response.data.course.id}`);
                if (newCourseElement) {
                    newCourseElement.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
        } catch (error) {
            console.error('Error creating course:', error);
            showSnackbar('Failed to create course', 'error');
        }
    };

    const handleEditCourse = (course) => {
        navigate(`/edit-course/${course.id}-${course.public_id.substring(0, 6)}`);
    };

    const handleViewCourse = (course) => {
        navigate(`/c/${course.public_id}`);
    };

    const handleShareCourse = (course) => {
        setCourseToShare(course);
        setShareCourseDialogOpen(true);
    };

    const handleDeleteCourse = (course) => {
        setCourseToDelete(course);
        setDeleteCourseDialogOpen(true);
    };

    const confirmDeleteCourse = async () => {
        try {
            if (!courseToDelete) return;

            await api.delete(`/courses/${courseToDelete.id}`);

            // Update local state to remove the course
            setCourses(courses.filter(c => c.id !== courseToDelete.id));

            // Close dialog and reset state
            setDeleteCourseDialogOpen(false);
            setCourseToDelete(null);

            showSnackbar('Course deleted successfully. Your modules remain available.', 'success');
        } catch (error) {
            console.error('Error deleting course:', error);
            showSnackbar('Failed to delete course', 'error');
        }
    };

    const handleAddModuleToCourse = async (courseId, brdgeId) => {
        try {
            const response = await api.post(`/courses/${courseId}/modules`, { brdge_id: brdgeId });

            // Update the courses state to include the new module
            setCourses(prevCourses => {
                return prevCourses.map(course => {
                    if (course.id === courseId) {
                        // Get the brdge details from the brdges array
                        const brdge = brdges.find(b => b.id === brdgeId);

                        if (brdge) {
                            // Create the module object to add to the course
                            const newModule = {
                                id: response.data.course_module.id,
                                brdge_id: brdge.id,
                                name: brdge.name,
                                position: response.data.course_module.position,
                                shareable: brdge.shareable,
                                public_id: brdge.public_id
                            };

                            // Add the new module to the course
                            return {
                                ...course,
                                modules: [...(course.modules || []), newModule]
                            };
                        }
                    }
                    return course;
                });
            });

            showSnackbar('Module added to course successfully', 'success');
        } catch (error) {
            console.error('Error adding module to course:', error);
            showSnackbar('Failed to add module to course', 'error');
        }
    };

    const handleRemoveModuleFromCourse = async (courseId, moduleId) => {
        try {
            await api.delete(`/courses/${courseId}/modules/${moduleId}`);

            // Update the courses state to remove the module
            setCourses(prevCourses => {
                return prevCourses.map(course => {
                    if (course.id === courseId) {
                        return {
                            ...course,
                            modules: (course.modules || []).filter(module => module.id !== moduleId)
                        };
                    }
                    return course;
                });
            });

            showSnackbar('Module removed from course successfully', 'success');
        } catch (error) {
            console.error('Error removing module from course:', error);
            showSnackbar('Failed to remove module from course', 'error');
        }
    };

    const handleReorderModules = async (courseId, moduleOrder) => {
        try {
            await api.put(`/courses/${courseId}/modules/reorder`, { modules: moduleOrder });

            // Update the courses state with the new order
            setCourses(prevCourses => {
                return prevCourses.map(course => {
                    if (course.id === courseId) {
                        // Create a new modules array with updated positions
                        const updatedModules = [...course.modules];
                        moduleOrder.forEach(item => {
                            const index = updatedModules.findIndex(m => m.id === item.id);
                            if (index !== -1) {
                                updatedModules[index] = {
                                    ...updatedModules[index],
                                    position: item.position
                                };
                            }
                        });

                        // Sort the modules by position
                        updatedModules.sort((a, b) => a.position - b.position);

                        return {
                            ...course,
                            modules: updatedModules
                        };
                    }
                    return course;
                });
            });

            showSnackbar('Modules reordered successfully', 'success');
        } catch (error) {
            console.error('Error reordering modules:', error);
            showSnackbar('Failed to reorder modules', 'error');
        }
    };

    // Define table columns
    const columns = [
        {
            id: 'name',
            label: 'Name',
            sortable: true,
            width: '30%'
        },
        {
            id: 'status',
            label: 'Status',
            sortable: true,
            width: '15%'
        },
        {
            id: 'created_at',
            label: 'Created',
            sortable: true,
            width: '20%'
        },
        {
            id: 'updated_at',
            label: 'Last Updated',
            sortable: true,
            width: '20%'
        },
        {
            id: 'actions',
            label: 'Actions',
            sortable: false,
            width: '15%'
        }
    ];

    // Calculate sorted brdges
    const sortedBrdges = React.useMemo(() => {
        if (!filteredBrdges) return [];

        return [...filteredBrdges].sort((a, b) => {
            if (orderBy === 'name') {
                return order === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            }
            if (orderBy === 'status') {
                return order === 'asc'
                    ? (a.shareable ? 1 : -1) - (b.shareable ? 1 : -1)
                    : (b.shareable ? 1 : -1) - (a.shareable ? 1 : -1);
            }
            return order === 'asc'
                ? new Date(a[orderBy]) - new Date(b[orderBy])
                : new Date(b[orderBy]) - new Date(a[orderBy]);
        });
    }, [filteredBrdges, orderBy, order]);

    // Handle row click
    const handleRowClick = (brdge) => {
        navigate(`/edit/${brdge.id}`);
    };

    // Add function to handle module selection
    const handleModuleSelect = (moduleId) => {
        setSelectedModules(prev => {
            // If already selected, remove it
            if (prev.includes(moduleId)) {
                return prev.filter(id => id !== moduleId);
            }
            // Otherwise add it
            return [...prev, moduleId];
        });
    };

    // Add function to handle batch deletion
    const handleBatchDelete = () => {
        if (selectedModules.length > 0) {
            setBatchDeleteDialogOpen(true);
        }
    };

    // Add function to confirm and execute batch deletion
    const confirmBatchDelete = async () => {
        try {
            // Send delete requests for all selected modules
            await Promise.all(
                selectedModules.map(moduleId =>
                    api.delete(`/brdges/${moduleId}`)
                )
            );

            // Update the brdges state by filtering out deleted modules
            setBrdges(brdges.filter(b => !selectedModules.includes(b.id)));

            // Clear selection and close dialog
            setSelectedModules([]);
            setBatchDeleteDialogOpen(false);

            // Show success message
            showSnackbar(`${selectedModules.length} modules deleted successfully`, 'success');

            // Refresh stats after deletion
            fetchStats();
        } catch (error) {
            showSnackbar('Failed to delete some modules', 'error');
        }
    };

    // Add function to select all visible modules
    const handleSelectAll = () => {
        if (selectedModules.length === filteredBrdges.length) {
            // If all are selected, deselect all
            setSelectedModules([]);
        } else {
            // Otherwise select all visible modules
            setSelectedModules(filteredBrdges.map(b => b.id));
        }
    };

    // Add function to clear selection
    const clearSelection = () => {
        setSelectedModules([]);
    };

    const handleCloseCourseShare = () => {
        setShareCourseDialogOpen(false);
        setCourseLinkCopied(false);
    };

    const handleCopyCourseLink = () => {
        if (!courseToShare) return;

        const shareableUrl = `${window.location.origin}/c/${courseToShare.public_id}`;
        navigator.clipboard.writeText(shareableUrl);
        setCourseLinkCopied(true);
        setTimeout(() => setCourseLinkCopied(false), 2000);
        showSnackbar('Course link copied to clipboard!', 'success');
    };

    const handleCourseShareToggle = async () => {
        if (!courseToShare) return;

        try {
            // Show loading indicator
            setSavingCourse(true);

            const response = await api.post(`/courses/${courseToShare.id}/toggle_shareable`);
            const newShareableStatus = response.data.shareable;

            // Update states in a single batch
            setCourses(prevCourses => prevCourses.map(c =>
                c.id === courseToShare.id ? { ...c, shareable: newShareableStatus } : c
            ));

            setCourseToShare(prev => ({
                ...prev,
                shareable: newShareableStatus
            }));

            showSnackbar(
                `Course is now ${newShareableStatus ? 'public' : 'private'}`,
                'success'
            );

            // If now shareable and wasn't before, automatically show "copied" to encourage sharing
            if (newShareableStatus && !courseToShare.shareable) {
                setTimeout(() => {
                    handleCopyCourseLink();
                }, 300);
            }
        } catch (error) {
            console.error('Error toggling course share status:', error);
            showSnackbar('Failed to update course sharing settings', 'error');
        } finally {
            setSavingCourse(false);
        }
    };

    // Add this function to handle opening the module selection dialog
    const handleOpenModuleSelection = (course) => {
        setSelectedCourse(course);
        setModuleSelectionDialogOpen(true);
        setModuleSearchTerm('');
    };

    // Add this function to handle module dragging start
    const handleModuleDragStart = (e, moduleId) => {
        setDraggedModuleId(moduleId);
        e.dataTransfer.setData('moduleId', moduleId);
        // Make the drag image semi-transparent
        if (e.target.style) {
            e.target.style.opacity = '0.4';
        }
    };

    // Add this function to handle module dragging end
    const handleModuleDragEnd = (e) => {
        setDraggedModuleId(null);
        setDropTargetCourseId(null);
        // Reset opacity
        if (e.target.style) {
            e.target.style.opacity = '1';
        }
    };

    // Add this function to handle drag over a course
    const handleDragOver = (e, courseId) => {
        e.preventDefault();
        setDropTargetCourseId(courseId);
    };

    // Add this function to handle drop on a course
    const handleDrop = (e, courseId) => {
        e.preventDefault();
        const moduleId = e.dataTransfer.getData('moduleId') || draggedModuleId;
        if (moduleId) {
            handleAddModuleToCourse(courseId, moduleId);
        }
        setDraggedModuleId(null);
        setDropTargetCourseId(null);
    };

    // Add this function to handle adding modules from the selection dialog
    const handleAddSelectedModules = () => {
        // Here you would handle adding multiple selected modules to the course
        // For now, we'll leave this as is since we already have a working function for adding single modules
        setModuleSelectionDialogOpen(false);
    };

    // Add filter for module selection dialog
    const filteredModulesForSelection = brdges.filter(brdge => {
        // Filter out modules that are already in the course
        const alreadyInCourse = selectedCourse?.modules?.some(
            module => module.brdge_id === brdge.id
        );

        return !alreadyInCourse &&
            brdge.name.toLowerCase().includes(moduleSearchTerm.toLowerCase());
    });

    // Inside the BrdgeListPage function component, add this new function for moving modules
    const moveModule = (dragIndex, hoverIndex, courseId) => {
        // Find the course
        const course = courses.find(c => c.id === courseId);
        if (!course || !course.modules) return;

        // Create a copy of the modules array
        const updatedModules = [...course.modules];

        // Remove the dragged item
        const draggedItem = updatedModules[dragIndex];

        // Remove and insert at new index
        updatedModules.splice(dragIndex, 1);
        updatedModules.splice(hoverIndex, 0, draggedItem);

        // Update positions for all items
        const moduleOrder = updatedModules.map((module, index) => ({
            id: module.id,
            position: index + 1
        }));

        // Update the state and call the API
        setCourses(prevCourses => {
            return prevCourses.map(c => {
                if (c.id === courseId) {
                    // Return a new course object with updated modules array
                    return {
                        ...c,
                        modules: updatedModules.map((module, index) => ({
                            ...module,
                            position: index + 1
                        }))
                    };
                }
                return c;
            });
        });

        // Call the API to update the backend
        handleReorderModules(courseId, moduleOrder);
    };

    // Add these functions after other similar handler functions
    const handleStartEditingCourse = (e, course) => {
        e.stopPropagation();
        setEditingCourseId(course.id);
        setEditedCourseName(course.name);
    };

    const handleCourseNameChange = (e) => {
        setEditedCourseName(e.target.value);
    };

    const handleSaveCourseName = async (courseId) => {
        if (!editedCourseName.trim()) {
            showSnackbar('Course name cannot be empty', 'error');
            return;
        }

        try {
            await api.put(`/courses/${courseId}`, { name: editedCourseName });

            // Update local state
            setCourses(prevCourses => prevCourses.map(course =>
                course.id === courseId
                    ? { ...course, name: editedCourseName }
                    : course
            ));

            // Exit edit mode
            setEditingCourseId(null);
            setEditedCourseName('');

            showSnackbar('Course name updated successfully', 'success');
        } catch (error) {
            console.error('Error updating course name:', error);
            showSnackbar('Failed to update course name', 'error');
        }
    };

    const handleCancelEditingCourse = () => {
        setEditingCourseId(null);
        setEditedCourseName('');
    };

    // Add the normalizeThumbnailUrl helper function inside the BrdgeListPage component
    const normalizeThumbnailUrl = (url) => {
        if (!url) return null;

        // If it's already an absolute URL, return it as is
        if (url.startsWith('http')) return url;

        // If it's a relative URL starting with /api
        if (url.startsWith('/api')) {
            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

            // Remove the duplicate /api if the base URL already ends with /api
            if (baseUrl.endsWith('/api')) {
                // Remove the leading /api from the url
                const cleanUrl = url.replace(/^\/api/, '');
                return `${baseUrl}${cleanUrl}`;
            }

            // Otherwise just append as normal
            return `${baseUrl}${url}`;
        }

        return url;
    };

    // Add function to handle unenrolling from a course
    const handleUnenroll = async (courseId) => {
        try {
            await api.post(`/courses/${courseId}/unenroll`);

            // Update the local state by removing the unenrolled course
            setEnrolledCourses(prevCourses =>
                prevCourses.filter(course => course.id !== courseId)
            );

            showSnackbar('Successfully unenrolled from course', 'success');
        } catch (error) {
            console.error('Error unenrolling from course:', error);
            showSnackbar('Failed to unenroll from course', 'error');
        }
    };

    // Add this function to handle unenrolling from a course
    const handleUnenrollClick = (course) => {
        setCourseToUnenroll(course);
        setUnenrollDialogOpen(true);
    };

    const confirmUnenroll = async () => {
        if (!courseToUnenroll) return;

        try {
            await api.post(`/courses/${courseToUnenroll.id}/unenroll`);

            // Update the local state by removing the unenrolled course
            setEnrolledCourses(prevCourses =>
                prevCourses.filter(course => course.id !== courseToUnenroll.id)
            );

            showSnackbar('Successfully unenrolled from course', 'success');
            setUnenrollDialogOpen(false);
            setCourseToUnenroll(null);
        } catch (error) {
            console.error('Error unenrolling from course:', error);
            showSnackbar('Failed to unenroll from course', 'error');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress sx={{ color: theme.palette.secondary.main }} />
            </Box>
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            {/* Apply page container styles */}
            <Box sx={{
                ...createStyles(theme).pageContainer,
                display: 'flex',
                minHeight: '100vh',
            }}>
                {/* Border Elements */}
                <Box className="border-container">
                    <Box className="main-border"></Box>
                    <Box className="inner-border"></Box>
                    <Box className="top-gradient"></Box>
                    <Box className="bottom-gradient"></Box>
                    <Box className="left-gradient"></Box>
                    <Box className="right-gradient"></Box>
                    <Box className="top-left-corner"></Box>
                    <Box className="top-right-corner"></Box>
                    <Box className="bottom-left-corner"></Box>
                    <Box className="bottom-right-corner"></Box>
                </Box>

                <Box sx={{
                    flex: 1,
                    width: '100%',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <Container maxWidth="lg" sx={{
                        py: 4,
                        px: { xs: 2, sm: 3, md: 4 }, // Adjust padding to account for ivy borders if needed
                    }}>
                        <Typography variant="h4" sx={createStyles(theme).header}>
                            Learning Hub
                        </Typography>

                        {/* Platform Introduction & Analytics Section */}
                        <Box sx={{ mb: 4, pb: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative' }}>

                            {/* Usage Stats - Smaller, clearer cards with tooltips */}
                            <Typography variant="subtitle1" sx={{
                                mb: 2,
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                            </Typography>

                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                {/* Course Stats Card */}
                                <Grid item xs={12} sm={4}>
                                    <Tooltip title="Total number of courses you've created. Courses help you organize modules into structured learning paths.">
                                        <Box sx={{ // Use theme styles for stats cards
                                            backgroundColor: theme.palette.background.paper, // Parchment paper bg
                                            border: `1px solid ${theme.palette.divider}`, // Sepia divider border
                                            p: 1.5,
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            height: '100%',
                                            cursor: 'help',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: theme.palette.secondary.light, // Lighter sepia border on hover
                                                boxShadow: theme.shadows[2],
                                            }
                                        }}>
                                            <Box sx={{
                                                height: 38,
                                                width: 38,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: `${theme.palette.secondary.main}15`, // Sepia tint background for icon
                                                borderRadius: '50%',
                                                boxShadow: `0 0 10px ${theme.palette.secondary.main}30`, // Sepia shadow
                                            }}>
                                                <BookOpen size={20} color={theme.palette.secondary.main} /> {/* Use Sepia color */}
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" sx={{
                                                    color: theme.palette.text.secondary, // Ink Faded
                                                    fontSize: '0.75rem'
                                                }}>
                                                    Courses Created
                                                </Typography>
                                                <Typography variant="h6" sx={{
                                                    color: theme.palette.text.primary, // Ink
                                                    fontWeight: 'bold',
                                                    mt: 0.5,
                                                    display: 'flex',
                                                    alignItems: 'baseline',
                                                    gap: 0.5
                                                }}>
                                                    {courses.length}
                                                    <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}> {/* Ink Faded */}
                                                        total
                                                    </Typography>
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Tooltip>
                                </Grid>

                                {/* AI Modules Stats Card */}
                                <Grid item xs={12} sm={4}>
                                    <Tooltip title="Number of AI Modules you've created out of your plan limit. Modules are interactive learning components powered by AI.">
                                        <Box sx={{ // Use theme styles for stats cards
                                            backgroundColor: theme.palette.background.paper,
                                            border: `1px solid ${theme.palette.divider}`,
                                            p: 1.5,
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            height: '100%',
                                            cursor: 'help',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: theme.palette.secondary.light,
                                                boxShadow: theme.shadows[2],
                                            }
                                        }}>
                                            <Box sx={{
                                                height: 38,
                                                width: 38,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: `${theme.palette.secondary.main}15`,
                                                borderRadius: '50%',
                                                boxShadow: `0 0 10px ${theme.palette.secondary.main}30`,
                                            }}>
                                                <GraduationCap size={20} color={theme.palette.secondary.main} /> {/* Use Sepia color */}
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" sx={{
                                                    color: theme.palette.text.secondary, // Ink Faded
                                                    fontSize: '0.75rem'
                                                }}>
                                                    AI Modules
                                                </Typography>
                                                <Typography variant="h6" sx={{
                                                    color: theme.palette.text.primary, // Ink
                                                    fontWeight: 'bold',
                                                    mt: 0.5,
                                                    display: 'flex',
                                                    alignItems: 'baseline',
                                                    gap: 0.5
                                                }}>
                                                    {userStats.brdges_created}
                                                    <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}> {/* Ink Faded */}
                                                        {userStats.brdges_limit === 'Unlimited' ?
                                                            '/ ∞' :
                                                            `/ ${userStats.brdges_limit}`}
                                                    </Typography>
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Tooltip>
                                </Grid>

                                {/* AI Minutes Stats Card */}
                                <Grid item xs={12} sm={4}>
                                    <Tooltip title="AI interaction minutes used out of your plan allocation. These minutes are consumed when users interact with your modules.">
                                        <Box sx={{ // Use theme styles for stats cards
                                            backgroundColor: theme.palette.background.paper,
                                            border: `1px solid ${theme.palette.divider}`,
                                            p: 1.5,
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            height: '100%',
                                            cursor: 'help',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: theme.palette.secondary.light,
                                                boxShadow: theme.shadows[2],
                                            }
                                        }}>
                                            <Box sx={{
                                                height: 38,
                                                width: 38,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: `${theme.palette.secondary.main}15`,
                                                borderRadius: '50%',
                                                boxShadow: `0 0 10px ${theme.palette.secondary.main}30`,
                                            }}>
                                                <MessageSquare size={20} color={theme.palette.secondary.main} /> {/* Use Sepia color */}
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" sx={{
                                                    color: theme.palette.text.secondary, // Ink Faded
                                                    fontSize: '0.75rem'
                                                }}>
                                                    AI Minutes
                                                </Typography>
                                                <Typography variant="h6" sx={{
                                                    color: theme.palette.text.primary, // Ink
                                                    fontWeight: 'bold',
                                                    mt: 0.5,
                                                    display: 'flex',
                                                    alignItems: 'baseline',
                                                    gap: 0.5
                                                }}>
                                                    {userStats.minutes_used}
                                                    <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}> {/* Ink Faded */}
                                                        / {userStats.minutes_limit}
                                                    </Typography>
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Tooltip>
                                </Grid>
                            </Grid>

                            {/* Upgrade prompt if near limits */}
                            {(userStats.brdges_created > 0.7 * userStats.brdges_limit ||
                                userStats.minutes_used > 0.7 * userStats.minutes_limit) &&
                                userStats.brdges_limit !== 'Unlimited' && (
                                    <Box sx={{
                                        mt: 1,
                                        p: 1.5,
                                        borderRadius: '8px',
                                        backgroundColor: `${theme.palette.secondary.light}15`, // Light sepia tint background
                                        border: `1px dashed ${theme.palette.secondary.main}30`, // Sepia dashed border
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}> {/* Ink Faded */}
                                            You're approaching your plan limits. Upgrade to unlock more AI capabilities.
                                        </Typography>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => navigate('/profile')}
                                            sx={{ // Use theme's secondary button style, but smaller
                                                color: theme.palette.secondary.main, // Sepia
                                                borderColor: `${theme.palette.secondary.main}50`, // Sepia border
                                                '&:hover': {
                                                    borderColor: theme.palette.secondary.main, // Stronger Sepia border
                                                    backgroundColor: `${theme.palette.secondary.main}10` // Sepia tint background
                                                }
                                            }}
                                        >
                                            Upgrade
                                        </Button>
                                    </Box>
                                )}

                            {/* Enhanced Search Bar with sepia styling */}
                            <Box sx={{ position: 'relative', mt: 3, mb: 3 }}>
                                <Search
                                    size={20}
                                    style={{
                                        position: 'absolute',
                                        left: 12,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: theme.palette.secondary.main
                                    }}
                                />
                                <InputBase
                                    placeholder="Search your modules and courses..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    sx={{
                                        width: '100%',
                                        pl: 5,
                                        pr: 2,
                                        py: 1.2,
                                        borderRadius: '50px',
                                        backgroundColor: theme.palette.background.default,
                                        color: theme.palette.text.primary,
                                        border: `1px solid ${theme.palette.divider}`,
                                        transition: 'all 0.3s ease',
                                        boxShadow: theme.shadows[1],
                                        '&:hover': {
                                            backgroundColor: theme.palette.background.paper,
                                            borderColor: `${theme.palette.secondary.main}50`,
                                            boxShadow: theme.shadows[3]
                                        },
                                        '&:focus-within': {
                                            backgroundColor: theme.palette.background.default,
                                            border: `1px solid ${theme.palette.secondary.main}70`,
                                            boxShadow: theme.shadows[3]
                                        }
                                    }}
                                />
                            </Box>

                            {/* CTA Block - Create Buttons */}
                            <Box sx={createStyles(theme).ctaBlock}>
                                <Tooltip title="Create a new AI Module to share interactive content with your students">
                                    <Button
                                        variant="contained"
                                        startIcon={<Plus size={20} />}
                                        onClick={handleCreateClick}
                                        sx={{
                                            ...createStyles(theme).actionButton,
                                            backgroundColor: theme.palette.secondary.main,
                                            color: theme.palette.getContrastText(theme.palette.secondary.main),
                                            boxShadow: theme.shadows[2],
                                            border: 'none',
                                            '&:hover': {
                                                backgroundColor: theme.palette.secondary.main,
                                                boxShadow: theme.shadows[4],
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                        fullWidth
                                    >
                                        {isOverLimit() ? 'Upgrade Plan' : 'Create New Module'}
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Create a new Course to organize your modules into a structured learning path">
                                    <Button
                                        variant="outlined"
                                        startIcon={<BookOpen size={20} />}
                                        onClick={handleCreateCourse}
                                        sx={{
                                            ...createStyles(theme).actionButton,
                                            backgroundColor: theme.palette.background.paper,
                                            color: theme.palette.text.primary,
                                            borderColor: `${theme.palette.divider}50`,
                                            boxShadow: theme.shadows[1],
                                            '&:hover': {
                                                backgroundColor: theme.palette.background.default,
                                                borderColor: theme.palette.secondary.main,
                                                boxShadow: theme.shadows[3],
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                        fullWidth
                                    >
                                        Create New Course
                                    </Button>
                                </Tooltip>
                            </Box>

                            {/* Visual divider with sepia effect */}
                            <Box sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '50%',
                                height: '2px',
                                background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.main}70, transparent)`,
                                boxShadow: `0 0 5px ${theme.palette.secondary.main}30`
                            }} />
                        </Box>

                        {/* Main Content Area */}
                        <Box>
                            {/* Enrolled Courses Section */}
                            <Box sx={createStyles(theme).sectionContainer}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h5" sx={createStyles(theme).sectionHeader}>
                                        <BookOpen size={24} style={{ color: theme.palette.secondary.main, filter: `drop-shadow(0 0 5px ${theme.palette.secondary.main}50)` }} />
                                        Enrolled Courses
                                    </Typography>
                                    <IconButton
                                        onClick={() => setEnrolledCoursesExpanded(!enrolledCoursesExpanded)}
                                        sx={{ color: theme.palette.secondary.main }}
                                    >
                                        {enrolledCoursesExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </IconButton>
                                </Box>

                                <Collapse in={enrolledCoursesExpanded} timeout="auto" unmountOnExit>
                                    {enrolledCourses.length === 0 ? (
                                        <Box sx={{
                                            p: 4,
                                            textAlign: 'center',
                                            backgroundColor: theme.palette.background.default + '50',
                                            borderRadius: '12px',
                                            border: `1px dashed ${theme.palette.divider}`
                                        }}>
                                            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                                                You're not enrolled in any courses yet.
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                startIcon={<BookOpen size={20} />}
                                                onClick={() => navigate('/marketplace')}
                                                sx={createStyles(theme).actionButton}
                                            >
                                                Browse Courses
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Box>
                                            {enrolledCourses.map(course => (
                                                <Box
                                                    key={course.id}
                                                    sx={{
                                                        ...createStyles(theme).courseCard,
                                                        // Add a subtle indicator that these are enrolled courses
                                                        borderLeft: `4px solid ${theme.palette.secondary.main}70`,
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                        <Box>
                                                            <Typography
                                                                variant="h6"
                                                                sx={{
                                                                    color: theme.palette.text.primary,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    fontFamily: theme.typography.h6.fontFamily,
                                                                }}
                                                            >
                                                                {course.name}
                                                                {course.enrollment.has_premium_access && (
                                                                    <Chip
                                                                        size="small"
                                                                        label="Premium"
                                                                        sx={{
                                                                            ml: 1,
                                                                            bgcolor: `${theme.palette.secondary.main}20`,
                                                                            color: theme.palette.secondary.main,
                                                                            border: `1px solid ${theme.palette.secondary.main}40`,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    />
                                                                )}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                                    Progress:
                                                                </Typography>
                                                                <Box sx={{ flex: 1, maxWidth: 200 }}>
                                                                    <LinearProgress
                                                                        variant="determinate"
                                                                        value={course.enrollment.progress}
                                                                        sx={{
                                                                            height: 8,
                                                                            borderRadius: 4,
                                                                            bgcolor: `${theme.palette.background.default}90`,
                                                                            '& .MuiLinearProgress-bar': {
                                                                                bgcolor: theme.palette.secondary.main,
                                                                                borderRadius: 4,
                                                                            }
                                                                        }}
                                                                    />
                                                                </Box>
                                                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                                    {Math.round(course.enrollment.progress)}%
                                                                </Typography>
                                                            </Box>
                                                            <Typography variant="caption" sx={{ color: theme.palette.text.disabled, display: 'block', mt: 0.5 }}>
                                                                Last accessed: {
                                                                    course.enrollment.last_accessed_at
                                                                        ? new Date(course.enrollment.last_accessed_at).toLocaleDateString()
                                                                        : 'Never'
                                                                }
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Tooltip title="View Course">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => navigate(`/c/${course.public_id}`)}
                                                                    sx={{
                                                                        color: theme.palette.text.disabled,
                                                                        '&:hover': { color: theme.palette.secondary.main, backgroundColor: `${theme.palette.secondary.main}10` }
                                                                    }}
                                                                >
                                                                    <ExternalLink size={18} />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Unenroll">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleUnenrollClick(course);
                                                                    }}
                                                                    sx={{
                                                                        color: theme.palette.text.disabled,
                                                                        '&:hover': { color: theme.palette.error.main, backgroundColor: 'rgba(255, 75, 75, 0.1)' }
                                                                    }}
                                                                >
                                                                    <LogOut size={18} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </Box>

                                                    {/* Module List */}
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        mb: 2,
                                                        borderBottom: `1px solid ${theme.palette.divider}20`,
                                                        pb: 2
                                                    }}>
                                                        <Typography variant="subtitle2" sx={{
                                                            color: theme.palette.text.secondary,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                            fontFamily: theme.typography.h5.fontFamily
                                                        }}>
                                                            <GraduationCap size={16} style={{ color: theme.palette.secondary.main }} />
                                                            Modules in this Course
                                                        </Typography>
                                                    </Box>

                                                    {/* Course Modules */}
                                                    {course.modules && course.modules.length > 0 ? (
                                                        <Box sx={{ pl: 1 }}>
                                                            {/* Sort modules by position before mapping */}
                                                            {[...course.modules]
                                                                .sort((a, b) => a.position - b.position)
                                                                .map((module, index) => (
                                                                    <Box
                                                                        key={module.id}
                                                                        sx={{
                                                                            display: 'flex',
                                                                            justifyContent: 'space-between',
                                                                            alignItems: 'center',
                                                                            mb: 1,
                                                                            py: 1,
                                                                            px: 1,
                                                                            borderRadius: '4px',
                                                                            cursor: 'pointer',
                                                                            '&:hover': { backgroundColor: `${theme.palette.background.paper}80` }
                                                                        }}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            navigate(`/viewBridge/${module.brdge_id}-${module.brdge?.public_id?.substring(0, 6) || module.public_id?.substring(0, 6) || ''}`);
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            variant="body2"
                                                                            sx={{
                                                                                color: theme.palette.text.secondary,
                                                                                display: 'flex',
                                                                                alignItems: 'center'
                                                                            }}
                                                                        >
                                                                            {index + 1}. {module.brdge?.name || module.name}
                                                                            {module.access_level === 'premium' && !course.enrollment.has_premium_access ? (
                                                                                <Tooltip title="Premium Module - Requires Premium Access">
                                                                                    <Box sx={{ display: 'inline-flex', ml: 1 }}>
                                                                                        <Lock size={14} color={theme.palette.error.light} />
                                                                                    </Box>
                                                                                </Tooltip>
                                                                            ) : null}
                                                                        </Typography>

                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                navigate(`/viewBridge/${module.brdge_id}-${module.brdge?.public_id?.substring(0, 6) || module.public_id?.substring(0, 6) || ''}`);
                                                                            }}
                                                                            sx={{
                                                                                color: theme.palette.text.secondary,
                                                                                padding: '4px',
                                                                                '&:hover': { color: theme.palette.secondary.main, backgroundColor: `${theme.palette.secondary.main}10` }
                                                                            }}
                                                                        >
                                                                            <BookOpen size={16} />
                                                                        </IconButton>
                                                                    </Box>
                                                                ))}
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{
                                                            p: 3,
                                                            textAlign: 'center',
                                                            backgroundColor: theme.palette.background.default + '50',
                                                            borderRadius: '8px',
                                                            border: `1px dashed ${theme.palette.divider}20`
                                                        }}>
                                                            <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>
                                                                No modules available in this course
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </Collapse>
                            </Box>

                            {/* Your Courses Section */}
                            <Box sx={createStyles(theme).sectionContainer}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h5" sx={createStyles(theme).sectionHeader}>
                                        <BookOpen size={24} style={{ color: theme.palette.secondary.main, filter: `drop-shadow(0 0 5px ${theme.palette.secondary.main}50)` }} />
                                        Your Courses
                                    </Typography>
                                    <IconButton
                                        onClick={() => setYourCoursesExpanded(!yourCoursesExpanded)}
                                        sx={{ color: theme.palette.secondary.main }}
                                    >
                                        {yourCoursesExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </IconButton>
                                </Box>

                                <Collapse in={yourCoursesExpanded} timeout="auto" unmountOnExit>
                                    {courses.length === 0 ? (
                                        <Box sx={{
                                            p: 4,
                                            textAlign: 'center',
                                            backgroundColor: theme.palette.background.default + '50',
                                            borderRadius: '12px',
                                            border: `1px dashed ${theme.palette.divider}`
                                        }}>
                                            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                                                You haven't created any courses yet.
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                startIcon={<BookOpen size={20} />}
                                                onClick={() => navigate('/create-course')}
                                                sx={createStyles(theme).actionButton}
                                            >
                                                Create Your First Course
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Box>
                                            {courses.map(course => (
                                                <Box
                                                    key={course.id}
                                                    id={`course-${course.id}`}  // Add this ID attribute
                                                    sx={{
                                                        ...createStyles(theme).courseCard,
                                                        borderColor: dropTargetCourseId === course.id ? theme.palette.secondary.main : `${theme.palette.divider}50`,
                                                        boxShadow: dropTargetCourseId === course.id ? `0 0 20px ${theme.palette.secondary.main}40` : undefined,
                                                    }}
                                                    onDragOver={(e) => handleDragOver(e, course.id)}
                                                    onDrop={(e) => handleDrop(e, course.id)}
                                                    onDragLeave={() => setDropTargetCourseId(null)}
                                                >
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                        <Box>
                                                            {editingCourseId === course.id ? (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                                    <TextField
                                                                        value={editedCourseName}
                                                                        onChange={handleCourseNameChange}
                                                                        autoFocus
                                                                        variant="outlined"
                                                                        size="small"
                                                                        sx={{
                                                                            '& .MuiOutlinedInput-root': {
                                                                                color: theme.palette.text.primary,
                                                                                backgroundColor: theme.palette.background.paper,
                                                                                '& fieldset': {
                                                                                    borderColor: `${theme.palette.divider}50`,
                                                                                },
                                                                                '&:hover fieldset': {
                                                                                    borderColor: `${theme.palette.divider}70`,
                                                                                },
                                                                                '&.Mui-focused fieldset': {
                                                                                    borderColor: theme.palette.secondary.main,
                                                                                },
                                                                            },
                                                                        }}
                                                                        InputProps={{
                                                                            endAdornment: (
                                                                                <InputAdornment position="end">
                                                                                    <IconButton
                                                                                        size="small"
                                                                                        onClick={() => handleSaveCourseName(course.id)}
                                                                                        sx={{ color: theme.palette.secondary.main }}
                                                                                    >
                                                                                        <Check size={16} />
                                                                                    </IconButton>
                                                                                    <IconButton
                                                                                        size="small"
                                                                                        onClick={handleCancelEditingCourse}
                                                                                        sx={{ color: theme.palette.text.disabled }}
                                                                                    >
                                                                                        <Trash2 size={16} />
                                                                                    </IconButton>
                                                                                </InputAdornment>
                                                                            ),
                                                                        }}
                                                                        onKeyPress={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                handleSaveCourseName(course.id);
                                                                            }
                                                                        }}
                                                                    />
                                                                </Box>
                                                            ) : (
                                                                <Typography
                                                                    variant="h6"
                                                                    sx={{
                                                                        color: theme.palette.text.primary,
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        cursor: 'pointer',
                                                                        fontFamily: theme.typography.h6.fontFamily,
                                                                        '&:hover': {
                                                                            textDecoration: 'underline',
                                                                            textDecorationColor: `${theme.palette.secondary.main}50`,
                                                                        }
                                                                    }}
                                                                    onClick={(e) => handleStartEditingCourse(e, course)}
                                                                >
                                                                    {course.name}
                                                                </Typography>
                                                            )}
                                                            <Typography variant="body2" sx={{ color: theme.palette.text.disabled, mt: 0.5 }}>
                                                                {course.modules?.length || 0} modules | Last updated: {
                                                                    course.updated_at ? new Date(course.updated_at).toLocaleDateString() : 'N/A'
                                                                }
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Tooltip title="View Course">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleViewCourse(course);
                                                                    }}
                                                                    sx={{
                                                                        color: theme.palette.text.disabled,
                                                                        '&:hover': { color: theme.palette.secondary.main, backgroundColor: `${theme.palette.secondary.main}10` }
                                                                    }}
                                                                >
                                                                    <BookOpen size={18} />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Edit Course">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEditCourse(course);
                                                                    }}
                                                                    sx={{
                                                                        color: theme.palette.text.disabled,
                                                                        '&:hover': { color: theme.palette.secondary.main, backgroundColor: `${theme.palette.secondary.main}10` }
                                                                    }}
                                                                >
                                                                    <Edit size={18} />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title={course.shareable ? "Course is public - Click to manage sharing" : "Course is private - Click to make shareable"}>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleShareCourse(course);
                                                                    }}
                                                                    sx={{
                                                                        color: course.shareable ? theme.palette.secondary.main : theme.palette.text.disabled,
                                                                        '&:hover': { color: theme.palette.secondary.main, backgroundColor: `${theme.palette.secondary.main}10` }
                                                                    }}
                                                                >
                                                                    {course.shareable ?
                                                                        <Globe size={18} style={{ filter: `drop-shadow(0 0 5px ${theme.palette.secondary.main}50)` }} /> :
                                                                        <Lock size={18} />
                                                                    }
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete Course">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteCourse(course);
                                                                    }}
                                                                    sx={{
                                                                        color: theme.palette.text.disabled,
                                                                        '&:hover': { color: theme.palette.error.main, backgroundColor: 'rgba(255, 75, 75, 0.1)' }
                                                                    }}
                                                                >
                                                                    <Trash2 size={18} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </Box>

                                                    {/* Module Management Section */}
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        mb: 2,
                                                        borderBottom: `1px solid ${theme.palette.divider}20`,
                                                        pb: 2
                                                    }}>
                                                        <Typography variant="subtitle2" sx={{
                                                            color: theme.palette.text.secondary,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                            fontFamily: theme.typography.h5.fontFamily
                                                        }}>
                                                            <GraduationCap size={16} style={{ color: theme.palette.secondary.main }} />
                                                            Modules in this Course
                                                        </Typography>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<Plus size={14} />}
                                                            onClick={() => handleOpenModuleSelection(course)}
                                                            sx={{
                                                                color: theme.palette.secondary.main,
                                                                borderColor: `${theme.palette.divider}40`,
                                                                '&:hover': {
                                                                    backgroundColor: `${theme.palette.divider}10`,
                                                                    borderColor: theme.palette.secondary.main,
                                                                }
                                                            }}
                                                        >
                                                            Add Module
                                                        </Button>
                                                    </Box>

                                                    {/* Modules Used in Course */}
                                                    {course.modules && course.modules.length > 0 ? (
                                                        <Box sx={{ pl: 1 }}>
                                                            {course.modules.map((module, index) => (
                                                                <DraggableModuleItem
                                                                    key={module.id}
                                                                    module={module}
                                                                    index={index}
                                                                    courseId={course.id}
                                                                    handleEdit={handleEdit}
                                                                    handleView={handleView}
                                                                    handleRemoveModuleFromCourse={handleRemoveModuleFromCourse}
                                                                    moveModule={moveModule}
                                                                />
                                                            ))}
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{
                                                            p: 3,
                                                            textAlign: 'center',
                                                            backgroundColor: theme.palette.background.default + '50',
                                                            borderRadius: '8px',
                                                            border: `1px dashed ${theme.palette.divider}20`
                                                        }}>
                                                            <Typography variant="body2" sx={{ color: theme.palette.text.disabled, mb: 1 }}>
                                                                No modules in this course yet
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: theme.palette.text.disabled, display: 'block' }}>
                                                                Click "Add Module" or drag modules here
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </Collapse>
                            </Box>

                            {/* Your AI Modules Section */}
                            <Box sx={createStyles(theme).sectionContainer}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h5" sx={createStyles(theme).sectionHeader}>
                                        <GraduationCap size={24} style={{ color: theme.palette.secondary.main, filter: `drop-shadow(0 0 5px ${theme.palette.secondary.main}50)` }} />
                                        Your AI Modules
                                    </Typography>
                                    <IconButton
                                        onClick={() => setAiModulesExpanded(!aiModulesExpanded)}
                                        sx={{ color: theme.palette.secondary.main }}
                                    >
                                        {aiModulesExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </IconButton>
                                </Box>

                                <Collapse in={aiModulesExpanded} timeout="auto" unmountOnExit>
                                    {brdges.length === 0 ? (
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            py: 10,
                                            px: 4,
                                            textAlign: 'center',
                                            backgroundColor: theme.palette.background.default + '70',
                                            borderRadius: '16px',
                                            border: `1px solid ${theme.palette.divider}20`,
                                            backdropFilter: 'blur(10px)'
                                        }}>
                                            <Box sx={{
                                                width: 80,
                                                height: 80,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '50%',
                                                backgroundColor: `${theme.palette.secondary.main}10`,
                                                boxShadow: `0 0 20px ${theme.palette.secondary.main}20`,
                                                mb: 3
                                            }}>
                                                <GraduationCap size={40} style={{ color: theme.palette.secondary.main }} />
                                            </Box>

                                            <Typography variant="h4" sx={{
                                                color: theme.palette.text.primary,
                                                fontWeight: 600,
                                                mb: 2,
                                                fontFamily: theme.typography.h4.fontFamily
                                            }}>
                                                Create Your First AI Module
                                            </Typography>

                                            <Typography variant="body1" sx={{
                                                color: theme.palette.text.secondary,
                                                mb: 4,
                                                maxWidth: 600
                                            }}>
                                                Transform your course content into an interactive learning experience with personalized AI teaching assistants for your students.
                                            </Typography>

                                            <Button
                                                variant="contained"
                                                startIcon={<Plus size={20} />}
                                                onClick={handleCreateClick}
                                                disabled={!canCreateBrdge()}
                                                sx={{
                                                    backgroundColor: theme.palette.text.primary,
                                                    color: theme.palette.background.paper,
                                                    borderRadius: '12px',
                                                    px: 4,
                                                    py: 1.5,
                                                    border: 'none',
                                                    boxShadow: theme.shadows[3],
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.text.secondary,
                                                        boxShadow: theme.shadows[4],
                                                        transform: 'translateY(-2px)'
                                                    },
                                                    '&.Mui-disabled': {
                                                        backgroundColor: `${theme.palette.text.disabled}30`,
                                                        color: theme.palette.text.disabled
                                                    }
                                                }}
                                            >
                                                Create New Module
                                            </Button>

                                            {!canCreateBrdge() && (
                                                <Typography variant="caption" sx={{
                                                    color: theme.palette.text.disabled,
                                                    mt: 2
                                                }}>
                                                    You've reached your modules limit. Upgrade your plan for more!
                                                </Typography>
                                            )}
                                        </Box>
                                    ) : (
                                        <Box sx={createStyles(theme).listContainer}>
                                            <BrdgeList
                                                brdges={filteredBrdges}
                                                onView={handleView}
                                                onEdit={handleEdit}
                                                onShare={handleShare}
                                                onDelete={handleDelete}
                                                orderBy={orderBy}
                                                orderDirection={orderDirection}
                                                onSort={handleSort}
                                                stats={userStats}
                                                selectedModules={selectedModules}
                                                onModuleSelect={handleModuleSelect}
                                                onSelectAll={handleSelectAll}
                                                courses={courses}
                                                draggable={true}
                                                onDragStart={handleModuleDragStart}
                                                onDragEnd={handleModuleDragEnd}
                                            />
                                        </Box>
                                    )}
                                </Collapse>
                            </Box>

                            {/* Enhanced Marketplace Section - Collapsible with better visual treatment */}
                            <Box sx={createStyles(theme).marketplaceSection}>
                                {/* Add crumbled parchment edge effect to top/bottom */}
                                <Box sx={{
                                    position: 'absolute', top: 0, left: '10%', right: '10%', height: '8px',
                                    backgroundImage: `url(${theme.textures.crumbledParchment})`, backgroundSize: 'auto 100%', backgroundRepeat: 'repeat-x',
                                    mask: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)', opacity: 0.3, zIndex: 2
                                }} />
                                <Box sx={{
                                    position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '8px',
                                    backgroundImage: `url(${theme.textures.crumbledParchment})`, backgroundSize: 'auto 100%', backgroundRepeat: 'repeat-x',
                                    mask: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)', opacity: 0.3, zIndex: 2, transform: 'scaleY(-1)'
                                }} />

                                <Box sx={{
                                    ...createStyles(theme).marketplaceHeader,
                                    // Remove borderBottom here as it's added in the style definition
                                    // borderBottom: '1px solid rgba(34, 211, 238, 0.2)'
                                }}>
                                    <Typography variant="h5" sx={{
                                        ...createStyles(theme).sectionHeader,
                                        mb: 0, // Remove bottom margin from header title
                                        '&::before': {
                                            display: 'none' // Remove the side indicator for marketplace
                                        }
                                    }}>
                                        {/* Use secondary color for the icon */}
                                        <BookOpen size={24} style={{ color: theme.palette.secondary.main, filter: `drop-shadow(0 0 5px ${theme.palette.secondary.main}50)` }} />
                                        AI Course Marketplace
                                    </Typography>
                                    <Button
                                        variant="text"
                                        sx={{
                                            color: theme.palette.secondary.main, // Use secondary color
                                            textTransform: 'none',
                                            backgroundColor: `${theme.palette.secondary.main}08`, // Subtle secondary background
                                            borderRadius: '20px',
                                            border: `1px solid ${theme.palette.secondary.main}30`, // Secondary border
                                            px: 2,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: `${theme.palette.secondary.main}15`,
                                                boxShadow: `0 0 10px ${theme.palette.secondary.main}20`,
                                                border: `1px solid ${theme.palette.secondary.main}40`,
                                            }
                                        }}
                                        onClick={() => navigate('/marketplace')}
                                    >
                                        Browse Marketplace
                                    </Button>
                                </Box>

                                {/* Replace the Collapse component with a regular Box */}
                                <Box sx={{ px: 3, pt: 3 }}>
                                    <Typography variant="subtitle1" sx={{
                                        color: theme.palette.text.primary,
                                        mb: 2,
                                        // Use secondary color for text shadow
                                        textShadow: `0 0 5px ${theme.palette.secondary.main}40`
                                    }}>
                                        Popular Courses & Templates
                                    </Typography>

                                    {/* The rest of the marketplace content stays the same */}
                                    <Box sx={{
                                        ...createStyles(theme).marketplaceGrid,
                                        gap: 3,
                                    }}>
                                        {marketplaceCourses.map((course) => (
                                            <Box
                                                key={course.id}
                                                sx={{
                                                    ...createStyles(theme).marketplaceCard,
                                                    p: 0,
                                                    borderRadius: '12px',
                                                    backgroundColor: theme.palette.background.default, // Use default background
                                                    border: `1px solid ${theme.palette.divider}50`, // Use divider
                                                    overflow: 'hidden',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-5px)',
                                                        boxShadow: `0 10px 25px rgba(0, 0, 0, 0.15), 0 0 15px ${theme.palette.secondary.main}20`, // Use secondary glow
                                                        borderColor: `${theme.palette.secondary.main}40`, // Use secondary border on hover
                                                    }
                                                }}
                                                onClick={() => handleViewCourse(course)}
                                            >
                                                {/* Thumbnail container with 16:9 aspect ratio */}
                                                <Box
                                                    sx={{
                                                        position: 'relative',
                                                        width: '100%',
                                                        paddingTop: '56.25%', // 16:9 aspect ratio
                                                        borderBottom: `1px solid ${theme.palette.divider}`,
                                                        backgroundColor: course.thumbnail_url
                                                            ? 'transparent'
                                                            : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    {course.thumbnail_url ? (
                                                        <>
                                                            <Box
                                                                component="img"
                                                                src={normalizeThumbnailUrl(course.thumbnail_url)}
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover',
                                                                    objectPosition: 'center', // Center the content to avoid unintentional cropping
                                                                }}
                                                                alt={`Thumbnail for ${course.name}`}
                                                            />
                                                            {/* Overlay for better text visibility - Use theme colors */}
                                                            <Box
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    // Use a darker overlay, perhaps primary dark or similar
                                                                    background: `linear-gradient(135deg, ${theme.palette.background.paper}90 0%, ${theme.palette.background.paper}40 100%)`,
                                                                }}
                                                            />
                                                        </>
                                                    ) : (
                                                        <Box sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}>
                                                            <BookOpen size={36} color={theme.palette.secondary.main} style={{
                                                                filter: `drop-shadow(0 0 10px ${theme.palette.secondary.main}40)`
                                                            }} />
                                                        </Box>
                                                    )}

                                                    {/* Optional: Add a badge or label over the thumbnail */}
                                                    <Box sx={{
                                                        position: 'absolute',
                                                        top: 10,
                                                        left: 10,
                                                        backgroundColor: `${theme.palette.background.paper}C0`,
                                                        color: theme.palette.secondary.main, // Use secondary color
                                                        borderRadius: '4px',
                                                        padding: '2px 8px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'medium',
                                                        zIndex: 2,
                                                        border: `1px solid ${theme.palette.divider}`,
                                                    }}>
                                                        {course.modules?.length || 0} modules
                                                    </Box>
                                                </Box>

                                                <Box sx={{ p: 2 }}>
                                                    <Typography variant="h6" sx={{
                                                        color: theme.palette.text.primary,
                                                        mb: 1,
                                                        fontFamily: theme.typography.h6.fontFamily
                                                    }}>
                                                        {course.name}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                                                        {course.description ? (
                                                            course.description.length > 60
                                                                ? `${course.description.substring(0, 60)}...`
                                                                : course.description
                                                        ) : "Explore this interactive course"}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{
                                                        mt: 'auto',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        color: theme.palette.text.disabled
                                                    }}>
                                                        <User size={14} style={{ marginRight: '4px', color: theme.palette.secondary.main }} />
                                                        Created by: {course.created_by || 'Brdge AI Team'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}

                                        {/* If no public courses available */}
                                        {marketplaceCourses.length === 0 && (
                                            <Box sx={{
                                                gridColumn: '1 / -1',
                                                p: 4,
                                                textAlign: 'center',
                                                backgroundColor: `${theme.palette.background.default}50`,
                                                borderRadius: '12px',
                                                border: `1px dashed ${theme.palette.divider}`
                                            }}>
                                                <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                                                    No marketplace courses available yet.
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        {/* Add Batch Delete Confirmation Dialog */}
                        <Dialog
                            open={batchDeleteDialogOpen}
                            onClose={() => setBatchDeleteDialogOpen(false)}
                            sx={{
                                '& .MuiDialog-paper': {
                                    backgroundColor: theme.palette.background.paper,
                                    backdropFilter: 'blur(16px)',
                                    color: theme.palette.text.primary,
                                    borderRadius: '16px',
                                    minWidth: '400px',
                                    boxShadow: theme.shadows[4],
                                    overflow: 'hidden',
                                    border: `1px solid ${theme.palette.divider}`
                                },
                                '& .MuiBackdrop-root': {
                                    backdropFilter: 'blur(8px)'
                                }
                            }}
                        >
                            <DialogTitle sx={{
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                padding: '20px 24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -1,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '60%',
                                    height: '1px',
                                    background: `linear-gradient(90deg, transparent, ${theme.palette.error.main}50, transparent)`,
                                    boxShadow: `0 0 10px ${theme.palette.error.main}30`
                                }
                            }}>
                                <Box sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    backgroundColor: `${theme.palette.error.main}10`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: `0 0 15px ${theme.palette.error.main}20`
                                }}>
                                    <Trash2 size={20} color={theme.palette.error.main} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{
                                        color: theme.palette.error.main,
                                        fontWeight: 600,
                                        fontSize: '1.1rem'
                                    }}>
                                        Delete Multiple Modules
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        color: theme.palette.text.secondary,
                                        display: 'block',
                                        mt: 0.5
                                    }}>
                                        {selectedModules.length} module{selectedModules.length !== 1 ? 's' : ''} selected
                                    </Typography>
                                </Box>
                            </DialogTitle>
                            <DialogContent sx={{
                                padding: '24px',
                                backgroundColor: `${theme.palette.error.main}02`
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 2,
                                    p: 3,
                                    borderRadius: '12px',
                                    backgroundColor: `${theme.palette.error.main}05`,
                                    border: `1px solid ${theme.palette.error.main}10`
                                }}>
                                    <Box sx={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        backgroundColor: `${theme.palette.error.main}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        mt: 0.5
                                    }}>
                                        <Typography sx={{
                                            color: theme.palette.error.main,
                                            fontSize: '1rem',
                                            fontWeight: 600
                                        }}>!</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" sx={{
                                            color: theme.palette.text.primary,
                                            fontWeight: 500,
                                            mb: 1
                                        }}>
                                            Are you sure you want to delete these modules?
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: theme.palette.text.secondary,
                                            fontSize: '0.875rem',
                                            lineHeight: 1.6,
                                            mb: 1
                                        }}>
                                            This action cannot be undone. All selected modules will be permanently removed, including:
                                        </Typography>
                                        <Box component="ul" sx={{
                                            pl: 2,
                                            color: theme.palette.text.secondary,
                                            fontSize: '0.875rem',
                                            '& li': { mb: 0.5 }
                                        }}>
                                            <li>All module content and structure</li>
                                            <li>Student interactions and analytics</li>
                                            <li>References in any courses using these modules</li>
                                        </Box>
                                        <Typography variant="body2" sx={{
                                            color: theme.palette.error.main,
                                            fontWeight: 500,
                                            mt: 2
                                        }}>
                                            Modules used in courses will be removed from those courses.
                                        </Typography>
                                    </Box>
                                </Box>
                            </DialogContent>
                            <DialogActions sx={{
                                borderTop: `1px solid ${theme.palette.divider}`,
                                padding: '16px 24px',
                                gap: 2,
                                justifyContent: 'space-between',
                                backgroundColor: theme.palette.background.paper
                            }}>
                                <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
                                    Selected: {selectedModules.length} module{selectedModules.length !== 1 ? 's' : ''}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        onClick={() => setBatchDeleteDialogOpen(false)}
                                        sx={{
                                            color: theme.palette.text.secondary,
                                            px: 3,
                                            borderRadius: '8px',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                color: theme.palette.text.primary,
                                                backgroundColor: `${theme.palette.action.hover}`
                                            }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={confirmBatchDelete}
                                        sx={{
                                            backgroundColor: `${theme.palette.error.main}15`,
                                            color: theme.palette.error.main,
                                            borderRadius: '8px',
                                            px: 3,
                                            fontWeight: 600,
                                            border: `1px solid ${theme.palette.error.main}30`,
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                backgroundColor: `${theme.palette.error.main}25`,
                                                borderColor: `${theme.palette.error.main}50`,
                                                boxShadow: theme.shadows[2]
                                            }
                                        }}
                                    >
                                        Delete {selectedModules.length} Module{selectedModules.length !== 1 ? 's' : ''}
                                    </Button>
                                </Box>
                            </DialogActions>
                        </Dialog>

                        {/* Module Selection Dialog */}
                        <Dialog
                            open={moduleSelectionDialogOpen}
                            onClose={() => setModuleSelectionDialogOpen(false)}
                            maxWidth="md"
                            fullWidth
                            sx={{
                                '& .MuiDialog-paper': {
                                    backgroundColor: 'rgba(17, 25, 40, 0.95)',
                                    backdropFilter: 'blur(16px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '16px',
                                    color: 'white',
                                    boxShadow: '0 0 40px rgba(0,0,0,0.5)',
                                }
                            }}
                        >
                            <DialogTitle sx={{
                                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                                padding: '20px 24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <GraduationCap size={24} color="#22D3EE" />
                                    <Typography variant="h6">
                                        Add Modules to Course
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    p: 1,
                                    px: 2,
                                    borderRadius: '4px'
                                }}>
                                    {selectedCourse?.name}
                                </Typography>
                            </DialogTitle>
                            <DialogContent sx={{ padding: '24px' }}>
                                {/* Search Bar */}
                                <Box sx={{ position: 'relative', mb: 3 }}>
                                    <Search
                                        size={18}
                                        style={{
                                            position: 'absolute',
                                            left: 10,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'rgba(255,255,255,0.5)'
                                        }}
                                    />
                                    <InputBase
                                        placeholder="Search modules to add..."
                                        value={moduleSearchTerm}
                                        onChange={(e) => setModuleSearchTerm(e.target.value)}
                                        sx={{
                                            width: '100%',
                                            pl: 4,
                                            pr: 2,
                                            py: 1,
                                            borderRadius: '4px',
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            color: 'white',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,0.07)',
                                                border: '1px solid rgba(255,255,255,0.15)'
                                            },
                                            '&:focus-within': {
                                                backgroundColor: 'rgba(255,255,255,0.08)',
                                                border: '1px solid rgba(34,211,238,0.3)',
                                            }
                                        }}
                                    />
                                </Box>

                                {/* Modules List */}
                                <Box sx={{
                                    maxHeight: '400px',
                                    overflowY: 'auto',
                                    pr: 1,
                                    '&::-webkit-scrollbar': {
                                        width: '8px',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        borderRadius: '4px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        background: 'rgba(255, 255, 255, 0.15)',
                                        borderRadius: '4px',
                                        '&:hover': {
                                            background: 'rgba(255, 255, 255, 0.25)',
                                        }
                                    }
                                }}>
                                    {filteredModulesForSelection.length > 0 ? (
                                        filteredModulesForSelection.map((module) => (
                                            <Box
                                                key={module.id}
                                                sx={{
                                                    p: 2,
                                                    mb: 1,
                                                    borderRadius: '8px',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    transition: 'all 0.2s',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                                    }
                                                }}
                                                onClick={() => {
                                                    handleAddModuleToCourse(selectedCourse.id, module.id);
                                                    setModuleSelectionDialogOpen(false);
                                                }}
                                            >
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{
                                                        color: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1
                                                    }}>
                                                        {module.name}
                                                        {module.shareable ? (
                                                            <Globe size={14} color="#22D3EE" />
                                                        ) : (
                                                            <Lock size={14} color="rgba(255, 255, 255, 0.5)" />
                                                        )}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                        Created: {new Date(module.created_at).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'rgba(34, 211, 238, 0.1)',
                                                        color: '#22D3EE',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(34, 211, 238, 0.2)'
                                                        }
                                                    }}
                                                >
                                                    <Plus size={18} />
                                                </IconButton>
                                            </Box>
                                        ))
                                    ) : (
                                        <Box sx={{
                                            p: 4,
                                            textAlign: 'center',
                                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                            borderRadius: '8px',
                                            border: '1px dashed rgba(255, 255, 255, 0.2)'
                                        }}>
                                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                {moduleSearchTerm ?
                                                    'No matching modules found.' :
                                                    'No available modules to add.'
                                                }
                                            </Typography>
                                            {moduleSearchTerm && (
                                                <Button
                                                    variant="text"
                                                    sx={{
                                                        color: '#22D3EE',
                                                        mt: 1,
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(34, 211, 238, 0.08)'
                                                        }
                                                    }}
                                                    onClick={() => setModuleSearchTerm('')}
                                                >
                                                    Clear Search
                                                </Button>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            </DialogContent>
                            <DialogActions sx={{
                                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                                padding: '16px 24px',
                            }}>
                                <Button
                                    onClick={() => setModuleSelectionDialogOpen(false)}
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                        }
                                    }}
                                >
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Container>
                </Box>

                <InfoSidebar
                    isOpen={sidebarOpen} // Use the state variable instead of hardcoding to true
                    onToggle={() => setSidebarOpen(!sidebarOpen)} // Restore toggle functionality
                    userStats={userStats}
                    courses={courses}
                    navigate={navigate}
                />
            </Box>

            {/* Course Deletion Confirmation Dialog */}
            <Dialog
                open={deleteCourseDialogOpen}
                onClose={() => setDeleteCourseDialogOpen(false)}
                PaperProps={{ // Use PaperProps to style the dialog paper with theme
                    sx: {
                        backgroundColor: theme.palette.background.paper, // Parchment Dark bg
                        color: theme.palette.text.primary, // Ink color
                        borderRadius: 2, // Consistent rounding
                        boxShadow: theme.shadows[4], // Use theme shadow
                        border: `1px solid ${theme.palette.divider}`, // Sepia border
                        minWidth: { xs: '90%', sm: 400 },
                        overflow: 'hidden' // Keep overflow hidden
                    }
                }}
            // Optional: Style backdrop if needed, theme might handle this
            // sx={{
            //     '& .MuiBackdrop-root': {
            //         backdropFilter: 'blur(5px)', // Example blur
            //         backgroundColor: 'rgba(0,0,0,0.3)' // Example overlay color
            //     }
            // }}
            >
                <DialogTitle sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`, // Sepia divider
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    position: 'relative',
                    backgroundColor: theme.palette.background.default, // Slightly darker parchment for title
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -1,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60%',
                        height: '1px',
                        background: `linear-gradient(90deg, transparent, ${theme.palette.error.main}50, transparent)`, // Error color gradient
                        boxShadow: `0 0 10px ${theme.palette.error.main}30` // Error color shadow
                    }
                }}>
                    <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: `${theme.palette.error.main}10`, // Error tint bg
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 0 15px ${theme.palette.error.main}20` // Error tint shadow
                    }}>
                        <Trash2 size={20} color={theme.palette.error.main} /> {/* Error color icon */}
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{
                            color: theme.palette.error.main, // Error color text
                            fontWeight: 600,
                            fontSize: '1.1rem'
                        }}>
                            Delete Course
                        </Typography>
                        <Typography variant="caption" sx={{
                            color: theme.palette.text.secondary, // Ink faded
                            display: 'block',
                            mt: 0.5
                        }}>
                            "{courseToDelete?.name}"
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{
                    padding: '24px',
                    backgroundColor: `${theme.palette.error.main}05` // Very subtle error tint background
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        p: 3,
                        borderRadius: '12px',
                        backgroundColor: `${theme.palette.error.main}08`, // Error tint background
                        border: `1px solid ${theme.palette.error.main}15` // Error tint border
                    }}>
                        <Box sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            backgroundColor: `${theme.palette.error.main}20`, // Error tint background for icon
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            mt: 0.5
                        }}>
                            <Typography sx={{
                                color: theme.palette.error.main, // Error color
                                fontSize: '1rem',
                                fontWeight: 600
                            }}>!</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body1" sx={{
                                color: theme.palette.text.primary, // Ink
                                fontWeight: 500,
                                mb: 1
                            }}>
                                Are you sure you want to delete this course?
                            </Typography>
                            <Typography variant="body2" sx={{
                                color: theme.palette.text.secondary, // Ink Faded
                                fontSize: '0.875rem',
                                lineHeight: 1.6,
                                mb: 1
                            }}>
                                This will remove the course and its structure, but all your modules will remain available in your library.
                            </Typography>
                            <Typography variant="body2" sx={{
                                color: theme.palette.text.secondary, // Ink Faded
                                fontSize: '0.875rem',
                                backgroundColor: theme.palette.background.default, // Use default parchment for inner box
                                p: 1.5,
                                borderRadius: '6px',
                                border: `1px solid ${theme.palette.divider}50`, // Add subtle sepia border
                                mt: 2
                            }}>
                                <strong>Modules affected:</strong> {courseToDelete?.modules?.length || 0} module(s) will be removed from this course but will remain in your library.
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{
                    borderTop: `1px solid ${theme.palette.divider}`, // Sepia divider
                    padding: '16px 24px',
                    gap: 2,
                    justifyContent: 'space-between',
                    backgroundColor: theme.palette.background.paper // Parchment Dark bg for actions
                }}>
                    <Button
                        onClick={() => setDeleteCourseDialogOpen(false)}
                        sx={{
                            color: theme.palette.text.secondary, // Use theme text color
                            px: 3,
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                color: theme.palette.text.primary, // Ink on hover
                                backgroundColor: theme.palette.action.hover // Use theme hover action color
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDeleteCourse}
                        sx={{
                            backgroundColor: `${theme.palette.error.main}15`, // Error tint background
                            color: theme.palette.error.main, // Error color text
                            borderRadius: '8px',
                            px: 3,
                            fontWeight: 600,
                            border: `1px solid ${theme.palette.error.main}30`, // Error color border
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: `${theme.palette.error.main}25`, // Darker error tint on hover
                                borderColor: `${theme.palette.error.main}50`, // Stronger error border on hover
                                boxShadow: theme.shadows[2] // Use theme shadow
                            }
                        }}
                    >
                        Delete Course
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Share Module Dialog */}
            <Dialog
                open={shareDialogOpen}
                onClose={handleCloseShare}
                PaperProps={{
                    sx: {
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        borderRadius: 2,
                        boxShadow: theme.shadows[4],
                        border: `1px solid ${theme.palette.divider}`,
                        minWidth: { xs: '90%', sm: 400 },
                    }
                }}
            >
                <DialogTitle sx={{
                    bgcolor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontFamily: theme.typography.h6.fontFamily,
                    fontWeight: 'bold',
                    letterSpacing: '0.02em',
                    fontSize: '1.5rem'
                }}>
                    Share Module
                </DialogTitle>
                <DialogContent sx={{ p: 3, mt: 1 }}>
                    <Typography
                        variant="body1"
                        gutterBottom
                        sx={{
                            color: theme.palette.text.secondary,
                            fontSize: '1rem',
                            lineHeight: 1.6,
                            mb: 3
                        }}
                    >
                        {brdgeToShare?.shareable ?
                            "This module is currently public. Anyone with the link can view it." :
                            "This module is currently private. Only you can access it."}
                    </Typography>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={brdgeToShare?.shareable || false}
                                onChange={handleShareToggle}
                                color="secondary"
                            />
                        }
                        label={
                            <Typography sx={{
                                color: theme.palette.text.primary,
                                fontSize: '1rem',
                                fontWeight: 500
                            }}>
                                Public Module
                            </Typography>
                        }
                        sx={{
                            my: 1.5,
                            display: 'block',
                            '& .MuiFormControlLabel-label': {
                                color: theme.palette.text.primary
                            }
                        }}
                    />

                    {brdgeToShare?.shareable && (
                        <Box sx={{ mt: 3 }}>
                            <Typography
                                variant="body2"
                                gutterBottom
                                sx={{
                                    color: theme.palette.text.secondary,
                                    mb: 1
                                }}
                            >
                                Share this link:
                            </Typography>
                            <TextField
                                fullWidth
                                value={`${window.location.origin}/viewBridge/${brdgeToShare?.id}-${brdgeToShare?.public_id.substring(0, 6)}`}
                                InputProps={{
                                    readOnly: true,
                                    sx: {
                                        color: theme.palette.text.primary,
                                        bgcolor: theme.palette.background.default,
                                        '& .MuiInputBase-input': {
                                            color: theme.palette.text.primary,
                                        }
                                    },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleCopyLink}
                                                edge="end"
                                                sx={{ color: linkCopied ? '#4CAF50' : theme.palette.secondary.main }}
                                            >
                                                {linkCopied ? <Check size={18} /> : <Copy size={18} />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                variant="outlined"
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: `${theme.palette.secondary.main}50` },
                                        '&:hover fieldset': { borderColor: theme.palette.secondary.main },
                                    }
                                }}
                            />
                            <Typography
                                variant="caption"
                                sx={{
                                    display: 'block',
                                    mt: 1,
                                    color: linkCopied ? '#4CAF50' : theme.palette.text.disabled,
                                    transition: 'color 0.3s ease'
                                }}
                            >
                                {linkCopied ? '✓ Link copied to clipboard!' : 'Click the copy icon to copy the link'}
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{
                        mt: 3,
                        p: 2,
                        bgcolor: `${theme.palette.background.default}80`,
                        borderRadius: '8px',
                        border: `1px solid ${theme.palette.secondary.main}20`
                    }}>
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                            <strong>Module:</strong> {brdgeToShare?.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.disabled, display: 'block', mt: 1 }}>
                            When shared, others can view this module's content and interact with it.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleCloseShare}
                        variant="outlined"
                        sx={{
                            color: theme.palette.secondary.main,
                            borderColor: `${theme.palette.secondary.main}50`,
                            '&:hover': {
                                borderColor: theme.palette.secondary.main,
                                backgroundColor: `${theme.palette.secondary.main}10`
                            }
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Course Share Dialog - Add this after the Share Module Dialog */}
            <Dialog
                open={shareCourseDialogOpen}
                onClose={handleCloseCourseShare}
                PaperProps={{ // Apply theme styling
                    sx: {
                        bgcolor: theme.palette.background.paper, // Parchment Dark bg
                        color: theme.palette.text.primary, // Ink color
                        borderRadius: 2,
                        boxShadow: theme.shadows[4],
                        border: `1px solid ${theme.palette.divider}`, // Sepia border
                        minWidth: { xs: '90%', sm: 400 },
                    }
                }}
            >
                <DialogTitle sx={{
                    bgcolor: theme.palette.background.default, // Slightly darker parchment for title
                    color: theme.palette.text.primary, // Ink
                    borderBottom: `1px solid ${theme.palette.divider}`, // Sepia divider
                    fontFamily: theme.typography.h6.fontFamily,
                    fontWeight: 'bold',
                    letterSpacing: '0.02em',
                    fontSize: '1.5rem'
                }}>
                    Share Course
                </DialogTitle>
                <DialogContent sx={{ p: 3, mt: 1 }}>
                    <Typography
                        variant="body1"
                        gutterBottom
                        sx={{
                            color: theme.palette.text.secondary, // Ink Faded
                            fontSize: '1rem',
                            lineHeight: 1.6,
                            mb: 3
                        }}
                    >
                        {courseToShare?.shareable ?
                            "This course is currently public. Anyone with the link can view it." :
                            "This course is currently private. Only you can access it."}
                    </Typography>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={courseToShare?.shareable || false}
                                onChange={handleCourseShareToggle}
                                color="secondary" // Use theme's secondary color for switch
                            />
                        }
                        label={
                            <Typography sx={{
                                color: theme.palette.text.primary, // Ink
                                fontSize: '1rem',
                                fontWeight: 500
                            }}>
                                Public Course
                            </Typography>
                        }
                        sx={{
                            my: 1.5,
                            display: 'block',
                            '& .MuiFormControlLabel-label': {
                                color: theme.palette.text.primary // Ensure label color matches
                            }
                        }}
                    />

                    {courseToShare?.shareable && (
                        <Box sx={{ mt: 3 }}>
                            <Typography
                                variant="body2"
                                gutterBottom
                                sx={{
                                    color: theme.palette.text.secondary, // Ink Faded
                                    mb: 1
                                }}
                            >
                                Share this link:
                            </Typography>
                            <TextField
                                fullWidth
                                value={`${window.location.origin}/c/${courseToShare?.public_id}`}
                                InputProps={{
                                    readOnly: true,
                                    sx: {
                                        color: theme.palette.text.primary, // Ink
                                        bgcolor: theme.palette.background.default, // Use theme default background
                                        '& .MuiInputBase-input': { // Ensure input text uses theme color
                                            color: theme.palette.text.primary,
                                        }
                                    },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleCopyCourseLink}
                                                edge="end"
                                                sx={{ color: courseLinkCopied ? theme.palette.success.main : theme.palette.secondary.main }} // Use theme success and secondary colors
                                            >
                                                {courseLinkCopied ? <Check size={18} /> : <Copy size={18} />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                variant="outlined"
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: `${theme.palette.secondary.main}50` }, // Use theme secondary border
                                        '&:hover fieldset': { borderColor: theme.palette.secondary.main }, // Use stronger theme secondary border on hover
                                    }
                                }}
                            />
                            <Typography
                                variant="caption"
                                sx={{
                                    display: 'block',
                                    mt: 1,
                                    color: courseLinkCopied ? theme.palette.success.main : theme.palette.text.disabled, // Use theme success and disabled colors
                                    transition: 'color 0.3s ease'
                                }}
                            >
                                {courseLinkCopied ? '✓ Link copied to clipboard!' : 'Click the copy icon to copy the link'}
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{
                        mt: 3,
                        p: 2,
                        bgcolor: `${theme.palette.secondary.main}08`, // Sepia tint background
                        borderRadius: '8px',
                        border: `1px solid ${theme.palette.secondary.main}15` // Sepia tint border
                    }}>
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}> {/* Ink */}
                            <strong>Course:</strong> {courseToShare?.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mt: 1 }}> {/* Ink Faded */}
                            When shared, others can view this course, individual module access is controlled within the course edit page.
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AutoStoriesIcon sx={{ color: theme.palette.secondary.main, fontSize: 16 }} /> {/* Use Sepia color for icon */}
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}> {/* Ink Faded */}
                                {courseToShare?.modules?.length || 0} module(s) in this course
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleCloseCourseShare}
                        variant="outlined"
                        sx={{ // Use theme secondary button style
                            color: theme.palette.secondary.main,
                            borderColor: `${theme.palette.secondary.main}50`,
                            '&:hover': {
                                borderColor: theme.palette.secondary.main,
                                backgroundColor: `${theme.palette.secondary.main}10`
                            }
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Unenroll Confirmation Dialog */}
            <Dialog
                open={unenrollDialogOpen}
                onClose={() => setUnenrollDialogOpen(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        borderRadius: 2,
                        boxShadow: theme.shadows[4],
                        border: `1px solid ${theme.palette.divider}`,
                        minWidth: { xs: '90%', sm: 400 },
                    }
                }}
            >
                <DialogTitle sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    position: 'relative',
                    backgroundColor: theme.palette.background.default,
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -1,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60%',
                        height: '1px',
                        background: `linear-gradient(90deg, transparent, ${theme.palette.error.main}50, transparent)`,
                        boxShadow: `0 0 10px ${theme.palette.error.main}30`
                    }
                }}>
                    <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: `${theme.palette.error.main}10`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 0 15px ${theme.palette.error.main}20`
                    }}>
                        <LogOut size={20} color={theme.palette.error.main} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{
                            color: theme.palette.error.main,
                            fontWeight: 600,
                            fontSize: '1.1rem'
                        }}>
                            Unenroll from Course
                        </Typography>
                        <Typography variant="caption" sx={{
                            color: theme.palette.text.secondary,
                            display: 'block',
                            mt: 0.5
                        }}>
                            "{courseToUnenroll?.name}"
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{
                    padding: '24px',
                    backgroundColor: `${theme.palette.error.main}05`
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        p: 3,
                        borderRadius: '12px',
                        backgroundColor: `${theme.palette.error.main}08`,
                        border: `1px solid ${theme.palette.error.main}15`
                    }}>
                        <Box sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            backgroundColor: `${theme.palette.error.main}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            mt: 0.5
                        }}>
                            <Typography sx={{
                                color: theme.palette.error.main,
                                fontSize: '1rem',
                                fontWeight: 600
                            }}>!</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body1" sx={{
                                color: theme.palette.text.primary,
                                fontWeight: 500,
                                mb: 1
                            }}>
                                Are you sure you want to unenroll from this course?
                            </Typography>
                            <Typography variant="body2" sx={{
                                color: theme.palette.text.secondary,
                                fontSize: '0.875rem',
                                lineHeight: 1.6,
                                mb: 1
                            }}>
                                You will lose access to all course materials and your progress will be reset. You can enroll again later if you change your mind.
                            </Typography>
                            <Typography variant="body2" sx={{
                                color: theme.palette.error.main,
                                fontWeight: 500,
                                mt: 2
                            }}>
                                This action cannot be undone.
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{
                    borderTop: `1px solid ${theme.palette.divider}`,
                    padding: '16px 24px',
                    gap: 2,
                    justifyContent: 'space-between',
                    backgroundColor: theme.palette.background.paper
                }}>
                    <Button
                        onClick={() => setUnenrollDialogOpen(false)}
                        sx={{
                            color: theme.palette.text.secondary,
                            px: 3,
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                color: theme.palette.text.primary,
                                backgroundColor: theme.palette.action.hover
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmUnenroll}
                        sx={{
                            backgroundColor: `${theme.palette.error.main}15`,
                            color: theme.palette.error.main,
                            borderRadius: '8px',
                            px: 3,
                            fontWeight: 600,
                            border: `1px solid ${theme.palette.error.main}30`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: `${theme.palette.error.main}25`,
                                borderColor: `${theme.palette.error.main}50`,
                                boxShadow: theme.shadows[2]
                            }
                        }}
                    >
                        Unenroll
                    </Button>
                </DialogActions>
            </Dialog>

            {/* AI Module Deletion Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{ // Use PaperProps to style the dialog paper with theme
                    sx: {
                        backgroundColor: theme.palette.background.paper, // Parchment Dark bg
                        color: theme.palette.text.primary, // Ink color
                        borderRadius: 2, // Consistent rounding
                        boxShadow: theme.shadows[4], // Use theme shadow
                        border: `1px solid ${theme.palette.divider}`, // Sepia border
                        minWidth: { xs: '90%', sm: 400 },
                        overflow: 'hidden' // Keep overflow hidden
                    }
                }}
            >
                <DialogTitle sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`, // Sepia divider
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    position: 'relative',
                    backgroundColor: theme.palette.background.default, // Slightly darker parchment for title
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -1,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60%',
                        height: '1px',
                        background: `linear-gradient(90deg, transparent, ${theme.palette.error.main}50, transparent)`, // Error color gradient
                        boxShadow: `0 0 10px ${theme.palette.error.main}30` // Error color shadow
                    }
                }}>
                    <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: `${theme.palette.error.main}10`, // Error tint bg
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 0 15px ${theme.palette.error.main}20` // Error tint shadow
                    }}>
                        <Trash2 size={20} color={theme.palette.error.main} /> {/* Error color icon */}
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{
                            color: theme.palette.error.main, // Error color text
                            fontWeight: 600,
                            fontSize: '1.1rem'
                        }}>
                            Delete AI Module
                        </Typography>
                        <Typography variant="caption" sx={{
                            color: theme.palette.text.secondary, // Ink faded
                            display: 'block',
                            mt: 0.5
                        }}>
                            "{brdgeToDelete?.name}"
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{
                    padding: '24px',
                    backgroundColor: `${theme.palette.error.main}05` // Very subtle error tint background
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        p: 3,
                        borderRadius: '12px',
                        backgroundColor: `${theme.palette.error.main}08`, // Error tint background
                        border: `1px solid ${theme.palette.error.main}15` // Error tint border
                    }}>
                        <Box sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            backgroundColor: `${theme.palette.error.main}20`, // Error tint background for icon
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            mt: 0.5
                        }}>
                            <Typography sx={{
                                color: theme.palette.error.main, // Error color
                                fontSize: '1rem',
                                fontWeight: 600
                            }}>!</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body1" sx={{
                                color: theme.palette.text.primary, // Ink
                                fontWeight: 500,
                                mb: 1
                            }}>
                                Are you sure you want to delete this AI Module?
                            </Typography>
                            <Typography variant="body2" sx={{
                                color: theme.palette.text.secondary, // Ink Faded
                                fontSize: '0.875rem',
                                lineHeight: 1.6,
                                mb: 1
                            }}>
                                This action cannot be undone. Deleting this module will permanently remove:
                            </Typography>
                            <Box component="ul" sx={{
                                pl: 2,
                                color: theme.palette.text.secondary, // Ink Faded
                                fontSize: '0.875rem',
                                '& li': { mb: 0.5 }
                            }}>
                                <li>All module content, configuration, and AI knowledge.</li>
                                <li>Any associated voice clones created specifically for this module.</li>
                                <li>Recorded student interactions and analytics data.</li>
                                <li>It will also be removed from any courses it belongs to.</li>
                            </Box>
                            <Typography variant="body2" sx={{
                                color: theme.palette.error.main, // Error color text
                                fontWeight: 500,
                                mt: 2
                            }}>
                                This module will be permanently lost.
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{
                    borderTop: `1px solid ${theme.palette.divider}`, // Sepia divider
                    padding: '16px 24px',
                    gap: 2,
                    justifyContent: 'flex-end', // Align buttons to the right
                    backgroundColor: theme.palette.background.paper // Parchment Dark bg for actions
                }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)} // Use the correct state setter
                        sx={{
                            color: theme.palette.text.secondary, // Use theme text color
                            px: 3,
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                color: theme.palette.text.primary, // Ink on hover
                                backgroundColor: theme.palette.action.hover // Use theme hover action color
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDelete} // Call the existing confirmDelete function
                        sx={{
                            backgroundColor: `${theme.palette.error.main}15`, // Error tint background
                            color: theme.palette.error.main, // Error color text
                            borderRadius: '8px',
                            px: 3,
                            fontWeight: 600,
                            border: `1px solid ${theme.palette.error.main}30`, // Error color border
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: `${theme.palette.error.main}25`, // Darker error tint on hover
                                borderColor: `${theme.palette.error.main}50`, // Stronger error border on hover
                                boxShadow: theme.shadows[2] // Use theme shadow
                            }
                        }}
                    >
                        Delete Module
                    </Button>
                </DialogActions>
            </Dialog>
        </DndProvider>
    );
}

export default BrdgeListPage;
