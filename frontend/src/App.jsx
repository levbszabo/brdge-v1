// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BrdgeListPage from './pages/BrdgeListPage';
import CreateBrdgePage from './pages/CreateBrdgePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BrdgeListPage />} />
        <Route path="/create" element={<CreateBrdgePage />} />
        <Route path="/edit/:id" element={<CreateBrdgePage />} /> {/* New edit route */}
      </Routes>
    </Router>
  );
}

export default App;