import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { HARVEST_BEEHIVE_ERRORS, harvestBeehive } from "./harvestBeehive";

describe("harvestBeehive", () => {
  it("throws an error if the beehive doesn't exist", () => {
    expect(() =>
      harvestBeehive({
        state: {
          ...TEST_FARM,
          inventory: {
            Beehive: new Decimal(0),
          },
        },
        action: {
          id: "1234",
          type: "beehive.harvested",
        },
      })
    ).toThrow(HARVEST_BEEHIVE_ERRORS.NO_BEEHIVE);
  });

  it("does not harvest honey from a beehive that is not ready", () => {
    expect(() =>
      harvestBeehive({
        state: {
          ...TEST_FARM,
          beehives: {
            "1234": {
              x: 2,
              y: 2,
              height: 1,
              width: 1,
              lastRecordedHoneyLevel: 0,
              flower: {
                id: "234",
                attachedAt: Date.now() - 10 * 60 * 60 * 1000, // 10 hours ago
                readyAt: Date.now() + 14 * 60 * 60 * 1000, // 14 hours from now
              },
              id: "1234",
            },
          },
        },
        action: {
          id: "1234",
          type: "beehive.harvested",
        },
      })
    ).toThrow(HARVEST_BEEHIVE_ERRORS.NOT_READY);
  });
});
