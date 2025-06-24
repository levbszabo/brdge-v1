import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Chip,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Checkbox,
    Divider,
    Avatar,
    IconButton,
    Tooltip,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
    AppBar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    keyframes,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TextField,
    Backdrop,
    Menu,
    ListItemButton,
    Switch,
    Collapse,
    Fab,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    ButtonGroup,
    Card,
    CardActions,
    Popover,
    Paper,
    Stack
} from '@mui/material';
import {
    CheckCircle,
    Schedule,
    Download,
    PlayArrow,
    Assignment,
    Business,
    Email,
    LinkedIn,
    ContentCopy,
    Support,
    TrendingUp,
    Star,
    GetApp,
    AdminPanelSettings,
    Dashboard,
    AccountBox,
    Upload,
    CloudUpload,
    VideoLibrary,
    Analytics,
    ManageAccounts,
    Edit,
    Delete,
    Add,
    FilterList,
    MoreVert,
    Visibility,
    VisibilityOff,
    CheckBox,
    CheckBoxOutlineBlank,
    Settings,
    SaveAlt,
    Refresh,
    Close,
    ExpandMore,
    ExpandLess
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { api } from '../api';
import DotBridgeCard, { CardContent, CardHeader } from '../components/DotBridgeCard';
import DotBridgeButton from '../components/DotBridgeButton';
import AgentConnector from '../components/AgentConnector';

// Premium animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(0, 102, 255, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(0, 102, 255, 0.4), 0 0 40px rgba(0, 102, 255, 0.2);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const ClientDashboard = ({ adminViewData = null }) => {
    const theme = useTheme();

    // Enhanced 14-day action plan data (in real implementation, this would come from the service ticket)
    const mockActionPlan = [
        {
            week: 1,
            title: "Foundation Week",
            days: [
                {
                    day: 1,
                    date: "Mon",
                    title: "Resume & LinkedIn Optimization",
                    priority: "high",
                    estimatedTime: "3-4 hours",
                    tasks: [
                        { id: "day1_task1", text: "Update resume with provided template", priority: "high" },
                        { id: "day1_task2", text: "Optimize LinkedIn headline and summary", priority: "high" },
                        { id: "day1_task3", text: "Add 5 new skills to profile", priority: "medium" }
                    ]
                },
                {
                    day: 2,
                    date: "Tue",
                    title: "Research & Target List Building",
                    priority: "high",
                    estimatedTime: "2-3 hours",
                    tasks: [
                        { id: "day2_task1", text: "Review opportunity matrix", priority: "high" },
                        { id: "day2_task2", text: "Identify top 10 priority companies", priority: "high" },
                        { id: "day2_task3", text: "Find 3 contacts at each company", priority: "medium" }
                    ]
                },
                {
                    day: 3,
                    date: "Wed",
                    title: "Email Template Preparation",
                    priority: "medium",
                    estimatedTime: "2 hours",
                    tasks: [
                        { id: "day3_task1", text: "Customize provided email templates", priority: "high" },
                        { id: "day3_task2", text: "Practice personalization techniques", priority: "medium" },
                        { id: "day3_task3", text: "Set up email tracking system", priority: "low" }
                    ]
                },
                {
                    day: 4,
                    date: "Thu",
                    title: "First Outreach Wave",
                    priority: "high",
                    estimatedTime: "3 hours",
                    tasks: [
                        { id: "day4_task1", text: "Send 5 personalized emails", priority: "high" },
                        { id: "day4_task2", text: "Connect with 10 people on LinkedIn", priority: "medium" },
                        { id: "day4_task3", text: "Log all activities in tracking sheet", priority: "high" }
                    ]
                },
                {
                    day: 5,
                    date: "Fri",
                    title: "LinkedIn Engagement",
                    priority: "medium",
                    estimatedTime: "1-2 hours",
                    tasks: [
                        { id: "day5_task1", text: "Comment on 10 industry posts", priority: "medium" },
                        { id: "day5_task2", text: "Share relevant content", priority: "low" },
                        { id: "day5_task3", text: "Review and respond to messages", priority: "high" }
                    ]
                },
                {
                    day: 6,
                    date: "Sat",
                    title: "Weekend Research",
                    priority: "low",
                    estimatedTime: "1 hour",
                    tasks: [
                        { id: "day6_task1", text: "Research 5 additional companies", priority: "medium" },
                        { id: "day6_task2", text: "Update target company notes", priority: "low" }
                    ]
                },
                {
                    day: 7,
                    date: "Sun",
                    title: "Week Review & Planning",
                    priority: "medium",
                    estimatedTime: "1 hour",
                    tasks: [
                        { id: "day7_task1", text: "Review week's progress", priority: "medium" },
                        { id: "day7_task2", text: "Plan next week's outreach", priority: "medium" }
                    ]
                }
            ]
        },
        {
            week: 2,
            title: "Acceleration Week",
            days: [
                {
                    day: 8,
                    date: "Mon",
                    title: "Follow-up & Expansion",
                    priority: "high",
                    estimatedTime: "3 hours",
                    tasks: [
                        { id: "day8_task1", text: "Follow up on Week 1 outreach", priority: "high" },
                        { id: "day8_task2", text: "Send 8 new personalized emails", priority: "high" },
                        { id: "day8_task3", text: "Apply to 3 relevant job postings", priority: "medium" }
                    ]
                },
                {
                    day: 9,
                    date: "Tue",
                    title: "Network Expansion",
                    priority: "medium",
                    estimatedTime: "2-3 hours",
                    tasks: [
                        { id: "day9_task1", text: "Reach out to 2nd degree connections", priority: "medium" },
                        { id: "day9_task2", text: "Engage with target company content", priority: "medium" },
                        { id: "day9_task3", text: "Send LinkedIn connection requests", priority: "low" }
                    ]
                },
                {
                    day: 10,
                    date: "Wed",
                    title: "Interview Preparation",
                    priority: "high",
                    estimatedTime: "2 hours",
                    tasks: [
                        { id: "day10_task1", text: "Practice common interview questions", priority: "high" },
                        { id: "day10_task2", text: "Research recent company news", priority: "medium" },
                        { id: "day10_task3", text: "Prepare STAR method examples", priority: "high" }
                    ]
                },
                {
                    day: 11,
                    date: "Thu",
                    title: "Advanced Outreach",
                    priority: "high",
                    estimatedTime: "3 hours",
                    tasks: [
                        { id: "day11_task1", text: "Send 10 personalized emails", priority: "high" },
                        { id: "day11_task2", text: "Try phone/video outreach to 2 contacts", priority: "medium" },
                        { id: "day11_task3", text: "Update all tracking data", priority: "high" }
                    ]
                },
                {
                    day: 12,
                    date: "Fri",
                    title: "Opportunity Review",
                    priority: "medium",
                    estimatedTime: "2 hours",
                    tasks: [
                        { id: "day12_task1", text: "Review all active conversations", priority: "high" },
                        { id: "day12_task2", text: "Schedule any pending calls", priority: "high" },
                        { id: "day12_task3", text: "Identify warm prospects", priority: "medium" }
                    ]
                },
                {
                    day: 13,
                    date: "Sat",
                    title: "Portfolio Enhancement",
                    priority: "low",
                    estimatedTime: "2 hours",
                    tasks: [
                        { id: "day13_task1", text: "Update portfolio/work samples", priority: "medium" },
                        { id: "day13_task2", text: "Create case study documents", priority: "low" }
                    ]
                },
                {
                    day: 14,
                    date: "Sun",
                    title: "Campaign Analysis",
                    priority: "medium",
                    estimatedTime: "1-2 hours",
                    tasks: [
                        { id: "day14_task1", text: "Analyze 2-week campaign results", priority: "high" },
                        { id: "day14_task2", text: "Plan ongoing strategy", priority: "medium" },
                        { id: "day14_task3", text: "Schedule check-in call", priority: "low" }
                    ]
                }
            ]
        }
    ];

    const mockOutreachTemplates = [
        {
            type: "email",
            title: "Initial Outreach Email",
            subject: "Quick question about [Company] engineering team",
            content: `Hi [Name],

I hope this email finds you well. I came across your profile and was impressed by [Company]'s work in [specific area].

I'm a [Your Title] with [X years] of experience in [relevant skills], and I'm particularly interested in opportunities at [Company] because [specific reason].

Would you be open to a brief 15-minute conversation about your team's current priorities and how someone with my background might contribute?

Best regards,
[Your Name]`
        },
        {
            type: "linkedin",
            title: "LinkedIn Connection Request",
            content: `Hi [Name], I'm interested in learning more about the engineering culture at [Company]. Would love to connect and hear about your experience there!`
        }
    ];

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [progress, setProgress] = useState({});

    // Admin fulfillment state
    const [bridges, setBridges] = useState([]);
    const [loadingBridges, setLoadingBridges] = useState(false);
    const [csvAnalyzing, setCsvAnalyzing] = useState(false);
    const [csvUploading, setCsvUploading] = useState(false);
    const [intelligenceTemplates, setIntelligenceTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [intelligenceRecords, setIntelligenceRecords] = useState([]);
    // New state for improved CSV handling
    const [csvPreview, setCsvPreview] = useState(null);
    const [csvAnalysisResult, setCsvAnalysisResult] = useState(null);
    const [showCsvPreviewDialog, setShowCsvPreviewDialog] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [csvTemplateSettings, setCsvTemplateSettings] = useState({
        name: '',
        selectedColumns: [],
        columnMappings: {}
    });

    // Admin editing state
    const [isEditingActionPlan, setIsEditingActionPlan] = useState(false);
    const [editableActionPlan, setEditableActionPlan] = useState(mockActionPlan);
    const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
    const [showEditDayDialog, setShowEditDayDialog] = useState(false);
    const [editingDay, setEditingDay] = useState(null);
    const [newTaskData, setNewTaskData] = useState({
        text: '',
        priority: 'medium'
    });
    const [showOutreachEditor, setShowOutreachEditor] = useState(false);
    const [editableOutreachTemplates, setEditableOutreachTemplates] = useState([]);
    const [outreachTemplates, setOutreachTemplates] = useState([]);
    const [loadingOutreachTemplates, setLoadingOutreachTemplates] = useState(false);

    // Intelligence data management state
    const [selectedRecords, setSelectedRecords] = useState(new Set());
    const [showIntelligenceActions, setShowIntelligenceActions] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [showColumnManager, setShowColumnManager] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState(new Set());
    const [showAddRecordDialog, setShowAddRecordDialog] = useState(false);
    const [newRecordData, setNewRecordData] = useState({});

    useEffect(() => {
        if (adminViewData) {
            // If admin view data is provided, use it directly
            setDashboardData(adminViewData);
            setLoading(false);

            // Convert progress array to object for easier lookup
            const progressMap = {};
            adminViewData.progress?.forEach(p => {
                const key = `${p.module_name}_${p.task_id}`;
                progressMap[key] = p;
            });
            setProgress(progressMap);
        } else {
            // Normal client view - fetch data
            fetchDashboardData();
        }
    }, [adminViewData]);

    // Load admin data when dashboard data is available and we're in admin view
    useEffect(() => {
        if (adminViewData?.admin_view && dashboardData?.order) {
            fetchAvailableBridges();
        }
        // Load intelligence templates for both admin and client views
        if (dashboardData?.order) {
            fetchIntelligenceTemplates();
            fetchOutreachTemplates();
        }
    }, [adminViewData?.admin_view, dashboardData?.order]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/dashboard/data');

            // DEBUG: Log the response to check welcome_bridge_id
            console.log('🔍 Dashboard API Response:', response.data);
            console.log('🎬 Order welcome_bridge_id:', response.data?.order?.welcome_bridge_id);
            console.log('🎯 Full order object:', response.data?.order);

            setDashboardData(response.data);

            // Convert progress array to object for easier lookup
            const progressMap = {};
            response.data.progress?.forEach(p => {
                const key = `${p.module_name}_${p.task_id}`;
                progressMap[key] = p;
            });
            setProgress(progressMap);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateProgress = async (module, taskId, completed) => {
        // Don't allow progress updates in admin view mode
        if (adminViewData?.admin_view) {
            return;
        }

        try {
            const response = await api.post('/dashboard/progress', {
                module,
                task_id: taskId,
                completed
            });

            const key = `${module}_${taskId}`;
            setProgress(prev => ({
                ...prev,
                [key]: response.data.progress
            }));
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // You could add a snackbar notification here
    };

    // Download asset function for Core Assets
    const downloadAsset = async (deliverable) => {
        try {
            console.log('Downloading asset:', deliverable.file_name);

            // Use the backend API to get the file and trigger download
            const response = await api.get(`/deliverables/${deliverable.id}/download`, {
                responseType: 'blob',
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', deliverable.file_name);
            document.body.appendChild(link);
            link.click();

            // Clean up
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error downloading asset:', error);

            // Fallback to the original URL if our API endpoint doesn't work
            if (deliverable.download_url) {
                const link = document.createElement('a');
                link.href = deliverable.download_url;
                link.setAttribute('download', deliverable.file_name);
                link.setAttribute('target', '_blank');
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                alert('❌ Failed to download file. Please contact support.');
            }
        }
    };

    // Export action plan function
    const exportActionPlan = () => {
        try {
            const actionPlanData = isEditingActionPlan ? editableActionPlan : mockActionPlan;

            // Create a comprehensive action plan export
            const exportData = {
                title: "14-Day Career Action Plan",
                client: user.email,
                exportDate: new Date().toISOString(),
                overallProgress: `${calculateOverallProgress()}%`,
                weeks: actionPlanData.map(week => ({
                    week: week.week,
                    title: week.title,
                    days: week.days.map(day => ({
                        day: day.day,
                        date: day.date,
                        title: day.title,
                        priority: day.priority,
                        estimatedTime: day.estimatedTime,
                        tasks: day.tasks.map(task => ({
                            text: task.text,
                            priority: task.priority,
                            completed: progress[`action_plan_${task.id}`]?.completed || false
                        }))
                    }))
                }))
            };

            // Export as JSON
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `action-plan-${user.email}-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);

            console.log('Action plan exported successfully');
        } catch (error) {
            console.error('Error exporting action plan:', error);
            alert('❌ Failed to export action plan');
        }
    };

    // Export intelligence data function (only current template)
    const exportIntelligenceData = () => {
        if (!selectedTemplate || intelligenceRecords.length === 0) {
            alert('No data to export. Please select a template with records.');
            return;
        }

        try {
            // Prepare CSV data
            const headers = selectedTemplate.columns.map(col => col.name);
            const csvData = [
                headers, // Header row
                ...intelligenceRecords.map(record =>
                    headers.map(header => {
                        const value = record.data[header] || '';
                        // Escape quotes and wrap in quotes if contains comma
                        return typeof value === 'string' && (value.includes(',') || value.includes('"'))
                            ? `"${value.replace(/"/g, '""')}"`
                            : value;
                    })
                )
            ];

            // Convert to CSV string
            const csvContent = csvData.map(row => row.join(',')).join('\n');

            // Create and download CSV file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${selectedTemplate.name.replace(/[^a-zA-Z0-9]/g, '_')}-${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            URL.revokeObjectURL(url);

            console.log(`Exported ${intelligenceRecords.length} records from ${selectedTemplate.name}`);
        } catch (error) {
            console.error('Error exporting intelligence data:', error);
            alert('❌ Failed to export intelligence data');
        }
    };

    const calculateOverallProgress = () => {
        if (!dashboardData?.order?.offer?.deliverables) return 0;

        const totalTasks = mockActionPlan.reduce((acc, week) => acc + week.days.reduce((dayAcc, day) => dayAcc + day.tasks.length, 0), 0);
        const completedTasks = Object.values(progress).filter(p => p.completed).length;

        return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    };

    // Admin fulfillment functions
    const fetchAvailableBridges = async () => {
        if (!adminViewData?.admin_view || !dashboardData?.order) return;

        try {
            setLoadingBridges(true);
            console.log('🎭 Fetching available bridges for order:', dashboardData.order.id);

            const response = await api.get(`/admin/orders/${dashboardData.order.id}/available-bridges`);
            console.log('✅ Bridges fetched:', response.data.bridges.length, 'bridges available');

            setBridges(response.data.bridges);
        } catch (error) {
            console.error('❌ Error fetching bridges:', error);
            console.error('Error details:', error.response?.data);
        } finally {
            setLoadingBridges(false);
        }
    };

    const updateWelcomeBridge = async (bridgeId) => {
        try {
            console.log('🎬 Updating welcome bridge:', {
                orderId: dashboardData.order.id,
                bridgeId: bridgeId,
                bridgeIdType: typeof bridgeId
            });

            const response = await api.put(`/admin/orders/${dashboardData.order.id}/welcome-bridge`, {
                bridge_id: bridgeId
            });

            console.log('✅ Welcome bridge update response:', response.data);

            // Update local state
            setDashboardData(prev => ({
                ...prev,
                order: {
                    ...prev.order,
                    welcome_bridge_id: bridgeId
                }
            }));

            // Show success message
            const bridgeName = bridges.find(b => b.id === bridgeId)?.name || `Bridge ${bridgeId}`;
            const message = bridgeId
                ? `✅ Welcome video set to: ${bridgeName}`
                : '✅ Welcome video removed';
            alert(message);

        } catch (error) {
            console.error('❌ Error updating welcome bridge:', error);
            console.error('Error details:', error.response?.data);
            const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
            alert(`❌ Failed to update welcome video: ${errorMessage}`);
        }
    };

    // LLM-powered CSV analysis function (similar to PersonalizationManager)
    const analyzeCSV = async (file) => {
        try {
            setCsvAnalyzing(true);
            console.log('📊 Starting LLM-powered CSV analysis:', file.name, file.size, 'bytes');

            const formData = new FormData();
            formData.append('file', file);

            console.log('📤 Sending CSV to backend for LLM analysis...');
            const response = await api.post(`/admin/orders/${dashboardData.order.id}/intelligence/analyze-csv`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.ok || response.status === 200) {
                const responseData = response.data;
                console.log('✅ LLM CSV analysis response:', responseData);

                // Extract the analysis data from the response
                const analysis = responseData.analysis;
                const preview = responseData.preview;
                const fileInfo = responseData.file_info;

                // Set the preview and analysis data
                setCsvPreview(preview);
                setCsvAnalysisResult(analysis);
                setCsvFile(file);
                setCsvTemplateSettings({
                    name: analysis.suggested_template_name || `${file.name.replace('.csv', '')} - ${new Date().toLocaleDateString()}`,
                    selectedColumns: analysis.columns?.map(col => col.name) || [],
                    columnMappings: {}
                });

                setShowCsvPreviewDialog(true);
                return analysis;
            } else {
                const errorData = response.data;
                throw new Error(errorData.error || 'Failed to analyze CSV');
            }
        } catch (error) {
            console.error('❌ Error analyzing CSV:', error);
            console.error('Error details:', error.response?.data);
            throw error;
        } finally {
            setCsvAnalyzing(false);
        }
    };

    // LLM-powered CSV intelligence creation (similar to PersonalizationManager)
    const createIntelligenceFromCSV = async (file, templateName, selectedColumns, columnMappings) => {
        try {
            setCsvUploading(true);
            console.log('📝 Creating intelligence template with LLM analysis:', {
                templateName,
                selectedColumns,
                recordCount: csvAnalysisResult?.row_count
            });

            const formData = new FormData();
            formData.append('file', file);
            formData.append('template_name', templateName);

            // Send the filtered columns based on selected columns
            const selectedColumnData = csvAnalysisResult?.columns?.filter(col =>
                selectedColumns.includes(col.name)
            ) || [];
            formData.append('columns', JSON.stringify(selectedColumnData));

            console.log('📤 Sending LLM-analyzed CSV data to backend...');
            const response = await api.post(`/admin/orders/${dashboardData.order.id}/intelligence/create-from-csv`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('✅ Intelligence creation response:', response.data);

            // Refresh intelligence templates
            await fetchIntelligenceTemplates();

            // Reset state
            setShowCsvPreviewDialog(false);
            setCsvPreview(null);
            setCsvAnalysisResult(null);
            setCsvFile(null);
            setCsvTemplateSettings({ name: '', selectedColumns: [], columnMappings: {} });

            return response.data;
        } catch (error) {
            console.error('❌ Error creating intelligence from CSV:', error);
            console.error('Error details:', error.response?.data);
            throw error;
        } finally {
            setCsvUploading(false);
        }
    };

    const fetchIntelligenceTemplates = async () => {
        if (!dashboardData?.order) return;

        try {
            let response;
            console.log('🔍 Fetching intelligence templates...', {
                isAdminView: !!adminViewData?.admin_view,
                orderId: dashboardData.order.id
            });

            if (adminViewData?.admin_view) {
                // Admin view - use admin endpoint
                console.log('📋 Using admin endpoint for templates');
                response = await api.get(`/admin/orders/${dashboardData.order.id}/intelligence/templates`);
            } else {
                // Client view - try client endpoint first, fallback to admin if needed
                console.log('👤 Using client endpoint for templates');
                try {
                    response = await api.get(`/orders/${dashboardData.order.id}/intelligence/templates`);
                    console.log('✅ Client endpoint worked');
                } catch (clientError) {
                    console.log('❌ Client endpoint failed:', clientError.response?.status, clientError.response?.data);
                    if (clientError.response?.status === 404) {
                        console.log('🔄 Trying admin endpoint as fallback...');
                        // Client endpoint doesn't exist, try admin endpoint with client's own data
                        response = await api.get(`/admin/orders/${dashboardData.order.id}/intelligence/templates`);
                        console.log('✅ Admin fallback worked');
                    } else {
                        throw clientError;
                    }
                }
            }

            console.log('📊 Intelligence templates response:', response.data);
            setIntelligenceTemplates(response.data.templates || []);

            // Auto-select first template if only one exists
            if (response.data.templates?.length === 1 && !selectedTemplate) {
                const firstTemplate = response.data.templates[0];
                setSelectedTemplate(firstTemplate);
                fetchIntelligenceRecords(firstTemplate.id);
            }
        } catch (error) {
            console.error('💥 Error fetching intelligence templates:', {
                error: error.message,
                status: error.response?.status,
                data: error.response?.data,
                isAdminView: !!adminViewData?.admin_view
            });
            // Set empty array on error so UI shows "no data" instead of loading forever
            setIntelligenceTemplates([]);
        }
    };

    const fetchIntelligenceRecords = async (templateId) => {
        try {
            let response;
            // Request a very high limit to get all records
            const params = new URLSearchParams({
                limit: '10000' // High limit to effectively get all records
            });

            if (adminViewData?.admin_view) {
                // Admin view - use admin endpoint
                response = await api.get(`/admin/orders/${dashboardData.order.id}/intelligence/templates/${templateId}/records?${params}`);
            } else {
                // Client view - try client endpoint first, fallback to admin if needed
                try {
                    response = await api.get(`/orders/${dashboardData.order.id}/intelligence/templates/${templateId}/records?${params}`);
                } catch (clientError) {
                    if (clientError.response?.status === 404) {
                        // Client endpoint doesn't exist, try admin endpoint with client's own data
                        response = await api.get(`/admin/orders/${dashboardData.order.id}/intelligence/templates/${templateId}/records?${params}`);
                    } else {
                        throw clientError;
                    }
                }
            }

            setIntelligenceRecords(response.data.records || []);
            setSelectedTemplate(response.data.template);

            // Debug: Log the fetched records to see their status structure
            console.log('🔍 Fetched intelligence records:', response.data.records?.slice(0, 3).map(r => ({
                id: r.id,
                data: r.data,
                validation_status: r.validation_status,
                effective_status: r.data?.status || r.validation_status
            })));

            // Log if we might have hit a limit
            if (response.data.pagination && response.data.pagination.has_next) {
                console.warn(`⚠️ There are more records than the current limit. Total records: ${response.data.pagination.total}`);
            }
        } catch (error) {
            console.error('Error fetching intelligence records:', error);
            // Set empty array on error
            setIntelligenceRecords([]);
        }
    };

    const fetchOutreachTemplates = async () => {
        if (!dashboardData?.order) return;

        setLoadingOutreachTemplates(true);
        try {
            let response;
            console.log('🔍 Fetching outreach templates...', {
                isAdminView: !!adminViewData?.admin_view,
                orderId: dashboardData.order.id
            });

            if (adminViewData?.admin_view) {
                // Admin view - use admin endpoint
                console.log('📋 Using admin endpoint for outreach templates');
                response = await api.get(`/admin/orders/${dashboardData.order.id}/outreach-templates`);
            } else {
                // Client view - try client endpoint first, fallback to admin if needed
                console.log('👤 Using client endpoint for outreach templates');
                try {
                    response = await api.get(`/orders/${dashboardData.order.id}/outreach-templates`);
                    console.log('✅ Client endpoint worked');
                } catch (clientError) {
                    console.log('❌ Client endpoint failed:', clientError.response?.status, clientError.response?.data);
                    if (clientError.response?.status === 404) {
                        console.log('🔄 Trying admin endpoint as fallback...');
                        // Client endpoint doesn't exist, try admin endpoint with client's own data
                        response = await api.get(`/admin/orders/${dashboardData.order.id}/outreach-templates`);
                        console.log('✅ Admin fallback worked');
                    } else {
                        throw clientError;
                    }
                }
            }

            console.log('📊 Outreach templates response:', response.data);
            const templates = response.data.templates || [];
            setOutreachTemplates(templates);
            setEditableOutreachTemplates([...templates]);

        } catch (error) {
            console.error('💥 Error fetching outreach templates:', {
                error: error.message,
                status: error.response?.status,
                data: error.response?.data,
                isAdminView: !!adminViewData?.admin_view
            });
            // Set empty array on error so UI shows "no data" instead of loading forever
            setOutreachTemplates([]);
            setEditableOutreachTemplates([]);
        } finally {
            setLoadingOutreachTemplates(false);
        }
    };

    // Admin editing functions
    const handleEditActionPlan = () => {
        setIsEditingActionPlan(true);
        setEditableActionPlan(JSON.parse(JSON.stringify(mockActionPlan))); // Deep copy
    };

    const handleSaveActionPlan = async () => {
        try {
            // In a real implementation, this would save to the backend
            console.log('Saving action plan:', editableActionPlan);

            // For now, just update the local state
            // You would implement actual API call here

            setIsEditingActionPlan(false);
            alert('✅ Action plan saved successfully!');
        } catch (error) {
            console.error('Error saving action plan:', error);
            alert('❌ Failed to save action plan');
        }
    };

    const handleCancelEditActionPlan = () => {
        setIsEditingActionPlan(false);
        setEditableActionPlan(mockActionPlan); // Reset to original
    };

    const handleAddTask = (weekIndex, dayIndex) => {
        setEditingDay({ weekIndex, dayIndex });
        setNewTaskData({ text: '', priority: 'medium' });
        setShowAddTaskDialog(true);
    };

    const handleSaveNewTask = () => {
        if (!newTaskData.text.trim()) {
            alert('Please enter a task description');
            return;
        }

        const newTask = {
            id: `custom_task_${Date.now()}`,
            text: newTaskData.text,
            priority: newTaskData.priority
        };

        const updatedPlan = [...editableActionPlan];
        updatedPlan[editingDay.weekIndex].days[editingDay.dayIndex].tasks.push(newTask);
        setEditableActionPlan(updatedPlan);

        setShowAddTaskDialog(false);
        setNewTaskData({ text: '', priority: 'medium' });
        setEditingDay(null);
    };

    const handleDeleteTask = (weekIndex, dayIndex, taskIndex) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            const updatedPlan = [...editableActionPlan];
            updatedPlan[weekIndex].days[dayIndex].tasks.splice(taskIndex, 1);
            setEditableActionPlan(updatedPlan);
        }
    };

    const handleEditTask = (weekIndex, dayIndex, taskIndex, newText) => {
        const updatedPlan = [...editableActionPlan];
        updatedPlan[weekIndex].days[dayIndex].tasks[taskIndex].text = newText;
        setEditableActionPlan(updatedPlan);
    };

    const handleEditDayDetails = (weekIndex, dayIndex) => {
        setEditingDay({ weekIndex, dayIndex });
        setShowEditDayDialog(true);
    };

    const handleSaveDayDetails = (updatedDay) => {
        const updatedPlan = [...editableActionPlan];
        updatedPlan[editingDay.weekIndex].days[editingDay.dayIndex] = {
            ...updatedPlan[editingDay.weekIndex].days[editingDay.dayIndex],
            ...updatedDay
        };
        setEditableActionPlan(updatedPlan);
        setShowEditDayDialog(false);
        setEditingDay(null);
    };

    const uploadAsset = async (file, assetType) => {
        if (!dashboardData?.order) return;

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('deliverable_type', assetType);

            const response = await api.post(`/admin/orders/${dashboardData.order.id}/deliverables`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Asset uploaded successfully:', response.data);

            // Refresh dashboard data to show new asset
            if (!adminViewData) {
                await fetchDashboardData();
            }

            alert(`✅ ${assetType} uploaded successfully!`);
            return response.data;
        } catch (error) {
            console.error('Error uploading asset:', error);
            alert(`❌ Failed to upload ${assetType}`);
            throw error;
        }
    };

    const deleteAsset = async (deliverableId) => {
        if (!dashboardData?.order || !adminViewData?.admin_view) return;

        const confirmDelete = window.confirm('Are you sure you want to delete this asset? This action cannot be undone.');
        if (!confirmDelete) return;

        try {
            await api.delete(`/admin/orders/${dashboardData.order.id}/deliverables/${deliverableId}`);

            console.log('Asset deleted successfully');

            // Refresh dashboard data to remove deleted asset
            if (!adminViewData) {
                await fetchDashboardData();
            } else {
                // Update local state for admin view
                setDashboardData(prev => ({
                    ...prev,
                    deliverables: prev.deliverables.filter(d => d.id !== deliverableId)
                }));
            }

            alert('✅ Asset deleted successfully!');
        } catch (error) {
            console.error('Error deleting asset:', error);
            alert('❌ Failed to delete asset');
        }
    };

    const handleEditOutreachTemplate = (templateIndex, field, value) => {
        const updatedTemplates = [...editableOutreachTemplates];
        updatedTemplates[templateIndex] = {
            ...updatedTemplates[templateIndex],
            [field]: value
        };
        setEditableOutreachTemplates(updatedTemplates);
    };

    const handleAddOutreachTemplate = () => {
        const newTemplate = {
            id: null, // New template, no ID yet
            title: "New Template",
            subject: "",
            content: "Add your template content here...",
            template_type: "email",
            position: editableOutreachTemplates.length
        };
        setEditableOutreachTemplates([...editableOutreachTemplates, newTemplate]);
    };

    const handleDeleteOutreachTemplate = (templateIndex) => {
        if (window.confirm('Are you sure you want to delete this template?')) {
            const updatedTemplates = editableOutreachTemplates.filter((_, index) => index !== templateIndex);
            setEditableOutreachTemplates(updatedTemplates);
        }
    };

    const handleSaveOutreachTemplates = async () => {
        if (!dashboardData?.order || !adminViewData?.admin_view) {
            alert('❌ Only admins can save outreach templates');
            return;
        }

        try {
            console.log('Saving outreach templates:', editableOutreachTemplates);

            // Use bulk update endpoint to save all templates
            const response = await api.put(`/admin/orders/${dashboardData.order.id}/outreach-templates/bulk-update`, {
                templates: editableOutreachTemplates.map(template => ({
                    id: template.id,
                    title: template.title,
                    subject: template.subject || '',
                    content: template.content,
                    template_type: template.template_type || template.type || 'email',
                    position: template.position || 0
                }))
            });

            if (response.data.success) {
                // Update local state with saved templates
                setOutreachTemplates(response.data.templates);
                setEditableOutreachTemplates([...response.data.templates]);
                setShowOutreachEditor(false);
                alert('✅ Outreach templates saved successfully!');
            } else {
                throw new Error(response.data.error || 'Failed to save templates');
            }
        } catch (error) {
            console.error('Error saving outreach templates:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Failed to save outreach templates';
            alert(`❌ ${errorMessage}`);
        }
    };

    const handleCancelEditOutreachTemplates = () => {
        setShowOutreachEditor(false);
        setEditableOutreachTemplates([...outreachTemplates]); // Reset to original loaded templates
    };

    // Intelligence Data Management Functions
    const handleSelectRecord = (recordId) => {
        const newSelected = new Set(selectedRecords);
        if (newSelected.has(recordId)) {
            newSelected.delete(recordId);
        } else {
            newSelected.add(recordId);
        }
        setSelectedRecords(newSelected);
    };

    const handleSelectAllRecords = () => {
        if (selectedRecords.size === intelligenceRecords.length) {
            setSelectedRecords(new Set());
        } else {
            setSelectedRecords(new Set(intelligenceRecords.map(r => r.id)));
        }
    };

    const handleDeleteSelectedRecords = async () => {
        if (!adminViewData?.admin_view || selectedRecords.size === 0) return;

        const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedRecords.size} record(s)? This action cannot be undone.`);
        if (!confirmDelete) return;

        try {
            // Delete records one by one (could be optimized with bulk delete endpoint)
            const deletePromises = Array.from(selectedRecords).map(recordId =>
                api.delete(`/admin/orders/${dashboardData.order.id}/intelligence/records/${recordId}`)
            );

            await Promise.all(deletePromises);

            // Refresh records
            if (selectedTemplate) {
                await fetchIntelligenceRecords(selectedTemplate.id);
            }

            setSelectedRecords(new Set());
            alert(`✅ Successfully deleted ${selectedRecords.size} record(s)`);
        } catch (error) {
            console.error('Error deleting records:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Failed to delete records';
            alert(`❌ ${errorMessage}`);
        }
    };

    const handleUpdateRecordStatus = async (recordId, newStatus) => {
        try {
            let endpoint;
            let payload;

            if (adminViewData?.admin_view) {
                // Admin endpoint - can update both data.status and validation_status
                endpoint = `/admin/orders/${dashboardData.order.id}/intelligence/records/${recordId}`;
                payload = {
                    data: {
                        ...intelligenceRecords.find(r => r.id === recordId)?.data,
                        status: newStatus
                    },
                    validation_status: newStatus
                };
            } else {
                // Client endpoint - update data.status
                endpoint = `/orders/${dashboardData.order.id}/intelligence/records/${recordId}`;
                payload = {
                    data: {
                        ...intelligenceRecords.find(r => r.id === recordId)?.data,
                        status: newStatus
                    }
                };
            }

            const response = await api.put(endpoint, payload);

            // Update local state with the response data to ensure consistency
            if (response.data.success && response.data.record) {
                setIntelligenceRecords(prev => prev.map(record =>
                    record.id === recordId
                        ? response.data.record
                        : record
                ));
            } else {
                // Fallback to manual update
                setIntelligenceRecords(prev => prev.map(record =>
                    record.id === recordId
                        ? {
                            ...record,
                            data: { ...record.data, status: newStatus },
                            validation_status: newStatus
                        }
                        : record
                ));
            }

            console.log(`✅ Updated record ${recordId} status to: ${newStatus}`);
        } catch (error) {
            console.error('Error updating record status:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Failed to update record status';
            alert(`❌ ${errorMessage}`);
        }
    };

    const handleBulkStatusUpdate = async (newStatus) => {
        if (selectedRecords.size === 0) return;

        // For clients, validate the status is allowed
        if (!adminViewData?.admin_view) {
            const allowedStatuses = ['pending', 'contacted', 'responded', 'qualified'];
            if (!allowedStatuses.includes(newStatus)) {
                alert('❌ You can only update records to: Pending, Contacted, Responded, or Qualified');
                return;
            }
        }

        try {
            const updatePromises = Array.from(selectedRecords).map(recordId =>
                handleUpdateRecordStatus(recordId, newStatus)
            );

            await Promise.all(updatePromises);
            setSelectedRecords(new Set());
            alert(`✅ Updated ${selectedRecords.size} record(s) to status: ${newStatus}`);
        } catch (error) {
            console.error('Error bulk updating status:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Failed to update record statuses';
            alert(`❌ ${errorMessage}`);
        }
    };

    const handleAddNewRecord = async () => {
        if (!adminViewData?.admin_view || !selectedTemplate) return;

        try {
            const response = await api.post(`/admin/orders/${dashboardData.order.id}/intelligence/records`, {
                template_id: selectedTemplate.id,
                data: newRecordData
            });

            // Refresh records
            await fetchIntelligenceRecords(selectedTemplate.id);

            setShowAddRecordDialog(false);
            setNewRecordData({});
            alert('✅ New record added successfully');
        } catch (error) {
            console.error('Error adding new record:', error);
            alert('❌ Failed to add new record');
        }
    };

    const initializeVisibleColumns = (template) => {
        if (template?.columns) {
            setVisibleColumns(new Set(template.columns.map(col => col.name)));
        }
    };

    const toggleColumnVisibility = (columnName) => {
        const newVisible = new Set(visibleColumns);
        if (newVisible.has(columnName)) {
            newVisible.delete(columnName);
        } else {
            newVisible.add(columnName);
        }
        setVisibleColumns(newVisible);
    };

    // Initialize visible columns when template changes
    useEffect(() => {
        if (selectedTemplate) {
            initializeVisibleColumns(selectedTemplate);
        }
    }, [selectedTemplate]);

    if (loading) {
        return (
            <Box sx={{ bgcolor: 'background.subtle', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (!dashboardData?.order) {
        return (
            <Box sx={{ bgcolor: 'background.subtle', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="xl">
                    <Alert severity="info">
                        No active orders found. Please contact support if you believe this is an error.
                    </Alert>
                </Container>
            </Box>
        );
    }

    const { user, order, deliverables } = dashboardData;

    const tabContent = [
        {
            label: 'Overview',
            icon: <Dashboard />,
            content: (
                <Box>
                    {/* Admin View Indicator */}
                    {adminViewData?.admin_view && (
                        <Alert severity="info" sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AdminPanelSettings />
                                <Typography variant="body2">
                                    Admin View - Viewing client dashboard for {user.email}
                                </Typography>
                            </Box>
                        </Alert>
                    )}

                    {/* Admin Fulfillment Panel */}
                    {adminViewData?.admin_view && (
                        <DotBridgeCard sx={{
                            mb: 3,
                            border: '2px solid #FF6B35',
                            background: 'linear-gradient(135deg, #FFF8F6 0%, #FFFFFF 100%)'
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <ManageAccounts sx={{ fontSize: '1.75rem', color: '#FF6B35', mr: 1.5 }} />
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF6B35', lineHeight: 1 }}>
                                                Client Fulfillment Center
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                Manage all aspects of {user.email}'s experience
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Chip
                                        label="ADMIN MODE"
                                        sx={{
                                            backgroundColor: '#FF6B35',
                                            color: 'white',
                                            fontWeight: 700,
                                            px: 2
                                        }}
                                    />
                                </Box>

                                <Grid container spacing={4}>
                                    {/* Welcome Video Management */}
                                    <Grid item xs={12} lg={4}>
                                        <Box sx={{
                                            p: 3,
                                            border: '1px solid #FED7CC',
                                            borderRadius: 2,
                                            backgroundColor: '#FFFBFA',
                                            height: '100%'
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <VideoLibrary sx={{ color: '#FF6B35', mr: 1 }} />
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    Welcome Video
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                                Set the personalized welcome video that greets this client
                                            </Typography>

                                            {loadingBridges ? (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                                                    <CircularProgress size={24} />
                                                </Box>
                                            ) : (
                                                <Box>
                                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                                        <InputLabel>Select Bridge</InputLabel>
                                                        <Select
                                                            value={order.welcome_bridge_id || ''}
                                                            label="Select Bridge"
                                                            onChange={(e) => updateWelcomeBridge(e.target.value || null)}
                                                            size="small"
                                                        >
                                                            <MenuItem value="">
                                                                <em>No welcome video</em>
                                                            </MenuItem>
                                                            {bridges.map((bridge) => (
                                                                <MenuItem key={bridge.id} value={bridge.id}>
                                                                    {bridge.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>

                                                    {order.welcome_bridge_id && (
                                                        <Alert severity="success" sx={{ mt: 1 }}>
                                                            <Typography variant="body2">
                                                                Active: Bridge {order.welcome_bridge_id}
                                                            </Typography>
                                                        </Alert>
                                                    )}
                                                </Box>
                                            )}
                                        </Box>
                                    </Grid>

                                    {/* Asset Management */}
                                    <Grid item xs={12} lg={4}>
                                        <Box sx={{
                                            p: 3,
                                            border: '1px solid #DBEAFE',
                                            borderRadius: 2,
                                            backgroundColor: '#F8FAFC',
                                            height: '100%'
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Upload sx={{ color: '#3B82F6', mr: 1 }} />
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    Asset Management
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                                Upload and manage client deliverables
                                            </Typography>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    id="resume-upload"
                                                    style={{ display: 'none' }}
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (!file) return;

                                                        try {
                                                            await uploadAsset(file, 'resume');
                                                        } catch (error) {
                                                            console.error('Error uploading resume:', error);
                                                        }

                                                        e.target.value = '';
                                                    }}
                                                />
                                                <label htmlFor="resume-upload">
                                                    <DotBridgeButton
                                                        variant="outlined"
                                                        component="span"
                                                        size="small"
                                                        startIcon={<Upload />}
                                                        fullWidth
                                                    >
                                                        Upload Resume
                                                    </DotBridgeButton>
                                                </label>

                                                <input
                                                    type="file"
                                                    accept=".xlsx,.csv"
                                                    id="opportunity-matrix-upload"
                                                    style={{ display: 'none' }}
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (!file) return;

                                                        try {
                                                            await uploadAsset(file, 'opportunity_matrix');
                                                        } catch (error) {
                                                            console.error('Error uploading opportunity matrix:', error);
                                                        }

                                                        e.target.value = '';
                                                    }}
                                                />
                                                <label htmlFor="opportunity-matrix-upload">
                                                    <DotBridgeButton
                                                        variant="outlined"
                                                        component="span"
                                                        size="small"
                                                        startIcon={<Upload />}
                                                        fullWidth
                                                    >
                                                        Upload Matrix
                                                    </DotBridgeButton>
                                                </label>

                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    id="templates-upload"
                                                    style={{ display: 'none' }}
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (!file) return;

                                                        try {
                                                            await uploadAsset(file, 'outreach_templates');
                                                        } catch (error) {
                                                            console.error('Error uploading templates:', error);
                                                        }

                                                        e.target.value = '';
                                                    }}
                                                />
                                                <label htmlFor="templates-upload">
                                                    <DotBridgeButton
                                                        variant="outlined"
                                                        component="span"
                                                        size="small"
                                                        startIcon={<Upload />}
                                                        fullWidth
                                                    >
                                                        Upload Templates
                                                    </DotBridgeButton>
                                                </label>
                                            </Box>

                                            {deliverables?.length > 0 && (
                                                <Alert severity="info" sx={{ mt: 2 }}>
                                                    <Typography variant="body2">
                                                        {deliverables.length} assets uploaded
                                                    </Typography>
                                                </Alert>
                                            )}
                                        </Box>
                                    </Grid>

                                    {/* Intelligence Data */}
                                    <Grid item xs={12} lg={4}>
                                        <Box sx={{
                                            p: 3,
                                            border: '1px solid #D1FAE5',
                                            borderRadius: 2,
                                            backgroundColor: '#F0FDF4',
                                            height: '100%'
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Analytics sx={{ color: '#10B981', mr: 1 }} />
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    Intelligence Data
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                                Upload CSV files for AI-powered processing
                                            </Typography>

                                            <input
                                                type="file"
                                                accept=".csv"
                                                id="csv-upload"
                                                style={{ display: 'none' }}
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;

                                                    // Validate file type
                                                    if (!file.name.toLowerCase().endsWith('.csv')) {
                                                        alert('Please select a CSV file');
                                                        e.target.value = '';
                                                        return;
                                                    }

                                                    // Validate file size (max 10MB)
                                                    if (file.size > 10 * 1024 * 1024) {
                                                        alert('File too large. Please select a CSV file smaller than 10MB');
                                                        e.target.value = '';
                                                        return;
                                                    }

                                                    try {
                                                        await analyzeCSV(file);
                                                    } catch (error) {
                                                        console.error('CSV analysis failed:', error);
                                                        const errorMessage = error.response?.data?.error || error.message || 'Failed to analyze CSV file';
                                                        alert(`❌ ${errorMessage}`);
                                                    }

                                                    e.target.value = '';
                                                }}
                                            />
                                            <label htmlFor="csv-upload">
                                                <DotBridgeButton
                                                    variant="contained"
                                                    component="span"
                                                    startIcon={csvAnalyzing || csvUploading ? <CircularProgress size={16} /> : <CloudUpload />}
                                                    disabled={csvAnalyzing || csvUploading}
                                                    fullWidth
                                                    sx={{ mb: 2 }}
                                                >
                                                    {csvAnalyzing ? 'Analyzing...' : csvUploading ? 'Uploading...' : 'Upload CSV'}
                                                </DotBridgeButton>
                                            </label>

                                            {intelligenceTemplates.length > 0 ? (
                                                <Alert severity="success">
                                                    <Typography variant="body2">
                                                        {intelligenceTemplates.length} intelligence templates active
                                                    </Typography>
                                                </Alert>
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">
                                                    No intelligence templates yet
                                                </Typography>
                                            )}
                                        </Box>
                                    </Grid>

                                    {/* Quick Actions */}
                                    <Grid item xs={12}>
                                        <Box sx={{
                                            p: 3,
                                            border: '1px solid #E5E7EB',
                                            borderRadius: 2,
                                            backgroundColor: '#F9FAFB'
                                        }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                                Quick Actions
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                                <DotBridgeButton
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<Edit />}
                                                    onClick={() => setActiveTab(1)}
                                                >
                                                    Edit Action Plan
                                                </DotBridgeButton>
                                                <DotBridgeButton
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<Download />}
                                                    onClick={() => {
                                                        // Export client data
                                                        const clientData = {
                                                            user: user,
                                                            order: order,
                                                            deliverables: deliverables,
                                                            actionPlan: isEditingActionPlan ? editableActionPlan : mockActionPlan,
                                                            intelligenceTemplates: intelligenceTemplates,
                                                            exportedAt: new Date().toISOString()
                                                        };

                                                        const dataStr = JSON.stringify(clientData, null, 2);
                                                        const dataBlob = new Blob([dataStr], { type: 'application/json' });
                                                        const url = URL.createObjectURL(dataBlob);
                                                        const link = document.createElement('a');
                                                        link.href = url;
                                                        link.download = `client-data-${user.email}-${new Date().toISOString().split('T')[0]}.json`;
                                                        link.click();
                                                        URL.revokeObjectURL(url);
                                                    }}
                                                >
                                                    Export Client Data
                                                </DotBridgeButton>
                                                <DotBridgeButton
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<Email />}
                                                    onClick={() => {
                                                        const subject = `Career Update - ${user.email}`;
                                                        const body = `Hi ${user.email},\n\nHere's an update on your career acceleration progress...\n\nBest regards,\nThe DotBridge Team`;
                                                        window.open(`mailto:${user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                                                    }}
                                                >
                                                    Send Update
                                                </DotBridgeButton>
                                                <DotBridgeButton
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<Assignment />}
                                                    onClick={() => {
                                                        // Generate a simple report
                                                        const completedTasks = Object.values(progress).filter(p => p.completed).length;
                                                        const totalTasks = mockActionPlan.reduce((acc, week) =>
                                                            acc + week.days.reduce((dayAcc, day) => dayAcc + day.tasks.length, 0), 0
                                                        );
                                                        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                                                        const report = `CLIENT PROGRESS REPORT
                                                        
Client: ${user.email}
Date: ${new Date().toLocaleDateString()}
Order ID: ${order.id}

PROGRESS SUMMARY:
- Overall Completion: ${completionRate}%
- Tasks Completed: ${completedTasks}/${totalTasks}
- Assets Delivered: ${deliverables?.length || 0}
- Intelligence Templates: ${intelligenceTemplates.length}

ACTION PLAN STATUS:
${mockActionPlan.map(week =>
                                                            `Week ${week.week}: ${week.title}\n${week.days.map(day =>
                                                                `  Day ${day.day}: ${day.tasks.filter(task => progress[`action_plan_${task.id}`]?.completed).length}/${day.tasks.length} tasks completed`
                                                            ).join('\n')}`
                                                        ).join('\n\n')}`;

                                                        const reportBlob = new Blob([report], { type: 'text/plain' });
                                                        const url = URL.createObjectURL(reportBlob);
                                                        const link = document.createElement('a');
                                                        link.href = url;
                                                        link.download = `progress-report-${user.email}-${new Date().toISOString().split('T')[0]}.txt`;
                                                        link.click();
                                                        URL.revokeObjectURL(url);
                                                    }}
                                                >
                                                    Generate Report
                                                </DotBridgeButton>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </DotBridgeCard>
                    )}

                    {/* Welcome Video */}
                    <DotBridgeCard sx={{
                        mb: 3,
                        background: 'linear-gradient(145deg, #FFFFFF 0%, #FAFBFC 100%)',
                        border: '1px solid #E2E8F0',
                        borderRadius: '20px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        animation: `${scaleIn} 0.8s ease-out 0.6s both`,
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: 'linear-gradient(90deg, #0066FF 0%, #00D4FF 50%, #0066FF 100%)',
                            backgroundSize: '200% 100%',
                            animation: `${shimmer} 3s ease-in-out infinite`,
                        },
                        '&:hover': {
                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), 0 8px 20px rgba(0, 102, 255, 0.1)',
                            transform: 'translateY(-4px)',
                        }
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                                <Box sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '14px',
                                    background: 'linear-gradient(135deg, #E6F0FF 0%, #DBEAFE 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 16px rgba(0, 102, 255, 0.15)',
                                    '&:hover': {
                                        transform: 'scale(1.1) rotate(5deg)',
                                        boxShadow: '0 8px 25px rgba(0, 102, 255, 0.25)',
                                    }
                                }}>
                                    <PlayArrow sx={{
                                        fontSize: '1.5rem',
                                        color: '#0066FF',
                                        filter: 'drop-shadow(0 2px 4px rgba(0, 102, 255, 0.2))',
                                    }} />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h5" sx={{
                                        fontWeight: 800,
                                        color: '#1A202C',
                                        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                        letterSpacing: '-0.03em',
                                        lineHeight: 1.2,
                                        background: 'linear-gradient(135deg, #1A202C 0%, #374151 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}>
                                        Welcome Message
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                        color: '#64748B',
                                        fontWeight: 500,
                                        mt: 0.5,
                                        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    }}>
                                        Your personalized journey begins here
                                    </Typography>
                                </Box>
                                {/* Show bridge ID in admin view */}
                                {adminViewData?.admin_view && order.welcome_bridge_id && (
                                    <Chip
                                        label={`Bridge ID: ${order.welcome_bridge_id}`}
                                        size="small"
                                        sx={{
                                            background: 'linear-gradient(135deg, #E6F0FF 0%, #DBEAFE 100%)',
                                            color: '#0066FF',
                                            fontWeight: 600,
                                            border: '1px solid rgba(0, 102, 255, 0.2)',
                                            boxShadow: '0 2px 8px rgba(0, 102, 255, 0.15)',
                                        }}
                                    />
                                )}
                            </Box>

                            {/* Render AgentConnector if bridge is selected, otherwise show placeholder */}
                            {/* DEBUG: Log the bridge check */}
                            {console.log('🎬 Render check - order.welcome_bridge_id:', order.welcome_bridge_id, typeof order.welcome_bridge_id)}
                            {order.welcome_bridge_id ? (
                                <Box sx={{
                                    height: 500,
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    border: '1px solid #E2E8F0',
                                    backgroundColor: '#000',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                                    position: 'relative',
                                    mb: 2,
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.03) 50%, transparent 51%)',
                                        pointerEvents: 'none',
                                        zIndex: 1,
                                    }
                                }}>
                                    <AgentConnector
                                        brdgeId={order.welcome_bridge_id}
                                        agentType="view"
                                        token={null}
                                        userId={`client_${user.id}`}
                                        isEmbed={true}
                                        preventSafariScroll={true}
                                    />
                                </Box>
                            ) : (
                                <Box sx={{
                                    height: 320,
                                    background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 3,
                                    position: 'relative',
                                    border: '1px solid #E2E8F0',
                                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 4px 20px rgba(0, 0, 0, 0.08)',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'radial-gradient(circle at center, rgba(0, 102, 255, 0.05) 0%, transparent 70%)',
                                        pointerEvents: 'none',
                                    }
                                }}>
                                    <Box sx={{
                                        textAlign: 'center',
                                        position: 'relative',
                                        zIndex: 1,
                                        animation: `${fadeInUp} 0.8s ease-out`,
                                    }}>
                                        <Box sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '20px',
                                            background: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto',
                                            mb: 3,
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                                            }
                                        }}>
                                            <PlayArrow sx={{
                                                fontSize: '2.5rem',
                                                color: '#94A3B8',
                                                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                                            }} />
                                        </Box>
                                        <Typography variant="h5" sx={{
                                            color: '#64748B',
                                            fontWeight: 700,
                                            mb: 1,
                                            fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                            letterSpacing: '-0.02em',
                                        }}>
                                            {adminViewData?.admin_view
                                                ? 'No Welcome Video Selected'
                                                : 'Welcome Video Coming Soon'
                                            }
                                        </Typography>
                                        {adminViewData?.admin_view && (
                                            <Typography variant="body1" sx={{
                                                mt: 1,
                                                color: '#94A3B8',
                                                fontWeight: 500,
                                                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                            }}>
                                                Use the Admin Panel above to select a bridge
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            )}

                            <Typography variant="body1" sx={{
                                textAlign: 'center',
                                color: '#64748B',
                                mt: 2,
                                fontWeight: 500,
                                fontSize: '1rem',
                                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                letterSpacing: '-0.01em',
                                lineHeight: 1.6,
                                maxWidth: 500,
                                mx: 'auto',
                                px: 2,
                            }}>
                                {order.welcome_bridge_id
                                    ? ''
                                    : adminViewData?.admin_view && !order.welcome_bridge_id
                                        ? 'Select a bridge from the Admin Panel above to set the personalized welcome video'
                                        : 'Your personalized welcome message will appear here once your strategic plan is ready'
                                }
                            </Typography>
                        </CardContent>
                    </DotBridgeCard>

                    {/* Quick Stats */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={4}>
                            <DotBridgeCard sx={{
                                background: 'linear-gradient(145deg, #FFFFFF 0%, #FAFBFC 100%)',
                                border: '1px solid #E2E8F0',
                                borderRadius: '18px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                animation: `${scaleIn} 0.6s ease-out`,
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: 'linear-gradient(90deg, #0066FF 0%, #00D4FF 100%)',
                                    borderRadius: '18px 18px 0 0',
                                },
                                '&:hover': {
                                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), 0 8px 20px rgba(0, 102, 255, 0.1)',
                                    transform: 'translateY(-8px) scale(1.02)',
                                    '&::before': {
                                        background: 'linear-gradient(90deg, #0066FF 0%, #00D4FF 50%, #0066FF 100%)',
                                        backgroundSize: '200% 100%',
                                        animation: `${shimmer} 1.5s ease-in-out infinite`,
                                    }
                                }
                            }}>
                                <CardContent sx={{ textAlign: 'center', p: 4, height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Box sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #E6F0FF 0%, #DBEAFE 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto',
                                        mb: 2.5,
                                        position: 'relative',
                                        boxShadow: '0 4px 20px rgba(0, 102, 255, 0.15)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'rotate(10deg) scale(1.1)',
                                            boxShadow: '0 8px 30px rgba(0, 102, 255, 0.25)',
                                        }
                                    }}>
                                        <GetApp sx={{
                                            fontSize: '2rem',
                                            color: '#0066FF',
                                            filter: 'drop-shadow(0 2px 4px rgba(0, 102, 255, 0.2))',
                                        }} />
                                    </Box>
                                    <Typography variant="h2" sx={{
                                        mb: 1.5,
                                        fontWeight: 800,
                                        color: '#1A202C',
                                        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                        letterSpacing: '-0.03em',
                                        background: 'linear-gradient(135deg, #1A202C 0%, #374151 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}>
                                        {deliverables?.length || 0}
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                        color: '#64748B',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        letterSpacing: '-0.01em',
                                        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    }}>
                                        Assets Ready
                                    </Typography>
                                </CardContent>
                            </DotBridgeCard>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <DotBridgeCard sx={{
                                background: 'linear-gradient(145deg, #FFFFFF 0%, #FAFBFC 100%)',
                                border: '1px solid #E2E8F0',
                                borderRadius: '18px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                animation: `${scaleIn} 0.6s ease-out 0.2s both`,
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
                                    borderRadius: '18px 18px 0 0',
                                },
                                '&:hover': {
                                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), 0 8px 20px rgba(16, 185, 129, 0.1)',
                                    transform: 'translateY(-8px) scale(1.02)',
                                    '&::before': {
                                        background: 'linear-gradient(90deg, #10B981 0%, #34D399 50%, #10B981 100%)',
                                        backgroundSize: '200% 100%',
                                        animation: `${shimmer} 1.5s ease-in-out infinite`,
                                    }
                                }
                            }}>
                                <CardContent sx={{ textAlign: 'center', p: 4, height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Box sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto',
                                        mb: 2.5,
                                        position: 'relative',
                                        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'rotate(10deg) scale(1.1)',
                                            boxShadow: '0 8px 30px rgba(16, 185, 129, 0.25)',
                                        }
                                    }}>
                                        <Business sx={{
                                            fontSize: '2rem',
                                            color: '#10B981',
                                            filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.2))',
                                        }} />
                                    </Box>
                                    <Typography variant="h2" sx={{
                                        mb: 1.5,
                                        fontWeight: 800,
                                        color: '#1A202C',
                                        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                        letterSpacing: '-0.03em',
                                        background: 'linear-gradient(135deg, #1A202C 0%, #374151 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}>
                                        50+
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                        color: '#64748B',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        letterSpacing: '-0.01em',
                                        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    }}>
                                        Target Companies
                                    </Typography>
                                </CardContent>
                            </DotBridgeCard>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <DotBridgeCard sx={{
                                background: 'linear-gradient(145deg, #FFFFFF 0%, #FAFBFC 100%)',
                                border: '1px solid #E2E8F0',
                                borderRadius: '18px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                animation: `${scaleIn} 0.6s ease-out 0.4s both`,
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: 'linear-gradient(90deg, #F59E0B 0%, #FCD34D 100%)',
                                    borderRadius: '18px 18px 0 0',
                                },
                                '&:hover': {
                                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), 0 8px 20px rgba(245, 158, 11, 0.1)',
                                    transform: 'translateY(-8px) scale(1.02)',
                                    '&::before': {
                                        background: 'linear-gradient(90deg, #F59E0B 0%, #FCD34D 50%, #F59E0B 100%)',
                                        backgroundSize: '200% 100%',
                                        animation: `${shimmer} 1.5s ease-in-out infinite`,
                                    }
                                }
                            }}>
                                <CardContent sx={{ textAlign: 'center', p: 4, height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Box sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto',
                                        mb: 2.5,
                                        position: 'relative',
                                        boxShadow: '0 4px 20px rgba(245, 158, 11, 0.15)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'rotate(10deg) scale(1.1)',
                                            boxShadow: '0 8px 30px rgba(245, 158, 11, 0.25)',
                                        }
                                    }}>
                                        <Schedule sx={{
                                            fontSize: '2rem',
                                            color: '#F59E0B',
                                            filter: 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.2))',
                                        }} />
                                    </Box>
                                    <Typography variant="h2" sx={{
                                        mb: 1.5,
                                        fontWeight: 800,
                                        color: '#1A202C',
                                        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                        letterSpacing: '-0.03em',
                                        background: 'linear-gradient(135deg, #1A202C 0%, #374151 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}>
                                        14
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                        color: '#64748B',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        letterSpacing: '-0.01em',
                                        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    }}>
                                        Day Action Plan
                                    </Typography>
                                </CardContent>
                            </DotBridgeCard>
                        </Grid>
                    </Grid>

                    {/* Next Steps */}
                    <DotBridgeCard sx={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                        }
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" gutterBottom sx={{
                                fontWeight: 600,
                                color: '#1A202C',
                                mb: 3
                            }}>
                                Recommended Next Steps
                            </Typography>
                            <List sx={{ '& .MuiListItem-root': { mb: 2 } }}>
                                <ListItem sx={{
                                    borderRadius: 2,
                                    border: '1px solid #E2E8F0',
                                    backgroundColor: '#FFFFFF',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: '#F8FAFC',
                                        borderColor: '#CBD5E1',
                                        transform: 'translateX(4px)',
                                    }
                                }}>
                                    <ListItemIcon>
                                        <Box sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '8px',
                                            backgroundColor: '#E6F0FF',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <GetApp sx={{ color: '#0066FF', fontSize: '1.25rem' }} />
                                        </Box>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1A202C' }}>
                                                Download your optimized resume
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                                                Start with your updated resume from the Core Assets section
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                <ListItem sx={{
                                    borderRadius: 2,
                                    border: '1px solid #E2E8F0',
                                    backgroundColor: '#FFFFFF',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: '#F8FAFC',
                                        borderColor: '#CBD5E1',
                                        transform: 'translateX(4px)',
                                    }
                                }}>
                                    <ListItemIcon>
                                        <Box sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '8px',
                                            backgroundColor: '#D1FAE5',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <Business sx={{ color: '#10B981', fontSize: '1.25rem' }} />
                                        </Box>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1A202C' }}>
                                                Review your target company list
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                                                Explore the 50+ companies we've identified for you
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                <ListItem sx={{
                                    borderRadius: 2,
                                    border: '1px solid #E2E8F0',
                                    backgroundColor: '#FFFFFF',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: '#F8FAFC',
                                        borderColor: '#CBD5E1',
                                        transform: 'translateX(4px)',
                                    }
                                }}>
                                    <ListItemIcon>
                                        <Box sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '8px',
                                            backgroundColor: '#FEF3C7',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <Schedule sx={{ color: '#F59E0B', fontSize: '1.25rem' }} />
                                        </Box>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1A202C' }}>
                                                Begin Day 1 of your action plan
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                                                Start with LinkedIn optimization tasks
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </DotBridgeCard>
                </Box>
            )
        },
        {
            label: 'Action Plan',
            icon: <Assignment />,
            content: (
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1A202C', mb: 1 }}>
                                14-Day Career Action Calendar
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Your personalized daily roadmap to career acceleration
                            </Typography>
                        </Box>
                        {adminViewData?.admin_view && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {isEditingActionPlan ? (
                                    <>
                                        <DotBridgeButton
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            onClick={handleSaveActionPlan}
                                        >
                                            Save Changes
                                        </DotBridgeButton>
                                        <DotBridgeButton
                                            variant="outlined"
                                            size="small"
                                            onClick={handleCancelEditActionPlan}
                                        >
                                            Cancel
                                        </DotBridgeButton>
                                    </>
                                ) : (
                                    <DotBridgeButton
                                        variant="outlined"
                                        startIcon={<Edit />}
                                        size="small"
                                        onClick={handleEditActionPlan}
                                    >
                                        Edit Plan
                                    </DotBridgeButton>
                                )}
                            </Box>
                        )}
                    </Box>

                    {/* Progress Overview */}
                    <DotBridgeCard sx={{ mb: 4, background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0369A1' }}>
                                    Overall Progress: {calculateOverallProgress()}% Complete
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <DotBridgeButton
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Download />}
                                        onClick={exportActionPlan}
                                    >
                                        Export Plan
                                    </DotBridgeButton>
                                    {adminViewData?.admin_view && (
                                        <>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,.xlsx,.csv"
                                                id="action-plan-asset-upload"
                                                style={{ display: 'none' }}
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;

                                                    try {
                                                        await uploadAsset(file, 'action_plan_asset');
                                                    } catch (error) {
                                                        console.error('Error uploading action plan asset:', error);
                                                    }

                                                    e.target.value = '';
                                                }}
                                            />
                                            <label htmlFor="action-plan-asset-upload">
                                                <DotBridgeButton
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<Upload />}
                                                    component="span"
                                                >
                                                    Upload Assets
                                                </DotBridgeButton>
                                            </label>
                                        </>
                                    )}
                                </Box>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={calculateOverallProgress()}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: '#BAE6FD',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: '#0369A1',
                                        borderRadius: 5
                                    }
                                }}
                            />
                        </CardContent>
                    </DotBridgeCard>

                    {/* Calendar View */}
                    {(isEditingActionPlan ? editableActionPlan : mockActionPlan).map((week, weekIndex) => (
                        <DotBridgeCard key={week.week} sx={{ mb: 4, border: '1px solid #E2E8F0' }}>
                            <CardContent sx={{ p: 0 }}>
                                {/* Week Header */}
                                <Box sx={{
                                    p: 3,
                                    background: week.week === 1
                                        ? 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)'
                                        : 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                                    borderBottom: '1px solid #E2E8F0'
                                }}>
                                    <Typography variant="h5" sx={{
                                        fontWeight: 700,
                                        color: week.week === 1 ? '#1E40AF' : '#166534',
                                        mb: 1
                                    }}>
                                        Week {week.week}: {week.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {week.week === 1 ? 'Build your foundation and start reaching out' : 'Accelerate your outreach and prepare for interviews'}
                                    </Typography>
                                </Box>

                                {/* Days Grid */}
                                <Box sx={{ p: 3 }}>
                                    <Grid container spacing={2}>
                                        {week.days.map((day, dayIndex) => {
                                            const dayProgress = day.tasks.filter(task => {
                                                const key = `action_plan_${task.id}`;
                                                return progress[key]?.completed || false;
                                            }).length;
                                            const totalTasks = day.tasks.length;
                                            const dayCompletionRate = totalTasks > 0 ? (dayProgress / totalTasks) * 100 : 0;

                                            const getPriorityColor = (priority) => {
                                                switch (priority) {
                                                    case 'high': return '#EF4444';
                                                    case 'medium': return '#F59E0B';
                                                    case 'low': return '#10B981';
                                                    default: return '#6B7280';
                                                }
                                            };

                                            return (
                                                <Grid item xs={12} sm={6} lg={4} key={day.day}>
                                                    <DotBridgeCard sx={{
                                                        height: '100%',
                                                        border: '1px solid #E2E8F0',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                                            transform: 'translateY(-2px)'
                                                        }
                                                    }}>
                                                        <CardContent sx={{ p: 2.5 }}>
                                                            {/* Day Header */}
                                                            <Box sx={{ mb: 2 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A202C' }}>
                                                                        Day {day.day}
                                                                    </Typography>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                        <Chip
                                                                            label={day.date}
                                                                            size="small"
                                                                            sx={{
                                                                                backgroundColor: '#F1F5F9',
                                                                                color: '#475569',
                                                                                fontWeight: 600
                                                                            }}
                                                                        />
                                                                        {isEditingActionPlan && adminViewData?.admin_view && (
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() => handleEditDayDetails(weekIndex, dayIndex)}
                                                                                sx={{ p: 0.25 }}
                                                                            >
                                                                                <Edit sx={{ fontSize: '0.8rem' }} />
                                                                            </IconButton>
                                                                        )}
                                                                    </Box>
                                                                </Box>
                                                                <Typography variant="body2" sx={{
                                                                    fontWeight: 600,
                                                                    color: '#374151',
                                                                    mb: 1,
                                                                    lineHeight: 1.3
                                                                }}>
                                                                    {day.title}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                                    <Chip
                                                                        label={day.priority}
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: `${getPriorityColor(day.priority)}15`,
                                                                            color: getPriorityColor(day.priority),
                                                                            fontWeight: 600,
                                                                            fontSize: '0.7rem'
                                                                        }}
                                                                    />
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {day.estimatedTime}
                                                                    </Typography>
                                                                </Box>

                                                                {/* Progress Bar */}
                                                                <Box sx={{ mb: 2 }}>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            Progress
                                                                        </Typography>
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            {dayProgress}/{totalTasks}
                                                                        </Typography>
                                                                    </Box>
                                                                    <LinearProgress
                                                                        variant="determinate"
                                                                        value={dayCompletionRate}
                                                                        sx={{
                                                                            height: 6,
                                                                            borderRadius: 3,
                                                                            backgroundColor: '#F1F5F9',
                                                                            '& .MuiLinearProgress-bar': {
                                                                                backgroundColor: dayCompletionRate === 100 ? '#10B981' : '#3B82F6',
                                                                                borderRadius: 3
                                                                            }
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </Box>

                                                            {/* Tasks */}
                                                            <Box>
                                                                {day.tasks.map((task, taskIndex) => {
                                                                    const key = `action_plan_${task.id}`;
                                                                    const isCompleted = progress[key]?.completed || false;

                                                                    return (
                                                                        <Box key={task.id} sx={{
                                                                            display: 'flex',
                                                                            alignItems: 'flex-start',
                                                                            mb: taskIndex < day.tasks.length - 1 ? 1.5 : (isEditingActionPlan ? 1.5 : 0),
                                                                            p: 1,
                                                                            borderRadius: 1,
                                                                            backgroundColor: isCompleted ? '#F0FDF4' : 'transparent',
                                                                            border: isCompleted ? '1px solid #BBF7D0' : '1px solid transparent',
                                                                            transition: 'all 0.2s ease'
                                                                        }}>
                                                                            <Checkbox
                                                                                checked={isCompleted}
                                                                                onChange={(e) => updateProgress('action_plan', task.id, e.target.checked)}
                                                                                disabled={adminViewData?.admin_view}
                                                                                size="small"
                                                                                sx={{
                                                                                    p: 0.5,
                                                                                    '&.Mui-checked': {
                                                                                        color: '#10B981'
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <Box sx={{ ml: 1, flex: 1 }}>
                                                                                {isEditingActionPlan && adminViewData?.admin_view ? (
                                                                                    <TextField
                                                                                        fullWidth
                                                                                        value={task.text}
                                                                                        onChange={(e) => handleEditTask(weekIndex, dayIndex, taskIndex, e.target.value)}
                                                                                        size="small"
                                                                                        variant="outlined"
                                                                                        sx={{
                                                                                            mb: 0.5,
                                                                                            '& .MuiInputBase-input': {
                                                                                                fontSize: '0.85rem',
                                                                                                fontWeight: 500
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                ) : (
                                                                                    <Typography variant="body2" sx={{
                                                                                        textDecoration: isCompleted ? 'line-through' : 'none',
                                                                                        opacity: isCompleted ? 0.7 : 1,
                                                                                        fontWeight: 500,
                                                                                        lineHeight: 1.4,
                                                                                        fontSize: '0.85rem'
                                                                                    }}>
                                                                                        {task.text}
                                                                                    </Typography>
                                                                                )}
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                    <Chip
                                                                                        label={task.priority}
                                                                                        size="small"
                                                                                        sx={{
                                                                                            height: 16,
                                                                                            fontSize: '0.65rem',
                                                                                            fontWeight: 600,
                                                                                            mt: 0.5,
                                                                                            backgroundColor: `${getPriorityColor(task.priority)}10`,
                                                                                            color: getPriorityColor(task.priority)
                                                                                        }}
                                                                                    />
                                                                                    {isEditingActionPlan && adminViewData?.admin_view && (
                                                                                        <IconButton
                                                                                            size="small"
                                                                                            onClick={() => handleDeleteTask(weekIndex, dayIndex, taskIndex)}
                                                                                            sx={{
                                                                                                p: 0.25,
                                                                                                color: '#EF4444',
                                                                                                '&:hover': { backgroundColor: '#FEE2E2' }
                                                                                            }}
                                                                                        >
                                                                                            <Delete sx={{ fontSize: '0.8rem' }} />
                                                                                        </IconButton>
                                                                                    )}
                                                                                </Box>
                                                                            </Box>
                                                                        </Box>
                                                                    );
                                                                })}

                                                                {/* Add Task Button - Only show in edit mode for admins */}
                                                                {isEditingActionPlan && adminViewData?.admin_view && (
                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        mt: 1
                                                                    }}>
                                                                        <DotBridgeButton
                                                                            variant="outlined"
                                                                            size="small"
                                                                            startIcon={<Add />}
                                                                            onClick={() => handleAddTask(weekIndex, dayIndex)}
                                                                            sx={{
                                                                                fontSize: '0.75rem',
                                                                                py: 0.5,
                                                                                px: 1.5
                                                                            }}
                                                                        >
                                                                            Add Task
                                                                        </DotBridgeButton>
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                        </CardContent>
                                                    </DotBridgeCard>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </Box>
                            </CardContent>
                        </DotBridgeCard>
                    ))}
                </Box>
            )
        },
        {
            label: 'Core Assets',
            icon: <GetApp />,
            content: (
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            Your Core Assets
                        </Typography>
                        {adminViewData?.admin_view && (
                            <Typography variant="body2" color="text.secondary">
                                Admin Mode: You can delete assets below
                            </Typography>
                        )}
                    </Box>

                    <Grid container spacing={3}>
                        {deliverables?.map((deliverable) => (
                            <Grid item xs={12} sm={6} key={deliverable.id}>
                                <DotBridgeCard
                                    interactive
                                    sx={{
                                        position: 'relative',
                                        ...(adminViewData?.admin_view && {
                                            '&:hover .admin-controls': {
                                                opacity: 1
                                            }
                                        })
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                                                {deliverable.deliverable_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </Typography>
                                            {adminViewData?.admin_view && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => deleteAsset(deliverable.id)}
                                                    className="admin-controls"
                                                    sx={{
                                                        opacity: 0,
                                                        transition: 'opacity 0.2s ease',
                                                        color: '#EF4444',
                                                        '&:hover': {
                                                            backgroundColor: '#FEE2E2',
                                                            color: '#DC2626'
                                                        }
                                                    }}
                                                >
                                                    <Delete size={18} />
                                                </IconButton>
                                            )}
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {deliverable.file_name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
                                            Uploaded: {new Date(deliverable.uploaded_at).toLocaleDateString()}
                                        </Typography>

                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <DotBridgeButton
                                                variant="contained"
                                                startIcon={<Download />}
                                                onClick={() => downloadAsset(deliverable)}
                                                sx={{ flex: 1 }}
                                            >
                                                Download
                                            </DotBridgeButton>
                                            {adminViewData?.admin_view && (
                                                <DotBridgeButton
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={<Delete />}
                                                    onClick={() => deleteAsset(deliverable.id)}
                                                    sx={{ minWidth: 'auto', px: 2 }}
                                                >
                                                    Delete
                                                </DotBridgeButton>
                                            )}
                                        </Box>
                                    </CardContent>
                                </DotBridgeCard>
                            </Grid>
                        ))}

                        {(!deliverables || deliverables.length === 0) && (
                            <Grid item xs={12}>
                                <Alert severity="info">
                                    {adminViewData?.admin_view
                                        ? 'No assets have been uploaded yet. Use the Admin Fulfillment Center above to upload assets.'
                                        : 'Your assets are being prepared and will appear here once ready.'
                                    }
                                </Alert>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            )
        },
        {
            label: 'Intelligence Data',
            icon: <Analytics />,
            content: (
                <Box>
                    <Typography variant="h5" gutterBottom sx={{
                        fontWeight: 700,
                        color: '#1A202C',
                        letterSpacing: '-0.02em',
                        mb: 4
                    }}>
                        Intelligence & Target Data
                    </Typography>

                    {intelligenceTemplates.length === 0 ? (
                        <DotBridgeCard sx={{
                            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                            border: '1px solid #E2E8F0',
                            borderRadius: 3
                        }}>
                            <CardContent sx={{ py: 8, textAlign: 'center' }}>
                                <Analytics sx={{ fontSize: '4rem', color: '#CBD5E1', mb: 3 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#64748B' }}>
                                    {adminViewData?.admin_view ? 'No Intelligence Data Available' : 'Intelligence Data Being Prepared'}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                                    {adminViewData?.admin_view
                                        ? 'Upload CSV files through the Admin Panel in the Overview tab to start building your intelligence database.'
                                        : 'Your personalized intelligence matrix is being prepared. This will include target companies, decision-maker contacts, and strategic insights.'
                                    }
                                </Typography>
                                {adminViewData?.admin_view && (
                                    <DotBridgeButton
                                        variant="outlined"
                                        startIcon={<CloudUpload />}
                                        onClick={() => setActiveTab(0)}
                                        sx={{
                                            borderRadius: 2,
                                            px: 4,
                                            py: 1.5,
                                            textTransform: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        Go to Admin Panel
                                    </DotBridgeButton>
                                )}
                            </CardContent>
                        </DotBridgeCard>
                    ) : (
                        <Box>
                            {/* Tabbed Interface - Apple-like */}
                            <Box sx={{
                                mb: 3,
                                background: '#FFFFFF',
                                borderRadius: 3,
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                                overflow: 'hidden'
                            }}>
                                {/* Tab Headers */}
                                <Box sx={{
                                    display: 'flex',
                                    borderBottom: '1px solid #F1F5F9',
                                    background: '#FAFBFC',
                                    overflow: 'auto'
                                }}>
                                    {intelligenceTemplates.map((template, index) => (
                                        <Box
                                            key={template.id}
                                            onClick={() => {
                                                setSelectedTemplate(template);
                                                fetchIntelligenceRecords(template.id);
                                            }}
                                            sx={{
                                                flex: '0 0 auto',
                                                minWidth: 200,
                                                px: 3,
                                                py: 2.5,
                                                cursor: 'pointer',
                                                borderRight: index < intelligenceTemplates.length - 1 ? '1px solid #F1F5F9' : 'none',
                                                background: selectedTemplate?.id === template.id
                                                    ? 'linear-gradient(135deg, #0066FF 0%, #0052CC 100%)'
                                                    : 'transparent',
                                                color: selectedTemplate?.id === template.id ? '#FFFFFF' : '#64748B',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                position: 'relative',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                textAlign: 'center',
                                                '&:hover': {
                                                    background: selectedTemplate?.id === template.id
                                                        ? 'linear-gradient(135deg, #0066FF 0%, #0052CC 100%)'
                                                        : 'rgba(0, 102, 255, 0.04)',
                                                    color: selectedTemplate?.id === template.id ? '#FFFFFF' : '#0066FF',
                                                    transform: 'translateY(-1px)'
                                                },
                                                '&::after': selectedTemplate?.id === template.id ? {
                                                    content: '""',
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '3px',
                                                    background: 'linear-gradient(90deg, #00D4FF 0%, #0066FF 100%)',
                                                    borderRadius: '3px 3px 0 0'
                                                } : {}
                                            }}
                                        >
                                            <Typography variant="subtitle1" sx={{
                                                fontWeight: 700,
                                                mb: 0.5,
                                                fontSize: '0.95rem',
                                                lineHeight: 1.2,
                                                letterSpacing: '-0.01em',
                                                color: selectedTemplate?.id === template.id ? '#FFFFFF' : '#64748B'
                                            }}>
                                                {template.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                                                <Chip
                                                    label={`${template.columns.length} cols`}
                                                    size="small"
                                                    sx={{
                                                        height: 22,
                                                        fontSize: '0.7rem',
                                                        fontWeight: 600,
                                                        backgroundColor: selectedTemplate?.id === template.id
                                                            ? 'rgba(255, 255, 255, 0.2)'
                                                            : 'rgba(0, 102, 255, 0.1)',
                                                        color: selectedTemplate?.id === template.id
                                                            ? '#FFFFFF'
                                                            : '#0066FF',
                                                        border: 'none'
                                                    }}
                                                />
                                                <Typography variant="caption" sx={{
                                                    opacity: 0.8,
                                                    fontSize: '0.7rem',
                                                    fontWeight: 500,
                                                    color: selectedTemplate?.id === template.id ? '#FFFFFF' : '#64748B'
                                                }}>
                                                    {new Date(template.created_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>

                                {/* Spreadsheet Content */}
                                {selectedTemplate ? (
                                    <Box sx={{
                                        background: '#FFFFFF',
                                        minHeight: 600,
                                        position: 'relative'
                                    }}>
                                        {/* Toolbar */}
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            px: 3,
                                            py: 2,
                                            borderBottom: '1px solid #F1F5F9',
                                            background: 'linear-gradient(135deg, #FAFBFC 0%, #F8FAFC 100%)'
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: 2,
                                                    background: 'linear-gradient(135deg, #0066FF 0%, #0052CC 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Analytics sx={{ fontSize: '1.2rem', color: '#FFFFFF' }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h6" sx={{
                                                        fontWeight: 700,
                                                        color: '#1A202C',
                                                        lineHeight: 1,
                                                        letterSpacing: '-0.01em'
                                                    }}>
                                                        {selectedTemplate.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{
                                                        fontWeight: 500,
                                                        mt: 0.5,
                                                        display: 'block'
                                                    }}>
                                                        {intelligenceRecords.length} records • {selectedTemplate.columns.length} columns
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                {/* Selection Info */}
                                                {selectedRecords.size > 0 && (
                                                    <Chip
                                                        label={`${selectedRecords.size} selected`}
                                                        size="small"
                                                        color="primary"
                                                        sx={{
                                                            fontWeight: 600,
                                                            backgroundColor: '#EFF6FF',
                                                            color: '#1D4ED8'
                                                        }}
                                                    />
                                                )}

                                                {/* Column Visibility Toggle */}
                                                <Tooltip title="Column Settings">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setShowColumnManager(!showColumnManager)}
                                                        sx={{
                                                            backgroundColor: showColumnManager ? '#0066FF' : 'transparent',
                                                            color: showColumnManager ? 'white' : '#64748B',
                                                            '&:hover': {
                                                                backgroundColor: showColumnManager ? '#0052CC' : '#F8FAFC'
                                                            }
                                                        }}
                                                    >
                                                        <Settings />
                                                    </IconButton>
                                                </Tooltip>

                                                {/* Refresh Data */}
                                                <Tooltip title="Refresh Data">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => selectedTemplate && fetchIntelligenceRecords(selectedTemplate.id)}
                                                        sx={{
                                                            color: '#64748B',
                                                            '&:hover': { backgroundColor: '#F8FAFC' }
                                                        }}
                                                    >
                                                        <Refresh />
                                                    </IconButton>
                                                </Tooltip>

                                                {/* Export Button */}
                                                <DotBridgeButton
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<Download />}
                                                    onClick={exportIntelligenceData}
                                                    sx={{
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        fontSize: '0.8rem',
                                                        px: 2,
                                                        py: 1,
                                                        borderColor: '#E2E8F0',
                                                        color: '#64748B',
                                                        '&:hover': {
                                                            borderColor: '#0066FF',
                                                            color: '#0066FF',
                                                            backgroundColor: 'rgba(0, 102, 255, 0.04)'
                                                        }
                                                    }}
                                                >
                                                    Export
                                                </DotBridgeButton>

                                                {/* Admin Add Record Button */}
                                                {adminViewData?.admin_view && (
                                                    <DotBridgeButton
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<Add />}
                                                        onClick={() => setShowAddRecordDialog(true)}
                                                        sx={{
                                                            borderRadius: 2,
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            fontSize: '0.8rem',
                                                            px: 2,
                                                            py: 1,
                                                            ml: 1
                                                        }}
                                                    >
                                                        Add Record
                                                    </DotBridgeButton>
                                                )}
                                            </Box>
                                        </Box>

                                        {/* Column Manager Panel */}
                                        <Collapse in={showColumnManager}>
                                            <Paper sx={{
                                                mx: 3,
                                                mb: 2,
                                                p: 2,
                                                backgroundColor: '#F8FAFC',
                                                border: '1px solid #E2E8F0',
                                                borderRadius: 2
                                            }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#1A202C' }}>
                                                    Column Visibility
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                    {selectedTemplate?.columns.map((col) => (
                                                        <Chip
                                                            key={col.name}
                                                            label={col.name}
                                                            variant={visibleColumns.has(col.name) ? "filled" : "outlined"}
                                                            color={visibleColumns.has(col.name) ? "primary" : "default"}
                                                            onClick={() => toggleColumnVisibility(col.name)}
                                                            icon={visibleColumns.has(col.name) ? <Visibility /> : <VisibilityOff />}
                                                            sx={{
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s ease',
                                                                fontWeight: 600,
                                                                '&:hover': {
                                                                    transform: 'translateY(-1px)',
                                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                                }
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Paper>
                                        </Collapse>

                                        {/* Bulk Actions Bar */}
                                        <Collapse in={selectedRecords.size > 0}>
                                            <Paper sx={{
                                                mx: 3,
                                                mb: 2,
                                                p: 2,
                                                backgroundColor: '#FFF8E1',
                                                border: '1px solid #FFE082',
                                                borderRadius: 2,
                                                animation: `${fadeInUp} 0.3s ease-out`
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#92400E' }}>
                                                        {selectedRecords.size} record(s) selected
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <ButtonGroup size="small" variant="outlined">
                                                            <DotBridgeButton
                                                                onClick={() => handleBulkStatusUpdate('pending')}
                                                                sx={{
                                                                    backgroundColor: '#F3F4F6',
                                                                    color: '#374151',
                                                                    borderColor: '#D1D5DB',
                                                                    '&:hover': { backgroundColor: '#E5E7EB' }
                                                                }}
                                                            >
                                                                Pending
                                                            </DotBridgeButton>
                                                            <DotBridgeButton
                                                                onClick={() => handleBulkStatusUpdate('contacted')}
                                                                sx={{
                                                                    backgroundColor: '#E0E7FF',
                                                                    color: '#3730A3',
                                                                    borderColor: '#C7D2FE',
                                                                    '&:hover': { backgroundColor: '#C7D2FE' }
                                                                }}
                                                            >
                                                                Contacted
                                                            </DotBridgeButton>
                                                            <DotBridgeButton
                                                                onClick={() => handleBulkStatusUpdate('responded')}
                                                                sx={{
                                                                    backgroundColor: '#ECFDF5',
                                                                    color: '#14532D',
                                                                    borderColor: '#BBF7D0',
                                                                    '&:hover': { backgroundColor: '#BBF7D0' }
                                                                }}
                                                            >
                                                                Responded
                                                            </DotBridgeButton>
                                                            <DotBridgeButton
                                                                onClick={() => handleBulkStatusUpdate('qualified')}
                                                                sx={{
                                                                    backgroundColor: '#FEF3C7',
                                                                    color: '#92400E',
                                                                    borderColor: '#FDE68A',
                                                                    '&:hover': { backgroundColor: '#FDE68A' }
                                                                }}
                                                            >
                                                                Qualified
                                                            </DotBridgeButton>
                                                            {/* Admin-only status options */}
                                                            {adminViewData?.admin_view && (
                                                                <>
                                                                    <DotBridgeButton
                                                                        onClick={() => handleBulkStatusUpdate('validated')}
                                                                        sx={{
                                                                            backgroundColor: '#D1FAE5',
                                                                            color: '#065F46',
                                                                            borderColor: '#A7F3D0',
                                                                            '&:hover': { backgroundColor: '#A7F3D0' }
                                                                        }}
                                                                    >
                                                                        Validated
                                                                    </DotBridgeButton>
                                                                    <DotBridgeButton
                                                                        onClick={() => handleBulkStatusUpdate('flagged')}
                                                                        sx={{
                                                                            backgroundColor: '#FEE2E2',
                                                                            color: '#991B1B',
                                                                            borderColor: '#FECACA',
                                                                            '&:hover': { backgroundColor: '#FECACA' }
                                                                        }}
                                                                    >
                                                                        Flagged
                                                                    </DotBridgeButton>
                                                                </>
                                                            )}
                                                        </ButtonGroup>
                                                        {/* Delete button only for admins */}
                                                        {adminViewData?.admin_view && (
                                                            <DotBridgeButton
                                                                variant="outlined"
                                                                color="error"
                                                                startIcon={<Delete />}
                                                                onClick={handleDeleteSelectedRecords}
                                                                sx={{
                                                                    borderColor: '#FCA5A5',
                                                                    color: '#DC2626',
                                                                    '&:hover': {
                                                                        backgroundColor: '#FEE2E2',
                                                                        borderColor: '#F87171'
                                                                    }
                                                                }}
                                                            >
                                                                Delete Selected
                                                            </DotBridgeButton>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Collapse>

                                        {/* Spreadsheet Table */}
                                        {intelligenceRecords.length === 0 ? (
                                            <Box sx={{
                                                py: 8,
                                                textAlign: 'center',
                                                color: '#64748B'
                                            }}>
                                                <Box sx={{
                                                    width: 64,
                                                    height: 64,
                                                    borderRadius: 3,
                                                    backgroundColor: '#F1F5F9',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto',
                                                    mb: 3
                                                }}>
                                                    <Analytics sx={{ fontSize: '2rem', color: '#CBD5E1' }} />
                                                </Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                    No Records Found
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    This template doesn't contain any data records yet.
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <TableContainer sx={{
                                                maxHeight: 'calc(100vh - 400px)',
                                                '& .MuiTable-root': {
                                                    borderCollapse: 'separate',
                                                    borderSpacing: 0
                                                }
                                            }}>
                                                <Table stickyHeader sx={{ minWidth: 800 }}>
                                                    {/* Enhanced Header */}
                                                    <TableHead>
                                                        <TableRow>
                                                            {/* Selection Column */}
                                                            {(
                                                                <TableCell
                                                                    sx={{
                                                                        background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                                                                        borderBottom: '2px solid #E2E8F0',
                                                                        borderRight: '1px solid #F1F5F9',
                                                                        fontWeight: 700,
                                                                        fontSize: '0.75rem',
                                                                        color: '#64748B',
                                                                        py: 2,
                                                                        px: 2,
                                                                        width: 60,
                                                                        textAlign: 'center',
                                                                        position: 'sticky',
                                                                        top: 0,
                                                                        zIndex: 10
                                                                    }}
                                                                >
                                                                    <Checkbox
                                                                        size="small"
                                                                        checked={selectedRecords.size === intelligenceRecords.length && intelligenceRecords.length > 0}
                                                                        indeterminate={selectedRecords.size > 0 && selectedRecords.size < intelligenceRecords.length}
                                                                        onChange={handleSelectAllRecords}
                                                                        sx={{
                                                                            color: '#64748B',
                                                                            '&.Mui-checked': { color: '#0066FF' },
                                                                            '&.MuiCheckbox-indeterminate': { color: '#0066FF' }
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                            )}

                                                            <TableCell
                                                                sx={{
                                                                    background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                                                                    borderBottom: '2px solid #E2E8F0',
                                                                    borderRight: '1px solid #F1F5F9',
                                                                    fontWeight: 700,
                                                                    fontSize: '0.75rem',
                                                                    color: '#64748B',
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: '0.05em',
                                                                    py: 2,
                                                                    px: 2,
                                                                    width: 60,
                                                                    textAlign: 'center',
                                                                    position: 'sticky',
                                                                    top: 0,
                                                                    zIndex: 10
                                                                }}
                                                            >
                                                                #
                                                            </TableCell>
                                                            {selectedTemplate.columns.map((col, index) => (
                                                                <TableCell
                                                                    key={col.name}
                                                                    sx={{
                                                                        background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                                                                        borderBottom: '2px solid #E2E8F0',
                                                                        borderRight: index < selectedTemplate.columns.length - 1 ? '1px solid #F1F5F9' : 'none',
                                                                        fontWeight: 700,
                                                                        fontSize: '0.85rem',
                                                                        color: '#1A202C',
                                                                        py: 2.5,
                                                                        px: 3,
                                                                        minWidth: 150,
                                                                        position: 'sticky',
                                                                        top: 0,
                                                                        zIndex: 10
                                                                    }}
                                                                >
                                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                                        <Typography variant="subtitle2" sx={{
                                                                            fontWeight: 700,
                                                                            lineHeight: 1.2,
                                                                            letterSpacing: '-0.01em'
                                                                        }}>
                                                                            {col.name}
                                                                        </Typography>
                                                                        {col.data_type && (
                                                                            <Chip
                                                                                label={col.data_type}
                                                                                size="small"
                                                                                sx={{
                                                                                    height: 18,
                                                                                    fontSize: '0.65rem',
                                                                                    fontWeight: 600,
                                                                                    backgroundColor: 'rgba(0, 102, 255, 0.1)',
                                                                                    color: '#0066FF',
                                                                                    border: 'none',
                                                                                    alignSelf: 'flex-start'
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Box>
                                                                </TableCell>
                                                            ))}
                                                            <TableCell
                                                                sx={{
                                                                    background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                                                                    borderBottom: '2px solid #E2E8F0',
                                                                    fontWeight: 700,
                                                                    fontSize: '0.85rem',
                                                                    color: '#1A202C',
                                                                    py: 2.5,
                                                                    px: 3,
                                                                    width: 120,
                                                                    position: 'sticky',
                                                                    top: 0,
                                                                    zIndex: 10
                                                                }}
                                                            >
                                                                Status
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>

                                                    {/* Enhanced Body */}
                                                    <TableBody>
                                                        {intelligenceRecords.map((record, rowIndex) => (
                                                            <TableRow
                                                                key={record.id}
                                                                sx={{
                                                                    '&:nth-of-type(even)': {
                                                                        backgroundColor: '#FAFBFC'
                                                                    },
                                                                    '&:hover': {
                                                                        backgroundColor: '#F0F9FF',
                                                                        '& .MuiTableCell-root': {
                                                                            borderColor: '#E6F0FF'
                                                                        }
                                                                    },
                                                                    transition: 'all 0.2s ease',
                                                                    ...(selectedRecords.has(record.id) && {
                                                                        backgroundColor: '#EFF6FF',
                                                                        '& .MuiTableCell-root': {
                                                                            borderColor: '#BFDBFE'
                                                                        }
                                                                    })
                                                                }}
                                                            >
                                                                {/* Selection Checkbox */}
                                                                {(
                                                                    <TableCell
                                                                        sx={{
                                                                            borderBottom: '1px solid #F1F5F9',
                                                                            borderRight: '1px solid #F1F5F9',
                                                                            textAlign: 'center',
                                                                            py: 2,
                                                                            px: 2,
                                                                            backgroundColor: '#FAFBFC'
                                                                        }}
                                                                    >
                                                                        <Checkbox
                                                                            size="small"
                                                                            checked={selectedRecords.has(record.id)}
                                                                            onChange={() => handleSelectRecord(record.id)}
                                                                            sx={{
                                                                                color: '#64748B',
                                                                                '&.Mui-checked': { color: '#0066FF' }
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                )}

                                                                <TableCell
                                                                    sx={{
                                                                        borderBottom: '1px solid #F1F5F9',
                                                                        borderRight: '1px solid #F1F5F9',
                                                                        textAlign: 'center',
                                                                        fontSize: '0.8rem',
                                                                        fontWeight: 600,
                                                                        color: '#64748B',
                                                                        py: 2,
                                                                        px: 2,
                                                                        backgroundColor: '#FAFBFC'
                                                                    }}
                                                                >
                                                                    {rowIndex + 1}
                                                                </TableCell>
                                                                {selectedTemplate.columns.map((col, colIndex) => (
                                                                    <TableCell
                                                                        key={col.name}
                                                                        sx={{
                                                                            borderBottom: '1px solid #F1F5F9',
                                                                            borderRight: colIndex < selectedTemplate.columns.length - 1 ? '1px solid #F1F5F9' : 'none',
                                                                            py: 2.5,
                                                                            px: 3,
                                                                            fontSize: '0.85rem',
                                                                            fontWeight: 500,
                                                                            color: '#1A202C',
                                                                            maxWidth: 250,
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            whiteSpace: 'nowrap'
                                                                        }}
                                                                    >
                                                                        {(() => {
                                                                            const cellValue = record.data[col.name];

                                                                            // Check if the value is a URL
                                                                            const isUrl = cellValue && (
                                                                                cellValue.startsWith('http://') ||
                                                                                cellValue.startsWith('https://') ||
                                                                                cellValue.startsWith('www.')
                                                                            );

                                                                            // Check if the value is an email
                                                                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                                                            const isEmail = cellValue && emailRegex.test(cellValue);

                                                                            if (!cellValue) {
                                                                                return (
                                                                                    <span style={{
                                                                                        color: '#CBD5E1',
                                                                                        fontStyle: 'italic',
                                                                                        fontSize: '0.8rem'
                                                                                    }}>
                                                                                        —
                                                                                    </span>
                                                                                );
                                                                            }

                                                                            if (isUrl) {
                                                                                // Ensure the URL has a protocol
                                                                                const href = cellValue.startsWith('http')
                                                                                    ? cellValue
                                                                                    : `https://${cellValue}`;

                                                                                return (
                                                                                    <a
                                                                                        href={href}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        style={{
                                                                                            color: '#0066FF',
                                                                                            textDecoration: 'none',
                                                                                            fontSize: '0.85rem',
                                                                                            fontWeight: 500,
                                                                                            lineHeight: 1.4,
                                                                                            display: 'inline-flex',
                                                                                            alignItems: 'center',
                                                                                            gap: '4px',
                                                                                            maxWidth: '100%',
                                                                                            overflow: 'hidden',
                                                                                            textOverflow: 'ellipsis',
                                                                                            whiteSpace: 'nowrap',
                                                                                            transition: 'all 0.2s ease',
                                                                                        }}
                                                                                        onMouseEnter={(e) => {
                                                                                            e.target.style.textDecoration = 'underline';
                                                                                            e.target.style.color = '#0052CC';
                                                                                        }}
                                                                                        onMouseLeave={(e) => {
                                                                                            e.target.style.textDecoration = 'none';
                                                                                            e.target.style.color = '#0066FF';
                                                                                        }}
                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                    >
                                                                                        {cellValue}
                                                                                        <svg
                                                                                            width="12"
                                                                                            height="12"
                                                                                            viewBox="0 0 24 24"
                                                                                            fill="none"
                                                                                            stroke="currentColor"
                                                                                            strokeWidth="2"
                                                                                            strokeLinecap="round"
                                                                                            strokeLinejoin="round"
                                                                                            style={{ flexShrink: 0 }}
                                                                                        >
                                                                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                                                            <polyline points="15 3 21 3 21 9" />
                                                                                            <line x1="10" y1="14" x2="21" y2="3" />
                                                                                        </svg>
                                                                                    </a>
                                                                                );
                                                                            }

                                                                            if (isEmail) {
                                                                                return (
                                                                                    <a
                                                                                        href={`mailto:${cellValue}`}
                                                                                        style={{
                                                                                            color: '#0066FF',
                                                                                            textDecoration: 'none',
                                                                                            fontSize: '0.85rem',
                                                                                            fontWeight: 500,
                                                                                            lineHeight: 1.4,
                                                                                            display: 'inline-flex',
                                                                                            alignItems: 'center',
                                                                                            gap: '4px',
                                                                                            transition: 'all 0.2s ease',
                                                                                        }}
                                                                                        onMouseEnter={(e) => {
                                                                                            e.target.style.textDecoration = 'underline';
                                                                                            e.target.style.color = '#0052CC';
                                                                                        }}
                                                                                        onMouseLeave={(e) => {
                                                                                            e.target.style.textDecoration = 'none';
                                                                                            e.target.style.color = '#0066FF';
                                                                                        }}
                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                    >
                                                                                        {cellValue}
                                                                                        <svg
                                                                                            width="12"
                                                                                            height="12"
                                                                                            viewBox="0 0 24 24"
                                                                                            fill="none"
                                                                                            stroke="currentColor"
                                                                                            strokeWidth="2"
                                                                                            strokeLinecap="round"
                                                                                            strokeLinejoin="round"
                                                                                            style={{ flexShrink: 0 }}
                                                                                        >
                                                                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                                                            <polyline points="22,6 12,13 2,6" />
                                                                                        </svg>
                                                                                    </a>
                                                                                );
                                                                            }

                                                                            return (
                                                                                <Typography variant="body2" sx={{
                                                                                    fontSize: '0.85rem',
                                                                                    fontWeight: 500,
                                                                                    lineHeight: 1.4
                                                                                }}>
                                                                                    {cellValue}
                                                                                </Typography>
                                                                            );
                                                                        })()}
                                                                    </TableCell>
                                                                ))}
                                                                <TableCell
                                                                    sx={{
                                                                        borderBottom: '1px solid #F1F5F9',
                                                                        py: 2.5,
                                                                        px: 3
                                                                    }}
                                                                >
                                                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                                                        <Select
                                                                            value={record.data?.status || record.validation_status || 'pending'}
                                                                            onChange={(e) => handleUpdateRecordStatus(record.id, e.target.value)}
                                                                            variant="outlined"
                                                                            sx={{
                                                                                fontSize: '0.8rem',
                                                                                height: 32,
                                                                                '& .MuiSelect-select': {
                                                                                    py: 0.5,
                                                                                    px: 1.5
                                                                                },
                                                                                '& .MuiOutlinedInput-notchedOutline': {
                                                                                    borderColor: 'transparent'
                                                                                },
                                                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                                    borderColor: '#0066FF'
                                                                                },
                                                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                                    borderColor: '#0066FF',
                                                                                    borderWidth: '2px'
                                                                                },
                                                                                backgroundColor: (() => {
                                                                                    const status = record.data?.status || record.validation_status || 'pending';
                                                                                    switch (status) {
                                                                                        case 'validated': return '#D1FAE5';
                                                                                        case 'flagged': return '#FEE2E2';
                                                                                        case 'contacted': return '#E0E7FF';
                                                                                        case 'responded': return '#ECFDF5';
                                                                                        case 'qualified': return '#FEF3C7';
                                                                                        default: return '#F3F4F6';
                                                                                    }
                                                                                })(),
                                                                                color: (() => {
                                                                                    const status = record.data?.status || record.validation_status || 'pending';
                                                                                    switch (status) {
                                                                                        case 'validated': return '#065F46';
                                                                                        case 'flagged': return '#991B1B';
                                                                                        case 'contacted': return '#3730A3';
                                                                                        case 'responded': return '#14532D';
                                                                                        case 'qualified': return '#92400E';
                                                                                        default: return '#374151';
                                                                                    }
                                                                                })(),
                                                                                borderRadius: 2,
                                                                                fontWeight: 600,
                                                                                transition: 'all 0.2s ease',
                                                                                '&:hover': {
                                                                                    transform: 'translateY(-1px)',
                                                                                    boxShadow: '0 4px 12px rgba(0, 102, 255, 0.15)'
                                                                                }
                                                                            }}
                                                                        >
                                                                            <MenuItem value="pending">
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                    <Box sx={{
                                                                                        width: 8,
                                                                                        height: 8,
                                                                                        borderRadius: '50%',
                                                                                        backgroundColor: '#6B7280'
                                                                                    }} />
                                                                                    Pending
                                                                                </Box>
                                                                            </MenuItem>
                                                                            <MenuItem value="contacted">
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                    <Box sx={{
                                                                                        width: 8,
                                                                                        height: 8,
                                                                                        borderRadius: '50%',
                                                                                        backgroundColor: '#3730A3'
                                                                                    }} />
                                                                                    Contacted
                                                                                </Box>
                                                                            </MenuItem>
                                                                            <MenuItem value="responded">
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                    <Box sx={{
                                                                                        width: 8,
                                                                                        height: 8,
                                                                                        borderRadius: '50%',
                                                                                        backgroundColor: '#14532D'
                                                                                    }} />
                                                                                    Responded
                                                                                </Box>
                                                                            </MenuItem>
                                                                            <MenuItem value="qualified">
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                    <Box sx={{
                                                                                        width: 8,
                                                                                        height: 8,
                                                                                        borderRadius: '50%',
                                                                                        backgroundColor: '#92400E'
                                                                                    }} />
                                                                                    Qualified
                                                                                </Box>
                                                                            </MenuItem>
                                                                            {/* Admin-only options */}
                                                                            {adminViewData?.admin_view && (
                                                                                <>
                                                                                    <MenuItem value="validated">
                                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                            <Box sx={{
                                                                                                width: 8,
                                                                                                height: 8,
                                                                                                borderRadius: '50%',
                                                                                                backgroundColor: '#065F46'
                                                                                            }} />
                                                                                            Validated
                                                                                        </Box>
                                                                                    </MenuItem>
                                                                                    <MenuItem value="flagged">
                                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                            <Box sx={{
                                                                                                width: 8,
                                                                                                height: 8,
                                                                                                borderRadius: '50%',
                                                                                                backgroundColor: '#991B1B'
                                                                                            }} />
                                                                                            Flagged
                                                                                        </Box>
                                                                                    </MenuItem>
                                                                                </>
                                                                            )}
                                                                        </Select>
                                                                    </FormControl>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}
                                    </Box>
                                ) : (
                                    // Auto-select first template if only one exists
                                    <Box sx={{ p: 4, textAlign: 'center', color: '#64748B' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Select a Dataset
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            Choose a dataset from the tabs above to view its records.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>
            )
        },
        {
            label: 'Outreach Scripts',
            icon: <Email />,
            content: (
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            Outreach Playbook
                        </Typography>
                        {adminViewData?.admin_view && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {showOutreachEditor ? (
                                    <>
                                        <DotBridgeButton
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            onClick={handleSaveOutreachTemplates}
                                        >
                                            Save Templates
                                        </DotBridgeButton>
                                        <DotBridgeButton
                                            variant="outlined"
                                            size="small"
                                            onClick={handleCancelEditOutreachTemplates}
                                        >
                                            Cancel
                                        </DotBridgeButton>
                                    </>
                                ) : (
                                    <DotBridgeButton
                                        variant="outlined"
                                        startIcon={<Edit />}
                                        size="small"
                                        onClick={() => setShowOutreachEditor(true)}
                                    >
                                        Edit Templates
                                    </DotBridgeButton>
                                )}
                            </Box>
                        )}
                    </Box>

                    {loadingOutreachTemplates ? (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            py: 8,
                            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                            borderRadius: 3,
                            border: '1px solid #E2E8F0'
                        }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <CircularProgress size={40} sx={{ mb: 2 }} />
                                <Typography variant="body2" color="text.secondary">
                                    Loading outreach templates...
                                </Typography>
                            </Box>
                        </Box>
                    ) : (outreachTemplates.length === 0 && !showOutreachEditor) ? (
                        <DotBridgeCard sx={{
                            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                            border: '1px solid #E2E8F0',
                            borderRadius: 3
                        }}>
                            <CardContent sx={{ py: 8, textAlign: 'center' }}>
                                <Email sx={{ fontSize: '4rem', color: '#CBD5E1', mb: 3 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#64748B' }}>
                                    {adminViewData?.admin_view ? 'No Outreach Templates Created' : 'Templates Being Prepared'}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                                    {adminViewData?.admin_view
                                        ? 'Click "Edit Templates" above to create personalized outreach templates for this client.'
                                        : 'Your personalized outreach templates are being crafted. These will include email scripts, LinkedIn messages, and phone conversation starters.'
                                    }
                                </Typography>
                                {adminViewData?.admin_view && (
                                    <DotBridgeButton
                                        variant="outlined"
                                        startIcon={<Add />}
                                        onClick={() => setShowOutreachEditor(true)}
                                        sx={{
                                            borderRadius: 2,
                                            px: 4,
                                            py: 1.5,
                                            textTransform: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        Create First Template
                                    </DotBridgeButton>
                                )}
                            </CardContent>
                        </DotBridgeCard>
                    ) : (
                        <Grid container spacing={3}>
                            {(showOutreachEditor ? editableOutreachTemplates : outreachTemplates).map((template, index) => {
                                const getTemplateIcon = (type) => {
                                    switch (type) {
                                        case 'email': return <Email />;
                                        case 'linkedin': return <LinkedIn />;
                                        case 'phone': return <Support />;
                                        default: return <Email />;
                                    }
                                };

                                const getTemplateColor = (type) => {
                                    switch (type) {
                                        case 'email': return { bg: '#E6F0FF', color: '#0066FF', accent: '#0052CC' };
                                        case 'linkedin': return { bg: '#E6F3FF', color: '#0077B5', accent: '#005885' };
                                        case 'phone': return { bg: '#F0FDF4', color: '#10B981', accent: '#059669' };
                                        default: return { bg: '#E6F0FF', color: '#0066FF', accent: '#0052CC' };
                                    }
                                };

                                const templateType = template.template_type || template.type || 'email';
                                const colors = getTemplateColor(templateType);

                                return (
                                    <Grid item xs={12} lg={6} key={index}>
                                        <DotBridgeCard sx={{
                                            height: '100%',
                                            position: 'relative',
                                            background: 'linear-gradient(145deg, #FFFFFF 0%, #FAFBFC 100%)',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '20px',
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '4px',
                                                background: `linear-gradient(90deg, ${colors.color} 0%, ${colors.accent} 100%)`,
                                            },
                                            '&:hover': {
                                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), 0 8px 20px rgba(0, 102, 255, 0.1)',
                                                transform: 'translateY(-4px)',
                                            }
                                        }}>
                                            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                {/* Header */}
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                                                    <Box sx={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: '14px',
                                                        background: colors.bg,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mr: 2.5,
                                                        boxShadow: `0 4px 16px ${colors.color}20`,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.1) rotate(5deg)',
                                                            boxShadow: `0 8px 25px ${colors.color}30`,
                                                        }
                                                    }}>
                                                        {React.cloneElement(getTemplateIcon(templateType), {
                                                            sx: { fontSize: '1.5rem', color: colors.color }
                                                        })}
                                                    </Box>
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        {showOutreachEditor && adminViewData?.admin_view ? (
                                                            <TextField
                                                                value={template.title}
                                                                onChange={(e) => handleEditOutreachTemplate(index, 'title', e.target.value)}
                                                                variant="outlined"
                                                                size="small"
                                                                fullWidth
                                                                sx={{
                                                                    mb: 1,
                                                                    '& .MuiInputBase-input': {
                                                                        fontWeight: 700,
                                                                        fontSize: '1.1rem',
                                                                        letterSpacing: '-0.02em'
                                                                    }
                                                                }}
                                                            />
                                                        ) : (
                                                            <Typography variant="h6" sx={{
                                                                fontWeight: 700,
                                                                color: '#1A202C',
                                                                mb: 1,
                                                                fontSize: '1.1rem',
                                                                letterSpacing: '-0.02em',
                                                                lineHeight: 1.3
                                                            }}>
                                                                {template.title}
                                                            </Typography>
                                                        )}

                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Chip
                                                                label={templateType.charAt(0).toUpperCase() + templateType.slice(1)}
                                                                size="small"
                                                                sx={{
                                                                    height: 24,
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 600,
                                                                    backgroundColor: colors.bg,
                                                                    color: colors.color,
                                                                    border: `1px solid ${colors.color}20`,
                                                                    borderRadius: '8px'
                                                                }}
                                                            />
                                                            {showOutreachEditor && adminViewData?.admin_view && (
                                                                <FormControl size="small" sx={{ minWidth: 100 }}>
                                                                    <Select
                                                                        value={templateType}
                                                                        onChange={(e) => handleEditOutreachTemplate(index, 'template_type', e.target.value)}
                                                                        sx={{
                                                                            height: 24,
                                                                            fontSize: '0.75rem',
                                                                            '& .MuiSelect-select': { py: 0.25 }
                                                                        }}
                                                                    >
                                                                        <MenuItem value="email">Email</MenuItem>
                                                                        <MenuItem value="linkedin">LinkedIn</MenuItem>
                                                                        <MenuItem value="phone">Phone</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            )}
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                                                        {showOutreachEditor && adminViewData?.admin_view && (
                                                            <Tooltip title="Delete template">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleDeleteOutreachTemplate(index)}
                                                                    sx={{
                                                                        color: '#EF4444',
                                                                        opacity: 0.7,
                                                                        '&:hover': {
                                                                            opacity: 1,
                                                                            backgroundColor: '#FEE2E2',
                                                                            color: '#DC2626'
                                                                        }
                                                                    }}
                                                                >
                                                                    <Delete sx={{ fontSize: '1.1rem' }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                        <Tooltip title="Copy to clipboard">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => copyToClipboard(template.content)}
                                                                sx={{
                                                                    color: colors.color,
                                                                    opacity: 0.7,
                                                                    '&:hover': {
                                                                        opacity: 1,
                                                                        backgroundColor: colors.bg,
                                                                        color: colors.accent
                                                                    }
                                                                }}
                                                            >
                                                                <ContentCopy sx={{ fontSize: '1.1rem' }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </Box>

                                                {/* Subject Line */}
                                                {template.subject !== undefined && (
                                                    <Box sx={{ mb: 3 }}>
                                                        <Typography variant="overline" sx={{
                                                            fontSize: '0.7rem',
                                                            fontWeight: 700,
                                                            color: colors.color,
                                                            letterSpacing: '0.1em',
                                                            textTransform: 'uppercase',
                                                            mb: 1,
                                                            display: 'block'
                                                        }}>
                                                            Subject Line
                                                        </Typography>
                                                        {showOutreachEditor && adminViewData?.admin_view ? (
                                                            <TextField
                                                                fullWidth
                                                                value={template.subject}
                                                                onChange={(e) => handleEditOutreachTemplate(index, 'subject', e.target.value)}
                                                                variant="outlined"
                                                                size="small"
                                                                placeholder="Email subject line..."
                                                                sx={{
                                                                    '& .MuiInputBase-root': {
                                                                        backgroundColor: '#FAFBFC',
                                                                        borderRadius: 2
                                                                    }
                                                                }}
                                                            />
                                                        ) : (
                                                            <Box sx={{
                                                                p: 2,
                                                                background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                                                                borderRadius: 2,
                                                                border: '1px solid #E2E8F0',
                                                                fontSize: '0.9rem',
                                                                fontWeight: 500,
                                                                color: '#374151',
                                                                fontStyle: template.subject ? 'normal' : 'italic'
                                                            }}>
                                                                {template.subject || 'No subject line'}
                                                            </Box>
                                                        )}
                                                    </Box>
                                                )}

                                                {/* Template Content */}
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="overline" sx={{
                                                        fontSize: '0.7rem',
                                                        fontWeight: 700,
                                                        color: colors.color,
                                                        letterSpacing: '0.1em',
                                                        textTransform: 'uppercase',
                                                        mb: 1,
                                                        display: 'block'
                                                    }}>
                                                        Template Content
                                                    </Typography>
                                                    {showOutreachEditor && adminViewData?.admin_view ? (
                                                        <TextField
                                                            fullWidth
                                                            multiline
                                                            rows={8}
                                                            value={template.content}
                                                            onChange={(e) => handleEditOutreachTemplate(index, 'content', e.target.value)}
                                                            variant="outlined"
                                                            placeholder="Template content..."
                                                            sx={{
                                                                '& .MuiInputBase-root': {
                                                                    backgroundColor: '#FAFBFC',
                                                                    borderRadius: 2
                                                                },
                                                                '& .MuiInputBase-input': {
                                                                    fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
                                                                    fontSize: '0.85rem',
                                                                    lineHeight: 1.6
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <Box sx={{
                                                            p: 3,
                                                            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                                                            borderRadius: 2,
                                                            border: '1px solid #E2E8F0',
                                                            fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
                                                            whiteSpace: 'pre-wrap',
                                                            fontSize: '0.85rem',
                                                            lineHeight: 1.6,
                                                            color: '#374151',
                                                            maxHeight: 200,
                                                            overflow: 'auto',
                                                            '&::-webkit-scrollbar': {
                                                                width: 6,
                                                            },
                                                            '&::-webkit-scrollbar-track': {
                                                                background: '#F1F5F9',
                                                                borderRadius: 3,
                                                            },
                                                            '&::-webkit-scrollbar-thumb': {
                                                                background: colors.color,
                                                                borderRadius: 3,
                                                                opacity: 0.5,
                                                            },
                                                            '&::-webkit-scrollbar-thumb:hover': {
                                                                opacity: 0.8,
                                                            }
                                                        }}>
                                                            {template.content || 'No content available'}
                                                        </Box>
                                                    )}
                                                </Box>

                                                {/* Usage Stats (for non-edit mode) */}
                                                {!showOutreachEditor && (
                                                    <Box sx={{
                                                        mt: 3,
                                                        pt: 3,
                                                        borderTop: '1px solid #F1F5F9',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                            <Typography variant="caption" color="text.secondary" sx={{
                                                                fontSize: '0.75rem',
                                                                fontWeight: 500
                                                            }}>
                                                                {template.content?.length || 0} characters
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{
                                                                fontSize: '0.75rem',
                                                                fontWeight: 500
                                                            }}>
                                                                Ready to use
                                                            </Typography>
                                                        </Box>
                                                        <DotBridgeButton
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<ContentCopy />}
                                                            onClick={() => copyToClipboard(template.content)}
                                                            sx={{
                                                                borderColor: colors.color,
                                                                color: colors.color,
                                                                fontSize: '0.75rem',
                                                                px: 2,
                                                                py: 0.5,
                                                                borderRadius: 2,
                                                                textTransform: 'none',
                                                                fontWeight: 600,
                                                                '&:hover': {
                                                                    backgroundColor: colors.bg,
                                                                    borderColor: colors.accent,
                                                                    color: colors.accent
                                                                }
                                                            }}
                                                        >
                                                            Copy Template
                                                        </DotBridgeButton>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </DotBridgeCard>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}

                    {showOutreachEditor && adminViewData?.admin_view && (
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <DotBridgeButton
                                variant="outlined"
                                startIcon={<Add />}
                                onClick={handleAddOutreachTemplate}
                            >
                                Add New Template
                            </DotBridgeButton>
                        </Box>
                    )}
                </Box>
            )
        },

    ];

    return (
        <Box sx={{
            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 25%, #FAFBFC 75%, #F8FAFC 100%)',
            minHeight: '100vh',
            position: 'relative',
            fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            '&::before': {
                content: '""',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 20% 80%, rgba(0, 102, 255, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0, 212, 255, 0.03) 0%, transparent 50%)',
                pointerEvents: 'none',
                zIndex: 0,
            }
        }}>
            <Container maxWidth={false} sx={{
                py: 1.5,
                px: 2,
                position: 'relative',
                zIndex: 1,
                maxWidth: '1600px',
                mx: 'auto'
            }}>
                <Grid container spacing={1.5}>
                    {/* Left Column - Sidebar */}
                    <Grid item xs={12} lg={2.5} md={3}>
                        {/* Header */}
                        <DotBridgeCard sx={{
                            mb: 1.5,
                            background: 'linear-gradient(145deg, #FFFFFF 0%, #FAFBFC 100%)',
                            border: '1px solid #E2E8F0',
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                    <Avatar sx={{
                                        width: 48,
                                        height: 48,
                                        background: 'linear-gradient(135deg, #0066FF 0%, #0052CC 100%)',
                                        fontSize: '1.4rem',
                                        fontWeight: 700,
                                        mb: 1.5,
                                        border: '3px solid rgba(0, 102, 255, 0.1)',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 4px 20px rgba(0, 102, 255, 0.2)'
                                        }
                                    }}>
                                        {user.email.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Typography variant="h5" component="h1" gutterBottom sx={{
                                        fontWeight: 800,
                                        mb: 0.5,
                                        fontSize: '1.5rem',
                                        color: '#1A202C',
                                        letterSpacing: '-0.03em'
                                    }}>
                                        Career Command Center
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                        mb: 1.5,
                                        color: '#64748B',
                                        fontWeight: 500,
                                        letterSpacing: '-0.01em',
                                        fontSize: '0.9rem'
                                    }}>
                                        Welcome back,<br />
                                        <Box component="span" sx={{
                                            fontWeight: 600,
                                            color: '#0066FF'
                                        }}>
                                            {user.email}
                                        </Box>
                                    </Typography>
                                    <Chip
                                        label={order.offer?.name || 'Career Accelerator'}
                                        sx={{
                                            background: 'linear-gradient(135deg, #E6F0FF 0%, #DBEAFE 100%)',
                                            color: '#0066FF',
                                            fontWeight: 700,
                                            fontSize: '0.85rem',
                                            px: 2,
                                            py: 1,
                                            height: 'auto',
                                            borderRadius: '10px',
                                            border: '1px solid rgba(0, 102, 255, 0.2)',
                                            boxShadow: '0 2px 8px rgba(0, 102, 255, 0.1)',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 12px rgba(0, 102, 255, 0.15)'
                                            }
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </DotBridgeCard>

                        {/* Navigation Tabs - Vertical */}
                        <DotBridgeCard sx={{
                            background: 'linear-gradient(145deg, #FFFFFF 0%, #FAFBFC 100%)',
                            border: '1px solid #E2E8F0',
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
                            animation: `${slideInLeft} 1s ease-out 0.2s both`,
                            backdrop: 'blur(10px)',
                            overflow: 'hidden',
                            '&:hover': {
                                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12), 0 4px 6px rgba(0, 0, 0, 0.1)',
                                transform: 'translateY(-2px)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            }
                        }}>
                            <CardContent sx={{ p: 0 }}>
                                <List sx={{ p: 1.5 }}>
                                    {tabContent.map((tab, index) => (
                                        <ListItem
                                            key={index}
                                            button
                                            selected={activeTab === index}
                                            onClick={() => setActiveTab(index)}
                                            sx={{
                                                py: 2,
                                                px: 2.5,
                                                mb: 0.75,
                                                borderRadius: '14px',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                position: 'relative',
                                                cursor: 'pointer',
                                                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                                overflow: 'hidden',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    background: activeTab === index
                                                        ? 'linear-gradient(135deg, #0066FF 0%, #0052CC 100%)'
                                                        : 'transparent',
                                                    opacity: activeTab === index ? 1 : 0,
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    borderRadius: '14px',
                                                    zIndex: 0,
                                                },
                                                '&::after': activeTab === index ? {
                                                    content: '""',
                                                    position: 'absolute',
                                                    left: '-2px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    width: '4px',
                                                    height: '60%',
                                                    background: 'linear-gradient(180deg, #00D4FF 0%, #0066FF 100%)',
                                                    borderRadius: '0 4px 4px 0',
                                                    boxShadow: '0 0 20px rgba(0, 102, 255, 0.6)',
                                                    zIndex: 2,
                                                } : {},
                                                '&.Mui-selected': {
                                                    color: '#FFFFFF',
                                                    transform: 'translateX(4px) scale(1.02)',
                                                    boxShadow: '0 8px 25px rgba(0, 102, 255, 0.25), 0 4px 12px rgba(0, 0, 0, 0.15)',
                                                    '& .MuiListItemIcon-root': {
                                                        color: '#FFFFFF !important',
                                                        transform: 'scale(1.1)',
                                                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                                                    },
                                                    '& .MuiListItemText-primary': {
                                                        color: '#FFFFFF !important',
                                                        fontWeight: 700,
                                                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                                                    }
                                                },
                                                '&:hover:not(.Mui-selected)': {
                                                    backgroundColor: 'rgba(0, 102, 255, 0.06)',
                                                    transform: 'translateX(6px) scale(1.01)',
                                                    boxShadow: '0 4px 15px rgba(0, 102, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08)',
                                                    '&::before': {
                                                        opacity: 0.1,
                                                        background: 'linear-gradient(135deg, #0066FF 0%, #0052CC 100%)',
                                                    },
                                                    '& .MuiListItemIcon-root': {
                                                        color: '#0066FF',
                                                        transform: 'scale(1.05)',
                                                    },
                                                    '& .MuiListItemText-primary': {
                                                        color: '#0066FF',
                                                        fontWeight: 600,
                                                    }
                                                },
                                                '&:active': {
                                                    transform: 'translateX(2px) scale(0.98)',
                                                    transition: 'all 0.1s ease',
                                                },
                                                zIndex: 1,
                                            }}
                                        >
                                            <ListItemIcon sx={{
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                minWidth: 44,
                                                color: '#64748B',
                                                zIndex: 2,
                                                position: 'relative',
                                            }}>
                                                {tab.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={tab.label}
                                                primaryTypographyProps={{
                                                    fontWeight: activeTab === index ? 700 : 500,
                                                    fontSize: '0.95rem',
                                                    letterSpacing: '-0.02em',
                                                    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                                    position: 'relative',
                                                    zIndex: 2,
                                                    color: activeTab === index ? '#FFFFFF' : '#64748B',
                                                }}
                                                sx={{
                                                    '& .MuiTypography-root': {
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        color: activeTab === index ? '#FFFFFF !important' : '#64748B !important',
                                                    }
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </DotBridgeCard>
                    </Grid>

                    {/* Right Column - Main Content */}
                    <Grid item xs={12} lg={9.5} md={9}>
                        {/* Tab Content */}
                        <Box sx={{
                            animation: `${slideInRight} 1s ease-out 0.3s both`,
                        }}>
                            {tabContent[activeTab]?.content}
                        </Box>
                    </Grid>
                </Grid>



                {/* CSV Preview Dialog */}
                <Dialog
                    open={showCsvPreviewDialog}
                    onClose={() => setShowCsvPreviewDialog(false)}
                    maxWidth="lg"
                    fullWidth
                >
                    <DialogTitle>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            CSV Analysis & Template Setup
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        {csvAnalysisResult && (
                            <Box sx={{ mt: 2 }}>
                                {/* Analysis Summary */}
                                <Alert severity="success" sx={{ mb: 3 }}>
                                    <Typography variant="body2">
                                        <strong>LLM Analysis Complete:</strong> {csvAnalysisResult.analysis_summary ||
                                            `Found ${csvAnalysisResult.row_count || 0} rows and ${csvAnalysisResult.columns?.length || 0} columns.`}
                                    </Typography>
                                </Alert>

                                {/* Template Settings */}
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                            Template Settings
                                        </Typography>

                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Template Name
                                            </Typography>
                                            <input
                                                type="text"
                                                value={csvTemplateSettings.name}
                                                onChange={(e) => setCsvTemplateSettings(prev => ({ ...prev, name: e.target.value }))}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #E2E8F0',
                                                    borderRadius: '6px',
                                                    fontSize: '14px'
                                                }}
                                            />
                                        </Box>

                                        <Typography variant="subtitle2" gutterBottom>
                                            Select Columns to Include
                                        </Typography>
                                        {csvAnalysisResult.columns?.map((column) => (
                                            <Box key={column.name} sx={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                mb: 2,
                                                p: 2,
                                                borderRadius: 2,
                                                backgroundColor: csvTemplateSettings.selectedColumns.includes(column.name) ? '#F0F9FF' : '#F8FAFC',
                                                border: '1px solid',
                                                borderColor: csvTemplateSettings.selectedColumns.includes(column.name) ? '#E6F0FF' : '#E2E8F0'
                                            }}>
                                                <Checkbox
                                                    checked={csvTemplateSettings.selectedColumns.includes(column.name)}
                                                    onChange={(e) => {
                                                        const newSelected = e.target.checked
                                                            ? [...csvTemplateSettings.selectedColumns, column.name]
                                                            : csvTemplateSettings.selectedColumns.filter(c => c !== column.name);
                                                        setCsvTemplateSettings(prev => ({ ...prev, selectedColumns: newSelected }));
                                                    }}
                                                    sx={{ mt: -0.5 }}
                                                />
                                                <Box sx={{ ml: 1, flex: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            {column.name}
                                                        </Typography>
                                                        {column.data_type && (
                                                            <Chip label={column.data_type} size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
                                                        )}
                                                        {column.confidence && (
                                                            <Chip
                                                                label={`${Math.round(column.confidence * 100)}% confident`}
                                                                size="small"
                                                                color="success"
                                                                sx={{ height: 20, fontSize: '0.7rem' }}
                                                            />
                                                        )}
                                                    </Box>
                                                    {column.usage_note && (
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                            🤖 {column.usage_note}
                                                        </Typography>
                                                    )}
                                                    {column.example && (
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                            📋 Example: {column.example}
                                                        </Typography>
                                                    )}
                                                    {column.intelligence_value && (
                                                        <Typography variant="caption" color="primary.main" sx={{ display: 'block' }}>
                                                            💡 Intelligence Value: {column.intelligence_value}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        )) || []}
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                            Data Preview
                                        </Typography>

                                        {csvPreview && (
                                            <TableContainer component={Box} sx={{
                                                maxHeight: 400,
                                                border: '1px solid #E2E8F0',
                                                borderRadius: 1
                                            }}>
                                                <Table size="small" stickyHeader>
                                                    <TableHead>
                                                        <TableRow>
                                                            {csvPreview.headers.map((header) => (
                                                                <TableCell key={header} sx={{
                                                                    fontWeight: 600,
                                                                    backgroundColor: csvTemplateSettings.selectedColumns.includes(header) ? '#E6F0FF' : '#F8FAFC'
                                                                }}>
                                                                    {header}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {csvPreview.rows.map((row, index) => (
                                                            <TableRow key={index}>
                                                                {csvPreview.headers.map((header) => (
                                                                    <TableCell key={header} sx={{
                                                                        backgroundColor: csvTemplateSettings.selectedColumns.includes(header) ? '#FAFCFF' : 'transparent'
                                                                    }}>
                                                                        {row[header] || '-'}
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <DotBridgeButton
                            onClick={() => setShowCsvPreviewDialog(false)}
                            variant="outlined"
                        >
                            Cancel
                        </DotBridgeButton>
                        <DotBridgeButton
                            onClick={async () => {
                                if (!csvTemplateSettings.name.trim()) {
                                    alert('Please enter a template name');
                                    return;
                                }
                                if (csvTemplateSettings.selectedColumns.length === 0) {
                                    alert('Please select at least one column');
                                    return;
                                }

                                try {
                                    const result = await createIntelligenceFromCSV(
                                        csvFile,
                                        csvTemplateSettings.name,
                                        csvTemplateSettings.selectedColumns,
                                        csvTemplateSettings.columnMappings
                                    );
                                    alert(`✅ Success! Intelligence template "${csvTemplateSettings.name}" created with ${result.records_created} records.`);
                                } catch (error) {
                                    const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
                                    alert(`❌ Failed to create template: ${errorMessage}`);
                                }
                            }}
                            variant="contained"
                            disabled={csvUploading}
                            startIcon={csvUploading ? <CircularProgress size={16} /> : null}
                        >
                            {csvUploading ? 'Creating Template & Importing Records...' : `Create Template & Import ${csvAnalysisResult?.row_count || 0} Records`}
                        </DotBridgeButton>
                    </DialogActions>
                </Dialog>

                {/* Add Task Dialog */}
                <Dialog open={showAddTaskDialog} onClose={() => setShowAddTaskDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2 }}>
                            <TextField
                                fullWidth
                                label="Task Description"
                                value={newTaskData.text}
                                onChange={(e) => setNewTaskData(prev => ({ ...prev, text: e.target.value }))}
                                multiline
                                rows={3}
                                sx={{ mb: 3 }}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    value={newTaskData.priority}
                                    label="Priority"
                                    onChange={(e) => setNewTaskData(prev => ({ ...prev, priority: e.target.value }))}
                                >
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <DotBridgeButton onClick={() => setShowAddTaskDialog(false)}>Cancel</DotBridgeButton>
                        <DotBridgeButton variant="contained" onClick={handleSaveNewTask}>Add Task</DotBridgeButton>
                    </DialogActions>
                </Dialog>

                {/* Edit Day Dialog */}
                <Dialog open={showEditDayDialog} onClose={() => setShowEditDayDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Edit Day Details</DialogTitle>
                    <DialogContent>
                        {editingDay && (
                            <Box sx={{ pt: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Day Title"
                                    defaultValue={editableActionPlan[editingDay.weekIndex]?.days[editingDay.dayIndex]?.title || ''}
                                    sx={{ mb: 3 }}
                                    onChange={(e) => {
                                        const updatedPlan = [...editableActionPlan];
                                        updatedPlan[editingDay.weekIndex].days[editingDay.dayIndex].title = e.target.value;
                                        setEditableActionPlan(updatedPlan);
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Estimated Time"
                                    defaultValue={editableActionPlan[editingDay.weekIndex]?.days[editingDay.dayIndex]?.estimatedTime || ''}
                                    sx={{ mb: 3 }}
                                    onChange={(e) => {
                                        const updatedPlan = [...editableActionPlan];
                                        updatedPlan[editingDay.weekIndex].days[editingDay.dayIndex].estimatedTime = e.target.value;
                                        setEditableActionPlan(updatedPlan);
                                    }}
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Priority</InputLabel>
                                    <Select
                                        value={editableActionPlan[editingDay.weekIndex]?.days[editingDay.dayIndex]?.priority || 'medium'}
                                        label="Priority"
                                        onChange={(e) => {
                                            const updatedPlan = [...editableActionPlan];
                                            updatedPlan[editingDay.weekIndex].days[editingDay.dayIndex].priority = e.target.value;
                                            setEditableActionPlan(updatedPlan);
                                        }}
                                    >
                                        <MenuItem value="low">Low</MenuItem>
                                        <MenuItem value="medium">Medium</MenuItem>
                                        <MenuItem value="high">High</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <DotBridgeButton onClick={() => setShowEditDayDialog(false)}>Cancel</DotBridgeButton>
                        <DotBridgeButton variant="contained" onClick={() => setShowEditDayDialog(false)}>Save Changes</DotBridgeButton>
                    </DialogActions>
                </Dialog>

                {/* Add Record Dialog */}
                <Dialog open={showAddRecordDialog} onClose={() => setShowAddRecordDialog(false)} maxWidth="md" fullWidth>
                    <DialogTitle sx={{
                        background: 'linear-gradient(135deg, #0066FF 0%, #0052CC 100%)',
                        color: 'white',
                        fontWeight: 700
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Add />
                            Add New Record to {selectedTemplate?.name}
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        {selectedTemplate && (
                            <Grid container spacing={3}>
                                {selectedTemplate.columns.map((column) => (
                                    <Grid item xs={12} sm={6} key={column.name}>
                                        <TextField
                                            fullWidth
                                            label={column.name}
                                            value={newRecordData[column.name] || ''}
                                            onChange={(e) => setNewRecordData(prev => ({
                                                ...prev,
                                                [column.name]: e.target.value
                                            }))}
                                            variant="outlined"
                                            helperText={column.data_type && `Type: ${column.data_type}`}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#0066FF'
                                                    }
                                                }
                                            }}
                                        />
                                    </Grid>
                                ))}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={newRecordData.status || 'pending'}
                                            label="Status"
                                            onChange={(e) => setNewRecordData(prev => ({
                                                ...prev,
                                                status: e.target.value
                                            }))}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            <MenuItem value="pending">Pending</MenuItem>
                                            <MenuItem value="validated">Validated</MenuItem>
                                            <MenuItem value="contacted">Contacted</MenuItem>
                                            <MenuItem value="responded">Responded</MenuItem>
                                            <MenuItem value="qualified">Qualified</MenuItem>
                                            <MenuItem value="flagged">Flagged</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3, gap: 1 }}>
                        <DotBridgeButton
                            onClick={() => {
                                setShowAddRecordDialog(false);
                                setNewRecordData({});
                            }}
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                        >
                            Cancel
                        </DotBridgeButton>
                        <DotBridgeButton
                            variant="contained"
                            onClick={handleAddNewRecord}
                            sx={{
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #0066FF 0%, #0052CC 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #0052CC 0%, #003D99 100%)'
                                }
                            }}
                        >
                            Add Record
                        </DotBridgeButton>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default ClientDashboard; 