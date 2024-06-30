import React from "react";

import skillShrimpy from "assets/sfts/skill_shrimpy.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const SkillShrimpy: React.FC = () => {
  return (
    <img
      src={skillShrimpy}
      style={{
        width: `${PIXEL_SCALE * 14}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 1}px`,
      }}
      className="absolute"
      alt="Skill Shrimpy"
    />
  );
};
