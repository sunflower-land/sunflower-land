import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES, acknowledgeNPC, isNPCAcknowledged } from "lib/npcs";
import React, { useContext, useEffect, useState } from "react";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import candy from "public/world/candy_icon.png";
import gift from "assets/icons/gift.png";
import {
  DAILY_CANDY,
  DAILY_CHRISTMAS_REWARDS,
  getDayOfChristmas,
} from "features/game/events/landExpansion/collectCandy";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { secondsTillReset } from "features/helios/components/hayseedHank/HayseedHankV2";
import { secondsToString } from "lib/utils/time";
import { getKeys } from "features/game/types/craftables";
import { hasFeatureAccess } from "lib/flags";

interface Props {
  onClose: () => void;
}

export const Santa: React.FC<Props> = ({ onClose }) => {
  const [showIntro, setShowIntro] = useState(!isNPCAcknowledged("santa"));

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const game = gameState.context.state;

  useEffect(() => {
    acknowledgeNPC("santa");
  }, []);

  if (!hasFeatureAccess(game, "CHRISTMAS")) {
    return (
      <SpeakingModal
        onClose={() => {
          setShowIntro(false);
          onClose();
        }}
        bumpkinParts={NPC_WEARABLES.santa}
        message={[
          {
            text: "Ho Ho Ho Bumpkin! On the 12th of December the Christmas Event will begin.",
          },
        ]}
      />
    );
  }

  if (showIntro) {
    return (
      <SpeakingModal
        onClose={() => setShowIntro(false)}
        bumpkinParts={NPC_WEARABLES.santa}
        message={[
          {
            text: "Ho Ho Ho Bumpkin! For a limited time, I am giving daily rewards for those that find my missing Candy.",
          },
          {
            text: "Each day you will find 10 pieces scattered throughout the Pumpkin Plaza.",
          },
          {
            text: "Collect these pieces 12 days in a row for a special prize!",
          },
        ]}
      />
    );
  }

  const { dayOfChristmas } = getDayOfChristmas(gameState.context.state);

  const candyCollected = game.christmas?.day[dayOfChristmas]?.candy ?? 0;

  const remaining = DAILY_CANDY - candyCollected;

  const progress = gameState.context.state.christmas?.day ?? {};
  const complete = getKeys(progress).filter(
    (index) =>
      // They have completed the daily requirement
      progress[index].candy >= DAILY_CANDY
  ).length;

  return (
    <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES.santa}>
      <div className="p-2">
        {remaining > 0 && (
          <>
            <Label type="vibrant" icon={candy} className="ml-1.5 mb-1">
              {`${remaining} remaining`}
            </Label>
            <p className="text-sm flex-1 mb-2">
              Ho ho ho! Collect my missing candy for a reward.
            </p>
          </>
        )}
        {remaining === 0 && dayOfChristmas <= 11 && (
          <>
            <Label type="success" icon={candy} className="ml-1.5 mb-1">
              Complete
            </Label>
            <p className="text-sm flex-1 mb-2">
              Congratulations, you found my candy!
            </p>
            <div className="flex mb-2 ">
              <p className="text-xs flex-1 mr-2">Next challenge:</p>
              <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                {secondsToString(secondsTillReset(), { length: "medium" })}
              </Label>
            </div>
          </>
        )}
        {remaining === 0 && dayOfChristmas === 12 && (
          <>
            <Label type="success" icon={candy} className="ml-1.5 mb-1">
              Complete
            </Label>
            <p className="text-sm flex-1 mb-2">
              {`Well done! You have completed the 12 Days of Christmas. Don't
              forget to place the Festive Tree for a special gift.`}
            </p>
          </>
        )}
        <Label className="ml-1.5" icon={gift} type="default">
          {`${complete}/12 Days Completed`}
        </Label>
        <p className="text-xs">
          Complete the challenge 12 days during the event for a special prize.
        </p>
      </div>
    </CloseButtonPanel>
  );
};

export const ChristmasReward: React.FC<Props> = ({ onClose }) => {
  const [state, setState] = useState<"intro" | "reward" | "claimed">("intro");
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { dayOfChristmas } = getDayOfChristmas(gameState.context.state);

  useEffect(() => {
    acknowledgeNPC("santa");
  }, []);

  if (state === "intro") {
    return (
      <SpeakingModal
        onClose={() => setState("reward")}
        bumpkinParts={NPC_WEARABLES.santa}
        message={[
          {
            text: "Ho Ho Ho! Well done Bumpkin, you found my candy.",
          },
        ]}
      />
    );
  }

  if (state === "claimed") {
    return <Santa onClose={onClose} />;
  }

  const reward = DAILY_CHRISTMAS_REWARDS[dayOfChristmas];
  return (
    <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES.santa}>
      <ClaimReward
        onClaim={() => {
          gameService.send("candy.collected");
          gameService.send("SAVE");
          setState("claimed");
        }}
        reward={{
          createdAt: 0,
          id: "christmas-reward",
          items: reward.items,
          sfl: reward.sfl,
          wearables: reward.wearables,
        }}
      />
    </CloseButtonPanel>
  );
};
