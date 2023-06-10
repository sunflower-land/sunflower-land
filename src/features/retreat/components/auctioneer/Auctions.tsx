import React from "react";
import { Auction, MachineInterpreter } from "features/game/lib/auctionMachine";
import { useActor } from "@xstate/react";
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { ITEM_IDS } from "features/game/types/bumpkin";

import bg from "assets/ui/brown_background.png";
import sflIcon from "assets/icons/token_2.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { pixelGrayBorderStyle } from "features/game/lib/style";

interface Props {
  auctionService: MachineInterpreter;
  onSelect: (id: string) => void;
}
export const Auctions: React.FC<Props> = ({ auctionService, onSelect }) => {
  const [auctioneerState, send] = useActor(auctionService);

  const { auctions, auctionId } = auctioneerState.context;

  if (auctions.length === 0) {
    return <div>No auctions</div>;
  }

  return (
    <div
      style={{ maxHeight: "300px" }}
      className="overflow-y-auto scrollable flex flex-wrap pt-1.5 pr-0.5"
    >
      {auctions.map((auction) => {
        const image =
          auction.type === "collectible"
            ? ITEM_DETAILS[auction.collectible].image
            : getImageUrl(ITEM_IDS[auction.wearable]);

        return (
          <OuterPanel
            onClick={() => onSelect(auction.auctionId)}
            className="w-full cursor-pointer hover:bg-brown-300 p-2 relative flex mb-1"
          >
            {Date.now() > auction.startAt && (
              <div className="absolute right-0 -top-3.5">
                <Label type="warning">Auction is live</Label>
              </div>
            )}

            <div className="relative w-20 h-20 flex items-center justify-center mr-2">
              <img
                src={bg}
                className="w-full h-full absolute inset-0 rounded-md"
              />
              <img src={image} className="w-2/3 object-fit z-10" />
              <span
                className="absolute bottom-1 right-1 z-20 bg-silver-500 text-xxs px-0.5 pb-0.5  rounded-md inline-flex items-center"
                style={{ ...pixelGrayBorderStyle }}
              >
                {auction.supply}
              </span>
            </div>
            <div className="flex flex-col flex-1">
              <p className="text-sm">
                {auction.type === "collectible"
                  ? auction.collectible
                  : auction.wearable}
              </p>
              <div className="ml-1 hidden sm:flex my-1">
                {auction.sfl && (
                  <img src={sflIcon} className="h-5 img-highlight -ml-1" />
                )}
                {getKeys(auction.ingredients).map((name) => (
                  <img
                    src={ITEM_DETAILS[name].image}
                    className="h-5 img-highlight -ml-1"
                  />
                ))}
              </div>
              <div className="flex-1 flex items-center  mt-1">
                <img src={SUNNYSIDE.icons.stopwatch} className="h-5 mr-1" />
                <span className="text-xs">20/20/2022 9am</span>
              </div>
            </div>
          </OuterPanel>
        );
      })}
    </div>
  );
};
