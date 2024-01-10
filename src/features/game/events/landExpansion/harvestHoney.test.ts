import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { HARVEST_HONEY_ERRORS, harvestHoney } from "./harvestHoney";

describe("harvestHoney", () => {
  it("throws an error if the beehive doesn't exist", () => {
    expect(() =>
      harvestHoney({
        state: {
          ...TEST_FARM,
          inventory: {
            Beehive: new Decimal(0),
          },
        },
        action: {
          id: "1234",
          type: "honey.harvested",
        },
      })
    ).toThrow(HARVEST_HONEY_ERRORS.NO_BEEHIVE);
  });

  it("does not harvest honey from a beehive that is not ready", () => {
    expect(() =>
      harvestHoney({
        state: {
          ...TEST_FARM,
          beehives: {
            "1234": {
              coordinates: {
                x: 2,
                y: 2,
              },
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
          type: "honey.harvested",
        },
      })
    ).toThrow(HARVEST_HONEY_ERRORS.NOT_READY);
  });
});
