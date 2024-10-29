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
    LinearProgress
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

    const headers = [
        { id: 'name', label: 'Name', sortable: true },
        { id: 'status', label: 'Status', sortable: true },
        { id: 'created_at', label: 'Created', sortable: true },
        { id: 'updated_at', label: 'Last Modified', sortable: true },
        { id: 'actions', label: 'Actions', sortable: false }
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
        const publicUrl = `${window.location.origin}/b/${selectedBrdge.public_id}`;
        navigator.clipboard.writeText(publicUrl);
        setShowCopySuccess(true);
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
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    '& th': {
                        fontWeight: 600,
                        color: theme.palette.text.secondary,
                        borderBottom: `2px solid ${theme.palette.divider}`
                    }
                }}
            >
                {headers.map((header) => (
                    <TableCell
                        key={header.id}
                        sortDirection={orderBy === header.id ? orderDirection : false}
                        sx={{
                            '&:not(:last-child)': {
                                borderRight: `1px solid ${theme.palette.divider}`
                            }
                        }}
                    >
                        {header.sortable ? (
                            <TableSortLabel
                                active={orderBy === header.id}
                                direction={orderBy === header.id ? orderDirection : 'asc'}
                                onClick={() => onSort(header.id)}
                            >
                                {header.label}
                            </TableSortLabel>
                        ) : (
                            header.label
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
            color={shareable ? 'success' : 'default'}
            size="small"
            sx={{
                borderRadius: '12px',
                '& .MuiChip-icon': {
                    fontSize: '16px',
                    color: 'inherit'
                }
            }}
        />
    );

    const ActionButtons = ({ brdge }) => (
        isMobile ? (
            <IconButton
                size="small"
                onClick={(e) => handleMenuOpen(e, brdge)}
                sx={{
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                }}
            >
                <MoreVertIcon />
            </IconButton>
        ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="View">
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onView(brdge);
                        }}
                        sx={{
                            '&:hover': {
                                color: '#2196F3',
                                transform: 'scale(1.1)'
                            }
                        }}
                    >
                        <VisibilityIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(brdge);
                        }}
                        sx={{
                            '&:hover': {
                                color: '#2196F3',
                                transform: 'scale(1.1)'
                            }
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={brdge.shareable ? "Manage Sharing" : "Share"}>
                    <IconButton
                        size="small"
                        onClick={(e) => handleShareClick(brdge, e)}
                        sx={{
                            color: brdge.shareable ? '#2196F3' : 'inherit',
                            '&:hover': {
                                color: '#2196F3',
                                transform: 'scale(1.1)'
                            }
                        }}
                    >
                        <ShareIcon />
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
                            '&:hover': {
                                color: '#f44336',
                                transform: 'scale(1.1)'
                            }
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        )
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
                        headers={headers}
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
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                        '& .MuiTableCell-root': {
                            borderColor: theme.palette.divider
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
                                        <TableCell>{formatDate(brdge.created_at)}</TableCell>
                                        <TableCell>{formatDate(brdge.updated_at || brdge.created_at)}</TableCell>
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
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : '16px',
                    width: isMobile ? '100%' : '400px',
                    m: isMobile ? 0 : 2
                }
            }}
        >
            <DialogTitle sx={{
                pb: 1,
                pt: isMobile ? 3 : 2,
                px: isMobile ? 3 : 2
            }}>
                Share Brdge
            </DialogTitle>
            <DialogContent sx={{ px: isMobile ? 3 : 2 }}>
                {brdge?.shareable ? (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Public Link
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                                fullWidth
                                value={`${window.location.origin}/b/${brdge.public_id}`}
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LinkIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <IconButton
                                onClick={onCopy}
                                color="primary"
                            >
                                <ContentCopyIcon />
                            </IconButton>
                        </Box>
                    </Box>
                ) : (
                    <Typography>
                        Make this Brdge public to share it with others
                    </Typography>
                )}
            </DialogContent>
            <DialogActions sx={{
                px: isMobile ? 3 : 2,
                pb: isMobile ? 4 : 2
            }}>
                <Button onClick={onClose}>
                    Close
                </Button>
                <Button
                    onClick={onToggle}
                    variant="contained"
                    color="primary"
                >
                    {brdge?.shareable ? 'Make Private' : 'Make Public'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Only one export at the end
export default BrdgeList;