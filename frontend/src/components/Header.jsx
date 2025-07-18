import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Avatar,
    useScrollTrigger,
    Divider,
    Menu,
    MenuItem,
    Container,
    Slide,
    useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { logout } from '../utils/auth';
import { useTheme } from '@mui/material/styles';
import { api } from '../api';
import PersonIcon from '@mui/icons-material/Person';
import { motion, AnimatePresence } from 'framer-motion';

// Demo bridge ID for navigation
const DEMO_BRIDGE_ID = '447';

function HideOnScroll(props) {
    const { children } = props;
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

function Header() {
    const { isAuthenticated, setIsAuthenticated, userRole } = useContext(AuthContext);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const location = useLocation();
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [servicesAnchorEl, setServicesAnchorEl] = useState(null);
    const [servicesMenuOpen, setServicesMenuOpen] = useState(false);

    // Determine if we're on the landing page
    const isLandingPage = location.pathname === '/';

    // Track scroll position for transparent to solid transition
    const scrollTrigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 20,
    });

    // State for scroll position to handle transparency
    const [scrollPosition, setScrollPosition] = useState(0);

    // Track scroll position
    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Header background with improved design
    const headerBackground = isLandingPage
        ? scrollTrigger
            ? theme.palette.background.paper + 'F5'
            : 'transparent'
        : theme.palette.background.paper;

    // Text colors based on landing page and scroll state
    const textColor = isLandingPage && !scrollTrigger
        ? theme.palette.text.primary
        : theme.palette.text.primary;

    useEffect(() => {
        if (isAuthenticated) {
            api.get('/user/profile')
                .then(response => {
                    setUserEmail(response.data.email);
                })
                .catch(error => {
                    console.error('Error fetching user profile:', error);
                    if (error.response?.status === 401 || error.response?.status === 403) {
                        handleLogout();
                    }
                });
        } else {
            setUserEmail('');
        }
    }, [isAuthenticated, navigate]);

    // Get first letter of email for avatar
    const avatarLetter = userEmail ? userEmail[0].toUpperCase() : 'U';

    const handleLogout = useCallback(() => {
        logout();
        setIsAuthenticated(false);
        navigate('/login');
        if (isMobile) setDrawerOpen(false);
    }, [setIsAuthenticated, navigate, isMobile]);

    const handleProfileClick = useCallback(() => {
        navigate('/profile');
        if (isMobile) setDrawerOpen(false);
    }, [navigate, isMobile]);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleServicesMenuEnter = (event) => {
        setServicesAnchorEl(event.currentTarget);
        setServicesMenuOpen(true);
    };

    const handleServicesMenuLeave = () => {
        // Blur any focused element before closing to prevent aria-hidden warnings
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }
        setServicesMenuOpen(false);
        setServicesAnchorEl(null);
    };

    const handleServicesMenuClose = () => {
        // Blur any focused element before closing to prevent aria-hidden warnings
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }
        setServicesMenuOpen(false);
        setServicesAnchorEl(null);
    };

    // Updated menu items for open source project
    const menuItems = isAuthenticated
        ? [
            {
                text: userRole === 'admin' ? 'Admin Dashboard' : 'Research Dashboard',
                link: userRole === 'admin' ? '/admin' : '/dashboard'
            },
            { text: 'GitHub', link: 'https://github.com/levbszabo/brdge-v1', external: true }
        ]
        : [
            { text: 'Demo', link: `/viewBridge/${DEMO_BRIDGE_ID || '447'}` },
            { text: 'GitHub', link: 'https://github.com/levbszabo/brdge-v1', external: true },
            { text: 'Principal Investigator', link: 'https://journeymanai.io', external: true }
        ];

    // Remove services dropdown for open source version
    const servicesMenuItems = [];

    // Academic menu button styles
    const menuItemStyle = {
        color: '#4a5568',
        fontWeight: 400,
        fontFamily: '"Georgia", "Times New Roman", serif',
        textTransform: 'none',
        fontSize: '0.9375rem',
        padding: '6px 16px',
        borderRadius: theme.shape.borderRadius,
        transition: 'all 0.2s ease',
        '&:hover': {
            color: '#2d3748',
            backgroundColor: 'rgba(45, 55, 72, 0.05)'
        }
    };

    // Academic Sign Up button style
    const signUpButtonStyle = {
        backgroundColor: '#2d3748',
        color: 'white',
        padding: '8px 24px',
        fontSize: '0.875rem',
        fontWeight: 400,
        marginLeft: '8px',
        borderRadius: theme.shape.borderRadius,
        textTransform: 'none',
        boxShadow: 'none',
        fontFamily: '"Georgia", "Times New Roman", serif',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: '#4a5568',
            boxShadow: '0 4px 12px rgba(45, 55, 72, 0.25)',
            transform: 'translateY(-1px)',
        },
        '&:active': {
            transform: 'translateY(0)',
            boxShadow: 'none',
        }
    };

    const renderMenuItems = () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {menuItems.map((item) => (
                item.variant === 'button' ? (
                    <Button
                        key={item.text}
                        component={RouterLink}
                        to={item.link}
                        size="small"
                        sx={signUpButtonStyle}
                    >
                        {item.text}
                    </Button>
                ) : (
                    <Button
                        key={item.text}
                        component={item.link ? RouterLink : 'button'}
                        to={item.link}
                        onClick={item.onClick}
                        sx={menuItemStyle}
                    >
                        {item.text}
                    </Button>
                )
            ))}
        </Box>
    );

    const drawerPaperStyle = {
        boxSizing: 'border-box',
        width: 240,
        backgroundColor: theme.palette.background.default,
        borderRight: `1px solid ${theme.palette.divider}`,
    };

    const drawerItemStyle = {
        color: theme.palette.text.secondary,
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
            color: theme.palette.text.primary,
        }
    };

    const drawerSignUpStyle = {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderRadius: theme.shape.borderRadius,
        margin: '8px 16px',
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
        },
        '& .MuiListItemText-primary': {
            fontWeight: 500,
            color: theme.palette.common.white,
        }
    };

    const renderMobileMenu = () => (
        <Box
            sx={{
                width: 'auto',
                pt: { xs: 6, sm: 7 },
                pb: 3,
                px: { xs: 1, sm: 2 },
            }}
            role="presentation"
        >
            <List>
                {/* Dashboard (only for authenticated users) */}
                {isAuthenticated && (
                    <ListItem disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to={userRole === 'admin' ? '/admin' : '/dashboard'}
                            onClick={() => setDrawerOpen(false)}
                            sx={{
                                ...drawerItemStyle,
                                backgroundColor: 'rgba(45, 55, 72, 0.08)',
                            }}
                        >
                            <ListItemText primary={userRole === 'admin' ? 'Admin Dashboard' : 'Research Dashboard'} />
                        </ListItemButton>
                    </ListItem>
                )}

                {/* Bridge Builder (only for authenticated non-admin users) */}
                {isAuthenticated && userRole !== 'admin' && (
                    <ListItem disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to="/bridges"
                            onClick={() => setDrawerOpen(false)}
                            sx={drawerItemStyle}
                        >
                            <ListItemText primary="Bridge Builder" />
                        </ListItemButton>
                    </ListItem>
                )}

                {/* Marketplace (for all users) */}
                <ListItem disablePadding>
                    <ListItemButton
                        component={RouterLink}
                        to="/demos"
                        onClick={() => setDrawerOpen(false)}
                        sx={{
                            ...drawerItemStyle,
                        }}
                    >
                        <ListItemText primary="Demos" />
                    </ListItemButton>
                </ListItem>

                {/* Blog (for all users) */}
                <ListItem disablePadding>
                    <ListItemButton
                        component={RouterLink}
                        to="/blog"
                        onClick={() => setDrawerOpen(false)}
                        sx={{
                            ...drawerItemStyle,
                        }}
                    >
                        <ListItemText primary="Blog" />
                    </ListItemButton>
                </ListItem>

                {/* Careers (for all users) */}
                <ListItem disablePadding>
                    <ListItemButton
                        component={RouterLink}
                        to="/careers"
                        onClick={() => setDrawerOpen(false)}
                        sx={{
                            ...drawerItemStyle,
                        }}
                    >
                        <ListItemText primary="Careers" />
                    </ListItemButton>
                </ListItem>

                {/* Contact (for all users) */}
                <ListItem disablePadding>
                    <ListItemButton
                        component={RouterLink}
                        to="/contact"
                        onClick={() => setDrawerOpen(false)}
                        sx={{
                            ...drawerItemStyle,
                        }}
                    >
                        <ListItemText primary="Contact" />
                    </ListItemButton>
                </ListItem>

                {/* Handling Login/Logout */}
                {isAuthenticated ? (
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                handleLogout();
                                setDrawerOpen(false);
                            }}
                            sx={{
                                ...drawerItemStyle,
                            }}
                        >
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                ) : (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton
                                component={RouterLink}
                                to="/login"
                                onClick={() => setDrawerOpen(false)}
                                sx={{
                                    ...drawerItemStyle,
                                }}
                            >
                                <ListItemText primary="Login" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding sx={{ mt: 1, px: 2 }}>
                            <ListItemButton
                                component={RouterLink}
                                to="/signup"
                                onClick={() => setDrawerOpen(false)}
                                sx={{
                                    ...drawerSignUpStyle,
                                    py: 1,
                                }}
                            >
                                <ListItemText primary="Sign Up" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>

            {/* Profile Link (only for authenticated users) */}
            {isAuthenticated && (
                <>
                    <Divider sx={{ my: 1.5, borderColor: theme.palette.divider + '60' }} />
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                handleProfileClick();
                                setDrawerOpen(false);
                            }}
                            sx={{
                                ...drawerItemStyle,
                                py: 1.5,
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 32,
                                    height: 32,
                                    mr: 2,
                                    bgcolor: theme.palette.primary.light,
                                    color: theme.palette.primary.main,
                                    border: `2px solid ${theme.palette.primary.main}`,
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem',
                                }}
                            >
                                {avatarLetter}
                            </Avatar>
                            <ListItemText
                                primary="Profile"
                                primaryTypographyProps={{
                                    fontWeight: 500,
                                    fontSize: '1rem',
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                </>
            )}
        </Box>
    );

    // Check if we're on a transparent header page like landing or demo
    const isTransparentHeaderPage = () => {
        return location.pathname === '/' || location.pathname === '/demos';
    };

    // Calculate header appearance based on scroll and page
    const transparentMode = isTransparentHeaderPage() && scrollPosition < 60;

    // Animation variants
    const logoVariants = {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    };

    const menuItemVariants = {
        initial: { opacity: 0, y: -10 },
        animate: (custom) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                delay: 0.1 + (custom * 0.05)
            }
        }),
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };

    return (
        <HideOnScroll>
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: transparentMode ? 'transparent' : '#fefefe',
                    boxShadow: transparentMode ? 'none' : '0 1px 2px rgba(45, 55, 72, 0.08)',
                    color: transparentMode ? '#2d3748' : '#2d3748',
                    transition: 'all 0.3s ease',
                    backdropFilter: !transparentMode ? 'blur(10px)' : 'none',
                    borderBottom: !transparentMode ? '1px solid #e2e8f0' : 'none',
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{
                        height: { xs: 56, sm: 64 },
                        transition: 'height 0.3s ease'
                    }}>
                        {/* Logo/brand for larger screens */}
                        <motion.div
                            initial="initial"
                            animate="animate"
                            variants={logoVariants}
                        >
                            <Box
                                component={RouterLink}
                                to="/"
                                sx={{
                                    mr: 4,
                                    display: { xs: 'none', md: 'flex' },
                                    alignItems: 'center',
                                    textDecoration: 'none',
                                }}
                            >

                                <Typography
                                    variant="h6"
                                    noWrap
                                    sx={{
                                        fontWeight: 700,
                                        letterSpacing: '-0.02em',
                                        color: 'inherit',
                                        fontSize: '1.25rem',
                                        '&:hover': {
                                            opacity: 0.85,
                                        },
                                        fontFamily: '"Georgia", "Times New Roman", serif',
                                    }}
                                >
                                    DotBridge
                                </Typography>
                            </Box>
                        </motion.div>

                        {/* Mobile menu */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="menu"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                                sx={{
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.05)'
                                    }
                                }}
                            >
                                {anchorElNav ? <CloseIcon /> : <MenuIcon />}
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                disableAutoFocus={true}
                                disableEnforceFocus={true}
                                disableRestoreFocus={true}
                                PaperProps={{
                                    sx: {
                                        mt: 1.5,
                                        width: '100%',
                                        maxWidth: '300px',
                                        borderRadius: theme.shape.borderRadius,
                                        boxShadow: theme.shadows[3],
                                        border: `1px solid ${theme.palette.divider}`,
                                        '& .MuiMenu-list': {
                                            padding: '8px 0',
                                        },
                                    },
                                }}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                <AnimatePresence>
                                    {menuItems.map((item, index) => (
                                        <motion.div
                                            key={item.text}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            variants={menuItemVariants}
                                            custom={index}
                                        >
                                            <MenuItem
                                                onClick={handleCloseNavMenu}
                                                component={RouterLink}
                                                to={item.link}
                                                sx={{
                                                    my: 0.5,
                                                    mx: 1,
                                                    borderRadius: '6px',
                                                    color: location.pathname === item.link ? 'primary.main' : 'text.primary',
                                                    fontWeight: location.pathname === item.link ? 600 : 400,
                                                    transition: 'background-color 0.2s, color 0.2s, font-weight 0.2s',
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.action.hover,
                                                    },
                                                }}
                                            >
                                                <Typography textAlign="center">{item.text}</Typography>
                                            </MenuItem>
                                        </motion.div>
                                    ))}


                                    {isAuthenticated ? (
                                        <motion.div
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            variants={menuItemVariants}
                                            custom={menuItems.length + 1}
                                        >
                                            <MenuItem
                                                onClick={() => {
                                                    handleCloseNavMenu();
                                                    handleLogout();
                                                }}
                                                sx={{
                                                    my: 0.5,
                                                    mx: 1,
                                                    borderRadius: '6px',
                                                    color: 'text.primary',
                                                    transition: 'background-color 0.2s',
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.action.hover,
                                                    },
                                                }}
                                            >
                                                <Typography textAlign="center">Logout</Typography>
                                            </MenuItem>
                                        </motion.div>
                                    ) : (
                                        <>
                                            <Divider sx={{ my: 1 }} />
                                            <Box sx={{ px: 2, py: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                <motion.div
                                                    initial="initial"
                                                    animate="animate"
                                                    exit="exit"
                                                    variants={menuItemVariants}
                                                    custom={menuItems.length + 1}
                                                >
                                                    <Button
                                                        component={RouterLink}
                                                        to="/login"
                                                        variant="outlined"
                                                        color="primary"
                                                        fullWidth
                                                        sx={{ mb: 1 }}
                                                    >
                                                        Login
                                                    </Button>
                                                </motion.div>
                                                <motion.div
                                                    initial="initial"
                                                    animate="animate"
                                                    exit="exit"
                                                    variants={menuItemVariants}
                                                    custom={menuItems.length + 2}
                                                >
                                                    <Button
                                                        component={RouterLink}
                                                        to="/signup"
                                                        variant="contained"
                                                        color="primary"
                                                        fullWidth
                                                    >
                                                        Sign Up
                                                    </Button>
                                                </motion.div>
                                            </Box>
                                        </>
                                    )}
                                </AnimatePresence>
                            </Menu>
                        </Box>

                        {/* Logo/brand for mobile screens */}
                        <Typography
                            variant="h6"
                            noWrap
                            component={RouterLink}
                            to="/"
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontWeight: 700,
                                letterSpacing: '.01rem',
                                color: 'inherit',
                                textDecoration: 'none',
                                fontSize: '1.25rem',
                                fontFamily: '"Georgia", "Times New Roman", serif',
                            }}
                        >
                            DotBridge
                            <Box component="span" sx={{
                                fontSize: '0.7rem',
                                ml: 1,
                                opacity: 0.7,
                                fontWeight: 400
                            }}>
                                [Open Source]
                            </Box>
                        </Typography>

                        {/* Desktop navigation */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                            <AnimatePresence>
                                {menuItems.map((item, index) => (
                                    <motion.div
                                        key={item.text}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        variants={menuItemVariants}
                                        custom={index}
                                    >
                                        <Button
                                            component={RouterLink}
                                            to={item.link}
                                            onClick={handleCloseNavMenu}
                                            sx={{
                                                my: 2,
                                                mx: 1,
                                                color: location.pathname === item.link ? 'primary.main' : 'inherit',
                                                display: 'block',
                                                fontWeight: location.pathname === item.link ? 600 : 400,
                                                fontSize: '0.95rem',
                                                textTransform: 'none',
                                                position: 'relative',
                                                fontFamily: '"Georgia", "Times New Roman", serif',
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    width: location.pathname === item.link ? '100%' : '0%',
                                                    height: '2px',
                                                    bottom: 0,
                                                    left: 0,
                                                    backgroundColor: '#2d3748',
                                                    transition: 'width 0.3s ease-in-out',
                                                    borderRadius: '2px',
                                                    opacity: location.pathname === item.link ? 1 : 0,
                                                },
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                    '&::after': {
                                                        width: '100%',
                                                        opacity: 0.7,
                                                    },
                                                },
                                            }}
                                        >
                                            {item.text}
                                        </Button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </Box>

                        {/* Login/Signup or Logout for desktop */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 2, gap: 1, alignItems: 'center' }}>
                            {isAuthenticated ? (
                                <>
                                    <motion.div
                                        initial="initial"
                                        animate="animate"
                                        variants={menuItemVariants}
                                        custom={menuItems.length + 1}
                                    >
                                        <Button
                                            onClick={handleLogout}
                                            variant="outlined"
                                            sx={{
                                                color: 'inherit',
                                                borderColor: transparentMode ? 'rgba(16, 16, 23, 0.2)' : theme.palette.divider,
                                                fontFamily: '"Georgia", "Times New Roman", serif',
                                                fontWeight: 400,
                                                '&:hover': {
                                                    borderColor: transparentMode ? 'rgba(16, 16, 23, 0.5)' : theme.palette.text.primary,
                                                    backgroundColor: 'transparent',
                                                },
                                            }}
                                        >
                                            Logout
                                        </Button>
                                    </motion.div>
                                    <motion.div
                                        initial="initial"
                                        animate="animate"
                                        variants={menuItemVariants}
                                        custom={menuItems.length + 2}
                                    >
                                        <IconButton
                                            onClick={handleProfileClick}
                                            sx={{
                                                p: 0.5,
                                                ml: 0.5,
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                    transform: 'scale(1.08)',
                                                },
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    bgcolor: transparentMode ? 'rgba(255, 255, 255, 0.9)' : '#f7fafc',
                                                    color: '#2d3748',
                                                    fontWeight: 'bold',
                                                    fontSize: '1rem',
                                                    border: '2px solid #2d3748',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                    transition: 'all 0.2s ease',
                                                    fontFamily: '"Georgia", "Times New Roman", serif',
                                                    '&:hover': {
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                                                    }
                                                }}
                                            >
                                                {avatarLetter}
                                            </Avatar>
                                        </IconButton>
                                    </motion.div>
                                </>
                            ) : (
                                <>
                                    <motion.div
                                        initial="initial"
                                        animate="animate"
                                        variants={menuItemVariants}
                                        custom={menuItems.length + 1}
                                    >
                                        <Button
                                            component={RouterLink}
                                            to="/login"
                                            variant="text"
                                            sx={{
                                                color: 'inherit',
                                                fontWeight: 500,
                                                fontFamily: '"Georgia", "Times New Roman", serif',
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                    opacity: 0.8,
                                                },
                                            }}
                                        >
                                            Login
                                        </Button>
                                    </motion.div>
                                    <motion.div
                                        initial="initial"
                                        animate="animate"
                                        variants={menuItemVariants}
                                        custom={menuItems.length + 2}
                                    >
                                        <Button
                                            component={RouterLink}
                                            to="/signup"
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                fontWeight: 500,
                                                fontFamily: '"Georgia", "Times New Roman", serif',
                                                backgroundColor: '#2d3748',
                                                color: 'white',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    backgroundColor: '#4a5568',
                                                    boxShadow: '0 4px 12px rgba(45, 55, 72, 0.25)',
                                                },
                                            }}
                                        >
                                            Sign Up
                                        </Button>
                                    </motion.div>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </HideOnScroll>
    );
}

export default Header;
