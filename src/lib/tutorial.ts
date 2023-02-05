import { marketRate } from "features/game/lib/halvening";
import { getBumpkinLevel } from "features/game/lib/level";
import { BuildingName } from "features/game/types/buildings";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";

const TUTORIAL_ACKNOWLEDGEMENT_KEY = "sunflower_isles_tutorials";

type TutorialName =
  | BuildingName
  | "Boat"
  | "BuildingMenu"
  | "Bumpkin"
  | "Grub Shop";

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

export enum TutorialStep {
  SUNFLOWERS_HARVESTED = 1,
  SUNFLOWERS_SOLD = 2,
  SUNFLOWER_SEEDS_BOUGHT = 3,
  SUNFLOWER_SEEDS_PLANTED = 4,
  POTATOES_GATHERED = 5,
  MASHED_POTATO_COOKED = 6,
  MASHED_POTATO_EATEN = 7,
  LEVEL_TWO = 8,
}

type TutorialChallenge = {
  description: string;
  trigger: (gameState: GameState) => boolean;
  effect: (gameState: GameState) => GameState;
};

export const TUTORIAL_CHALLENGES: Record<TutorialStep, TutorialChallenge> = {
  [TutorialStep.SUNFLOWERS_HARVESTED]: {
    description: "?",
    trigger: (game) =>
      (game.bumpkin?.activity?.["Sunflower Harvested"] ?? 0) >= 9,
    effect: (game) => game,
  },
  [TutorialStep.SUNFLOWERS_SOLD]: {
    description: "?",
    trigger: (game) => (game.bumpkin?.activity?.["Sunflower Sold"] ?? 0) >= 9,
    effect: (game) => game,
  },
  [TutorialStep.SUNFLOWER_SEEDS_BOUGHT]: {
    description: "?",
    trigger: (game) =>
      (game.bumpkin?.activity?.["Sunflower Seed Bought"] ?? 0) >= 3,
    effect: (game) => game,
  },
  [TutorialStep.SUNFLOWER_SEEDS_PLANTED]: {
    description: "?",
    trigger: (game) =>
      (game.bumpkin?.activity?.["Sunflower Planted"] ?? 0) >= 3,
    effect: (game) => ({
      ...game,
      // Add a letter to the box
      mail: {
        letters: [
          {
            id: "1",
            title: "You look hungry...",
            from: "Aunt Betty",
            content: `Hi Darling, it looks like you haven't eaten anything yet!
        
    If you want to become an advanced farmer, you need to cook food and feed your Bumpkin.`,
            bumpkin: {
              hair: "Parlour Hair",
              body: "Beige Farmer Potion",
              pants: "Peasant Skirt",
              shoes: "Black Farmer Boots",
              coat: "Chef Apron",
              shirt: "Blue Farmer Shirt",
              tool: "Golden Spatula",
            },
            sentAt: 0,
            gift: {
              sfl: 0,
              items: {
                Potato: 10,
              },
            },
          },
        ],
      },
    }),
  },
  [TutorialStep.POTATOES_GATHERED]: {
    description: "?",
    trigger: (game) => (game.bumpkin?.activity?.["Mail Read"] ?? 0) >= 1,
    effect: (game) => game,
  },
  [TutorialStep.MASHED_POTATO_COOKED]: {
    description: "?",
    trigger: (game) =>
      (game.bumpkin?.activity?.["Mashed Potato Collected"] ?? 0) >= 1,
    effect: (game) => game,
  },
  [TutorialStep.MASHED_POTATO_EATEN]: {
    description: "?",
    trigger: (game) =>
      (game.bumpkin?.activity?.["Mashed Potato Fed"] ?? 0) >= 1,
    effect: (game) => game,
  },
  [TutorialStep.LEVEL_TWO]: {
    description: "?",
    trigger: (game) => getBumpkinLevel(game.bumpkin?.experience) >= 2,
    effect: (game) => ({
      ...game,
      // Add a letter to the box
      mail: {
        letters: [
          {
            id: "2",
            title: "You look strong",
            from: "Aunt Betty",
            content: `You look strong enough to start chopping trees and mining rocks.

Hopefully this helps you start crafting tools!`,
            bumpkin: {
              hair: "Parlour Hair",
              body: "Beige Farmer Potion",
              pants: "Peasant Skirt",
              shoes: "Black Farmer Boots",
              coat: "Chef Apron",
              shirt: "Blue Farmer Shirt",
              tool: "Golden Spatula",
            },
            sentAt: 0,
            gift: {
              sfl: marketRate(50).toNumber(),
              items: {},
            },
          },
        ],
      },
    }),
  },
};

const TUTORIAL_STEPS_ACKNOWLEDGEMENT_KEY = "tutorial_steps";

type CompletedSteps = Partial<Record<TutorialStep, boolean>>;

export function acknowledgeStep(step: TutorialStep) {
  const previous = getAcknowledgedSteps();

  localStorage.setItem(
    TUTORIAL_STEPS_ACKNOWLEDGEMENT_KEY,
    JSON.stringify({
      ...previous,
      [step]: true,
    })
  );
}

function getAcknowledgedSteps(): CompletedSteps {
  const item = localStorage.getItem(TUTORIAL_STEPS_ACKNOWLEDGEMENT_KEY);

  if (!item) {
    return {};
  }

  return JSON.parse(item) as CompletedSteps;
}

export function reachedMilestone(
  previousGameState: GameState,
  gameState: GameState
) {
  const milestone = getKeys(TUTORIAL_CHALLENGES).find((step) => {
    const previouslyCompleted =
      TUTORIAL_CHALLENGES[step].trigger(previousGameState);
    const completed = TUTORIAL_CHALLENGES[step].trigger(gameState);

    // They just completed it!
    if (!previouslyCompleted && completed) {
      return true;
    }
  });

  if (!milestone) {
    return undefined;
  }

  return Number(milestone) as TutorialStep;
}
