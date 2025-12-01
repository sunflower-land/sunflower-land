import { FLOWERS, FLOWER_SEEDS } from "features/game/types/flowers";
import { BoostName, CriticalHitName, GameState } from "../../types/game";
import Decimal from "decimal.js-light";
import { updateBeehives } from "features/game/lib/updateBeehives";
import { translate } from "lib/i18n/translate";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { produce } from "immer";
import {
  isCollectibleBuilt,
  isTemporaryCollectibleActive,
} from "features/game/lib/collectibleBuilt";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export type HarvestFlowerAction = {
  type: "flower.harvested";
  id: string;
};

type Options = {
  state: GameState;
  action: HarvestFlowerAction;
  createdAt?: number;
};

function getFlowerAmount({
  game,
  criticalDrop = () => false,
}: {
  game: GameState;
  criticalDrop: (name: CriticalHitName) => boolean;
}): { amount: number; boostsUsed: BoostName[] } {
  const { bumpkin } = game;
  let amount = 1;
  const boostsUsed: BoostName[] = [];

  if (
    isCollectibleBuilt({ name: "Humming Bird", game }) &&
    criticalDrop("Humming Bird")
  ) {
    amount += 1;
    boostsUsed.push("Humming Bird");
  }

  if (
    isCollectibleBuilt({ name: "Butterfly", game }) &&
    criticalDrop("Butterfly")
  ) {
    amount += 1;
    boostsUsed.push("Butterfly");
  }

  if (
    isCollectibleBuilt({ name: "Desert Rose", game }) &&
    criticalDrop("Desert Rose")
  ) {
    amount += 1;
    boostsUsed.push("Desert Rose");
  }

  if (
    isCollectibleBuilt({ name: "Chicory", game }) &&
    criticalDrop("Chicory")
  ) {
    amount += 1;
    boostsUsed.push("Chicory");
  }

  if (
    isTemporaryCollectibleActive({ name: "Moth Shrine", game }) &&
    criticalDrop("Moth Shrine")
  ) {
    amount += 1;
    boostsUsed.push("Moth Shrine");
  }

  if (bumpkin.skills["Petalled Perk"] && criticalDrop("Petalled Perk")) {
    amount += 1;
    boostsUsed.push("Petalled Perk");
  }

  if (isTemporaryCollectibleActive({ name: "Legendary Shrine", game })) {
    amount += 1;
    boostsUsed.push("Legendary Shrine");
  }

  return { amount, boostsUsed };
}

export function harvestFlower({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    stateCopy.beehives = updateBeehives({
      game: state,
      createdAt,
    });

    const bumpkin = stateCopy.bumpkin;

    if (!bumpkin) throw new Error("You do not have a Bumpkin!");

    const flowers = stateCopy.flowers;
    const flowerBed = flowers.flowerBeds[action.id];

    if (!flowerBed) throw new Error(translate("harvestflower.noFlowerBed"));

    const flower = flowerBed.flower;

    if (!flower) throw new Error(translate("harvestflower.noFlower"));

    const isReady =
      flower.plantedAt +
        FLOWER_SEEDS[FLOWERS[flower.name].seed].plantSeconds * 1000 <
      createdAt;

    if (!isReady) throw new Error(translate("harvestflower.notReady"));
    const { amount, boostsUsed } =
      flower.amount !== undefined
        ? { amount: flower.amount, boostsUsed: [] }
        : getFlowerAmount({
            game: stateCopy,
            criticalDrop: (name) => !!(flower.criticalHit?.[name] ?? 0),
          });

    stateCopy.inventory[flower.name] = (
      stateCopy.inventory[flower.name] ?? new Decimal(0)
    ).add(amount);

    const discovered = flowers.discovered[flower.name] ?? [];
    if (!!flower.crossbreed && !discovered.includes(flower.crossbreed)) {
      flowers.discovered[flower.name] = [...discovered, flower.crossbreed];
    }

    const reward = flower.reward;
    if (reward) {
      (reward.items ?? []).forEach((item) => {
        stateCopy.inventory[item.name] = (
          stateCopy.inventory[item.name] ?? new Decimal(0)
        ).add(item.amount);
      });
    }

    delete flowerBed.flower;

    stateCopy.farmActivity = trackFarmActivity(
      `${flower.name} Harvested`,
      stateCopy.farmActivity,
    );

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: boostsUsed,
      createdAt,
    });

    stateCopy.beehives = updateBeehives({
      game: stateCopy,
      createdAt,
    });

    return stateCopy;
  });
}
