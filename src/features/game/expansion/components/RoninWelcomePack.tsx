import React from "react";
import { useGame } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { SpecialEventName } from "features/game/types/specialEvents";
import { Airdrop } from "features/game/types/game";
import { ClaimReward } from "./ClaimReward";

const _specialEvents = (state: MachineState) =>
  state.context.state.specialEvents;

export const RoninWelcomePack: React.FC = () => {
  const { gameService } = useGame();
  const specialEvents = useSelector(gameService, _specialEvents);
  const roninWelcomePacks: SpecialEventName[] = [
    "Ronin Platinum Pack",
    "Ronin Gold Pack",
    "Ronin Silver Pack",
    "Ronin Bronze Pack",
  ];

  const roninWelcomePack = roninWelcomePacks.find(
    (pack) => specialEvents.current[pack]?.isEligible,
  );

  if (!roninWelcomePack) {
    return null;
  }

  const roninAirdrop = specialEvents.current[roninWelcomePack];

  const roninAirdropDetails: Airdrop = {
    id: "",
    createdAt: 0,
    ...(roninAirdrop?.tasks[0].reward ?? {
      wearables: {},
      items: {},
      sfl: 0,
      coins: 0,
    }),
    message: roninAirdrop?.text,
  };

  return (
    <ClaimReward
      reward={roninAirdropDetails}
      onClaim={() => {
        gameService.send("specialEvent.taskCompleted", {
          event: roninWelcomePack,
          task: 1,
        });
        gameService.send("CLOSE");
      }}
      onClose={() => gameService.send("CLOSE")}
      label={roninWelcomePack}
    />
  );
};
