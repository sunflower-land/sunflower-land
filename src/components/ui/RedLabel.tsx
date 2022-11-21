import React from "react";

export const RedLabel: React.FC = ({ children }) => {
  return (
    <span
      className="bg-error border text-xs p-1 rounded-md"
      style={{ lineHeight: "8px", height: "20px" }}
    >
      {children}
    </span>
  );
};
