import React, { useContext, useEffect, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import { isAsciiText } from "lib/utils/textSupport";

interface Props {
  text: string;
  /**
   * Set when a parent mirrors the NPC with `scaleX(-1)` (as Pumpkin Pete's
   * raft does): the bubble's text flips back so it still reads left to right.
   */
  mirrored?: boolean;
  /** Where the bubble sits over the NPC. */
  style?: React.CSSProperties;
}

/**
 * A short floating hint over an NPC's head, as Pumpkin Pete gives on the
 * farm: shows "..." for a second whenever the text changes, then the text.
 */
export const NPCSpeechBubble: React.FC<Props> = ({ text, mirrored, style }) => {
  const { showAnimations } = useContext(Context);
  // The text the bubble has finished "typing"; any other text shows "...".
  const [typedText, setTypedText] = useState<string>();
  const typing = typedText !== text;

  useEffect(() => {
    const timeout = setTimeout(() => setTypedText(text), 1000);

    return () => clearTimeout(timeout);
  }, [text]);

  // "Teeny" is a pixel font with printable-ASCII-only glyphs; scripts it
  // can't render (Cyrillic, CJK, etc.) fall back to the player's regular UI
  // font instead. That font runs wider than Teeny, so the layout below
  // (word spacing, offsets, min width) is tuned separately per case.
  const isTeenySupported = isAsciiText(text);

  return (
    <div
      className={
        "absolute uppercase" + (showAnimations ? " animate-float" : "")
      }
      style={{
        fontFamily: isTeenySupported ? "Teeny" : "var(--font-family)",
        color: "black",
        textShadow: "none",

        borderImage: `url(${SUNNYSIDE.ui.speechBorder})`,
        borderStyle: "solid",
        borderTopWidth: `${PIXEL_SCALE * 2}px`,
        borderRightWidth: `${PIXEL_SCALE * 2}px`,
        borderBottomWidth: `${PIXEL_SCALE * 4}px`,
        borderLeftWidth: `${PIXEL_SCALE * 5}px`,

        borderImageSlice: "2 2 4 5 fill",
        imageRendering: "pixelated",
        borderImageRepeat: "stretch",
        fontSize: isTeenySupported ? "8px" : "var(--text-xxxs-size)",
        ...style,
      }}
    >
      <div
        style={{
          transform: mirrored ? "scaleX(-1)" : undefined,
          height: "12px",
          minWidth: "30px",
        }}
      >
        <span
          className={typing ? undefined : "whitespace-nowrap"}
          style={
            isTeenySupported
              ? {
                  fontSize: "10px",
                  position: "relative",
                  bottom: "4px",
                  left: "4px",
                  wordSpacing: "-4px",
                  color: "#262b45",
                }
              : {
                  fontSize: "var(--text-xxxs-size)",
                  lineHeight: "var(--text-xxxs-line-height)",
                  position: "relative",
                  bottom: "2px",
                  color: "#262b45",
                }
          }
        >
          {typing ? "..." : text}
        </span>
      </div>
    </div>
  );
};
