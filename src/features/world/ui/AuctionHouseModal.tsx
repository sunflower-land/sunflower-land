import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { EMPTY } from "features/game/lib/constants";
import { AuctioneerModal } from "features/retreat/components/auctioneer/AuctioneerModal";
import { hasFeatureAccess } from "lib/flags";
import React, { useContext } from "react";

interface Props {
  id: number;
  isOpen: boolean;
  closeModal: () => void;
}
export const AuctionHouseModal: React.FC<Props> = ({
  id,
  isOpen,
  closeModal,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const {
    context: { state, linkedWallet },
  } = gameState;

  return (
    <AuctioneerModal
      farmId={id}
      isOpen={isOpen}
      onClose={closeModal}
      gameState={state}
      onUpdate={(state) => {
        gameService.send("UPDATE", { state });
      }}
      onMint={(id) => {
        closeModal();
        if (hasFeatureAccess(EMPTY, "GASLESS_AUCTIONS")) {
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
            auctionId: id,
          },
        });
      }}
      deviceTrackerId={gameState.context.deviceTrackerId as string}
      linkedAddress={linkedWallet}
    />
  );
};
