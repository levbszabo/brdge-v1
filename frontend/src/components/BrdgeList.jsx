import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Box,
    TableSortLabel,
    Tooltip,
    Typography
} from '@mui/material';
import { Eye, Pencil, Share2, Trash2, Globe, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

// Unified theme colors (matching BrdgeListPage)
const theme = {
    colors: {
        primary: '#4F9CF9',
        background: '#0B0F1B',
        backgroundLight: '#101727',
        surface: 'rgba(255, 255, 255, 0.04)',
        border: 'rgba(255, 255, 255, 0.1)',
        text: {
            primary: '#FFFFFF',
            secondary: 'rgba(255, 255, 255, 0.7)'
        }
    }
};

const styles = {
    tableContainer: {
        backgroundColor: 'transparent',
    },
    headerCell: {
        color: theme.colors.text.secondary,
        borderBottom: `1px solid ${theme.colors.border}`,
        padding: '16px',
        '& .MuiTableSortLabel-root': {
            color: theme.colors.text.secondary,
            '&:hover': {
                color: theme.colors.primary,
            },
            '&.Mui-active': {
                color: theme.colors.primary,
            }
        }
    },
    row: {
        transition: 'background-color 0.2s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
        }
    },
    cell: {
        color: theme.colors.text.primary,
        borderBottom: `1px solid ${theme.colors.border}`,
        padding: '16px',
    },
    actionButton: {
        color: theme.colors.text.secondary,
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: theme.colors.primary,
        }
    },
    statusChip: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        borderRadius: '16px',
        fontSize: '0.875rem',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid',
        color: theme.colors.text.primary,
        transition: 'all 0.2s ease-in-out',
        '&.public': {
            borderColor: 'rgba(34, 211, 238, 0.3)',
            backgroundColor: 'rgba(34, 211, 238, 0.05)',
            '& svg': {
                color: '#22D3EE'
            }
        },
        '&.private': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '& svg': {
                color: 'rgba(255, 255, 255, 0.7)'
            }
        }
    }
};

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
    const columns = [
        { id: 'name', label: 'Name', sortable: true },
        { id: 'status', label: 'Status', sortable: true },
        { id: 'actions', label: 'Actions', sortable: false }
    ];

    const StatusChip = ({ shareable }) => (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: shareable ? '#22D3EE' : 'rgba(255,255,255,0.7)',
            transition: 'all 0.2s ease'
        }}>
            {shareable ? (
                <Globe size={18} style={{
                    filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.4))',
                    transition: 'all 0.2s ease'
                }} />
            ) : (
                <Lock size={18} />
            )}
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                {shareable ? 'Public' : 'Private'}
            </Typography>
        </Box>
    );

    return (
        <TableContainer sx={styles.tableContainer}>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                sx={styles.headerCell}
                                sortDirection={orderBy === column.id ? orderDirection : false}
                            >
                                {column.sortable ? (
                                    <TableSortLabel
                                        active={orderBy === column.id}
                                        direction={orderBy === column.id ? orderDirection : 'asc'}
                                        onClick={() => onSort(column.id)}
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
                <TableBody>
                    {brdges.map((brdge) => (
                        <TableRow
                            key={brdge.id}
                            sx={styles.row}
                            component={motion.tr}
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "tween", duration: 0.2 }}
                            onClick={() => onEdit(brdge)}
                        >
                            <TableCell sx={styles.cell}>
                                {brdge.name}
                            </TableCell>
                            <TableCell sx={styles.cell}>
                                <StatusChip shareable={brdge.shareable} />
                            </TableCell>
                            <TableCell sx={styles.cell}>
                                <Box
                                    sx={{ display: 'flex', gap: 1 }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Tooltip title="View">
                                        <IconButton
                                            onClick={() => onView(brdge)}
                                            size="small"
                                            sx={styles.actionButton}
                                        >
                                            <Eye size={18} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                        <IconButton
                                            onClick={() => onEdit(brdge)}
                                            size="small"
                                            sx={styles.actionButton}
                                        >
                                            <Pencil size={18} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Share">
                                        <IconButton
                                            onClick={() => onShare(brdge)}
                                            size="small"
                                            sx={styles.actionButton}
                                        >
                                            <Share2 size={18} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton
                                            onClick={() => onDelete(brdge)}
                                            size="small"
                                            sx={{
                                                ...styles.actionButton,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 59, 48, 0.1)',
                                                    color: '#ff3b30',
                                                }
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default BrdgeList;