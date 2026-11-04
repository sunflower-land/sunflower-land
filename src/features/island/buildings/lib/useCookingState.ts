import { useContext, useMemo } from "react";
import { useSelector } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { PlacedItem } from "features/game/types/game";
import type { CookingBuildingName } from "features/game/types/buildings";
import {
  areBoostWindowsEqual,
  getCookingBoostWindows,
} from "features/game/lib/boostWindows";
import {
  getCookingOil,
  resolveCookingQueueTimings,
} from "features/game/lib/cookingReadiness";
import { useQueueState } from "./useQueueState";

const _cookingBoostWindows = (state: MachineState) =>
  getCookingBoostWindows(state.context.state);

/**
 * Queue state for a cooking building, with each recipe's ready time DERIVED from
 * the live cooking boost windows rather than read off its stored `readyAt`.
 *
 * That stored value is only a cache, refreshed whenever an event rewrites the queue.
 * Between those writes a boost can be placed or expire, so deriving here is what
 * makes a Gourmet Hourglass visibly pull the whole queue forward — and, just as
 * importantly, keeps the client's notion of "ready" in step with the server's
 * (`collectRecipe` derives the same way).
 *
 * On a clock-drain building the oil in the tank is resolved in the same pass, so
 * topping it up visibly pulls the queue forward too.
 *
 * Every cooking building goes through this hook, so the island art, the ready
 * indicator and the modal all follow from one place. Fish processing has no
 * temporary boosts and deliberately stays on `useProcessingState`, reading stored
 * ready times.
 */
export function useCookingState(
  building: Pick<PlacedItem, "crafting" | "oil" | "oilSettledAt">,
  buildingName: CookingBuildingName,
) {
  const { gameService } = useContext(Context);

  // Recomputed from full state but only re-rendering when the windows actually
  // change, so an unrelated game update doesn't re-render every cooking building.
  const windows = useSelector(
    gameService,
    _cookingBoostWindows,
    areBoostWindowsEqual,
  );

  const crafting = useMemo(() => building.crafting ?? [], [building.crafting]);
  const { oil, oilSettledAt } = building;

  const timings = useMemo(
    () =>
      resolveCookingQueueTimings({
        crafting,
        windows,
        oil: getCookingOil({ building: { oil, oilSettledAt }, buildingName }),
      }),
    [crafting, windows, oil, oilSettledAt, buildingName],
  );

  const resolved = useMemo(
    () =>
      // Preserve object identity where the derived time matches the cache, so
      // downstream memos only invalidate for recipes that actually moved.
      crafting.map((recipe, index) =>
        timings[index].readyAt === recipe.readyAt
          ? recipe
          : { ...recipe, readyAt: timings[index].readyAt },
      ),
    [crafting, timings],
  );

  const { active, queued, ready, nextChangeAt } = useQueueState(resolved);

  return {
    cooking: active,
    queuedRecipes: queued,
    readyRecipes: ready,
    nextChangeAt,
  };
}
