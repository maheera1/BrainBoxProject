import React, { useState } from "react";
import {
  FaUsers,
  FaUserFriends,
  FaBars,
  FaTachometerAlt,
  FaBook, // Icon for resources
} from "react-icons/fa";

const TeacherSidebar = ({ navigateTo }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <h2>{!isCollapsed ? "BrainBox" : "BB"}</h2>
        </div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>
      <ul className="sidebar-menu">
        {/* Dashboard Link */}
        <li onClick={() => navigateTo("teacherDashboard")}>
          <FaTachometerAlt className="icon" />
          {!isCollapsed && <span>Dashboard</span>}
        </li>
        {/* Group Management Link */}
        <li onClick={() => navigateTo("manageGroupsTeacher")}>
          <FaUserFriends className="icon" />
          {!isCollapsed && <span>Group Management</span>}
        </li>
        {/* Student Management Link */}
        <li onClick={() => navigateTo("manageStudents")}>
          <FaUsers className="icon" />
          {!isCollapsed && <span>Student Management</span>}
        </li>
        {/* Manage Resources Link */}
        <li onClick={() => navigateTo("manageResourcesTeacher")}>
          <FaBook className="icon" />
          {!isCollapsed && <span>Manage Resources</span>}
        </li>
      </ul>
    </div>
  );
};

export default TeacherSidebar;
