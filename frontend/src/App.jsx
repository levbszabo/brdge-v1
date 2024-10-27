import React from 'react';
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
import { getAuthToken, setAuthToken, logout } from './utils/auth';
import { SnackbarProvider } from './utils/snackbar';
import '@fontsource/poppins';

function Layout({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
}

function App() {
  return (
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
            </Routes>
          </Layout>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
