import Decimal from "decimal.js-light";
import { produce } from "immer";
import { translate } from "lib/i18n/translate";
import { KNOWN_IDS } from "features/game/types";
import {
  getAgingOutput,
  getPrimeAgedChance,
} from "features/game/types/agingFormulas";
import type { AgingCollectResult } from "features/game/lib/agingShed";
import type {
  AgedFishName,
  PrimeAgedFishName,
} from "features/game/types/fishing";
import { GameState } from "features/game/types/game";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { hasFeatureAccess } from "lib/flags";
import { hasPlacedAgingShed } from "./hasPlacedAgingShed";
import { prngChance } from "lib/prng";

export type CollectAgedFishAction = {
  type: "agingRack.collected";
};

type Options = {
  state: Readonly<GameState>;
  action: CollectAgedFishAction;
  createdAt?: number;
  farmId: number;
};

export function collectAgedFish({
  state,
  createdAt = Date.now(),
  farmId,
}: Options): GameState {
  if (!hasFeatureAccess(state, "AGING_SHED")) {
    throw new Error("Aging Shed not enabled");
  }

  return produce(state, (game) => {
    if (!hasPlacedAgingShed(game)) {
      throw new Error(translate("error.requiredBuildingNotExist"));
    }

    const queue = game.agingShed.racks.aging;

    if (!queue.length) {
      throw new Error(translate("error.buildingNotCooking"));
    }

    const ready = queue.filter((slot) => slot.readyAt <= createdAt);

    if (!ready.length) {
      throw new Error(translate("error.recipeNotReady"));
    }

    game.agingShed.racks.aging = queue.filter(
      (slot) => slot.readyAt > createdAt,
    );

    const skills = game.bumpkin.skills;
    const results: AgingCollectResult[] = [];

    ready.forEach((slot) => {
      const agedName: AgedFishName = `Aged ${slot.fish}`;
      const primeAgedName: PrimeAgedFishName = `Prime Aged ${slot.fish}`;

      const counter =
        (game.farmActivity[`${agedName} Collected`] ?? 0) +
        (game.farmActivity[`${primeAgedName} Collected`] ?? 0);

      const outputAmount = getAgingOutput(skills, new Decimal(1), slot.fish, {
        farmId,
        itemId: KNOWN_IDS[slot.fish],
        counter,
      });

      const isPrime = prngChance({
        farmId,
        itemId: KNOWN_IDS[agedName],
        counter,
        chance: getPrimeAgedChance(skills),
        criticalHitName: primeAgedName,
      });

      const outputName = isPrime ? primeAgedName : agedName;

      game.inventory[outputName] = (
        game.inventory[outputName] ?? new Decimal(0)
      ).add(outputAmount);

      game.farmActivity = trackFarmActivity(
        `${outputName} Collected`,
        game.farmActivity,
      );

      results.push({ item: outputName, primeAged: isPrime });
    });

    game.agingShed.lastAgingCollect = results;
  });
}
