import React from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import bg from "assets/ui/brown_background.png";

import { Button } from "components/ui/Button";
import { Bid } from "features/game/types/game";

import { getImageUrl } from "features/goblins/tailor/TabContent";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";

interface Props {
  onMint: (id: string) => void;
  bid: Bid;
}
export const Winner: React.FC<Props> = ({ onMint, bid }) => {
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
      <Button className="mt-2" onClick={() => onMint(bid.auctionId)}>
        Mint
      </Button>
    </div>
  );
};
