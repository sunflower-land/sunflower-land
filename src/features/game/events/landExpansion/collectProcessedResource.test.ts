import Decimal from "decimal.js-light";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { INITIAL_FARM } from "features/game/lib/constants";
import { FISH_PROCESSING_TIME_SECONDS } from "features/game/types/fishProcessing";
import { GameState } from "features/game/types/game";
import {
  collectProcessedResource,
  CollectProcessedResourceAction,
} from "./collectProcessedResource";
import { ProcessingBuildingName } from "features/game/types/buildings";

const createdAt = Date.now();

const SPRING_STATE: GameState = {
  ...INITIAL_FARM,
  bumpkin: TEST_BUMPKIN,
  inventory: {
    Anchovy: new Decimal(10),
    Porgy: new Decimal(2),
    "Sea Horse": new Decimal(2),
  },
  buildings: {
    ...INITIAL_FARM.buildings,
    "Fish Market": [
      {
        id: "123",
        coordinates: { x: 0, y: 0 },
        createdAt,
      },
    ],
  },
};

describe("collectProcessedFood", () => {
  it("throws if the building is not a food processing building", () => {
    expect(() => {
      collectProcessedResource({
        state: SPRING_STATE,
        action: {
          type: "processedResource.collected",
          buildingId: "123",
          buildingName: "Fire Pit" as ProcessingBuildingName,
        },
        farmId: 1,
      });
    }).toThrow("Invalid resource processing building");
  });

  it("throws if the product is not ready", () => {
    const state: GameState = {
      ...SPRING_STATE,
      buildings: {
        ...SPRING_STATE.buildings,
        "Fish Market": [
          {
            id: "123",
            coordinates: { x: 0, y: 0 },
            createdAt,
            processing: [
              {
                name: "Fish Flake",
                startedAt: Date.now() - 1000,
                readyAt: Date.now() + 1000,
                requirements: {},
              },
            ],
          },
        ],
      },
    };
    expect(() => {
      collectProcessedResource({
        state,
        action: {
          type: "processedResource.collected",
          buildingId: "123",
          buildingName: "Fish Market",
        },
        farmId: 1,
      });
    }).toThrow("No processed food ready");
  });

  it("throws if the fish market does not exist", () => {
    expect(() => {
      collectProcessedResource({
        state: SPRING_STATE,
        action: {
          type: "processedResource.collected",
          buildingId: "missing",
          buildingName: "Fish Market",
        },
        farmId: 1,
      });
    }).toThrow("Fish Market does not exist");
  });

  it("collects ready processed fish", () => {
    const readyAt = createdAt - 1000;
    const state: GameState = {
      ...SPRING_STATE,
      buildings: {
        ...SPRING_STATE.buildings,
        "Fish Market": [
          {
            id: "123",
            coordinates: { x: 0, y: 0 },
            createdAt,
            processing: [
              {
                name: "Fish Flake",
                startedAt:
                  readyAt - FISH_PROCESSING_TIME_SECONDS["Fish Flake"] * 1000,
                readyAt,
                requirements: {},
              },
            ],
          },
        ],
      },
    };

    const updated = collectProcessedResource({
      state,
      action: {
        type: "processedResource.collected",
        buildingId: "123",
        buildingName: "Fish Market",
      } as CollectProcessedResourceAction,
      createdAt,
      farmId: 1,
    });

    expect(updated.inventory["Fish Flake"]).toEqual(new Decimal(1));
    const processing = updated.buildings["Fish Market"]?.[0].processing ?? [];
    expect(processing).toHaveLength(0);
  });

  describe("Bubble Aura yield bonus", () => {
    const readyAt =
      createdAt - FISH_PROCESSING_TIME_SECONDS["Fish Flake"] * 1000;

    const stateWith = (params: {
      auraEquipped: boolean;
      processedCounter?: number;
    }): GameState => ({
      ...SPRING_STATE,
      bumpkin: {
        ...SPRING_STATE.bumpkin!,
        equipped: {
          ...SPRING_STATE.bumpkin!.equipped,
          aura: params.auraEquipped
            ? "Bubble Aura"
            : SPRING_STATE.bumpkin!.equipped.aura,
        },
      },
      farmActivity:
        params.processedCounter !== undefined
          ? {
              ...SPRING_STATE.farmActivity,
              "Fish Flake Processed": params.processedCounter,
            }
          : SPRING_STATE.farmActivity,
      buildings: {
        ...SPRING_STATE.buildings,
        "Fish Market": [
          {
            id: "123",
            coordinates: { x: 0, y: 0 },
            createdAt,
            processing: [
              {
                name: "Fish Flake",
                startedAt:
                  readyAt - FISH_PROCESSING_TIME_SECONDS["Fish Flake"] * 1000,
                readyAt,
                requirements: {},
              },
            ],
          },
        ],
      },
    });

    // The PRNG is deterministic given (farmId, itemId, counter, chance, name).
    // We sweep counters until we deterministically observe a hit and a miss for
    // the same farm + item + chance, so the test pins both branches.
    it("yields exactly 1 when Bubble Aura is not equipped (no roll)", () => {
      const updated = collectProcessedResource({
        state: stateWith({ auraEquipped: false }),
        action: {
          type: "processedResource.collected",
          buildingId: "123",
          buildingName: "Fish Market",
        } as CollectProcessedResourceAction,
        createdAt,
        farmId: 42,
      });
      expect(updated.inventory["Fish Flake"]).toEqual(new Decimal(1));
    });

    it("yields 2 when the prng roll passes (deterministic hit counter)", () => {
      const { prngChance } = jest.requireActual(
        "lib/prng",
      ) as typeof import("lib/prng");
      const { KNOWN_IDS } = jest.requireActual(
        "features/game/types",
      ) as typeof import("features/game/types");
      const farmId = 42;
      let hitCounter = -1;
      for (let counter = 0; counter < 200; counter++) {
        if (
          prngChance({
            farmId,
            itemId: KNOWN_IDS["Fish Flake"],
            counter,
            chance: 20,
            criticalHitName: "Bubble Aura",
          })
        ) {
          hitCounter = counter;
          break;
        }
      }
      expect(hitCounter).toBeGreaterThanOrEqual(0);

      const updated = collectProcessedResource({
        state: stateWith({
          auraEquipped: true,
          processedCounter: hitCounter,
        }),
        action: {
          type: "processedResource.collected",
          buildingId: "123",
          buildingName: "Fish Market",
        } as CollectProcessedResourceAction,
        createdAt,
        farmId,
      });
      expect(updated.inventory["Fish Flake"]).toEqual(new Decimal(2));
    });

    it("yields 1 when the prng roll fails (deterministic miss counter)", () => {
      const { prngChance } = jest.requireActual(
        "lib/prng",
      ) as typeof import("lib/prng");
      const { KNOWN_IDS } = jest.requireActual(
        "features/game/types",
      ) as typeof import("features/game/types");
      const farmId = 42;
      let missCounter = -1;
      for (let counter = 0; counter < 200; counter++) {
        if (
          !prngChance({
            farmId,
            itemId: KNOWN_IDS["Fish Flake"],
            counter,
            chance: 20,
            criticalHitName: "Bubble Aura",
          })
        ) {
          missCounter = counter;
          break;
        }
      }
      expect(missCounter).toBeGreaterThanOrEqual(0);

      const updated = collectProcessedResource({
        state: stateWith({
          auraEquipped: true,
          processedCounter: missCounter,
        }),
        action: {
          type: "processedResource.collected",
          buildingId: "123",
          buildingName: "Fish Market",
        } as CollectProcessedResourceAction,
        createdAt,
        farmId,
      });
      expect(updated.inventory["Fish Flake"]).toEqual(new Decimal(1));
    });
  });
});
