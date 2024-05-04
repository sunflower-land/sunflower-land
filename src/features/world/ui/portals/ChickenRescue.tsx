import React, { useContext, useEffect, useState } from "react";
import { Button } from "components/ui/Button";
import * as AuthProvider from "features/auth/lib/Provider";
import { portal } from "../community/actions/portal";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import {
  MinigameName,
  SUPPORTED_MINIGAMES,
} from "features/game/types/minigames";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { OuterPanel, Panel } from "components/ui/Panel";
import { Label } from "components/ui/Label";

import chickenRescueBanner from "assets/portals/chicken_rescue_preview.png";
import coins from "assets/icons/coins.webp";
import flagIcon from "assets/icons/faction_point.webp";

import { Portal } from "./Portal";
import { InlineDialogue } from "../TypingMessage";
import { SUNNYSIDE } from "assets/sunnyside";
import { MinigameHistory, MinigamePrize } from "features/game/types/game";
import { secondsToString } from "lib/utils/time";

export const MinigamePrizeUI: React.FC<{
  prize?: MinigamePrize;
  history?: MinigameHistory;
}> = ({ prize, history }) => {
  if (!prize) {
    return (
      <OuterPanel>
        <div className="px-1">
          <Label type="danger" icon={SUNNYSIDE.icons.sad}>
            No daily prize available
          </Label>
        </div>
      </OuterPanel>
    );
  }

  const isComplete = history && prize.score > history.highscore;
  const secondsLeft = (prize.endAt - Date.now()) / 1000;

  return (
    <OuterPanel>
      <div className="px-1">
        <span className="text-xs mb-2">{`Mission: Rescue ${prize.score} chickens`}</span>
        <div className="flex justify-between mt-2 flex-wrap">
          {isComplete ? (
            <Label type="success" icon={SUNNYSIDE.icons.confirm}>
              Completed
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

  return (
    <>
      <div className="mb-1">
        <Label type="default" className="mb-1">
          Minigame - Chicken Rescue
        </Label>
        <div className="h-6">
          <InlineDialogue message="Can you help me rescue the chickens?" />
        </div>

        <MinigamePrizeUI prize={prize} history={dailyAttempt} />
      </div>
      <Button onClick={playNow}>Play now</Button>
    </>
  );
};
