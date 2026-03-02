import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import * as AuthProvider from "features/auth/lib/Provider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import factions from "assets/icons/factions.webp";
import { Portal } from "./Portal";
import { InlineDialogue } from "../TypingMessage";
import { isMinigameComplete } from "features/game/events/minigames/claimMinigamePrize";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { PortalLeaderboard } from "./PortalLeaderboard";
import { MachineState } from "features/game/lib/gameMachine";
import { MinigamePrizeUI } from "./MinigamePrizeUI";
interface Props {
  onClose: () => void;
}

const _minigames = (state: MachineState) => state.context.state.minigames;

export const FruitDash: React.FC<Props> = ({ onClose }) => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);

  const minigames = useSelector(gameService, _minigames);
  const minigame = minigames.games["fruit-dash"];
  const prize = minigames.prizes["fruit-dash"];

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [page, setPage] = useState<"play" | "leaderboard">("play");

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
        <Portal portalName="fruit-dash" onClose={onClose} />
      </div>
    );
  }

  const onClaim = () => {
    gameService.send({ type: "minigame.prizeClaimed", id: "fruit-dash" });

    onClose();
  };

  const isComplete = isMinigameComplete({
    minigames,
    name: "fruit-dash",
  });

  if (isComplete && !dailyAttempt.prizeClaimedAt && prize) {
    return (
      <ClaimReward
        onClaim={onClaim}
        reward={{
          message: t("fruit-dash.portal.rewardMessage"),
          factionPoints: 0,
          id: "fruit-dash-rewards",
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
        farmId={gameService.getSnapshot().context.farmId}
        jwt={authService.getSnapshot().context.user.rawToken as string}
        onBack={() => setPage("play")}
        name={"fruit-dash"}
      />
    );
  }

  return (
    <>
      <div className="mb-1">
        <div className="p-2">
          <Label type="default" className="mb-1" icon={factions}>
            {t("fruit-dash.portal.title")}
          </Label>
          <InlineDialogue message={t("fruit-dash.portal.description")} />
        </div>

        <MinigamePrizeUI
          prize={prize}
          history={dailyAttempt}
          mission={t("fruit-dash.portal.missionObjectives", {
            targetScore: prize?.score ?? 0,
          })}
        />
      </div>
      <div className="flex">
        <Button className="mr-1" onClick={() => setPage("leaderboard")}>
          {t("competition.leaderboard")}
        </Button>
        <Button onClick={playNow}>{t("minigame.playNow")}</Button>
      </div>
    </>
  );
};
