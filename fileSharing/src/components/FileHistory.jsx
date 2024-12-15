import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { format, isBefore, parseISO } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import emptyStateImage from "../assets/empty-state.png";

function FileHistory() {
  const { currentUser, logout } = useAuth(); // Added logout function
  const [fileHistory, setFileHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  // Fetch file sharing history
  useEffect(() => {
    const fetchFileHistory = async () => {
      if (!currentUser?.token) {
        toast.error("Unauthorized access. Please log in again.");
        logout(); // Auto logout if no token
        return;
      }

      setLoading(true);
      setNetworkError(false);

      try {
        const response = await axios.get("/api/files/history", {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });

        if (!response.data || response.data.length === 0) {
          toast.info("No files found. Start sharing files now!");
        }

        setFileHistory(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          logout(); // Log out the user
        } else if (!err.response) {
          setNetworkError(true);
          toast.error("Network error! Please check your connection.");
        } else {
          toast.error("Failed to fetch file history. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFileHistory();
  }, [currentUser, logout]);

  // Validate and update expiry date
  const handleExpiryDateChange = async (fileId, newExpiryDate) => {
    const parsedExpiryDate = parseISO(newExpiryDate);
    const currentDate = new Date();

    if (isBefore(parsedExpiryDate, currentDate)) {
      toast.warn("Invalid expiry date. Please choose a future date.");
      return;
    }

    try {
      await axios.put(
        `/api/files/${fileId}/update-expiry`,
        { expiryDate: newExpiryDate },
        {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );

      setFileHistory((prevHistory) =>
        prevHistory.map((file) =>
          file.id === fileId ? { ...file, expiryDate: newExpiryDate } : file
        )
      );
      toast.success("Expiry date updated successfully!");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
      } else {
        toast.error("Failed to update expiry date. Please try again.");
      }
    }
  };

  return (
    <div className="file-history-container">
      <h2>File Sharing History</h2>

      {/* Network Error Message */}
      {networkError && (
        <div className="network-error">
          <p>Network error detected. Please check your connection and try again.</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && fileHistory.length === 0 && !networkError && (
        <div className="empty-state">
          <img src={emptyStateImage} alt="No files" className="empty-state-image" />
          <p>No files shared yet.</p>
          <p>Start sharing files now to see them here!</p>
        </div>
      )}

      {/* File History Table */}
      {!loading && fileHistory.length > 0 && (
        <table className="file-history-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Shared On</th>
              <th>Expiry Date</th>
              <th>Update Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {fileHistory.map((file) =>
              file?.id && file?.name && file?.expiryDate && file?.sharedOn ? (
                <tr key={file.id}>
                  <td>{file.name}</td>
                  <td>{format(new Date(file.sharedOn), "MMM dd, yyyy HH:mm")}</td>
                  <td>{format(new Date(file.expiryDate), "MMM dd, yyyy HH:mm")}</td>
                  <td>
                    <input
                      type="datetime-local"
                      value={format(new Date(file.expiryDate), "yyyy-MM-dd'T'HH:mm")}
                      onChange={(e) => handleExpiryDateChange(file.id, e.target.value)}
                    />
                  </td>
                </tr>
              ) : (
                <tr key={file.id || Math.random()}>
                  <td colSpan="4" className="invalid-file">
                    Invalid file data. Please contact support.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FileHistory;
