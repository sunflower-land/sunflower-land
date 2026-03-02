import React, { useContext, useEffect, useState } from "react";
import * as AuthProvider from "features/auth/lib/Provider";
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
import { SpeakingText } from "features/game/components/SpeakingModal";
import { PortalLeaderboard } from "./PortalLeaderboard";
import { MachineState } from "features/game/lib/gameMachine";
import { MinigamePrizeUI } from "./MinigamePrizeUI";

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

interface Props {
  onClose: () => void;
}

const _minigames = (state: MachineState) => state.context.state.minigames;

export const FestivalOfColors2025: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthProvider.Context);

  const minigames = useSelector(gameService, _minigames);
  const minigame = minigames.games[PORTAL_NAME];
  const prize = minigames.prizes[PORTAL_NAME];

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
          { text: t("minigame.discovered.one") },
          { text: t("minigame.discovered.two") },
        ]}
        onClose={() => setShowIntro(false)}
      />
    );
  }

  const dateKey = new Date().toISOString().slice(0, 10);
  const history = minigame?.history ?? {};

  const dailyAttempt = history[dateKey] ?? { attempts: 0, highscore: 0 };

  const playNow = () => {
    setIsPlaying(true);
  };

  if (isPlaying) {
    return (
      <div>
        <Portal portalName={"festival-of-colors-2025"} onClose={onClose} />
      </div>
    );
  }

  const onClaim = () => {
    gameService.send({ type: "minigame.prizeClaimed", id: PORTAL_NAME });

    onClose();
  };

  const isComplete = isMinigameComplete({
    minigames,
    name: PORTAL_NAME,
  });

  if (isComplete && !dailyAttempt.prizeClaimedAt && prize) {
    return (
      <ClaimReward
        onClaim={onClaim}
        reward={{
          message: t(`${PORTAL_NAME}.portal.rewardMessage`),
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
        farmId={gameService.getSnapshot().context.farmId}
        jwt={authService.getSnapshot().context.user.rawToken as string}
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
        farmId={gameService.getSnapshot().context.farmId}
        jwt={authService.getSnapshot().context.user.rawToken as string}
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
