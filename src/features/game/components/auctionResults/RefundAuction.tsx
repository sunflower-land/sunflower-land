import React from "react";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "../CloseablePanel";
import { Context as GameContext } from "features/game/GameProvider";
import * as AuthProvider from "features/auth/lib/Provider";
import { useContext } from "react";
import { Loser } from "features/retreat/components/auctioneer/Loser";
import { ITEM_DETAILS } from "features/game/types/images";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getImageUrl } from "lib/utils/getImageURLS";

export const RefundAuction: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(GameContext);
  const { t } = useAppTranslation();

  const bid = gameService.state.context.state.auctioneer.bid!;
  const image =
    bid.type === "collectible"
      ? ITEM_DETAILS[bid.collectible!].image
      : getImageUrl(ITEM_IDS[bid.wearable!]);

  const onClose = () => {
    gameService.send("CLOSE");
  };

  return (
    <Modal show={true} onHide={onClose}>
      <CloseButtonPanel onClose={onClose} title={t("statements.better.luck")}>
        <div className="flex items-center w-full justify-center pb-2">
          <img src={image} className="w-20 h-20" />
        </div>
        <Loser
          farmId={gameService.state.context.farmId}
          onRefund={() => {
            gameService.send("CLOSE");
          }}
          results={gameService.state.context.auctionResults!}
        />
      </CloseButtonPanel>
    </Modal>
  );
};
