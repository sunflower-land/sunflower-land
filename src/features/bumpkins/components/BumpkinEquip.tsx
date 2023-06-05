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
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { SUNNYSIDE } from "assets/sunnyside";
import { getKeys } from "features/game/types/craftables";

import { Label } from "components/ui/Label";

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

  const isMissingHair = !equipped.hair;
  const isMissingBody = !equipped.body;
  const isMissingShoes = !equipped.shoes;
  const isMissingShirt = !equipped.shirt && !equipped.dress;
  const isMissingPants = !equipped.pants && !equipped.dress;

  const warn =
    isMissingHair ||
    isMissingBody ||
    isMissingShoes ||
    isMissingShirt ||
    isMissingPants;

  const warning = () => {
    if (isMissingHair) {
      return "Hair is required";
    }

    if (isMissingBody) {
      return "Body is required";
    }

    if (isMissingShoes) {
      return "Shoes are required";
    }

    if (isMissingShirt) {
      return "Shirt is required";
    }

    if (isMissingPants) {
      return "Pants are required";
    }
    return "";
  };
  return (
    <div className="p-2">
      <div className="flex justify-center">
        <div className="w-1/3  mr-1">
          <div className="w-full  relative rounded-xl overflow-hidden mr-2 mb-1">
            <DynamicNFT
              showBackground
              bumpkinParts={equipped}
              key={JSON.stringify(equipped)}
            />
            <div className="absolute  w-8 h-8 bottom-10 right-4">
              <NPC parts={equipped} key={JSON.stringify(equipped)} />
            </div>
          </div>
          <Button
            disabled={!isDirty || warn}
            onClick={finish}
            className="text-sm h-7"
          >
            <div className="flex">
              Save
              {finished && !isDirty && (
                <img
                  src={SUNNYSIDE.icons.confirm}
                  className="h-4 relative left-2"
                />
              )}
            </div>
          </Button>
          {warn && <Label type="warning">{warning()}</Label>}
        </div>
        <div className="flex-1 flex flex-wrap justify-center pr-1 overflow-y-auto scrollable max-h-60">
          {getKeys(wardrobe).map((name) => (
            <OuterPanel
              key={name}
              className="w-full flex mb-1 p-1 cursor-pointer hover:bg-brown-200"
              onClick={() => {
                // Already equipped
                if (equippedItems.includes(name)) {
                  unequipPart(name);
                } else {
                  equipPart(name);
                }
              }}
            >
              <div className="flex-1 flex flex-col">
                <p className="text-xs flex-1">{name}</p>
                {equippedItems.includes(name) && (
                  <div className="flex items-center">
                    <span className="text-xxs mr-2">Equipped</span>
                    <img src={SUNNYSIDE.icons.confirm} className="h-3" />
                  </div>
                )}
              </div>
              <img
                src={getImageUrl(ITEM_IDS[name])}
                className="h-10 rounded-md"
              />
            </OuterPanel>
          ))}
        </div>
      </div>
    </div>
  );
};
