import React, { useContext } from "react";

import { Balance } from "components/Balance";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";

import { Inventory } from "./components/inventory/Inventory";
import { InnerPanel } from "components/ui/Panel";
import { BumpkinProfile } from "./components/BumpkinProfile";
import { InventoryItemName } from "features/game/types/game";
import { Settings } from "./components/Settings";

/**
 * Heads up display - a concept used in games for the small overlaid display of information.
 * Balances, Inventory, actions etc.
 */
export const VisitingHud: React.FC = () => {
  const { gameService, shortcutItem, selectedItem } = useContext(Context);
  const [gameState] = useActor(gameService);

  return (
    <>
      {!gameState.matches("landToVisitNotFound") && (
        <InnerPanel className="fixed px-2 pt-1 pb-2 bottom-2 left-2 z-50">
          <span className="text-white">{`Visiting #${gameState.context.state.id}`}</span>
        </InnerPanel>
      )}
      <div data-html2canvas-ignore="true" aria-label="Hud">
        <Balance balance={gameState.context.state.balance} />
        <Inventory
          state={gameState.context.state}
          shortcutItem={shortcutItem}
          selectedItem={selectedItem as InventoryItemName}
          isFarming={false}
          isFullUser={true}
        />
        <BumpkinProfile />
        <Settings isFarming={false} />
      </div>
    </>
  );
};
