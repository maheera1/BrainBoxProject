import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminDashboard = ({ loggedInUser, navigateTo }) => {
  return (
    <div className="admin-dashboard">
      <AdminSidebar navigateTo={navigateTo} /> {/* Sidebar */}
      <div className="dashboard-content">
        <h2>Welcome, {loggedInUser.name}</h2>
        <p>This is your admin dashboard. Use the sidebar to navigate.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
