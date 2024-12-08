import React, { useState, useEffect } from "react";
import Footer from "./shared/Footer"; // Import Footer
import RegistrationPage from "./components/Registration";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./components/AdminDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import UserProfile from "./components/UserProfile"; // Import UserProfile
import Notifications from "./components/Notification"; // Import Notifications
import AdminAnalytics from "./components/AdminAnalytics"; // Import AdminAnalytics
import ManageUsers from "./components/ManageUsers"; // Import ManageUsers
import ManageResources from "./components/ManageResources"; // Import ManageResources
import ManageGroups from "./components/ManageGroups"; // Import ManageGroups
import Header from "./shared/Header";
import { setLoggedInUserDetails } from "./services/api"; // Import the user details service
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState({ name: "Guest", role: "Guest" });
  const [currentPage, setCurrentPage] = useState("login");

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const userDetails = await setLoggedInUserDetails();
        setLoggedInUser(userDetails);
      } catch (err) {
        console.error("Failed to fetch logged-in user details:", err);
      }
    };
    loadUserDetails();
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "register":
        return <RegistrationPage navigateTo={setCurrentPage} />;
      case "login":
        return (
          <LoginPage
            navigateTo={setCurrentPage}
            setLoggedInUser={setLoggedInUser}
          />
        );
      case "adminDashboard":
        return (
          <AdminDashboard
            navigateTo={setCurrentPage}
            loggedInUser={loggedInUser} // Passing loggedInUser
          />
        );
      case "teacherDashboard":
        return (
          <TeacherDashboard
            navigateTo={setCurrentPage}
            loggedInUser={loggedInUser}
          />
        );
      case "studentDashboard":
        return (
          <StudentDashboard
            navigateTo={setCurrentPage}
            loggedInUser={loggedInUser}
          />
        );
      case "notifications":
        return (
          <Notifications
            navigateTo={setCurrentPage}
            loggedInUser={loggedInUser}
          />
        );
      case "userProfile":
        return (
          <UserProfile
            navigateTo={setCurrentPage}
            loggedInUser={loggedInUser}
          />
        );
      case "analytics":
        return (
          <AdminAnalytics
            navigateTo={setCurrentPage}
            loggedInUser={loggedInUser}
          />
        );
      case "manageUser":
        return (
          <ManageUsers
            navigateTo={setCurrentPage}
            loggedInUser={loggedInUser}
          />
        );
      case "manageResources":
        return (
          <ManageResources
            navigateTo={setCurrentPage}
            loggedInUser={loggedInUser}
          />
        );
      case "manageGroups":
        return (
          <ManageGroups
            navigateTo={setCurrentPage}
            loggedInUser={loggedInUser}
          />
        );
      default:
        return <h1>404 - Page Not Found</h1>;
    }
  };

  return (
    <div>
      {/* Render Header for all pages except Login and Registration */}
      {currentPage !== "login" && currentPage !== "register" && (
        <Header loggedInUser={loggedInUser} navigateTo={setCurrentPage} />
      )}
      {renderPage()}
      {/* Render Footer for all pages except Login and Registration */}
      {currentPage !== "login" && currentPage !== "register" && <Footer />}
    </div>
  );
};

export default App;
