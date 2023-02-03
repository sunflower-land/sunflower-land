import React, { useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";

import { AuctioneerItem } from "./actions/auctioneerItems";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  item: AuctioneerItem;
  maxTickets: number;
  onBid: (lotteryTickers: number) => void;
}
export const DraftBid: React.FC<Props> = ({ item, onBid, maxTickets }) => {
  const [lotteryTickets, setLotteryTickets] = useState(0);

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
      <p className="text-sm text-center mb-2">
        Enhance your odds with Lottery Tickets
      </p>

      <div className="flex items-center justify-center mb-1">
        <div
          className="w-10 mr-2 relative cursor-pointer"
          style={{
            opacity: lotteryTickets === 0 ? 0.5 : 1,
          }}
          onClick={() =>
            setLotteryTickets((prev) => (prev > 0 ? prev - 1 : prev))
          }
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
        <div className="flex items-center mr-5">
          <div style={{ minWidth: "45px" }}>
            <p className="mr-2 text-right">{lotteryTickets}</p>
          </div>
          <img
            src={ITEM_DETAILS["Lottery Ticket"].image}
            className="h-8 mr-1"
          />
        </div>
        <div
          className="w-10 mr-2 relative"
          onClick={() =>
            setLotteryTickets((prev) => (prev >= maxTickets ? prev : prev + 1))
          }
          style={{
            opacity: lotteryTickets === maxTickets ? 0.5 : 1,
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
        How do I get tickets?
      </p>
      <div className="flex">
        <img src={SUNNYSIDE.icons.stopwatch} className="h-6 mr-2" />
        <p className="text-sm mb-1">
          At the end of the Auction, the results will be calculated.
        </p>
      </div>
      <div className="flex">
        <img src={SUNNYSIDE.icons.happy} className="h-6 mr-2" />
        <p className="text-sm mb-1">
          Participants who bid the most lottery tickets are able to craft the
          item.
        </p>
      </div>
      <div className="flex mb-4">
        <img src={SUNNYSIDE.icons.neutral} className="h-6 mr-2" />
        <div>
          <p className="text-sm mb-1">
            Participants who are unsuccesful will be refunded their resources.
          </p>
          <Label type="danger">Lottery tickets are non refundable</Label>
        </div>
      </div>

      <Button
        onClick={() => {
          onBid(lotteryTickets);
        }}
      >
        Bid
      </Button>
      <p className="text-xs underline text-center">Terms and conditions</p>
    </div>
  );
};
