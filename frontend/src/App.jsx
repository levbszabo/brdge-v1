import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Button, IconButton, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LandingPage from './pages/LandingPage';
import BrdgeListPage from './pages/BrdgeListPage';
import CreateBrdgePage from './pages/CreateBrdgePage';
import ViewBrdgePage from './pages/ViewBrdgePage';
import DemoPage from './pages/DemoPage';
import WaitlistPage from './pages/WaitlistPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
  },
});

function Header() {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLoggedIn = !!localStorage.getItem('authToken');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Brdge AI
        </Typography>
        {isMobile ? (
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/about">About</Button>
            <Button color="primary" variant="contained" component={Link} to="/demo">
              Try Brdge AI
            </Button>
            {isLoggedIn ? (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/waitlist" element={<WaitlistPage />} />
          <Route path="/viewBrdge/:id" element={<ViewBrdgePage />} />
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
      </Router>
    </ThemeProvider>
  );
}

export default App;
