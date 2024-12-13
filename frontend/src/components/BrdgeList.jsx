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
    Switch
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

const BrdgeList = ({
    brdges,
    onView,
    onEdit,
    onShare,
    onDelete,
    orderBy,
    orderDirection,
    onSort,
    stats
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

    const handleShareClick = (brdge) => {
        setSelectedBrdge(brdge);
        setShareDialogOpen(true);
        handleMenuClose();
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
        <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
                size="small"
                onClick={() => onView(brdge)}
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
            <Tooltip title={brdge.shareable ? "Manage Sharing" : "Share"}>
                <IconButton
                    size="small"
                    onClick={(e) => handleShareClick(brdge, e)}
                    sx={{
                        color: brdge.shareable ? '#4F9CF9' : 'rgba(255, 255, 255, 0.7)',
                        backgroundColor: brdge.shareable ? 'rgba(79, 156, 249, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: '#4F9CF9',
                            backgroundColor: 'rgba(79, 156, 249, 0.15)',
                            transform: 'translateY(-2px)'
                        }
                    }}
                >
                    <ShareIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
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
            </Tooltip>
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
                            onShare(brdge);
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

    return (
        <Box sx={{ width: '100%' }}>
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
                    <TableContainer>
                        <Table>
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
                                            borderBottom: 'none', // Remove bottom border
                                            py: 2
                                        }
                                    }}
                                >
                                    <TableCell>Name</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <AnimatePresence>
                                    {brdges.map((brdge) => (
                                        <motion.tr
                                            key={brdge.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            whileHover={{
                                                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                                transition: { duration: 0.2 }
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <TableCell
                                                onClick={() => onView(brdge)}
                                                sx={{
                                                    color: '#2196F3',
                                                    fontWeight: 500,
                                                    borderBottom: 'none' // Remove bottom border
                                                }}
                                            >
                                                {brdge.name}
                                            </TableCell>
                                            <TableCell sx={{ borderBottom: 'none' }}> {/* Remove bottom border */}
                                                <StatusChip shareable={brdge.shareable} />
                                            </TableCell>
                                            <TableCell sx={{ borderBottom: 'none' }}> {/* Remove bottom border */}
                                                <ActionButtons brdge={brdge} />
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Box>
    );
};

// Remove the duplicate ShareDialog component and merge its functionality
const ShareDialog = ({ open, onClose, brdge, onToggle, onCopy }) => {
    const theme = useTheme();
    const shareableUrl = `${window.location.origin}/viewBrdge/${brdge?.id}`;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    width: '440px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                }
            }}
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

                {/* Share Link - Always visible */}
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