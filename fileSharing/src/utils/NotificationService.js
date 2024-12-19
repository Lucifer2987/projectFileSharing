import axios from 'axios';
import { toast } from 'react-toastify';

class NotificationService {
  /**
   * Send a notification to a specific user
   * @param {string} userId - The ID of the user to notify
   * @param {string} message - The notification message
   * @param {number} retries - Number of retry attempts (default is 3)
   */
  static async sendNotification(userId, message, retries = 3) {
    let attempt = 0;

    while (attempt < retries) {
      try {
        const response = await axios.post('/api/notifications/send', { userId, message });
        console.log(`Notification sent to user ${userId}:`, message);
        // Show toast notification
        toast.info(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        return response.data;
      } catch (error) {
        attempt++;
        console.error(`Attempt ${attempt} - Failed to send notification to ${userId}:`, error.message);

        if (attempt >= retries) {
          console.error("Notification failed after retries:", error);
          throw new Error("Failed to send notification after multiple attempts.");
        }

        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  /**
   * Check for files nearing expiry (24 hours) and send notifications to the user
   * @param {string} userId - The ID of the user
   * @param {Array} files - List of files to check for expiry
   */
  static async checkFileExpiryAndNotify(userId, files) {
    if (!files || files.length === 0) {
      console.log(`No files to check for user ${userId}.`);
      return;
    }

    const currentDate = new Date();
    const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    for (const file of files) {
      if (!file.expiryDate || !file.fileName) {
        console.warn(`Skipping invalid file for user ${userId}:`, file);
        continue;
      }

      const expiryDate = new Date(file.expiryDate);
      const timeRemaining = expiryDate.getTime() - currentDate.getTime();

      // Notify if the file will expire in 24 hours
      if (timeRemaining <= oneDayInMs && timeRemaining > 0) {
        const message = `Your file "${file.fileName}" will expire in ${Math.ceil(timeRemaining / (1000 * 60 * 60))} hours. Please take necessary action.`;
        try {
          await this.sendNotification(userId, message);
        } catch (err) {
          console.error(`Failed to notify user ${userId} about file "${file.fileName}":`, err.message);
        }
      }
      // Notify if the file has expired
      else if (timeRemaining <= 0) {
        const message = `Your file "${file.fileName}" has expired and will be deleted soon.`;
        try {
          await this.sendNotification(userId, message);
        } catch (err) {
          console.error(`Failed to notify user ${userId} about expired file "${file.fileName}":`, err.message);
        }
      }
    }
  }

  /**
   * Notify all users about their files nearing expiry
   * This should be triggered periodically (e.g., using cron jobs)
   */
  static async notifyUsersOfExpiringFiles() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      // Fetch all users' files
      const response = await axios.get('/api/files/expiring', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const expiringFiles = response.data;
      if (!expiringFiles || expiringFiles.length === 0) {
        console.log("No expiring files found.");
        return;
      }

      // Group files by user
      const filesByUser = expiringFiles.reduce((acc, file) => {
        if (!acc[file.userId]) {
          acc[file.userId] = [];
        }
        acc[file.userId].push(file);
        return acc;
      }, {});

      // Send notifications for each user's files
      for (const [userId, files] of Object.entries(filesByUser)) {
        await this.checkFileExpiryAndNotify(userId, files);
      }
    } catch (error) {
      console.error("Error in checking file expiry and notifying users:", error);
      if (error.response) {
        console.error(`Server error (${error.response.status}):`, error.response.data);
      } else if (error.request) {
        console.error("No response from server. Network issue or server is down.");
      } else {
        console.error("Unexpected error:", error.message);
      }
    }
  }

  /**
   * Start periodic check for expiring files
   * @param {number} intervalMinutes - How often to check for expiring files (in minutes)
   */
  static startExpiryCheck(intervalMinutes = 60) {
    // Initial check
    this.notifyUsersOfExpiringFiles();

    // Set up periodic checks
    setInterval(() => {
      this.notifyUsersOfExpiringFiles();
    }, intervalMinutes * 60 * 1000);
  }
}

export default NotificationService;
