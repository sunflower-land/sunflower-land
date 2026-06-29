import type { GameState, IslandType } from "../types/game";
import { ASCENSION_ISLANDS, ISLAND_EXPANSIONS } from "../types/game";

import { INITIAL_FARM } from "./constants";
import { revealLand } from "../events/landExpansion/revealLand";
import { ISLAND_MAX_EXPANSION } from "../expansion/lib/expansionRequirements";
import { ascensionBaseline, LEVEL_EXPERIENCE } from "./level";
import {
  getAscensionUpgradeCost,
  upgrade,
} from "../events/landExpansion/upgradeFarm";
import { getObjectEntries } from "lib/object";
import Decimal from "decimal.js-light";

/**
 * Builds a farm sitting on `island`, expanded to `expansionCount` lands.
 *
 * Rather than hand-listing every node's coordinates (which drift whenever the
 * land layouts in `expansions.ts` change), we walk the real progression from
 * INITIAL_FARM: `revealLand` places each expansion's crops, trees and rocks at
 * the right tiles, and `upgrade` prestiges between islands — so the result
 * always tracks the canonical layouts.
 *
 * `expansionCount` is optional. When omitted, the farm is returned exactly as
 * it arrives on `island` — the starter lands you get right after the upgrade
 * (e.g. 9 for spring), or INITIAL_EXPANSIONS for "basic".
 *
 * `ascension` is optional and only bites on `"marble"`, the terminal island that
 * re-ascends into itself forever. The linear chain reaches marble at ascension 5;
 * pass a higher number to keep prestiging marble→marble until the farm sits in
 * that band. Ignored for every other island, whose ascension is fixed by type.
 *
 * The Bumpkin is set to level 11 and seeded with the resources each upgrade
 * along the chain burns; the offline farm doesn't need a level matched to the
 * island, so this stays fixed regardless of `island`.
 */
export function getDynamicIsland(
  island: IslandType,
  expansionCount?: number,
  ascension?: number,
): GameState {
  let farm: GameState = {
    ...INITIAL_FARM,
    bumpkin: {
      ...INITIAL_FARM.bumpkin,
      experience: LEVEL_EXPERIENCE[11],
    },
    inventory: {
      ...INITIAL_FARM.inventory,
      // Resources each island upgrade burns: Gold -> spring, Crimstone ->
      // desert, Oil -> volcano.
      Gold: new Decimal(10),
      Crimstone: new Decimal(20),
      Oil: new Decimal(200),
    },
  };

  // Reveal lands until the "Basic Land" count reaches `target`. revealLand only
  // requires a pending construction; it places the next expansion's nodes and
  // increments the count.
  const revealTo = (target: number) => {
    while ((farm.inventory["Basic Land"]?.toNumber() ?? 0) < target) {
      farm = revealLand({
        state: { ...farm, expansionConstruction: { createdAt: 0, readyAt: 0 } },
        action: { type: "land.revealed" },
        createdAt: farm.createdAt,
      });
    }
  };

  // Ascension prestiges (volcano→swamp and every re-ascension, including the
  // terminal marble→marble loop) add two gates the static seed above doesn't
  // satisfy: the Bumpkin must be "ready to ascend" (pre-swamp level 150, then
  // level 50 of the current band) and the upgrade burns a level-scaled cost.
  // Grant exactly the band's readiness XP (`ascensionBaseline(a)`, = level-150 XP
  // for the first ascension) and the upgrade's items/coins right before
  // prestiging. `upgrade` returns frozen state, so rebuild rather than mutate.
  const seedAscensionPrestige = () => {
    const a = (farm.island.ascensionLevel ?? 0) + 1;
    const { items, coins } = getAscensionUpgradeCost(a);
    const inventory = { ...farm.inventory };
    getObjectEntries(items).forEach(([name, amount]) => {
      inventory[name] = (inventory[name] ?? new Decimal(0)).add(amount ?? 0);
    });
    farm = {
      ...farm,
      coins: farm.coins + coins,
      bumpkin: { ...farm.bumpkin, experience: ascensionBaseline(a) },
      inventory,
    };
  };

  const prestige = () => {
    farm = upgrade({
      state: farm,
      action: { type: "farm.upgraded" },
      createdAt: farm.createdAt,
      farmId: 1,
    });
  };

  const targetIndex = ISLAND_EXPANSIONS.indexOf(island);

  // Walk the upgrade chain: fill each island below the target to its cap (the
  // upgrade requirement) and prestige to the next island.
  for (let i = 0; i < targetIndex; i++) {
    revealTo(ISLAND_MAX_EXPANSION[ISLAND_EXPANSIONS[i]]);
    if (
      (ASCENSION_ISLANDS as readonly IslandType[]).includes(
        ISLAND_EXPANSIONS[i + 1],
      )
    ) {
      seedAscensionPrestige();
    }
    prestige();
  }

  // Marble is terminal but re-ascends into itself forever — the linear chain
  // only reaches ascension 5. Keep prestiging marble→marble (each band fills
  // back to its 42-land cap first) until the requested ascension is reached.
  while (
    ascension !== undefined &&
    farm.island.type === "marble" &&
    (farm.island.ascensionLevel ?? 0) < ascension
  ) {
    revealTo(ISLAND_MAX_EXPANSION[farm.island.type]);
    seedAscensionPrestige();
    prestige();
  }

  // Expand the target island to the requested size. When omitted, leave the
  // farm as it arrives (right after the upgrade / the starter lands).
  if (expansionCount !== undefined) {
    revealTo(expansionCount);
  }

  // The Bumpkin level is cosmetic (see above) and stays fixed at 11; the
  // ascension XP granted during the walk only existed to clear the prestige
  // gate, so reset it now that the farm is built. `revealLand`/`upgrade` return
  // frozen state, so rebuild rather than mutate.
  farm = {
    ...farm,
    bumpkin: { ...farm.bumpkin, experience: LEVEL_EXPERIENCE[11] },
  };

  return farm;
}

export const DYNAMIC_OFFLINE_FARM: GameState = getDynamicIsland(
  "marble",
  42,
  10,
);
