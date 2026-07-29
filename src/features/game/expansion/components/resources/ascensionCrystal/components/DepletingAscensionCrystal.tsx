import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";

interface Props {
  resourceAmount?: number;
}

// No break/drop spritesheet exists for the crystal (single static sprite), so
// depleting only shows the collected shard amount floating above the node.
const DepletingAscensionCrystalComponent: React.FC<Props> = ({
  resourceAmount,
}) => {
  return (
    <div className="absolute w-full h-full pointer-events-none">
      {/* Collected resource amount */}
      {!!resourceAmount && (
        <div
          className="flex justify-center absolute w-full z-40"
          style={{
            width: `${PIXEL_SCALE * 48}px`,
            left: `${PIXEL_SCALE * -8}px`,
            top: `${PIXEL_SCALE * -12}px`,
          }}
        >
          <img
            src={ITEM_DETAILS["Ascension Shard"].image}
            className="mr-2 img-highlight-heavy"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
            }}
          />
          <span className="yield-text text-white font-pixel">{`+${resourceAmount}`}</span>
        </div>
      )}
    </div>
  );
};

export const DepletingAscensionCrystal = React.memo(
  DepletingAscensionCrystalComponent,
);
