import React from "react";

import heartOfDavyJones from "src/assets/sfts/treasure/heart_of_davy_jones.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const HeartOfDavyJones: React.FC = () => {
  return (
    <>
      <img
        src={heartOfDavyJones}
        style={{
          width: `${PIXEL_SCALE * 13}px`,
          bottom: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 1}px`,
        }}
        className="absolute"
        alt="Heart Of Davy Jones"
      />
    </>
  );
};
