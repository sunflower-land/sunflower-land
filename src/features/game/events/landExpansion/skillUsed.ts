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
  Buildings,
  InventoryItemName,
  AnimalBuildingKey,
} from "features/game/types/game";
import { produce } from "immer";
import { BUILDING_DAILY_OIL_CAPACITY } from "./supplyCookingOil";
import Decimal from "decimal.js-light";
import { translate } from "lib/i18n/translate";
import { CROPS } from "features/game/types/crops";
import { canChop } from "./chop";
import { canDrillOilReserve } from "./drillOilReserve";
import { isReadyToHarvest } from "./harvest";
import { getCurrentCookingItem } from "./cancelQueuedRecipe";

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
}: {
  crops: Record<string, CropPlot>;
}): Record<string, CropPlot> {
  // Set each plot's plantedAt to 1 (making it grow instantly)
  getKeys(crops).forEach((plot) => {
    const plantedCrop = crops[plot].crop;
    if (plantedCrop) {
      plantedCrop.plantedAt = 1;
    }
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
}: {
  flowerBeds: FlowerBeds;
}): FlowerBeds {
  getKeys(flowerBeds).forEach((bed) => {
    const { flower } = flowerBeds[bed];
    if (flower) {
      flower.plantedAt = 1;
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
  buildings,
  createdAt = Date.now(),
}: {
  buildings: Buildings;
  createdAt?: number;
}): Buildings {
  getKeys(BUILDING_DAILY_OIL_CAPACITY).forEach((building) => {
    const buildingItem = buildings[building]?.[0];
    if (!buildingItem) return;
    const buildingRecipes = buildingItem.crafting;

    if (!buildingRecipes) return;

    const currentlyCooking = getCurrentCookingItem({
      building: buildingItem,
      createdAt,
    });
    const currentCookingReadyAt = currentlyCooking?.readyAt ?? 0;
    const timeSkipped = currentCookingReadyAt - createdAt;

    buildingRecipes
      .sort((a, b) => a.readyAt - b.readyAt)
      .forEach((recipe) => {
        if (recipe === currentlyCooking) {
          recipe.readyAt = createdAt;
        } else {
          recipe.readyAt -= timeSkipped;
        }
      });
  });

  return buildings;
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

  const nextSkillUse = (previousPowerUseAt?.[skillName] ?? 0) + (cooldown ?? 0);

  const powerSkillReady = nextSkillUse < createdAt;
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
      const unfertilisedPlots = Object.values(crops).filter(
        (plot) => !plot.fertiliser,
      ).length;
      const fertiliser =
        skillName === "Sprout Surge" ? "Sprout Mix" : "Rapid Root";
      const fertiliserCount = inventory[fertiliser] ?? new Decimal(0);

      if (fertiliserCount.lt(unfertilisedPlots)) {
        return {
          disabled: true,
        };
      }
      if (unfertilisedPlots === 0) {
        return {
          disabled: true,
          reason: translate("powerSkills.reason.allPlotsFertilised"),
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
      buildings,
      inventory,
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
      stateCopy.crops = useInstantGrowth({ crops });
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
      });
    }

    if (skill === "Grease Lightning") {
      stateCopy.oilReserves = useGreaseLightning({ oilReserves });
    }

    if (skill === "Instant Gratification") {
      stateCopy.buildings = useInstantGratification({ buildings, createdAt });
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
