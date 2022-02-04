import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import sharkLeftToRight from "assets/animals/shark_ltr.gif";
import sharkRightToLeft from "assets/animals/shark_rtl.gif";

interface Props {}

export const SharkLTR: React.FC<Props> = () => {
  return (
    <>
        <img
          src={sharkLeftToRight}
          className="absolute "
          style={{
            width: `${GRID_WIDTH_PX * 10}px`,
            right: `${GRID_WIDTH_PX * 2}px`,
            top: `${GRID_WIDTH_PX * 2}px`,
          }}
        />
    </>
  );
};

export const SharkRTL: React.FC<Props> = () => {
  return (
    <>
        <img
          src={sharkRightToLeft}
          className="absolute "
          style={{
            width: `${GRID_WIDTH_PX * 10}px`,
            right: `${GRID_WIDTH_PX * 0}px`,
            top: `${GRID_WIDTH_PX * 5}px`,
          }}
        />
    </>
  );
};


