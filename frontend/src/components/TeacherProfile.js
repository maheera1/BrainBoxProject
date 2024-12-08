import React, { useEffect, useState } from "react";
import {
  fetchTeacherProfile,
  updateTeacherProfile,
  deleteTeacherProfile,
  forgotPassword, // Using the same API for both Admin and Teacher
  resetPassword,  // Using the same API for both Admin and Teacher
} from "../services/api";

const TeacherProfile = ({ loggedInUser, navigateTo }) => {
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState(null); // To store reset token
  const [newPassword, setNewPassword] = useState(""); // To store new password

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const profile = await fetchTeacherProfile(); // Fetch teacher profile
        setProfileData(profile);
        setFormData(profile); // Initialize form with profile data
      } catch (err) {
        console.error("Failed to load teacher profile:", err);
      }
    };
    loadProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedProfile = await updateTeacherProfile(profileData._id, formData);
      setProfileData(updatedProfile.user);
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      setMessage("Failed to update profile.");
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await deleteTeacherProfile(profileData._id);
      setMessage("Profile deleted successfully!");
    } catch (err) {
      console.error("Failed to delete profile:", err);
      setMessage("Failed to delete profile.");
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await forgotPassword(profileData.email); // Using the same forgotPassword API
      setResetToken(response.resetToken); // Store the reset token
      setMessage("Reset token received. Please set a new password below.");
    } catch (err) {
      console.error("Failed to get reset token:", err);
      setMessage("Failed to get reset token.");
    }
  };

  const handleResetPassword = async () => {
    try {
      if (!resetToken || !newPassword) {
        setMessage("Please enter a new password.");
        return;
      }
      await resetPassword(resetToken, newPassword); // Using the same resetPassword API
      setMessage("Password reset successfully!");
      setResetToken(null); // Clear the reset token
      setNewPassword(""); // Clear the password input
    } catch (err) {
      console.error("Failed to reset password:", err);
      setMessage("Failed to reset password.");
    }
  };

  const handleBack = () => {
    navigateTo("teacherDashboard"); // Navigate back to the Teacher Dashboard
  };

  if (!profileData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="teacher-profile-page">
      <button className="back-button" onClick={handleBack}>
        &larr; Back
      </button>
      <h1>Teacher Profile</h1>
      {message && <p className="message">{message}</p>}
      <form>
        <label>
          Name:
          <input
            type="text"
            name="fullName"
            value={formData.fullName || ""}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleInputChange}
          />
        </label>
        <button type="button" onClick={handleUpdateProfile}>
          Update Profile
        </button>
        <button
          type="button"
          className="delete-profile"
          onClick={handleDeleteProfile}
        >
          Delete Profile
        </button>
      </form>

      <button
        type="button"
        className="forgot-password"
        onClick={handleForgotPassword}
      >
        Forgot Password
      </button>

      {/* Conditionally render reset password form */}
      {resetToken && (
        <div className="reset-password-form">
          <h2>Reset Password</h2>
          <label>
            New Password:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
          <button type="button" onClick={handleResetPassword}>
            Reset Password
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;
