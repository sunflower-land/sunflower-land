import React from "react";
import { MachineInterpreter } from "features/game/lib/auctionMachine";
import { useActor } from "@xstate/react";
import { ButtonPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";

import token from "assets/icons/flower_token.webp";

import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { AuctionsComingSoon } from "./AuctionsComingSoon";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import classNames from "classnames";
import { isMobile } from "mobile-device-detect";
import { GameState } from "features/game/types/game";
import { getAuctionItemDisplay } from "./lib/getAuctionItemDisplay";
import { useNow } from "lib/utils/hooks/useNow";

interface Props {
  auctionService: MachineInterpreter;
  onSelect: (id: string) => void;
  game: GameState;
}
export const Auctions: React.FC<Props> = ({
  auctionService,
  onSelect,
  game,
}) => {
  const [auctioneerState] = useActor(auctionService);
  const { t } = useAppTranslation();
  const now = useNow();
  const { auctions } = auctioneerState.context;

  const currentAuctions = auctions.filter((auction) => auction.endAt > now);
  if (currentAuctions.length === 0) {
    return <AuctionsComingSoon />;
  }

  return (
    <div
      style={{ maxHeight: "300px" }}
      className="overflow-y-auto scrollable flex flex-wrap pt-1.5 pr-0.5"
    >
      {currentAuctions.map((auction) => {
        const { image, buffLabels, item, typeLabel } = getAuctionItemDisplay({
          auction,
          skills: game.bumpkin.skills,
          collectibles: game.collectibles,
        });

        const hasBuff = buffLabels && buffLabels.length > 0;

        return (
          <ButtonPanel
            key={auction.auctionId}
            onClick={() => onSelect(auction.auctionId)}
            className="w-full cursor-pointer hover:bg-brown-300 !p-2 relative flex mb-1"
          >
            {!isMobile && (
              <Label type="default" className="absolute top-1 right-1 z-30">
                {typeLabel}
              </Label>
            )}
            <div className="relative w-20 h-20 flex items-center justify-center mr-2">
              <img
                src={SUNNYSIDE.ui.grey_background}
                className="w-full h-full absolute inset-0 rounded-md"
              />
              <img
                src={image}
                className={classNames({
                  "w-1/2 h-1/2 object-contain z-10":
                    auction.type === "collectible" || auction.type === "nft",
                  "w-full h-full object-contain z-10 rounded-md":
                    auction.type === "wearable",
                })}
              />
              {hasBuff && (
                <img
                  src={"./erc1155/images/small_boost.png"}
                  className="absolute top-[1px] right-[1px] z-20"
                />
              )}
              <Label type="default" className="absolute bottom-1 right-1 z-20">
                {auction.supply}
              </Label>
            </div>
            <div className="flex flex-col flex-1">
              <p className="text-sm">{item}</p>
              <div className="ml-1 sm:flex my-1">
                {auction.sfl > 0 && (
                  <img src={token} className="h-4 img-highlight -ml-1" />
                )}
                {getKeys(auction.ingredients).map((name) => (
                  <img
                    src={ITEM_DETAILS[name].image}
                    className="h-4 img-highlight -ml-1"
                    key={name}
                  />
                ))}
              </div>
              {now > auction.startAt ? (
                <div>
                  <Label type="warning">{t("auction.live")}</Label>
                </div>
              ) : (
                <div className="flex-1 flex items-center  mt-1">
                  <img src={SUNNYSIDE.icons.stopwatch} className="h-5 mr-1" />
                  <span className="text-xs">
                    {new Date(auction.startAt).toLocaleString("en-AU", {
                      timeZoneName: "shortOffset",
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
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
