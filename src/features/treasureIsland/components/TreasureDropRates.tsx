import React, { useState } from "react";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { PIXEL_SCALE } from "features/game/lib/constants";

import placeholderNPC2 from "assets/npcs/artisian.gif";
import shadow from "assets/npcs/shadow.png";

import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";
import { Label } from "components/ui/Label";
import { InventoryItemName } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";

// TODO import TREASURES from types instead of constructing it here
import {
  BEACH_BOUNTY_TREASURE,
  PLACEABLE_TREASURES,
} from "features/game/types/treasure";

const TREASURES = {
  ...BEACH_BOUNTY_TREASURE,
  ...PLACEABLE_TREASURES,
};

const TreasureDrop: React.FC<{
  treasureName: InventoryItemName;
  rarity: "good" | "average" | "rare";
  limitedTime?: number;
}> = ({ treasureName, rarity, limitedTime }) => (
  <div key={treasureName} className="flex justify-between">
    <div className="flex-col space-y-1">
      <div className="flex">
        <div className="w-12 justify-center items-center flex mr-2">
          <img src={ITEM_DETAILS[treasureName].image} className="h-8" />
        </div>
        <div className="justify-center items-center flex">
          <span className="text-sm mb-1">{treasureName}</span>
        </div>
      </div>
      {limitedTime && (
        <div className="flex items-center">
          <Label type="info" className="flex items-center">
            <img src={SUNNYSIDE.icons.stopwatch} className="w-3 left-0 mr-1" />
            {`${secondsToString(100, {
              length: "medium",
              isShortFormat: true,
            })} left`}
          </Label>
          <span className="text-xxs ml-2 italic">Time Limited!</span>
        </div>
      )}
    </div>

    <div className="flex items-center">
      {rarity === "good" && <Label type="success">Common</Label>}
      {rarity === "average" && <Label type="info">Uncommon</Label>}
      {rarity === "rare" && <Label type="warning">Rare</Label>}
    </div>
  </div>
);

export const TreasureDropRates: React.FC = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <MapPlacement x={-1} y={10} height={1} width={1}>
      <img
        src={shadow}
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `0px`,
          left: `0px`,
        }}
      />
      {/* TODO: Replace this NPC with a pirate */}
      <img
        src={placeholderNPC2}
        className="absolute z-10"
        onClick={() => setShowModal(true)}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 1}px`,
          transform: "scaleX(-1)",
        }}
      />
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        {/* TODO: Replace the bumpkin parts with a pirate */}
        <CloseButtonPanel
          onClose={() => setShowModal(false)}
          title={"Treasure Trove"}
          bumpkinParts={{
            body: "Goblin Potion",
            hair: "Teal Mohawk",
            shirt: "Red Farmer Shirt",
            pants: "Farmer Pants",
            tool: "Farmer Pitchfork",
            background: "Farm Background",
            shoes: "Black Farmer Boots",
          }}
        >
          <div
            className="p-2 overflow-y-auto scrollable overflow-x-hidden"
            style={{ maxHeight: 400 }}
          >
            <div className="flex flex-col divide-y-2 divide-dashed divide-brown-600">
              <div className="pb-2">
                <TreasureDrop
                  treasureName="Kuebiko"
                  rarity="rare"
                  limitedTime={100}
                />
              </div>
              <div className="pt-1 space-y-2">
                {getKeys(TREASURES).map((treasureName) => (
                  <TreasureDrop
                    key={treasureName}
                    treasureName={treasureName}
                    rarity={"average"}
                  />
                ))}
              </div>
            </div>
          </div>
        </CloseButtonPanel>
      </Modal>
    </MapPlacement>
  );
};
