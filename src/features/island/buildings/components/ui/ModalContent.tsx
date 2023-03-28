import React, { useContext, useState } from "react";

import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { BuildingName } from "features/game/types/buildings";
import { ListView } from "./ListView";
import { DetailView } from "./DetailView";
import Decimal from "decimal.js-light";
import { MachineInterpreter } from "features/game/expansion/placeable/editingMachine";

export const ModalContent: React.FC<{ closeModal: () => void }> = ({
  closeModal,
}) => {
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);
  const { state } = game.context;

  const [selected, setSelected] = useState<BuildingName | null>(null);

  const buildingInventory =
    (selected && state.inventory[selected]) || new Decimal(0);
  const placed = (selected && state.buildings[selected]) || [];
  const hasUnplacedBuildings = buildingInventory
    .minus(1)
    .greaterThanOrEqualTo(placed.length);

  const handleBuild = () => {
    if (game.matches("editing")) {
      const editing = gameService.state.children.editing as MachineInterpreter;

      if (editing.state.matches("idle")) {
        editing.send("SELECT_TO_PLACE", {
          placeable: selected,
          placeableType: "BUILDING",
          action: hasUnplacedBuildings
            ? "building.placed"
            : "building.constructed",
        });
        closeModal();
        return;
      }
      return;
    }

    if (!selected) return;
    closeModal();
  };

  if (!selected) {
    return (
      <ListView
        state={state}
        onClick={(name: BuildingName) => setSelected(name)}
      />
    );
  }

  return (
    <DetailView
      state={state}
      buildingName={selected}
      hasUnplaced={hasUnplacedBuildings}
      onBuild={handleBuild}
      onBack={() => setSelected(null)}
    />
  );
};
