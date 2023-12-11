import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { PromotingModal } from "features/game/expansion/components/SpecialOffer";
import React, { useContext } from "react";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
}

export const PlazaBanner: React.FC<Props> = ({ isOpen, closeModal }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const state = gameState.context.state;

  return (
    <PromotingModal
      isOpen={isOpen}
      hasDiscount={!!state.inventory["Witches' Eve Banner"]}
      hasPurchased={!!state.inventory["Catch the Kraken Banner"]}
      onClose={closeModal}
    />
  );
};
