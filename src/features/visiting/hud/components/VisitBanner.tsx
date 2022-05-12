import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import { Context } from "features/game/VisitingProvider";

import { OuterPanel } from "components/ui/Panel";

export const VisitBanner = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  console.log({ gameState });

  if (!gameState.context.state.id) {
    return null;
  }

  return (
    <div className="fixed bottom-2 left-2 z-50 shadow-lg">
      <OuterPanel>
        <div className="flex justify-center p-1">
          <span className="text-sm">
            {`Farm #${gameState.context.state.id}`}
          </span>
        </div>
      </OuterPanel>
    </div>
  );
};
