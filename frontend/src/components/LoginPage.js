import React, { useState } from "react";
import { loginAdmin, loginTeacher, loginStudent, decodeToken } from "../services/api";

const LoginPage = ({ navigateTo }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
  
      // Try Admin Login
      try {
        response = await loginAdmin(formData);
        console.log("Admin login successful:", response.data);
      } catch (adminError) {
        console.log("Admin login failed, trying Teacher login...");
      }
  
      // If Admin Login Fails, Try Teacher Login
      if (!response) {
        try {
          response = await loginTeacher(formData);
          console.log("Teacher login successful:", response.data);
        } catch (teacherError) {
          console.log("Teacher login failed, trying Student login...");
        }
      }
  
      // If Teacher Login Fails, Try Student Login
      if (!response) {
        try {
          response = await loginStudent(formData);
          console.log("Student login successful:", response.data);
        } catch (studentError) {
          console.log("Student login failed.");
        }
      }
  
      // If no response from any login API, show error
      if (!response) {
        throw new Error("User not found. Please check your credentials.");
      }
  
      // If login successful, process the token
      const token = response.data.token;
      console.log("Token received:", token);
  
      // Decode the token
      const decoded = decodeToken(token);
      console.log("Decoded Token:", decoded);
  
      // Store the token in localStorage
      localStorage.setItem("token", token);
  
      // Redirect to the appropriate dashboard
      if (decoded.role === "Admin") {
        navigateTo("adminDashboard");
      } else if (decoded.role === "Teacher") {
        navigateTo("teacherDashboard");
      } else if (decoded.role === "Student") {
        navigateTo("studentDashboard");
      } else {
        throw new Error("Unknown role in token. Please contact support.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "Login failed. Please try again.");
    }
  };
  
  

  return (
    <div className="login-page">
      <div className="left-section">
        <div className="logo-container">
          <h1 className="title">Welcome to BrainBox</h1>
        </div>
        <div className="moving-background"></div>
      </div>

      <div className="right-section">
        <div className="form-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
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
            <button type="submit" className="btn">Login</button>
          </form>
          {error && <p className="error-message">{error}</p>}
          <p className="signup-link">
            Don't have an account?{" "}
            <span
              onClick={() => navigateTo("register")}
              style={{ color: "blue", cursor: "pointer" }}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
