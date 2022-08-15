import React, { useContext, useState } from "react";

import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { BuildingName } from "features/game/types/buildings";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { ListView } from "./ListView";
import { DetailView } from "./DetailView";

export const ModalContent: React.FC<{ closeModal: () => void }> = ({
  closeModal,
}) => {
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);
  const [scrollIntoView] = useScrollIntoView();

  const [selected, setSelected] = useState<BuildingName | null>(null);

  const { state } = game.context;

  const handleBuild = () => {
    if (!selected) return;

    gameService.send("EDIT", {
      placeable: selected,
      action: "building.constructed",
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
      onBuild={handleBuild}
      onBack={() => setSelected(null)}
    />
  );
};
