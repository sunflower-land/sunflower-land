import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import {
  BUMPKIN_ITEM_PART,
  BumpkinItem,
  Equipped,
  ITEM_IDS,
} from "features/game/types/bumpkin";
import React, { useContext, useState } from "react";
import { DynamicNFT } from "./DynamicNFT";
import { NPC } from "features/island/bumpkin/components/NPC";
import { Box } from "components/ui/Box";
import { InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { Button } from "components/ui/Button";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { SUNNYSIDE } from "assets/sunnyside";
import { getKeys } from "features/game/types/craftables";
import Decimal from "decimal.js-light";
import {
  availableWardrobe,
  equip,
} from "features/game/events/landExpansion/equip";

export const BumpkinEquip: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [equipped, setEquipped] = useState(
    gameState.context.state.bumpkin?.equipped as Equipped
  );

  const [finished, setFinished] = useState(false);

  const wardrobe = gameState.context.state.wardrobe;

  const equipPart = (name: BumpkinItem) => {
    const part = BUMPKIN_ITEM_PART[name];
    const outfit = {
      ...equipped,
      [part]: name,
    };

    if (part === "dress") {
      delete outfit.shirt;
      delete outfit.pants;
    }

    if (part === "shirt") {
      delete outfit.dress;
    }

    if (part === "pants") {
      delete outfit.dress;
    }

    setEquipped(outfit);
  };

  const unequipPart = (name: BumpkinItem) => {
    const part = BUMPKIN_ITEM_PART[name];
    const outfit = { ...equipped };

    delete outfit[part];

    setEquipped(outfit);
  };

  const finish = () => {
    gameService.send("bumpkin.equipped", {
      equipment: equipped,
    });
    setFinished(true);
  };

  console.log({ equipped });

  const isDirty =
    JSON.stringify(equipped) !==
    JSON.stringify(gameState.context.state.bumpkin?.equipped);

  const equippedItems = Object.values(equipped);
  return (
    <div className="p-2">
      <div className="flex flex-col items-center justify-center">
        <div className="w-1/3">
          <div className="w-full  relative rounded-xl overflow-hidden mr-2 mb-1">
            <DynamicNFT
              showBackground
              bumpkinParts={equipped}
              key={JSON.stringify(equipped)}
            />
            <div className="absolute w-8 h-8 bottom-10 right-4">
              <NPC parts={equipped} key={JSON.stringify(equipped)} />
            </div>
          </div>
          <Button disabled={!isDirty} onClick={finish} className="text-sm">
            <div className="flex">
              Equip
              {finished && !isDirty && (
                <img
                  src={SUNNYSIDE.icons.confirm}
                  className="h-4 relative left-2"
                />
              )}
            </div>
          </Button>
        </div>
        <div className="flex-1 flex flex-wrap justify-center pr-1 pt-2.5 overflow-y-auto scrollable max-h-60">
          {getKeys(wardrobe).map((name) => (
            <Box
              key={name}
              image={getImageUrl(ITEM_IDS[name])}
              secondaryImage={
                equippedItems.includes(name)
                  ? SUNNYSIDE.icons.confirm
                  : undefined
              }
              count={new Decimal(wardrobe[name] ?? 0)}
              onClick={() => {
                // Already equipped
                if (equippedItems.includes(name)) {
                  unequipPart(name);
                } else {
                  equipPart(name);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
