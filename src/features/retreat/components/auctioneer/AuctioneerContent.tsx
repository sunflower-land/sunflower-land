import React, { useContext } from "react";
import { Context } from "features/game/GoblinProvider";

import { getValidAuctionItems } from "./actions/auctioneerItems";
import { useActor } from "@xstate/react";
import { MachineInterpreter } from "features/retreat/auctioneer/auctioneerMachine";
import { AuctionDetails } from "./AuctionDetails";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import bg from "assets/ui/brown_background.png";
import { getKeys } from "features/game/types/craftables";
import token from "assets/icons/token_2.png";
import { Button } from "components/ui/Button";
import { Bid } from "features/game/types/game";

export const AuctioneerContent = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const child = goblinState.children.auctioneer as MachineInterpreter;

  const [auctioneerState, send] = useActor(child);

  const { auctioneerItems } = auctioneerState.context;

  console.log({ state: auctioneerState.value });
  console.log({ bid: auctioneerState.context.bid });
  if (auctioneerState.matches("bidded")) {
    const bid = auctioneerState.context.bid as Bid;

    return (
      <div className="flex justify-center flex-col w-full items-center">
        <div className="relative my-2">
          <img src={bg} className="w-48 object-contain rounded-md" />
          <div className="absolute inset-0">
            <img
              src={ITEM_DETAILS[bid.item].image}
              className="absolute w-1/2 z-20 object-cover mb-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        <span className="mt-1 ml-2 text-center mb-2 text-sm">
          You have placed your bid.
        </span>

        <div className="flex flex-wrap">
          {getKeys(bid.ingredients).map((name) => (
            <div className="flex items-center mb-2 mr-4" key={name}>
              <img src={ITEM_DETAILS[name].image} className="h-6 mr-1" />
              <span>{bid.ingredients[name]?.toNumber()}</span>
            </div>
          ))}

          {bid.sfl && (
            <div className="flex items-center mb-2">
              <img src={token} className="h-6 mr-1" />
              <span>{bid.sfl?.toNumber()}</span>
            </div>
          )}
        </div>
        <Label type="info">10 hours left</Label>
        <Button className="mt-2" onClick={() => send("CHECK_RESULTS")}>
          Reveal winners
        </Button>
      </div>
    );
  }

  if (auctioneerState.matches("bidding")) {
    return <span className="loading">Placing bid</span>;
  }

  if (auctioneerState.matches("checkingResults")) {
    return <span className="loading">Loading</span>;
  }

  if (auctioneerState.matches("pending")) {
    return (
      <div>
        <p>The results are still being calculated</p>
        <p>Good luck!</p>
      </div>
    );
  }

  if (auctioneerState.matches("loser")) {
    return (
      <div>
        <p>Oh no! You were not succesful.</p>
        <p>This was a busy auction and you just missed out!</p>
        <p>Refund your bid to collect your items back.</p>
        <Button className="mt-2" onClick={() => send("REFUND")}>
          Refund
        </Button>
      </div>
    );
  }

  if (auctioneerState.matches("winner")) {
    return (
      <div>
        <p>Congratulations!</p>
        <p>You were one of the lucky players.</p>
        <Button className="mt-2" onClick={() => send("MINT")}>
          Mint
        </Button>
      </div>
    );
  }

  console.log({ auctioneerItems });
  const upcoming = getValidAuctionItems(auctioneerItems);

  if (upcoming.length === 0) {
    return (
      <div className="flex flex-col">
        <span className="mt-1 ml-2">Coming soon...</span>
      </div>
    );
  }

  const item = upcoming[0];
  console.log({ item });
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
        onBid={() => {
          console.log({ item: item.name });
          child.send("BID", { item: item.name });
        }}
        isUpcomingItem={false}
      />
    </div>
  );
};
