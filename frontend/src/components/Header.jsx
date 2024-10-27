import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { logout } from '../utils/auth';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function Header() {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsAuthenticated(false);
        navigate('/login');
        if (isMobile) setDrawerOpen(false);
    };

    const menuItems = [
        { text: 'About', link: '/about' },
        { text: 'Demos', link: '/demos' },
        { text: 'Pricing', link: '/pricing' },
        { text: 'Policy', link: '/policy' },
        ...(isAuthenticated
            ? [
                { text: 'Brdges', link: '/brdges' },
                { text: 'Logout', onClick: handleLogout }
            ]
            : [
                { text: 'Login', link: '/login' },
                { text: 'Sign Up', link: '/signup' }
            ]
        )
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
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <RouterLink to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                        Brdge AI
                    </RouterLink>
                </Typography>
                {isMobile ? (
                    <>
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
                    <Box>
                        {renderMenuItems()}
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Header;
