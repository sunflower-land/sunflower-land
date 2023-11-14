import React from "react";

import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "../CloseablePanel";
import { Context as GameContext } from "features/game/GameProvider";
import * as AuthProvider from "features/auth/lib/Provider";
import { useContext } from "react";
import { Loser } from "features/retreat/components/auctioneer/Loser";
import { ITEM_DETAILS } from "features/game/types/images";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { ITEM_IDS } from "features/game/types/bumpkin";

export const RefundAuction: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(GameContext);

  const bid = gameService.state.context.state.auctioneer.bid!;
  const image =
    bid.type === "collectible"
      ? ITEM_DETAILS[bid.collectible!].image
      : getImageUrl(ITEM_IDS[bid.wearable!]);

  const onClose = () => {
    gameService.send("CLOSE");
  };

  return (
    <Modal centered show={true} onHide={onClose}>
      <CloseButtonPanel onClose={onClose} title={"Better luck next time!"}>
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
