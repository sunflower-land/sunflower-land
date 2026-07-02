import Decimal from "decimal.js-light";
import {
  isCollectibleBuilt,
  isTemporaryCollectibleActive,
} from "features/game/lib/collectibleBuilt";
import {
  getBudYieldBoosts,
  type Resource,
} from "features/game/lib/getBudYieldBoosts";
import {
  trackFarmActivity,
  type FarmActivityName,
} from "features/game/types/farmActivity";
import {
  type GreenHouseFruitName,
  PATCH_FRUIT,
  type PatchFruitName,
} from "features/game/types/fruits";
import type {
  BoostName,
  CriticalHitName,
  GameState,
} from "features/game/types/game";
import type { FruitCompostName } from "features/game/types/composters";
import { getPlantedAt } from "./fruitPlanted";
import { isWearableActive } from "features/game/lib/wearables";
import { isGreenhouseFruit } from "./plantGreenhouse";
import { FACTION_ITEMS } from "features/game/lib/factions";
import { produce } from "immer";
import { getActiveCalendarEvent } from "features/game/types/calendar";
import { getActiveGuardian } from "features/game/lib/getActiveGuardian";
import { getFruitfulBlendBuff } from "./fertiliseFruitPatch";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { prngChance } from "lib/prng";
import { KNOWN_IDS } from "features/game/types";
import { isFruitReadyToHarvest } from "./fruitPatchReadiness";

export type HarvestFruitAction = {
  type: "fruit.harvested";
  index: string;
};

type Options = {
  state: Readonly<GameState>;
  action: HarvestFruitAction;
  createdAt?: number;
  farmId: number;
};

export { isFruitReadyToHarvest };

type FruitYield = {
  name: GreenHouseFruitName | PatchFruitName;
  game: GameState;
  fertiliser?: FruitCompostName;
  prngArgs?: { farmId: number; counter: number };
};

const isFruit = (resource: Resource): resource is PatchFruitName => {
  return resource in PATCH_FRUIT;
};

// Basic = Blueberry & Orange - Skill
export const isBasicFruit = (
  resource: Resource,
): resource is PatchFruitName => {
  return resource === "Blueberry" || resource === "Orange";
};

// Advanced = Apple, Banana - Skill
export const isAdvancedFruit = (
  resource: Resource,
): resource is PatchFruitName => {
  return resource === "Apple" || resource === "Banana";
};

export function getFruitYield({
  game,
  name,
  fertiliser,
  prngArgs,
}: FruitYield): {
  amount: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const { bumpkin } = game;
  let amount = 1;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (prngArgs) {
    const itemId = KNOWN_IDS[name];
    const criticalDrop = (criticalHitName: CriticalHitName, chance: number) =>
      prngChance({ ...prngArgs, itemId, chance, criticalHitName });

    // Generous Orchard: 20% chance of +1 patch fruit
    if (
      bumpkin.skills["Generous Orchard"] &&
      criticalDrop("Generous Orchard", 20) &&
      isFruit(name)
    ) {
      amount += 1;
      boostsUsed.push({ name: "Generous Orchard", value: "+1" });
    }
  }

  if (name === "Apple" && isCollectibleBuilt({ name: "Lady Bug", game })) {
    amount += 0.25;
    boostsUsed.push({ name: "Lady Bug", value: "+0.25" });
  }

  if (
    name === "Blueberry" &&
    isCollectibleBuilt({ name: "Black Bearry", game })
  ) {
    amount += 1;
    boostsUsed.push({ name: "Black Bearry", value: "+1" });
  }

  if (isFruit(name) && isCollectibleBuilt({ name: "Macaw", game })) {
    if (bumpkin.skills["Loyal Macaw"]) {
      amount += 0.2;
      boostsUsed.push({ name: "Loyal Macaw", value: "+0.2" });
    } else {
      amount += 0.1;
    }
    boostsUsed.push({ name: "Macaw", value: "+0.1" });
  }

  if (isFruit(name) && isWearableActive({ name: "Camel Onesie", game })) {
    amount += 0.1;
    boostsUsed.push({ name: "Camel Onesie", value: "+0.1" });
  }

  if (
    (name === "Apple" ||
      name === "Orange" ||
      name === "Blueberry" ||
      name === "Banana") &&
    isWearableActive({ name: "Fruit Picker Apron", game })
  ) {
    amount += 0.1;
    boostsUsed.push({ name: "Fruit Picker Apron", value: "+0.1" });
  }

  if (isFruit(name) && bumpkin.skills["Fruitful Fumble"]) {
    amount += 0.1;
    boostsUsed.push({ name: "Fruitful Fumble", value: "+0.1" });
  }

  //Faction Quiver
  const factionName = game.faction?.name;
  if (
    factionName &&
    isWearableActive({
      game,
      name: FACTION_ITEMS[factionName].wings,
    })
  ) {
    amount += 0.25;
    boostsUsed.push({ name: FACTION_ITEMS[factionName].wings, value: "+0.25" });
  }

  if (fertiliser === "Fruitful Blend" || fertiliser === "Turbofruit Mix") {
    const { amount: fruitfulBlendBuff, boostsUsed: fruitfulBlendBuffBoosts } =
      getFruitfulBlendBuff(game);
    amount += fruitfulBlendBuff;
    boostsUsed.push(...fruitfulBlendBuffBoosts);
  }

  if (name === "Banana" && isWearableActive({ name: "Banana Amulet", game })) {
    amount += 0.5;
    boostsUsed.push({ name: "Banana Amulet", value: "+0.5" });
  }

  if (
    name === "Banana" &&
    isCollectibleBuilt({ name: "Banana Chicken", game })
  ) {
    amount += 0.1;
    boostsUsed.push({ name: "Banana Chicken", value: "+0.1" });
  }

  // Lemon
  if (name === "Lemon" && isCollectibleBuilt({ name: "Lemon Shark", game })) {
    amount += 0.2;
    boostsUsed.push({ name: "Lemon Shark", value: "+0.2" });
  }

  if (name === "Lemon" && isWearableActive({ name: "Lemon Shield", game })) {
    amount += 1;
    boostsUsed.push({ name: "Lemon Shield", value: "+1" });
  }

  if (
    name === "Lemon" &&
    isCollectibleBuilt({ name: "Reveling Lemon", game })
  ) {
    amount += 0.25;
    boostsUsed.push({ name: "Reveling Lemon", value: "+0.25" });
  }

  if (
    name === "Tomato" &&
    isCollectibleBuilt({ name: "Tomato Bombard", game })
  ) {
    amount += 1;
    boostsUsed.push({ name: "Tomato Bombard", value: "+1" });
  }

  const { yieldBoost, budUsed } = getBudYieldBoosts(game.buds ?? {}, name);
  amount += yieldBoost;
  if (budUsed)
    boostsUsed.push({ name: budUsed, value: `+${yieldBoost.toString()}` });

  // Grape
  if (name === "Grape" && isCollectibleBuilt({ name: "Vinny", game })) {
    amount += 0.25;
    boostsUsed.push({ name: "Vinny", value: "+0.25" });
  }

  if (name === "Grape" && isCollectibleBuilt({ name: "Grape Granny", game })) {
    amount += 1;
    boostsUsed.push({ name: "Grape Granny", value: "+1" });
  }

  if (name === "Grape" && isWearableActive({ name: "Grape Pants", game })) {
    amount += 0.2;
    boostsUsed.push({ name: "Grape Pants", value: "+0.2" });
  }

  if (bumpkin.skills["Zesty Vibes"] && !isGreenhouseFruit(name)) {
    if (name === "Tomato" || name === "Lemon") {
      amount += 1;
      boostsUsed.push({ name: "Zesty Vibes", value: "+1" });
    } else {
      amount -= 0.25;
      boostsUsed.push({ name: "Zesty Vibes", value: "-0.25" });
    }
  }

  if (isTemporaryCollectibleActive({ name: "Legendary Shrine", game })) {
    amount += 1;
    boostsUsed.push({ name: "Legendary Shrine", value: "+1" });
  }

  if (
    getActiveCalendarEvent({ calendar: game.calendar }) === "bountifulHarvest"
  ) {
    amount += 1;
    boostsUsed.push({ name: "bountifulHarvest", value: "+1" });
    const { activeGuardian } = getActiveGuardian({
      game,
    });
    if (activeGuardian) {
      amount += 1;
      boostsUsed.push({ name: activeGuardian, value: "+1" });
    }
  }

  return { amount, boostsUsed };
}

export function harvestFruit({
  state,
  action,
  createdAt = Date.now(),
  farmId,
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { fruitPatches, bumpkin } = stateCopy;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    const patch = fruitPatches[action.index];

    if (!patch) {
      throw new Error("Fruit patch does not exist");
    }

    if (patch.x === undefined && patch.y === undefined) {
      throw new Error("Fruit patch is not placed");
    }

    if (!patch.fruit) {
      throw new Error("Nothing was planted");
    }

    const { name, harvestsLeft, harvestedAt } = patch.fruit;

    const { seed } = PATCH_FRUIT[name];

    // Windowed readyAt keys off the active phase (harvestedAt || plantedAt); the
    // original grow throws "Not ready", a post-harvest replenish throws "still
    // replenishing" — same split as the legacy two-check gate.
    if (
      !isFruitReadyToHarvest(
        createdAt,
        patch.fruit,
        stateCopy,
        patch.fertiliser,
      )
    ) {
      throw new Error(
        harvestedAt ? "Fruit is still replenishing" : "Not ready",
      );
    }

    if (!harvestsLeft) {
      throw new Error("No harvest left");
    }

    const counter = stateCopy.farmActivity[`${name} Harvested`] ?? 0;
    const { amount, boostsUsed } =
      patch.fruit.amount !== undefined
        ? { amount: patch.fruit.amount, boostsUsed: [] }
        : getFruitYield({
            game: stateCopy,
            name,
            fertiliser: patch.fertiliser?.name,
            prngArgs: { farmId, counter },
          });

    stateCopy.inventory[name] =
      stateCopy.inventory[name]?.add(amount) ?? new Decimal(amount);

    patch.fruit.harvestsLeft = patch.fruit.harvestsLeft - 1;
    // A fruit already on the windowed model (baseDurationMs set) stays windowed
    // for its remaining harvests even if SPEED_BOOSTS is later rolled back —
    // otherwise the read path (which keys off baseDurationMs) would keep windowed
    // timing while the write silently reverted it to legacy mid-life. Patch
    // fertiliser persists across harvests; passing it into getPlantedAt applies
    // Turbofruit Mix to replenishment timing for every remaining harvest.
    const forceWindowed = patch.fruit.baseDurationMs !== undefined;
    const {
      plantedAt: newPlantedAt,
      baseDurationMs: newBaseDurationMs,
      boostsUsed: fruitPlantedBoostsUsed,
    } = getPlantedAt(
      seed,
      stateCopy,
      createdAt,
      patch.fertiliser?.name,
      forceWindowed,
    );
    delete patch.fruit.amount;
    // New replenish phase starts with a fresh progress bar (no banked work yet).
    delete patch.fruit.boostedTime;
    patch.fruit.harvestedAt = newPlantedAt;
    // Windowed replenish stores the real harvestedAt + a permanent-boost-only
    // base recovery; a legacy (never-windowed) fruit under flag-off back-dates
    // harvestedAt instead, so clear any baseDurationMs.
    if (newBaseDurationMs !== undefined) {
      patch.fruit.baseDurationMs = newBaseDurationMs;
    } else {
      delete patch.fruit.baseDurationMs;
    }

    const activityName: FarmActivityName = `${name} Harvested`;

    stateCopy.farmActivity = trackFarmActivity(
      activityName,
      stateCopy.farmActivity,
    );

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: [...boostsUsed, ...fruitPlantedBoostsUsed],
      createdAt,
    });

    return stateCopy;
  });
}
