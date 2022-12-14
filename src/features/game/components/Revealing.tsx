import React from "react";

import digging from "assets/npcs/goblin_treasure.gif";
import { PIXEL_SCALE } from "../lib/constants";

export const Revealing: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-center">What could it be?</span>
      <img
        src={digging}
        alt="digging"
        className="my-2"
        style={{
          width: `${PIXEL_SCALE * 33}px`,
        }}
      />
    </div>
  );
};
