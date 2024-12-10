import React from "react";
import { createPortal } from "react-dom";

interface Props {
  className?: string | undefined;
}

/**
 * Heads up display container which portals all Hud Components out to the body and applies safe area styling - should be used for all game Hud components
 */
export const HudContainer: React.FC<Props> = ({ children, className }) => {
  return (
    <>
      {createPortal(
        <div
          data-html2canvas-ignore="true"
          aria-label="Hud"
          className={`fixed inset-safe-area pointer-events-none ${className ?? "z-10"}`}
        >
          <div // Prevent click through to Phaser
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            className="pointer-events-auto"
          >
            {children}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
};
