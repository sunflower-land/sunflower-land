import React from "react";

/**
 * The mobile left/right controls for Egg Catch. Holding a button reports the
 * direction (-1 / 1) via `onMove`; releasing / leaving reports 0. Desktop
 * players can use the arrow keys or A/D instead — handled inside the scene.
 */
export const EggButtons: React.FC<{ onMove: (dir: number) => void }> = ({
  onMove,
}) => {
  const hold = (dir: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    onMove(dir);
  };
  const release = () => onMove(0);

  return (
    <div className="absolute bottom-4 inset-x-4 z-20 flex justify-between pointer-events-none">
      {[
        { dir: -1, glyph: "◀" },
        { dir: 1, glyph: "▶" },
      ].map(({ dir, glyph }) => (
        <button
          key={dir}
          onPointerDown={hold(dir)}
          onPointerUp={release}
          onPointerLeave={release}
          onPointerCancel={release}
          className="pointer-events-auto rounded-lg flex items-center justify-center active:scale-95 transition-transform"
          style={{
            width: "72px",
            height: "72px",
            background: "rgba(0,0,0,0.45)",
            border: "3px solid rgba(255,255,255,0.85)",
            touchAction: "none",
          }}
        >
          <span
            className="select-none"
            style={{
              fontSize: "32px",
              lineHeight: 1,
              color: "#ffffff",
              textShadow: "2px 2px 0 rgba(0,0,0,0.6)",
            }}
          >
            {glyph}
          </span>
        </button>
      ))}
    </div>
  );
};
