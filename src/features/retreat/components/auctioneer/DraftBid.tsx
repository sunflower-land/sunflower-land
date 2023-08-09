import React, { useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Auction } from "features/game/lib/auctionMachine";

import sflIcon from "assets/icons/token_2.png";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import classNames from "classnames";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { TimerDisplay } from "./AuctionDetails";

/**
 * If they have enough resources, default the bid to 5 tickets
 */
function getInitialTickets(auction: Auction, gameState: GameState) {
  const defaultTickets = 5;

  if (gameState.balance.lt(auction.sfl * defaultTickets)) {
    return 1;
  }

  if (
    getKeys(auction.ingredients).some(
      (name) =>
        !gameState.inventory[name]?.gt(
          (auction.ingredients[name] ?? 0) * defaultTickets
        )
    )
  ) {
    return 1;
  }

  return defaultTickets;
}

interface Props {
  auction: Auction;
  maxTickets: number;
  onBid: (auctionTickers: number) => void;
  gameState: GameState;
  onBack: () => void;
}
export const DraftBid: React.FC<Props> = ({
  auction,
  onBid,
  maxTickets,
  gameState,
  onBack,
}) => {
  const [tickets, setTickets] = useState(getInitialTickets(auction, gameState));
  const [showConfirm, setShowConfirm] = useState(false);
  const end = useCountdown(auction.endAt);

  const missingSFL = gameState.balance.lt(auction.sfl * tickets);
  const missingIngredients = getKeys(auction.ingredients).some((name) =>
    gameState.inventory[name]?.lt((auction.ingredients[name] ?? 0) * tickets)
  );

  if (showConfirm) {
    return (
      <div
        className="flex flex-col justify-center items-center relative"
        style={{ height: "200px" }}
      >
        <div className="absolute -top-2 right-0">
          {TimerDisplay({
            time: end,
            fontSize: 18,
            color: end.minutes >= 1 ? "white" : "red",
          })}
        </div>
        <div className="p-2 flex-1 flex flex-col items-center justify-center">
          <p className="text-sm mb-2">
            Are you sure you want to place this bid?
          </p>
          <div className="flex items-center flex-wrap justify-center mb-4">
            {auction.sfl > 0 && (
              <div className={classNames("flex items-center  mb-1 mr-3")}>
                <div>
                  <p className="mr-1 text-right text-sm">
                    {auction.sfl * tickets}
                  </p>
                </div>
                <img src={sflIcon} className="h-5" />
              </div>
            )}
            {getKeys(auction.ingredients).map((name) => (
              <div className="flex items-center mb-1 mr-3" key={name}>
                <div>
                  <p className={classNames("mr-1 text-right text-sm")}>
                    {(auction.ingredients[name] ?? 0) * tickets}
                  </p>
                </div>
                <img src={ITEM_DETAILS[name].image} className="h-5" />
              </div>
            ))}
          </div>

          <p className="text-xs mb-2">
            Bids cannot be changed once they have been placed.
          </p>
        </div>
        <div className="flex w-full">
          <Button className="mr-1" onClick={() => setShowConfirm(false)}>
            Back
          </Button>
          <Button
            onClick={() => {
              onBid(tickets);
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 relative">
      <div className="flex items-center justify-between w-full border-b border-opacity-50 pb-1 mb-2">
        <img
          onClick={onBack}
          src={SUNNYSIDE.icons.arrow_left}
          className="h-8 cursor-pointer"
        />
        <p className="-ml-5">Place your bid</p>
        <div />
      </div>

      <div className="absolute -top-2 right-0">
        {TimerDisplay({
          time: end,
          fontSize: 18,
          color: end.minutes >= 1 ? "white" : "red",
        })}
      </div>

      <div className="flex items-center justify-center mb-1">
        <Button
          className="w-10 h-10 mr-2 relative cursor-pointer"
          disabled={tickets === 1}
          longPress
          onClick={() => setTickets((prev) => (prev > 1 ? prev - 1 : prev))}
          longPressInterval={10}
        >
          <img
            src={SUNNYSIDE.icons.minus}
            className="relative top-0.5"
            style={{
              width: `${PIXEL_SCALE * 8}px`,
            }}
          />
        </Button>
        <div className="flex items-center flex-wrap justify-center">
          {auction.sfl > 0 && (
            <div
              className={classNames("flex items-center  mb-1 mr-3", {
                ["text-red-500"]: missingSFL,
              })}
            >
              <div>
                <p className="mr-1 text-right text-sm">
                  {auction.sfl * tickets}
                </p>
              </div>
              <img src={sflIcon} className="h-5" />
            </div>
          )}
          {getKeys(auction.ingredients).map((name) => (
            <div className="flex items-center mb-1 mr-3" key={name}>
              <div>
                <p
                  className={classNames("mr-1 text-right text-sm", {
                    ["text-red-500"]: gameState.inventory[name]?.lt(
                      (auction.ingredients[name] ?? 0) * tickets
                    ),
                  })}
                >
                  {(auction.ingredients[name] ?? 0) * tickets}
                </p>
              </div>
              <img src={ITEM_DETAILS[name].image} className="h-5" />
            </div>
          ))}
        </div>

        <Button
          className="w-10 h-10 mr-2 relative cursor-pointer"
          disabled={tickets === maxTickets}
          onClick={() =>
            setTickets((prev) => (prev >= maxTickets ? prev : prev + 1))
          }
          longPress
          longPressInterval={10}
        >
          <img
            src={SUNNYSIDE.icons.plus}
            className="relative top-0.5"
            style={{
              width: `${PIXEL_SCALE * 8}px`,
            }}
          />
        </Button>
      </div>

      <div className="text-xxs text-center underline mb-3  hover:text-blue-500">
        <a
          href="https://docs.sunflower-land.com/player-guides/auctions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xxs text-center underline mb-3  hover:text-blue-500"
        >
          How does the auction work?
        </a>
      </div>

      <div className="flex">
        <img src={SUNNYSIDE.icons.stopwatch} className="h-6 mr-2" />
        <p className="text-sm mb-2">
          {`At the end of the auction, the top ${
            auction.supply
          } bids will mint the ${
            auction.type === "collectible"
              ? auction.collectible
              : auction.wearable
          }.`}
        </p>
      </div>

      <div className="flex mb-4">
        <img src={SUNNYSIDE.icons.neutral} className="h-6 mr-2" />
        <div>
          <p className="text-sm mb-1">
            Participants who are unsuccessful will be refunded their resources.
          </p>
        </div>
      </div>

      <Button
        onClick={() => setShowConfirm(true)}
        disabled={
          missingSFL || missingIngredients || Date.now() > auction.endAt
        }
      >
        Bid
      </Button>
      <div className="text-center">
        <a
          href="https://docs.sunflower-land.com/player-guides/auctions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-center underline mb-3  hover:text-blue-500"
        >
          Terms and conditions
        </a>
      </div>
    </div>
  );
};
