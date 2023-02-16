import React, { useContext } from "react";

import { Balance } from "components/Balance";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GoblinProvider";
import { BumpkinAvatar } from "features/island/hud/components/BumpkinProfile";
import { LandId } from "features/island/hud/components/LandId";
import { GameState } from "features/game/types/game";
import { GoblinInventory } from "./components/hud/GoblinInventory";
import { Settings } from "features/island/hud/components/Settings";
import { DepositArgs } from "lib/blockchain/Deposit";

/**
 * Heads up display - a concept used in games for the small overlaid display of information.
 * Balances, Inventory, actions etc.
 */
export const Hud: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const { state } = goblinState.context;
  const landId = state.id;

  const handleDeposit = (
    args: Pick<DepositArgs, "sfl" | "itemIds" | "itemAmounts">
  ) => {
    goblinService.send("DEPOSIT", args);
  };

  return (
    <div data-html2canvas-ignore="true" aria-label="Hud">
      <>
        <Balance
          onDeposit={handleDeposit}
          farmAddress={goblinState.context.state.farmAddress}
          balance={goblinState.context.state.balance}
        />
        <GoblinInventory state={goblinState.context.state as GameState} />
        {landId && <LandId landId={landId} />}
        <BumpkinAvatar bumpkin={state.bumpkin} />
        <Settings isFarming={false} />
      </>
    </div>
  );
};
