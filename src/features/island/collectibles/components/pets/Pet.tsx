import { PetName } from "features/game/types/pets";
import { useVisiting } from "lib/utils/visitUtils";
import React from "react";
import { HomePet } from "./HomePet";
import { VisitingPet } from "./VisitingPet";

export const Pet: React.FC<{ name: PetName }> = ({ name }) => {
  const { isVisiting } = useVisiting();

  if (isVisiting) {
    return <VisitingPet name={name} />;
  }

  return <HomePet name={name} />;
};
