import React, { useState } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Box,
    Tooltip,
    TableSortLabel,
    Menu,
    MenuItem,
    useTheme,
    useMediaQuery,
    Typography,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    InputAdornment,
    Fade,
    Divider,
    LinearProgress,
    Switch,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CircularProgress,
    Collapse
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import TwitterIcon from '@mui/icons-material/Twitter';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import TimelineIcon from '@mui/icons-material/Timeline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const BrdgeList = ({
    brdges,
    onView,
    onEdit,
    onShare,
    onDelete,
    orderBy,
    orderDirection,
    onSort,
    stats,
    expandedBrdge,
    setExpandedBrdge,
    conversationData,
    loadingConversations,
    onExpandBrdge
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [selectedBrdge, setSelectedBrdge] = useState(null);
    const [showCopySuccess, setShowCopySuccess] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleMenuOpen = (event, brdge) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedRow(brdge);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const columns = [
        {
            id: 'name',
            label: 'Name',
            sortable: true,
            width: '40%'
        },
        {
            id: 'status',
            label: 'Status',
            sortable: true,
            width: '30%'
        },
        {
            id: 'actions',
            label: 'Actions',
            sortable: false,
            width: '30%'
        }
    ];

    const handleAction = (action) => {
        handleMenuClose();
        switch (action) {
            case 'view':
                onView(selectedRow);
                break;
            case 'edit':
                onEdit(selectedRow);
                break;
            case 'share':
                handleShareClick(selectedRow);
                break;
            case 'delete':
                onDelete(selectedRow);
                break;
            default:
                break;
        }
    };

    const handleShareClick = (brdge, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setSelectedBrdge(brdge);
        setShareDialogOpen(true);
    };

    const handleCopyLink = () => {
        const shareableUrl = `${window.location.origin}/viewBrdge/${selectedBrdge.id}`;
        navigator.clipboard.writeText(shareableUrl);
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 3000);
    };

    const handleCloseShareDialog = () => {
        setShareDialogOpen(false);
        setSelectedBrdge(null);
    };

    const handleToggleShare = () => {
        onShare(selectedBrdge);
        handleCloseShareDialog();
    };

    const TableHeader = () => (
        <TableHead>
            <TableRow
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    '& th': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        letterSpacing: '0.02em',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        py: 2
                    }
                }}
            >
                {columns.map((column) => (
                    <TableCell
                        key={column.id}
                        sortDirection={orderBy === column.id ? orderDirection : false}
                        sx={{
                            '&:not(:last-child)': {
                                borderRight: '1px solid rgba(255, 255, 255, 0.05)'
                            }
                        }}
                    >
                        {column.sortable ? (
                            <TableSortLabel
                                active={orderBy === column.id}
                                direction={orderBy === column.id ? orderDirection : 'asc'}
                                onClick={() => onSort(column.id)}
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.7) !important',
                                    '& .MuiTableSortLabel-icon': {
                                        color: 'rgba(255, 255, 255, 0.3) !important'
                                    }
                                }}
                            >
                                {column.label}
                            </TableSortLabel>
                        ) : (
                            column.label
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );

    const StatusChip = ({ shareable }) => (
        <Chip
            icon={shareable ? <PublicIcon /> : <LockIcon />}
            label={shareable ? 'Public' : 'Private'}
            size="small"
            sx={{
                backgroundColor: shareable
                    ? 'rgba(79, 156, 249, 0.1)'
                    : 'rgba(255, 255, 255, 0.1)',
                color: shareable
                    ? '#4F9CF9'
                    : 'rgba(255, 255, 255, 0.7)',
                borderRadius: '12px',
                border: `1px solid ${shareable
                    ? 'rgba(79, 156, 249, 0.2)'
                    : 'rgba(255, 255, 255, 0.1)'}`,
                '& .MuiChip-icon': {
                    color: 'inherit'
                },
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    backgroundColor: shareable
                        ? 'rgba(79, 156, 249, 0.15)'
                        : 'rgba(255, 255, 255, 0.15)'
                }
            }}
        />
    );

    const ActionButtons = ({ brdge }) => (
        <Box sx={{
            display: 'flex',
            gap: 1,
            position: 'relative',
            zIndex: 20
        }}>
            <IconButton
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    onView(brdge);
                }}
                sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        color: '#4F9CF9',
                        backgroundColor: 'rgba(79, 156, 249, 0.1)',
                        transform: 'translateY(-2px)'
                    }
                }}
            >
                <VisibilityIcon fontSize="small" />
            </IconButton>
            <IconButton
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(brdge);
                }}
                sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        color: '#4F9CF9',
                        backgroundColor: 'rgba(79, 156, 249, 0.1)',
                        transform: 'translateY(-2px)'
                    }
                }}
            >
                <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
                size="small"
                onClick={(e) => handleShareClick(brdge, e)}
                sx={{
                    color: brdge.shareable ? '#4F9CF9' : 'rgba(255, 255, 255, 0.7)',
                    backgroundColor: brdge.shareable ? 'rgba(79, 156, 249, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    zIndex: 21,
                    '&:hover': {
                        color: '#4F9CF9',
                        backgroundColor: 'rgba(79, 156, 249, 0.15)',
                        transform: 'translateY(-2px)'
                    }
                }}
            >
                <ShareIcon fontSize="small" />
            </IconButton>
            <IconButton
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(brdge);
                }}
                sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        color: '#4F9CF9',
                        backgroundColor: 'rgba(79, 156, 249, 0.1)',
                        transform: 'translateY(-2px)'
                    }
                }}
            >
                <DeleteIcon fontSize="small" />
            </IconButton>
        </Box>
    );

    // Add mobile-optimized card view
    const MobileCard = ({ brdge }) => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Box
                sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    '&:active': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }
                }}
                onClick={() => onView(brdge)}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            color: '#4F9CF9',
                            fontWeight: 500,
                            fontSize: '1.1rem'
                        }}
                    >
                        {brdge.name}
                    </Typography>
                    <StatusChip shareable={brdge.shareable} />
                </Box>

                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    mt: 2
                }}>
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(brdge);
                        }}
                        size="small"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleShareClick(brdge, e);
                        }}
                        size="small"
                        sx={{
                            color: brdge.shareable ? '#4F9CF9' : 'rgba(255, 255, 255, 0.7)',
                            backgroundColor: brdge.shareable ? 'rgba(79, 156, 249, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }
                        }}
                    >
                        <ShareIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(brdge);
                        }}
                        size="small"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        </motion.div>
    );

    const ConversationMetrics = ({ brdgeId }) => {
        const data = conversationData[brdgeId] || {};
        const totalUsers = Object.keys(data).length;
        const totalInteractions = Object.values(data).reduce(
            (sum, user) => sum + user.totalInteractions,
            0
        );
        const averageInteractionsPerUser = totalUsers ? (totalInteractions / totalUsers).toFixed(1) : 0;

        return (
            <Box sx={{ p: 2, bgcolor: 'rgba(0, 41, 132, 0.1)', borderRadius: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonOutlineIcon sx={{ color: '#4F9CF9' }} />
                            <Box>
                                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">Total Users</Typography>
                                <Typography variant="h6" color="white">{totalUsers}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ChatBubbleOutlineIcon sx={{ color: '#4F9CF9' }} />
                            <Box>
                                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">Total Interactions</Typography>
                                <Typography variant="h6" color="white">{totalInteractions}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TimelineIcon sx={{ color: '#4F9CF9' }} />
                            <Box>
                                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">Avg. Interactions/User</Typography>
                                <Typography variant="h6" color="white">{averageInteractionsPerUser}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    const UserConversationList = ({ brdgeId }) => {
        const [expandedUser, setExpandedUser] = useState(null);
        const data = conversationData[brdgeId] || {};

        return (
            <Box sx={{ mt: 2 }}>
                {Object.entries(data).map(([userId, userData]) => (
                    <Accordion
                        key={userId}
                        expanded={expandedUser === userId}
                        onChange={() => setExpandedUser(expandedUser === userId ? null : userId)}
                        sx={{
                            bgcolor: 'rgba(0, 41, 132, 0.05)',
                            '&:before': { display: 'none' },
                            mb: 1,
                            color: 'white'
                        }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
                                        <PersonOutlineIcon fontSize="small" />
                                        {userData.isAnonymous ? 'Anonymous User' : `User ${userId}`}
                                        {userData.isAnonymous && (
                                            <Chip
                                                label="Anonymous"
                                                size="small"
                                                variant="outlined"
                                                sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.7)' }}
                                            />
                                        )}
                                    </Typography>
                                    <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                                        Last active: {new Date(userData.lastInteraction).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Tooltip title="Total Interactions">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'white' }}>
                                            <ChatBubbleOutlineIcon fontSize="small" />
                                            <Typography>{userData.totalInteractions}</Typography>
                                        </Box>
                                    </Tooltip>
                                    <Tooltip title="Unique Slides Viewed">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'white' }}>
                                            <TimelineIcon fontSize="small" />
                                            <Typography>{userData.uniqueSlides.size}</Typography>
                                        </Box>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{
                                maxHeight: '300px',
                                overflowY: 'auto',
                                p: 2,
                                bgcolor: 'rgba(0, 0, 0, 0.2)',
                                borderRadius: 1
                            }}>
                                {userData.messages.map((message, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            mb: 1,
                                            p: 1,
                                            borderLeft: '2px solid',
                                            borderColor: message.role === 'user' ? '#4F9CF9' : 'rgba(255, 255, 255, 0.3)',
                                            bgcolor: 'rgba(0, 0, 0, 0.2)',
                                            borderRadius: '4px',
                                            color: 'white'
                                        }}
                                    >
                                        <Typography variant="caption" color="rgba(255, 255, 255, 0.7)" display="block">
                                            {new Date(message.timestamp).toLocaleString()} - Slide {message.slide_number}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            {message.message}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        );
    };

    return (
        <Box sx={{ width: '100%', position: 'relative', zIndex: 1 }}>
            {/* Responsive list/table view */}
            <Box sx={{
                px: { xs: 2, sm: 0 },
                pb: { xs: 2, sm: 0 }
            }}>
                {useMediaQuery(theme.breakpoints.down('sm')) ? (
                    // Mobile card view
                    <AnimatePresence>
                        {brdges.map((brdge) => (
                            <MobileCard key={brdge.id} brdge={brdge} />
                        ))}
                    </AnimatePresence>
                ) : (
                    // Desktop table view - without dividers
                    <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                        <Table>
                            <TableHeader />
                            <TableBody>
                                {brdges.map((brdge) => (
                                    <React.Fragment key={brdge.id}>
                                        <TableRow
                                            hover
                                            onClick={() => onExpandBrdge(brdge.id)}
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.05) !important'
                                                },
                                                '& td': {
                                                    color: 'rgba(255, 255, 255, 0.9)',
                                                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                                                },
                                                position: 'relative',
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    left: 0,
                                                    width: '3px',
                                                    height: '100%',
                                                    backgroundColor: 'transparent',
                                                    transition: 'background-color 0.2s ease',
                                                },
                                                '&:hover::after': {
                                                    backgroundColor: '#4F9CF9',
                                                }
                                            }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            transition: 'transform 0.2s ease',
                                                            transform: expandedBrdge === brdge.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                                            color: expandedBrdge === brdge.id ? '#4F9CF9' : 'rgba(255, 255, 255, 0.5)',
                                                            '&:hover': {
                                                                color: '#4F9CF9'
                                                            }
                                                        }}
                                                    >
                                                        <KeyboardArrowDownIcon />
                                                    </IconButton>
                                                    <Typography
                                                        sx={{
                                                            color: expandedBrdge === brdge.id ? '#4F9CF9' : 'inherit',
                                                            transition: 'color 0.2s ease'
                                                        }}
                                                    >
                                                        {brdge.name}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <StatusChip shareable={brdge.shareable} />
                                            </TableCell>
                                            <TableCell>
                                                <ActionButtons brdge={brdge} />
                                            </TableCell>
                                        </TableRow>
                                        {expandedBrdge === brdge.id && (
                                            <TableRow>
                                                <TableCell colSpan={3} sx={{ p: 0, border: 'none' }}>
                                                    <Collapse in={true}>
                                                        <Box sx={{ p: 3, bgcolor: 'rgba(0, 0, 0, 0.2)' }}>
                                                            {loadingConversations ? (
                                                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                                                    <CircularProgress />
                                                                </Box>
                                                            ) : (
                                                                <>
                                                                    <Typography variant="h6" color="white" gutterBottom>
                                                                        Conversation Metrics
                                                                    </Typography>
                                                                    <ConversationMetrics brdgeId={brdge.id} />
                                                                    <Typography variant="h6" color="white" sx={{ mt: 4, mb: 2 }}>
                                                                        User Interactions
                                                                    </Typography>
                                                                    <UserConversationList brdgeId={brdge.id} />
                                                                </>
                                                            )}
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>

            {/* Move ShareDialog outside of any scrolling containers */}
            <ShareDialog
                open={shareDialogOpen}
                onClose={() => setShareDialogOpen(false)}
                brdge={selectedBrdge}
                onToggle={() => {
                    onShare(selectedBrdge);
                    setShareDialogOpen(false);
                }}
                onCopy={handleCopyLink}
            />
        </Box>
    );
};

// Replace the empty Dialog with the proper ShareDialog component
const ShareDialog = ({ open, onClose, brdge, onToggle, onCopy }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const shareableUrl = `${window.location.origin}/viewBrdge/${brdge?.id}`;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : '16px',
                    width: isMobile ? '100%' : '440px',
                    maxWidth: '100%',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    margin: isMobile ? 0 : 'auto',
                }
            }}
            sx={{ zIndex: 1500 }}
        >
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }}>
                    <Typography variant="h6">
                        Share Brdge
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Share Link */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{
                        display: 'flex',
                        gap: 1,
                    }}>
                        <TextField
                            fullWidth
                            value={shareableUrl}
                            size="small"
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LinkIcon fontSize="small" color="primary" />
                                    </InputAdornment>
                                ),
                                sx: {
                                    borderRadius: 1,
                                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={onCopy}
                            sx={{
                                minWidth: '100px',
                                bgcolor: theme.palette.primary.main,
                                '&:hover': {
                                    bgcolor: theme.palette.primary.dark,
                                }
                            }}
                        >
                            Copy
                        </Button>
                    </Box>
                </Box>

                {/* Access Toggle */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderRadius: 1,
                    bgcolor: 'rgba(0, 0, 0, 0.03)',
                    border: '1px solid rgba(0, 0, 0, 0.06)'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {brdge?.shareable ? (
                            <PublicIcon color="primary" sx={{ opacity: 0.8 }} />
                        ) : (
                            <LockIcon sx={{ opacity: 0.5 }} />
                        )}
                        <Box>
                            <Typography variant="subtitle2">
                                {brdge?.shareable ? 'Public access' : 'Private access'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {brdge?.shareable
                                    ? 'Anyone with the link can view'
                                    : 'Only you can view'}
                            </Typography>
                        </Box>
                    </Box>
                    <Switch
                        checked={brdge?.shareable}
                        onChange={onToggle}
                        color="primary"
                    />
                </Box>
            </Box>
        </Dialog>
    );
};

// Only one export at the end
export default BrdgeList;