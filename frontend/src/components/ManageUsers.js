import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  getDeletionRequests,
  handleDeletionRequest,
  getUserById,
  approveTeacher, // Import approveTeacher API
} from "../services/api";

const ManageUsers = ({ navigateTo }) => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [deletionRequests, setDeletionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editUser, setEditUser] = useState(null); // State to track user being edited
  const [updatedInfo, setUpdatedInfo] = useState({ fullName: "", email: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch teachers and students
        const usersResponse = await getAllUsers();
        const teacherList = usersResponse.teachers || [];
        const studentList = usersResponse.students || [];
        setTeachers(teacherList);
        setStudents(studentList);

        // Fetch deletion requests for users
        const deletionRequestsResponse = await getDeletionRequests();
        const enrichedRequests = await Promise.all(
          deletionRequestsResponse.map(async (req) => {
            if (req.userId) {
              try {
                const user = await getUserById(req.userId);
                return {
                  ...req,
                  userName: user.fullName || "Unknown",
                  role: user.role || "Unknown",
                };
              } catch (err) {
                console.error("Failed to fetch user details for:", req.userId, err);
                return { ...req, userName: "Unknown", role: "Unknown" };
              }
            }
            return req;
          })
        );
        setDeletionRequests(enrichedRequests);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setMessage("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditUser = (user) => {
    setEditUser(user._id);
    setUpdatedInfo({ fullName: user.fullName, email: user.email });
  };

  const handleUpdateUser = async () => {
    try {
      await updateUser(editUser, updatedInfo);
      setMessage("User updated successfully!");
      setEditUser(null); // Close the update form
      // Refresh user lists
      const usersResponse = await getAllUsers();
      setTeachers(usersResponse.teachers || []);
      setStudents(usersResponse.students || []);
    } catch (err) {
      console.error("Failed to update user:", err);
      setMessage("Failed to update user.");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setMessage("User deleted successfully!");
      // Refresh user lists
      const usersResponse = await getAllUsers();
      setTeachers(usersResponse.teachers || []);
      setStudents(usersResponse.students || []);
    } catch (err) {
      console.error("Failed to delete user:", err);
      setMessage("Failed to delete user.");
    }
  };

  const handleApproveTeacher = async (id) => {
    try {
      await approveTeacher(id);
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher._id === id ? { ...teacher, isApproved: true } : teacher
        )
      );
      setMessage("Teacher approved successfully!");
    } catch (err) {
      console.error("Error approving teacher:", err);
      setMessage("Failed to approve teacher.");
    }
  };


  const handleDeletionRequestAction = async (id, action, userId) => {
    try {
      await handleDeletionRequest(id, { action, userId }); // Correct payload
      setMessage(`Request ${action === "approve" ? "approved" : "rejected"} successfully.`);

      // Refresh deletion requests after action
      const deletionRequestsResponse = await getDeletionRequests();
      const enrichedRequests = await Promise.all(
        deletionRequestsResponse.map(async (req) => {
          if (req.userId) {
            try {
              const user = await getUserById(req.userId);
              return {
                ...req,
                userName: user.fullName || "Unknown",
                role: user.role || "Unknown",
              };
            } catch (err) {
              console.error("Failed to fetch user details for:", req.userId, err);
              return { ...req, userName: "Unknown", role: "Unknown" };
            }
          }
          return req;
        })
      );
      setDeletionRequests(enrichedRequests);
    } catch (err) {
      console.error("Failed to handle deletion request:", err.response?.data || err.message);
      setMessage("Failed to handle deletion request.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-dashboard">
      <AdminSidebar navigateTo={navigateTo} />
      <div className="dashboard-content">
        <h1>Manage Users</h1>
        {message && <p>{message}</p>}

        {/* Teachers Section */}
        <div className="teacher-section">
          <h2>Teachers</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td>{teacher.fullName}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.approved ? "Approved" : "Pending"}</td>
                  <td>
                    {!teacher.approved && (
                      <button
                        onClick={() => handleApproveTeacher(teacher._id)}
                        className="btn btn-success"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleEditUser(teacher)}
                      className="btn btn-primary"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteUser(teacher._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Students Section */}
        <div className="student-section">
          <h2>Students</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.fullName}</td>
                  <td>{student.email}</td>
                  <td>
                    <button
                      onClick={() => handleEditUser(student)}
                      className="btn btn-primary"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteUser(student._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Deletion Requests Section */}
        <div className="deletion-requests-section">
          <h2>Deletion Requests</h2>
          <table className="table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Role</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deletionRequests.map((req) => (
                <tr key={req._id}>
                  <td>{req.userName}</td>
                  <td>{req.role}</td>
                  <td>{req.message}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleDeletionRequestAction(req._id, "approve", req.userId)
                      }
                      className="btn btn-success"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleDeletionRequestAction(req._id, "reject", req.userId)
                      }
                      className="btn btn-danger"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Update Form */}
        {editUser && (
          <div className="update-form">
            <h3>Update User</h3>
            <label>
              Full Name:
              <input
                type="text"
                value={updatedInfo.fullName}
                onChange={(e) =>
                  setUpdatedInfo({ ...updatedInfo, fullName: e.target.value })
                }
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={updatedInfo.email}
                onChange={(e) =>
                  setUpdatedInfo({ ...updatedInfo, email: e.target.value })
                }
              />
            </label>
            <button onClick={handleUpdateUser} className="btn btn-success">
              Save
            </button>
            <button onClick={() => setEditUser(null)} className="btn btn-danger">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );

};

export default ManageUsers;
