import type { GameState } from "features/game/types/game";
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
  | "plant-plot"
  | "workbench-scarecrow"
  | "firepit-cook"
  | "market-sell"
  | "workbench-well";

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
 * crops, deliver them, replant, craft a scarecrow, cook, then the one-shot
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
  if (isTutorialPlantPhase(game)) return "plant-plot";
  if (needsBasicScarecrow(game)) return "workbench-scarecrow";
  if (needsFirstCook(game)) return "firepit-cook";
  if (needsFirstCropSale(game)) return "market-sell";
  if (needsWaterWell(game)) return "workbench-well";

  return undefined;
}
