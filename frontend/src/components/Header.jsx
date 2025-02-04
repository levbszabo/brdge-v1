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
            { text: 'Brdges', link: '/brdges' },
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
                pt: { xs: 0, sm: 1 },
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000
            }}
        >
            <Toolbar sx={{
                minHeight: { xs: '32px', sm: '48px' },
                px: { xs: 1, sm: 2 },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: { xs: 0.5, sm: 0 }
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flex: { xs: '1', sm: '0 1 auto' },
                    height: { xs: '32px', sm: 'auto' }
                }}>
                    <RouterLink to="/" style={{
                        color: 'inherit',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%'
                    }}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                color: 'white',
                                display: 'block',
                                fontSize: { xs: '0.95rem', sm: '1.25rem' },
                                fontWeight: 500,
                                letterSpacing: '0.02em',
                                lineHeight: 1,
                                transform: { xs: 'none', sm: 'translateY(-1px)' },
                                textShadow: '0 0 10px rgba(0,255,204,0.3)',
                                '&:hover': {
                                    textShadow: '0 0 15px rgba(0,255,204,0.4)',
                                }
                            }}
                        >
                            Brdge AI
                        </Typography>
                    </RouterLink>
                </Box>

                {isMobile ? (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 1, sm: 1.5 }
                    }}>
                        {isAuthenticated && (
                            <IconButton
                                onClick={handleProfileClick}
                                sx={{
                                    width: { xs: 28, sm: 36 },
                                    height: { xs: 28, sm: 36 },
                                    '& .MuiAvatar-root': {
                                        width: { xs: 24, sm: 28 },
                                        height: { xs: 24, sm: 28 }
                                    }
                                }}
                            >
                                <Avatar
                                    sx={{
                                        bgcolor: theme.palette.primary.main,
                                    }}
                                >
                                    <PersonIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
                                </Avatar>
                            </IconButton>
                        )}
                        <IconButton
                            aria-label="menu"
                            onClick={() => setDrawerOpen(true)}
                            sx={{
                                width: 32,
                                height: 32,
                                color: 'white'
                            }}
                        >
                            <MenuIcon sx={{ fontSize: 20 }} />
                        </IconButton>

                        <Drawer
                            anchor="right"
                            open={drawerOpen}
                            onClose={() => setDrawerOpen(false)}
                            PaperProps={{
                                sx: {
                                    width: '80%',
                                    maxWidth: '300px',
                                    background: '#001B3D',
                                    color: 'white'
                                }
                            }}
                        >
                            <Box sx={{
                                pt: 2,
                                pb: 1,
                                px: 2,
                                borderBottom: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <Typography variant="h6" sx={{ color: 'white' }}>
                                    Menu
                                </Typography>
                            </Box>
                            <List sx={{ pt: 1 }}>
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
                                        sx={{
                                            py: 2,
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,0.1)'
                                            }
                                        }}
                                    >
                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{
                                                sx: { fontSize: '1.1rem' }
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Drawer>
                    </Box>
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
                                        width: 28,
                                        height: 28,
                                        bgcolor: theme.palette.primary.main,
                                    }}
                                >
                                    <PersonIcon sx={{ fontSize: 18 }} />
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
