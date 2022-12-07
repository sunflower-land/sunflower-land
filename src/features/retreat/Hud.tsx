import React, { useContext } from "react";

import { Balance } from "components/Balance";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GoblinProvider";
import { Inventory } from "features/island/hud/components/inventory/Inventory";
import { BumpkinProfile } from "features/island/hud/components/BumpkinProfile";
import { LandId } from "features/island/hud/components/LandId";

/**
 * Heads up display - a concept used in games for the small overlayed display of information.
 * Balances, Inventory, actions etc.
 */
export const Hud: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [gameState] = useActor(goblinService);

  const { state } = gameState.context;
  const landId = state.id;

  return (
    <div data-html2canvas-ignore="true" aria-label="Hud">
      <>
        <Balance balance={gameState.context.state.balance} />
        <Inventory state={gameState.context.state} />
        {landId && <LandId landId={landId} />}
        <BumpkinProfile state={state} isVisiting />
      </>
      {/* <AudioPlayer isFarming /> */}
    </div>
  );
};
