import React, { useContext, useState } from "react";

import { getKeys } from "features/game/types/craftables";
import {
  FLOWER_CHUM_AMOUNTS,
  FLOWER_CHUM_DETAILS,
} from "features/game/types/flowers";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { SEEDS } from "features/game/types/seeds";
import flowerBed from "assets/flowers/flower_bed.webp";

interface Props {
  onClose: () => void;
}

export const FlowerBedContent: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: {
        state: { inventory },
      },
    },
  ] = useActor(gameService);

  const [selectedSeed, setSelectedSeed] = useState<
    InventoryItemName | undefined
  >(undefined);
  const [selectedChum, setSelectedChum] = useState<
    InventoryItemName | undefined
  >(undefined);

  const selectSeed = (name: InventoryItemName) => {
    setSelectedSeed(name);
  };
  const selectChum = (name: InventoryItemName) => {
    setSelectedChum(name);
  };

  const onList = (name: InventoryItemName) => {
    throw new Error("Not implemented");
  };

  const onCancel = () => {
    throw new Error("Not implemented");
  };

  const onPlant = () => {
    gameService.send("flower.planted", {
      id: "123",
      name: "Sunpetal Seed",
    });
    onClose();
  };

  return (
    <div>
      <img src={flowerBed} style={{ width: "200px" }} />

      <p className="mb-1 p-1 text-xs">Select your seed:</p>
      <div className="flex flex-wrap">
        {getKeys(SEEDS()).map((name) => (
          <Box
            image={ITEM_DETAILS[name].image}
            count={inventory[name]}
            onClick={() => selectSeed(name)}
            key={name}
            isSelected={selectedSeed === name}
          />
        ))}
      </div>

      <p className="mb-1 p-1 text-xs">Select your resources:</p>

      <div className="flex flex-wrap">
        {getKeys(FLOWER_CHUM_AMOUNTS)
          // .filter((name) => !!inventory[name]?.gte(1))
          .map((name) => (
            <Box
              image={ITEM_DETAILS[name].image}
              count={inventory[name]}
              onClick={() => selectChum(name)}
              key={name}
              isSelected={selectedChum === name}
            />
          ))}
      </div>

      {selectedSeed && (
        <div className="p-2">
          <div className="flex justify-between">
            <Label
              type="default"
              className="mb-1"
              icon={ITEM_DETAILS[selectedSeed].image}
            >
              {selectedSeed}
            </Label>
            <Label
              // type={!hasRequirements ? "danger" : "default"}
              type="default"
              className="mb-1"
            >{`${FLOWER_CHUM_AMOUNTS[selectedSeed]} ${selectedSeed} required`}</Label>
          </div>
          <p className="text-xs">{FLOWER_CHUM_DETAILS[selectedSeed]}</p>
        </div>
      )}

      {selectedChum && (
        <div className="p-2">
          <div className="flex justify-between">
            <Label
              type="default"
              className="mb-1"
              icon={ITEM_DETAILS[selectedChum].image}
            >
              {selectedChum}
            </Label>
            <Label
              // type={!hasRequirements ? "danger" : "default"}
              type="default"
              className="mb-1"
            >{`${FLOWER_CHUM_AMOUNTS[selectedChum]} ${selectedChum} required`}</Label>
          </div>
          <p className="text-xs">{FLOWER_CHUM_DETAILS[selectedChum]}</p>
        </div>
      )}

      <Button
        onClick={() => onPlant()}
        disabled={!selectedSeed || !selectedChum}
        // disabled={
        //   fishingLimitReached ||
        //   missingRod ||
        //   !state.inventory[bait as InventoryItemName]?.gte(1)
        // }
      >
        <div className="flex items-center">
          <span className="text-sm mr-1">Plant</span>
          <img src={SUNNYSIDE.icons.seedling} className="h-5" />
        </div>
      </Button>
    </div>
  );
};
