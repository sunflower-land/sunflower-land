import React, { useContext } from "react";

import { Balance } from "components/Balance";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";

import { Menu } from "./components/Menu";
import { Buildings } from "../buildings/Buildings";
import { Inventory } from "./components/inventory/Inventory";
import { PlaceableController } from "features/farming/hud/components/PlaceableController";
import { BumpkinProfile } from "./components/BumpkinProfile";

/**
 * Heads up display - a concept used in games for the small overlayed display of information.
 * Balances, Inventory, actions etc.
 */
export const Hud: React.FC = () => {
  const { gameService, shortcutItem } = useContext(Context);
  const [gameState] = useActor(gameService);

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

          <Buildings />
          <BumpkinProfile />
        </>
      )}
      {/* <AudioPlayer isFarming /> */}
    </div>
  );
};
