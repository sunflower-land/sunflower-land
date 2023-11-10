import React, { useContext, useState } from "react";

import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { BuildingName } from "features/game/types/buildings";
import { ListView } from "./ListView";
import { DetailView } from "./DetailView";
import Decimal from "decimal.js-light";
import { gameAnalytics } from "lib/gameAnalytics";

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
    if (!selected) return;

    gameService.send("LANDSCAPE", {
      placeable: selected,
      action: hasUnplacedBuildings ? "building.placed" : "building.constructed",
      // Not used yet
      requirements: {
        sfl: new Decimal(0),
        ingredients: {},
      },
    });

    const isCrafting = !hasUnplacedBuildings;
    if (isCrafting) {
      const buildingCount = state.inventory[selected]?.toNumber() ?? 1;
      gameAnalytics.trackMilestone({
        event: `Crafting:Building:${selected}${buildingCount}`,
      });
    }

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
