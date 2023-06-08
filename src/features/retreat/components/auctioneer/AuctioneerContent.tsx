import React from "react";

import { useActor } from "@xstate/react";
import { AuctionDetails } from "./AuctionDetails";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import bg from "assets/ui/brown_background.png";
import { getKeys } from "features/game/types/craftables";
import token from "assets/icons/token_2.png";
import trivia from "assets/npcs/trivia.gif";
import { Button } from "components/ui/Button";
import { Bid, GameState } from "features/game/types/game";
import { DraftBid } from "./DraftBid";
import { secondsToString } from "lib/utils/time";
import { SUNNYSIDE } from "assets/sunnyside";
import { MachineInterpreter } from "features/game/lib/auctionMachine";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";

interface Props {
  auctionService: MachineInterpreter;
  gameState: GameState;
}
export const AuctioneerContent: React.FC<Props> = ({
  auctionService,
  gameState,
}) => {
  const [auctioneerState, send] = useActor(auctionService);

  const { auctions, auctionId } = auctioneerState.context;

  console.log({ items: auctions });

  const item = auctions[0];

  if (auctioneerState.matches("playing")) {
    return (
      <div
        className="h-full overflow-y-auto scrollable"
        style={{
          maxHeight: "600px",
        }}
      >
        <AuctionDetails
          item={item}
          game={gameState}
          onDraftBid={() => {
            auctionService.send("DRAFT_BID");
          }}
          isUpcomingItem={false}
        />
      </div>
    );
  }
  if (auctioneerState.matches("draftingBid")) {
    return (
      <DraftBid
        auction={item}
        maxTickets={9999999} // TODO
        onBid={(tickets: number) => {
          auctionService.send("BID", { auctionId: item.auctionId, tickets });
        }}
      />
    );
  }

  if (auctions.length === 0) {
    return (
      <div className="flex flex-col">
        <span className="mt-1 ml-2">Coming soon...</span>
      </div>
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

  if (auctioneerState.matches("bidding")) {
    return <span className="loading">Placing bid</span>;
  }

  console.log({ state: auctioneerState.value });

  const bid = auctioneerState.context.bid as Bid;

  const image = bid.collectible
    ? ITEM_DETAILS[bid?.collectible].image
    : getImageUrl(ITEM_IDS[bid.wearable as BumpkinItem]);

  if (auctioneerState.matches("bidded")) {
    const secondsLeft = !item
      ? 0
      : Math.floor((item.endAt - Date.now()) / 1000);

    return (
      <div className="flex justify-center flex-col w-full items-center">
        <div className="relative my-2">
          <img src={bg} className="w-48 object-contain rounded-md" />
          <div className="absolute inset-0">
            <img
              src={image}
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
              <span>{bid.ingredients[name]}</span>
            </div>
          ))}

          {!!bid.sfl && (
            <div className="flex items-center mb-2 mr-4">
              <img src={token} className="h-6 mr-1" />
              <span>{bid.sfl}</span>
            </div>
          )}
        </div>
        {secondsLeft > 0 && (
          <Label type="info">{`${secondsToString(secondsLeft, {
            length: "full",
          })} left`}</Label>
        )}

        <Button
          className="mt-2"
          disabled={secondsLeft > 0}
          onClick={() => send("CHECK_RESULTS")}
        >
          Reveal winners
        </Button>
      </div>
    );
  }

  if (auctioneerState.matches("checkingResults")) {
    return <span className="loading">Loading</span>;
  }

  if (auctioneerState.matches("pending")) {
    return (
      <div className="p-2 flex flex-col items-center">
        <img src={trivia} className="w-24 mb-2" />
        <p>The results are being calculated.</p>
        <p className="text-sm">Come back later.</p>
      </div>
    );
  }

  if (auctioneerState.matches("loser")) {
    const refund = () => {
      send("REFUND");
    };

    return (
      <div className="flex flex-col items-center">
        <p className="mb-2">Bid unsuccessful</p>
        <img src={SUNNYSIDE.icons.neutral} className="w-12 mb-2" />
        <Label type="warning">Auction results</Label>
        <div className="w-4/5 flex flex-col my-2">
          <div className="flex mb-1">
            <img
              src={SUNNYSIDE.icons.player}
              className="w-6 object-contain mr-2"
            />
            <span className="text-sm">{`${auctioneerState.context.results?.supply}/${auctioneerState.context.results?.participantCount} participants successful`}</span>
          </div>
          <div className="flex">
            <img
              src={ITEM_DETAILS["Solar Flare Ticket"].image}
              className="w-6 object-contain mr-2"
            />
            <div>
              <p className="text-sm">{`${
                (auctioneerState.context.results?.minimum.tickets ?? 0) *
                bid.sfl
              } SFL required`}</p>
            </div>
          </div>
        </div>
        <Button className="mt-2" onClick={refund}>
          Refund resources
        </Button>
      </div>
    );
  }

  if (auctioneerState.matches("refunding")) {
    return <span className="loading">Loading</span>;
  }

  if (auctioneerState.matches("refunded")) {
    return (
      <div>
        <div className="p-2 flex flex-col items-center">
          <img src={trivia} className="w-24 mb-2" />

          <p className="text-center mb-1">
            Your items have been returned to your inventory
          </p>
          <p className="text-sm">Good luck next time!</p>
        </div>
        <Button className="mt-2" onClick={() => send("REFRESH")}>
          Continue
        </Button>
      </div>
    );
  }

  if (auctioneerState.matches("winner")) {
    const image = bid.collectible
      ? ITEM_DETAILS[bid?.collectible].image
      : getImageUrl(ITEM_IDS[bid.wearable as BumpkinItem]);

    return (
      <div className="flex flex-col justify-center items-center pt-2">
        <p className="mb-1">Congratulations!</p>
        <p className="text-sm mb-2">Your bid was succesful</p>
        <div className="relative mb-2">
          <img src={bg} className="w-48 object-contain rounded-md" />
          <div className="absolute inset-0">
            <img
              src={image}
              className="absolute z-20 object-cover"
              style={{
                width: "50%",
                left: "25%",
                top: "25%",
              }}
            />
          </div>
        </div>
        <Button className="mt-2" onClick={() => send("MINT")}>
          Mint
        </Button>
      </div>
    );
  }

  return null;
};
