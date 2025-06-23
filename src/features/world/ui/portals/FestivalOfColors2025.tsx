import React, { useContext, useEffect, useState } from "react";
import * as AuthProvider from "features/auth/lib/Provider";
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
import { isMinigameComplete } from "features/game/events/minigames/claimMinigamePrize";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { PortalLeaderboard } from "./PortalLeaderboard";
import { secondsToString } from "lib/utils/time";

const PORTAL_NAME = "festival-of-colors-2025";

export function hasReadNotice() {
  return !!localStorage.getItem(`${PORTAL_NAME}.notice`);
}

function acknowledgeIntro() {
  return localStorage.setItem(
    `${PORTAL_NAME}.notice`,
    new Date().toISOString(),
  );
}

export const MinigamePrizeUI: React.FC<{
  prize?: MinigamePrize;
  history?: MinigameHistory;
  mission: string;
}> = ({ prize, history, mission }) => {
  const { t } = useAppTranslation();

  if (!prize) {
    return <></>;
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

export const FestivalOfColors2025: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { authService } = useContext(AuthProvider.Context);

  const minigame = gameState.context.state.minigames.games[PORTAL_NAME];

  const [showIntro, setShowIntro] = useState(!minigame?.history);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [page, setPage] = useState<"play" | "leaderboard" | "accumulator">(
    "play",
  );

  const { t } = useAppTranslation();

  useEffect(() => {
    acknowledgeIntro();
  }, []);

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

  const prize = gameState.context.state.minigames.prizes[PORTAL_NAME];

  const playNow = () => {
    setIsPlaying(true);
  };

  if (isPlaying) {
    return (
      <div>
        <Portal portalName={PORTAL_NAME} onClose={onClose} />
      </div>
    );
  }

  const onClaim = () => {
    gameService.send("minigame.prizeClaimed", {
      id: PORTAL_NAME,
    });

    onClose();
  };

  const isComplete = isMinigameComplete({
    game: gameState.context.state,
    name: PORTAL_NAME,
  });

  if (isComplete && !dailyAttempt.prizeClaimedAt && prize) {
    return (
      <ClaimReward
        onClaim={onClaim}
        reward={{
          message: t(`${PORTAL_NAME}.portal.rewardMessage`),
          createdAt: Date.now(),
          factionPoints: 0,
          id: `${PORTAL_NAME}-rewards`,
          items: prize.items,
          wearables: prize.wearables,
          sfl: 0,
          coins: prize.coins,
        }}
      />
    );
  }

  if (page === "leaderboard") {
    return (
      <PortalLeaderboard
        onBack={() => setPage("play")}
        name={PORTAL_NAME}
        startDate={new Date(Date.UTC(2025, 5, 30))}
        endDate={new Date(Date.UTC(2025, 6, 6))}
        farmId={gameService.state.context.farmId}
        jwt={authService.state.context.user.rawToken as string}
      />
    );
  }

  if (page === "accumulator") {
    return (
      <PortalLeaderboard
        isAccumulator
        onBack={() => setPage("play")}
        name={PORTAL_NAME}
        startDate={new Date(Date.UTC(2025, 5, 30))}
        endDate={new Date(Date.UTC(2025, 6, 6))}
        farmId={gameService.state.context.farmId}
        jwt={authService.state.context.user.rawToken as string}
      />
    );
  }

  return (
    <>
      <div className="mb-1">
        <div className="p-2">
          <Label type="default" className="mb-1" icon={factions}>
            {t(`${PORTAL_NAME}.portal.title`)}
          </Label>
          <InlineDialogue message={t(`${PORTAL_NAME}.portal.description`)} />
        </div>

        <MinigamePrizeUI
          prize={prize}
          history={dailyAttempt}
          mission={t(`${PORTAL_NAME}.portal.missionObjectives`, {
            targetScore: prize?.score ?? 0,
          })}
        />
      </div>
      <div className="flex gap-1">
        <Button onClick={() => setPage("accumulator")}>
          {t("competition.accumulator")}
        </Button>
        <Button onClick={playNow}>{t("minigame.playNow")}</Button>
      </div>
    </>
  );
};
