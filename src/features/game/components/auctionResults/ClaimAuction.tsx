import React from "react";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "../CloseablePanel";
import { Winner } from "features/retreat/components/auctioneer/Winner";
import { Context as GameContext } from "features/game/GameProvider";
import { useContext } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Transaction } from "features/island/hud/Transaction";
import { getAuctionItemImage } from "features/retreat/components/auctioneer/lib/getAuctionItemDisplay";

export const ClaimAuction: React.FC = () => {
  const { gameService } = useContext(GameContext);
  const { t } = useAppTranslation();

  const bid = gameService.getSnapshot().context.state.auctioneer.bid!;
  const image = getAuctionItemImage(bid);

  const onClose = () => {
    gameService.send({ type: "CLOSE" });
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
            gameService.send("auction.claimed", {
              effect: {
                type: "auction.claimed",
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
