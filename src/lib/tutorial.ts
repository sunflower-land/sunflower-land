import type { BuildingName } from "features/game/types/buildings";
import type { CaveTutorialAcknowledgement } from "features/cave/lib/onboarding";

const TUTORIAL_ACKNOWLEDGEMENT_KEY = "sunflower_isles_tutorials";

type TutorialName =
  | BuildingName
  | "Boat"
  | "BuildingMenu"
  | "Bumpkin"
  | "Grub Shop"
  | "Treasure Detector"
  | "Pirate Quest"
  | "Garbage Collector"
  | "Incinerator"
  | "Chore Master"
  | CaveTutorialAcknowledgement;

// Acknowledgements made this session, so a tutorial closed once stays closed
// even when browser storage cannot be read or written (private browsing,
// blocked site data).
const sessionAcknowledgements: Tutorials = {};

export function acknowledgeTutorial(tutorialName: TutorialName) {
  const acknowledgement = { acknowledgedAt: Date.now() };
  sessionAcknowledgements[tutorialName] = acknowledgement;

  const newAcknowledgements: Tutorials = {
    ...getAcknowledgements(),
    [tutorialName]: acknowledgement,
  };

  try {
    localStorage.setItem(
      TUTORIAL_ACKNOWLEDGEMENT_KEY,
      JSON.stringify(newAcknowledgements),
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Could not save tutorial acknowledgement: ", e);
  }
}

export function hasShownTutorial(tutorialName: TutorialName): boolean {
  return (
    !!sessionAcknowledgements[tutorialName] ||
    !!getAcknowledgements()[tutorialName]
  );
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
  try {
    const obj = localStorage.getItem(TUTORIAL_ACKNOWLEDGEMENT_KEY);

    if (!obj) {
      return {};
    }

    const parsed: unknown = JSON.parse(obj);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      throw new Error("Tutorial acknowledgements are not an object");
    }

    return parsed as Tutorials;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Could not read tutorial acknowledgements: ", e);
    return {};
  }
}
