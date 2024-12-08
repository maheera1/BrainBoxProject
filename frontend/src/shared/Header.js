import React, { useState } from "react";

const Header = ({ loggedInUser, navigateTo }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleProfileClick = () => {
    navigateTo("userProfile");
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("token"); // Clear the token
    navigateTo("login"); // Navigate to login page
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1>BrainBox</h1>
      </div>
      <div className="header-right">
        {/* Notification Bell */}
        <div className="notification" onClick={() => navigateTo("notifications")}>
          <i className="fas fa-bell"></i>
        </div>

        {/* User Profile */}
        <div className="user-profile">
          <div
            className="profile-icon"
            onClick={() => setDropdownVisible(!dropdownVisible)}
          >
            <i className="fas fa-user-circle"></i>
            <span className="user-name">{loggedInUser.name}</span>
          </div>
          {dropdownVisible && (
            <div className="profile-dropdown">
              <div className="dropdown-item" onClick={handleProfileClick}>
                User Profile
              </div>
              <div className="dropdown-item" onClick={handleLogoutClick}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
