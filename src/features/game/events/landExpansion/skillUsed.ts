import {
  BumpkinRevampSkillName,
  BUMPKIN_REVAMP_SKILL_TREE,
  BumpkinSkillRevamp,
} from "features/game/types/bumpkinSkills";
import { getKeys } from "features/game/types/decorations";
import {
  GameState,
  CropPlot,
  Tree,
  GreenhousePot,
  FlowerBeds,
  OilReserve,
  InventoryItemName,
  AnimalBuildingKey,
  AOE,
} from "features/game/types/game";
import { produce } from "immer";
import { BUILDING_DAILY_OIL_CAPACITY } from "./supplyCookingOil";
import Decimal from "decimal.js-light";
import { translate } from "lib/i18n/translate";
import { CROPS } from "features/game/types/crops";
import { canChop } from "./chop";
import { canDrillOilReserve } from "./drillOilReserve";
import { isReadyToHarvest } from "./harvest";
import { getCurrentCookingItem, recalculateQueue } from "./cancelQueuedRecipe";
import { AOEItemName } from "features/game/expansion/placeable/lib/collisionDetection";
import { FLOWER_SEEDS, FLOWERS } from "features/game/types/flowers";
import { updateBeehives } from "features/game/lib/updateBeehives";
import { isWearableActive } from "features/game/lib/wearables";
import { getPlotsToFertilise } from "./bulkFertilisePlot";

export type SkillUseAction = {
  type: "skill.used";
  skill: BumpkinRevampSkillName;
};

type Options = {
  state: Readonly<GameState>;
  action: SkillUseAction;
  createdAt?: number;
};

function useInstantGrowth({
  crops,
  aoe,
  createdAt = Date.now(),
}: {
  crops: Record<string, CropPlot>;
  aoe: AOE;
  createdAt?: number;
}): Record<string, CropPlot> {
  // Set each plot's plantedAt to 1 (making it grow instantly)
  getKeys(crops).forEach((plot) => {
    const plantedCrop = crops[plot].crop;
    if (plantedCrop) {
      plantedCrop.plantedAt = 1;
    }
  });

  const basicScarecrowAOE = aoe["Basic Scarecrow"] ?? {};
  Object.values(basicScarecrowAOE).forEach((dyObject) => {
    if (!dyObject) return;
    getKeys(dyObject).forEach((dy) => {
      dyObject[dy] = createdAt;
    });
  });

  const cropYieldAOEItems: AOEItemName[] = [
    "Scary Mike",
    "Laurie the Chuckle Crow",
    "Gnome",
    "Queen Cornelia",
    "Sir Goldensnout",
  ];

  cropYieldAOEItems.forEach((item) => {
    const aoeItem = aoe[item] ?? {};
    Object.values(aoeItem).forEach((dyObject) => {
      if (!dyObject) return;
      getKeys(dyObject).forEach((dy) => {
        dyObject[dy] = 1;
      });
    });
  });

  return crops;
}

function useTreeBlitz({
  trees,
}: {
  trees: Record<string, Tree>;
}): Record<string, Tree> {
  getKeys(trees).forEach((tree) => {
    const { wood } = trees[tree];
    if (wood) {
      wood.choppedAt = 1;
    }
  });
  return trees;
}

function useGreenhouseGuru({
  greenhousePot,
}: {
  greenhousePot: Record<string, GreenhousePot>;
}): Record<string, GreenhousePot> {
  getKeys(greenhousePot).forEach((pot) => {
    const { plant } = greenhousePot[pot];
    if (plant) {
      plant.plantedAt = 1;
    }
  });

  return greenhousePot;
}

function usePetalBlessed({
  flowerBeds,
  createdAt = Date.now(),
}: {
  flowerBeds: FlowerBeds;
  createdAt?: number;
}): FlowerBeds {
  Object.values(flowerBeds)
    .filter((bed) => bed.x !== undefined && bed.y !== undefined)
    .forEach((bed) => {
      const { flower } = bed;
      if (flower) {
        const growTime =
          FLOWER_SEEDS[FLOWERS[flower.name].seed].plantSeconds * 1000;
        flower.plantedAt = createdAt - growTime;
      }
    });
  return flowerBeds;
}

function useGreaseLightning({
  oilReserves,
}: {
  oilReserves: Record<string, OilReserve>;
}): Record<string, OilReserve> {
  getKeys(oilReserves).forEach((reserve) => {
    const { oil } = oilReserves[reserve];
    if (oil) {
      oil.drilledAt = 1;
    }
  });
  return oilReserves;
}

function useInstantGratification({
  game,
  createdAt = Date.now(),
}: {
  game: GameState;
  createdAt?: number;
}): GameState {
  getKeys(BUILDING_DAILY_OIL_CAPACITY).forEach((buildingName) => {
    const building = game.buildings[buildingName]?.[0];
    const queue = building?.crafting;

    if (!building || !queue) return;

    const currentlyCooking = getCurrentCookingItem({
      building: building,
      createdAt,
    });

    if (!currentlyCooking) return;

    const recipeIndex = queue.findIndex(
      (r) => r.readyAt === currentlyCooking.readyAt,
    ) as number;

    queue[recipeIndex].readyAt = createdAt;

    building.crafting = recalculateQueue({
      queue,
      createdAt,
      buildingName,
      game,
      isInstantCook: true,
    });
  });

  return game;
}

function useBarnyardRouse({
  game,
  createdAt = Date.now(),
}: {
  game: GameState;
  createdAt?: number;
}): GameState {
  // Get all animal buildings
  const buildings: AnimalBuildingKey[] = ["henHouse", "barn"];

  buildings.forEach((building) => {
    const { animals } = game[building];
    if (!animals) return;

    // Process each animal
    Object.values(animals).forEach((animal) => {
      const { awakeAt } = animal;
      if (awakeAt < createdAt) return;
      animal.awakeAt = createdAt;
    });
  });

  return game;
}

export function getSkillCooldown({
  cooldown,
  state,
}: {
  cooldown: number;
  state: GameState;
}) {
  let boostedCooldown = new Decimal(cooldown);
  if (isWearableActive({ name: "Luna's Crescent", game: state })) {
    boostedCooldown = boostedCooldown.mul(0.5);
  }
  return boostedCooldown.toNumber();
}

export function powerSkillDisabledConditions({
  state,
  skillTree,
  createdAt = Date.now(),
}: {
  state: GameState;
  skillTree: BumpkinSkillRevamp;
  createdAt?: number;
}): {
  disabled: boolean;
  reason?: string;
} {
  const {
    bumpkin,
    crops,
    trees,
    greenhouse: { pots },
    oilReserves,
    buildings,
    inventory,
    fruitPatches,
    henHouse: { animals: henHouseAnimals },
    barn: { animals: barnAnimals },
    flowers: { flowerBeds },
  } = state;
  const { previousPowerUseAt } = bumpkin;

  const { name: skillName, requirements } = skillTree as {
    name: BumpkinRevampSkillName;
  } & BumpkinSkillRevamp;
  const { cooldown, items } = requirements;

  const boostedCooldown = getSkillCooldown({ cooldown: cooldown ?? 0, state });

  const nextSkillUse = (previousPowerUseAt?.[skillName] ?? 0) + boostedCooldown;

  const powerSkillReady = nextSkillUse <= createdAt;

  const itemsRequired =
    !items ||
    Object.entries(items).every(([item, quantity]) =>
      (inventory[item as InventoryItemName] ?? new Decimal(0)).gte(quantity),
    );

  // Base conditions for all skills
  if (!powerSkillReady)
    return { disabled: true, reason: "Power Skill on Cooldown" };
  if (!itemsRequired) {
    return {
      disabled: true,
    };
  }

  switch (skillName) {
    // Crop fertiliser skills
    case "Sprout Surge":
    case "Root Rocket": {
      const unfertilisedPlots = getPlotsToFertilise(state, createdAt);
      const fertiliser =
        skillName === "Sprout Surge" ? "Sprout Mix" : "Rapid Root";
      const fertiliserCount = inventory[fertiliser] ?? new Decimal(0);
      if (unfertilisedPlots.length === 0) {
        return {
          disabled: true,
          reason: translate("powerSkills.reason.allPlotsFertilised"),
        };
      }

      if (fertiliserCount.lt(unfertilisedPlots.length)) {
        return {
          disabled: true,
          reason: translate("powerSkills.reason.insufficientFertiliser", {
            fertiliser,
          }),
        };
      }
      break;
    }

    // Fruit fertiliser skill
    case "Blend-tastic": {
      const unfertilisedPatches = Object.values(fruitPatches).filter(
        (patch) => !patch.fertiliser,
      ).length;
      const fertiliserCount = inventory["Fruitful Blend"] ?? new Decimal(0);
      if (fertiliserCount.lt(unfertilisedPatches)) {
        return {
          disabled: true,
        };
      }
      if (unfertilisedPatches === 0) {
        return {
          disabled: true,
          reason: translate("powerSkills.reason.allFruitPatchesFertilised"),
        };
      }
      break;
    }

    case "Instant Growth": {
      // Checks if all plots are empty or ready to harvest.
      if (getKeys(crops).length === 0) {
        return {
          disabled: true,
          reason: `You don't have any plots to grow crops on`,
        };
      }
      const plotsStatus = Object.values(crops).map((plot) => {
        if (!plot.crop) return "empty";
        return isReadyToHarvest(Date.now(), plot.crop, CROPS[plot.crop.name])
          ? "ready"
          : "growing";
      });
      if (!plotsStatus.includes("growing")) {
        return {
          disabled: true,
          reason: translate("powerSkills.reason.noCropsGrowing"),
        };
      }
      break;
    }

    case "Tree Blitz": {
      if (Object.values(trees).every((tree) => canChop(tree))) {
        return {
          disabled: true,
          reason: translate("powerSkills.reason.noTreesRecovering"),
        };
      }
      break;
    }

    case "Greenhouse Guru": {
      if (Object.values(pots).every((pot) => !pot.plant)) {
        return {
          disabled: true,
          reason: translate("powerSkills.reason.noGreenhouseProduceGrowing"),
        };
      }
      break;
    }

    case "Instant Gratification": {
      if (
        getKeys(BUILDING_DAILY_OIL_CAPACITY).every(
          (building) => !buildings[building]?.[0]?.crafting,
        )
      ) {
        return {
          disabled: true,
          reason: translate("powerSkills.reason.noBuildingsAreCooking"),
        };
      }
      break;
    }

    case "Petal Blessed": {
      if (Object.values(flowerBeds).every((bed) => !bed.flower)) {
        return {
          disabled: true,
          reason: translate("powerSkills.reason.noFlowersGrowing"),
        };
      }
      break;
    }

    case "Grease Lightning": {
      if (
        Object.values(oilReserves).every((reserve) =>
          canDrillOilReserve(reserve),
        )
      ) {
        return {
          disabled: true,
          reason: translate("powerSkills.reason.noOilreservesRefilling"),
        };
      }
      break;
    }

    case "Barnyard Rouse": {
      if (
        Object.values({ ...henHouseAnimals, ...barnAnimals }).every(
          ({ awakeAt }) => awakeAt < createdAt,
        )
      ) {
        return {
          disabled: true,
          reason: translate("powerSkills.reason.animalsNotAsleep"),
        };
      }
    }
  }
  return { disabled: false };
}

export function skillUse({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (stateCopy) => {
    const {
      bumpkin,
      crops,
      trees,
      greenhouse,
      flowers,
      oilReserves,
      inventory,
      aoe,
    } = stateCopy;

    const { skill } = action;

    const skillTree = BUMPKIN_REVAMP_SKILL_TREE[skill] as BumpkinSkillRevamp;

    const { requirements, power, disabled } = skillTree;
    const { items } = requirements;

    if (bumpkin == undefined) {
      throw new Error("You do not have a Bumpkin");
    }

    if (bumpkin.skills[skill] == undefined) {
      throw new Error("You do not have this skill");
    }

    if (!power) {
      throw new Error("This skill does not have a power");
    }

    if (disabled) {
      throw new Error(`Skill ${skill} is disabled`);
    }

    if (!bumpkin.previousPowerUseAt) {
      bumpkin.previousPowerUseAt = {};
    }

    const { disabled: powerDisabled, reason: powerReason } =
      powerSkillDisabledConditions({
        state: stateCopy,
        skillTree,
        createdAt,
      });

    if (powerDisabled) {
      throw new Error(powerReason);
    }

    // Skill is off cooldown, use it

    // TODO: Implement powers
    // Instant Growth
    if (skill === "Instant Growth") {
      stateCopy.crops = useInstantGrowth({ crops, aoe, createdAt });
    }

    if (skill === "Tree Blitz") {
      stateCopy.trees = useTreeBlitz({ trees });
    }

    if (skill === "Greenhouse Guru") {
      stateCopy.greenhouse.pots = useGreenhouseGuru({
        greenhousePot: greenhouse.pots,
      });
    }

    if (skill === "Petal Blessed") {
      stateCopy.flowers.flowerBeds = usePetalBlessed({
        flowerBeds: flowers.flowerBeds,
        createdAt,
      });

      // Update the beehives
      stateCopy.beehives = updateBeehives({ game: stateCopy, createdAt });
    }

    if (skill === "Grease Lightning") {
      stateCopy.oilReserves = useGreaseLightning({ oilReserves });
    }

    if (skill === "Instant Gratification") {
      stateCopy = useInstantGratification({
        game: stateCopy,
        createdAt,
      });
    }

    if (skill === "Barnyard Rouse") {
      stateCopy = useBarnyardRouse({ game: stateCopy, createdAt });
    }

    if (items) {
      stateCopy.inventory = Object.entries(items).reduce(
        (inv, [item, quantity]) => ({
          ...inv,
          [item]: inv[item as InventoryItemName]?.sub(quantity),
        }),
        inventory,
      );
    }

    // Return the new state
    bumpkin.previousPowerUseAt[skill] = createdAt;

    return stateCopy;
  });
}
