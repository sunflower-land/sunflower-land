import { PetName } from "features/game/types/pets";
import { useVisiting } from "lib/utils/visitUtils";
import React from "react";
import { LandPet } from "./LandPet";
import { VisitingPet } from "./VisitingPet";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";

export const Pet: React.FC<{ name: PetName }> = ({ name }) => {
  const { isVisiting } = useVisiting();

  // Used to move the pet through different states (neglected, napping)
  useUiRefresher();

  if (isVisiting) {
    return <VisitingPet name={name} />;
  }

  return <LandPet name={name} />;
};
