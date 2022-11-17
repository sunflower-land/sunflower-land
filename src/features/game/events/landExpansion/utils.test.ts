import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { getSupportedChickens } from "./utils";

describe("getSupportedChickens", () => {
  it("gives the correct amount of supported chicken without chicken coop", () => {
    const result = getSupportedChickens({
      ...TEST_FARM,
      inventory: {},
      buildings: {
        "Hen House": [
          {
            coordinates: {
              x: 0,
              y: 0,
            },
            createdAt: 0,
            id: "123",
            readyAt: 0,
          },
        ],
      },
    });
    expect(result).toBe(10);
  });
  it("gives the correct amount of supported chicken with chicken coop", () => {
    const result = getSupportedChickens({
      ...TEST_FARM,
      inventory: {
        "Chicken Coop": new Decimal(1),
      },
      collectibles: {
        "Chicken Coop": [
          {
            id: "123",
            createdAt: 0,
            coordinates: { x: 1, y: 1 },
            readyAt: 0,
          },
        ],
      },
      buildings: {
        "Hen House": [
          {
            coordinates: {
              x: 0,
              y: 0,
            },
            createdAt: 0,
            id: "123",
            readyAt: 0,
          },
        ],
      },
    });
    expect(result).toBe(15);
  });
});
