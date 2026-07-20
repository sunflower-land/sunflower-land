# Feed All Animals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One-click "Feed All" disc button in the Hen House and Barn for golden-asset holders, backed by a new `animals.fedAll` game event that composes the existing `feedAnimal`/`claimProduce` handlers.

**Architecture:** A new event module (`feedAllAnimals.ts`) exports pure eligibility helpers plus a handler that loops over eligible animals calling the existing single-animal handlers, so all XP/boost/reward logic keeps its single source of truth. The frontend adds a shared `FeedAllButton` component below the shop disc in both building interiors, and a small sync effect in each animal sprite component so local XState machines follow bulk state changes.

**Tech Stack:** TypeScript, React, XState v4, immer, Jest, i18next.

**Spec:** `docs/superpowers/specs/2026-07-20-feed-all-animals-design.md`

## Global Constraints

- Golden asset coverage: `Chicken → "Gold Egg"`, `Cow → "Golden Cow"`, `Sheep → "Golden Sheep"`, each gated on `isCollectibleBuilt` (owned AND placed).
- Sick animals are skipped unless the **Oracle Syringe** wearable is active (`isWearableActive`); with it, cure then feed in one action. Never consume Barn Delight in the bulk action (the syringe makes cure cost 0).
- Sleeping animals (`createdAt < awakeAt`) are never touched.
- `ready` animals get produce claimed (they then sleep; no feed afterwards). Capacity lock does NOT block claiming, only feeding (matches manual UI).
- Backend error strings (exact): `"Building does not exist"`, `"No active golden asset for this building"`, `"No animals to feed"`.
- Event type string (exact): `"animals.fedAll"`; payload field `building: AnimalBuildingType` (`"Hen House" | "Barn"`).
- Manual per-animal feeding must keep working unchanged.
- Run tests with `yarn test <path>` (Jest). Type-check with `npx tsc --noEmit`.
- Commit messages end with:
  `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01PoJavVNzMhiaod37vPoguJ`

---

### Task 1: Eligibility helpers (`getCoveredAnimalTypes`, `getFeedAllTargets`)

**Files:**
- Create: `src/features/game/events/landExpansion/feedAllAnimals.ts`
- Test: `src/features/game/events/landExpansion/feedAllAnimals.test.ts`

**Interfaces:**
- Consumes: `ANIMALS`, `isCollectibleBuilt`, `isWearableActive`, `makeAnimalBuildingKey`, `isAnimalFeedable` (all existing).
- Produces (used by Tasks 2 & 5):
  - `GOLDEN_ANIMAL_ASSETS: Record<AnimalType, CollectibleName>`
  - `getCoveredAnimalTypes({ state, building }): AnimalType[]`
  - `getFeedAllTargets({ state, building, createdAt? }): { toClaim: string[]; toCure: string[]; toFeed: string[] }`

- [ ] **Step 1: Write the failing tests**

Create `src/features/game/events/landExpansion/feedAllAnimals.test.ts`:

```ts
import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { Animal, GameState } from "features/game/types/game";
import {
  feedAllAnimals,
  getCoveredAnimalTypes,
  getFeedAllTargets,
} from "./feedAllAnimals";

const now = Date.now();

const makeAnimal = (
  overrides: Partial<Animal> & { id: string; type: Animal["type"] },
): Animal => ({
  state: "idle",
  coordinates: { x: 0, y: 0 },
  asleepAt: 0,
  experience: 0,
  createdAt: 0,
  item: "Petting Hand",
  lovedAt: 0,
  awakeAt: 0,
  ...overrides,
});

const placed = { coordinates: { x: 0, y: 0 }, createdAt: 0, readyAt: 0 };

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  buildings: {
    "Hen House": [{ ...placed, id: "hh" }],
    Barn: [{ ...placed, id: "barn" }],
  },
};

const withGoldEgg = (state: GameState): GameState => ({
  ...state,
  inventory: { ...state.inventory, "Gold Egg": new Decimal(1) },
  collectibles: {
    ...state.collectibles,
    "Gold Egg": [{ ...placed, id: "1" }],
  },
});

const withGoldenCow = (state: GameState): GameState => ({
  ...state,
  inventory: { ...state.inventory, "Golden Cow": new Decimal(1) },
  collectibles: {
    ...state.collectibles,
    "Golden Cow": [{ ...placed, id: "1" }],
  },
});

const withGoldenSheep = (state: GameState): GameState => ({
  ...state,
  inventory: { ...state.inventory, "Golden Sheep": new Decimal(1) },
  collectibles: {
    ...state.collectibles,
    "Golden Sheep": [{ ...placed, id: "1" }],
  },
});

const withOracleSyringe = (state: GameState): GameState => ({
  ...state,
  bumpkin: {
    ...state.bumpkin,
    equipped: { ...state.bumpkin.equipped, wings: "Oracle Syringe" },
  },
});

describe("getCoveredAnimalTypes", () => {
  it("returns no types when no golden assets are placed", () => {
    expect(
      getCoveredAnimalTypes({ state: GAME_STATE, building: "Hen House" }),
    ).toEqual([]);
    expect(
      getCoveredAnimalTypes({ state: GAME_STATE, building: "Barn" }),
    ).toEqual([]);
  });

  it("covers chickens in the Hen House when Gold Egg is placed", () => {
    expect(
      getCoveredAnimalTypes({
        state: withGoldEgg(GAME_STATE),
        building: "Hen House",
      }),
    ).toEqual(["Chicken"]);
  });

  it("does not cover the Barn with only a Gold Egg", () => {
    expect(
      getCoveredAnimalTypes({
        state: withGoldEgg(GAME_STATE),
        building: "Barn",
      }),
    ).toEqual([]);
  });

  it("covers only cows with Golden Cow, and both with both assets", () => {
    expect(
      getCoveredAnimalTypes({
        state: withGoldenCow(GAME_STATE),
        building: "Barn",
      }),
    ).toEqual(["Cow"]);
    expect(
      getCoveredAnimalTypes({
        state: withGoldenSheep(withGoldenCow(GAME_STATE)),
        building: "Barn",
      }),
    ).toEqual(["Cow", "Sheep"]);
  });

  it("does not cover a Gold Egg that is owned but not placed", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: { ...GAME_STATE.inventory, "Gold Egg": new Decimal(1) },
      collectibles: {},
    };
    expect(
      getCoveredAnimalTypes({ state, building: "Hen House" }),
    ).toEqual([]);
  });
});

describe("getFeedAllTargets", () => {
  it("targets awake idle, sad and happy chickens for feeding", () => {
    const state = withGoldEgg({
      ...GAME_STATE,
      henHouse: {
        ...GAME_STATE.henHouse,
        animals: {
          "1": makeAnimal({ id: "1", type: "Chicken", state: "idle" }),
          "2": makeAnimal({ id: "2", type: "Chicken", state: "sad" }),
          "3": makeAnimal({ id: "3", type: "Chicken", state: "happy" }),
        },
      },
    });

    expect(
      getFeedAllTargets({ state, building: "Hen House", createdAt: now }),
    ).toEqual({ toClaim: [], toCure: [], toFeed: ["1", "2", "3"] });
  });

  it("skips sleeping animals", () => {
    const state = withGoldEgg({
      ...GAME_STATE,
      henHouse: {
        ...GAME_STATE.henHouse,
        animals: {
          "1": makeAnimal({
            id: "1",
            type: "Chicken",
            state: "idle",
            awakeAt: now + 10_000,
          }),
        },
      },
    });

    expect(
      getFeedAllTargets({ state, building: "Hen House", createdAt: now }),
    ).toEqual({ toClaim: [], toCure: [], toFeed: [] });
  });

  it("targets ready animals for claiming, not feeding", () => {
    const state = withGoldEgg({
      ...GAME_STATE,
      henHouse: {
        ...GAME_STATE.henHouse,
        animals: {
          "1": makeAnimal({ id: "1", type: "Chicken", state: "ready" }),
        },
      },
    });

    expect(
      getFeedAllTargets({ state, building: "Hen House", createdAt: now }),
    ).toEqual({ toClaim: ["1"], toCure: [], toFeed: [] });
  });

  it("skips sick animals without the Oracle Syringe", () => {
    const state = withGoldEgg({
      ...GAME_STATE,
      inventory: { ...GAME_STATE.inventory, "Barn Delight": new Decimal(5) },
      henHouse: {
        ...GAME_STATE.henHouse,
        animals: {
          "1": makeAnimal({ id: "1", type: "Chicken", state: "sick" }),
        },
      },
    });

    expect(
      getFeedAllTargets({ state, building: "Hen House", createdAt: now }),
    ).toEqual({ toClaim: [], toCure: [], toFeed: [] });
  });

  it("targets sick animals for curing with the Oracle Syringe active", () => {
    const state = withOracleSyringe(
      withGoldEgg({
        ...GAME_STATE,
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "1": makeAnimal({ id: "1", type: "Chicken", state: "sick" }),
          },
        },
      }),
    );

    expect(
      getFeedAllTargets({ state, building: "Hen House", createdAt: now }),
    ).toEqual({ toClaim: [], toCure: ["1"], toFeed: [] });
  });

  it("only targets covered species in the Barn", () => {
    const state = withGoldenCow({
      ...GAME_STATE,
      barn: {
        ...GAME_STATE.barn,
        animals: {
          cow: makeAnimal({ id: "cow", type: "Cow", state: "idle" }),
          sheep: makeAnimal({ id: "sheep", type: "Sheep", state: "idle" }),
        },
      },
    });

    expect(
      getFeedAllTargets({ state, building: "Barn", createdAt: now }),
    ).toEqual({ toClaim: [], toCure: [], toFeed: ["cow"] });
  });

  it("does not target over-capacity animals for feeding but still claims them", () => {
    // Hen House level 1 has a base capacity of 10; the oldest animals beyond
    // capacity are locked (see getOverCapacityAnimalIds in buyAnimal.ts).
    const animals: Record<string, Animal> = {};
    for (let i = 0; i < 11; i++) {
      animals[`chicken-${i}`] = makeAnimal({
        id: `chicken-${i}`,
        type: "Chicken",
        state: i === 0 ? "ready" : "idle",
        createdAt: i + 1, // chicken-0 is oldest -> locked
      });
    }

    const state = withGoldEgg({
      ...GAME_STATE,
      henHouse: { ...GAME_STATE.henHouse, level: 1, animals },
    });

    const targets = getFeedAllTargets({
      state,
      building: "Hen House",
      createdAt: now,
    });

    expect(targets.toClaim).toEqual(["chicken-0"]);
    expect(targets.toFeed).toHaveLength(10);
    expect(targets.toFeed).not.toContain("chicken-0");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `yarn test src/features/game/events/landExpansion/feedAllAnimals.test.ts`
Expected: FAIL — `Cannot find module './feedAllAnimals'`

- [ ] **Step 3: Write the helpers**

Create `src/features/game/events/landExpansion/feedAllAnimals.ts`:

```ts
import {
  ANIMALS,
  type AnimalBuildingType,
  type AnimalType,
} from "features/game/types/animals";
import type { CollectibleName } from "features/game/types/craftables";
import type { GameState } from "features/game/types/game";
import { makeAnimalBuildingKey } from "features/game/lib/animals";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { isWearableActive } from "features/game/lib/wearables";
import { getKeys } from "lib/object";
import { isAnimalFeedable } from "./buyAnimal";

export const GOLDEN_ANIMAL_ASSETS: Record<AnimalType, CollectibleName> = {
  Chicken: "Gold Egg",
  Cow: "Golden Cow",
  Sheep: "Golden Sheep",
};

export function getCoveredAnimalTypes({
  state,
  building,
}: {
  state: GameState;
  building: AnimalBuildingType;
}): AnimalType[] {
  return getKeys(ANIMALS).filter(
    (type) =>
      ANIMALS[type].buildingRequired === building &&
      isCollectibleBuilt({ name: GOLDEN_ANIMAL_ASSETS[type], game: state }),
  );
}

export type FeedAllTargets = {
  toClaim: string[];
  toCure: string[];
  toFeed: string[];
};

export function getFeedAllTargets({
  state,
  building,
  createdAt = Date.now(),
}: {
  state: GameState;
  building: AnimalBuildingType;
  createdAt?: number;
}): FeedAllTargets {
  const covered = getCoveredAnimalTypes({ state, building });
  const buildingKey = makeAnimalBuildingKey(building);
  const hasOracleSyringe = isWearableActive({
    name: "Oracle Syringe",
    game: state,
  });
  const { animals } = state[buildingKey];

  const targets: FeedAllTargets = { toClaim: [], toCure: [], toFeed: [] };

  getKeys(animals).forEach((id) => {
    const animal = animals[id];

    if (!covered.includes(animal.type)) return;

    // Sleeping animals (including needsLove, which only occurs while
    // asleep) are never touched by the bulk action.
    if (createdAt < animal.awakeAt) return;

    if (animal.state === "ready") {
      // Capacity lock does not block claiming, matching the manual UI.
      targets.toClaim.push(id);
      return;
    }

    if (animal.state === "sick") {
      if (hasOracleSyringe) targets.toCure.push(id);
      return;
    }

    if (isAnimalFeedable(buildingKey, state, id)) {
      targets.toFeed.push(id);
    }
  });

  return targets;
}
```

Note: the test file imports `feedAllAnimals` (the handler, Task 2). To keep
Step 4 green, temporarily comment out that import line and the handler
`describe` blocks are not yet written — only the helper tests above exist, so
just remove `feedAllAnimals` from the import until Task 2:
`import { getCoveredAnimalTypes, getFeedAllTargets } from "./feedAllAnimals";`

- [ ] **Step 4: Run tests to verify they pass**

Run: `yarn test src/features/game/events/landExpansion/feedAllAnimals.test.ts`
Expected: PASS (all `getCoveredAnimalTypes` and `getFeedAllTargets` tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/game/events/landExpansion/feedAllAnimals.ts src/features/game/events/landExpansion/feedAllAnimals.test.ts
git commit -m "feat: feed-all eligibility helpers for golden asset animals"
```

---

### Task 2: `feedAllAnimals` handler

**Files:**
- Modify: `src/features/game/events/landExpansion/feedAllAnimals.ts`
- Test: `src/features/game/events/landExpansion/feedAllAnimals.test.ts`

**Interfaces:**
- Consumes: `getFeedAllTargets`, `getCoveredAnimalTypes` (Task 1); existing `feedAnimal`, `claimProduce`, `isAnimalFeedable`.
- Produces (used by Task 3):
  - `export type FeedAllAnimalsAction = { type: "animals.fedAll"; building: AnimalBuildingType }`
  - `export function feedAllAnimals({ state, action, createdAt? }): GameState`

- [ ] **Step 1: Write the failing tests**

Append to `feedAllAnimals.test.ts` (and restore `feedAllAnimals` to the import from `./feedAllAnimals`):

```ts
describe("feedAllAnimals", () => {
  it("throws when the building is not placed", () => {
    expect(() =>
      feedAllAnimals({
        createdAt: now,
        state: withGoldEgg({
          ...GAME_STATE,
          buildings: {
            "Hen House": [{ id: "hh", coordinates: undefined, createdAt: 0, readyAt: 0 }],
          },
        }),
        action: { type: "animals.fedAll", building: "Hen House" },
      }),
    ).toThrow("Building does not exist");
  });

  it("throws when no golden asset is active for the building", () => {
    expect(() =>
      feedAllAnimals({
        createdAt: now,
        state: withGoldEgg(GAME_STATE), // Gold Egg does not cover the Barn
        action: { type: "animals.fedAll", building: "Barn" },
      }),
    ).toThrow("No active golden asset for this building");
  });

  it("throws when no animals are eligible", () => {
    const state = withGoldEgg({
      ...GAME_STATE,
      henHouse: {
        ...GAME_STATE.henHouse,
        animals: {
          "1": makeAnimal({
            id: "1",
            type: "Chicken",
            state: "idle",
            awakeAt: now + 10_000,
          }),
          "2": makeAnimal({ id: "2", type: "Chicken", state: "sick" }),
        },
      },
    });

    expect(() =>
      feedAllAnimals({
        createdAt: now,
        state,
        action: { type: "animals.fedAll", building: "Hen House" },
      }),
    ).toThrow("No animals to feed");
  });

  it("feeds every awake chicken for free with the Gold Egg", () => {
    const state = feedAllAnimals({
      createdAt: now,
      state: withGoldEgg({
        ...GAME_STATE,
        inventory: { ...GAME_STATE.inventory, "Gold Egg": new Decimal(1), Hay: new Decimal(5) },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "1": makeAnimal({ id: "1", type: "Chicken" }),
            "2": makeAnimal({ id: "2", type: "Chicken" }),
            "3": makeAnimal({ id: "3", type: "Chicken" }),
          },
        },
      }),
      action: { type: "animals.fedAll", building: "Hen House" },
    });

    expect(state.henHouse.animals["1"].experience).toBeGreaterThan(0);
    expect(state.henHouse.animals["2"].experience).toBeGreaterThan(0);
    expect(state.henHouse.animals["3"].experience).toBeGreaterThan(0);
    expect(["happy", "ready"]).toContain(state.henHouse.animals["1"].state);
    // No food consumed
    expect(state.inventory.Hay).toEqual(new Decimal(5));
    // Boost + activity tracked
    expect(state.boostsUsedAt?.["Gold Egg"]).toEqual(now);
    expect(state.farmActivity["Chicken Fed"]).toEqual(3);
  });

  it("feeds only cows with Golden Cow in the Barn", () => {
    const state = feedAllAnimals({
      createdAt: now,
      state: withGoldenCow({
        ...GAME_STATE,
        barn: {
          ...GAME_STATE.barn,
          animals: {
            cow: makeAnimal({ id: "cow", type: "Cow" }),
            sheep: makeAnimal({ id: "sheep", type: "Sheep" }),
          },
        },
      }),
      action: { type: "animals.fedAll", building: "Barn" },
    });

    expect(state.barn.animals["cow"].experience).toBeGreaterThan(0);
    expect(state.barn.animals["sheep"].experience).toEqual(0);
  });

  it("feeds cows and sheep with both golden assets in the Barn", () => {
    const state = feedAllAnimals({
      createdAt: now,
      state: withGoldenSheep(
        withGoldenCow({
          ...GAME_STATE,
          barn: {
            ...GAME_STATE.barn,
            animals: {
              cow: makeAnimal({ id: "cow", type: "Cow" }),
              sheep: makeAnimal({ id: "sheep", type: "Sheep" }),
            },
          },
        }),
      ),
      action: { type: "animals.fedAll", building: "Barn" },
    });

    expect(state.barn.animals["cow"].experience).toBeGreaterThan(0);
    expect(state.barn.animals["sheep"].experience).toBeGreaterThan(0);
  });

  it("leaves sleeping animals untouched while feeding awake ones", () => {
    const state = feedAllAnimals({
      createdAt: now,
      state: withGoldEgg({
        ...GAME_STATE,
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            awake: makeAnimal({ id: "awake", type: "Chicken" }),
            asleep: makeAnimal({
              id: "asleep",
              type: "Chicken",
              awakeAt: now + 10_000,
            }),
          },
        },
      }),
      action: { type: "animals.fedAll", building: "Hen House" },
    });

    expect(state.henHouse.animals["awake"].experience).toBeGreaterThan(0);
    expect(state.henHouse.animals["asleep"].experience).toEqual(0);
    expect(state.henHouse.animals["asleep"].state).toEqual("idle");
  });

  it("claims produce of ready animals and puts them to sleep", () => {
    const state = feedAllAnimals({
      createdAt: now,
      state: withGoldEgg({
        ...GAME_STATE,
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "1": makeAnimal({
              id: "1",
              type: "Chicken",
              state: "ready",
              experience: 120,
              reward: { items: [{ name: "Egg", amount: 1 }] },
            }),
          },
        },
      }),
      action: { type: "animals.fedAll", building: "Hen House" },
    });

    const chicken = state.henHouse.animals["1"];
    expect(chicken.state).toEqual("idle");
    expect(chicken.asleepAt).toEqual(now);
    expect(chicken.awakeAt).toBeGreaterThan(now);
    // Reward items granted by claimProduce
    expect(state.inventory.Egg?.gte(1)).toBe(true);
    // Claiming must not be followed by a feed
    expect(chicken.experience).toEqual(120);
  });

  it("skips sick animals without the Oracle Syringe even with Barn Delight", () => {
    const state = feedAllAnimals({
      createdAt: now,
      state: withGoldEgg({
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          "Gold Egg": new Decimal(1),
          "Barn Delight": new Decimal(5),
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            sick: makeAnimal({ id: "sick", type: "Chicken", state: "sick" }),
            healthy: makeAnimal({ id: "healthy", type: "Chicken" }),
          },
        },
      }),
      action: { type: "animals.fedAll", building: "Hen House" },
    });

    expect(state.henHouse.animals["sick"].state).toEqual("sick");
    expect(state.henHouse.animals["sick"].experience).toEqual(0);
    expect(state.inventory["Barn Delight"]).toEqual(new Decimal(5));
    expect(state.henHouse.animals["healthy"].experience).toBeGreaterThan(0);
  });

  it("cures and feeds sick animals with the Oracle Syringe, consuming no Barn Delight", () => {
    const state = feedAllAnimals({
      createdAt: now,
      state: withOracleSyringe(
        withGoldEgg({
          ...GAME_STATE,
          henHouse: {
            ...GAME_STATE.henHouse,
            animals: {
              sick: makeAnimal({ id: "sick", type: "Chicken", state: "sick" }),
            },
          },
        }),
      ),
      action: { type: "animals.fedAll", building: "Hen House" },
    });

    const chicken = state.henHouse.animals["sick"];
    expect(["happy", "ready"]).toContain(chicken.state);
    expect(chicken.experience).toBeGreaterThan(0);
    expect(state.inventory["Barn Delight"] ?? new Decimal(0)).toEqual(
      new Decimal(0),
    );
    expect(state.farmActivity["Chicken Cured"]).toEqual(1);
  });

  it("does not feed over-capacity animals", () => {
    const animals: Record<string, Animal> = {};
    for (let i = 0; i < 11; i++) {
      animals[`chicken-${i}`] = makeAnimal({
        id: `chicken-${i}`,
        type: "Chicken",
        createdAt: i + 1, // chicken-0 is oldest -> locked at capacity 10
      });
    }

    const state = feedAllAnimals({
      createdAt: now,
      state: withGoldEgg({
        ...GAME_STATE,
        henHouse: { ...GAME_STATE.henHouse, level: 1, animals },
      }),
      action: { type: "animals.fedAll", building: "Hen House" },
    });

    expect(state.henHouse.animals["chicken-0"].experience).toEqual(0);
    expect(state.henHouse.animals["chicken-1"].experience).toBeGreaterThan(0);
    expect(state.henHouse.animals["chicken-10"].experience).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run tests to verify the new ones fail**

Run: `yarn test src/features/game/events/landExpansion/feedAllAnimals.test.ts`
Expected: FAIL — `feedAllAnimals` is not exported.

- [ ] **Step 3: Write the handler**

Append to `feedAllAnimals.ts` (add `feedAnimal`/`claimProduce` imports at the top):

```ts
import { claimProduce } from "./claimProduce";
import { feedAnimal } from "./feedAnimal";
```

```ts
export type FeedAllAnimalsAction = {
  type: "animals.fedAll";
  building: AnimalBuildingType;
};

type Options = {
  state: Readonly<GameState>;
  action: FeedAllAnimalsAction;
  createdAt?: number;
};

export function feedAllAnimals({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const buildings = state.buildings[action.building];
  if (!buildings?.some((building) => !!building.coordinates)) {
    throw new Error("Building does not exist");
  }

  if (
    getCoveredAnimalTypes({ state, building: action.building }).length === 0
  ) {
    throw new Error("No active golden asset for this building");
  }

  const { toClaim, toCure, toFeed } = getFeedAllTargets({
    state,
    building: action.building,
    createdAt,
  });

  if (toClaim.length + toCure.length + toFeed.length === 0) {
    throw new Error("No animals to feed");
  }

  const buildingKey = makeAnimalBuildingKey(action.building);

  // Compose the existing single-animal handlers so XP, boosts, rewards and
  // activity tracking keep a single source of truth.
  let game: GameState = state;

  toClaim.forEach((id) => {
    game = claimProduce({
      state: game,
      action: {
        type: "produce.claimed",
        animal: game[buildingKey].animals[id].type,
        id,
      },
      createdAt,
    });
  });

  toCure.forEach((id) => {
    const { type } = game[buildingKey].animals[id];
    // Free with the Oracle Syringe (getFeedAllTargets only cures when active)
    game = feedAnimal({
      state: game,
      action: { type: "animal.fed", animal: type, id, item: "Barn Delight" },
      createdAt,
    });
    if (isAnimalFeedable(buildingKey, game, id)) {
      game = feedAnimal({
        state: game,
        action: { type: "animal.fed", animal: type, id },
        createdAt,
      });
    }
  });

  toFeed.forEach((id) => {
    game = feedAnimal({
      state: game,
      action: {
        type: "animal.fed",
        animal: game[buildingKey].animals[id].type,
        id,
      },
      createdAt,
    });
  });

  return game;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `yarn test src/features/game/events/landExpansion/feedAllAnimals.test.ts`
Expected: PASS (all tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/game/events/landExpansion/feedAllAnimals.ts src/features/game/events/landExpansion/feedAllAnimals.test.ts
git commit -m "feat: animals.fedAll bulk feed handler composing feedAnimal/claimProduce"
```

---

### Task 3: Register the event

**Files:**
- Modify: `src/features/game/events/index.ts` (import block; `PlayingEvent` union near line 967; `PLAYING_EVENTS` map near line 1268)

**Interfaces:**
- Consumes: `feedAllAnimals`, `FeedAllAnimalsAction` (Task 2).
- Produces: `"animals.fedAll"` dispatchable via `gameService.send` (used by Task 5).

- [ ] **Step 1: Add the import**

Next to the existing feedAnimal import (line ~475):

```ts
import {
  feedAllAnimals,
  type FeedAllAnimalsAction,
} from "./landExpansion/feedAllAnimals";
```

- [ ] **Step 2: Add to the `PlayingEvent` union**

Directly after `| FeedAnimalAction` (line ~967):

```ts
  | FeedAllAnimalsAction
```

- [ ] **Step 3: Add to `PLAYING_EVENTS`**

Directly after `"animal.fed": feedAnimal,` (line ~1268):

```ts
  "animals.fedAll": feedAllAnimals,
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors (the `Handlers<PlayingEvent>` mapped type forces the map entry and action type to line up).

- [ ] **Step 5: Commit**

```bash
git add src/features/game/events/index.ts
git commit -m "feat: register animals.fedAll game event"
```

---

### Task 4: i18n keys

**Files:**
- Modify: `src/lib/i18n/dictionaries/dictionary.json`
- Modify: `src/lib/i18n/dictionaries/en.json`

`TranslationKeys` is derived from `dictionary.json` (`src/lib/i18n/dictionaries/types.ts`), so adding the key to both files is all that's needed; other languages are filled by the translation bot.

- [ ] **Step 1: Add the key to both files**

In BOTH `dictionary.json` and `en.json`, directly after the existing `"animal.noMedicine"` entry (line ~5801 in each), add:

```json
  "animals.feedAll": "Feed all animals",
```

(Keep the surrounding alphabetical-ish grouping of `animal.*` keys; exact position after `animal.noMedicine` is fine.)

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/i18n/dictionaries/dictionary.json src/lib/i18n/dictionaries/en.json
git commit -m "feat: i18n key for feed-all-animals button"
```

---

### Task 5: `FeedAllButton` component

**Files:**
- Create: `src/features/game/expansion/components/animals/FeedAllButton.tsx`

**Interfaces:**
- Consumes: `getCoveredAnimalTypes`, `getFeedAllTargets`, `GOLDEN_ANIMAL_ASSETS` (Task 1), `"animals.fedAll"` event (Task 3), `"animals.feedAll"` i18n key (Task 4).
- Produces: `export const FeedAllButton: React.FC<{ building: AnimalBuildingType }>` (used by Task 6).

- [ ] **Step 1: Write the component**

```tsx
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";
import classNames from "classnames";
import emptyDisc from "assets/icons/empty_disc.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { makeAnimalBuildingKey } from "features/game/lib/animals";
import type { AnimalBuildingType } from "features/game/types/animals";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getCoveredAnimalTypes,
  getFeedAllTargets,
  GOLDEN_ANIMAL_ASSETS,
} from "features/game/events/landExpansion/feedAllAnimals";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSound } from "lib/utils/hooks/useSound";
import { getValues } from "lib/object";

const _state = (state: MachineState) => state.context.state;

export const FeedAllButton: React.FC<{ building: AnimalBuildingType }> = ({
  building,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const game = useSelector(gameService, _state);
  const { play: playFeedAnimal } = useSound("feed_animal");

  // Bumped when the soonest sleeping animal wakes so eligibility re-evaluates
  const [, setWakeTick] = useState(0);

  const covered = getCoveredAnimalTypes({ state: game, building });
  const { toClaim, toCure, toFeed } = getFeedAllTargets({
    state: game,
    building,
  });
  const eligibleCount = toClaim.length + toCure.length + toFeed.length;

  const buildingKey = makeAnimalBuildingKey(building);
  const nextWakeAt = Math.min(
    ...getValues(game[buildingKey].animals)
      .filter((animal) => covered.includes(animal.type))
      .map((animal) => animal.awakeAt)
      .filter((awakeAt) => awakeAt > Date.now()),
  );

  useEffect(() => {
    if (!isFinite(nextWakeAt)) return;

    const timeout = setTimeout(
      () => setWakeTick((tick) => tick + 1),
      nextWakeAt - Date.now() + 100,
    );

    return () => clearTimeout(timeout);
  }, [nextWakeAt]);

  if (covered.length === 0) return null;

  const disabled = eligibleCount === 0;

  const handleClick = () => {
    if (disabled) return;

    gameService.send({ type: "animals.fedAll", building });
    playFeedAnimal();
  };

  return (
    <div
      className={classNames("absolute z-10", {
        "cursor-pointer": !disabled,
        "grayscale opacity-50": disabled,
      })}
      style={{
        width: `${PIXEL_SCALE * 18}px`,
        // Directly below the shop disc (top 18px, height 18 * PIXEL_SCALE)
        top: `${18 + PIXEL_SCALE * 20}px`,
        right: `18px`,
      }}
      onClick={handleClick}
    >
      <img src={emptyDisc} alt={t("animals.feedAll")} className="w-full" />
      <img
        src={ITEM_DETAILS[GOLDEN_ANIMAL_ASSETS[covered[0]]].image}
        alt=""
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: `${PIXEL_SCALE * 10}px` }}
      />
    </div>
  );
};
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/game/expansion/components/animals/FeedAllButton.tsx
git commit -m "feat: FeedAllButton disc component for golden asset holders"
```

---

### Task 6: Mount the button in both buildings

**Files:**
- Modify: `src/features/henHouse/HenHouseInside.tsx` (inside the `{!deal && (...)}` block containing the shop disc, ~line 178)
- Modify: `src/features/barn/BarnInside.tsx` (inside the `{!deal && (...)}` block containing the shop disc, ~line 282)

**Interfaces:**
- Consumes: `FeedAllButton` (Task 5).

- [ ] **Step 1: Hen House**

In `HenHouseInside.tsx`, add the import:

```tsx
import { FeedAllButton } from "features/game/expansion/components/animals/FeedAllButton";
```

Inside the `{!deal && (<> ... </>)}` fragment, directly after the shop disc `<img>` (the one with `alt="Buy Animals"`), add:

```tsx
                  <FeedAllButton building="Hen House" />
```

- [ ] **Step 2: Barn**

In `BarnInside.tsx`, add the same import and, inside its `{!deal && (<> ... </>)}` fragment directly after the shop disc `<img>`, add:

```tsx
                  <FeedAllButton building="Barn" />
```

- [ ] **Step 3: Type-check and eyeball**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/henHouse/HenHouseInside.tsx src/features/barn/BarnInside.tsx
git commit -m "feat: mount FeedAllButton in Hen House and Barn interiors"
```

---

### Task 7: Sync animal sprites after bulk updates

**Files:**
- Modify: `src/features/henHouse/Chicken.tsx`
- Modify: `src/features/barn/components/Cow.tsx`
- Modify: `src/features/barn/components/Sheep.tsx`

Each component runs a local XState `animalMachine` that only transitions when
that component dispatches an event. The bulk action changes game state
underneath them, so each gets one sync effect. The effect acts only when the
game-state animal actually changed (tracked via a ref), which prevents
flapping against the machine's `after: 2000` happy→idle auto-transition.

**Interfaces:**
- Consumes: existing `animalMachine` events `FEED`, `CURE`, `CLAIM_PRODUCE`.

- [ ] **Step 1: Chicken**

In `Chicken.tsx`, extend the React import to include `useRef`, then add below the existing sick-sync `useEffect` (~line 147):

```tsx
  const lastSynced = useRef({
    state: chicken.state,
    experience: chicken.experience,
  });

  // Sync the local machine when game state changes underneath it,
  // e.g. via the Feed All button (bulk feed/cure/claim without a click).
  useEffect(() => {
    const prev = lastSynced.current;
    lastSynced.current = {
      state: chicken.state,
      experience: chicken.experience,
    };

    if (
      prev.state === chicken.state &&
      prev.experience === chicken.experience
    ) {
      return;
    }

    const machineState = () => chickenService.getSnapshot().value;

    if (machineState() === "sick" && chicken.state !== "sick") {
      chickenService.send({ type: "CURE", animal: chicken });
    }

    if (machineState() === "ready" && chicken.state === "idle") {
      chickenService.send({ type: "CLAIM_PRODUCE", animal: chicken });
    }

    if (
      ["idle", "happy", "sad"].includes(machineState() as string) &&
      ["happy", "sad", "ready"].includes(chicken.state) &&
      machineState() !== chicken.state
    ) {
      chickenService.send({ type: "FEED", animal: chicken });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chicken.state, chicken.experience]);
```

- [ ] **Step 2: Cow**

Same block in `Cow.tsx` below its sick-sync effect (~line 137), with `chicken` → `cow` and `chickenService` → `cowService`:

```tsx
  const lastSynced = useRef({ state: cow.state, experience: cow.experience });

  // Sync the local machine when game state changes underneath it,
  // e.g. via the Feed All button (bulk feed/cure/claim without a click).
  useEffect(() => {
    const prev = lastSynced.current;
    lastSynced.current = { state: cow.state, experience: cow.experience };

    if (prev.state === cow.state && prev.experience === cow.experience) {
      return;
    }

    const machineState = () => cowService.getSnapshot().value;

    if (machineState() === "sick" && cow.state !== "sick") {
      cowService.send({ type: "CURE", animal: cow });
    }

    if (machineState() === "ready" && cow.state === "idle") {
      cowService.send({ type: "CLAIM_PRODUCE", animal: cow });
    }

    if (
      ["idle", "happy", "sad"].includes(machineState() as string) &&
      ["happy", "sad", "ready"].includes(cow.state) &&
      machineState() !== cow.state
    ) {
      cowService.send({ type: "FEED", animal: cow });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cow.state, cow.experience]);
```

- [ ] **Step 3: Sheep**

Same block in `Sheep.tsx` below its sick-sync effect (~line 145), with `sheep` / `sheepService` (note: the machine state selector variable there is `sheepState`; the block below reads the snapshot directly so no other changes are needed):

```tsx
  const lastSynced = useRef({
    state: sheep.state,
    experience: sheep.experience,
  });

  // Sync the local machine when game state changes underneath it,
  // e.g. via the Feed All button (bulk feed/cure/claim without a click).
  useEffect(() => {
    const prev = lastSynced.current;
    lastSynced.current = { state: sheep.state, experience: sheep.experience };

    if (prev.state === sheep.state && prev.experience === sheep.experience) {
      return;
    }

    const machineState = () => sheepService.getSnapshot().value;

    if (machineState() === "sick" && sheep.state !== "sick") {
      sheepService.send({ type: "CURE", animal: sheep });
    }

    if (machineState() === "ready" && sheep.state === "idle") {
      sheepService.send({ type: "CLAIM_PRODUCE", animal: sheep });
    }

    if (
      ["idle", "happy", "sad"].includes(machineState() as string) &&
      ["happy", "sad", "ready"].includes(sheep.state) &&
      machineState() !== sheep.state
    ) {
      sheepService.send({ type: "FEED", animal: sheep });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheep.state, sheep.experience]);
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/features/henHouse/Chicken.tsx src/features/barn/components/Cow.tsx src/features/barn/components/Sheep.tsx
git commit -m "feat: sync animal sprite machines after bulk feed-all updates"
```

---

### Task 8: Full verification

- [ ] **Step 1: Run the new event tests**

Run: `yarn test src/features/game/events/landExpansion/feedAllAnimals.test.ts`
Expected: PASS.

- [ ] **Step 2: Run the neighbouring animal event tests (regression)**

Run: `yarn test src/features/game/events/landExpansion/feedAnimal.test.ts src/features/game/events/landExpansion/claimProduce.test.ts src/features/game/events/landExpansion/buyAnimal.test.ts`
Expected: PASS.

- [ ] **Step 3: Type-check and lint changed files**

Run: `npx tsc --noEmit`
Run: `npx eslint --quiet src/features/game/events/landExpansion/feedAllAnimals.ts src/features/game/events/landExpansion/feedAllAnimals.test.ts src/features/game/expansion/components/animals/FeedAllButton.tsx src/features/henHouse/HenHouseInside.tsx src/features/henHouse/Chicken.tsx src/features/barn/BarnInside.tsx src/features/barn/components/Cow.tsx src/features/barn/components/Sheep.tsx src/features/game/events/index.ts`
Expected: no errors.

- [ ] **Step 4: Manual smoke test (if a dev server is available)**

Run: `yarn dev`, open a farm with a placed Gold Egg, enter the Hen House: the disc appears under the shop disc, greys out when everything is asleep, and one click feeds every awake chicken (sprites turn happy, XP bars move). Repeat in the Barn with Golden Cow/Sheep.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A && git commit -m "fix: feed-all follow-ups from verification"
```
