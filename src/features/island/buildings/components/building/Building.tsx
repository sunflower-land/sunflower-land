import { BuildingName } from "features/game/types/buildings";
import { Building as IBuilding } from "features/game/types/game";
import React from "react";
import { FirePit } from "./FirePit";

interface Prop {
  name: BuildingName;
  building: IBuilding;
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

export const Building: React.FC<Prop> = ({ name, building, id }) => {
  const BuildingPlaced = BUIDLING_COMPONENTS[name];

  // TODO in progress
  return (
    <div>
      <BuildingPlaced id={id} />
    </div>
  );
};
