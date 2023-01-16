import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import { Button } from "components/ui/Button";

import { Context } from "../GoblinProvider";
import { MintedEvent } from "../lib/goblinMachine";
import { SUNNYSIDE } from "assets/sunnyside";

export const Minted: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  // Grab the last event triggered + item.
  const mintedItemName = ((goblinState.event as any)?.data as MintedEvent)
    ?.item;

  return (
    <div className="flex flex-col">
      <div className="p-2 flex flex-col items-center">
        <h1 className="text-center mb-3 text-lg">
          The goblins have crafted your {mintedItemName}!
        </h1>
        <img src={SUNNYSIDE.npcs.goblin_doing} className="w-20 mb-3" />
        <p className="mb-4 text-sm text-justify">
          {`Go to your chest and place it on your island`}
        </p>
        <p className="mb-4 text-sm text-justify">
          {`You will be able to withdraw your item once the mint has finished`}
        </p>
      </div>
      <Button onClick={() => goblinService.send("REFRESH")}>Ok</Button>
    </div>
  );
};
