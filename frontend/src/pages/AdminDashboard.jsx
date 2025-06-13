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
    AppBar
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
    ViewList
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { api } from '../api';
import DotBridgeCard, { CardContent, CardHeader } from '../components/DotBridgeCard';
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


    useEffect(() => {
        fetchOrders();
        fetchAnalytics();
        fetchOffers();
    }, [filters]);

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
        } catch (error) {
            console.error('Error updating order:', error);
        }
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
                                <DotBridgeCard variant="elevated">
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" color="primary.main" sx={{ mb: 1 }}>
                                            {analytics.total_orders}
                                        </Typography>
                                        <Typography color="text.secondary" variant="body2">
                                            Total Orders
                                        </Typography>
                                    </CardContent>
                                </DotBridgeCard>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <DotBridgeCard variant="elevated">
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" color="error.main" sx={{ mb: 1 }}>
                                            {analytics.orders_by_status.new}
                                        </Typography>
                                        <Typography color="text.secondary" variant="body2">
                                            New Orders
                                        </Typography>
                                    </CardContent>
                                </DotBridgeCard>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <DotBridgeCard variant="elevated">
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" color="warning.main" sx={{ mb: 1 }}>
                                            {analytics.orders_by_status.in_progress}
                                        </Typography>
                                        <Typography color="text.secondary" variant="body2">
                                            In Progress
                                        </Typography>
                                    </CardContent>
                                </DotBridgeCard>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <DotBridgeCard variant="elevated">
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" color="success.main" sx={{ mb: 1 }}>
                                            ${analytics.total_revenue_dollars.toLocaleString()}
                                        </Typography>
                                        <Typography color="text.secondary" variant="body2">
                                            Total Revenue
                                        </Typography>
                                    </CardContent>
                                </DotBridgeCard>
                            </Grid>
                        </Grid>
                    )}

                    {/* Filters */}
                    <DotBridgeCard sx={{ mb: 3 }}>
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
                                    >
                                        Refresh
                                    </DotBridgeButton>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </DotBridgeCard>

                    {/* Orders Table */}
                    <DotBridgeCard>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Offer</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Order Date</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                                <CircularProgress />
                                            </TableCell>
                                        </TableRow>
                                    ) : orders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                                <Typography color="text.secondary">No orders found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        orders.map((order) => {
                                            const daysUntilDue = calculateDaysUntilDue(order.due_date);
                                            return (
                                                <TableRow key={order.id} hover>
                                                    <TableCell>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {order.client?.email || 'Unknown'}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ID: {order.client_id}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Typography variant="body2">
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
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <DotBridgeButton
                                                                variant="contained"
                                                                size="small"
                                                                startIcon={<Edit />}
                                                                onClick={() => navigate(`/admin/client/${order.client_id}/dashboard`)}
                                                            >
                                                                Manage Client
                                                            </DotBridgeButton>
                                                            <DotBridgeButton
                                                                variant="outlined"
                                                                size="small"
                                                                startIcon={<Visibility />}
                                                                onClick={() => fetchOrderDetail(order.id)}
                                                            >
                                                                Quick View
                                                            </DotBridgeButton>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DotBridgeCard>
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
                <DotBridgeCard sx={{ mb: 3 }}>
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
                </DotBridgeCard>

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
                                    <DotBridgeCard variant="elevated" sx={{ mb: 2 }}>
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
                                    </DotBridgeCard>

                                    {/* Quick Actions */}
                                    <DotBridgeCard variant="elevated">
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                                Quick Actions
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
                                            </Box>
                                        </CardContent>
                                    </DotBridgeCard>
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
            </Container>
        </Box>
    );
};

export default AdminDashboard; 