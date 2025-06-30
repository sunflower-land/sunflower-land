import React from "react";

import tree from "assets/sfts/christmas_tree.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const ChristmasTree: React.FC = () => {
  return (
    <SFTDetailPopover name="Christmas Tree">
      <img
        src={tree}
        style={{
          width: `${PIXEL_SCALE * 23}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 4}px`,
        }}
        className="absolute"
        alt="Christmas Tree"
      />
    </SFTDetailPopover>
  );
};
