import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import type { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { BONUSES } from "features/game/types/bonuses";
import { NPC_WEARABLES, type NPCName } from "lib/npcs";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const BONUS_NAME = "halloween-2026-gift";

type Step = "speaking" | "claim" | "claimed";

const _isClaimed = (state: MachineState) =>
  BONUSES[BONUS_NAME].isClaimed(state.context.state);

export const HalloweenGift: React.FC<{
  npc: NPCName;
  onClose: () => void;
}> = ({ npc, onClose }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const isClaimed = useSelector(gameService, _isClaimed);

  const [step, setStep] = useState<Step>(isClaimed ? "claimed" : "speaking");

  const claim = () => {
    gameService.send("bonus.claimed", { name: BONUS_NAME });
    onClose();
  };

  if (step === "claimed") {
    return (
      <SpeakingModal
        message={[{ text: t("halloween2026.gift.claimed") }]}
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES[npc]}
      />
    );
  }

  if (step === "speaking") {
    return (
      <SpeakingModal
        message={[{ text: t("npc.Modal.vampireJim") }]}
        onClose={() => setStep("claim")}
        bumpkinParts={NPC_WEARABLES[npc]}
      />
    );
  }

  return (
    <CloseButtonPanel bumpkinParts={NPC_WEARABLES[npc]} onClose={onClose}>
      <ClaimReward
        onClaim={claim}
        reward={{
          id: BONUS_NAME,
          items: BONUSES[BONUS_NAME].reward.inventory,
          wearables: BONUSES[BONUS_NAME].reward.wearables,
          sfl: 0,
          coins: 0,
        }}
      />
    </CloseButtonPanel>
  );
};
