import React, { useContext } from "react";
import { Balance } from "components/Balance";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { Settings } from "./components/Settings";
import { Buildings } from "../buildings/Buildings";
import { Inventory } from "./components/inventory/Inventory";
import { PlaceableController } from "features/farming/hud/components/PlaceableController";
import { BumpkinProfile } from "./components/BumpkinProfile";
import { Save } from "./components/Save";
import { LandId } from "./components/LandId";
import { InventoryItemName } from "features/game/types/game";
import { BlockBucks } from "./components/BlockBucks";
import Decimal from "decimal.js-light";

/**
 * Heads up display - a concept used in games for the small overlaid display of information.
 * Balances, Inventory, actions etc.
 */
export const Hud: React.FC<{ isFarming: boolean }> = ({ isFarming }) => {
  const { gameService, shortcutItem, selectedItem } = useContext(Context);
  const [gameState] = useActor(gameService);

  const isEditing = gameState.matches("editing");
  const landId = gameState.context.state.id;

  return (
    <div
      data-html2canvas-ignore="true"
      aria-label="Hud"
      className="absolute z-40"
    >
      {isEditing ? (
        <PlaceableController />
      ) : (
        <>
          <Balance balance={gameState.context.state.balance} />
          <BlockBucks
            blockBucks={
              gameState.context.state.inventory["Block Buck"] ?? new Decimal(0)
            }
          />
          {landId && <LandId landId={landId} />}
          <Buildings />
          <Save />
          <BumpkinProfile />
          <Settings isFarming={isFarming} />
        </>
      )}
      <div hidden={isEditing}>
        <Inventory
          state={gameState.context.state}
          shortcutItem={shortcutItem}
          selectedItem={selectedItem as InventoryItemName}
          onPlace={(selected) => {
            gameService.send("EDIT", {
              placeable: selected,
              action: "collectible.placed",
            });
          }}
          isSaving={gameState.matches("autosaving")}
          isFarming={isFarming}
        />
      </div>
    </div>
  );
};
