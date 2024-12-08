import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar"; // Sidebar
import axios from "axios";

const AdminNotifications = ({ navigateTo }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data.notifications);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError("Failed to fetch notifications.");
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      setError("Failed to mark notification as read.");
    }
  };

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p>{error}</p>;

  // Separate notifications into read and unread
  const unreadNotifications = notifications.filter((notif) => !notif.isRead);
  const readNotifications = notifications.filter((notif) => notif.isRead);

  return (
    <div className="admin-dashboard">
      <AdminSidebar navigateTo={navigateTo} /> {/* Sidebar */}
      <div className="dashboard-content">
        <h1>Admin Notifications</h1>
        <button onClick={() => navigateTo("adminDashboard")} className="back-btn">
          Back to Dashboard
        </button>

        <div className="notifications-container">
          {/* Unread Notifications */}
          <div className="notifications-column">
            <h2>Unread Notifications</h2>
            {unreadNotifications.length > 0 ? (
              <ul>
                {unreadNotifications.map((notif) => (
                  <li key={notif._id} className="notification-item">
                    <p>{notif.message}</p>
                    <button onClick={() => markAsRead(notif._id)} className="mark-read-btn">
                      Mark as Read
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No unread notifications.</p>
            )}
          </div>

          {/* Read Notifications */}
          <div className="notifications-column">
            <h2>Read Notifications</h2>
            {readNotifications.length > 0 ? (
              <ul>
                {readNotifications.map((notif) => (
                  <li key={notif._id} className="notification-item">
                    <p>{notif.message}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No read notifications.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
