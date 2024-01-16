import React, { useContext } from "react";

import { QuestName, QUESTS } from "features/game/types/quests";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { setPrecision } from "lib/utils/formatNumber";
import { CountdownLabel } from "components/ui/CountdownLabel";
import { ResizableBar } from "components/ui/ProgressBar";
import { translate } from "lib/i18n/translate";

interface Props {
  questName: QuestName;
  onClaim: () => void;
  secondsLeft?: number;
}
export const QuestProgress: React.FC<Props> = ({
  questName,
  onClaim,
  secondsLeft = 0,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const {
    context: { state },
  } = gameState;

  const quest = QUESTS[questName];
  const progress = quest.progress(state);
  const isComplete = progress >= quest.requirement;

  const bumpkinWearableId = ITEM_IDS[quest.wearable];

  const progressPercentage = Math.min(1, progress / quest.requirement) * 100;

  return (
    <div className="flex flex-col justify-center items-center">
      {secondsLeft ? (
        <CountdownLabel timeLeft={secondsLeft} endText="left" />
      ) : null}

      <img
        src={getImageUrl(bumpkinWearableId)}
        className="w-1/3 my-2 rounded-lg"
      />

      <span className="text-sm mb-2">{quest.description}</span>

      <div className="flex items-center justify-center pt-1 w-full mb-2">
        <div className="flex items-center mt-2 mb-1">
          <ResizableBar
            percentage={progressPercentage}
            type="progress"
            outerDimensions={{
              width: 80,
              height: 10,
            }}
          />
          <span className="text-xxs ml-2">{`${setPrecision(
            new Decimal(progress)
          )}/${quest.requirement}`}</span>
        </div>
      </div>

      <div className="w-full">
        <Button
          className="text-xs mt-2"
          onClick={onClaim}
          disabled={!isComplete}
        >
          <span>{translate("quest.mint.free")}</span>
        </Button>
      </div>
    </div>
  );
};
