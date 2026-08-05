import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import {
  type ComposterName,
  SEASON_COMPOST_REQUIREMENTS,
  composterDetails,
} from "features/game/types/composters";
import { getKeys } from "lib/object";
import type {
  BoostName,
  CompostBuilding,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import { translate } from "lib/i18n/translate";
import { produce } from "immer";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { isWearableActive } from "features/game/lib/wearables";
import { SKILL_RANKS, getSkillLevel } from "features/game/types/bumpkinSkills";

export type StartComposterAction = {
  type: "composter.started";
  building: ComposterName;
};

type Options = {
  state: Readonly<GameState>;
  action: StartComposterAction;
  createdAt?: number;
};

export function getReadyAt({
  gameState,
  composter,
}: {
  gameState: GameState;
  composter: ComposterName;
}): {
  timeToFinishMilliseconds: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  let { timeToFinishMilliseconds } = composterDetails[composter];
  const boostsUsed: { name: BoostName; value: string }[] = [];

  // gives +10% speed boost if the player has the Soil Krabby
  if (isCollectibleBuilt({ name: "Soil Krabby", game: gameState })) {
    timeToFinishMilliseconds = timeToFinishMilliseconds * 0.9;
    boostsUsed.push({ name: "Soil Krabby", value: "x0.9" });
  }

  // gives a speed boost if the player has the Swift Decomposer skill
  const swiftDecomposerLevel = getSkillLevel(
    gameState.bumpkin?.skills ?? {},
    "Swift Decomposer",
  );
  if (swiftDecomposerLevel) {
    const v = SKILL_RANKS["Swift Decomposer"].ranks[swiftDecomposerLevel - 1];
    timeToFinishMilliseconds = timeToFinishMilliseconds * v;
    boostsUsed.push({ name: "Swift Decomposer", value: `x${v}` });
  }

  return { timeToFinishMilliseconds, boostsUsed };
}

export function getCompostAmount({
  game,
  building,
}: {
  game: GameState;
  building: ComposterName;
}): {
  produceAmount: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  let { produceAmount } = composterDetails[building];
  const boostsUsed: { name: BoostName; value: string }[] = [];
  const { skills } = game.bumpkin;

  const efficientBinLevel = getSkillLevel(skills, "Efficient Bin");
  if (efficientBinLevel && building === "Compost Bin") {
    const v = SKILL_RANKS["Efficient Bin"].ranks[efficientBinLevel - 1];
    produceAmount += v;
    boostsUsed.push({ name: "Efficient Bin", value: `+${v}` });
  }

  const turboChargedLevel = getSkillLevel(skills, "Turbo Charged");
  if (turboChargedLevel && building === "Turbo Composter") {
    const v = SKILL_RANKS["Turbo Charged"].ranks[turboChargedLevel - 1];
    produceAmount += v;
    boostsUsed.push({ name: "Turbo Charged", value: `+${v}` });
  }

  const premiumWormsLevel = getSkillLevel(skills, "Premium Worms");
  if (premiumWormsLevel && building === "Premium Composter") {
    const v = SKILL_RANKS["Premium Worms"].ranks[premiumWormsLevel - 1];
    produceAmount += v;
    boostsUsed.push({ name: "Premium Worms", value: `+${v}` });
  }

  const compostingRevampLevel = getSkillLevel(skills, "Composting Revamp");
  if (compostingRevampLevel) {
    const v = SKILL_RANKS["Composting Revamp"].buff[compostingRevampLevel - 1];
    produceAmount += v;
    boostsUsed.push({ name: "Composting Revamp", value: `+${v}` });
  }

  if (isWearableActive({ game, name: "Turd Topper" })) {
    produceAmount += 1;
    boostsUsed.push({ name: "Turd Topper", value: "+1" });
  }

  if (produceAmount < 0) {
    produceAmount = 0;
  }

  return { produceAmount, boostsUsed };
}

export function startComposter({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { building } = action;
    const buildings = stateCopy.buildings[building] as CompostBuilding[];
    if (!buildings?.some((building) => !!building.coordinates)) {
      throw new Error(translate("error.composterNotExist"));
    }

    const { inventory } = stateCopy;
    const composter = buildings[0];
    const { producing } = composter;

    if (producing) {
      throw new Error(translate("error.alr.composter"));
    }

    const requires = {
      ...SEASON_COMPOST_REQUIREMENTS[building][stateCopy.season.season],
    };

    if (!requires) {
      throw new Error(translate("error.alr.composter"));
    }

    // remove the requirements from the player's inventory
    getKeys(requires ?? {}).forEach((name) => {
      const previous = inventory[name as InventoryItemName] || new Decimal(0);

      if (previous.lt(requires?.[name] ?? 0)) {
        throw new Error(translate("error.missing"));
      }

      inventory[name as InventoryItemName] = previous.minus(
        requires?.[name] ?? 0,
      );
    });

    const { produce } = composterDetails[building];

    const { produceAmount, boostsUsed: composterBoostsUsed } = getCompostAmount(
      {
        game: stateCopy,
        building,
      },
    );
    const { timeToFinishMilliseconds, boostsUsed } = getReadyAt({
      gameState: stateCopy,
      composter: building,
    });

    // start the production
    // Worm amount is rolled at collect time via a seeded PRNG, so boosts
    // equipped any time before collect apply to the final bait output.
    buildings[0].producing = {
      items: {
        [produce]: produceAmount,
      },
      startedAt: createdAt,
      readyAt: createdAt + timeToFinishMilliseconds,
    };

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: [...boostsUsed, ...composterBoostsUsed],
      createdAt,
    });

    return stateCopy;
  });
}
