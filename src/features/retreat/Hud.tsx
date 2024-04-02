import React, { useContext, useState } from "react";

import { Balances } from "components/Balances";
import { useActor, useSelector } from "@xstate/react";
import { Context } from "features/game/GoblinProvider";
import { BumpkinAvatar } from "features/island/hud/components/BumpkinProfile";
import { GameState } from "features/game/types/game";
import { GoblinInventory } from "./components/hud/GoblinInventory";
import { Settings } from "features/island/hud/components/Settings";
import { DepositArgs } from "lib/blockchain/Deposit";
import { DepositModal } from "features/goblins/bank/components/Deposit";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { TravelButton } from "./components/travel/TravelButton";
import { HudContainer } from "components/ui/HudContainer";
import Decimal from "decimal.js-light";
import { BuyCurrenciesModal } from "features/island/hud/components/BuyCurrenciesModal";
import { getBumpkinLevel } from "features/game/lib/level";
import { GoblinMachineState } from "features/game/lib/goblinMachine";

/**
 * Heads up display - a concept used in games for the small overlaid display of information.
 * Balances, Inventory, actions etc.
 */

const _farmAddress = (state: GoblinMachineState) =>
  state.context.farmAddress ?? "";
const _xp = (state: GoblinMachineState) =>
  state.context.state.bumpkin?.experience ?? 0;

export const Hud: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);
  const [showBuyCurrencies, setShowBuyCurrencies] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  const farmAddress = useSelector(goblinService, _farmAddress);
  const xp = useSelector(goblinService, _xp);

  const { state } = goblinState.context;

  const handleDeposit = (
    args: Pick<DepositArgs, "sfl" | "itemIds" | "itemAmounts">
  ) => {
    goblinService.send("DEPOSIT", args);
  };

  const handleBuyCurrenciesModal = () => {
    setShowBuyCurrencies(true);
  };

  return (
    <HudContainer>
      <Balances
        sfl={state.balance}
        coins={state.coins}
        blockBucks={state.inventory["Block Buck"] ?? new Decimal(0)}
      />
      <GoblinInventory
        state={state as GameState}
        onDepositClick={() => setShowDepositModal(true)}
      />
      <div
        className="absolute z-50 flex flex-col justify-between"
        style={{
          left: `${PIXEL_SCALE * 3}px`,
          bottom: `${PIXEL_SCALE * 3}px`,
          width: `${PIXEL_SCALE * 22}px`,
        }}
      >
        <TravelButton />
      </div>
      <BumpkinAvatar bumpkin={state.bumpkin} />
      <div
        className="absolute z-50 flex flex-col justify-between"
        style={{
          right: `${PIXEL_SCALE * 3}px`,
          bottom: `${PIXEL_SCALE * 3}px`,
          width: `${PIXEL_SCALE * 22}px`,
        }}
      >
        <Settings isFarming={false} />
      </div>
      <BuyCurrenciesModal
        show={showBuyCurrencies}
        onClose={handleBuyCurrenciesModal}
      />
      <DepositModal
        farmAddress={farmAddress}
        canDeposit={getBumpkinLevel(xp) >= 3}
        handleClose={() => setShowDepositModal(false)}
        handleDeposit={handleDeposit}
        showDepositModal={showDepositModal}
      />
    </HudContainer>
  );
};
