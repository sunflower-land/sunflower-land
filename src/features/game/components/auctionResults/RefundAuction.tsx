import React from "react";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "../CloseablePanel";
import { Context as GameContext } from "features/game/GameProvider";
import { useContext } from "react";
import { Loser } from "features/retreat/components/auctioneer/Loser";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getAuctionItemImage } from "features/retreat/components/auctioneer/lib/getAuctionItemDisplay";

export const RefundAuction: React.FC = () => {
  const { gameService } = useContext(GameContext);
  const { t } = useAppTranslation();

  const bid = gameService.getSnapshot().context.state.auctioneer.bid!;
  const { image } = getAuctionItemImage(bid);

  const onClose = () => {
    gameService.send({ type: "CLOSE" });
  };

  return (
    <Modal show={true} onHide={onClose}>
      <CloseButtonPanel onClose={onClose} title={t("statements.better.luck")}>
        <div className="flex items-center w-full justify-center pb-2">
          <img src={image} className="w-20 h-20" />
        </div>
        <Loser
          farmId={gameService.getSnapshot().context.farmId}
          onRefund={() => {
            gameService.send({ type: "CLOSE" });
          }}
          results={gameService.getSnapshot().context.auctionResults!}
        />
      </CloseButtonPanel>
    </Modal>
  );
};
