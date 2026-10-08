import {
  type GameState,
  ISLAND_EXPANSIONS,
  type IslandType,
} from "../../types/game";
import { ISLAND_MAX_EXPANSION } from "../../expansion/lib/expansionRequirements";
import { INITIAL_FARM, TEST_FARM } from "../constants";
import { OFFLINE_FARM } from "../landData";
import { getDynamicIsland } from "../landDataDynamic";
import { STATIC_OFFLINE_FARM } from "../landDataStatic";
import {
  type PreviewParams,
  applyPatch,
  decodeJsonParam,
  hasPreviewParams,
  readPreviewParams,
  resolveTimeToken,
} from "./previewLink";

/**
 * ART_MODE farm selection driven by the URL. See `previewLink.ts` for the
 * parameter format. Only ever called from the ART_MODE branch of the game
 * machine, so a real session is never affected by these params.
 */

type FixtureFactory = () => GameState;

// Fully expanded, like DYNAMIC_OFFLINE_FARM: a farm "right after the upgrade"
// (no expansion count) still carries the previous island's nodes on a
// four-land plot, which the land renderer does not cope with.
const islandFixtures = Object.fromEntries(
  ISLAND_EXPANSIONS.map((island) => [
    island,
    () => getDynamicIsland(island as IslandType, ISLAND_MAX_EXPANSION[island]),
  ]),
) as Record<IslandType, FixtureFactory>;

/**
 * Base farms a preview link can start from. Keep the names stable: they are
 * listed in the scenario-generation prompt under `.github/preview/`.
 *
 * - `default`: whatever `landData.ts` currently exports (a fresh farm).
 * - `new`: the untouched farm a brand-new player starts with.
 * - `test`: `TEST_FARM`, the fixture most unit tests build on — so a state
 *   copied from a test's setup drops straight in.
 * - `static`: the hand-authored snapshot in `landDataStatic.ts`.
 * - `basic` … `marble`: a fully expanded farm on that island, built by
 *   replaying the real progression.
 */
export const PREVIEW_FIXTURES: Record<string, FixtureFactory> = {
  default: () => OFFLINE_FARM,
  new: () => INITIAL_FARM,
  test: () => TEST_FARM,
  static: () => STATIC_OFFLINE_FARM,
  ...islandFixtures,
};

export const PREVIEW_FIXTURE_NAMES = Object.keys(PREVIEW_FIXTURES);

export type PreviewWarning = { param: string; message: string };

const warn = (warnings: PreviewWarning[], param: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  warnings.push({ param, message });
  // eslint-disable-next-line no-console
  console.warn(`[preview] ignoring ?${param}: ${message}`);
};

/**
 * Fixtures are built once per page load. The island builders generate random
 * node ids on every call, and the game machine evaluates its ART_MODE
 * `assign` more than once while booting: handing it two differently-keyed
 * farms leaves the land renderer holding ids the final state does not have.
 */
const fixtureCache = new Map<string, GameState>();

export function getPreviewFixture(name: string): GameState | undefined {
  const factory = PREVIEW_FIXTURES[name];
  if (!factory) return undefined;

  let farm = fixtureCache.get(name);
  if (!farm) {
    farm = factory();
    fixtureCache.set(name, farm);
  }
  return farm;
}

/**
 * Resolve the farm an ART_MODE preview should boot with. Bad params are
 * logged and skipped rather than thrown so a typo never blanks the screen.
 */
export function getPreviewFarm({
  params = readPreviewParams(window.location),
  now = Date.now(),
  warnings = [],
}: {
  params?: PreviewParams;
  now?: number;
  warnings?: PreviewWarning[];
} = {}): GameState {
  let farm = OFFLINE_FARM;

  if (params.fixture) {
    const fixture = getPreviewFixture(params.fixture);
    if (fixture) {
      farm = fixture;
    } else {
      warn(
        warnings,
        "fixture",
        `unknown fixture "${params.fixture}" (known: ${PREVIEW_FIXTURE_NAMES.join(", ")})`,
      );
    }
  }

  if (params.patch) {
    try {
      farm = applyPatch(farm, decodeJsonParam(params.patch), now);
    } catch (error) {
      warn(warnings, "patch", error);
    }
  }

  // Skip the Terms & Conditions and welcome-bonus gates unless the tester
  // asked to keep them (?intro=1). Both are one-off modals that sit between
  // the tester and the feature under test.
  if (hasPreviewParams(params) && params.intro !== "1") {
    if (farm.tcsAcknowledged === undefined) {
      farm = { ...farm, tcsAcknowledged: now };
    }
    if (!farm.farmActivity["welcome Bonus Claimed"]) {
      farm = {
        ...farm,
        farmActivity: { ...farm.farmActivity, "welcome Bonus Claimed": 1 },
      };
    }
  }

  return farm;
}

/** localStorage "already read" stamps that gate one-off notices on boot. */
const NOTICE_KEYS = ["islesIntroduction", "vipIsRead"] as const;

/**
 * Seed localStorage from `?ls=` and, unless `?intro=1`, mark the island
 * introduction as read so a preview opens straight onto the farm.
 */
export function applyPreviewLocalStorage({
  params = readPreviewParams(window.location),
  storage = window.localStorage,
  now = Date.now(),
  warnings = [],
}: {
  params?: PreviewParams;
  storage?: Pick<Storage, "getItem" | "setItem">;
  now?: number;
  warnings?: PreviewWarning[];
} = {}): void {
  if (!hasPreviewParams(params)) return;

  if (params.ls) {
    try {
      for (const [key, value] of Object.entries(decodeJsonParam(params.ls))) {
        const resolved =
          typeof value === "string" ? resolveTimeToken(value, now) : value;
        storage.setItem(
          key,
          typeof resolved === "string" ? resolved : JSON.stringify(resolved),
        );
      }
    } catch (error) {
      warn(warnings, "ls", error);
    }
  }

  if (params.intro !== "1") {
    for (const key of NOTICE_KEYS) {
      if (storage.getItem(key) === null) {
        storage.setItem(key, new Date(now).toISOString());
      }
    }
  }
}
