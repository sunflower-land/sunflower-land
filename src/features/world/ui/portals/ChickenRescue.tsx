import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";

import coins from "assets/icons/coins.webp";
import giftIcon from "assets/icons/gift.png";
import factions from "assets/icons/factions.webp";

import { Portal } from "./Portal";
import { InlineDialogue } from "../TypingMessage";
import { SUNNYSIDE } from "assets/sunnyside";
import { MinigameHistory, MinigamePrize } from "features/game/types/game";
import { secondsToString } from "lib/utils/time";
import { isMinigameComplete } from "features/game/events/minigames/claimMinigamePrize";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";

export const MinigamePrizeUI: React.FC<{
  prize?: MinigamePrize;
  history?: MinigameHistory;
  mission: string;
}> = ({ prize, history, mission }) => {
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
        <span className="text-xs mb-2">{mission}</span>
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
            {getKeys(prize.items).map((item) => (
              <Label key={item} type="warning" icon={ITEM_DETAILS[item].image}>
                {`${prize.items[item]} x ${item}`}
              </Label>
            ))}
            {getKeys(prize.wearables).map((item) => (
              <Label key={item} type="warning" icon={giftIcon}>
                {`${prize.wearables[item]} x ${item}`}
              </Label>
            ))}
            {!!prize.coins && (
              <Label type="warning" icon={coins}>
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

  const minigame = gameState.context.state.minigames.games["chicken-rescue"];

  const [showIntro, setShowIntro] = useState(!minigame?.history);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const { t } = useAppTranslation();

  if (showIntro) {
    return (
      <SpeakingText
        message={[
          {
            text: t("minigame.discovered.one"),
          },
          {
            text: t("minigame.discovered.two"),
          },
        ]}
        onClose={() => setShowIntro(false)}
      />
    );
  }

  const dateKey = new Date().toISOString().slice(0, 10);
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

  if (isComplete && !dailyAttempt.prizeClaimedAt && prize) {
    return (
      <ClaimReward
        onClaim={onClaim}
        reward={{
          message:
            "Congratulations, you rescued the chickens! Here is your reward.",
          createdAt: Date.now(),
          factionPoints: 0,
          id: "discord-bonus",
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
            {t("minigame.chickenRescue")}
          </Label>
          <InlineDialogue message={t("minigame.chickenRescueHelp")} />
        </div>

        <MinigamePrizeUI
          prize={prize}
          history={dailyAttempt}
          mission={`Mission: Rescue ${prize?.score} chickens`}
        />
      </div>
      <Button onClick={playNow}>{t("minigame.playNow")}</Button>
    </>
  );
};
