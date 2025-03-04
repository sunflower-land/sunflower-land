import React from "react";

import { Button } from "components/ui/Button";

import { useGame } from "../GameProvider";
import { getKeys } from "../types/craftables";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ClaimReward } from "../expansion/components/ClaimReward";
import Gift from "assets/icons/gift.png";
import Lightning from "assets/icons/lightning.png";
import { MachineState } from "../lib/gameMachine";
import { useSelector } from "@xstate/react";
import { InventoryItemName } from "../types/game";
import { BumpkinItem } from "../types/bumpkin";

const _revealed = (state: MachineState) => state.context.revealed;
const _currentStreaks = (state: MachineState) =>
  state.context.state.dailyRewards?.streaks ?? 1;

export const Revealed: React.FC<{
  onAcknowledged?: () => void;
  id?: string;
  streaks?: boolean;
}> = ({ onAcknowledged, id, streaks = false }) => {
  const { gameService } = useGame();
  const revealed = useSelector(gameService, _revealed);
  const { t } = useAppTranslation();

  const handleAcknowledge = () => {
    gameService.send({ type: "CONTINUE", id });
    if (onAcknowledged) onAcknowledged();
  };

  const {
    inventory = {} as Record<InventoryItemName, string>,
    wardrobe = {} as Record<BumpkinItem, number>,
    balance = 0,
    coins = 0,
  } = revealed ?? {};

  const items = getKeys(inventory);
  const sfl = Number(balance);

  const currentStreaks = useSelector(gameService, _currentStreaks);
  const streakBonus = currentStreaks % 5 == 0;

  return (
    <>
      <ClaimReward
        reward={{
          createdAt: Date.now(),
          id: "revealed-reward",
          items: items.reduce(
            (acc, name) => ({
              ...acc,
              [name]: Number(inventory[name] ?? 0),
            }),
            {},
          ),
          wearables: wardrobe,
          sfl,
          coins,
        }}
      />
      {streaks && streakBonus && (
        <div className="flex flex-col items-center p-2">
          <Label
            type="vibrant"
            icon={currentStreaks === 365 ? Gift : Lightning}
            className="px-0.5 text-sm"
          >
            {currentStreaks === 365
              ? t("reward.streak.oneYear")
              : t("reward.streakBonus")}
          </Label>
        </div>
      )}
      <Button onClick={handleAcknowledge}>{t("continue")}</Button>
    </>
  );
};
