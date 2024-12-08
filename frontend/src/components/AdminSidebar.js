import React, { useState } from "react";
import {
  FaChartBar,
  FaUsers,
  FaFolderOpen,
  FaUserFriends,
  FaBars,
  FaTachometerAlt,
  FaBook, // Icon for resources
} from "react-icons/fa";

const AdminSidebar = ({ navigateTo }) => {
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
        <li onClick={() => navigateTo("adminDashboard")}>
          <FaTachometerAlt className="icon" />
          {!isCollapsed && <span>Dashboard</span>}
        </li>
        {/* Analytics Link */}
        <li onClick={() => navigateTo("analytics")}>
          <FaChartBar className="icon" />
          {!isCollapsed && <span>Analytics</span>}
        </li>
        {/* Reports Link */}
        <li onClick={() => navigateTo("reports")}>
          <FaFolderOpen className="icon" />
          {!isCollapsed && <span>Reports</span>}
        </li>
        {/* Manage Users Link */}
        <li onClick={() => navigateTo("manageUser")}>
          <FaUsers className="icon" />
          {!isCollapsed && <span>Manage Users</span>}
        </li>
        {/* Manage Resources Link */}
        <li onClick={() => navigateTo("manageResources")}>
          <FaBook className="icon" />
          {!isCollapsed && <span>Manage Resources</span>}
        </li>
        {/* Group Management Link */}
        <li onClick={() => navigateTo("manageGroups")}>
          <FaUserFriends className="icon" />
          {!isCollapsed && <span>Group Management</span>}
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
