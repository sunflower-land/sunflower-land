import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import { Button } from "components/ui/Button";

import busyGoblin from "assets/npcs/goblin_doing.gif";
import { Context } from "../GoblinProvider";
import { MintedEvent } from "../lib/goblinMachine";
import { ITEM_DETAILS } from "../types/images";
import { ONE_DAY, secondsToString } from "lib/utils/time";

export const Minted: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  // Grab the last event triggered + item.
  const mintedItemName = ((goblinState.event as any)?.data as MintedEvent)
    ?.item;
  const mintedItem = goblinState.context.limitedItems[mintedItemName];

  let cooldownPeriod: string | null = secondsToString(7 * ONE_DAY);

  console.log({ mintedItem, mintedItemName });
  if (mintedItem) {
    if (!mintedItem.cooldownSeconds) {
      return (
        <div className="flex flex-col">
          <div className="p-2 flex flex-col items-center">
            <h1 className="text-center mb-3 text-lg">
              Congratulations, you have minted an item!
            </h1>
            <img
              src={ITEM_DETAILS[mintedItemName].image}
              className="w-20 mb-3"
            />
            <h1 className="text-center mb-3">{mintedItemName}</h1>
          </div>
          <Button onClick={() => goblinService.send("REFRESH")}>Ok</Button>
        </div>
      );
    }

    cooldownPeriod = secondsToString(mintedItem.cooldownSeconds);
  }

  return (
    <div className="flex flex-col">
      <div className="p-2 flex flex-col items-center">
        <h1 className="text-center mb-3 text-lg">
          The goblins are crafting your item!
        </h1>
        <img src={busyGoblin} className="w-20 mb-3" />
        <p className="mb-3 text-sm text-justify">
          The goblins are renowned for their exceptional craftsmanship. They
          build each of these rare items by hand.
        </p>
        <p className="mb-4 text-sm text-justify">
          {`It will take them ${cooldownPeriod} for this process to be completed.`}
        </p>
        <p className="mb-4 text-sm text-justify">
          {`You will not be able to withdraw your item or mint another one until
          they're done.`}
        </p>
      </div>
      <Button onClick={() => goblinService.send("REFRESH")}>Ok</Button>
    </div>
  );
};
