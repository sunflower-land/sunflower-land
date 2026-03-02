import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import factions from "assets/icons/factions.webp";
import { Portal } from "./Portal";
import { InlineDialogue } from "../TypingMessage";
import { isMinigameComplete } from "features/game/events/minigames/claimMinigamePrize";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { MinigamePrizeUI } from "./MinigamePrizeUI";
import { MachineState } from "features/game/lib/gameMachine";

interface Props {
  onClose: () => void;
}

const _minigames = (state: MachineState) => state.context.state.minigames;

export const CropsAndChickens: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const minigames = useSelector(gameService, _minigames);
  const minigame = minigames.games["crops-and-chickens"];
  const prize = minigames.prizes["crops-and-chickens"];

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const { t } = useAppTranslation();

  const dateKey = new Date().toISOString().slice(0, 10);
  const history = minigame?.history ?? {};

  const dailyAttempt = history[dateKey] ?? {
    attempts: 0,
    highscore: 0,
  };

  const playNow = () => {
    setIsPlaying(true);
  };

  if (isPlaying) {
    return (
      <div>
        <Portal portalName="crops-and-chickens" onClose={onClose} />
      </div>
    );
  }

  const onClaim = () => {
    gameService.send({
      type: "minigame.prizeClaimed",
      id: "crops-and-chickens",
    });

    onClose();
  };

  const isComplete = isMinigameComplete({
    minigames,
    name: "crops-and-chickens",
  });

  if (isComplete && !dailyAttempt.prizeClaimedAt && prize) {
    return (
      <ClaimReward
        onClaim={onClaim}
        reward={{
          message: t("crops-and-chickens.portal.rewardMessage"),
          factionPoints: 0,
          id: "crops-and-chickens-rewards",
          items: prize.items,
          wearables: prize.wearables,
          sfl: 0,
          coins: prize.coins,
        }}
      />
    );
  }

  return (
    <>
      <div className="mb-1">
        <div className="p-2">
          <Label type="default" className="mb-1" icon={factions}>
            {t("crops-and-chickens.portal.title")}
          </Label>
          <InlineDialogue
            message={t("crops-and-chickens.portal.description")}
          />
        </div>

        <MinigamePrizeUI
          prize={prize}
          history={dailyAttempt}
          mission={t("crops-and-chickens.portal.missionObjectives", {
            targetScore: prize?.score ?? 0,
          })}
        />
      </div>
      <Button onClick={playNow}>{t("minigame.playNow")}</Button>
    </>
  );
};
