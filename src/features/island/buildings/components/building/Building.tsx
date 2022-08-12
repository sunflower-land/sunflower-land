import { BuildingName } from "features/game/types/buildings";
import React from "react";
import { FirePit } from "./FirePit";

interface Prop {
  building: BuildingName;
  id: string;
}

type BuildingProp = {
  id: string;
};

const BUIDLING_COMPONENTS: Record<BuildingName, React.FC<BuildingProp>> = {
  "Fire Pit": FirePit,
  Anvil: () => null,
  Bakery: () => null,
  Oven: () => null,
  Workbench: () => null,
};

export const Building: React.FC<Prop> = ({ building, id }) => {
  const BuildingPlaced = BUIDLING_COMPONENTS[building];

  // TODO in progress
  return (
    <div>
      <BuildingPlaced id={id} />
    </div>
  );
};
