import axios from 'axios';

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
        return response.data; // Return success data
      } catch (error) {
        attempt++;
        console.error(`Attempt ${attempt} - Failed to send notification to ${userId}:`, error.message);

        if (attempt >= retries) {
          // Max retries reached
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
      return; // Exit if no files exist
    }

    const currentDate = new Date();

    for (const file of files) {
      if (!file.expiryDate || !file.name) {
        console.warn(`Skipping invalid file for user ${userId}:`, file);
        continue; // Skip invalid file data
      }

      const expiryDate = new Date(file.expiryDate);
      const timeRemaining = expiryDate - currentDate;

      // Notify if the file will expire in 24 hours
      if (timeRemaining <= 86400000 && timeRemaining > 0) {
        const message = `Your file "${file.name}" is about to expire in 24 hours. Please take necessary action.`;
        try {
          await this.sendNotification(userId, message);
        } catch (err) {
          console.error(`Failed to notify user ${userId} about file "${file.name}":`, err.message);
        }
      }
    }
  }

  /**
   * Notify all users about their files nearing expiry
   * This can be triggered periodically (e.g., using cron jobs)
   */
  static async notifyUsersOfExpiringFiles() {
    try {
      // Fetch all users
      const usersResponse = await axios.get('/api/users');
      const users = usersResponse.data;

      if (!users || users.length === 0) {
        console.log("No users found for notification.");
        return; // Exit if no users exist
      }

      // Iterate through each user to check file expiry
      for (const user of users) {
        try {
          const filesResponse = await axios.get(`/api/files/user/${user.id}`);
          const files = filesResponse.data;

          await this.checkFileExpiryAndNotify(user.id, files);
        } catch (error) {
          console.error(`Failed to fetch files for user ${user.id}:`, error.message);
        }
      }
    } catch (error) {
      console.error("Error in checking file expiry and notifying users:", error.message);

      if (error.response) {
        console.error(`Server error (${error.response.status}): ${error.response.data.message}`);
      } else if (error.request) {
        console.error("No response from server. Network issue or server is down.");
      } else {
        console.error("Unexpected error:", error.message);
      }
    }
  }
}

export default NotificationService;
