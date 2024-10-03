import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './pages/LandingPage';
import BrdgeListPage from './pages/BrdgeListPage';
import CreateBrdgePage from './pages/CreateBrdgePage';
import ViewBrdgePage from './pages/ViewBrdgePage';
import DemoPage from './pages/DemoPage'; // Import the new DemoPage

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/brdges" element={<BrdgeListPage />} />
          <Route path="/create" element={<CreateBrdgePage />} />
          <Route path="/edit/:id" element={<CreateBrdgePage />} />
          <Route path="/viewBrdge/:id" element={<ViewBrdgePage />} />
          <Route path="/demo" element={<DemoPage />} /> {/* New Demo page route */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
