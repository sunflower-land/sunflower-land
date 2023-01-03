import React from "react";

import apple from "assets/resources/apple.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const AnimationExample: React.FC = () => {
  return (
    <>
      {/* <svg
        viewBox="0 0 640 640"
        height={640}
        width={640}
        className="absolute overflow-visible"
      >
        <path
          d="M -35.6605 -2.48423 C -11.685469999999999 -24.46134 7.627740000000003 9.836269999999999 7.627740000000003 9.836269999999999 C 7.627740000000003 9.836269999999999 19.217380000000002 -4.14916 28.272900000000003 9.836269999999999 C 32.77078 6.541929999999999 34.50938000000001 7.820059999999999 35.660500000000006 9.836269999999999"
          style={{
            fill: "none",
            stroke: "red",
            strokeWidth: 3,
            overflow: "visible",
          }}
        />
      </svg> */}
      <img
        src={apple}
        className="drop img-highlight-heavy"
        style={{ zIndex: 999999, width: `${PIXEL_SCALE * 12}px` }}
      />
    </>
  );
};
