import { FLOWERS, FLOWER_SEEDS } from "features/game/types/flowers";
import { CriticalHitName, GameState } from "../../types/game";
import Decimal from "decimal.js-light";
import { updateBeehives } from "features/game/lib/updateBeehives";
import { trackActivity } from "features/game/types/bumpkinActivity";

import { translate } from "lib/i18n/translate";

import { trackFarmActivity } from "features/game/types/farmActivity";
import { produce } from "immer";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";

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
}) {
  const { bumpkin } = game;
  let amount = 1;

  if (
    isCollectibleBuilt({ name: "Humming Bird", game }) &&
    criticalDrop("Humming Bird")
  ) {
    amount += 1;
  }

  if (
    isCollectibleBuilt({ name: "Butterfly", game }) &&
    criticalDrop("Butterfly")
  ) {
    amount += 1;
  }

  if (
    isCollectibleBuilt({ name: "Desert Rose", game }) &&
    criticalDrop("Desert Rose")
  ) {
    amount += 1;
  }

  if (
    isCollectibleBuilt({ name: "Chicory", game }) &&
    criticalDrop("Chicory")
  ) {
    amount += 1;
  }

  if (bumpkin.skills["Petalled Perk"] && criticalDrop("Petalled Perk")) {
    amount += 1;
  }

  return amount;
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
    const amount = getFlowerAmount({
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

    bumpkin.activity = trackActivity(
      `${flower.name} Harvested`,
      bumpkin?.activity,
      new Decimal(1),
    );

    stateCopy.farmActivity = trackFarmActivity(
      `${flower.name} Harvested`,
      stateCopy.farmActivity,
      1,
    );

    stateCopy.beehives = updateBeehives({
      game: stateCopy,
      createdAt,
    });

    return stateCopy;
  });
}
