import Decimal from "decimal.js-light";
import type { GameState } from "features/game/types/game";
import { EXPANSION_REQUIREMENTS } from "features/game/types/expansions";
import {
  isTutorialHarvestPhase,
  isTutorialPlantPhase,
} from "features/island/plots/lib/tutorialPlots";
import {
  needsBasicScarecrow,
  needsFirstAxes,
  needsWaterWell,
} from "features/island/buildings/components/building/workBench/lib/onboarding";
import { needsFirstCropSale } from "features/island/buildings/components/building/market/lib/onboarding";
import { needsFirstCook } from "features/island/buildings/components/building/firePit/lib/onboarding";
import { needsFirstDelivery } from "features/island/delivery/lib/onboarding";

export type TutorialNudge =
  | "workbench-axes"
  | "harvest-plot"
  | "travel-first-delivery"
  | "chop-trees"
  | "expand-land"
  | "plant-plot"
  | "workbench-scarecrow"
  | "firepit-cook"
  | "market-sell"
  | "workbench-well";

/**
 * After the first delivery the coins fund the next expansion - the one that
 * reveals the preloaded Rhubarb. True from the delivery until that expansion
 * starts building (the pontoon and the ready disc carry their own pulse).
 */
const needsPostDeliveryExpansion = (game: GameState): boolean =>
  game.island.type === "basic" &&
  (game.delivery.fulfilledCount ?? 0) >= 1 &&
  (game.inventory["Basic Land"]?.toNumber() ?? 3) <= 4 &&
  !game.expansionConstruction;

/**
 * The single tutorial pointer the farm shows at any moment.
 *
 * Each building used to decide its own pointer from the shared onboarding
 * predicates, which let several pulse at once whenever the predicates
 * overlapped (e.g. the sell lesson, a water well hint and a crop arrow all
 * landing together after an expansion). Every pointer site asks this one
 * function instead, so at most the highest-priority step is ever shown.
 *
 * Ordered by the tutorial's own sequence: claim axes, harvest the preloaded
 * crops, deliver them, spend the coins on the next expansion (chopping the
 * Wood for it first), cook, replant, craft a scarecrow, then the one-shot
 * sell lesson, with the (non-tutorial) water well hint last.
 *
 * Deliberately time-independent: the plot phases are coarse gates (crops
 * pending, not crops ready this second) so the answer only changes with the
 * game state and the consumers never need a ticking clock. Which exact plot
 * carries the arrow - and whether it is ready - stays Plot.tsx's business.
 */
export function getTutorialNudge(game: GameState): TutorialNudge | undefined {
  if (needsFirstAxes(game)) return "workbench-axes";
  if (isTutorialHarvestPhase(game)) return "harvest-plot";
  if (needsFirstDelivery(game)) return "travel-first-delivery";

  if (needsPostDeliveryExpansion(game)) {
    const nextExpansion = (game.inventory["Basic Land"]?.toNumber() ?? 3) + 1;
    const requiredWood = new Decimal(
      EXPANSION_REQUIREMENTS.basic[nextExpansion]?.resources.Wood ?? 0,
    );

    if ((game.inventory.Wood ?? new Decimal(0)).lt(requiredWood)) {
      // No Axe makes a tree a dead end - the Workbench hands out the
      // tutorial's free Axes (and sells more) before the trees take over.
      return (game.inventory.Axe ?? new Decimal(0)).gt(0)
        ? "chop-trees"
        : "workbench-axes";
    }

    return "expand-land";
  }

  if (needsFirstCook(game)) return "firepit-cook";
  if (isTutorialPlantPhase(game)) return "plant-plot";
  if (needsBasicScarecrow(game)) return "workbench-scarecrow";
  if (needsFirstCropSale(game)) return "market-sell";
  if (needsWaterWell(game)) return "workbench-well";

  return undefined;
}
