import { useActor } from "@xstate/react";
import { Context } from "features/game/GoblinProvider";
import { MachineInterpreter } from "features/game/lib/auctionMachine";
import React, { useContext } from "react";
import { AuctionDetails } from "./AuctionDetails";
import { GameState } from "features/game/types/game";

interface Props {
  auctionService: MachineInterpreter;
  game: GameState;
}
export const UpcomingAuctions: React.FC<Props> = ({ auctionService, game }) => {
  const [auctioneerState] = useActor(auctionService);

  const { auctions } = auctioneerState.context;
  const readyAuctions = auctions.filter(
    (auction) => auction.endAt > Date.now()
  );
  const upcoming = readyAuctions.slice(1);

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
        <div className="mb-2" key={item.auctionId}>
          <AuctionDetails
            item={item}
            game={game}
            // Won't be called
            onDraftBid={console.log}
            isUpcomingItem={true}
          />
        </div>
      ))}
    </div>
  );
};
