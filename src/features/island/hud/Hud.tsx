import React, { useContext } from "react";

import { Balance } from "components/Balance";
import { VisitBanner } from "../../../components/ui/VisitBanner";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { BumpkinHUD } from "./components/BumpkinHUD";

import { Menu } from "./components/Menu";
import { Buildings } from "../buildings/Buildings";
import { Inventory } from "./components/inventory/Inventory";
import { PlaceableController } from "features/farming/hud/components/PlaceableController";

/**
 * Heads up display - a concept used in games for the small overlayed display of information.
 * Balances, Inventory, actions etc.
 */
export const Hud: React.FC = () => {
  const { gameService, shortcutItem } = useContext(Context);
  const [gameState] = useActor(gameService);

  const landId = gameState.context.state.id;
  const isEditing = gameState.matches("editing");

  return (
    <div data-html2canvas-ignore="true" aria-label="Hud">
      <Menu />
      {isEditing ? (
        <PlaceableController />
      ) : (
        <>
          <Balance balance={gameState.context.state.balance} />
          <Inventory
            state={gameState.context.state}
            shortcutItem={shortcutItem}
            isFarming
          />
          <VisitBanner id={landId} />

          <Buildings />
          <BumpkinHUD />
        </>
      )}
      {/* <AudioPlayer isFarming /> */}
    </div>
  );
};
