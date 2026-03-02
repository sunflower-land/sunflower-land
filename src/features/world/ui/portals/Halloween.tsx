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
import { MachineState } from "features/game/lib/gameMachine";
import { MinigamePrizeUI } from "./MinigamePrizeUI";
interface Props {
  onClose: () => void;
}

const _minigames = (state: MachineState) => state.context.state.minigames;

export const Halloween: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);

  const minigames = useSelector(gameService, _minigames);
  const minigame = minigames.games["halloween"];
  const prize = minigames.prizes["halloween"];

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
        <Portal portalName="halloween" onClose={onClose} />
      </div>
    );
  }

  const onClaim = () => {
    gameService.send({ type: "minigame.prizeClaimed", id: "halloween" });

    onClose();
  };

  const isComplete = isMinigameComplete({
    minigames,
    name: "halloween",
  });

  if (isComplete && !dailyAttempt.prizeClaimedAt && prize) {
    return (
      <ClaimReward
        onClaim={onClaim}
        reward={{
          message: t("halloween.portal.rewardMessage"),
          factionPoints: 0,
          id: "halloween-rewards",
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
            {t("halloween.portal.title")}
          </Label>
          <InlineDialogue message={t("halloween.portal.description")} />
        </div>

        <MinigamePrizeUI
          prize={prize}
          history={dailyAttempt}
          mission={t("halloween.portal.missionObjectives")}
        />
      </div>
      <div className="flex">
        <Button onClick={playNow}>{t("minigame.playNow")}</Button>
      </div>
    </>
  );
};
