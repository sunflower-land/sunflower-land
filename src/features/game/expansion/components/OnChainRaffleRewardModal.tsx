import React, { useContext } from "react";
import { Modal } from "components/ui/Modal";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ClaimReward } from "./ClaimReward";
import { OnChainRafflePetModal } from "./OnChainRafflePetModal";
import { OnChainRaffleBudModal } from "./OnChainRaffleBudModal";
import { Airdrop } from "features/game/types/game";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";

const _reward = (state: MachineState) => state.context.onChainRaffleReward;

export const OnChainRaffleRewardModal: React.FC = () => {
  const { gameService } = useContext(Context);
  const reward = useSelector(gameService, _reward);

  if (!reward || !reward.onChain) return null;

  if (reward.type === "Pet") {
    const petId = Number(reward.nft.split("#")[1]);
    return <OnChainRafflePetModal petId={petId} />;
  }

  if (reward.type === "Bud") {
    const budId = Number(reward.nft.split("#")[1]);
    return <OnChainRaffleBudModal budId={budId} />;
  }

  const onClose = () => gameService.send("CONTINUE");

  const rewardForClaim: Omit<Airdrop, "createdAt"> = {
    id: "on-chain-raffle",
    items: reward.type === "collectible" ? (reward.items ?? {}) : {},
    wearables: reward.type === "wearable" ? (reward.wearables ?? {}) : {},
    sfl: 0,
    coins: 0,
    message: "Congratulations, you've won a raffle prize!",
  };

  return (
    <Modal show={true} onHide={onClose}>
      <CloseButtonPanel onClose={onClose}>
        <ClaimReward
          reward={rewardForClaim}
          onClose={onClose}
          label="Raffle Prize"
        />
      </CloseButtonPanel>
    </Modal>
  );
};
