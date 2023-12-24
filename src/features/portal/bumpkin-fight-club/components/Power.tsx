import React from "react";

import { InnerPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

export const Power: React.FC<{ power: number }> = ({ power }) => {
  return (
    <InnerPanel
      className="fixed z-50 flex items-center p-1"
      style={{
        top: `${PIXEL_SCALE * 53}px`,
        left: `${PIXEL_SCALE * 5}px`,
      }}
    >
      <img
        src={SUNNYSIDE.icons.sword}
        style={{
          width: `${PIXEL_SCALE * 10}px`,
        }}
      />
      <span className="text-sm ml-1.5 mb-0.5">{power}</span>
    </InnerPanel>
  );
};
