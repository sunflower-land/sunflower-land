import React from "react";

import border from "assets/ui/panel/green_border.png";

export const SkillPointsLabel = ({ points }: { points: number }) => (
  <div
    className="bg-green-background text-white text-shadow text-xs object-contain justify-center items-center whitespace-nowrap mb-1 max-w-min px-1"
    // Custom styles to get pixelated border effect
    style={{
      // border: "5px solid transparent",
      borderStyle: "solid",
      borderWidth: "5px",
      borderImage: `url(${border}) 30 stretch`,
      borderImageSlice: "25%",
      imageRendering: "pixelated",
      borderImageRepeat: "repeat",
      borderRadius: "15px",
    }}
  >
    <p className="text-[10px]">{`Skill Points: ${points}`}</p>
  </div>
);
