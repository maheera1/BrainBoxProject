import React, { useState } from "react";
import { registerAdmin, registerTeacher } from "../services/api";

const RegistrationPage = () => {
  const [role, setRole] = useState("Admin"); // Default role is Admin
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (role === "Admin") {
        response = await registerAdmin(formData);
      } else if (role === "Teacher") {
        response = await registerTeacher(formData);
      }

      alert(response.data.message); // Show success message
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  const handleLoginRedirect = () => {
    // Redirect using window.location
    window.location.href = "/login";
  };

  return (
    <div className="registration-page">
      {/* Left Section */}
      <div className="left-section">
        <div className="logo-container">
          <h1 className="title">Welcome to BrainBox</h1>
        </div>
        <div className="moving-background"></div>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="form-container">
          <h2>Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={handleRoleChange}>
                <option value="Admin">Admin</option>
                <option value="Teacher">Teacher</option>
              </select>
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn">Register</button>
          </form>
          {/* Login Redirect */}
          <p className="login-link">
            Already a user?{" "}
            <a href="/login">Login here</a> {/* Navigate using an anchor tag */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
