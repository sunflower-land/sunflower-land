import React, { createContext, useContext } from "react";
import type { AnchorRegistry } from "../bridge/anchors";
import { useWorldAnchor } from "../bridge/useWorldAnchor";

/**
 * The DOM layer above the canvas where in-world micro-UI lives — popovers,
 * progress bars, floating text. Everything inside is React, positioned by
 * world anchors the Phaser side registers, so the existing component library
 * (TimerPopover, ProgressBar, Panel) renders pixel-identical over the canvas.
 *
 * The layer itself is pointer-transparent; anchored children opt back in with
 * pointer-events-auto only when they're genuinely interactive.
 */

const AnchorContext = createContext<AnchorRegistry | undefined>(undefined);

export const useAnchorRegistry = (): AnchorRegistry => {
  const registry = useContext(AnchorContext);
  if (!registry) {
    throw new Error("useAnchorRegistry must be used inside FarmOverlay");
  }
  return registry;
};

export const FarmOverlay: React.FC<
  React.PropsWithChildren<{ registry: AnchorRegistry }>
> = ({ registry, children }) => (
  <AnchorContext.Provider value={registry}>
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {children}
    </div>
  </AnchorContext.Provider>
);

/**
 * Positions its children over the world anchor with the given id. Renders
 * nothing while the anchor is missing or off-screen. Children fill the
 * anchor's screen box; centre or offset within it via normal CSS.
 */
export const WorldAnchored: React.FC<
  React.PropsWithChildren<{ anchorId: string; className?: string }>
> = ({ anchorId, className, children }) => {
  const rect = useWorldAnchor(anchorId);

  if (!rect || !rect.visible) return null;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      }}
    >
      {children}
    </div>
  );
};
