import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";

import coins from "assets/icons/coins.webp";
import factions from "assets/icons/factions.webp";
import markIcon from "assets/icons/faction_mark.webp";

import { Portal } from "./Portal";
import { InlineDialogue } from "../TypingMessage";
import { SUNNYSIDE } from "assets/sunnyside";
import { MinigameHistory, MinigamePrize } from "features/game/types/game";
import { secondsToString } from "lib/utils/time";
import { isMinigameComplete } from "features/game/events/minigames/claimMinigamePrize";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { secondsTillReset } from "features/helios/components/hayseedHank/HayseedHankV2";

interface Props {
  onClose: () => void;
}

export const FestivalOfColors: React.FC<Props> = ({ onClose }) => {
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
            text: "intro",
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

  return (
    <>
      <div className="mb-1">
        <div className="p-2">
          <div className="flex flex-wrap mb-1 ">
            <Label type="default" className="mr-1" icon={factions}>
              Festival of colors
            </Label>
            <Label type="info">
              {`${secondsToString(secondsTillReset(), {
                length: "short",
              })} left`}
            </Label>
          </div>
          <InlineDialogue message={t("Howdy howdy howdy")} />
        </div>
      </div>
      <Button onClick={playNow}>{t("minigame.playNow")}</Button>
    </>
  );
};
