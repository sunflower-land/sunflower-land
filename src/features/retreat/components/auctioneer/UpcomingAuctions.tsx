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

  const [auctioneerState, send] = useActor(child);

  const { auctioneerItems } = auctioneerState.context;
  const upcoming = getValidAuctionItems(auctioneerItems);

  return (
    <div
      className="h-full overflow-y-auto scrollable"
      style={{
        maxHeight: "500px",
      }}
    >
      {upcoming.map((item) => (
        <AuctionDetails
          key={item.name}
          item={item}
          game={goblinState.context.state}
          // Won't be called
          onMint={console.log}
          isMinting={false}
        />
      ))}
    </div>
  );
};
