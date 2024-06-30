import React, { useEffect } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import fountain from "assets/sfts/fountain.gif";
import { fountainAudio, loadAudio } from "lib/utils/sfx";

export const Fountain: React.FC = () => {
  useEffect(() => {
    loadAudio([fountainAudio]);
  }, []);

  return (
    <div
      className="absolute w-full h-full hover:img-highlight cursor-pointer"
      onClick={() => {
        if (!fountainAudio.playing()) {
          fountainAudio.play();
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
          if (!fountainAudio.playing()) {
            fountainAudio.play();
          }
        }}
        className="absolute pointer-events-none"
        src={fountain}
        alt="Fountain"
      />
    </div>
  );
};
