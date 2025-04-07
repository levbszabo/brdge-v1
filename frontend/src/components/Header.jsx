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
    Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { logout } from '../utils/auth';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { api } from '../api';
import PersonIcon from '@mui/icons-material/Person';

function Header() {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const location = useLocation();

    // Determine if we're on the landing page
    const isLandingPage = location.pathname === '/';

    // Track scroll position for transparent to solid transition
    const scrollTrigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 20,
    });

    // Header background should be more visible when scrolled
    const headerBackground = isLandingPage
        ? scrollTrigger
            ? theme.palette.background.paper + 'e6'
            : theme.palette.background.paper + 'cc'
        : theme.palette.background.paper + 'cc';

    // Text colors based on landing page
    const textColor = isLandingPage ? theme.palette.text.primary : theme.palette.text.primary;

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

    // Different menu items based on authentication status
    const menuItems = isAuthenticated
        ? [
            { text: 'Home', link: '/home' },
            { text: 'Services', link: '/services' },
            { text: 'Contact', link: '/contact' },
            { text: 'Logout', onClick: handleLogout }
        ]
        : [
            { text: 'Demos', link: '/demos' },
            { text: 'Services', link: '/services' },
            { text: 'Pricing', link: '/pricing' },
            { text: 'Contact', link: '/contact' },
            { text: 'Login', link: '/login' },
            { text: 'Sign Up', link: '/signup', variant: 'button' }
        ];

    // Common styles for menu buttons/links
    const menuItemStyle = {
        color: theme.palette.text.secondary,
        fontWeight: 400,
        fontFamily: theme.typography.fontFamily,
        textTransform: 'none',
        fontSize: '0.95rem',
        padding: '6px 12px',
        borderRadius: theme.shape.borderRadius,
        '&:hover': {
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.action.hover
        }
    };

    // Styles specific for the Sign Up button
    const signUpButtonStyle = {
        ...theme.components.MuiButton.styleOverrides.contained,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: '6px 18px',
        fontSize: '0.95rem',
        marginLeft: '10px',
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
            boxShadow: theme.shadows[2],
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
        <Box sx={{ width: 'auto' }} role="presentation">
            <List>
                {menuItems.map((item) => (
                    item.variant === 'button' ? (
                        <ListItem key={item.text} disablePadding sx={{ padding: '0 8px' }}>
                            <ListItemButton
                                component={RouterLink}
                                to={item.link}
                                onClick={() => setDrawerOpen(false)}
                                sx={drawerSignUpStyle}
                            >
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ) : (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                component={item.link ? RouterLink : 'button'}
                                to={item.link}
                                onClick={() => {
                                    setDrawerOpen(false);
                                    if (item.onClick) item.onClick();
                                }}
                                sx={drawerItemStyle}
                            >
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    )
                ))}
            </List>
            {isAuthenticated && <Divider sx={{ my: 1, borderColor: theme.palette.divider + '60' }} />}
            {isAuthenticated && (
                <ListItem disablePadding>
                    <ListItemButton onClick={handleProfileClick} sx={drawerItemStyle}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1.5, bgcolor: theme.palette.primary.light, color: theme.palette.primary.main }}>
                            <PersonIcon sx={{ fontSize: 16 }} />
                        </Avatar>
                        <ListItemText primary="Profile" />
                    </ListItemButton>
                </ListItem>
            )}
        </Box>
    );

    return (
        <>
            <AppBar
                position="fixed"
                elevation={scrollTrigger ? 3 : 1}
                sx={{
                    background: headerBackground,
                    backdropFilter: 'blur(10px)',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    zIndex: theme.zIndex.drawer + 1,
                    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color'], {
                        duration: theme.transitions.duration.short,
                    }),
                }}
            >
                <Toolbar sx={{
                    minHeight: { xs: '44px', sm: '50px', md: '56px' },
                    height: { xs: '44px', sm: '50px', md: '56px' },
                    px: { xs: 1, sm: 2, md: 3 },
                    py: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    color: textColor,
                                    fontFamily: theme.typography.h1.fontFamily,
                                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                                    fontWeight: 600,
                                    letterSpacing: '0.01em',
                                    lineHeight: 1,
                                    transition: 'color 0.2s ease-in-out',
                                    '&:hover': {
                                        color: theme.palette.secondary.main,
                                    },
                                }}
                            >
                                Brdge AI
                            </Typography>
                        </RouterLink>
                    </Box>

                    {!isMobile && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {renderMenuItems()}
                            {isAuthenticated && (
                                <IconButton
                                    onClick={handleProfileClick}
                                    size="small"
                                    sx={{
                                        ml: 1,
                                        bgcolor: theme.palette.action.hover,
                                        '&:hover': { bgcolor: theme.palette.action.selected }
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            bgcolor: theme.palette.primary.main,
                                            color: theme.palette.background.default
                                        }}
                                    >
                                        <PersonIcon sx={{ fontSize: 20 }} />
                                    </Avatar>
                                </IconButton>
                            )}
                        </Box>
                    )}

                    {isMobile && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                                edge="end"
                                aria-label="menu"
                                onClick={() => setDrawerOpen(true)}
                                sx={{ color: textColor }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{ sx: drawerPaperStyle }}
                ModalProps={{ keepMounted: true }}
            >
                {renderMobileMenu()}
            </Drawer>
        </>
    );
}

export default Header;
