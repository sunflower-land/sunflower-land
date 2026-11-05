import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import factions from "assets/icons/factions.webp";
import { Portal } from "./Portal";
import { InlineDialogue } from "../TypingMessage";
import {
  getMinigamePrizeReward,
  isMinigameComplete,
} from "features/game/events/minigames/claimMinigamePrize";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import type { MachineState } from "features/game/lib/gameMachine";
import { MinigamePrizeUI } from "./MinigamePrizeUI";
interface Props {
  onClose: () => void;
}

const _minigames = (state: MachineState) => state.context.state.minigames;

export const Halloween2026: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);

  const minigames = useSelector(gameService, _minigames);
  const minigame = minigames.games["halloween-2026-game-2"];
  const prize = minigames.prizes["halloween-2026-game-2"];

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const { t } = useAppTranslation();

  const dateKey = new Date().toISOString().slice(0, 10);
  const history = minigame?.history ?? {};

  const dailyAttempt = history[dateKey] ?? { attempts: 0, highscore: 0 };

  const playNow = () => {
    setIsPlaying(true);
  };

  if (isPlaying) {
    return (
      <div>
        <Portal portalName="halloween-2026-game-2" onClose={onClose} />
      </div>
    );
  }

  const onClaim = () => {
    gameService.send("minigame.prizeClaimed", { id: "halloween-2026-game-2" });

    onClose();
  };

  const isComplete = isMinigameComplete({
    minigames,
    name: "halloween-2026-game-2",
  });

  if (isComplete && !dailyAttempt.prizeClaimedAt && prize) {
    // A tiered prize pays the tier the latest run reached
    const reward =
      getMinigamePrizeReward({ prize, history: dailyAttempt }) ?? prize;

    return (
      <ClaimReward
        onClaim={onClaim}
        reward={{
          message: t("halloween.portal.rewardMessage"),
          factionPoints: 0,
          id: "halloween-2026-game-2-rewards",
          items: reward.items,
          wearables: reward.wearables,
          sfl: 0,
          coins: reward.coins,
        }}
      />
    );
  }

  return (
    <>
      <div className="mb-1">
        <div className="p-2">
          <Label type="default" className="mb-1" icon={factions}>
            {t("halloween2026.portal.title")}
          </Label>
          <InlineDialogue message={t("halloween2026.portal.description")} />
        </div>

        <MinigamePrizeUI
          prize={prize}
          history={dailyAttempt}
          mission={t("halloween2026.portal.missionObjectives")}
        />
      </div>
      <div className="flex">
        <Button onClick={playNow}>{t("minigame.playNow")}</Button>
      </div>
    </>
  );
};
