import Decimal from "decimal.js-light";

import { INITIAL_BUMPKIN, INITIAL_FARM } from "features/game/lib/constants";
import type { Buildings, GameState } from "features/game/types/game";
import { cancelProcessedResource } from "features/game/events/landExpansion/cancelProcessedResource";
import { makeBuildings } from "./transforms";

const now = Date.now();

// The Fish Market queue exactly as the API returns it: requirements that were
// persisted as raw decimal.js-light internals rather than as amounts.
const apiBuildings = (requirements: unknown) =>
  JSON.parse(
    JSON.stringify({
      "Fish Market": [
        {
          id: "fm",
          createdAt: 0,
          readyAt: 0,
          coordinates: { x: 0, y: 0 },
          processing: [
            {
              name: "Fish Oil",
              startedAt: now - 1000,
              readyAt: now + 1000,
              requirements,
            },
            {
              name: "Fish Oil",
              startedAt: now + 1000,
              readyAt: now + 2000,
              requirements,
            },
          ],
        },
      ],
    }),
  ) as Buildings;

describe("makeBuildings", () => {
  it("rehydrates requirements persisted as raw Decimal internals", () => {
    const buildings = makeBuildings(
      apiBuildings({
        Tuna: { s: 1, e: 0, d: [8] },
        "Blue Marlin": { s: 1, e: 1, d: [1, 2345678] },
      }),
    );

    const requirements =
      buildings["Fish Market"]?.[0].processing?.[0].requirements;
    expect(requirements?.Tuna).toBeInstanceOf(Decimal);
    expect(requirements?.Tuna?.toString()).toEqual("8");
    expect(requirements?.["Blue Marlin"]?.toString()).toEqual("12345678");
  });

  it("rehydrates requirements serialised as strings", () => {
    const buildings = makeBuildings(apiBuildings({ Tuna: "8" }));

    const requirements =
      buildings["Fish Market"]?.[0].processing?.[0].requirements;
    expect(requirements?.Tuna).toBeInstanceOf(Decimal);
    expect(requirements?.Tuna?.toString()).toEqual("8");
  });

  it("lets a queued item loaded from the API be cancelled and refunded", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      bumpkin: INITIAL_BUMPKIN,
      inventory: { Tuna: new Decimal(1) },
      buildings: makeBuildings(apiBuildings({ Tuna: { s: 1, e: 0, d: [8] } })),
    };

    const updated = cancelProcessedResource({
      state,
      action: {
        type: "processedResource.cancelled",
        buildingName: "Fish Market",
        buildingId: "fm",
        queueItem: { name: "Fish Oil", readyAt: now + 2000 },
      },
      createdAt: now,
    });

    expect(updated.inventory.Tuna).toEqual(new Decimal(9));
    expect(updated.buildings["Fish Market"]?.[0].processing).toHaveLength(1);
  });
});
