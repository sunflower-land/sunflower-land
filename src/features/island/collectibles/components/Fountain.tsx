import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
// import fountain from "assets/sfts/fountain.gif";
import { fountainAudio } from "lib/utils/sfx";
import fountain from "assets/events/christmas/sfts/fountain.png";
export const Fountain: React.FC = () => {
  return (
    <img
      style={{
        width: `${PIXEL_SCALE * 26}px`,
        bottom: `${PIXEL_SCALE * 1}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
      onClick={() => {
        if (!fountainAudio.playing()) {
          fountainAudio.play();
        }
      }}
      className="absolute"
      src={fountain}
      alt="Fountain"
    />
  );
};
