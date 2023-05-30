import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelSpeechBubbleBorderStyle } from "features/game/lib/style";

import speechBubbleBottom from "assets/ui/speech_bubble_bottom.webp";

interface Props {
  text: string;
}

export const SpeechBubble: React.FC<Props> = ({ text }) => {
  return (
    <div
      className="relative flex items-center justify-start max-w-[100px]"
      style={{ ...pixelSpeechBubbleBorderStyle }}
    >
      <span className="text-xxs font-speech text-shadow-none text-black">
        {text}
      </span>
      <img
        src={speechBubbleBottom}
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
