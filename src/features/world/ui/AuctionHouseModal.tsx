import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { AuctioneerModal } from "features/retreat/components/auctioneer/AuctioneerModal";
import { useSound } from "lib/utils/hooks/useSound";
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

  const claimSound = useSound("claim_reward");

  return (
    <AuctioneerModal
      farmId={id}
      isOpen={isOpen}
      onClose={closeModal}
      gameState={state}
      onUpdate={(state) => {
        gameService.send("UPDATE", { state });
      }}
      onMint={() => {
        closeModal();
        claimSound.play();
        gameService.send("auction.claimed", {
          effect: {
            type: "auction.claimed",
          },
        });
      }}
      deviceTrackerId={gameState.context.deviceTrackerId as string}
      linkedAddress={linkedWallet}
    />
  );
};
