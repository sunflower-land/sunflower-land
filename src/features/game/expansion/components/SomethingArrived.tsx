import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import React, { useContext } from "react";
import { ClaimReward } from "./ClaimReward";
import { getKeys } from "features/game/types/craftables";

export const SomethingArrived: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const changeset = gameState.context.revealed;

  const items = getKeys(changeset?.inventory ?? {});
  const wardrobe = changeset?.wardrobe ?? {};
  const sfl = Number(changeset?.balance ?? 0);
  const coins = changeset?.coins ?? 0;

  return (
    <ClaimReward
      reward={{
        createdAt: Date.now(),
        id: "something-arrived-reward",
        message: "Woohoo, something has arrived for you!",
        items: items.reduce(
          (acc, name) => ({
            ...acc,
            [name]: Number(gameState.context.revealed?.inventory[name] ?? 0),
          }),
          {}
        ),
        wearables: wardrobe,
        sfl,
        coins,
      }}
      onClaim={() => gameService.send("ACKNOWLEDGE")}
    />
  );
};
