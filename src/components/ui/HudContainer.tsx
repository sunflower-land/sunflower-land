import React from "react";
import { createPortal } from "react-dom";

/**
 * Heads up display container which portals all Hud Components out to the body and applies safe area styling - should be used for all game Hud components
 */
export const HudContainer: React.FC = ({ children }) => {
  return (
    <>
      {createPortal(
        <div
          data-html2canvas-ignore="true"
          aria-label="Hud"
          className="fixed inset-safe-area pointer-events-none z-10"
        >
          <div className="pointer-events-auto">{children}</div>
        </div>,
        document.body,
      )}
    </>
  );
};
