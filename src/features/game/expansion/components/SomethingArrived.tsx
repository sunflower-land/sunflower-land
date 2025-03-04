import { useGame } from "features/game/GameProvider";
import React from "react";
import { ClaimReward } from "./ClaimReward";
import { getKeys } from "features/game/types/craftables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { InventoryItemName } from "features/game/types/game";
import { BumpkinItem } from "features/game/types/bumpkin";

const _revealed = (state: MachineState) => state.context.revealed;

export const SomethingArrived: React.FC = () => {
  const { gameService } = useGame();
  const revealed = useSelector(gameService, _revealed);

  const { t } = useAppTranslation();

  const {
    inventory = {} as Record<InventoryItemName, string>,
    wardrobe = {} as Record<BumpkinItem, number>,
    balance = 0,
    coins = 0,
  } = revealed ?? {};

  const items = getKeys(inventory);
  const sfl = Number(balance ?? 0);

  return (
    <ClaimReward
      label={t("reward.whatsNew")}
      reward={{
        createdAt: Date.now(),
        id: "something-arrived-reward",
        message: "Woohoo, something has arrived for you!",
        items: items.reduce(
          (acc, name) => ({
            ...acc,
            [name]: Number(revealed?.inventory[name] ?? 0),
          }),
          {},
        ),
        wearables: wardrobe,
        sfl,
        coins,
      }}
      onClaim={() => gameService.send("ACKNOWLEDGE")}
    />
  );
};
