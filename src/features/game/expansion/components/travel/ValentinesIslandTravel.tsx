import React, { useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import boat from "assets/npcs/island_boat_pirate.png";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Bumpkin, Inventory } from "features/game/types/game";
import { IslandTravelModal } from "./IslandTravelModal";

interface Props {
  bumpkin: Bumpkin | undefined;
  inventory?: Inventory;
  isVisiting?: boolean;
  isTravelAllowed?: boolean;
  onTravelDialogOpened?: () => void;
  x: number;
  y: number;
  customBoat?: string | undefined;
  customWidth?: number;
}

export const ValentinesIslandTravel = ({
  bumpkin,
  inventory,
  x,
  y,
  isVisiting = false,
  isTravelAllowed = true,
  onTravelDialogOpened,
  customBoat,
  customWidth,
}: Props) => {
  const [openIslandList, setOpenIslandList] = useState(false);

  return (
    <>
      {customBoat && customWidth ? (
        <MapPlacement x={x} y={y}>
          <div
            style={{
              width: `${customWidth * PIXEL_SCALE}px`,
            }}
          >
            <img
              src={customBoat}
              onClick={() => setOpenIslandList(true)}
              className="relative cursor-pointer hover:img-highlight"
              style={{
                width: `${customWidth * PIXEL_SCALE}px`,
              }}
            />
          </div>
        </MapPlacement>
      ) : (
        <MapPlacement x={x} y={y}>
          <div
            style={{
              width: `${68 * PIXEL_SCALE}px`,
            }}
          >
            <img
              src={boat}
              onClick={() => setOpenIslandList(true)}
              className="relative cursor-pointer hover:img-highlight"
              style={{
                width: `${68 * PIXEL_SCALE}px`,
              }}
            />
          </div>
        </MapPlacement>
      )}

      <IslandTravelModal
        isOpen={openIslandList}
        bumpkin={bumpkin}
        inventory={inventory ?? {}}
        onShow={onTravelDialogOpened}
        isVisiting={isVisiting}
        isTravelAllowed={isTravelAllowed}
        onClose={() => setOpenIslandList(false)}
      />
    </>
  );
};
