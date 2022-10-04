import React from "react";

import chat from "assets/icons/heart.png";
import resale from "assets/buildings/resale.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Action } from "components/ui/Action";

export const Resale: React.FC = () => {
  return (
    <div
      className="z-10 absolute"
      style={{
        width: `${GRID_WIDTH_PX * 5.5}px`,
        left: `${GRID_WIDTH_PX * 21.5}px`,
        top: `${GRID_WIDTH_PX * 27.2}px`,
      }}
    >
      <img
        src={resale}
        style={{
          width: `${PIXEL_SCALE * 53}px`,
        }}
      />
      <Action
        className="absolute -bottom-[20px] left-[13px]"
        text="Resale"
        icon={chat}
        onClick={console.log}
      />
    </div>
  );
};
