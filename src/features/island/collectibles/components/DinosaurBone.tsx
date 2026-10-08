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
          }}
          className="absolute left-1/2 -translate-x-1/2"
          alt="Dinosaur Bone"
        />
      </>
    </SFTDetailPopover>
  );
};
