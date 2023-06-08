import React, { useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Auction } from "features/game/lib/auctionMachine";

import sflIcon from "assets/icons/token_2.png";
import { getKeys } from "features/game/types/craftables";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { InventoryItemName } from "features/game/types/game";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";

interface Props {
  auction: Auction;
  maxTickets: number;
  onBid: (auctionTickers: number) => void;
}
export const DraftBid: React.FC<Props> = ({ auction, onBid, maxTickets }) => {
  const [tickets, setTickets] = useState(1);

  const image =
    auction.type === "collectible"
      ? ITEM_DETAILS[auction.collectible as InventoryItemName].image
      : getImageUrl(ITEM_IDS[auction.wearable as BumpkinItem]);

  return (
    <div className="p-2">
      {/* <div className="flex flex-wrap justify-center">
        {getKeys(item.ingredients).map((name) => (
          <div className="flex mr-4">
            <img src={ITEM_DETAILS[name].image} className="h-6 mr-1" />
            <p className="text-sm">{item.ingredients[name]}</p>
          </div>
        ))}
        {!!item.price && (
          <div className="flex">
            <img src={token} className="h-6 mr-1" />
            <p className="text-sm">{item.price}</p>
          </div>
        )}
      </div> */}
      <p className="text-sm text-center mb-2">Place your bid</p>

      <div className="flex items-center justify-center mb-1">
        <div
          className="w-10 mr-2 relative cursor-pointer"
          style={{
            opacity: tickets === 0 ? 0.5 : 1,
          }}
          onClick={() => setTickets((prev) => (prev > 1 ? prev - 1 : prev))}
        >
          <img src={SUNNYSIDE.icons.disc} className="w-full" />
          <img
            src={SUNNYSIDE.icons.minus}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 8}px`,
              top: `${PIXEL_SCALE * 4.5}px`,
              left: `${PIXEL_SCALE * 3.7}px`,
            }}
          />
        </div>
        <div className="flex items-center flex-wrap justify-center">
          {auction.sfl > 0 && (
            <div className="flex items-center  mb-1 mr-3">
              <div>
                <p className="mr-1 text-right text-sm">
                  {auction.sfl * tickets}
                </p>
              </div>
              <img src={sflIcon} className="h-5" />
            </div>
          )}
          {getKeys(auction.ingredients).map((name) => (
            <div className="flex items-center mb-1 mr-3">
              <div>
                <p className="mr-1 text-right text-sm">
                  {(auction.ingredients[name] ?? 0) * tickets}
                </p>
              </div>
              <img src={ITEM_DETAILS[name].image} className="h-5" />
            </div>
          ))}
        </div>

        <div
          className="w-10 mr-2 relative"
          onClick={() =>
            setTickets((prev) => (prev >= maxTickets ? prev : prev + 1))
          }
          style={{
            opacity: tickets === maxTickets ? 0.5 : 1,
          }}
        >
          <img src={SUNNYSIDE.icons.disc} className="w-full" />
          <img
            src={SUNNYSIDE.icons.plus}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 8}px`,
              top: `${PIXEL_SCALE * 3.5}px`,
              left: `${PIXEL_SCALE * 3.7}px`,
            }}
          />
        </div>
      </div>
      <p className="text-xxs text-center underline mb-3">
        How does this auction work?
      </p>
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
      <div className="flex mb-2">
        <img src={SUNNYSIDE.icons.happy} className="h-6 mr-2" />
        <div>
          <p className="text-sm">
            {`Winners only pay the lowest successful bid price (the ${auction.supply}th bid)`}
          </p>
        </div>
      </div>
      <div className="flex mb-4">
        <img src={SUNNYSIDE.icons.neutral} className="h-6 mr-2" />
        <div>
          <p className="text-sm mb-1">
            Participants who are unsuccesful will be refunded their resources.
          </p>
        </div>
      </div>

      <Button
        onClick={() => {
          onBid(tickets);
        }}
      >
        Bid
      </Button>
      <p className="text-xs underline text-center">Terms and conditions</p>
    </div>
  );
};
