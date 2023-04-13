import React, { useContext, useState } from "react";
import { Balance } from "components/Balance";
import { useActor } from "@xstate/react";
import * as AuthProvider from "features/auth/lib/Provider";
import { Context } from "features/game/GameProvider";
import { Settings } from "./components/Settings";
import { Inventory } from "./components/inventory/Inventory";
import { PlaceableController } from "features/farming/hud/components/PlaceableController";
import { BumpkinProfile } from "./components/BumpkinProfile";
import { Save } from "./components/Save";
import { LandId } from "./components/LandId";
import { InventoryItemName } from "features/game/types/game";
import { BlockBucks } from "./components/BlockBucks";
import Decimal from "decimal.js-light";
import { DepositArgs } from "lib/blockchain/Deposit";
import Modal from "react-bootstrap/esm/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Deposit } from "features/goblins/bank/components/Deposit";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  RESOURCE_PLACE_EVENTS,
  placeEvent,
} from "features/game/expansion/placeable/landscapingMachine";
import { BUILDINGS } from "features/game/types/buildings";

/**
 * Heads up display - a concept used in games for the small overlaid display of information.
 * Balances, Inventory, actions etc.
 */
const HudComponent: React.FC<{ isFarming: boolean }> = ({ isFarming }) => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService, shortcutItem, selectedItem } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositDataLoaded, setDepositDataLoaded] = useState(false);

  const handleClose = () => {
    setShowDepositModal(false);
  };

  const handleDeposit = (
    args: Pick<DepositArgs, "sfl" | "itemIds" | "itemAmounts">
  ) => {
    gameService.send("DEPOSIT", args);
  };

  const landId = gameState.context.state.id;
  const farmAddress = authService.state.context.address as string;

  return (
    <div
      data-html2canvas-ignore="true"
      aria-label="Hud"
      className="absolute z-40"
    >
      <div>
        <div
          onClick={() => gameService.send("LANDSCAPE")}
          className="fixed flex z-50 cursor-pointer hover:img-highlight"
          style={{
            marginLeft: `${PIXEL_SCALE * 2}px`,
            marginBottom: `${PIXEL_SCALE * 25}px`,
            width: `${PIXEL_SCALE * 22}px`,
            right: `${PIXEL_SCALE * 3}px`,
            top: `${PIXEL_SCALE * 38}px`,
          }}
        >
          <img
            src={SUNNYSIDE.ui.round_button}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 22}px`,
            }}
          />
          <img
            src={SUNNYSIDE.icons.hammer}
            className="absolute"
            style={{
              top: `${PIXEL_SCALE * 5}px`,
              left: `${PIXEL_SCALE * 5}px`,
              width: `${PIXEL_SCALE * 12}px`,
            }}
          />
        </div>
        <Inventory
          state={gameState.context.state}
          shortcutItem={shortcutItem}
          selectedItem={selectedItem as InventoryItemName}
          onPlace={(selected) => {
            gameService.send("LANDSCAPE", {
              action: placeEvent(selected),
              placeable: selected,
            });
          }}
          onDepositClick={() => setShowDepositModal(true)}
          isSaving={gameState.matches("autosaving")}
          isFarming={isFarming}
        />
      </div>

      <Balance
        farmAddress={gameState.context.state.farmAddress as string}
        onBalanceClick={() => setShowDepositModal(true)}
        balance={gameState.context.state.balance}
      />
      <BlockBucks
        blockBucks={
          gameState.context.state.inventory["Block Buck"] ?? new Decimal(0)
        }
      />
      {landId && <LandId landId={landId} />}
      <Save />
      <BumpkinProfile />
      <Settings isFarming={isFarming} />

      <Modal show={showDepositModal} centered>
        <CloseButtonPanel
          title={depositDataLoaded ? "Deposit" : undefined}
          onClose={depositDataLoaded ? handleClose : undefined}
        >
          <Deposit
            farmAddress={farmAddress}
            onDeposit={handleDeposit}
            onLoaded={(loaded) => setDepositDataLoaded(loaded)}
            onClose={handleClose}
          />
        </CloseButtonPanel>
      </Modal>
    </div>
  );
};

export const Hud = React.memo(HudComponent);
