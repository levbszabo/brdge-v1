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

    // Add mobile-specific components
    const MobileListItem = ({ brdge }) => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <Paper
                sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                            mb: 1
                        }}
                        onClick={() => onView(brdge)}
                    >
                        {brdge.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <StatusChip shareable={brdge.shareable} />
                        <Typography variant="caption" color="text.secondary">
                            Last edited {formatDate(brdge.updated_at || brdge.created_at)}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pt: 1
                }}>
                    <Typography variant="caption" color="text.secondary">
                        Created {formatDate(brdge.created_at)}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            size="small"
                            onClick={() => onView(brdge)}
                            sx={{ padding: 1 }}
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => onEdit(brdge)}
                            sx={{ padding: 1 }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={(e) => handleShareClick(brdge, e)}
                            sx={{ padding: 1 }}
                        >
                            <ShareIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => onDelete(brdge)}
                            sx={{ padding: 1 }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </Paper>
        </motion.div>
    );

    // Add a new component for mobile sorting and upgrading
    const MobileHeader = ({ orderBy, onSort, headers, stats }) => (
        <Box sx={{ mb: 3 }}>
            {/* Usage Stats for Mobile */}
            <Box sx={{
                mb: 3,
                p: 2,
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1
                }}>
                    <Typography variant="body2" fontWeight="medium">
                        {stats.brdges_created} / {stats.brdges_limit} Brdges
                    </Typography>
                    <Button
                        component={RouterLink}
                        to="/profile"
                        size="small"
                        variant="contained"
                        sx={{
                            borderRadius: '20px',
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            background: 'linear-gradient(90deg, #2196F3, #00BCD4)',
                            '&:hover': {
                                background: 'linear-gradient(90deg, #1976D2, #0097A7)',
                            }
                        }}
                    >
                        Upgrade Now
                    </Button>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={(stats.brdges_created / parseInt(stats.brdges_limit)) * 100}
                    sx={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 2,
                            background: 'linear-gradient(90deg, #2196F3, #00BCD4)'
                        }
                    }}
                />
            </Box>

            {/* Sorting Options */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
            }}>
                <Typography variant="subtitle2" color="text.secondary">
                    Sort by: {headers.find(h => h.id === orderBy)?.label}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {headers.filter(h => h.sortable).map((header) => (
                    <Chip
                        key={header.id}
                        label={header.label}
                        onClick={() => onSort(header.id)}
                        variant={orderBy === header.id ? "filled" : "outlined"}
                        color={orderBy === header.id ? "primary" : "default"}
                        size="small"
                        sx={{ borderRadius: '8px' }}
                    />
                ))}
            </Box>
        </Box>
    );

    return (
        <>
            {isMobile ? (
                <Box sx={{ px: 2 }}>
                    <MobileHeader
                        orderBy={orderBy}
                        onSort={onSort}
                        headers={columns}
                        stats={stats} // Pass stats to MobileHeader
                    />
                    <AnimatePresence>
                        {brdges.map((brdge) => (
                            <MobileListItem key={brdge.id} brdge={brdge} />
                        ))}
                    </AnimatePresence>
                </Box>
            ) : (
                // Desktop View - Keep existing table view
                <TableContainer
                    component={Paper}
                    sx={{
                        borderRadius: '24px',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                        '& .MuiTableCell-root': {
                            borderColor: 'rgba(255, 255, 255, 0.05)',
                            color: 'white'
                        },
                        '& .MuiTableRow-root:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            transition: 'background-color 0.3s ease'
                        }
                    }}
                >
                    <Table>
                        <TableHeader />
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
                                                fontWeight: 500
                                            }}
                                        >
                                            {brdge.name}
                                        </TableCell>
                                        <TableCell>
                                            <StatusChip shareable={brdge.shareable} />
                                        </TableCell>
                                        <TableCell>
                                            <ActionButtons brdge={brdge} />
                                        </TableCell>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Mobile Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                TransitionComponent={Fade}
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        minWidth: '160px'
                    }
                }}
            >
                <MenuItem onClick={() => handleAction('view')}>
                    <VisibilityIcon sx={{ mr: 1 }} /> View
                </MenuItem>
                <MenuItem onClick={() => handleAction('edit')}>
                    <EditIcon sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <MenuItem onClick={() => handleAction('share')}>
                    <ShareIcon sx={{ mr: 1 }} /> Share
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
                    <DeleteIcon sx={{ mr: 1 }} /> Delete
                </MenuItem>
            </Menu>

            {/* Share Dialog */}
            <ShareDialog
                open={shareDialogOpen}
                onClose={handleCloseShareDialog}
                brdge={selectedBrdge}
                onToggle={handleToggleShare}
                onCopy={handleCopyLink}
            />

            {/* Copy Success Snackbar */}
            <Snackbar
                open={showCopySuccess}
                autoHideDuration={3000}
                onClose={() => setShowCopySuccess(false)}
                message="Link copied to clipboard!"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </>
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