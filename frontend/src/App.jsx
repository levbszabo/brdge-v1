// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BrdgeListPage from './pages/BrdgeListPage';
import CreateBrdgePage from './pages/CreateBrdgePage';
import ViewBrdgePage from './pages/ViewBrdgePage'; // Import the new ViewBrdgePage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BrdgeListPage />} />
        <Route path="/create" element={<CreateBrdgePage />} />
        <Route path="/edit/:id" element={<CreateBrdgePage />} /> {/* New edit route */}
        <Route path="/viewBrdge/:id" element={<ViewBrdgePage />} /> {/* New Route */}
      </Routes>
    </Router>
  );
}

export default App;