import React, { useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Tooltip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Button,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from '@mui/material';
import {
    ChevronDown,
    BookOpen,
    Pencil,
    Share2,
    Trash2,
    Eye,
    Plus,
    Globe,
    Lock,
    Copy,
    MoveVertical
} from 'lucide-react';
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
    courseContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: '12px',
        border: `1px solid ${theme.colors.border}`,
        overflow: 'hidden',
        marginBottom: '16px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
        }
    },
    accordionSummary: {
        padding: '12px 16px',
        '& .MuiAccordionSummary-content': {
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        '&.Mui-expanded': {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderBottom: `1px solid ${theme.colors.border}`,
        }
    },
    accordionDetails: {
        padding: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    moduleList: {
        padding: 0,
        width: '100%',
    },
    moduleItem: {
        borderBottom: `1px solid ${theme.colors.border}`,
        padding: '12px 16px',
        transition: 'background-color 0.2s ease-in-out',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
        },
        '&:last-child': {
            borderBottom: 'none',
        }
    },
    moduleActions: {
        display: 'flex',
        gap: '8px',
    },
    actionButton: {
        color: theme.colors.text.secondary,
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: theme.colors.primary,
        }
    },
    addModuleButton: {
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        color: '#22D3EE',
        margin: '12px 16px',
        textTransform: 'none',
        borderRadius: '8px',
        padding: '8px 16px',
        border: '1px solid rgba(34, 211, 238, 0.2)',
        '&:hover': {
            backgroundColor: 'rgba(34, 211, 238, 0.15)',
            boxShadow: '0 0 10px rgba(34, 211, 238, 0.2)',
        }
    },
    courseActions: {
        display: 'flex',
        gap: '8px',
    },
    statusIndicator: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginLeft: '12px',
    },
    dialog: {
        '& .MuiDialog-paper': {
            backgroundColor: theme.colors.backgroundLight,
            borderRadius: '12px',
            border: `1px solid ${theme.colors.border}`,
            color: theme.colors.text.primary
        }
    },
    select: {
        color: theme.colors.text.primary,
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.colors.border
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.colors.primary
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.colors.primary
        },
        '& .MuiSelect-icon': {
            color: theme.colors.text.secondary
        }
    },
    textField: {
        '& .MuiOutlinedInput-root': {
            color: theme.colors.text.primary,
            '& fieldset': {
                borderColor: theme.colors.border
            },
            '&:hover fieldset': {
                borderColor: theme.colors.primary
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.colors.primary
            }
        },
        '& .MuiInputLabel-root': {
            color: theme.colors.text.secondary
        }
    }
};

const CourseList = ({
    courses = [],
    modules = [],
    onViewCourse,
    onEditCourse,
    onShareCourse,
    onDeleteCourse,
    onViewModule,
    onEditModule,
    onAddModuleToCourse,
    onRemoveModuleFromCourse,
    onCreateCourse,
    onReorderModules
}) => {
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [addModuleDialogOpen, setAddModuleDialogOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedModule, setSelectedModule] = useState('');
    const [newCourseName, setNewCourseName] = useState('');
    const [createCourseDialogOpen, setCreateCourseDialogOpen] = useState(false);

    const handleCourseAccordionChange = (courseId) => (event, isExpanded) => {
        setExpandedCourse(isExpanded ? courseId : null);
    };

    const handleAddModuleClick = (course) => {
        setSelectedCourse(course);
        setAddModuleDialogOpen(true);
    };

    const handleAddModuleConfirm = () => {
        if (selectedModule && selectedCourse) {
            onAddModuleToCourse(selectedCourse.id, selectedModule);
            setAddModuleDialogOpen(false);
            setSelectedModule('');
        }
    };

    const handleCreateCourseClick = () => {
        setCreateCourseDialogOpen(true);
    };

    const handleCreateCourseConfirm = () => {
        if (newCourseName.trim()) {
            onCreateCourse({ name: newCourseName });
            setCreateCourseDialogOpen(false);
            setNewCourseName('');
        }
    };

    const CourseStatusIndicator = ({ shareable }) => (
        <Box sx={styles.statusIndicator}>
            {shareable ? (
                <>
                    <Globe size={16} style={{ color: '#22D3EE' }} />
                    <Typography variant="caption" sx={{ color: '#22D3EE' }}>Public</Typography>
                </>
            ) : (
                <>
                    <Lock size={16} style={{ color: theme.colors.text.secondary }} />
                    <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>Private</Typography>
                </>
            )}
        </Box>
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                    Your AI Courses
                </Typography>
                <Button
                    startIcon={<Plus size={18} />}
                    onClick={handleCreateCourseClick}
                    sx={{
                        backgroundColor: 'rgba(79, 156, 249, 0.1)',
                        color: '#4F9CF9',
                        textTransform: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        border: '1px solid rgba(79, 156, 249, 0.2)',
                        '&:hover': {
                            backgroundColor: 'rgba(79, 156, 249, 0.15)',
                            boxShadow: '0 0 10px rgba(79, 156, 249, 0.2)',
                        }
                    }}
                >
                    Create New Course
                </Button>
            </Box>

            {courses.length === 0 ? (
                <Box
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        borderRadius: '12px',
                        border: `1px solid ${theme.colors.border}`,
                        padding: '24px',
                        textAlign: 'center',
                        marginBottom: '32px'
                    }}
                >
                    <BookOpen size={48} style={{ color: '#4F9CF9', marginBottom: '16px', opacity: 0.7 }} />
                    <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 1 }}>
                        No Courses Yet
                    </Typography>
                    <Typography sx={{ color: theme.colors.text.secondary, mb: 3 }}>
                        Create your first course to organize your AI modules
                    </Typography>
                    <Button
                        startIcon={<Plus size={18} />}
                        onClick={handleCreateCourseClick}
                        sx={{
                            backgroundColor: 'rgba(79, 156, 249, 0.1)',
                            color: '#4F9CF9',
                            textTransform: 'none',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            border: '1px solid rgba(79, 156, 249, 0.2)',
                            '&:hover': {
                                backgroundColor: 'rgba(79, 156, 249, 0.15)',
                                boxShadow: '0 0 10px rgba(79, 156, 249, 0.2)',
                            }
                        }}
                    >
                        Create New Course
                    </Button>
                </Box>
            ) : (
                courses.map((course) => (
                    <Accordion
                        key={course.id}
                        expanded={expandedCourse === course.id}
                        onChange={handleCourseAccordionChange(course.id)}
                        disableGutters
                        elevation={0}
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        sx={styles.courseContainer}
                    >
                        <AccordionSummary
                            expandIcon={<ChevronDown size={20} color={theme.colors.text.secondary} />}
                            sx={styles.accordionSummary}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <BookOpen size={20} style={{ marginRight: '12px', color: '#4F9CF9' }} />
                                <Typography sx={{ color: theme.colors.text.primary, fontWeight: 500 }}>
                                    {course.name}
                                </Typography>
                                <CourseStatusIndicator shareable={course.shareable} />
                            </Box>
                            <Box sx={styles.courseActions} onClick={(e) => e.stopPropagation()}>
                                <Tooltip title="View Course">
                                    <IconButton
                                        size="small"
                                        sx={styles.actionButton}
                                        onClick={() => onViewCourse(course)}
                                    >
                                        <Eye size={18} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit Course">
                                    <IconButton
                                        size="small"
                                        sx={styles.actionButton}
                                        onClick={() => onEditCourse(course)}
                                    >
                                        <Pencil size={18} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Share Course">
                                    <IconButton
                                        size="small"
                                        sx={styles.actionButton}
                                        onClick={() => onShareCourse(course)}
                                    >
                                        <Share2 size={18} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Course">
                                    <IconButton
                                        size="small"
                                        sx={{
                                            ...styles.actionButton,
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 59, 48, 0.1)',
                                                color: '#ff3b30',
                                            }
                                        }}
                                        onClick={() => onDeleteCourse(course)}
                                    >
                                        <Trash2 size={18} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={styles.accordionDetails}>
                            {course.modules && course.modules.length > 0 ? (
                                <List sx={styles.moduleList}>
                                    {course.modules.map((module) => (
                                        <ListItem
                                            key={module.id}
                                            sx={styles.moduleItem}
                                            component={motion.li}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Typography sx={{ color: theme.colors.text.primary }}>
                                                            {module.name}
                                                        </Typography>
                                                        {module.shareable && (
                                                            <Globe
                                                                size={14}
                                                                style={{
                                                                    marginLeft: '8px',
                                                                    color: '#22D3EE',
                                                                    opacity: 0.7
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                }
                                            />
                                            <ListItemSecondaryAction sx={styles.moduleActions}>
                                                <Tooltip title="View Module">
                                                    <IconButton
                                                        size="small"
                                                        sx={styles.actionButton}
                                                        onClick={() => onViewModule(module.brdge_id)}
                                                    >
                                                        <Eye size={16} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit Module">
                                                    <IconButton
                                                        size="small"
                                                        sx={styles.actionButton}
                                                        onClick={() => onEditModule(module.brdge_id)}
                                                    >
                                                        <Pencil size={16} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Remove from Course">
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            ...styles.actionButton,
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(255, 59, 48, 0.1)',
                                                                color: '#ff3b30',
                                                            }
                                                        }}
                                                        onClick={() => onRemoveModuleFromCourse(course.id, module.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </IconButton>
                                                </Tooltip>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Box sx={{
                                    padding: '24px',
                                    textAlign: 'center',
                                    color: theme.colors.text.secondary
                                }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        No modules in this course yet
                                    </Typography>
                                    <Typography variant="caption">
                                        Add modules to organize your course content
                                    </Typography>
                                </Box>
                            )}
                            <Button
                                startIcon={<Plus size={16} />}
                                sx={styles.addModuleButton}
                                onClick={() => handleAddModuleClick(course)}
                            >
                                Add Module to Course
                            </Button>
                        </AccordionDetails>
                    </Accordion>
                ))
            )}

            {/* Add Module to Course Dialog */}
            <Dialog
                open={addModuleDialogOpen}
                onClose={() => setAddModuleDialogOpen(false)}
                sx={styles.dialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Add Module to Course
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: theme.colors.text.secondary }}>
                        Select a module to add to "{selectedCourse?.name}"
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="module-select-label" sx={{ color: theme.colors.text.secondary }}>
                            Module
                        </InputLabel>
                        <Select
                            labelId="module-select-label"
                            value={selectedModule}
                            onChange={(e) => setSelectedModule(e.target.value)}
                            label="Module"
                            sx={styles.select}
                        >
                            {modules
                                .filter(module =>
                                    // Filter out modules already in the course
                                    !selectedCourse?.modules?.some(
                                        m => m.brdge_id === module.id
                                    )
                                )
                                .map(module => (
                                    <MenuItem key={module.id} value={module.id}>
                                        {module.name}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setAddModuleDialogOpen(false)}
                        sx={{ color: theme.colors.text.secondary }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddModuleConfirm}
                        disabled={!selectedModule}
                        sx={{
                            backgroundColor: 'rgba(34, 211, 238, 0.1)',
                            color: '#22D3EE',
                            '&:hover': {
                                backgroundColor: 'rgba(34, 211, 238, 0.2)',
                            },
                            '&.Mui-disabled': {
                                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                color: 'rgba(255, 255, 255, 0.3)'
                            }
                        }}
                    >
                        Add Module
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create Course Dialog */}
            <Dialog
                open={createCourseDialogOpen}
                onClose={() => setCreateCourseDialogOpen(false)}
                sx={styles.dialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Create New Course
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="course-name"
                        label="Course Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newCourseName}
                        onChange={(e) => setNewCourseName(e.target.value)}
                        sx={styles.textField}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setCreateCourseDialogOpen(false)}
                        sx={{ color: theme.colors.text.secondary }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateCourseConfirm}
                        disabled={!newCourseName.trim()}
                        sx={{
                            backgroundColor: 'rgba(79, 156, 249, 0.1)',
                            color: '#4F9CF9',
                            '&:hover': {
                                backgroundColor: 'rgba(79, 156, 249, 0.2)',
                            },
                            '&.Mui-disabled': {
                                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                color: 'rgba(255, 255, 255, 0.3)'
                            }
                        }}
                    >
                        Create Course
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CourseList; 