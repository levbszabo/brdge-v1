import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Header() {
    const theme = useTheme();

    return (
        <AppBar position="static" sx={{
            backgroundColor: theme.palette.primary.main,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    <RouterLink to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                        Brdge AI
                    </RouterLink>
                </Typography>
                <Box>
                    <Button color="inherit" component={RouterLink} to="/demos" sx={{ fontWeight: 500 }}>
                        Demos
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/about" sx={{ fontWeight: 500 }}>
                        About
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/login" sx={{ fontWeight: 500 }}>
                        Login
                    </Button>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to="/signup"
                        sx={{
                            fontWeight: 500,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.2)',
                            }
                        }}
                    >
                        Sign Up
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
