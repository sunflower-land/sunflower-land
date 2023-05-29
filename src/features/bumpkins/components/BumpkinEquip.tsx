import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import {
  BUMPKIN_ITEM_PART,
  BumpkinItem,
  Equipped,
  ITEM_IDS,
  availableWardrobe,
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

export const BumpkinEquip: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const equipped = gameState.context.state.bumpkin?.equipped as Equipped;

  const available = availableWardrobe(gameState.context.state);
  const items = Object.values(equipped);

  const allItems = items.reduce(
    (acc, name) => ({
      ...acc,
      [name]: (acc[name] ?? 0) + 1,
    }),
    available
  );

  const equip = (name: BumpkinItem) => {
    gameService.send("bumpkin.equipped", {
      equipment: {
        [BUMPKIN_ITEM_PART[name]]: name,
      },
    });
  };

  console.log({ equipped });

  return (
    <div className="p-2">
      <div className="flex items-start justify-center">
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
        </div>
        <div className="flex-1 flex flex-wrap">
          {getKeys(allItems).map((name) => (
            <Box
              key={name}
              image={getImageUrl(ITEM_IDS[name])}
              secondaryImage={
                items.find((i) => i === name)
                  ? SUNNYSIDE.icons.confirm
                  : undefined
              }
              count={new Decimal(allItems[name] ?? 0)}
              onClick={() => equip(name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
