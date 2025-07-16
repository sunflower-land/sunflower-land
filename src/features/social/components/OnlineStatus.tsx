import React from "react";

type OnlineStatusProps = {
  status: "online" | "offline";
  size?: number;
};

export const OnlineStatus: React.FC<OnlineStatusProps> = ({
  status,
  size = 10,
}) => {
  const color = status === "online" ? "#22c55e" : "#ef4444"; // Tailwind green-500/red-500
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
