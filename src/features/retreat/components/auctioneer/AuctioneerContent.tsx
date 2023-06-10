import React, { useState } from "react";

import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Bid, GameState } from "features/game/types/game";
import {
  AuctionResults,
  MachineInterpreter,
  Auction as IAuction,
} from "features/game/lib/auctionMachine";
import { Auctions } from "./Auctions";
import { Loser } from "./Loser";
import { Winner } from "./Winner";
import { AuctionDetails } from "./AuctionDetails";
import { Pending } from "./Pending";
import { AuctionBid } from "./AuctionBid";
import { DraftBid } from "./DraftBid";
import { Refunded } from "./Refunded";
import { MissingAuction } from "./MissingAuction";

interface Props {
  auctionService: MachineInterpreter;
  gameState: GameState;
  onMint: (id: string) => void;
}
export const AuctioneerContent: React.FC<Props> = ({
  auctionService,
  gameState,
  onMint,
}) => {
  const [auctioneerState, send] = useActor(auctionService);

  const [selectedAuctionId, setSelectedAuctionId] = useState<string>();

  if (auctioneerState.matches("introduction")) {
    return (
      <>
        <div className="p-2">
          <p>Intro</p>
        </div>
        <Button onClick={() => send("CONTINUE")}>Continue</Button>
      </>
    );
  }

  if (auctioneerState.matches("error")) {
    return (
      <div className="p-2">
        <p className="mb-2">Something went wrong!</p>
        <Button onClick={() => auctionService.send("REFRESH")}>Retry</Button>
      </div>
    );
  }

  const auction = auctioneerState.context.auctions.find(
    (auction) => auction.auctionId === selectedAuctionId
  ) as IAuction;

  if (auctioneerState.matches("draftingBid")) {
    return (
      <DraftBid
        gameState={gameState}
        auction={auction}
        maxTickets={9999999} // TODO
        onBid={(tickets: number) => {
          auctionService.send("BID", { auctionId: auction.auctionId, tickets });
        }}
        onBack={() => auctionService.send("CANCEL")}
      />
    );
  }

  if (auctioneerState.matches("bidding")) {
    return <span className="loading">Placing bid</span>;
  }

  if (auctioneerState.matches("refunding")) {
    return <span className="loading">Loading</span>;
  }

  if (auctioneerState.matches("refunded")) {
    return <Refunded />;
  }

  if (auctioneerState.matches("missingAuction")) {
    return <MissingAuction auctionService={auctionService} />;
  }

  if (auctioneerState.matches("bidded")) {
    return (
      <AuctionBid
        auction={auction}
        auctionService={auctionService}
        bid={auctioneerState.context.bid as Bid}
      />
    );
  }

  if (auctioneerState.matches("checkingResults")) {
    return <span className="loading">Loading</span>;
  }

  if (auctioneerState.matches("pending")) {
    return <Pending />;
  }

  if (auctioneerState.matches("loser")) {
    return (
      <Loser
        auctionService={auctionService}
        results={auctioneerState.context.results as AuctionResults}
      />
    );
  }

  if (auctioneerState.matches("winner")) {
    return <Winner onMint={onMint} bid={auctioneerState.context.bid as Bid} />;
  }

  if (selectedAuctionId) {
    return (
      <AuctionDetails
        item={auction}
        game={gameState}
        onDraftBid={() => {
          auctionService.send("DRAFT_BID");
        }}
        isUpcomingItem={false}
        onBack={() => setSelectedAuctionId(undefined)}
      />
    );
  }

  return (
    <Auctions
      auctionService={auctionService}
      onSelect={(id) => setSelectedAuctionId(id)}
    />
  );
};
