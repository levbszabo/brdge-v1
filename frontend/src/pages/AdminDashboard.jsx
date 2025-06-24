import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    Divider,
    IconButton,
    Tooltip,
    Tabs,
    Tab,
    AppBar,
    Checkbox,
    Toolbar,
    Paper,
    Card,
    CardContent,
    Snackbar,
    Fade,
    Slide,
    Button,
    Stack,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Badge,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Link
} from '@mui/material';
import {
    Refresh,
    Visibility,
    Upload,
    Download,
    Edit,
    CheckCircle,
    Schedule,
    NewReleases,
    LocalShipping,
    Dashboard,
    Assignment,
    Analytics,
    Settings,
    ViewList,
    Delete,
    DeleteOutline,
    Email,
    Save,
    Cancel,
    Warning,
    SelectAll,
    Deselect,
    ExpandMore,
    Description,
    Message,
    Person,
    Work,
    LocationOn,
    AttachMoney,
    Notes,
    Chat,
    FilePresent,
    Timeline,
    Assessment,
    Business
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { api } from '../api';

import DotBridgeButton from '../components/DotBridgeButton';
import DotBrdgeListPage from './DotBrdgeListPage';

const AdminDashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetailOpen, setOrderDetailOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [filters, setFilters] = useState({
        status: '',
        offer_id: ''
    });
    const [analytics, setAnalytics] = useState(null);
    const [offers, setOffers] = useState([]);

    // New state for bulk operations
    const [selectedOrders, setSelectedOrders] = useState(new Set());
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [singleDeleteOpen, setSingleDeleteOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Client editing state
    const [editingClient, setEditingClient] = useState(null);
    const [newClientEmail, setNewClientEmail] = useState('');
    const [savingClient, setSavingClient] = useState(false);

    // Notification state
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    // State for comprehensive order view
    const [comprehensiveDetailOpen, setComprehensiveDetailOpen] = useState(false);
    const [comprehensiveData, setComprehensiveData] = useState(null);
    const [loadingComprehensive, setLoadingComprehensive] = useState(false);

    useEffect(() => {
        fetchOrders();
        fetchAnalytics();
        fetchOffers();
    }, [filters]);

    const showNotification = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.offer_id) params.append('offer_id', filters.offer_id);

            const response = await api.get(`/admin/orders?${params}`);
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            showNotification('Failed to fetch orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/admin/analytics/overview');
            setAnalytics(response.data.analytics);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    const fetchOffers = async () => {
        try {
            const response = await api.get('/offers');
            setOffers(response.data.offers || []);
        } catch (error) {
            console.error('Error fetching offers:', error);
        }
    };

    const fetchOrderDetail = async (orderId) => {
        try {
            const response = await api.get(`/admin/orders/${orderId}`);
            setSelectedOrder(response.data.order);
            setOrderDetailOpen(true);
        } catch (error) {
            console.error('Error fetching order detail:', error);
            showNotification('Failed to fetch order details', 'error');
        }
    };

    const updateOrderStatus = async (orderId, status, notes) => {
        try {
            const response = await api.put(`/admin/orders/${orderId}`, {
                status,
                internal_notes: notes
            });

            // Update local state
            setOrders(orders.map(order =>
                order.id === orderId ? response.data.order : order
            ));

            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder(response.data.order);
            }

            showNotification('Order updated successfully');
        } catch (error) {
            console.error('Error updating order:', error);
            showNotification('Failed to update order', 'error');
        }
    };

    // Bulk selection handlers
    const handleSelectAll = () => {
        if (selectedOrders.size === orders.length) {
            setSelectedOrders(new Set());
        } else {
            setSelectedOrders(new Set(orders.map(order => order.id)));
        }
    };

    const handleSelectOrder = (orderId) => {
        const newSelected = new Set(selectedOrders);
        if (newSelected.has(orderId)) {
            newSelected.delete(orderId);
        } else {
            newSelected.add(orderId);
        }
        setSelectedOrders(newSelected);
    };

    // Delete handlers
    const handleSingleDelete = (orderId) => {
        setDeleteTargetId(orderId);
        setSingleDeleteOpen(true);
    };

    const handleBulkDelete = () => {
        setBulkDeleteOpen(true);
    };

    const confirmSingleDelete = async () => {
        try {
            setDeleting(true);
            await api.delete(`/admin/orders/${deleteTargetId}`);

            setOrders(orders.filter(order => order.id !== deleteTargetId));
            setSingleDeleteOpen(false);
            setDeleteTargetId(null);
            showNotification('Order deleted successfully');
        } catch (error) {
            console.error('Error deleting order:', error);
            showNotification('Failed to delete order', 'error');
        } finally {
            setDeleting(false);
        }
    };

    const confirmBulkDelete = async () => {
        try {
            setDeleting(true);
            await api.delete('/admin/orders/bulk-delete', {
                data: { order_ids: Array.from(selectedOrders) }
            });

            setOrders(orders.filter(order => !selectedOrders.has(order.id)));
            setSelectedOrders(new Set());
            setBulkDeleteOpen(false);
            showNotification(`Successfully deleted ${selectedOrders.size} orders`);
        } catch (error) {
            console.error('Error bulk deleting orders:', error);
            showNotification('Failed to delete orders', 'error');
        } finally {
            setDeleting(false);
        }
    };

    // Client editing handlers
    const handleEditClient = (order) => {
        setEditingClient(order.id);
        setNewClientEmail(order.client?.email || '');
    };

    const handleSaveClient = async (orderId) => {
        try {
            setSavingClient(true);
            const response = await api.put(`/admin/orders/${orderId}/client`, {
                email: newClientEmail
            });

            // Update local state
            setOrders(orders.map(order =>
                order.id === orderId ? response.data.order : order
            ));

            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder(response.data.order);
            }

            setEditingClient(null);
            showNotification('Client email updated successfully');
        } catch (error) {
            console.error('Error updating client:', error);
            showNotification('Failed to update client email', 'error');
        } finally {
            setSavingClient(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingClient(null);
        setNewClientEmail('');
    };

    // Comprehensive order details handlers
    const fetchComprehensiveOrderDetails = async (orderId) => {
        try {
            setLoadingComprehensive(true);
            const response = await api.get(`/admin/orders/${orderId}/comprehensive`);
            setComprehensiveData(response.data.data);
            setComprehensiveDetailOpen(true);
        } catch (error) {
            console.error('Error fetching comprehensive order details:', error);
            showNotification('Failed to fetch comprehensive order details', 'error');
        } finally {
            setLoadingComprehensive(false);
        }
    };

    const handleCloseComprehensiveDetails = () => {
        setComprehensiveDetailOpen(false);
        setComprehensiveData(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'error';
            case 'in_progress': return 'warning';
            case 'delivered': return 'info';
            case 'completed': return 'success';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'new': return <NewReleases />;
            case 'in_progress': return <Schedule />;
            case 'delivered': return <LocalShipping />;
            case 'completed': return <CheckCircle />;
            default: return null;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateDaysUntilDue = (dueDateString) => {
        if (!dueDateString) return null;
        const dueDate = new Date(dueDateString);
        const today = new Date();
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const tabContent = [
        {
            label: 'Dashboard',
            icon: <Dashboard />,
            content: (
                <Box>
                    {/* Analytics Cards */}
                    {analytics && (
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}05)`,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                    height: '100%'
                                }}>
                                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                        <Typography variant="h3" color="primary.main" sx={{ mb: 1, fontWeight: 700 }}>
                                            {analytics.total_orders}
                                        </Typography>
                                        <Typography color="text.secondary" variant="body1" fontWeight={500}>
                                            Total Orders
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.error.main}15, ${theme.palette.error.main}05)`,
                                    border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                                    height: '100%'
                                }}>
                                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                        <Typography variant="h3" color="error.main" sx={{ mb: 1, fontWeight: 700 }}>
                                            {analytics.orders_by_status.new}
                                        </Typography>
                                        <Typography color="text.secondary" variant="body1" fontWeight={500}>
                                            New Orders
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.warning.main}15, ${theme.palette.warning.main}05)`,
                                    border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                                    height: '100%'
                                }}>
                                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                        <Typography variant="h3" color="warning.main" sx={{ mb: 1, fontWeight: 700 }}>
                                            {analytics.orders_by_status.in_progress}
                                        </Typography>
                                        <Typography color="text.secondary" variant="body1" fontWeight={500}>
                                            In Progress
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.success.main}05)`,
                                    border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                                    height: '100%'
                                }}>
                                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                        <Typography variant="h3" color="success.main" sx={{ mb: 1, fontWeight: 700 }}>
                                            ${analytics.total_revenue_dollars.toLocaleString()}
                                        </Typography>
                                        <Typography color="text.secondary" variant="body1" fontWeight={500}>
                                            Total Revenue
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )}

                    {/* Filters and Bulk Actions */}
                    <Card sx={{ mb: 3, overflow: 'visible' }}>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={filters.status}
                                            label="Status"
                                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                        >
                                            <MenuItem value="">All Statuses</MenuItem>
                                            <MenuItem value="new">New</MenuItem>
                                            <MenuItem value="in_progress">In Progress</MenuItem>
                                            <MenuItem value="delivered">Delivered</MenuItem>
                                            <MenuItem value="completed">Completed</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>Offer</InputLabel>
                                        <Select
                                            value={filters.offer_id}
                                            label="Offer"
                                            onChange={(e) => setFilters(prev => ({ ...prev, offer_id: e.target.value }))}
                                        >
                                            <MenuItem value="">All Offers</MenuItem>
                                            {offers.map(offer => (
                                                <MenuItem key={offer.id} value={offer.id}>
                                                    {offer.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <DotBridgeButton
                                        variant="outlined"
                                        startIcon={<Refresh />}
                                        onClick={fetchOrders}
                                        fullWidth
                                        disabled={loading}
                                    >
                                        Refresh
                                    </DotBridgeButton>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    {selectedOrders.size > 0 && (
                                        <DotBridgeButton
                                            variant="contained"
                                            color="error"
                                            startIcon={<Delete />}
                                            onClick={handleBulkDelete}
                                            fullWidth
                                        >
                                            Delete Selected ({selectedOrders.size})
                                        </DotBridgeButton>
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Orders Table */}
                    <Card sx={{ overflow: 'hidden' }}>
                        {selectedOrders.size > 0 && (
                            <Toolbar
                                sx={{
                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                    borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`
                                }}
                            >
                                <Typography variant="h6" component="div" sx={{ flex: '1 1 100%' }}>
                                    {selectedOrders.size} selected
                                </Typography>
                                <Tooltip title="Delete selected">
                                    <IconButton onClick={handleBulkDelete} color="error">
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </Toolbar>
                        )}
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: alpha(theme.palette.grey[500], 0.03) }}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                indeterminate={selectedOrders.size > 0 && selectedOrders.size < orders.length}
                                                checked={orders.length > 0 && selectedOrders.size === orders.length}
                                                onChange={handleSelectAll}
                                                color="primary"
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.9rem' }}>Client</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.9rem' }}>Offer</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.9rem' }}>Order Date</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.9rem' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.9rem' }}>Due Date</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.9rem' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                                <CircularProgress />
                                            </TableCell>
                                        </TableRow>
                                    ) : orders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                                <Typography color="text.secondary">No orders found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        orders.map((order) => {
                                            const daysUntilDue = calculateDaysUntilDue(order.due_date);
                                            const isSelected = selectedOrders.has(order.id);

                                            return (
                                                <TableRow
                                                    key={order.id}
                                                    hover
                                                    selected={isSelected}
                                                    sx={{
                                                        '&:hover': {
                                                            bgcolor: alpha(theme.palette.primary.main, 0.04)
                                                        },
                                                        ...(isSelected && {
                                                            bgcolor: alpha(theme.palette.primary.main, 0.08)
                                                        })
                                                    }}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isSelected}
                                                            onChange={() => handleSelectOrder(order.id)}
                                                            color="primary"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            {editingClient === order.id ? (
                                                                <Stack direction="row" spacing={1} alignItems="center">
                                                                    <TextField
                                                                        size="small"
                                                                        value={newClientEmail}
                                                                        onChange={(e) => setNewClientEmail(e.target.value)}
                                                                        placeholder="Enter email"
                                                                        sx={{ minWidth: 200 }}
                                                                    />
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleSaveClient(order.id)}
                                                                        disabled={savingClient}
                                                                        color="primary"
                                                                    >
                                                                        <Save />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={handleCancelEdit}
                                                                        disabled={savingClient}
                                                                    >
                                                                        <Cancel />
                                                                    </IconButton>
                                                                </Stack>
                                                            ) : (
                                                                <Stack direction="row" spacing={1} alignItems="center">
                                                                    <Box>
                                                                        <Typography variant="body2" fontWeight="medium">
                                                                            {order.client?.email || 'Unknown'}
                                                                        </Typography>
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            ID: {order.client_id}
                                                                        </Typography>
                                                                    </Box>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleEditClient(order)}
                                                                        sx={{ ml: 1 }}
                                                                    >
                                                                        <Email fontSize="small" />
                                                                    </IconButton>
                                                                </Stack>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {order.offer?.name || 'Unknown'}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ${order.payment_amount_dollars}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {formatDate(order.order_date)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            icon={getStatusIcon(order.status)}
                                                            label={order.status.replace('_', ' ').toUpperCase()}
                                                            color={getStatusColor(order.status)}
                                                            size="small"
                                                            sx={{ fontWeight: 500 }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {order.due_date ? (
                                                            <Box>
                                                                <Typography variant="body2">
                                                                    {formatDate(order.due_date)}
                                                                </Typography>
                                                                {daysUntilDue !== null && (
                                                                    <Typography
                                                                        variant="caption"
                                                                        color={daysUntilDue < 0 ? 'error' : daysUntilDue <= 1 ? 'warning.main' : 'text.secondary'}
                                                                    >
                                                                        {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)}d overdue` :
                                                                            daysUntilDue === 0 ? 'Due today' :
                                                                                `${daysUntilDue}d remaining`}
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary">
                                                                Not set
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                                            <Tooltip title="Manage Client">
                                                                <DotBridgeButton
                                                                    variant="contained"
                                                                    size="small"
                                                                    startIcon={<Edit />}
                                                                    onClick={() => navigate(`/admin/client/${order.client_id}/dashboard`)}
                                                                >
                                                                    Manage
                                                                </DotBridgeButton>
                                                            </Tooltip>
                                                            {/* Show Career Details button for Career Accelerator orders */}
                                                            {order.offer?.slug === 'career-accelerator' && (
                                                                <Tooltip title="Career Details - Resume, Conversations & Ticket">
                                                                    <DotBridgeButton
                                                                        variant="contained"
                                                                        size="small"
                                                                        startIcon={<Assessment />}
                                                                        onClick={() => fetchComprehensiveOrderDetails(order.id)}
                                                                        disabled={loadingComprehensive}
                                                                        sx={{
                                                                            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                                                                            '&:hover': {
                                                                                background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)'
                                                                            }
                                                                        }}
                                                                    >
                                                                        Career Details
                                                                    </DotBridgeButton>
                                                                </Tooltip>
                                                            )}
                                                            <Tooltip title="Quick View">
                                                                <DotBridgeButton
                                                                    variant="outlined"
                                                                    size="small"
                                                                    startIcon={<Visibility />}
                                                                    onClick={() => fetchOrderDetail(order.id)}
                                                                >
                                                                    View
                                                                </DotBridgeButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete Order">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleSingleDelete(order.id)}
                                                                    color="error"
                                                                >
                                                                    <DeleteOutline />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Box>
            )
        },
        {
            label: 'Analytics',
            icon: <Analytics />,
            content: (
                <Box>
                    <Typography variant="h5" gutterBottom>Analytics Dashboard</Typography>
                    <Alert severity="info">
                        Advanced analytics features coming soon.
                    </Alert>
                </Box>
            )
        },
        {
            label: 'Settings',
            icon: <Settings />,
            content: (
                <Box>
                    <Typography variant="h5" gutterBottom>Admin Settings</Typography>
                    <Alert severity="info">
                        Admin configuration options coming soon.
                    </Alert>
                </Box>
            )
        },
        {
            label: 'Bridges',
            icon: <ViewList />,
            content: (
                <DotBrdgeListPage />
            )
        }
    ];

    return (
        <Box sx={{ bgcolor: 'background.subtle', minHeight: '100vh' }}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                        Mission Control
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                        Admin Dashboard for Order Fulfillment
                    </Typography>

                    <DotBridgeButton
                        variant="outlined"
                        color="primary"
                        onClick={() => window.open('/dashboard', '_blank')}
                    >
                        View Client Dashboard
                    </DotBridgeButton>
                </Box>

                {/* Navigation Tabs */}
                <Card sx={{ mb: 3, overflow: 'visible' }}>
                    <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'transparent' }}>
                        <Tabs
                            value={activeTab}
                            onChange={(e, newValue) => setActiveTab(newValue)}
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    fontSize: '0.9375rem',
                                    minHeight: 64,
                                    px: 3
                                },
                                '& .MuiTabs-indicator': {
                                    height: 3,
                                    borderRadius: '3px 3px 0 0'
                                }
                            }}
                        >
                            {tabContent.map((tab, index) => (
                                <Tab
                                    key={index}
                                    label={tab.label}
                                    icon={tab.icon}
                                    iconPosition="start"
                                />
                            ))}
                        </Tabs>
                    </AppBar>
                </Card>

                {/* Tab Content */}
                <Box>
                    {tabContent[activeTab]?.content}
                </Box>

                {/* Order Detail Dialog */}
                <Dialog
                    open={orderDetailOpen}
                    onClose={() => setOrderDetailOpen(false)}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: theme.shape.borderRadiusLarge,
                            boxShadow: theme.shadows[6]
                        }
                    }}
                >
                    <DialogTitle sx={{ pb: 2 }}>
                        <Typography variant="h5" component="div">
                            Order #{selectedOrder?.id} - Quick Overview
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        {selectedOrder && (
                            <Grid container spacing={3}>
                                {/* Client & Order Info */}
                                <Grid item xs={12}>
                                    <Card variant="outlined" sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                                Client Information
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" color="text.secondary">Email:</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                        {selectedOrder.client?.email}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" color="text.secondary">Offer:</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                        {selectedOrder.offer?.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" color="text.secondary">Amount:</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                        ${selectedOrder.payment_amount_dollars}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" color="text.secondary">Status:</Typography>
                                                    <Chip
                                                        icon={getStatusIcon(selectedOrder.status)}
                                                        label={selectedOrder.status.replace('_', ' ').toUpperCase()}
                                                        color={getStatusColor(selectedOrder.status)}
                                                        size="small"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>

                                    {/* Quick Actions */}
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                                Quick Actions
                                            </Typography>
                                            <Stack direction="row" spacing={2} flexWrap="wrap">
                                                <DotBridgeButton
                                                    variant="contained"
                                                    startIcon={<Edit />}
                                                    onClick={() => {
                                                        setOrderDetailOpen(false);
                                                        navigate(`/admin/client/${selectedOrder.client_id}/dashboard`);
                                                    }}
                                                >
                                                    Manage Client Dashboard
                                                </DotBridgeButton>

                                                <FormControl size="small" sx={{ minWidth: 150 }}>
                                                    <InputLabel>Update Status</InputLabel>
                                                    <Select
                                                        value={selectedOrder.status}
                                                        label="Update Status"
                                                        onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value, selectedOrder.internal_notes)}
                                                    >
                                                        <MenuItem value="new">New</MenuItem>
                                                        <MenuItem value="in_progress">In Progress</MenuItem>
                                                        <MenuItem value="delivered">Delivered</MenuItem>
                                                        <MenuItem value="completed">Completed</MenuItem>
                                                    </Select>
                                                </FormControl>

                                                <DotBridgeButton
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={<Delete />}
                                                    onClick={() => {
                                                        setOrderDetailOpen(false);
                                                        handleSingleDelete(selectedOrder.id);
                                                    }}
                                                >
                                                    Delete Order
                                                </DotBridgeButton>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <DotBridgeButton
                            variant="outlined"
                            onClick={() => setOrderDetailOpen(false)}
                        >
                            Close
                        </DotBridgeButton>
                        <DotBridgeButton
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={() => {
                                setOrderDetailOpen(false);
                                navigate(`/admin/client/${selectedOrder.client_id}/dashboard`);
                            }}
                        >
                            Manage Client
                        </DotBridgeButton>
                    </DialogActions>
                </Dialog>

                {/* Single Delete Confirmation Dialog */}
                <Dialog
                    open={singleDeleteOpen}
                    onClose={() => setSingleDeleteOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Warning color="error" />
                        Confirm Delete
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete this order? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSingleDeleteOpen(false)} disabled={deleting}>
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmSingleDelete}
                            color="error"
                            variant="contained"
                            disabled={deleting}
                            startIcon={deleting ? <CircularProgress size={16} /> : <Delete />}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Bulk Delete Confirmation Dialog */}
                <Dialog
                    open={bulkDeleteOpen}
                    onClose={() => setBulkDeleteOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Warning color="error" />
                        Confirm Bulk Delete
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete {selectedOrders.size} orders? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setBulkDeleteOpen(false)} disabled={deleting}>
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmBulkDelete}
                            color="error"
                            variant="contained"
                            disabled={deleting}
                            startIcon={deleting ? <CircularProgress size={16} /> : <Delete />}
                        >
                            Delete {selectedOrders.size} Orders
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Comprehensive Career Details Dialog */}
                <Dialog
                    open={comprehensiveDetailOpen}
                    onClose={handleCloseComprehensiveDetails}
                    maxWidth="xl"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            height: '90vh',
                            maxHeight: '900px'
                        }
                    }}
                >
                    <DialogTitle sx={{
                        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <Assessment />
                        <Box>
                            <Typography variant="h5" component="div" fontWeight={700}>
                                Career Accelerator - Comprehensive Details
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Order #{comprehensiveData?.order?.id} • Complete Career Strategy Overview
                            </Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
                        {loadingComprehensive ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                                <CircularProgress size={40} />
                                <Typography sx={{ ml: 2 }}>Loading comprehensive details...</Typography>
                            </Box>
                        ) : comprehensiveData ? (
                            <Box sx={{ height: '100%', overflow: 'auto', p: 3 }}>
                                <Grid container spacing={3}>
                                    {/* Left Column - Resume & Analysis */}
                                    <Grid item xs={12} lg={6}>
                                        {/* Resume Section */}
                                        <Accordion defaultExpanded sx={{ mb: 2 }}>
                                            <AccordionSummary expandIcon={<ExpandMore />} sx={{
                                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Description color="primary" />
                                                    <Typography variant="h6" fontWeight={600}>
                                                        Resume & Analysis
                                                    </Typography>
                                                    {comprehensiveData.resume_download_info && (
                                                        <Badge badgeContent="PDF" color="success" />
                                                    )}
                                                </Box>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {comprehensiveData.resume_download_info ? (
                                                    <Box>
                                                        <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                <Box>
                                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                                        {comprehensiveData.resume_download_info.filename}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        Size: {(comprehensiveData.resume_download_info.file_size / 1024 / 1024).toFixed(2)} MB
                                                                    </Typography>
                                                                </Box>
                                                                <Link
                                                                    href={comprehensiveData.resume_download_info.download_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    sx={{ textDecoration: 'none' }}
                                                                >
                                                                    <DotBridgeButton
                                                                        variant="contained"
                                                                        size="small"
                                                                        startIcon={<Download />}
                                                                    >
                                                                        Download Resume
                                                                    </DotBridgeButton>
                                                                </Link>
                                                            </Box>
                                                        </Card>

                                                        {comprehensiveData.resume_analysis?.analysis_results && (
                                                            <Card variant="outlined" sx={{ p: 2 }}>
                                                                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                                                    AI Analysis Results
                                                                </Typography>
                                                                <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                                                                    <pre style={{
                                                                        whiteSpace: 'pre-wrap',
                                                                        fontSize: '0.875rem',
                                                                        margin: 0,
                                                                        fontFamily: 'inherit'
                                                                    }}>
                                                                        {JSON.stringify(comprehensiveData.resume_analysis.analysis_results, null, 2)}
                                                                    </pre>
                                                                </Box>
                                                            </Card>
                                                        )}
                                                    </Box>
                                                ) : (
                                                    <Alert severity="info">No resume file available for this order</Alert>
                                                )}
                                            </AccordionDetails>
                                        </Accordion>

                                        {/* Career Lead Information */}
                                        <Accordion defaultExpanded sx={{ mb: 2 }}>
                                            <AccordionSummary expandIcon={<ExpandMore />} sx={{
                                                bgcolor: alpha(theme.palette.secondary.main, 0.05),
                                                '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.1) }
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Person color="secondary" />
                                                    <Typography variant="h6" fontWeight={600}>
                                                        Lead Information
                                                    </Typography>
                                                </Box>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {comprehensiveData.career_lead ? (
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={6}>
                                                            <Typography variant="body2" color="text.secondary">Name</Typography>
                                                            <Typography variant="body1" fontWeight={500}>
                                                                {comprehensiveData.career_lead.name || 'Not provided'}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <Typography variant="body2" color="text.secondary">Phone</Typography>
                                                            <Typography variant="body1" fontWeight={500}>
                                                                {comprehensiveData.career_lead.phone || 'Not provided'}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Typography variant="body2" color="text.secondary">LinkedIn URL</Typography>
                                                            <Typography variant="body1" fontWeight={500}>
                                                                {comprehensiveData.career_lead.linkedin_url ? (
                                                                    <Link href={comprehensiveData.career_lead.linkedin_url} target="_blank" rel="noopener noreferrer">
                                                                        {comprehensiveData.career_lead.linkedin_url}
                                                                    </Link>
                                                                ) : 'Not provided'}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <Typography variant="body2" color="text.secondary">Target Job Title</Typography>
                                                            <Typography variant="body1" fontWeight={500}>
                                                                {comprehensiveData.career_lead.target_job_title || 'Not specified'}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <Typography variant="body2" color="text.secondary">Urgency</Typography>
                                                            <Typography variant="body1" fontWeight={500}>
                                                                {comprehensiveData.career_lead.urgency || 'Not specified'}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Typography variant="body2" color="text.secondary">Biggest Challenge</Typography>
                                                            <Typography variant="body1" sx={{ mt: 0.5 }}>
                                                                {comprehensiveData.career_lead.biggest_challenge || 'Not specified'}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                ) : (
                                                    <Alert severity="info">No lead information available</Alert>
                                                )}
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>

                                    {/* Right Column - Career Strategy & Conversations */}
                                    <Grid item xs={12} lg={6}>
                                        {/* Career Strategy Ticket */}
                                        <Accordion defaultExpanded sx={{ mb: 2 }}>
                                            <AccordionSummary expandIcon={<ExpandMore />} sx={{
                                                bgcolor: alpha(theme.palette.success.main, 0.05),
                                                '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.1) }
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Business color="success" />
                                                    <Typography variant="h6" fontWeight={600}>
                                                        Career Strategy Ticket
                                                    </Typography>
                                                </Box>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {comprehensiveData.order?.service_ticket?.career_ticket_data ? (
                                                    <Box>
                                                        <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                                                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                                                Strategy Summary
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ mb: 2 }}>
                                                                {comprehensiveData.order.service_ticket.career_ticket_data.strategy_summary}
                                                            </Typography>

                                                            {comprehensiveData.order.service_ticket.career_ticket_data.client_info && (
                                                                <>
                                                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                                                        Key Challenges
                                                                    </Typography>
                                                                    <List dense>
                                                                        {comprehensiveData.order.service_ticket.career_ticket_data.client_info.key_challenges?.map((challenge, index) => (
                                                                            <ListItem key={index} sx={{ pl: 0 }}>
                                                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                                                    <Chip label={index + 1} size="small" color="error" />
                                                                                </ListItemIcon>
                                                                                <ListItemText primary={challenge} />
                                                                            </ListItem>
                                                                        ))}
                                                                    </List>
                                                                </>
                                                            )}
                                                        </Card>

                                                        {/* Finalized Goals */}
                                                        {comprehensiveData.order.service_ticket.finalized_goals && (
                                                            <Card variant="outlined" sx={{ p: 2 }}>
                                                                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                                                    Finalized Goals
                                                                </Typography>
                                                                <Grid container spacing={2}>
                                                                    <Grid item xs={12}>
                                                                        <Typography variant="body2" color="text.secondary">Target Roles</Typography>
                                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                                                            {comprehensiveData.order.service_ticket.finalized_goals.target_roles?.map((role, index) => (
                                                                                <Chip key={index} label={role} size="small" variant="outlined" />
                                                                            )) || <Typography variant="body2" color="text.secondary">None specified</Typography>}
                                                                        </Box>
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <Typography variant="body2" color="text.secondary">Target Locations</Typography>
                                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                                                            {comprehensiveData.order.service_ticket.finalized_goals.target_locations?.map((location, index) => (
                                                                                <Chip key={index} label={location} size="small" variant="outlined" color="secondary" />
                                                                            )) || <Typography variant="body2" color="text.secondary">None specified</Typography>}
                                                                        </Box>
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={6}>
                                                                        <Typography variant="body2" color="text.secondary">Salary Goal</Typography>
                                                                        <Typography variant="body1" fontWeight={500}>
                                                                            {comprehensiveData.order.service_ticket.finalized_goals.salary_goal || 'Not specified'}
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <Typography variant="body2" color="text.secondary">Additional Notes</Typography>
                                                                        <Typography variant="body1">
                                                                            {comprehensiveData.order.service_ticket.finalized_goals.notes || 'No additional notes'}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Card>
                                                        )}
                                                    </Box>
                                                ) : (
                                                    <Alert severity="info">No career strategy ticket available</Alert>
                                                )}
                                            </AccordionDetails>
                                        </Accordion>

                                        {/* Conversation Logs */}
                                        <Accordion sx={{ mb: 2 }}>
                                            <AccordionSummary expandIcon={<ExpandMore />} sx={{
                                                bgcolor: alpha(theme.palette.warning.main, 0.05),
                                                '&:hover': { bgcolor: alpha(theme.palette.warning.main, 0.1) }
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chat color="warning" />
                                                    <Typography variant="h6" fontWeight={600}>
                                                        AI Conversation Logs
                                                    </Typography>
                                                    <Badge badgeContent={comprehensiveData.conversation_logs?.length || 0} color="warning" />
                                                </Box>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {comprehensiveData.conversation_logs && comprehensiveData.conversation_logs.length > 0 ? (
                                                    <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                                                        {comprehensiveData.conversation_logs.map((log, index) => (
                                                            <Card key={index} variant="outlined" sx={{ mb: 1, p: 2 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                    <Chip
                                                                        label={log.role}
                                                                        size="small"
                                                                        color={log.role === 'agent' ? 'primary' : 'secondary'}
                                                                        sx={{ mr: 1 }}
                                                                    />
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {new Date(log.timestamp).toLocaleString()}
                                                                    </Typography>
                                                                </Box>
                                                                <Typography variant="body2" sx={{
                                                                    whiteSpace: 'pre-wrap',
                                                                    maxHeight: 100,
                                                                    overflow: 'auto'
                                                                }}>
                                                                    {log.message}
                                                                </Typography>
                                                            </Card>
                                                        ))}
                                                    </Box>
                                                ) : (
                                                    <Alert severity="info">No conversation logs available</Alert>
                                                )}
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>

                                    {/* Full Width - Order Summary */}
                                    <Grid item xs={12}>
                                        <Card variant="outlined" sx={{ p: 3, background: alpha(theme.palette.primary.main, 0.02) }}>
                                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                                Order Summary
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Typography variant="body2" color="text.secondary">Order ID</Typography>
                                                    <Typography variant="h6" fontWeight={600}>#{comprehensiveData.order.id}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Typography variant="body2" color="text.secondary">Amount</Typography>
                                                    <Typography variant="h6" fontWeight={600} color="success.main">
                                                        ${comprehensiveData.order.payment_amount_dollars}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Typography variant="body2" color="text.secondary">Status</Typography>
                                                    <Chip
                                                        label={comprehensiveData.order.status.replace('_', ' ').toUpperCase()}
                                                        color={getStatusColor(comprehensiveData.order.status)}
                                                        size="small"
                                                        sx={{ mt: 0.5 }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <Typography variant="body2" color="text.secondary">Due Date</Typography>
                                                    <Typography variant="body1" fontWeight={500}>
                                                        {comprehensiveData.order.due_date ? formatDate(comprehensiveData.order.due_date) : 'Not set'}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        ) : (
                            <Alert severity="error">Failed to load comprehensive details</Alert>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3, background: alpha(theme.palette.grey[100], 0.5) }}>
                        <DotBridgeButton
                            variant="outlined"
                            onClick={handleCloseComprehensiveDetails}
                        >
                            Close
                        </DotBridgeButton>
                        {comprehensiveData?.order && (
                            <DotBridgeButton
                                variant="contained"
                                startIcon={<Edit />}
                                onClick={() => {
                                    handleCloseComprehensiveDetails();
                                    navigate(`/admin/client/${comprehensiveData.order.client_id}/dashboard`);
                                }}
                            >
                                Manage Client
                            </DotBridgeButton>
                        )}
                    </DialogActions>
                </Dialog>

                {/* Notification Snackbar */}
                <Snackbar
                    open={notification.open}
                    autoHideDuration={4000}
                    onClose={() => setNotification(prev => ({ ...prev, open: false }))}
                    TransitionComponent={Slide}
                    TransitionProps={{ direction: 'up' }}
                >
                    <Alert
                        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
                        severity={notification.severity}
                        sx={{ width: '100%' }}
                    >
                        {notification.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default AdminDashboard; 