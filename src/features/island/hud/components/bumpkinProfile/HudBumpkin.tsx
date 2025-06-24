import React from "react";
import { BumpkinProfile } from "./BumpkinProfile";
import { GameCalendar } from "features/game/expansion/components/temperateSeason/GameCalendar";
import { CodexButton } from "./CodexButton";
import { RewardsButton } from "./RewardsButton";

export const HudBumpkin: React.FC<{ isTutorial: boolean }> = ({
  isTutorial,
}) => {
  return (
    <div className="relative -ml-2 -mt-2">
      <BumpkinProfile />
      {!isTutorial && <GameCalendar />}
      <CodexButton />
      <RewardsButton />
    </div>
  );
};
