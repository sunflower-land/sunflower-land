import { BuildingName } from "features/game/types/buildings";

const BUILDING_ACKNOWLEDGEMENT_KEY = "building_tutorials";

export function acknowledgeTutorial(buildingName: BuildingName) {
  const acknowledgements = getAcknowledgements();

  const newAcknowledgements: BuildingTutorials = {
    ...acknowledgements,
    [buildingName]: {
      acknowledgedAt: Date.now(),
    },
  };

  localStorage.setItem(
    BUILDING_ACKNOWLEDGEMENT_KEY,
    JSON.stringify(newAcknowledgements)
  );
}

export function hasIntroducedBuilding(buildingName: BuildingName): boolean {
  const acknowledgements = getAcknowledgements();

  return !!acknowledgements[buildingName];
}

type BuildingTutorials = Partial<
  Record<
    BuildingName,
    {
      acknowledgedAt: number;
    }
  >
>;

function getAcknowledgements(): BuildingTutorials {
  const obj = localStorage.getItem(BUILDING_ACKNOWLEDGEMENT_KEY);

  if (!obj) {
    return {};
  }

  return JSON.parse(obj) as BuildingTutorials;
}
