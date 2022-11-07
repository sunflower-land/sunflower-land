import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import fountain from "assets/sfts/fountain.gif";
import { fountainAudio } from "lib/utils/sfx";

export const Fountain: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 26}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        right: `${PIXEL_SCALE * 1}px`,
      }}
    >
      <img
        style={{
          width: `${PIXEL_SCALE * 26}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          right: `${PIXEL_SCALE * 1}px`,
        }}
        onClick={() => {
          if (!fountainAudio.playing()) {
            fountainAudio.play();
          }
        }}
        className="absolute hover:img-highlight cursor-pointer"
        src={fountain}
        alt="Fountain"
      />
    </div>
  );
};
