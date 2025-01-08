import React, { useContext, useState, useEffect } from 'react';
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
    ListItemText,
    Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { logout } from '../utils/auth';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { api } from '../api';
import PersonIcon from '@mui/icons-material/Person';
import logo from '../assets/new-img.png';

function Header() {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            api.get('/user/profile')
                .then(response => {
                    setUserEmail(response.data.email);
                })
                .catch(error => {
                    console.error('Error fetching user profile:', error);
                    // If token is invalid/expired, handle logout
                    if (error.response?.status === 401) {
                        handleLogout();
                    }
                });
        }
    }, [isAuthenticated]);

    // Get first letter of email for avatar
    const avatarLetter = userEmail ? userEmail[0].toUpperCase() : 'U';

    const handleLogout = () => {
        logout();
        setIsAuthenticated(false);
        navigate('/login');
        if (isMobile) setDrawerOpen(false);
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    // Different menu items based on authentication status
    const menuItems = isAuthenticated
        ? [
            { text: 'My Brdges', link: '/brdges' },
            { text: 'Logout', onClick: handleLogout }
        ]
        : [
            { text: 'Demos', link: '/demos' },
            { text: 'Pricing', link: '/pricing' },
            { text: 'Login', link: '/login' },
            { text: 'Sign Up', link: '/signup' }
        ];

    const renderMenuItems = () => (
        <>
            {menuItems.map((item) => (
                <Button
                    key={item.text}
                    color="inherit"
                    component={item.link ? RouterLink : 'button'}
                    to={item.link}
                    onClick={item.onClick}
                    sx={{
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                    }}
                >
                    {item.text}
                </Button>
            ))}
        </>
    );

    const renderMobileMenu = () => (
        <List>
            {menuItems.map((item) => (
                <ListItem
                    button
                    key={item.text}
                    component={item.link ? RouterLink : 'button'}
                    to={item.link}
                    onClick={() => {
                        setDrawerOpen(false);
                        if (item.onClick) item.onClick();
                    }}
                >
                    <ListItemText primary={item.text} />
                </ListItem>
            ))}
        </List>
    );

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                background: 'transparent',
                backdropFilter: 'none',
                pt: 2,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000
            }}
        >
            <Toolbar>
                <Box sx={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <RouterLink to="/" style={{
                        color: 'inherit',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <img
                            src={logo}
                            alt="Brdge AI Logo"
                            style={{
                                height: '32px',
                                width: 'auto'
                            }}
                        />
                        <Typography variant="h6" component="div" sx={{ color: 'white' }}>
                            Brdge AI
                        </Typography>
                    </RouterLink>
                </Box>
                {isMobile ? (
                    <>
                        {isAuthenticated && (
                            <IconButton
                                onClick={handleProfileClick}
                                sx={{ mr: 2 }}
                            >
                                <Avatar
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: theme.palette.primary.main,
                                    }}
                                >
                                    <PersonIcon sx={{ fontSize: 20 }} />
                                </Avatar>
                            </IconButton>
                        )}
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={() => setDrawerOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="right"
                            open={drawerOpen}
                            onClose={() => setDrawerOpen(false)}
                        >
                            {renderMobileMenu()}
                        </Drawer>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {renderMenuItems()}
                        {isAuthenticated && (
                            <IconButton
                                onClick={handleProfileClick}
                                sx={{ ml: 2 }}
                            >
                                <Avatar
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: theme.palette.primary.main,
                                    }}
                                >
                                    <PersonIcon sx={{ fontSize: 20 }} />
                                </Avatar>
                            </IconButton>
                        )}
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Header;
