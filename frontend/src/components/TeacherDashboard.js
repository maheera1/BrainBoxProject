import React from "react";
import TeacherSidebar from "./TeacherSidebar";

const TeacherDashboard = ({ loggedInUser, navigateTo }) => {
  return (
    <div className="teacher-dashboard">
      <TeacherSidebar navigateTo={navigateTo} /> {/* Sidebar */}
      <div className="dashboard-content">
        <h2>Welcome, {loggedInUser.name}</h2>
        <p>This is your teacher dashboard. Use the sidebar to navigate.</p>
      </div>
    </div>
  );
};

export default TeacherDashboard;
