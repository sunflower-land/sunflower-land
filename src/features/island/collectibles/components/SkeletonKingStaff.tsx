import React from "react";

import keyStaffCase from "assets/sfts/skeleton_key_staff_case.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const SkeletonKingStaff: React.FC = () => {
  return (
    <>
      <img
        src={keyStaffCase}
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
        className="absolute"
        alt="Skeleton Key Staff"
      />
    </>
  );
};
