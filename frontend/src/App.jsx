import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress, GlobalStyles } from '@mui/material';
import dotbridgeTheme from './dotbridgeTheme';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header'; // Make sure you have this component
import DotBridgeLandingPage from './pages/DotBridgeLandingPage'; // Import the new landing page
import DotBrdgeListPage from './pages/DotBrdgeListPage'; // <-- Import the new page
import CreateBrdgePage from './pages/CreateBrdgePage';
import EditBrdgePage from './pages/EditBrdgePage';
import ViewBrdgePage from './pages/ViewBrdgePage';
import ViewCoursePage from './pages/ViewCoursePage';
import EditCoursePage from './pages/EditCoursePage';
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
import MarketplacePage from './pages/Marketplace';
import DotBridgeBuyerJourneyDemoPage from './pages/DotBridgeBuyerJourneyDemoPage'; // Import the new demo page
import BlogPage from './pages/BlogPage'; // Import the new Blog page
import BlogPostDetailPage from './pages/BlogPostDetailPage'; // Import Blog Post Detail Page
import CareerPage from './pages/CareerPage'; // Import the new Career page
import ChallengePage from './pages/ChallengePage'; // Import ChallengePage

// Create an AuthContext
export const AuthContext = React.createContext(null);

// Define Global Styles - Adjust or Remove based on new design
// Keep CssBaseline, but potentially remove the fixed parchment background for core app pages
// const globalStyles = (
//   <GlobalStyles
//     styles={{
//       body: {
//         backgroundColor: dotbridgeTheme.palette.background.default, // Use NEW theme default
//         // Remove the fixed overlay for core app?
//         // '/&::before': {
//         //   content: '""',
//         //   position: 'fixed',
//         //   ...
//         // },
//       },
//     }}
//   />
// );

function Layout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  // Always show header on all pages
  const showHeader = true;

  // Define public routes
  const publicRoutes = ['/login', '/signup', '/pricing', '/policy', '/', '/contact', '/services', '/marketplace', '/demos', '/blog', '/careers'];

  // Check if the current path is a viewBridge route or viewCourse route
  const isViewBrdgePath = (path) => {
    return path.startsWith('/viewBridge/') || path.startsWith('/b/');
  };

  const isViewCoursePath = (path) => {
    return path.startsWith('/c/');
  };

  const isBlogPath = (path) => {
    return path.startsWith('/blog/');
  };

  const isCareersApplyPath = (path) => {
    return path.startsWith('/careers/apply/');
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
            navigate('/home', { replace: true }); // Redirect logged-in users from login/signup to home
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          logout();
          setIsAuthenticated(false);
          // If token is invalid, and user is on protected route, redirect to login
          const needsAuth = !publicRoutes.includes(currentPath) &&
            !isViewBrdgePath(currentPath) &&
            !isViewCoursePath(currentPath) &&
            !isBlogPath(currentPath) &&
            !isCareersApplyPath(currentPath);
          if (needsAuth) {
            sessionStorage.setItem('redirectAfterLogin', currentPath); // Store intended path
            navigate('/login', { replace: true });
          }
        }
      } else {
        // No token: redirect to login if not on a public/view route
        const needsAuth = !publicRoutes.includes(currentPath) &&
          !isViewBrdgePath(currentPath) &&
          !isViewCoursePath(currentPath) &&
          !isBlogPath(currentPath) &&
          !isCareersApplyPath(currentPath);
        if (needsAuth) {
          sessionStorage.setItem('redirectAfterLogin', currentPath); // Store intended path
          navigate('/login', { replace: true });
        }
      }

      setIsLoading(false);
    };

    checkAuth();
    // Depend on location.pathname to re-check auth on navigation
  }, [navigate, location.pathname]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        {/* Use the new theme's primary color for the spinner */}
        <CircularProgress sx={{ color: dotbridgeTheme.palette.primary.main }} />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {/* Apply global styles here, after CssBaseline but before main content Box */}
      {/* {globalStyles} // Decide if needed or handled by CssBaseline/Theme */}
      <Box sx={{
        display: 'flex', flexDirection: 'column', minHeight: '100vh',
        // Use the new theme's default background
        bgcolor: 'background.default'
      }}>
        {showHeader && <Header />} {/* Conditionally render Header */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            // Adjust padding based on whether header is shown
            pt: showHeader ? { xs: '56px', sm: '64px' } : 0 // Use MUI standard header heights approx
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

  if (!googleClientId) {
    console.error("ERROR: REACT_APP_GOOGLE_CLIENT_ID is not set.");
    // Optionally render an error message or fallback UI
    return <Box>Error: Google Client ID not configured.</Box>;
  }

  return (
    <GoogleOAuthProvider
      clientId={googleClientId}
      onScriptLoadError={() => console.error('Google Script failed to load')}
      onScriptLoadSuccess={() => console.log('Google Script loaded successfully')}
    >
      {/* Use the NEW theme here */}
      <ThemeProvider theme={dotbridgeTheme}>
        <CssBaseline /> {/* Ensures basic resets and applies background from theme */}
        <SnackbarProvider>
          <Router>
            <ScrollToTop />
            <Layout>
              <Routes>
                {/* Use the new Landing Page for the root route */}
                <Route path="/" element={<DotBridgeLandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/viewBridge/:id" element={<ViewBrdgePage />} />
                <Route path="/b/:publicId" element={<ViewBrdgePage />} />
                <Route path="/c/:publicId" element={<ViewCoursePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/demos" element={<DotBridgeBuyerJourneyDemoPage />} /> {/* Changed path to /demo */}
                <Route path="/blog" element={<BlogPage />} /> {/* Added route for BlogPage */}
                <Route path="/blog/:slug" element={<BlogPostDetailPage />} /> {/* Added route for individual blog posts */}
                <Route path="/careers" element={<CareerPage />} /> {/* Added route for CareerPage */}
                <Route path="/careers/apply/:jobId/challenge" element={<ChallengePage />} /> {/* Added Challenge Route */}
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <DotBrdgeListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bridges"
                  element={
                    <ProtectedRoute>
                      <DotBrdgeListPage />
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
                <Route path="/marketplace" element={<MarketplacePage />} />
                {/* Add a catch-all or 404 route if desired */}
                {/* <Route path="*" element={<NotFoundPage />} /> */}
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
