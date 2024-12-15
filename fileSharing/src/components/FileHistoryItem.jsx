import React, { useState } from "react";
import { format } from "date-fns";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Custom hook for authentication

function FileHistoryItem({ file, onExpiryDateUpdated }) {
  const { currentUser } = useAuth(); // Get the current user from context
  const [newExpiryDate, setNewExpiryDate] = useState(file.expiryDate);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Handle expiry date input change
  const handleExpiryDateChange = (e) => {
    setNewExpiryDate(e.target.value);
  };

  // Handle expiry date update submission
  const handleUpdateExpiry = async () => {
    setIsUpdating(true);
    setError(null);

    try {
      // Send PUT request to update expiry date
      await axios.put(
        `/api/files/${file.id}/update-expiry`,
        { expiryDate: newExpiryDate },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      // Notify parent (FileHistory) component that the expiry date was updated
      onExpiryDateUpdated(file.id, newExpiryDate);
      alert("Expiry date updated successfully.");
    } catch (err) {
      setError("Failed to update expiry date.");
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <tr>
      <td>{file.name}</td>
      <td>{format(new Date(file.sharedOn), "MMM dd, yyyy HH:mm")}</td>
      <td>{format(new Date(file.expiryDate), "MMM dd, yyyy HH:mm")}</td>
      <td>
        <input
          type="datetime-local"
          value={newExpiryDate}
          onChange={handleExpiryDateChange}
          disabled={isUpdating}
        />
        <button
          onClick={handleUpdateExpiry}
          disabled={isUpdating || newExpiryDate === file.expiryDate}
        >
          {isUpdating ? "Updating..." : "Update Expiry"}
        </button>
        {error && <p className="error-message">{error}</p>}
      </td>
    </tr>
  );
}

export default FileHistoryItem;
