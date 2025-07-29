/* eslint-disable no-console */
const LAST_ACKNOWLEDGED_KEY = "lastAcknowledgedInteractionTimestamp";

/**
 * Get the timestamp of the most recent message that was read/seen
 * @returns The timestamp as a number, or null if no timestamp is stored
 */
export const getLastAcknowledgedTimestamp = (): number | null => {
  try {
    const stored = localStorage.getItem(LAST_ACKNOWLEDGED_KEY);
    if (!stored) return null;

    const timestamp = parseInt(stored, 10);
    return isNaN(timestamp) ? null : timestamp;
  } catch (error) {
    console.error(
      "Error reading last acknowledged timestamp from localStorage:",
      error,
    );
    return null;
  }
};

/**
 * Set the timestamp of the most recent message that was read/seen
 * @param timestamp - The timestamp to store (in milliseconds since epoch)
 */
export const setLastAcknowledgedTimestamp = (timestamp: number): void => {
  try {
    localStorage.setItem(LAST_ACKNOWLEDGED_KEY, timestamp.toString());
  } catch (error) {
    console.error(
      "Error writing last acknowledged timestamp to localStorage:",
      error,
    );
  }
};

/**
 * Clear the stored last acknowledged timestamp
 */
export const clearLastAcknowledgedTimestamp = (): void => {
  try {
    localStorage.removeItem(LAST_ACKNOWLEDGED_KEY);
  } catch (error) {
    console.error(
      "Error clearing last acknowledged timestamp from localStorage:",
      error,
    );
  }
};

/**
 * Check if there are unread messages by comparing with a given timestamp
 * @param latestMessageTimestamp - The timestamp of the latest message
 * @returns true if there are unread messages, false otherwise
 */
export const hasUnreadMessages = (latestMessageTimestamp: number): boolean => {
  const lastAcknowledged = getLastAcknowledgedTimestamp();
  if (lastAcknowledged === null) return true;

  return latestMessageTimestamp > lastAcknowledged;
};
