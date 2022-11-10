import React, { useContext, useState } from "react";

import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { BuildingName } from "features/game/types/buildings";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { ListView } from "./ListView";
import { DetailView } from "./DetailView";
import Decimal from "decimal.js-light";

export const ModalContent: React.FC<{ closeModal: () => void }> = ({
  closeModal,
}) => {
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);
  const { state } = game.context;
  const [scrollIntoView] = useScrollIntoView();

  const [selected, setSelected] = useState<BuildingName | null>(null);

  const buildingInventory =
    (selected && state.inventory[selected]) || new Decimal(0);
  const placed = (selected && state.buildings[selected]) || [];
  const hasUnplacedBuildings = buildingInventory
    .minus(1)
    .greaterThanOrEqualTo(placed.length);

  const handleBuild = () => {
    if (!selected) return;

    gameService.send("EDIT", {
      placeable: selected,
      action: hasUnplacedBuildings ? "building.placed" : "building.constructed",
    });
    closeModal();
    scrollIntoView(Section.GenesisBlock);
  };

  if (!selected) {
    return (
      <ListView
        state={state}
        onClick={(name: BuildingName) => {
          setSelected(name);
        }}
      />
    );
  }

  return (
    <DetailView
      state={state}
      building={selected}
      hasUnplaced={hasUnplacedBuildings}
      onBuild={handleBuild}
      onBack={() => setSelected(null)}
    />
  );
};
