import { useNow } from "lib/utils/hooks/useNow";
import React from "react";

type OnlineStatusProps = {
  lastUpdatedAt: number;
  size?: number;
};

export const OnlineStatus: React.FC<OnlineStatusProps> = ({
  lastUpdatedAt,
  size = 12,
}) => {
  const now = useNow({ live: true });
  const lastOnlineAt = lastUpdatedAt ?? 0;
  const isOnline = lastOnlineAt > now - 30 * 60 * 1000;

  const color = isOnline ? "#22c55e" : "#ef4444"; // Tailwind green-500/red-500
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
        border: "1px solid #000",
        boxShadow: "0 0 2px rgba(0,0,0,0.15)",
      }}
    />
  );
};
