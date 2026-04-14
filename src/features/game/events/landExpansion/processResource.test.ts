import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import {
  collectProcessedResource,
  CollectProcessedResourceAction,
} from "./collectProcessedResource";
import {
  FISH_PROCESSING_TIME_SECONDS,
  getFishProcessingRequirements,
} from "features/game/types/fishProcessing";
import { GameState } from "features/game/types/game";
import {
  processProcessedResource,
  ProcessProcessedResourceAction,
} from "./processResource";
import { ProcessingBuildingName } from "features/game/types/buildings";

const createdAt = Date.now();

const SPRING_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
  inventory: {
    Anchovy: new Decimal(10),
    Porgy: new Decimal(2),
    "Sea Bass": new Decimal(2),
  },
  buildings: {
    "Fish Market": [
      {
        id: "123",
        coordinates: { x: 0, y: 0 },
        createdAt,
      },
    ],
  },
};

describe("processProcessedFood", () => {
  it("throws when Fish Market is missing", () => {
    expect(() =>
      processProcessedResource({
        state: {
          ...SPRING_STATE,
          buildings: {},
        },
        action: {
          type: "processedResource.processed",
          item: "Fish Flake",
          buildingId: "missing",
        } as ProcessProcessedResourceAction,
      }),
    ).toThrow("Required building does not exist");
  });

  it("deducts seasonal requirements and queues processing", () => {
    const state = processProcessedResource({
      state: SPRING_STATE,
      action: {
        type: "processedResource.processed",
        item: "Fish Flake",
        buildingId: "123",
        buildingName: "Fish Market",
      },
      createdAt,
    });

    const requirements = getFishProcessingRequirements({
      item: "Fish Flake",
      season: "spring",
    });

    expect(state.inventory.Anchovy).toEqual(
      SPRING_STATE.inventory.Anchovy?.sub(requirements.Anchovy ?? 0),
    );
    expect(state.inventory.Porgy).toEqual(
      SPRING_STATE.inventory.Porgy?.sub(requirements.Porgy ?? 0),
    );

    const processing = state.buildings["Fish Market"]?.[0].processing ?? [];
    expect(processing).toHaveLength(1);
    expect(processing[0]).toMatchObject({
      name: "Fish Flake",
      startedAt: createdAt,
      readyAt: createdAt + FISH_PROCESSING_TIME_SECONDS["Fish Flake"] * 1000,
    });
  });

  it("queues behind an in-progress request", () => {
    const readyAt =
      createdAt + FISH_PROCESSING_TIME_SECONDS["Fish Stick"] * 1000;
    const state: GameState = {
      ...SPRING_STATE,
      inventory: {
        ...SPRING_STATE.inventory,
        Anchovy: new Decimal(10),
        "Red Snapper": new Decimal(10),
        "Moray Eel": new Decimal(5),
        Tilapia: new Decimal(3),
        "Olive Flounder": new Decimal(10),
        "Zebra Turkeyfish": new Decimal(10),
      },
      vip: {
        bundles: [{ name: "1_MONTH", boughtAt: Date.now() }],
        expiresAt: Date.now() + 31 * 24 * 60 * 60 * 1000,
      },
      buildings: {
        "Fish Market": [
          {
            id: "123",
            coordinates: { x: 0, y: 0 },
            createdAt,
            processing: [
              {
                name: "Fish Stick",
                startedAt: createdAt,
                readyAt,
                requirements: {
                  Anchovy: new Decimal(6),
                  "Red Snapper": new Decimal(6),
                },
              },
            ],
          },
        ],
      },
    };

    const updated = processProcessedResource({
      state,
      action: {
        type: "processedResource.processed",
        item: "Fish Stick",
        buildingId: "123",
        buildingName: "Fish Market",
      },
      createdAt,
    });

    const processing = updated.buildings["Fish Market"]?.[0].processing ?? [];
    expect(processing).toHaveLength(2);
    expect(processing[1].startedAt).toEqual(readyAt);
    expect(processing[1].readyAt).toEqual(
      readyAt + FISH_PROCESSING_TIME_SECONDS["Fish Stick"] * 1000,
    );
  });
});

describe("collectProcessedFish", () => {
  it("throws when the building is not a food processing building", () => {
    expect(() =>
      collectProcessedResource({
        state: SPRING_STATE,
        action: {
          type: "processedResource.collected",
          buildingId: "123",
          buildingName: "Fire Pit" as ProcessingBuildingName,
        },
        createdAt,
      }),
    ).toThrow("Invalid resource processing building");
  });

  it("collects all ready processed fish", () => {
    const readyAt = createdAt - 1000;
    const state: GameState = {
      ...SPRING_STATE,
      vip: {
        bundles: [{ name: "1_MONTH", boughtAt: Date.now() }],
        expiresAt: Date.now() + 31 * 24 * 60 * 60 * 1000,
      },
      buildings: {
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
    });

    expect(updated.inventory["Fish Flake"]).toEqual(new Decimal(1));
    const processing = updated.buildings["Fish Market"]?.[0].processing ?? [];
    expect(processing).toHaveLength(0);
  });
});
