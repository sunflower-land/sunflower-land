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
import trivia from "assets/npcs/trivia.gif";
import { Button } from "components/ui/Button";
import { Bid } from "features/game/types/game";
import { DraftBid } from "./DraftBid";
import { secondsToString } from "lib/utils/time";
import { SUNNYSIDE } from "assets/sunnyside";
import { ToastContext } from "features/game/toast/ToastQueueProvider";

export const AuctioneerContent = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);
  const { setToast } = useContext(ToastContext);

  const child = goblinState.children.auctioneer as MachineInterpreter;

  const [auctioneerState, send] = useActor(child);

  const { auctioneerItems, auctioneerId } = auctioneerState.context;

  const upcoming = getValidAuctionItems(auctioneerItems);

  const item = upcoming[0];

  const bid = auctioneerState.context.bid as Bid;

  if (auctioneerState.matches("bidded")) {
    const secondsLeft = !item
      ? 0
      : Math.floor((item.endDate - Date.now()) / 1000);

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
              <span>{bid.ingredients[name]}</span>
            </div>
          ))}

          {!!bid.sfl && (
            <div className="flex items-center mb-2 mr-4">
              <img src={token} className="h-6 mr-1" />
              <span>{bid.sfl}</span>
            </div>
          )}

          {bid.lotteryTickets && (
            <div className="flex items-center mb-2">
              <img
                src={ITEM_DETAILS["Lottery Ticket"].image}
                className="h-6 mr-1"
              />
              <span>{bid.lotteryTickets}</span>
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

  if (auctioneerState.matches("bidding")) {
    return <span className="loading">Placing bid</span>;
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
      getKeys(bid.ingredients).forEach((name) => {
        setToast({
          icon: ITEM_DETAILS[name].image,
          content: `+${bid.ingredients[name]?.toString()}`,
        });
      });

      if (bid.sfl) {
        setToast({
          icon: token,
          content: `+${bid.sfl}`,
        });
      }

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
              src={ITEM_DETAILS["Lottery Ticket"].image}
              className="w-6 object-contain mr-2"
            />
            <div>
              <p className="text-sm">{`${auctioneerState.context.results?.minimum.lotteryTickets} lottery tickets required`}</p>
              <p className="text-xs">{`(Lasted bid at ${new Date(
                auctioneerState.context.results?.minimum.biddedAt ?? 0
              ).toLocaleTimeString()})`}</p>
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
      <div className="flex flex-col items-center">
        <div className="p-2">
          <img src={trivia} className="w-24 mb-2" />

          <p>Your items have been returned to your inventory</p>
          <p className="text-sm">Good luck next time!</p>
        </div>
        <Button className="mt-2" onClick={() => send("REFRESH")}>
          Continue
        </Button>
      </div>
    );
  }

  if (auctioneerState.matches("winner")) {
    return (
      <div className="flex flex-col justify-center items-center pt-2">
        <p className="mb-1">Congratulations!</p>
        <p className="text-sm mb-2">Your bid was succesful</p>
        <div className="relative mb-2">
          <img src={bg} className="w-48 object-contain rounded-md" />
          <div className="absolute inset-0">
            <img
              src={ITEM_DETAILS[bid?.item].image}
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

  if (auctioneerState.matches("draftingBid")) {
    return (
      <DraftBid
        item={item}
        maxTickets={
          goblinState.context.state.inventory["Lottery Ticket"]?.toNumber() ?? 0
        }
        onBid={(lotteryTickets: number) => {
          child.send("BID", { item: item.name, lotteryTickets });
        }}
      />
    );
  }

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
      <AuctionDetails
        item={item}
        game={goblinState.context.state}
        onDraftBid={() => {
          child.send("DRAFT_BID");
        }}
        isUpcomingItem={false}
      />
    </div>
  );
};
