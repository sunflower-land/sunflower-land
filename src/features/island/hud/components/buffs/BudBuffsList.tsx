import bud from "assets/animals/plaza_bud.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
import React from "react";

export const BudBuffsList: React.FC = () => {
  return (
    <div className="flex flex-col justify-evenly items-center p-2 h-80">
      <div className="text-xs text-center">
        <img
          src={bud}
          alt="No Buffs"
          style={{
            width: `${PIXEL_SCALE * 12}px`,
          }}
        />
        Soon!
      </div>
    </div>
  );
};
