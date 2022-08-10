import React, { useContext, useState } from "react";

import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { BuildingName } from "features/game/types/buildings";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { BuildingsListView } from "./BuildingsListView";
import { BuildingDetailView } from "./BuildingDetailView";

export const BuildingsModalContent: React.FC<{ closeModal: () => void }> = ({
  closeModal,
}) => {
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);
  const [scrollIntoView] = useScrollIntoView();

  const [selected, setSelected] = useState<BuildingName | null>(null);

  const state = game.context.state;

  const handleBuild = () => {
    gameService.send("EDIT", { placeable: selected });
    closeModal();
    scrollIntoView(Section.GenesisBlock);
  };

  if (!selected) {
    return (
      <BuildingsListView
        state={state}
        onClick={(name: BuildingName) => {
          setSelected(name);
        }}
      />
    );
  }

  return (
    <BuildingDetailView
      state={state}
      building={selected}
      onBuild={handleBuild}
      onBack={() => setSelected(null)}
    />
  );
};
