import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress, GlobalStyles } from '@mui/material';
import theme from './theme';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header'; // Make sure you have this component
import LandingPage from './pages/LandingPage';
import BrdgeListPage from './pages/BrdgeListPage';
import CreateBrdgePage from './pages/CreateBrdgePage';
import EditBrdgePage from './pages/EditBrdgePage';
import ViewBrdgePage from './pages/ViewBrdgePage';
import ViewCoursePage from './pages/ViewCoursePage';
import EditCoursePage from './pages/EditCoursePage';
import DemoPage from './pages/DemoPage';
import ServicesPage from './pages/ServicesPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { api } from './api';
import { getAuthToken, logout } from './utils/auth';
import { SnackbarProvider } from './utils/snackbar';
import '@fontsource/poppins';
import PricingPage from './pages/PricingPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import PolicyPage from './pages/PolicyPage';
import UserProfilePage from './pages/UserProfilePage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import { REACT_APP_GOOGLE_CLIENT_ID } from './config';
import RoomPage from './pages/RoomPage';
import ContactPage from './pages/ContactPage';
import CookieConsent from './components/CookieConsent';
import darkParchmentTexture from './assets/textures/dark-parchment.png'; // Import the texture

// Create an AuthContext
export const AuthContext = React.createContext(null);

// Define Global Styles for background texture
const globalStyles = (
  <GlobalStyles
    styles={{
      body: {
        backgroundColor: theme.palette.background.default, // Use parchmentLight from theme
        // Apply the texture as a fixed overlay
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${darkParchmentTexture})`,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed', // Keep it fixed
          opacity: 0.15, // Adjust opacity as needed
          mixBlendMode: 'multiply',
          zIndex: -1, // Ensure it's behind all content
          pointerEvents: 'none',
        },
      },
    }}
  />
);

function Layout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  // Define public routes
  const publicRoutes = ['/login', '/signup', '/demos', '/pricing', '/policy', '/', '/contact', '/services'];

  // Check if the current path is a viewBridge route or viewCourse route
  const isViewBrdgePath = (path) => {
    return path.startsWith('/viewBridge/') || path.startsWith('/b/');
  };

  const isViewCoursePath = (path) => {
    return path.startsWith('/c/');
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      const currentPath = location.pathname;

      if (token) {
        try {
          await api.get('/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsAuthenticated(true);

          // Check if there's a redirect path stored after login
          const redirectPath = sessionStorage.getItem('redirectAfterLogin');
          if (redirectPath && ['/login', '/signup'].includes(currentPath)) {
            sessionStorage.removeItem('redirectAfterLogin');
            navigate(redirectPath, { replace: true });
          }
          // Only redirect if specifically on login/signup pages and no redirect path
          else if (['/login', '/signup'].includes(currentPath)) {
            navigate('/home', { replace: true });
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          logout();
          setIsAuthenticated(false);
        }
      } else {
        // Only redirect to login if not on a public route and not on a viewBridge or viewCourse route
        const needsAuth = !publicRoutes.includes(currentPath) &&
          !isViewBrdgePath(currentPath) &&
          !isViewCoursePath(currentPath);
        if (needsAuth) {
          navigate('/login', { replace: true });
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, location.pathname]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {/* Apply global styles here, after CssBaseline but before main content Box */}
      {globalStyles}
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            // Add padding top to account for the fixed header
            pt: isLandingPage ? 0 : { xs: '48px', sm: '64px' }
          }}
        >
          {children}
        </Box>
      </Box>
    </AuthContext.Provider>
  );
}

function App() {
  // Get the Google Client ID from the environment variable
  const googleClientId = REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider
      clientId={googleClientId}
      onScriptLoadError={() => console.error('Google Script failed to load')}
      onScriptLoadSuccess={() => console.log('Google Script loaded successfully')}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <Router>
            <ScrollToTop />
            <Layout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/demos" element={<DemoPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/viewBridge/:id" element={<ViewBrdgePage />} />
                <Route path="/b/:publicId" element={<ViewBrdgePage />} />
                <Route path="/c/:publicId" element={<ViewCoursePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <BrdgeListPage title="Home" />
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
                      <EditBrdgePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-course/:id"
                  element={
                    <ProtectedRoute>
                      <EditCoursePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/policy" element={<PolicyPage />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <UserProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
                <Route path="/room" element={<RoomPage />} />
              </Routes>
            </Layout>
            <CookieConsent />
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
