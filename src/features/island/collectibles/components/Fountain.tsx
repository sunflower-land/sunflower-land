import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import fountain from "assets/nfts/fountain.gif";
import { fountainAudio } from "lib/utils/sfx";
export const Fountain: React.FC = () => {
  return (
    <img
      style={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      onClick={() => {
        //Checks if fountainAudio is playing, if false, plays the sound
        if (!fountainAudio.playing()) {
          fountainAudio.play();
        }
      }}
      className="absolute hover:img-highlight cursor-pointer"
      src={fountain}
      alt="Fountain"
    />
  );
};
