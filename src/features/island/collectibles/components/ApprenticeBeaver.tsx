import React from "react";

import apprenticeBeaver from "assets/nfts/apprentice_beaver.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const ApprenticeBeaver: React.FC = () => {
  return (
    <img
      src={apprenticeBeaver}
      style={{
        width: `${PIXEL_SCALE * 15}px`,
      }}
      alt="Apprentice Beaver"
    />
  );
};
