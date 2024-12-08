import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import {
  getGroups,
  approveGroup,
  editGroup,
  removeMember,
  deleteGroup,
  blockUser,
  unblockUser,
  getMessages,
  setChatPermissions,
} from "../services/api";

const ManageGroups = ({ navigateTo }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupMessages, setGroupMessages] = useState([]);
  const [chatPermissions, setChatPermissionsState] = useState(false);
  const [editGroupData, setEditGroupData] = useState({
    name: "",
    subject: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const groupResponse = await getGroups();
        setGroups(groupResponse);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch groups:", err);
        setMessage("Failed to load groups.");
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleViewGroup = async (group) => {
    try {
      setSelectedGroup(group);
      const messages = await getMessages(group._id);
      setGroupMessages(messages);
      setChatPermissionsState(group.chatSettings?.enableChatForStudents || false);
    } catch (err) {
      console.error("Failed to fetch group messages:", err);
      setMessage("Failed to load group messages.");
    }
  };

  const handleApproveGroup = async (id) => {
    try {
      await approveGroup(id);
      setMessage("Group approved successfully.");
      const updatedGroups = await getGroups();
      setGroups(updatedGroups);
    } catch (err) {
      console.error("Failed to approve group:", err);
      setMessage("Failed to approve group.");
    }
  };

  const handleEditGroup = async () => {
    try {
      await editGroup(selectedGroup._id, editGroupData);
      setMessage("Group updated successfully.");
      const updatedGroups = await getGroups();
      setGroups(updatedGroups);
      setSelectedGroup(null);
    } catch (err) {
      console.error("Failed to update group:", err);
      setMessage("Failed to update group.");
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      await deleteGroup(id);
      setMessage("Group deleted successfully.");
      const updatedGroups = await getGroups();
      setGroups(updatedGroups);
    } catch (err) {
      console.error("Failed to delete group:", err);
      setMessage("Failed to delete group.");
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await removeMember(selectedGroup._id, memberId);
      setMessage("Member removed successfully.");
      const updatedGroups = await getGroups();
      setGroups(updatedGroups);
      const updatedGroup = updatedGroups.find(
        (group) => group._id === selectedGroup._id
      );
      setSelectedGroup(updatedGroup);
    } catch (err) {
      console.error("Failed to remove member:", err);
      setMessage("Failed to remove member.");
    }
  };

  const handleBlockUser = async (groupId, userId) => {
    try {
      await blockUser(groupId, userId);
      setMessage("User blocked successfully.");
      const updatedGroups = await getGroups();
      setGroups(updatedGroups);
      const updatedGroup = updatedGroups.find(
        (group) => group._id === selectedGroup._id
      );
      setSelectedGroup(updatedGroup);
    } catch (err) {
      console.error("Failed to block user:", err);
      setMessage("Failed to block user.");
    }
  };

  const handleUnblockUser = async (groupId, userId) => {
    try {
      await unblockUser(groupId, userId);
      setMessage("User unblocked successfully.");
      const updatedGroups = await getGroups();
      setGroups(updatedGroups);
      const updatedGroup = updatedGroups.find(
        (group) => group._id === selectedGroup._id
      );
      setSelectedGroup(updatedGroup);
    } catch (err) {
      console.error("Failed to unblock user:", err);
      setMessage("Failed to unblock user.");
    }
  };

  const handleSetChatPermissions = async (groupId, enableChat) => {
    try {
      await setChatPermissions(groupId, enableChat);
      setMessage("Chat permissions updated successfully.");
      const updatedGroups = await getGroups();
      setGroups(updatedGroups);
      if (selectedGroup) {
        const updatedGroup = updatedGroups.find(
          (group) => group._id === selectedGroup._id
        );
        setSelectedGroup(updatedGroup);
      }
    } catch (err) {
      console.error("Failed to set chat permissions:", err);
      setMessage("Failed to update chat permissions.");
    }
  };

  if (loading) return <p>Loading groups...</p>;

  return (
    <div className="admin-dashboard">
      <AdminSidebar navigateTo={navigateTo} />
      <div className="dashboard-content">
        <h1>Manage Groups</h1>
        {message && <p>{message}</p>}

        <div className="groups-section">
          <h2>Groups</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Description</th>
                <th>Created By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group._id}>
                  <td>{group.name}</td>
                  <td>{group.subject}</td>
                  <td>{group.description || "No description provided"}</td>
                  <td>{group.createdBy?.fullName || "Unknown"}</td>
                  <td>{group.approved ? "Approved" : "Pending"}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleViewGroup(group)}>
                      View
                    </button>
                    {!group.approved && (
                      <button
                        className="btn btn-success"
                        onClick={() => handleApproveGroup(group._id)}
                      >
                        Approve
                      </button>
                    )}
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteGroup(group._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedGroup && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit Group Details</h3>
              <input
                type="text"
                placeholder="Group Name"
                value={editGroupData.name}
                onChange={(e) => setEditGroupData({ ...editGroupData, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Subject"
                value={editGroupData.subject}
                onChange={(e) => setEditGroupData({ ...editGroupData, subject: e.target.value })}
              />
              <textarea
                placeholder="Description"
                value={editGroupData.description}
                onChange={(e) =>
                  setEditGroupData({ ...editGroupData, description: e.target.value })
                }
              ></textarea>
              <button className="btn btn-success" onClick={handleEditGroup}>
                Save
              </button>

              <h4>Members</h4>
              <ul>
                {selectedGroup.members.map((member) => (
                  <li key={member.user._id}>
                    {member.user.fullName}
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveMember(member.user._id)}
                    >
                      Remove
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleBlockUser(selectedGroup._id, member.user._id)}
                    >
                      Block
                    </button>
                  </li>
                ))}
              </ul>

              <h4>Blocked Users</h4>
              <ul>
                {selectedGroup.blockedUsers.map((userId) => (
                  <li key={userId}>
                    {userId}
                    <button
                      className="btn btn-success"
                      onClick={() => handleUnblockUser(selectedGroup._id, userId)}
                    >
                      Unblock
                    </button>
                  </li>
                ))}
              </ul>

              <h4>Chat Messages</h4>
              <div className="chat-section">
                {groupMessages.map((msg) => (
                  <div key={msg._id} className="chat-message">
                    <strong>{msg.sender?.fullName}:</strong> {msg.message}
                  </div>
                ))}
              </div>

              <button
                className="btn btn-secondary"
                onClick={() => handleSetChatPermissions(selectedGroup._id, !chatPermissions)}
              >
                {chatPermissions ? "Disable Chat" : "Enable Chat"}
              </button>
              <button className="btn btn-danger" onClick={() => setSelectedGroup(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageGroups;
