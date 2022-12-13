import React, { useContext } from "react";

import { Balance } from "components/Balance";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GoblinProvider";
import { BumpkinAvatar } from "features/island/hud/components/BumpkinProfile";
import { LandId } from "features/island/hud/components/LandId";
import { GameState } from "features/game/types/game";
import { GoblinInventory } from "./components/hud/GoblinInventory";

/**
 * Heads up display - a concept used in games for the small overlayed display of information.
 * Balances, Inventory, actions etc.
 */
export const Hud: React.FC = () => {
  const goblinContext = useContext(Context);
  const [gameState] = useActor(goblinContext.goblinService);

  const { state } = gameState.context;
  const landId = state.id;

  return (
    <div data-html2canvas-ignore="true" aria-label="Hud">
      <>
        <Balance balance={gameState.context.state.balance} />
        <GoblinInventory state={gameState.context.state as GameState} />
        {landId && <LandId landId={landId} />}
        <BumpkinAvatar bumpkin={state.bumpkin} />
      </>
    </div>
  );
};
