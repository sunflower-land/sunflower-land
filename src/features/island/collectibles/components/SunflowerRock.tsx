import React from "react";

import sunflowerRock from "assets/sfts/sunflower_rock.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const SunflowerRock: React.FC = () => {
  return (
    <SFTDetailPopover name="Sunflower Rock">
      <img
        src={sunflowerRock}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 76}px`,
          left: `${PIXEL_SCALE * 2}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        alt="Sunflower Rock"
      />
    </SFTDetailPopover>
  );
};
