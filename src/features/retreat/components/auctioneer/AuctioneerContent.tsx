import React, { useState } from "react";

import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { GameState } from "features/game/types/game";
import {
  AuctionResults,
  MachineInterpreter,
  Auction as IAuction,
} from "features/game/lib/auctionMachine";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { Auction } from "./Auction";
import { Auctions } from "./Auctions";

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

  const [selectedAuctionId, setSelectedAuctionId] =
    useState<string>("test-auction-1");

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

  if (selectedAuctionId) {
    const auction = auctioneerState.context.auctions.find(
      (auction) => auction.auctionId === selectedAuctionId
    ) as IAuction;

    return (
      <Auction
        auction={auction}
        auctionService={auctionService}
        gameState={gameState}
        onMint={onMint}
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
