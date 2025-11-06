import React from "react";
import { useVisiting } from "lib/utils/visitUtils";
import { VisitingPetNFT } from "./VisitingPetNFT";
import { LandPetNFT } from "./LandPetNFT";

type Props = {
  id: string;
};

export const PetNFT: React.FC<Props> = ({ id }) => {
  const { isVisiting } = useVisiting();

  if (isVisiting) {
    return <VisitingPetNFT id={id} />;
  }

  return <LandPetNFT id={id} />;
};
