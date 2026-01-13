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
    });

    expect(updated.inventory["Fish Flake"]).toEqual(new Decimal(1));
    const processing = updated.buildings["Fish Market"]?.[0].processing ?? [];
    expect(processing).toHaveLength(0);
  });
});
