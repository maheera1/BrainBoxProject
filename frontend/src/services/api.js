import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import

const API_BASE_URL = "http://localhost:5000/api";

// Helper function to get Authorization headers
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  return { Authorization: `Bearer ${token}` };
};

// Registration APIs
export const registerAdmin = async (adminData) => {
  return axios.post(`${API_BASE_URL}/admin/register`, adminData);
};

export const registerTeacher = async (teacherData) => {
  return axios.post(`${API_BASE_URL}/teacher/register`, teacherData);
};

// Login APIs
export const loginAdmin = async (loginData) => {
  return axios.post(`${API_BASE_URL}/admin/login`, loginData);
};

export const loginTeacher = async (loginData) => {
  return axios.post(`${API_BASE_URL}/teacher/login`, loginData);
};

export const loginStudent = async (loginData) => {
  return axios.post(`${API_BASE_URL}/student/login`, loginData);
};

// Decode Token
export const decodeToken = (token) => {
  return jwtDecode(token);
};

// Fetch Admin Profile
export const fetchAdminProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/profile`, {
      headers: getAuthHeader(),
    });
    return response.data; // Admin profile data
  } catch (err) {
    console.error("Error fetching admin profile:", err);
    throw err;
  }
};

// Set Logged-In User Details
export const setLoggedInUserDetails = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found for logged-in user details.");
    return { name: "Guest", role: "Guest" };
  }

  try {
    const decoded = decodeToken(token); // Decode the token
    const { role, fullName } = decoded;

    if (role === "Admin") {
      const adminProfile = await fetchAdminProfile();
      return { name: adminProfile.fullName || "Admin", role: adminProfile.role || "Admin" };
    }

    return { name: fullName || "User", role: role || "Guest" };
  } catch (err) {
    console.error("Failed to set logged-in user details:", err.response?.data || err.message);
    return { name: "Guest", role: "Guest" };
  }
};


// Update User Profile
export const updateUserProfile = async (id, updates) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/admin/users/${id}`, updates, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (err) {
    console.error("Error updating profile:", err);
    throw err;
  }
};

// Delete User Profile
export const deleteUserProfile = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/admin/users/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (err) {
    console.error("Error deleting profile:", err);
    throw err;
  }
};

// Forgot Password
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
    return response.data;
  } catch (err) {
    console.error("Error sending password reset email:", err);
    throw err;
  }
};

// Reset Password
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, { token, newPassword });
    return response.data;
  } catch (err) {
    console.error("Error resetting password:", err);
    throw err;
  }
};

// Admin Analytics APIs
// Active Users API
export const getActiveUsers = async (timeframe = "7d") => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/analytics/active-users?timeframe=${timeframe}`,
      { headers: getAuthHeader() }
    );
    console.log("Active Users Response:", response.data);
    return response.data; // Expecting { activeUsers: number }
  } catch (err) {
    console.error("Error fetching active users analytics:", err);
    throw err;
  }
};

// Popular Resources API
export const getPopularResources = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/popular-resources`, {
      headers: getAuthHeader(),
    });
    console.log("Popular Resources Response:", response.data);
    return response.data; // Ensure this returns an array
  } catch (err) {
    console.error("Error fetching popular resources analytics:", err);
    throw err;
  }
};

// Engagement Summary API
export const getEngagementSummary = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/engagement-summary`, {
      headers: getAuthHeader(),
    });
    console.log("Engagement Summary Response:", response.data);
    return response.data; // Expecting { messageCount, resourceCount, activeGroups }
  } catch (err) {
    console.error("Error fetching engagement summary analytics:", err);
    throw err;
  }
};

export const getTopContributors = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/top-contributors`, {
      headers: getAuthHeader(),
    });
    console.log("Top Contributors Response:", response.data); // Debug log
    return response.data; // Ensure it returns an array
  } catch (err) {
    console.error("Error fetching top contributors:", err);
    throw err;
  }
};

// Approve Teacher API
export const approveTeacher = async (id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/admin/approve/${id}`, null, {
      headers: getAuthHeader(),
    });
    console.log("Approve Teacher Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error approving teacher:", err);
    throw err;
  }
};

// Get All Users API (Filters teachers in frontend)
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeader(),
    });
    console.log("Get All Users Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error fetching users:", err);
    throw err;
  }
};

// Update Teacher API
export const updateUser = async (id, updates) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/admin/users/${id}`, updates, {
      headers: getAuthHeader(),
    });
    console.log("Update User Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error updating user:", err);
    throw err;
  }
};

// Delete Teacher API
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/admin/users/${id}`, {
      headers: getAuthHeader(),
    });
    console.log("Delete User Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error deleting user:", err);
    throw err;
  }
};

// Get Deletion Requests API (Filter in frontend)
export const getDeletionRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/deletion-requests`, {
      headers: getAuthHeader(),
    });
    console.log("Get Deletion Requests Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error fetching deletion requests:", err);
    throw err;
  }
};

// Handle Deletion Request API
export const handleDeletionRequest = async (id, data) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/admin/deletion-requests/${id}`,
      data, // Ensure `data` includes both `action` and `userId`
      {
        headers: getAuthHeader(),
      }
    );
    console.log("Handle Deletion Request Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error handling deletion request:", err.response?.data || err.message);
    throw err;
  }
};


// Fetch user details by ID
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/users/${id}`, {
      headers: getAuthHeader(),
    });
    console.log("Get User By ID Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error fetching user details:", err);
    throw err;
  }
};


// Fetch All Resources
export const getAllResources = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/resources/resources`, {
      headers: getAuthHeader(),
    });
    console.log("Get All Resources Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error fetching resources:", err.response?.data || err.message);
    throw err;
  }
};

// Upload File to Google Drive
export const uploadFileToDrive = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/google-drive/upload`, data, {
      headers: getAuthHeader(),
    });
    console.log("Upload File to Drive Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error uploading file to Google Drive:", err.response?.data || err.message);
    throw err;
  }
};

// List Files from Google Drive
export const listFilesInDrive = async (query = {}) => {
  try {
    const folderId = query.folderId ? `?folderId=${query.folderId}` : "";
    const response = await axios.get(`${API_BASE_URL}/google-drive/list${folderId}`, {
      headers: getAuthHeader(),
    });
    console.log("List Files in Drive Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error listing files from Google Drive:", err.response?.data || err.message);
    throw err;
  }
};

// Set Resource Permissions
export const setResourcePermissions = async (resourceId, permissions) => {
  try {
    console.log("Sending permissions:", { resourceId, permissions }); // Debug payload
    const headers = getAuthHeader();
    console.log("Auth Headers:", headers); // Debug headers

    const response = await axios.post(
      `${API_BASE_URL}/admin/resource/permissions`,
      { resourceId, permissions },
      { headers }
    );

    console.log("Set Resource Permissions Response:", response.data); // Debug response
    return response.data;
  } catch (err) {
    console.error("Error setting resource permissions:", err.response?.data || err.message); // Debug error
    throw err;
  }
};

// Fetch all groups
export const getGroups = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/groups`, {
      headers: getAuthHeader(),
    });
    return response.data; // Returns an array of groups
  } catch (err) {
    console.error("Error fetching groups:", err);
    throw err;
  }
};

// Approve a group
export const approveGroup = async (groupId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/groups/approve/${groupId}`, null, {
      headers: getAuthHeader(),
    });
    return response.data; // Returns the updated group
  } catch (err) {
    console.error("Error approving group:", err);
    throw err;
  }
};

// Edit group details
export const editGroup = async (groupId, updates) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/groups/${groupId}`, updates, {
      headers: getAuthHeader(),
    });
    return response.data; // Returns the updated group
  } catch (err) {
    console.error("Error editing group:", err);
    throw err;
  }
};

// Remove a member from a group
export const removeMember = async (groupId, memberId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/groups/${groupId}/member/${memberId}`, {
      headers: getAuthHeader(),
    });
    return response.data; // Returns the updated group
  } catch (err) {
    console.error("Error removing member:", err);
    throw err;
  }
};

// Delete a group
export const deleteGroup = async (groupId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/groups/${groupId}`, {
      headers: getAuthHeader(),
    });
    return response.data; // Success message
  } catch (err) {
    console.error("Error deleting group:", err);
    throw err;
  }
};

// Block a user from joining a group
export const blockUser = async (groupId, userId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/groups/block`,
      { groupId, userId },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data; // Updated group
  } catch (err) {
    console.error("Error blocking user:", err);
    throw err;
  }
};

// Unblock a user from joining a group
export const unblockUser = async (groupId, userId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/groups/unblock`,
      { groupId, userId },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data; // Updated group
  } catch (err) {
    console.error("Error unblocking user:", err);
    throw err;
  }
};

// Get messages for a group
export const getMessages = async (groupId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/chat/${groupId}`, {
      headers: getAuthHeader(),
    });
    return response.data; // Returns an array of messages
  } catch (err) {
    console.error("Error fetching messages:", err);
    throw err;
  }
};

// Set chat permissions for a group
export const setChatPermissions = async (groupId, enableChatForStudents) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/chat/permissions`,
      { groupId, enableChatForStudents },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data; // Updated group
  } catch (err) {
    console.error("Error setting chat permissions:", err);
    throw err;
  }
};

// Fetch Teacher Profile
export const fetchTeacherProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/teacher/profile`, {
      headers: getAuthHeader(),
    });
    return response.data; // Teacher profile data
  } catch (err) {
    console.error("Error fetching teacher profile:", err);
    throw err;
  }
};

// Update Teacher Profile
export const updateTeacherProfile = async (id, updates) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/teacher/profile/${id}`, updates, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (err) {
    console.error("Error updating teacher profile:", err);
    throw err;
  }
};

// Delete Teacher Profile
export const deleteTeacherProfile = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/teacher/deletion-request/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (err) {
    console.error("Error deleting teacher profile:", err);
    throw err;
  }
};

