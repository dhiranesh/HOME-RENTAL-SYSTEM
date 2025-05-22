import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import AdminAddProperty from './components/AdminAddProperty';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/rent-your-place" element={<AdminAddProperty />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;