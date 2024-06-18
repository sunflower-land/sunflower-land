import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";

import factions from "assets/icons/factions.webp";

import { Portal } from "./Portal";
import { InlineDialogue } from "../TypingMessage";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { MinigamePrizeUI } from "./ChickenRescue";
import { hasFeatureAccess } from "lib/flags";

interface Props {
  onClose: () => void;
}

export const FestivalOfColors: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const minigame =
    gameState.context.state.minigames.games["festival-of-colors"];

  const [showIntro, setShowIntro] = useState(!minigame?.history);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const { t } = useAppTranslation();

  if (!hasFeatureAccess(gameState.context.state, "FESTIVAL_OF_COLORS")) {
    return (
      <SpeakingText
        message={[
          {
            text: t("minigame.festivalOfColors.comingSoon"),
          },
        ]}
        onClose={() => setShowIntro(false)}
      />
    );
  }

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

  const playNow = () => {
    setIsPlaying(true);
  };

  if (isPlaying) {
    return (
      <div>
        <Portal portalName="festival-of-colors" onClose={onClose} />
      </div>
    );
  }

  const dateKey = new Date().toISOString().slice(0, 10);
  const history = minigame?.history ?? {};

  const dailyAttempt = history[dateKey] ?? {
    attempts: 0,
    highscore: 0,
  };

  const prize = gameState.context.state.minigames.prizes["festival-of-colors"];

  return (
    <>
      <div className="mb-1">
        <div className="p-2">
          <div className="flex flex-wrap items-center mb-1 ">
            <Label type="default" className="mr-1" icon={factions}>
              {t("minigame.festivalOfColors")}
            </Label>
            <Label type="vibrant">{t("minigame.communityEvent")}</Label>
          </div>
          <InlineDialogue message={t("minigame.festivalOfColors.intro")} />
        </div>
        <MinigamePrizeUI
          prize={prize}
          history={dailyAttempt}
          mission={t("minigame.festivalOfColors.mission")} //"Find the paint bombs!"
        />
      </div>
      <Button onClick={playNow}>{t("minigame.playNow")}</Button>
    </>
  );
};
