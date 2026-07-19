import React from "react";

/**
 * Full-screen backdrop for the standalone giveaway "areas" (creator + player
 * lobby), so each reads as a distinct place you travel to rather than a popup.
 */
export const GiveawayAreaBackground: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <div
    className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4"
    style={{ backgroundColor: "#63c74d" }}
  >
    <div className="w-full max-w-md my-auto">{children}</div>
  </div>
);
