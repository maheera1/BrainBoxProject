import { jwtDecode } from "jwt-decode"; // Named export from newer versions

export const getLoggedInUser = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null; // User not logged in
  }

  try {
    const decoded = jwtDecode(token);
    return {
      name: decoded.name, // Adjust this to match your token's structure
      role: decoded.role, // Adjust this to match your token's structure
    };
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
};
