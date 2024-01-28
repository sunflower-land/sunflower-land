import React, { useContext, useState } from "react";

import { Balance } from "components/Balance";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GoblinProvider";
import { BumpkinAvatar } from "features/island/hud/components/BumpkinProfile";
import { GameState } from "features/game/types/game";
import { GoblinInventory } from "./components/hud/GoblinInventory";
import { Settings } from "features/island/hud/components/Settings";
import { DepositArgs } from "lib/blockchain/Deposit";
import Modal from "react-bootstrap/esm/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Deposit } from "features/goblins/bank/components/Deposit";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { TravelButton } from "./components/travel/TravelButton";
import { HudContainer } from "components/ui/HudContainer";

/**
 * Heads up display - a concept used in games for the small overlaid display of information.
 * Balances, Inventory, actions etc.
 */
export const Hud: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositDataLoaded, setDepositDataLoaded] = useState(false);

  const { state } = goblinState.context;

  const handleDeposit = (
    args: Pick<DepositArgs, "sfl" | "itemIds" | "itemAmounts">
  ) => {
    goblinService.send("DEPOSIT", args);
  };

  const farmAddress = goblinState.context.farmAddress;

  const handleDepositClose = () => {
    if (!farmAddress) return;
    setShowDepositModal(false);
  };

  const handleDepositOpen = () => {
    if (!farmAddress) return;
    setShowDepositModal(true);
  };

  return (
    <HudContainer>
      <Balance
        onBalanceClick={handleDepositOpen}
        balance={goblinState.context.state.balance}
      />
      <GoblinInventory
        state={goblinState.context.state as GameState}
        onDepositClick={handleDepositOpen}
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
      {farmAddress && (
        <Modal show={showDepositModal} centered onHide={handleDepositClose}>
          <CloseButtonPanel
            onClose={depositDataLoaded ? handleDepositClose : undefined}
          >
            <Deposit
              farmAddress={farmAddress}
              onDeposit={handleDeposit}
              onLoaded={(loaded) => setDepositDataLoaded(loaded)}
              onClose={handleDepositClose}
            />
          </CloseButtonPanel>
        </Modal>
      )}
    </HudContainer>
  );
};
