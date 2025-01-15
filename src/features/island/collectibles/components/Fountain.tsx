import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import fountain from "assets/sfts/fountain.gif";
import { useSound } from "lib/utils/hooks/useSound";

export const Fountain: React.FC = () => {
  const { play: fountainAudio, isPlaying } = useSound("fountain");

  return (
    <div
      className="absolute w-full h-full hover:img-highlight cursor-pointer"
      onClick={() => {
        if (!isPlaying()) {
          fountainAudio();
        }
      }}
    >
      <img
        style={{
          width: `${PIXEL_SCALE * 26}px`,
          bottom: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 3}px`,
        }}
        onClick={() => {
          if (!isPlaying()) {
            fountainAudio();
          }
        }}
        className="absolute pointer-events-none"
        src={fountain}
        alt="Fountain"
      />
    </div>
  );
};
