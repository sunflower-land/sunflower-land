import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";

import coins from "assets/icons/coins.webp";
import factions from "assets/icons/factions.webp";
import flagIcon from "assets/icons/faction_point.webp";

import { Portal } from "./Portal";
import { InlineDialogue } from "../TypingMessage";
import { SUNNYSIDE } from "assets/sunnyside";
import { MinigameHistory, MinigamePrize } from "features/game/types/game";
import { secondsToString } from "lib/utils/time";
import { isMinigameComplete } from "features/game/events/minigames/claimMinigamePrize";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { hasFeatureAccess } from "lib/flags";

export const MinigamePrizeUI: React.FC<{
  prize?: MinigamePrize;
  history?: MinigameHistory;
}> = ({ prize, history }) => {
  const { t } = useAppTranslation();

  if (!prize) {
    return (
      <OuterPanel>
        <div className="px-1">
          <Label type="danger" icon={SUNNYSIDE.icons.sad}>
            {t("minigame.noPrizeAvailable")}
          </Label>
        </div>
      </OuterPanel>
    );
  }

  const isComplete = history && history.highscore >= prize.score;
  const secondsLeft = (prize.endAt - Date.now()) / 1000;

  return (
    <OuterPanel>
      <div className="px-1">
        <span className="text-xs mb-2">{`Mission: Rescue ${prize.score} chickens`}</span>
        <div className="flex justify-between mt-2 flex-wrap">
          {isComplete ? (
            <Label type="success" icon={SUNNYSIDE.icons.confirm}>
              {t("minigame.completed")}
            </Label>
          ) : (
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              {secondsToString(secondsLeft, { length: "medium" })}
            </Label>
          )}

          <div className="flex items-center space-x-2">
            {prize.factionPoints && (
              <Label icon={flagIcon} type="warning">
                {`${prize.factionPoints} Faction Points`}
              </Label>
            )}
            {!!prize.coins && (
              <Label icon={coins} type="warning">
                {prize.coins}
              </Label>
            )}
          </div>
        </div>
      </div>
    </OuterPanel>
  );
};

interface Props {
  onClose: () => void;
}

export const ChickenRescue: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const { t } = useAppTranslation();

  if (!hasFeatureAccess(gameState.context.state, "CHICKEN_RESCUE")) {
    return (
      <>
        <div className="mb-1 p-2">
          <Label type="default" className="mb-1" icon={factions}>
            {t("minigame.chickenRescue")}
          </Label>
          <div className="h-6">
            <InlineDialogue message={t("minigame.comingSoon")} />
          </div>
        </div>
      </>
    );
  }

  const dateKey = new Date().toISOString().slice(0, 10);
  const minigame = gameState.context.state.minigames.games["chicken-rescue"];
  const history = minigame?.history ?? {};

  const dailyAttempt = history[dateKey] ?? {
    attempts: 0,
    highscore: 0,
  };

  const prize = gameState.context.state.minigames.prizes["chicken-rescue"];

  const playNow = () => {
    setIsPlaying(true);
  };

  if (isPlaying) {
    return (
      <div>
        <Portal portalName="chicken-rescue" onClose={onClose} />
      </div>
    );
  }

  const onClaim = () => {
    gameService.send("minigame.prizeClaimed", {
      id: "chicken-rescue",
    });

    onClose();
  };

  const isComplete = isMinigameComplete({
    game: gameState.context.state,
    name: "chicken-rescue",
  });

  if (isComplete && !dailyAttempt.prizeClaimedAt) {
    return (
      <ClaimReward
        onClaim={onClaim}
        reward={{
          message:
            "Congratulations, you rescued the chickens! Here is your reward.",
          createdAt: Date.now(),
          factionPoints: 10,
          id: "discord-bonus",
          items: {},
          wearables: {},
          sfl: 0,
          coins: 0,
        }}
      />
    );
  }

  return (
    <>
      <div className="mb-1">
        <div className="p-2">
          <Label type="default" className="mb-1" icon={factions}>
            {t("minigame.chickenRescue")}
          </Label>
          <div className="h-6">
            <InlineDialogue message={t("minigame.chickenRescueHelp")} />
          </div>
        </div>

        <MinigamePrizeUI prize={prize} history={dailyAttempt} />
      </div>
      <Button onClick={playNow}>{t("minigame.playNow")}</Button>
    </>
  );
};
