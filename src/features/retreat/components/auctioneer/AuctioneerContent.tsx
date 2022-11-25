import React, { useContext } from "react";
import { Context } from "features/game/GoblinProvider";

import { getValidAuctionItems } from "./actions/auctioneerItems";
import { useActor } from "@xstate/react";
import { GoblinRetreatItemName } from "features/game/types/craftables";
import { MachineInterpreter } from "features/retreat/auctioneer/auctioneerMachine";
import { AuctionDetails } from "./AuctionDetails";

export const AuctioneerContent = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const child = goblinState.children.auctioneer as MachineInterpreter;

  const [auctioneerState, send] = useActor(child);

  const { auctioneerItems } = auctioneerState.context;

  const upcoming = getValidAuctionItems(auctioneerItems);

  const mint = (item: GoblinRetreatItemName) => {
    send({ type: "MINT", item, captcha: "" });
  };

  if (upcoming.length === 0) {
    return (
      <div className="flex flex-col">
        <span>Coming soon...</span>
      </div>
    );
  }

  const item = upcoming[0];
  return (
    <div
      className="h-full overflow-y-auto scrollable"
      style={{
        maxHeight: "600px",
      }}
    >
      <AuctionDetails
        item={item}
        game={goblinState.context.state}
        onMint={() => mint(item.name)}
        isMinting={auctioneerState.matches("minting")}
        isUpcomingItem={false}
      />
    </div>
  );
};
