import React from "react";

import keyStaffCase from "assets/sfts/skeleton_key_staff_case.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const SkeletonKingStaff: React.FC = () => {
  return (
    <SFTDetailPopover name="Skeleton King Staff">
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
    </SFTDetailPopover>
  );
};
