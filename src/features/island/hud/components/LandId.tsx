import { InnerPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import React from "react";

export const LandId: React.FC<{ landId: number }> = ({ landId }) => (
  <InnerPanel
    className="fixed z-50 py-1 px-2"
    style={{
      bottom: `${PIXEL_SCALE * 3}px`,
      left: `${PIXEL_SCALE * 3}px`,
    }}
  >
    <p className="text-white mb-1 text-sm">{`Land #${landId}`}</p>
  </InnerPanel>
);
