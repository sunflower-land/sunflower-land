import React from "react";
import { useSocial } from "../hooks/useSocial";

type OnlineStatusProps = {
  farmId: number;
  playerId: number;
  lastUpdatedAt: number;
  size?: number;
};

export const OnlineStatus: React.FC<OnlineStatusProps> = ({
  farmId,
  playerId,
  lastUpdatedAt,
  size = 12,
}) => {
  const { online } = useSocial({
    farmId,
  });

  const lastOnlineAt = online[playerId] ?? lastUpdatedAt ?? 0;
  const isOnline = lastOnlineAt > Date.now() - 30 * 60 * 1000;

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
      title={status}
    />
  );
};
