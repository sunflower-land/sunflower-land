import React, { useContext, useState } from "react";
import * as AuthProvider from "features/auth/lib/Provider";

import { Balance } from "components/Balance";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GoblinProvider";
import { BumpkinAvatar } from "features/island/hud/components/BumpkinProfile";
import { LandId } from "features/island/hud/components/LandId";
import { GameState } from "features/game/types/game";
import { GoblinInventory } from "./components/hud/GoblinInventory";
import { Settings } from "features/island/hud/components/Settings";
import { DepositArgs } from "lib/blockchain/Deposit";
import Modal from "react-bootstrap/esm/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Deposit } from "features/goblins/bank/components/Deposit";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { hasFeatureAccess } from "lib/flags";
import { TravelButton } from "./components/travel/TravelButton";

/**
 * Heads up display - a concept used in games for the small overlaid display of information.
 * Balances, Inventory, actions etc.
 */
export const Hud: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositDataLoaded, setDepositDataLoaded] = useState(false);

  const { state } = goblinState.context;
  const landId = state.id;

  const handleDeposit = (
    args: Pick<DepositArgs, "sfl" | "itemIds" | "itemAmounts">
  ) => {
    goblinService.send("DEPOSIT", args);
  };

  const user = authService.state.context.user;
  const isFullUser = user.type === "FULL";
  const farmAddress = isFullUser ? user.farmAddress : undefined;

  const handleDepositClose = () => {
    if (!farmAddress) return;
    setShowDepositModal(false);
  };

  const handleDepositOpen = () => {
    if (!farmAddress) return;
    setShowDepositModal(true);
  };

  return (
    <div data-html2canvas-ignore="true" aria-label="Hud">
      <>
        <Balance
          onBalanceClick={handleDepositOpen}
          balance={goblinState.context.state.balance}
        />
        <GoblinInventory
          state={goblinState.context.state as GameState}
          onDepositClick={handleDepositOpen}
        />
        {hasFeatureAccess(goblinState.context.state.inventory, "FISHING") ? (
          <div
            className="fixed z-50 flex flex-col justify-between"
            style={{
              left: `${PIXEL_SCALE * 3}px`,
              bottom: `${PIXEL_SCALE * 3}px`,
              width: `${PIXEL_SCALE * 22}px`,
            }}
          >
            <TravelButton />
          </div>
        ) : (
          landId && <LandId landId={landId} />
        )}
        <BumpkinAvatar bumpkin={state.bumpkin} />
        <div
          className="fixed z-50 flex flex-col justify-between"
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
              title={depositDataLoaded ? "Deposit" : undefined}
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
      </>
    </div>
  );
};
