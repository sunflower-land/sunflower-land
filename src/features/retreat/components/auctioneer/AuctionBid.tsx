import React, { useState } from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import token from "assets/icons/flower_token.webp";

import { Button } from "components/ui/Button";
import { Bid } from "features/game/types/game";

import { Auction, MachineInterpreter } from "features/game/lib/auctionMachine";
import { getKeys } from "features/game/types/craftables";
import { TimerDisplay } from "./AuctionDetails";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { getAuctionItemImage } from "./lib/getAuctionItemDisplay";
import { useNow } from "lib/utils/hooks/useNow";

const AUCTION_BUFFER_SECONDS = 30;

interface Props {
  auction: Auction;
  auctionService: MachineInterpreter;
  bid: Bid;
}
export const AuctionBid: React.FC<Props> = ({
  auction,
  bid,
  auctionService,
}) => {
  const readyAt = auction.endAt + AUCTION_BUFFER_SECONDS * 1000;
  const ready = useCountdown(readyAt);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const image = getAuctionItemImage(auction);
  const now = useNow({ live: true, autoEndAt: readyAt });
  const canCancel = now < auction.endAt;
  const canReveal = now >= readyAt;

  const { t } = useAppTranslation();

  return (
    <div className="flex justify-center flex-col w-full items-center">
      <div className="relative my-2">
        <img
          src={SUNNYSIDE.ui.grey_background}
          className="w-48 object-contain rounded-md"
        />
        <div className="absolute inset-0">
          <img
            src={image}
            className="absolute w-1/2 z-20 object-cover mb-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </div>

      <span className="mt-1 ml-2 text-center mb-2 text-sm">
        {t("auction.bid.message")}
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
      <TimerDisplay time={ready} />

      {canCancel && (
        <div className="flex flex-row items-center w-full gap-1 mt-2">
          {cancelConfirm && (
            <Button onClick={() => setCancelConfirm(false)}>
              {t("auction.doNotCancel")}
            </Button>
          )}
          <Button
            onClick={() =>
              cancelConfirm
                ? auctionService.send({ type: "CANCEL" })
                : setCancelConfirm(true)
            }
          >
            {t("auction.cancelBid")}
          </Button>
        </div>
      )}

      {canReveal && (
        <Button
          className="mt-2"
          disabled={!canReveal}
          onClick={() => auctionService.send({ type: "CHECK_RESULTS" })}
        >
          {t("auction.reveal")}
        </Button>
      )}
    </div>
  );
};
