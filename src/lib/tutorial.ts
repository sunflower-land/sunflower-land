import { BuildingName } from "features/game/types/buildings";

const TUTORIAL_ACKNOWLEDGEMENT_KEY = "building_tutorials";

type TutorialName = BuildingName | "Boat" | "BuildingMenu" | "Bumpkin";

export function acknowledgeTutorial(tutorialName: TutorialName) {
  const acknowledgements = getAcknowledgements();

  const newAcknowledgements: Tutorials = {
    ...acknowledgements,
    [tutorialName]: {
      acknowledgedAt: Date.now(),
    },
  };

  localStorage.setItem(
    TUTORIAL_ACKNOWLEDGEMENT_KEY,
    JSON.stringify(newAcknowledgements)
  );
}

export function hasShownTutorial(tutorialName: TutorialName): boolean {
  const acknowledgements = getAcknowledgements();

  return !!acknowledgements[tutorialName];
}

type Tutorials = Partial<
  Record<
    TutorialName,
    {
      acknowledgedAt: number;
    }
  >
>;

function getAcknowledgements(): Tutorials {
  const obj = localStorage.getItem(TUTORIAL_ACKNOWLEDGEMENT_KEY);

  if (!obj) {
    return {};
  }

  return JSON.parse(obj) as Tutorials;
}
