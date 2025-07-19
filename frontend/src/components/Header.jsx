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
    Container,
    useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { logout } from '../utils/auth';
import { useTheme } from '@mui/material/styles';
import { api } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

// Demo bridge ID for navigation
const DEMO_BRIDGE_ID = '447';



function Header() {
    const { isAuthenticated, setIsAuthenticated, userRole } = useContext(AuthContext);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const location = useLocation();

    // Determine if we're on the landing page
    const isLandingPage = location.pathname === '/';

    // State for scroll position to handle transparency
    const [scrollPosition, setScrollPosition] = useState(0);

    // Use scroll position for transparent to solid transition
    const scrollTrigger = scrollPosition > 20;

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





    // Updated menu items for academic research project
    const menuItems = isAuthenticated
        ? [
            {
                text: userRole === 'admin' ? 'Admin Dashboard' : 'Research Dashboard',
                link: userRole === 'admin' ? '/admin' : '/dashboard'
            },
            { text: 'Repository', link: 'https://github.com/levbszabo/brdge-v1', external: true }
        ]
        : [
            { text: 'Demo', link: `/viewBridge/${DEMO_BRIDGE_ID || '447'}` },
            { text: 'Repository', link: 'https://github.com/levbszabo/brdge-v1', external: true },
            { text: 'Contact Researcher', link: 'https://journeymanai.io', external: true }
        ];

    // Remove services dropdown for research version
    const servicesMenuItems = [];

    // Academic menu button styles - cleaner and more minimal
    const menuItemStyle = {
        color: '#1a1a2e',
        fontWeight: 400,
        fontFamily: '"Inter", sans-serif',
        textTransform: 'none',
        fontSize: '0.9375rem',
        padding: '8px 16px',
        borderRadius: '2px',
        transition: 'all 0.2s ease',
        '&:hover': {
            color: '#0f172a',
            backgroundColor: 'rgba(26, 26, 46, 0.04)'
        }
    };

    // Academic button style - minimal and clean
    const academicButtonStyle = {
        backgroundColor: '#1a1a2e',
        color: 'white',
        padding: '8px 20px',
        fontSize: '0.875rem',
        fontWeight: 500,
        marginLeft: '12px',
        borderRadius: '2px',
        textTransform: 'none',
        boxShadow: 'none',
        fontFamily: '"Inter", sans-serif',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: '#0f172a',
            boxShadow: '0 2px 4px rgba(26, 26, 46, 0.15)',
        },
        '&:active': {
            transform: 'scale(0.98)',
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
                        sx={academicButtonStyle}
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

    // Enhanced mobile menu with better styling
    const renderMobileMenu = () => (
        <Box
            sx={{
                width: 'auto',
                pt: { xs: 7, sm: 8 },
                pb: 3,
                px: { xs: 2, sm: 3 },
                minHeight: '100vh',
                backgroundColor: 'rgba(253, 253, 253, 0.98)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
            }}
            role="presentation"
        >
            <List sx={{ pt: 2 }}>
                {/* Dashboard (only for authenticated users) */}
                {isAuthenticated && (
                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            component={RouterLink}
                            to={userRole === 'admin' ? '/admin' : '/dashboard'}
                            onClick={() => setDrawerOpen(false)}
                            sx={{
                                borderRadius: '8px',
                                py: 1.5,
                                px: 2,
                                backgroundColor: 'rgba(26, 26, 46, 0.06)',
                                '&:hover': {
                                    backgroundColor: 'rgba(26, 26, 46, 0.1)',
                                },
                            }}
                        >
                            <ListItemText
                                primary={userRole === 'admin' ? 'Admin Dashboard' : 'Research Dashboard'}
                                primaryTypographyProps={{
                                    fontFamily: '"Inter", sans-serif',
                                    fontWeight: 500,
                                    color: '#1a1a2e',
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                )}

                {/* Main menu items */}
                {menuItems.map((item, index) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            component={item.link?.startsWith('http') ? 'a' : RouterLink}
                            to={!item.link?.startsWith('http') ? item.link : undefined}
                            href={item.link?.startsWith('http') ? item.link : undefined}
                            target={item.link?.startsWith('http') ? '_blank' : undefined}
                            onClick={() => setDrawerOpen(false)}
                            sx={{
                                borderRadius: '6px',
                                py: 1.5,
                                px: 2,
                                '&:hover': {
                                    backgroundColor: 'rgba(26, 26, 46, 0.04)',
                                },
                            }}
                        >
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontFamily: '"Inter", sans-serif',
                                    fontWeight: 400,
                                    color: '#4b5563',
                                    fontSize: '0.9375rem',
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}

                {/* Contact (for all users) */}
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                        component="a"
                        href="https://journeymanai.io"
                        target="_blank"
                        onClick={() => setDrawerOpen(false)}
                        sx={{
                            borderRadius: '6px',
                            py: 1.5,
                            px: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(26, 26, 46, 0.04)',
                            },
                        }}
                    >
                        <ListItemText
                            primary="Contact"
                            primaryTypographyProps={{
                                fontFamily: '"Inter", sans-serif',
                                fontWeight: 400,
                                color: '#4b5563',
                                fontSize: '0.9375rem',
                            }}
                        />
                    </ListItemButton>
                </ListItem>

                {/* Auth section */}
                <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(229, 231, 235, 0.5)' }}>
                    {isAuthenticated ? (
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    handleLogout();
                                    setDrawerOpen(false);
                                }}
                                sx={{
                                    borderRadius: '6px',
                                    py: 1.5,
                                    px: 2,
                                    '&:hover': {
                                        backgroundColor: 'rgba(239, 68, 68, 0.04)',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary="Logout"
                                    primaryTypographyProps={{
                                        fontFamily: '"Inter", sans-serif',
                                        fontWeight: 400,
                                        color: '#ef4444',
                                        fontSize: '0.9375rem',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Button
                                component={RouterLink}
                                to="/login"
                                variant="outlined"
                                fullWidth
                                onClick={() => setDrawerOpen(false)}
                                sx={{
                                    py: 1.5,
                                    fontFamily: '"Inter", sans-serif',
                                    fontWeight: 400,
                                    borderRadius: '6px',
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/signup"
                                variant="contained"
                                fullWidth
                                onClick={() => setDrawerOpen(false)}
                                sx={{
                                    py: 1.5,
                                    fontFamily: '"Inter", sans-serif',
                                    fontWeight: 500,
                                    borderRadius: '6px',
                                }}
                            >
                                Sign Up
                            </Button>
                        </Box>
                    )}
                </Box>
            </List>

            {/* Profile section for authenticated users */}
            {isAuthenticated && (
                <Box sx={{
                    mt: 3,
                    pt: 3,
                    borderTop: '1px solid rgba(229, 231, 235, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    px: 2
                }}>
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            bgcolor: '#f8fafc',
                            color: '#1a1a2e',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            border: '1px solid #e5e7eb',
                            fontFamily: '"Inter", sans-serif',
                        }}
                        onClick={() => {
                            handleProfileClick();
                            setDrawerOpen(false);
                        }}
                    >
                        {avatarLetter}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 500,
                                color: '#1a1a2e',
                                fontFamily: '"Inter", sans-serif',
                                fontSize: '0.875rem'
                            }}
                        >
                            Profile
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#6b7280',
                                fontFamily: '"Inter", sans-serif',
                                fontSize: '0.75rem'
                            }}
                        >
                            {userEmail}
                        </Typography>
                    </Box>
                </Box>
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
        <>
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: transparentMode ? 'transparent' : 'background.glass',
                    boxShadow: transparentMode ? 'none' : '0 1px 2px rgba(26, 26, 46, 0.06)',
                    color: '#1a1a2e',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    backdropFilter: !transparentMode ? 'blur(16px)' : 'none',
                    WebkitBackdropFilter: !transparentMode ? 'blur(16px)' : 'none',
                    borderBottom: !transparentMode ? '1px solid rgba(229, 231, 235, 0.3)' : 'none',
                    // Enhanced mobile styling
                    '@media (max-width: 768px)': {
                        backgroundColor: transparentMode ? 'rgba(253, 253, 253, 0.8)' : 'rgba(253, 253, 253, 0.95)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderBottom: '1px solid rgba(229, 231, 235, 0.2)',
                    },
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{
                        height: { xs: 56, sm: 64 },
                        transition: 'height 0.3s ease',
                        px: { xs: 1, sm: 0 }
                    }}>
                        {/* Logo for larger screens */}
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
                                        fontWeight: 400,
                                        letterSpacing: '-0.01em',
                                        color: 'inherit',
                                        fontSize: '1.375rem',
                                        textDecoration: 'none',
                                        fontFamily: '"Merriweather", serif',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            opacity: 0.85,
                                            transform: 'translateY(-1px)',
                                        },
                                    }}
                                >
                                    DotBridge
                                </Typography>
                            </Box>
                        </motion.div>

                        {/* Mobile menu button */}
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, width: '48px' }}>
                            <IconButton
                                size="large"
                                aria-label="menu"
                                onClick={() => setDrawerOpen(true)}
                                color="inherit"
                                sx={{
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        backgroundColor: 'rgba(26, 26, 46, 0.04)',
                                    }
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>

                        {/* Logo for mobile screens - centered */}
                        <Box sx={{
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Typography
                                variant="h6"
                                noWrap
                                component={RouterLink}
                                to="/"
                                sx={{
                                    fontWeight: 400,
                                    letterSpacing: '-0.01em',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                    fontSize: { xs: '1.125rem', sm: '1.25rem' },
                                    fontFamily: '"Merriweather", serif',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        opacity: 0.85,
                                    },
                                }}
                            >
                                DOTBRIDGE
                            </Typography>
                        </Box>

                        {/* Spacer for mobile to balance the menu button */}
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, width: '48px' }} />

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
                                            component={item.link?.startsWith('http') ? 'a' : RouterLink}
                                            to={!item.link?.startsWith('http') ? item.link : undefined}
                                            href={item.link?.startsWith('http') ? item.link : undefined}
                                            target={item.link?.startsWith('http') ? '_blank' : undefined}
                                            sx={{
                                                my: 2,
                                                mx: 1,
                                                color: location.pathname === item.link ? 'primary.main' : 'inherit',
                                                display: 'block',
                                                fontWeight: location.pathname === item.link ? 600 : 400,
                                                fontSize: '0.9375rem',
                                                textTransform: 'none',
                                                position: 'relative',
                                                fontFamily: '"Inter", sans-serif',
                                                borderRadius: '6px',
                                                px: 2,
                                                py: 1,
                                                transition: 'all 0.2s ease',
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    width: location.pathname === item.link ? '100%' : '0%',
                                                    height: '2px',
                                                    bottom: 0,
                                                    left: 0,
                                                    backgroundColor: '#1a1a2e',
                                                    transition: 'width 0.3s ease-in-out',
                                                    borderRadius: '2px',
                                                    opacity: location.pathname === item.link ? 1 : 0,
                                                },
                                                '&:hover': {
                                                    backgroundColor: 'rgba(26, 26, 46, 0.04)',
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

                        {/* Desktop Auth Section */}
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
                                                fontFamily: '"Inter", sans-serif',
                                                fontWeight: 400,
                                                fontSize: '0.875rem',
                                                borderRadius: '6px',
                                                px: 3,
                                                py: 1,
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-1px)',
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
                                                ml: 1,
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                    transform: 'scale(1.05)',
                                                },
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    bgcolor: transparentMode ? 'rgba(255, 255, 255, 0.9)' : '#f8fafc',
                                                    color: '#1a1a2e',
                                                    fontWeight: 500,
                                                    fontSize: '0.875rem',
                                                    border: '1px solid #e5e7eb',
                                                    fontFamily: '"Inter", sans-serif',
                                                    boxShadow: '0 2px 8px rgba(26, 26, 46, 0.08)',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        boxShadow: '0 4px 16px rgba(26, 26, 46, 0.12)',
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
                                                fontWeight: 400,
                                                fontFamily: '"Inter", sans-serif',
                                                fontSize: '0.875rem',
                                                px: 2,
                                                py: 1,
                                                borderRadius: '6px',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(26, 26, 46, 0.04)',
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
                                            sx={{
                                                fontWeight: 500,
                                                fontFamily: '"Inter", sans-serif',
                                                fontSize: '0.875rem',
                                                px: 3,
                                                py: 1,
                                                borderRadius: '6px',
                                                ml: 1,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
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

            {/* Enhanced Mobile Drawer */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        width: { xs: '100%', sm: '320px' },
                        maxWidth: '100vw',
                        backgroundColor: 'transparent',
                        border: 'none',
                        boxShadow: 'none',
                    }
                }}
                ModalProps={{
                    keepMounted: true, // Better mobile performance
                }}
            >
                {renderMobileMenu()}
            </Drawer>
        </>
    );
}

export default Header;
