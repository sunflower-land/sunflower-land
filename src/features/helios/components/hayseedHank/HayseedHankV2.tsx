import React, { useState } from "react";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES, acknowedlgedNPCs, acknowledgeNPC } from "lib/npcs";
import { ChoreV2 } from "./components/ChoreV2";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { SUNNYSIDE } from "assets/sunnyside";
import { getSecondsToTomorrow, secondsToString } from "lib/utils/time";

// UTC
function secondsTillTomorrow() {
  const currentTime = Date.now();

  // Calculate the time until the next day in milliseconds
  const nextDay = new Date(currentTime);
  nextDay.setUTCHours(24, 0, 0, 0);
  const timeUntilNextDay = nextDay.getTime() - currentTime;

  // Convert milliseconds to seconds
  const secondsUntilNextDay = Math.floor(timeUntilNextDay / 1000);

  return secondsUntilNextDay;
}
interface Props {
  onClose: () => void;
}
export const HayseedHankV2: React.FC<Props> = ({ onClose }) => {
  const [introDone, setIntroDone] = useState(!!acknowedlgedNPCs()["hank"]);

  const close = () => {
    onClose();
  };

  if (!introDone) {
    return (
      <SpeakingModal
        bumpkinParts={NPC_WEARABLES["hank"]}
        message={[
          {
            text: "Well, howdy there, young whippersnappers! I'm Hayseed Hank, a seasoned ol' Bumpkin farmer, tendin' to the land like it's still the good ol' days.",
          },
          {
            text: "However, my bones ain't what they used to be. If you can help me with my daily chores, I will reward you with Crow Feathers.",
            actions: [
              {
                text: "Let's do it",
                cb: () => {
                  setIntroDone(true);
                  acknowledgeNPC("hank");
                },
              },
            ],
          },
        ]}
        onClose={onClose}
      />
    );
  }

  return (
    <CloseButtonPanel
      title="Daily Chores"
      bumpkinParts={NPC_WEARABLES.hank}
      onClose={close}
    >
      <div
        style={{ maxHeight: "300px" }}
        className="overflow-y-auto pr-1  divide-brown-600 scrollable"
      >
        <div className="p-1 mb-2">
          <div className="flex items-center mb-1">
            <div className="w-6">
              <img src={SUNNYSIDE.icons.timer} className="h-4 mx-auto" />
            </div>
            <span className="text-xs">{`New chores available in ${secondsToString(
              getSecondsToTomorrow(),
              { length: "full" }
            )}.`}</span>
          </div>
          <div className="flex items-center ">
            <div className="w-6">
              <img src={SUNNYSIDE.icons.heart} className="h-4 mx-auto" />
            </div>
            <span className="text-xs">You can skip chores each new day.</span>
          </div>
        </div>

        <ChoreV2 />
      </div>

      {/* {!(isSaving && isSkipping) && !!chore && Content()} */}
    </CloseButtonPanel>
  );
};
