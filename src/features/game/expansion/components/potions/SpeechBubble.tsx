import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelSpeechBubbleBorderStyle } from "features/game/lib/style";

import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  text: string;
  className?: string;
}

export const SpeechBubble: React.FC<Props> = ({ text, className }) => {
  return (
    <div
      className={`relative flex items-center ${className}`}
      style={{ ...pixelSpeechBubbleBorderStyle }}
    >
      <span className="text-xs  text-shadow-none">{text}</span>
      <img
        src={SUNNYSIDE.ui.speechBubbleBottom}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 4}px`,
          bottom: `-${PIXEL_SCALE * 4.5}px`,
          left: `${PIXEL_SCALE * 8}px`,
        }}
      />
    </div>
  );
};
