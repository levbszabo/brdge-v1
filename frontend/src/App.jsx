import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import theme from './theme';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header'; // Make sure you have this component
import LandingPage from './pages/LandingPage';
import BrdgeListPage from './pages/BrdgeListPage';
import CreateBrdgePage from './pages/CreateBrdgePage';
import EditBrdgePage from './pages/EditBrdgePage';
import ViewBrdgePage from './pages/ViewBrdgePage';
import DemoPage from './pages/DemoPage';
import AboutPage from './pages/AboutPage';
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
import Room from './pages/Room'; // Import the Room component
import PlaygroundMain from './pages/PlaygroundMain';
// Create an AuthContext
export const AuthContext = React.createContext(null);

function Layout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          // Verify the token with the backend
          await api.get('/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token verification failed:', error);
          logout();
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1 }}>
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
                      <EditBrdgePage />
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
                <Route path="/playground" element={<PlaygroundMain />} /> {/* Add the Room route */}
              </Routes>
            </Layout>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
