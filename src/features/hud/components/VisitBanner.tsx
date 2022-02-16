import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GameProvider";

import { OuterPanel } from "components/ui/Panel";

export const VisitBanner = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  return (
    <div className="fixed bottom-2 left-2 z-50 shadow-lg">
      {gameState.matches("readonly") && (
        <OuterPanel>
          <div className="flex justify-center p-1">
            <span className="text-sm">
              You are visiting Farm {gameState.context.state.id}
            </span>
          </div>
        </OuterPanel>
      )}
    </div>
  );
};
