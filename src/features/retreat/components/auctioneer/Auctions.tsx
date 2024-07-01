import React from "react";
import { MachineInterpreter } from "features/game/lib/auctionMachine";
import { useActor } from "@xstate/react";
import { ButtonPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { ITEM_IDS } from "features/game/types/bumpkin";

import bg from "assets/ui/grey_background.png";
import sflIcon from "assets/icons/sfl.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { AuctionsComingSoon } from "./AuctionsComingSoon";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getImageUrl } from "lib/utils/getImageURLS";
import classNames from "classnames";

interface Props {
  auctionService: MachineInterpreter;
  onSelect: (id: string) => void;
}
export const Auctions: React.FC<Props> = ({ auctionService, onSelect }) => {
  const [auctioneerState] = useActor(auctionService);
  const { t } = useAppTranslation();

  const { auctions } = auctioneerState.context;

  const currentAuctions = auctions.filter(
    (auction) => auction.endAt > Date.now(),
  );
  if (currentAuctions.length === 0) {
    return <AuctionsComingSoon />;
  }

  return (
    <div
      style={{ maxHeight: "300px" }}
      className="overflow-y-auto scrollable flex flex-wrap pt-1.5 pr-0.5"
    >
      {currentAuctions.map((auction) => {
        const image =
          auction.type === "collectible"
            ? ITEM_DETAILS[auction.collectible].image
            : getImageUrl(ITEM_IDS[auction.wearable]);

        return (
          <ButtonPanel
            key={auction.auctionId}
            onClick={() => onSelect(auction.auctionId)}
            className="w-full cursor-pointer hover:bg-brown-300 !p-2 relative flex mb-1"
          >
            <div className="relative w-20 h-20 flex items-center justify-center mr-2">
              <img
                src={bg}
                className="w-full h-full absolute inset-0 rounded-md"
              />
              <img
                src={image}
                className={classNames({
                  "w-1/2 h-1/2 object-contain z-10":
                    auction.type === "collectible",
                  "w-full h-full object-contain z-10  rounded-md":
                    auction.type !== "collectible",
                })}
              />
              <Label type="default" className="absolute bottom-1 right-1 z-20">
                {auction.supply}
              </Label>
            </div>
            <div className="flex flex-col flex-1">
              <p className="text-sm">
                {auction.type === "collectible"
                  ? auction.collectible
                  : auction.wearable}
              </p>
              <div className="ml-1 hidden sm:flex my-1">
                {auction.sfl > 0 && (
                  <img src={sflIcon} className="h-4 img-highlight -ml-1" />
                )}
                {getKeys(auction.ingredients).map((name) => (
                  <img
                    src={ITEM_DETAILS[name].image}
                    className="h-4 img-highlight -ml-1"
                    key={name}
                  />
                ))}
              </div>
              {Date.now() > auction.startAt ? (
                <div>
                  <Label type="warning">{t("auction.live")}</Label>
                </div>
              ) : (
                <div className="flex-1 flex items-center  mt-1">
                  <img src={SUNNYSIDE.icons.stopwatch} className="h-5 mr-1" />
                  <span className="text-xs">
                    {new Date(auction.startAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </ButtonPanel>
        );
      })}
    </div>
  );
};
