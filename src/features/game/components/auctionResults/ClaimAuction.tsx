import React from "react";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "../CloseablePanel";
import { Winner } from "features/retreat/components/auctioneer/Winner";
import { Context as GameContext } from "features/game/GameProvider";
import { useContext } from "react";
import { ITEM_DETAILS } from "features/game/types/images";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getImageUrl } from "lib/utils/getImageURLS";
import { Transaction } from "features/island/hud/Transaction";
import { hasFeatureAccess } from "lib/flags";

export const ClaimAuction: React.FC = () => {
  const { gameService } = useContext(GameContext);
  const { t } = useAppTranslation();

  const bid = gameService.getSnapshot().context.state.auctioneer.bid!;
  const image =
    bid.type === "collectible"
      ? ITEM_DETAILS[bid.collectible!].image
      : getImageUrl(ITEM_IDS[bid.wearable!]);

  const onClose = () => {
    gameService.send("CLOSE");
  };

  const transaction = gameService.getSnapshot().context.state.transaction;
  if (transaction) {
    return <Transaction isBlocked onClose={onClose} />;
  }

  return (
    <Modal show={true} onHide={onClose}>
      <CloseButtonPanel onClose={onClose} title={t("auction.winner")}>
        <div className="flex items-center w-full justify-center">
          <img src={image} className="w-20 h-20" />
        </div>
        <Winner
          onMint={() => {
            if (
              hasFeatureAccess(
                gameService.state.context.state,
                "GASLESS_AUCTIONS",
              )
            ) {
              gameService.send("auction.claimed", {
                effect: {
                  type: "auction.claimed",
                },
              });

              return;
            }

            gameService.send("TRANSACT", {
              transaction: "transaction.bidMinted",
              request: {
                auctionId: bid.auctionId,
              },
            });
          }}
          bid={gameService.getSnapshot().context.state.auctioneer.bid!}
          farmId={gameService.getSnapshot().context.farmId}
          results={gameService.getSnapshot().context.auctionResults!}
        />
      </CloseButtonPanel>
    </Modal>
  );
};
