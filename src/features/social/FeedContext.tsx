import React, { createContext, useContext, useState } from "react";
import {
  getLastAcknowledgedTimestamp,
  setLastAcknowledgedTimestamp,
} from "./lib/lastAcknowledged";

interface FeedContextType {
  unreadCount: number;
  lastAcknowledged: number | null;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  clearUnread: (newUnreadCount: number) => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastAcknowledged, setLastAcknowledged] = useState(
    getLastAcknowledgedTimestamp(),
  );

  const incrementUnread = () => {
    setUnreadCount((prev) => prev + 1);
  };

  const clearUnread = (newUnreadCount: number) => {
    const lastAcknowledged = Date.now();
    setLastAcknowledged(lastAcknowledged);
    // Local storage
    setLastAcknowledgedTimestamp(lastAcknowledged);
    setUnreadCount(newUnreadCount);
  };

  return (
    <FeedContext.Provider
      value={{
        unreadCount,
        setUnreadCount,
        incrementUnread,
        clearUnread,
        lastAcknowledged,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => {
  const context = useContext(FeedContext);

  if (!context) {
    throw new Error("useFeed must be used within a FeedProvider");
  }

  return context;
};
