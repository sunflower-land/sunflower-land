import Decimal from "decimal.js-light";
import { produce } from "immer";
import { translate } from "lib/i18n/translate";
import type { AgingRackSlot } from "features/game/lib/agingShed";
import {
  getAgingSlotCount,
  getFishBaseXP,
  isFishName,
} from "features/game/types/aging";
import {
  getBoostedAgingFishCost,
  getBoostedAgingSaltCost,
  getBoostedAgingTimeMs,
} from "features/game/types/agingFormulas";
import type { FishName } from "features/game/types/fishing";
import { GameState } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { hasPlacedAgingShed } from "./hasPlacedAgingShed";

export type StartAgingAction = {
  type: "agingRack.started";
  fish: FishName;
  slotId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: StartAgingAction;
  createdAt?: number;
  farmId: number;
};

export function startAging({
  state,
  action,
  createdAt = Date.now(),
  farmId: _farmId,
}: Options): GameState {
  if (!hasFeatureAccess(state, "AGING_SHED")) {
    throw new Error("Aging Shed not enabled");
  }

  return produce(state, (game) => {
    if (!hasPlacedAgingShed(game)) {
      throw new Error(translate("error.requiredBuildingNotExist"));
    }

    if (!isFishName(action.fish)) {
      throw new Error("Invalid fish name");
    }

    const maxSlots = getAgingSlotCount(game.agingShed.level);
    const queue = game.agingShed.racks.aging;

    if (queue.some((slot) => slot.id === action.slotId)) {
      throw new Error("Slot already occupied");
    }

    if (queue.length >= maxSlots) {
      throw new Error(translate("error.noAvailableSlots"));
    }

    const baseXP = getFishBaseXP(action.fish);
    const fishCost = getBoostedAgingFishCost(game);
    const saltCost = getBoostedAgingSaltCost(baseXP, game);

    const fishCount = game.inventory[action.fish] ?? new Decimal(0);
    if (fishCount.lessThan(fishCost)) {
      throw new Error("Insufficient fish");
    }

    const saltCount = game.inventory["Salt"] ?? new Decimal(0);
    if (saltCount.lessThan(saltCost)) {
      throw new Error("Insufficient Salt");
    }

    game.inventory[action.fish] = fishCount.sub(fishCost);
    game.inventory["Salt"] = saltCount.sub(saltCost);

    const slot: AgingRackSlot = {
      id: action.slotId,
      fish: action.fish,
      startedAt: createdAt,
      readyAt: createdAt + getBoostedAgingTimeMs(baseXP, game),
      // Marks whether the Ager skill was applied at the time of starting
      skills: { Ager: !!game.bumpkin.skills["Ager"] },
    };

    game.agingShed.racks.aging = [...queue, slot];
    delete game.agingShed.lastAgingCollect;
  });
}
