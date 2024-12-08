import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import {
  getAllResources,
  uploadFileToDrive,
  listFilesInDrive,
  setResourcePermissions,
} from "../services/api";

const ManageResources = ({ navigateTo }) => {
  const [resources, setResources] = useState([]);
  const [driveFiles, setDriveFiles] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [permissions, setPermissions] = useState({ view: [], edit: [] });
  const [uploadData, setUploadData] = useState({
    filePath: "",
    fileName: "",
    folderId: "",
    personalEmail: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const resourceResponse = await getAllResources();
        setResources(resourceResponse);

        const driveResponse = await listFilesInDrive({});
        setDriveFiles(driveResponse.files);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch resources or drive files:", err);
        setMessage("Failed to load resources.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUploadToDrive = async () => {
    try {
      await uploadFileToDrive(uploadData);
      setMessage("File uploaded to Google Drive successfully!");

      const driveResponse = await listFilesInDrive({});
      setDriveFiles(driveResponse.files);
    } catch (err) {
      console.error("Failed to upload file:", err);
      setMessage("Failed to upload file to Google Drive.");
    }
  };

  const handleViewResource = (resource) => {
    setSelectedResource(resource);
    if (resource.permissions) {
      setPermissions({
        view: resource.permissions.view || [],
        edit: resource.permissions.edit || [],
      });
    } else {
      setPermissions({ view: [], edit: [] });
    }
  };

  const handleSetPermissions = async () => {
    try {
      await setResourcePermissions(selectedResource._id, permissions);
      setMessage("Permissions updated successfully!");
  
      // Refresh resources
      const resourceResponse = await getAllResources();
      setResources(resourceResponse);
  
      setSelectedResource(null); // Close the modal
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update permissions.";
      console.error("Failed to set permissions:", errorMsg);
      setMessage(errorMsg);
    }
  };
  

  if (loading) return <p>Loading resources...</p>;

  return (
    <div className="admin-dashboard">
      <AdminSidebar navigateTo={navigateTo} />
      <div className="dashboard-content">
        <h1>Manage Resources</h1>
        {message && <p>{message}</p>}

        <div className="resource-section">
          <h2>Resources</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource._id}>
                  <td>{resource.title}</td>
                  <td>{resource.resourceType}</td>
                  <td>{resource.tags?.join(", ")}</td>
                  <td>
                    <button
                      onClick={() => handleViewResource(resource)}
                      className="btn btn-primary"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="drive-section">
          <h2>Google Drive Files</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {driveFiles.map((file) => (
                <tr key={file.id}>
                  <td>{file.name}</td>
                  <td>
                    <a
                      href={file.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="upload-section">
          <h2>
            Upload to Google Drive
            <button
              className="btn btn-primary upload-icon"
              onClick={handleUploadToDrive}
            >
              <i className="fas fa-upload"></i>
            </button>
          </h2>
          <div className="form">
            <label>
              File Path:
              <input
                type="text"
                value={uploadData.filePath}
                onChange={(e) =>
                  setUploadData({ ...uploadData, filePath: e.target.value })
                }
              />
            </label>
            <label>
              File Name:
              <input
                type="text"
                value={uploadData.fileName}
                onChange={(e) =>
                  setUploadData({ ...uploadData, fileName: e.target.value })
                }
              />
            </label>
            <label>
              Folder ID:
              <input
                type="text"
                value={uploadData.folderId}
                onChange={(e) =>
                  setUploadData({ ...uploadData, folderId: e.target.value })
                }
              />
            </label>
            <label>
              Personal Email:
              <input
                type="email"
                value={uploadData.personalEmail}
                onChange={(e) =>
                  setUploadData({
                    ...uploadData,
                    personalEmail: e.target.value,
                  })
                }
              />
            </label>
          </div>
        </div>

        {selectedResource && (
          <div className="modal">
            <div className="modal-content">
              <h3>Resource Details</h3>
              <p>
                <strong>Title:</strong> {selectedResource.title}
              </p>
              <p>
                <strong>Type:</strong> {selectedResource.resourceType}
              </p>
              <p>
                <strong>URL:</strong>{" "}
                <a
                  href={selectedResource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedResource.url}
                </a>
              </p>
              <p>
                <strong>Tags:</strong> {selectedResource.tags?.join(", ")}
              </p>
              <p>
                <strong>Uploaded By:</strong>{" "}
                {selectedResource.uploadedBy?.fullName || "Unknown"}
              </p>
              <h4>Permissions</h4>
              <label>
                View:
                <input
                  type="text"
                  value={permissions.view.join(", ")}
                  onChange={(e) =>
                    setPermissions({
                      ...permissions,
                      view: e.target.value.split(",").map((role) => role.trim()),
                    })
                  }
                />
              </label>
              <label>
                Edit:
                <input
                  type="text"
                  value={permissions.edit.join(", ")}
                  onChange={(e) =>
                    setPermissions({
                      ...permissions,
                      edit: e.target.value.split(",").map((role) => role.trim()),
                    })
                  }
                />
              </label>

              <div className="modal-buttons">
                <button onClick={handleSetPermissions} className="btn btn-success">
                  Save Permissions
                </button>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="btn btn-danger"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageResources;
