import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Button, Box, Container, useMediaQuery, Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LandingPage from './pages/LandingPage';
import BrdgeListPage from './pages/BrdgeListPage';
import CreateBrdgePage from './pages/CreateBrdgePage';
import ViewBrdgePage from './pages/ViewBrdgePage';
import DemoPage from './pages/DemoPage';
import WaitlistPage from './pages/WaitlistPage';
import AboutPage from './pages/AboutPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { api } from './api';
import { getAuthToken, setAuthToken, logout } from './utils/auth';
import { SnackbarProvider } from './utils/snackbar';
import '@fontsource/poppins';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0072ff',
    },
    secondary: {
      main: '#00c6ff',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: '1.6',
    },
  },
});

function App() {
  const [isHeaderShrunk, setIsHeaderShrunk] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsHeaderShrunk(true);
      } else {
        setIsHeaderShrunk(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setIsDrawerOpen(false);
    // Optionally, redirect to the login page or home page
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Demos', link: '/demos' },
    { text: 'About', link: '/about' },
    ...(isLoggedIn
      ? [
        { text: 'Brdges', link: '/brdges' },
        { text: 'Logout', onClick: handleLogout },
      ]
      : [
        { text: 'Login', link: '/login' },
        { text: 'Sign Up', link: '/signup' },
      ]),
  ];

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} component={item.link ? Link : 'button'} to={item.link} onClick={item.onClick}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <Router>
          <Box display="flex" flexDirection="column" minHeight="100vh">
            <AppBar position="fixed" className={`header ${isHeaderShrunk ? 'shrink' : ''}`} elevation={0}>
              <Container maxWidth="lg">
                <Toolbar disableGutters>
                  <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                      flexGrow: 1,
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover': {
                        color: theme.palette.primary.light,
                      },
                    }}
                  >
                    Brdge AI
                  </Typography>
                  <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    {menuItems.map((item) => (
                      item.link ? (
                        <Button key={item.text} color="inherit" component={Link} to={item.link} sx={{ mx: 1 }}>
                          {item.text}
                        </Button>
                      ) : (
                        <Button key={item.text} color="inherit" onClick={item.onClick} sx={{ mx: 1 }}>
                          {item.text}
                        </Button>
                      )
                    ))}
                  </Box>
                  {isMobile && (
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      edge="start"
                      onClick={toggleDrawer(true)}
                      sx={{ ml: 1 }}
                    >
                      <MenuIcon />
                    </IconButton>
                  )}
                </Toolbar>
              </Container>
            </AppBar>
            <Drawer
              anchor="right"
              open={isDrawerOpen}
              onClose={toggleDrawer(false)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <IconButton onClick={toggleDrawer(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              {drawerContent}
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, pt: { xs: '56px', sm: '64px' } }}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/demos" element={<DemoPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/viewBrdge/:id" element={<ViewBrdgePage />} />
                <Route path="/b/:publicId" element={<ViewBrdgePage />} />
                <Route
                  path="/brdges"
                  element={
                    <ProtectedRoute>
                      <BrdgeListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create"
                  element={
                    <ProtectedRoute>
                      <CreateBrdgePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit/:id"
                  element={
                    <ProtectedRoute>
                      <CreateBrdgePage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Box>
            <Box sx={{
              py: 3,
              textAlign: 'center',
              bgcolor: 'background.paper',
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
              <Typography variant="body2" color="text.secondary">
                © 2024 Journeyman AI LLC. All rights reserved.
              </Typography>
            </Box>
          </Box>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
