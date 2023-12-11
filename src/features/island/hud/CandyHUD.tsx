import React, { useContext } from "react";

import candy from "public/world/candy_icon.png";

import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import {
  DAILY_CANDY,
  getDayOfChristmas,
} from "features/game/events/landExpansion/collectCandy";
import { SUNNYSIDE } from "assets/sunnyside";

export const CandyHUD: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const {
    context: { state },
  } = gameState;

  const { dayOfChristmas } = getDayOfChristmas(state);

  const candyCollected = state.christmas?.day[dayOfChristmas]?.candy ?? 0;

  const remaining = DAILY_CANDY - candyCollected;

  return (
    <InnerPanel>
      {remaining > 0 && (
        <Label type="vibrant" icon={candy} className="ml-1.5">
          {`${remaining} remaining`}
        </Label>
      )}
      {remaining === 0 && (
        <Label
          type="vibrant"
          icon={candy}
          secondaryIcon={SUNNYSIDE.icons.confirm}
          className="ml-1.5"
        >
          {`Complete`}
        </Label>
      )}
    </InnerPanel>
    // <Panel>
    //   <div className="flex">
    //     <img src={candy} className="h-4 mr-2" />
    //     <p className="text-xs">10 remaining</p>
    //   </div>
    // </Panel>
  );
};
