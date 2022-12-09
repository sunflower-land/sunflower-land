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
  const goblinContext = useContext(Context);
  const [gameState] = useActor(goblinContext.goblinService);

  const { state } = gameState.context;
  const landId = state.id;

  return (
    <div data-html2canvas-ignore="true" aria-label="Hud">
      <>
        <Balance balance={gameState.context.state.balance} />
        <Inventory
          context={{
            retreat: goblinContext,
          }}
        />
        {landId && <LandId landId={landId} />}
        <BumpkinProfile
          context={{
            retreat: goblinContext,
          }}
          isVisiting
        />
      </>
      {/* <AudioPlayer isFarming /> */}
    </div>
  );
};
