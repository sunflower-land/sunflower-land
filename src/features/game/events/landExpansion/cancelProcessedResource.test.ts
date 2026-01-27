import Decimal from "decimal.js-light";

import { INITIAL_BUMPKIN, INITIAL_FARM } from "features/game/lib/constants";
import { GameState, PlacedItem } from "features/game/types/game";
import { FISH_PROCESSING_TIME_SECONDS } from "features/game/types/fishProcessing";
import { ProcessingBuildingName } from "features/game/types/buildings";
import {
  cancelProcessedResource,
  CancelProcessedResourceAction,
} from "./cancelProcessedResource";
import { ProcessedResource } from "features/game/types/processedFood";

const createdAt = Date.now();
const DURATION = (name: ProcessedResource) =>
  FISH_PROCESSING_TIME_SECONDS[name] * 1000;

const BASE_STATE: GameState = {
  ...INITIAL_FARM,
  bumpkin: INITIAL_BUMPKIN,
  buildings: {
    "Fish Market": [
      {
        id: "123",
        coordinates: { x: 0, y: 0 },
        createdAt,
        processing: [],
      },
    ],
  },
  inventory: {
    Anchovy: new Decimal(10),
    Porgy: new Decimal(5),
  },
};

describe("cancelProcessedResource", () => {
  it("throws when the building is not a resource processing building", () => {
    expect(() =>
      cancelProcessedResource({
        state: BASE_STATE,
        action: {
          type: "processedResource.cancelled",
          buildingId: "123",
          buildingName: "Fire Pit" as ProcessingBuildingName,
          queueItem: {
            name: "Fish Flake",
            readyAt: createdAt + DURATION("Fish Flake"),
          },
        } as CancelProcessedResourceAction,
        createdAt,
      }),
    ).toThrow("Invalid resource processing building");
  });

  it("throws when building is missing", () => {
    expect(() =>
      cancelProcessedResource({
        state: { ...BASE_STATE, buildings: {} },
        action: {
          type: "processedResource.cancelled",
          buildingId: "missing",
          buildingName: "Fish Market",
          queueItem: {
            name: "Fish Flake",
            readyAt: createdAt + DURATION("Fish Flake"),
          },
        } as CancelProcessedResourceAction,
        createdAt,
      }),
    ).toThrow("Required building does not exist");
  });

  it("throws when queue is empty", () => {
    expect(() =>
      cancelProcessedResource({
        state: BASE_STATE,
        action: {
          type: "processedResource.cancelled",
          buildingId: "123",
          buildingName: "Fish Market",
          queueItem: {
            name: "Fish Flake",
            readyAt: createdAt + DURATION("Fish Flake"),
          },
        } as CancelProcessedResourceAction,
        createdAt,
      }),
    ).toThrow("No queue exists");
  });

  it("throws when the processed item does not exist", () => {
    const state: GameState = {
      ...BASE_STATE,
      buildings: {
        "Fish Market": [
          {
            ...(BASE_STATE.buildings["Fish Market"]?.[0] as PlacedItem),
            processing: [
              {
                name: "Fish Flake",
                readyAt: createdAt + DURATION("Fish Flake"),
                startedAt: createdAt,
                requirements: { Anchovy: new Decimal(2) },
              },
            ],
          },
        ],
      },
    };

    expect(() =>
      cancelProcessedResource({
        state,
        action: {
          type: "processedResource.cancelled",
          buildingId: "123",
          buildingName: "Fish Market",
          queueItem: {
            name: "Fish Stick",
            readyAt: createdAt + 2 * DURATION("Fish Flake"),
          },
        } as CancelProcessedResourceAction,
        createdAt,
      }),
    ).toThrow("Product does not exist");
  });

  it("throws when attempting to cancel the active processed item", () => {
    const readyAt = createdAt + DURATION("Fish Flake");
    const state: GameState = {
      ...BASE_STATE,
      buildings: {
        "Fish Market": [
          {
            ...(BASE_STATE.buildings["Fish Market"]?.[0] as PlacedItem),
            processing: [
              {
                name: "Fish Flake",
                readyAt,
                startedAt: createdAt,
                requirements: { Anchovy: new Decimal(2) },
              },
              {
                name: "Fish Stick",
                readyAt,
                startedAt: readyAt,
                requirements: { Anchovy: new Decimal(3) },
              },
            ],
          },
        ],
      },
    };

    expect(() =>
      cancelProcessedResource({
        state,
        action: {
          type: "processedResource.cancelled",
          buildingId: "123",
          buildingName: "Fish Market",
          queueItem: {
            name: "Fish Flake",
            readyAt,
          },
        } as CancelProcessedResourceAction,
        createdAt,
      }),
    ).toThrow(
      `Processed item Fish Flake with readyAt ${readyAt} is currently being processed`,
    );
  });

  it("refunds requirements and recalculates ready times for remaining items", () => {
    const firstReady = createdAt + DURATION("Fish Flake");
    const secondReady = firstReady + DURATION("Fish Stick");
    const thirdReady = secondReady + DURATION("Fish Oil");

    const state: GameState = {
      ...BASE_STATE,
      buildings: {
        "Fish Market": [
          {
            ...(BASE_STATE.buildings["Fish Market"]?.[0] as PlacedItem),
            processing: [
              {
                name: "Fish Flake",
                readyAt: firstReady,
                startedAt: createdAt,
                requirements: { Anchovy: new Decimal(2) },
              },
              {
                name: "Fish Stick",
                readyAt: secondReady,
                startedAt: firstReady,
                requirements: {
                  Anchovy: new Decimal(3),
                  Porgy: new Decimal(1),
                },
              },
              {
                name: "Fish Oil",
                readyAt: thirdReady,
                startedAt: secondReady,
                requirements: { Anchovy: new Decimal(4) },
              },
            ],
          },
        ],
      },
    };

    const updated = cancelProcessedResource({
      state,
      action: {
        type: "processedResource.cancelled",
        buildingId: "123",
        buildingName: "Fish Market",
        queueItem: {
          name: "Fish Stick",
          readyAt: secondReady,
          startedAt: firstReady,
        },
      },
      createdAt,
    });

    // Requirements refunded
    expect(updated.inventory.Anchovy).toEqual(
      BASE_STATE.inventory.Anchovy?.add(new Decimal(3)),
    );
    expect(updated.inventory.Porgy).toEqual(
      BASE_STATE.inventory.Porgy?.add(new Decimal(1)),
    );

    const processing = updated.buildings["Fish Market"]?.[0].processing ?? [];
    expect(processing).toHaveLength(2);

    // Active item unchanged
    expect(processing[0]).toMatchObject({
      name: "Fish Flake",
      readyAt: firstReady,
      startedAt: createdAt,
    });

    // Remaining item pulled forward
    expect(processing[1]).toMatchObject({
      name: "Fish Oil",
      startedAt: firstReady,
      readyAt: firstReady + DURATION("Fish Oil"),
    });
  });
});
