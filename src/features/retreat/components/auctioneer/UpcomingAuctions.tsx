import { useActor } from "@xstate/react";
import { Context } from "features/game/GoblinProvider";
import { MachineInterpreter } from "features/game/lib/goblinMachine";
import React, { useContext } from "react";
import { getValidAuctionItems } from "./actions/auctioneerItems";
import { AuctionDetails } from "./AuctionDetails";

export const UpcomingAuctions: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const child = goblinState.children.auctioneer as MachineInterpreter;

  const [auctioneerState] = useActor(child);

  const { auctioneerItems } = auctioneerState.context;
  const upcoming = getValidAuctionItems(auctioneerItems).slice(1);

  if (upcoming.length === 0) {
    return (
      <div className="flex flex-col">
        <span className="mt-1 ml-2">Coming soon...</span>
      </div>
    );
  }

  return (
    <div
      className="h-full overflow-y-auto scrollable"
      style={{
        maxHeight: "600px",
      }}
    >
      {upcoming.map((item) => (
        <div className="mb-2" key={item.name}>
          <AuctionDetails
            item={item}
            game={goblinState.context.state}
            // Won't be called
            onDraftBid={console.log}
            isUpcomingItem={true}
          />
        </div>
      ))}
    </div>
  );
};
