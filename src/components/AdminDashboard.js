import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      
      <div className="admin-actions">
        <Link to="/rent-your-place" className="admin-action-btn">
          Add New Property
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;