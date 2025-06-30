import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/sfts/trainee_target.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const TraineeTarget: React.FC = () => {
  return (
    <SFTDetailPopover name="Trainee Target">
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        alt="TraineeTarget"
        className="absolute"
      />
    </SFTDetailPopover>
  );
};
