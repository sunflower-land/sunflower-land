import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import { Button } from "components/ui/Button";

import { Context } from "../GameProvider";
import { getKeys } from "../types/craftables";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ClaimReward } from "../expansion/components/ClaimReward";
import Gift from "assets/icons/gift.png";
import Lightning from "assets/icons/lightning.png";

export const Revealed: React.FC<{
  onAcknowledged?: () => void;
  id?: string;
  streaks?: boolean;
}> = ({ onAcknowledged, id, streaks = false }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { t } = useAppTranslation();

  const handleAcknowledge = () => {
    gameService.send({ type: "CONTINUE", id });
    if (onAcknowledged) onAcknowledged();
  };

  const items = getKeys(gameState.context.revealed?.inventory ?? {});
  const sfl = Number(gameState.context.revealed?.balance ?? 0);
  const coins = gameState.context.revealed?.coins ?? 0;

  const currentStreaks = gameState.context.state.dailyRewards?.streaks ?? 1;
  const streakBonus = currentStreaks % 5 == 0;

  const isOneYearStreakCycle = currentStreaks % 365 === 0;

  return (
    <>
      <ClaimReward
        reward={{
          id: "revealed-reward",
          items: items.reduce(
            (acc, name) => ({
              ...acc,
              [name]: Number(gameState.context.revealed?.inventory[name] ?? 0),
            }),
            {},
          ),
          wearables: gameState.context.revealed?.wardrobe ?? {},
          sfl,
          coins,
        }}
      />
      {streaks && streakBonus && (
        <div className="flex flex-col items-center p-2">
          <Label
            type="vibrant"
            icon={isOneYearStreakCycle ? Gift : Lightning}
            className="px-0.5 text-sm"
          >
            {isOneYearStreakCycle
              ? t("reward.streak.oneYear")
              : t("reward.streakBonus")}
          </Label>
        </div>
      )}
      <Button onClick={handleAcknowledge}>{t("continue")}</Button>
    </>
  );
};
