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
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton as MuiIconButton,
    Typography,
    InputAdornment,
    Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link';
import { motion } from 'framer-motion';

const BrdgeList = ({
    brdges,
    onView,
    onEdit,
    onShare,
    onDelete,
    orderBy,
    orderDirection,
    onSort
}) => {
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [selectedBrdge, setSelectedBrdge] = useState(null);
    const [showCopySuccess, setShowCopySuccess] = useState(false);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const headers = [
        { id: 'name', label: 'Name' },
        { id: 'status', label: 'Status' },
        { id: 'created_at', label: 'Created' },
        { id: 'updated_at', label: 'Last Modified' },
        { id: 'actions', label: 'Actions', sortable: false }
    ];

    const handleShareClick = (brdge, event) => {
        event.stopPropagation();
        setSelectedBrdge(brdge);
        setShareDialogOpen(true);
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

    return (
        <>
            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            {headers.map((header) => (
                                <TableCell
                                    key={header.id}
                                    sortDirection={orderBy === header.id ? orderDirection : false}
                                >
                                    {header.sortable !== false ? (
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
                    <TableBody>
                        {brdges.map((brdge) => (
                            <motion.tr
                                key={brdge.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
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
                                    <Chip
                                        label={brdge.shareable ? 'Public' : 'Private'}
                                        color={brdge.shareable ? 'success' : 'default'}
                                        size="small"
                                        sx={{ borderRadius: '12px' }}
                                    />
                                </TableCell>
                                <TableCell>{formatDate(brdge.created_at)}</TableCell>
                                <TableCell>{formatDate(brdge.updated_at || brdge.created_at)}</TableCell>
                                <TableCell>
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
                                </TableCell>
                            </motion.tr>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Share Dialog */}
            <Dialog
                open={shareDialogOpen}
                onClose={handleCloseShareDialog}
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        minWidth: '400px'
                    }
                }}
            >
                <DialogTitle>
                    Share Brdge
                </DialogTitle>
                <DialogContent>
                    {selectedBrdge?.shareable ? (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Public Link
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TextField
                                    fullWidth
                                    value={`${window.location.origin}/b/${selectedBrdge.public_id}`}
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LinkIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <MuiIconButton
                                    onClick={handleCopyLink}
                                    color="primary"
                                >
                                    <ContentCopyIcon />
                                </MuiIconButton>
                            </Box>
                        </Box>
                    ) : (
                        <Typography>
                            Make this Brdge public to share it with others
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseShareDialog}>
                        Close
                    </Button>
                    <Button
                        onClick={handleToggleShare}
                        variant="contained"
                        color="primary"
                    >
                        {selectedBrdge?.shareable ? 'Make Private' : 'Make Public'}
                    </Button>
                </DialogActions>
            </Dialog>

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

export default BrdgeList; 