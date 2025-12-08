import Decimal from "decimal.js-light";
import {
  isCollectibleBuilt,
  isTemporaryCollectibleActive,
} from "features/game/lib/collectibleBuilt";
import {
  getBudYieldBoosts,
  Resource,
} from "features/game/lib/getBudYieldBoosts";
import {
  trackFarmActivity,
  FarmActivityName,
} from "features/game/types/farmActivity";
import {
  GreenHouseFruitName,
  PATCH_FRUIT,
  PATCH_FRUIT_SEEDS,
  PatchFruit,
  PatchFruitName,
} from "features/game/types/fruits";
import {
  BoostName,
  CriticalHitName,
  GameState,
  PlantedFruit,
} from "features/game/types/game";
import { FruitCompostName } from "features/game/types/composters";
import { getPlantedAt } from "./fruitPlanted";
import { isWearableActive } from "features/game/lib/wearables";
import { isGreenhouseFruit } from "./plantGreenhouse";
import { FACTION_ITEMS } from "features/game/lib/factions";
import { produce } from "immer";
import {
  getActiveCalendarEvent,
  getActiveGuardian,
} from "features/game/types/calendar";
import { getFruitfulBlendBuff } from "./fertiliseFruitPatch";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export type HarvestFruitAction = {
  type: "fruit.harvested";
  index: string;
};

type Options = {
  state: Readonly<GameState>;
  action: HarvestFruitAction;
  createdAt?: number;
};

export const isFruitReadyToHarvest = (
  createdAt: number,
  plantedFruit: PlantedFruit,
  fruitDetails: PatchFruit,
) => {
  const { seed } = PATCH_FRUIT[fruitDetails.name];
  const { plantSeconds } = PATCH_FRUIT_SEEDS[seed];

  return (
    createdAt -
      (plantedFruit.harvestedAt
        ? plantedFruit.harvestedAt
        : plantedFruit.plantedAt) >=
    plantSeconds * 1000
  );
};

type FruitYield = {
  name: GreenHouseFruitName | PatchFruitName;
  game: GameState;
  fertiliser?: FruitCompostName;
  criticalDrop?: (name: CriticalHitName) => boolean;
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
  criticalDrop = () => false,
}: FruitYield): { amount: number; boostsUsed: BoostName[] } {
  const { bumpkin } = game;
  let amount = 1;
  const boostsUsed: BoostName[] = [];

  if (name === "Apple" && isCollectibleBuilt({ name: "Lady Bug", game })) {
    amount += 0.25;
    boostsUsed.push("Lady Bug");
  }

  if (
    name === "Blueberry" &&
    isCollectibleBuilt({ name: "Black Bearry", game })
  ) {
    amount += 1;
    boostsUsed.push("Black Bearry");
  }

  if (isFruit(name) && isCollectibleBuilt({ name: "Macaw", game })) {
    if (bumpkin.skills["Loyal Macaw"]) {
      amount += 0.2;
      boostsUsed.push("Loyal Macaw");
    } else {
      amount += 0.1;
    }
    boostsUsed.push("Macaw");
  }

  if (isFruit(name) && isWearableActive({ name: "Camel Onesie", game })) {
    amount += 0.1;
    boostsUsed.push("Camel Onesie");
  }

  if (
    (name === "Apple" ||
      name === "Orange" ||
      name === "Blueberry" ||
      name === "Banana") &&
    isWearableActive({ name: "Fruit Picker Apron", game })
  ) {
    amount += 0.1;
    boostsUsed.push("Fruit Picker Apron");
  }

  if (isFruit(name) && bumpkin.skills["Fruitful Fumble"]) {
    amount += 0.1;
    boostsUsed.push("Fruitful Fumble");
  }

  // Glass Room, +0.1 yield
  if (isGreenhouseFruit(name) && bumpkin.skills["Glass Room"]) {
    amount += 0.1;
    boostsUsed.push("Glass Room");
  }

  if (isGreenhouseFruit(name) && bumpkin.skills["Seeded Bounty"]) {
    amount += 0.5;
    boostsUsed.push("Seeded Bounty");
  }

  if (isGreenhouseFruit(name) && bumpkin.skills["Greasy Plants"]) {
    amount += 1;
    boostsUsed.push("Greasy Plants");
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
    boostsUsed.push(FACTION_ITEMS[factionName].wings);
  }

  if (fertiliser === "Fruitful Blend") {
    const { amount: fruitfulBlendBuff, boostsUsed: fruitfulBlendBuffBoosts } =
      getFruitfulBlendBuff(game);
    amount += fruitfulBlendBuff;
    boostsUsed.push(...fruitfulBlendBuffBoosts);
  }

  if (name === "Banana" && isWearableActive({ name: "Banana Amulet", game })) {
    amount += 0.5;
    boostsUsed.push("Banana Amulet");
  }

  if (
    name === "Banana" &&
    isCollectibleBuilt({ name: "Banana Chicken", game })
  ) {
    amount += 0.1;
    boostsUsed.push("Banana Chicken");
  }

  // Lemon
  if (name === "Lemon" && isCollectibleBuilt({ name: "Lemon Shark", game })) {
    amount += 0.2;
    boostsUsed.push("Lemon Shark");
  }

  if (name === "Lemon" && isWearableActive({ name: "Lemon Shield", game })) {
    amount += 1;
    boostsUsed.push("Lemon Shield");
  }

  if (
    name === "Lemon" &&
    isCollectibleBuilt({ name: "Reveling Lemon", game })
  ) {
    amount += 0.25;
    boostsUsed.push("Reveling Lemon");
  }

  if (
    name === "Tomato" &&
    isCollectibleBuilt({ name: "Tomato Bombard", game })
  ) {
    amount += 1;
    boostsUsed.push("Tomato Bombard");
  }

  const { yieldBoost, budUsed } = getBudYieldBoosts(game.buds ?? {}, name);
  amount += yieldBoost;
  if (budUsed) boostsUsed.push(budUsed);

  // Grape
  if (name === "Grape" && isCollectibleBuilt({ name: "Vinny", game })) {
    amount += 0.25;
    boostsUsed.push("Vinny");
  }

  if (name === "Grape" && isCollectibleBuilt({ name: "Grape Granny", game })) {
    amount += 1;
    boostsUsed.push("Grape Granny");
  }

  if (name === "Grape" && isWearableActive({ name: "Grape Pants", game })) {
    amount += 0.2;
    boostsUsed.push("Grape Pants");
  }

  if (
    isGreenhouseFruit(name) &&
    isCollectibleBuilt({ name: "Pharaoh Gnome", game })
  ) {
    amount += 2;
    boostsUsed.push("Pharaoh Gnome");
  }

  if (bumpkin.skills["Zesty Vibes"] && !isGreenhouseFruit(name)) {
    if (name === "Tomato" || name === "Lemon") {
      amount += 1;
    } else {
      amount -= 0.25;
    }
    boostsUsed.push("Zesty Vibes");
  }

  // Greenhouse Gamble 25% chance of +1 yield
  if (
    isGreenhouseFruit(name) &&
    bumpkin.skills["Greenhouse Gamble"] &&
    criticalDrop("Greenhouse Gamble")
  ) {
    amount += 1;
    boostsUsed.push("Greenhouse Gamble");
  }

  // Generous Orchard: 10% chance of +1 patch fruit
  if (
    bumpkin.skills["Generous Orchard"] &&
    criticalDrop("Generous Orchard") &&
    isFruit(name)
  ) {
    amount += 1;
    boostsUsed.push("Generous Orchard");
  }

  if (isTemporaryCollectibleActive({ name: "Legendary Shrine", game })) {
    amount += 1;
    boostsUsed.push("Legendary Shrine");
  }

  if (
    getActiveCalendarEvent({ calendar: game.calendar }) === "bountifulHarvest"
  ) {
    amount += 1;
    const { activeGuardian } = getActiveGuardian({
      game,
    });
    if (activeGuardian) {
      amount += 1;
      boostsUsed.push(activeGuardian);
    }
  }

  return { amount, boostsUsed };
}

export function harvestFruit({
  state,
  action,
  createdAt = Date.now(),
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

    const {
      name,
      plantedAt,
      harvestsLeft,
      harvestedAt,
      criticalHit = {},
    } = patch.fruit;

    const { seed } = PATCH_FRUIT[name];
    const { plantSeconds } = PATCH_FRUIT_SEEDS[seed];

    if (createdAt - plantedAt < plantSeconds * 1000) {
      throw new Error("Not ready");
    }

    if (createdAt - harvestedAt < plantSeconds * 1000) {
      throw new Error("Fruit is still replenishing");
    }

    if (!harvestsLeft) {
      throw new Error("No harvest left");
    }

    const { amount, boostsUsed } =
      patch.fruit.amount !== undefined
        ? { amount: patch.fruit.amount, boostsUsed: [] }
        : getFruitYield({
            game: stateCopy,
            name,
            fertiliser: patch.fertiliser?.name,
            criticalDrop: (name) => !!(criticalHit[name] ?? 0),
          });

    stateCopy.inventory[name] =
      stateCopy.inventory[name]?.add(amount) ?? new Decimal(amount);

    patch.fruit.harvestsLeft = patch.fruit.harvestsLeft - 1;
    const { plantedAt: newPlantedAt, boostsUsed: fruitPlantedBoostsUsed } =
      getPlantedAt(seed, stateCopy, createdAt);
    delete patch.fruit.amount;
    patch.fruit.harvestedAt = newPlantedAt;

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
