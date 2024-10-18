import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Button, Box, Container, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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
    // Optionally, redirect to the login page or home page
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <Router>
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
                  <Button color="inherit" component={Link} to="/demos" sx={{ mx: 1 }}>Demos</Button>
                  <Button color="inherit" component={Link} to="/about" sx={{ mx: 1 }}>About</Button>
                  {isLoggedIn ? (
                    <>
                      <Button color="inherit" component={Link} to="/brdges" sx={{ mx: 1 }}>Brdges</Button>
                      <Button color="inherit" onClick={handleLogout} sx={{ mx: 1 }}>Logout</Button>
                    </>
                  ) : (
                    <>
                      <Button color="inherit" component={Link} to="/login" sx={{ mx: 1 }}>Login</Button>
                      <Button color="inherit" component={Link} to="/signup" sx={{ mx: 1 }}>Sign Up</Button>
                    </>
                  )}
                </Box>
                {isMobile && (
                  <Button color="inherit" sx={{ ml: 1 }}>
                    <MenuIcon />
                  </Button>
                )}
              </Toolbar>
            </Container>
          </AppBar>
          <Box component="main" sx={{ pt: { xs: '56px', sm: '64px' }, minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/demos" element={<DemoPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/viewBrdge/:id" element={<ViewBrdgePage />} />
              <Route path="/b/:publicId" element={<ViewBrdgePage />} /> {/* New route for public ID */}
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
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
