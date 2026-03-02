import { MachineState } from "features/game/lib/gameMachine";
import { useGame } from "features/game/GameProvider";
import React from "react";
import { useSelector } from "@xstate/react";
import { Airdrop } from "features/game/types/game";
import { ClaimReward } from "./ClaimReward";
import { Button } from "components/ui/Button";
import { useTranslation } from "react-i18next";
const _specialEvents = (state: MachineState) =>
  state.context.state.specialEvents;

export const RoninJinClaim: React.FC = () => {
  const { gameService } = useGame();
  const specialEvents = useSelector(gameService, _specialEvents);

  const { t } = useTranslation();

  const jinAirdrop = specialEvents.current["Jin Airdrop"];

  if (!jinAirdrop?.isEligible) {
    return (
      <Button onClick={() => gameService.send({ type: "CLOSE" })}>
        {t("continue")}
      </Button>
    );
  }

  const jinAirdropDetails: Airdrop = {
    id: "",
    createdAt: 0,
    ...(jinAirdrop.tasks[0].reward ?? {
      wearables: {},
      items: {},
      sfl: 0,
      coins: 0,
    }),
    message: jinAirdrop.text,
  };

  return (
    <ClaimReward
      reward={jinAirdropDetails}
      onClaim={() => {
        gameService.send({
          type: "specialEvent.taskCompleted",
          event: "Jin Airdrop",
          task: 1,
        });
        gameService.send({ type: "CLOSE" });
      }}
      onClose={() => gameService.send({ type: "CLOSE" })}
      label="Jin Airdrop"
    />
  );
};
