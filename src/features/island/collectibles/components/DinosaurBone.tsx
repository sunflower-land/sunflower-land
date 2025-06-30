import React from "react";

import dinoBoneCase from "assets/sfts/dinosaur_bone_case.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const DinosaurBone: React.FC = () => {
  return (
    <SFTDetailPopover name="Dinosaur Bone">
      <>
        <img
          src={dinoBoneCase}
          style={{
            width: `${PIXEL_SCALE * 22}px`,
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
          className="absolute"
          alt="Dinosaur Bone"
        />
      </>
    </SFTDetailPopover>
  );
};
