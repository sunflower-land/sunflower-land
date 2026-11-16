import type { GameState } from "../../types/game";
import { produce } from "immer";
import Decimal from "decimal.js-light";
import { translate } from "lib/i18n/translate";
import { updateBeehives } from "features/game/lib/updateBeehives";
import { getFlowerReadyAt } from "features/game/lib/flowerBedReadiness";

export type InstaGrowFlowerAction = {
  type: "flower.instaGrown";
  id: string;
};

type Options = {
  state: GameState;
  action: InstaGrowFlowerAction;
  createdAt?: number;
};

// Calculate Obsidian cost based on remaining time
// 24 hours = 0.1 Obsidian
export const calculateInstaGrowCost = (timeLeftSeconds: number): Decimal => {
  const daysRemaining = timeLeftSeconds / (24 * 60 * 60);
  const cost = daysRemaining * 0.1; // 0.1 Obsidian per day
  const roundedCost = Math.ceil(cost * 10) / 10; // round up to nearest tenth
  return new Decimal(Math.max(roundedCost, 0.1));
};

export function instaGrowFlower({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { flowers } = stateCopy;

    const flowerBed = flowers.flowerBeds[action.id];

    if (!flowerBed) throw new Error(translate("harvestflower.noFlowerBed"));

    const flower = flowerBed.flower;

    if (!flower) throw new Error(translate("harvestflower.noFlower"));

    // Windowed flowers derive readyAt live from their boost windows; legacy flowers
    // fall back to plantedAt + base grow time (getFlowerReadyAt handles both).
    const timeLeft = getFlowerReadyAt(flower, stateCopy) - createdAt;
    const timeLeftSeconds = timeLeft / 1000;

    if (timeLeft <= 0) {
      throw new Error("Flower is already ready to harvest");
    }

    const obsidianCost = calculateInstaGrowCost(timeLeftSeconds);
    const playerObsidian = stateCopy.inventory.Obsidian ?? new Decimal(0);

    if (playerObsidian.lessThan(obsidianCost)) {
      throw new Error("Insufficient Obsidian");
    }

    stateCopy.inventory.Obsidian = playerObsidian.sub(obsidianCost);

    // Zero the remaining work AND re-anchor the start to now so computeReadyAt
    // resolves to `createdAt` (ready now), not the original (past) plantedAt, so
    // updateBeehives credits honey accrued up to the insta-grow instead of
    // clamping it to a past readyAt.
    flower.baseDurationMs = 0;
    flower.plantedAt = createdAt;

    stateCopy.beehives = updateBeehives({ game: stateCopy, createdAt });
  });
}
