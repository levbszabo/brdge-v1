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
    Typography,
    Checkbox,
    useTheme,
    Collapse,
    Paper,
    Divider
} from '@mui/material';
import { Eye, Pencil, Share2, Trash2, Globe, Lock, BookOpen, Users, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';

// Neo-Scholar theme styles
const createStyles = (theme) => ({
    tableContainer: {
        backgroundColor: 'transparent',
    },
    headerCell: {
        color: theme.palette.text.secondary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: '16px',
        fontFamily: '"Satoshi", sans-serif',
        fontWeight: 600,
        '& .MuiTableSortLabel-root': {
            color: theme.palette.text.secondary,
            '&:hover': {
                color: theme.palette.secondary.main,
            },
            '&.Mui-active': {
                color: theme.palette.secondary.main,
            }
        }
    },
    row: {
        transition: 'background-color 0.2s ease-in-out',
        '&:hover': {
            backgroundColor: `${theme.palette.background.default}80`,
        }
    },
    cell: {
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: '16px',
        verticalAlign: 'top',
    },
    actionButton: {
        color: theme.palette.text.secondary,
        '&:hover': {
            backgroundColor: `${theme.palette.secondary.main}10`,
            color: theme.palette.secondary.main,
        }
    },
    statusChip: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        borderRadius: '16px',
        fontSize: '0.875rem',
        backgroundColor: `${theme.palette.background.default}70`,
        border: '1px solid',
        color: theme.palette.text.primary,
        transition: 'all 0.2s ease-in-out',
        '&.public': {
            borderColor: `${theme.palette.secondary.main}50`,
            backgroundColor: `${theme.palette.secondary.main}10`,
            '& svg': {
                color: theme.palette.secondary.main
            }
        },
        '&.private': {
            borderColor: `${theme.palette.text.disabled}30`,
            backgroundColor: `${theme.palette.background.default}50`,
            '& svg': {
                color: theme.palette.text.disabled
            }
        }
    },
    checkboxCell: {
        width: '48px',
        padding: '16px 0 16px 16px',
        verticalAlign: 'top',
    },
    actionCell: {
        padding: '8px 16px 8px 8px',
        width: '180px',
        textAlign: 'right',
        verticalAlign: 'top',
    },
    checkbox: {
        color: theme.palette.text.disabled,
        '&.Mui-checked': {
            color: theme.palette.secondary.main
        }
    },
    selectedRow: {
        backgroundColor: `${theme.palette.secondary.main}10 !important`
    },
    analyticsRow: {
        '& > *': {
            paddingBottom: 0,
            paddingTop: 0,
            borderBottom: 'none',
        },
    },
    analyticsContainer: {
        padding: '16px',
        backgroundColor: theme.palette.background.default,
        borderTop: `1px solid ${theme.palette.divider}`,
    },
});

const BrdgeList = ({
    brdges,
    onView,
    onEdit,
    onShare,
    onDelete,
    orderBy,
    orderDirection,
    onSort,
    selectedModules = [],
    onModuleSelect,
    onSelectAll,
    draggable = false,
    onDragStart = null,
    onDragEnd = null,
    expandedLogs,
    loadingLogs,
    conversationLogs,
    toggleLogExpansion,
    BridgeAnalyticsComponent,
    theme: themeProp
}) => {
    const defaultTheme = useTheme();
    const currentTheme = themeProp || defaultTheme;
    const styles = createStyles(currentTheme);

    const handleSelectAllClick = (event) => {
        if (onSelectAll) {
            onSelectAll(event.target.checked);
        }
    };

    const isAllSelected = brdges.length > 0 && selectedModules.length === brdges.length;

    const columns = [
        {
            id: 'select',
            label: '',
            sortable: false
        },
        { id: 'name', label: 'Name', sortable: true },
        { id: 'status', label: 'Status', sortable: true },
        { id: 'actions', label: 'Actions', sortable: false }
    ];

    const StatusChip = ({ shareable }) => (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: shareable ? currentTheme.palette.secondary.main : currentTheme.palette.text.secondary,
            transition: 'all 0.2s ease'
        }}>
            {shareable ? (
                <Globe size={18} style={{
                    filter: `drop-shadow(0 0 5px ${currentTheme.palette.secondary.main}30)`,
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
                        <TableCell sx={{ ...styles.headerCell, ...styles.checkboxCell }}>
                            <Checkbox
                                indeterminate={selectedModules.length > 0 && selectedModules.length < brdges.length}
                                checked={isAllSelected}
                                onChange={handleSelectAllClick}
                                sx={styles.checkbox}
                            />
                        </TableCell>
                        {columns.slice(1).map((column) => (
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
                    {brdges.map((brdge) => {
                        const isSelected = selectedModules.includes(brdge.id);
                        const isExpanded = expandedLogs[brdge.id] || false;

                        return (
                            <React.Fragment key={brdge.id}>
                                <TableRow
                                    sx={{
                                        ...styles.row,
                                        ...(isSelected ? styles.selectedRow : {}),
                                        '& > *': {
                                            borderBottom: isExpanded ? 'none' : `1px solid ${currentTheme.palette.divider}`,
                                        },
                                    }}
                                    component={motion.tr}
                                    whileHover={{ scale: 1.01 }}
                                    transition={{ type: "tween", duration: 0.2 }}
                                    draggable={draggable}
                                    onDragStart={draggable && onDragStart ? (e) => onDragStart(e, brdge.id) : undefined}
                                    onDragEnd={draggable && onDragEnd ? onDragEnd : undefined}
                                >
                                    <TableCell sx={{ ...styles.cell, ...styles.checkboxCell }}>
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={() => onModuleSelect(brdge.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            sx={styles.checkbox}
                                        />
                                    </TableCell>
                                    <TableCell sx={styles.cell}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <BookOpen size={16} style={{ color: currentTheme.palette.secondary.main }} />
                                            <Typography variant="body1">{brdge.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={styles.cell}>
                                        <StatusChip shareable={brdge.shareable} />
                                    </TableCell>
                                    <TableCell sx={{ ...styles.cell, ...styles.actionCell }}>
                                        <Box
                                            sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Tooltip title="View Usage Analytics">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleLogExpansion(brdge.id);
                                                    }}
                                                    sx={{
                                                        ...styles.actionButton,
                                                        color: isExpanded ? currentTheme.palette.primary.main : currentTheme.palette.text.secondary,
                                                    }}
                                                >
                                                    <LineChart size={18} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="View">
                                                <IconButton size="small" onClick={(e) => onView(e, brdge)} sx={styles.actionButton}><Eye size={18} /></IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit">
                                                <IconButton size="small" onClick={(e) => onEdit(e, brdge)} sx={styles.actionButton}><Pencil size={18} /></IconButton>
                                            </Tooltip>
                                            <Tooltip title={brdge.shareable ? "Manage Sharing" : "Share"}>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => onShare(e, brdge)}
                                                    sx={{ ...styles.actionButton, color: brdge.shareable ? currentTheme.palette.secondary.main : currentTheme.palette.text.secondary }}
                                                ><Share2 size={18} /></IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => onDelete(e, brdge)}
                                                    sx={{ ...styles.actionButton, '&:hover': { backgroundColor: 'rgba(255, 75, 75, 0.1)', color: '#FF4B4B' } }}
                                                ><Trash2 size={18} /></IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                                <TableRow sx={styles.analyticsRow}>
                                    <TableCell colSpan={columns.length + 1}>
                                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                            {BridgeAnalyticsComponent && (
                                                <BridgeAnalyticsComponent bridgeId={brdge.id} theme={currentTheme} />
                                            )}
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default BrdgeList;