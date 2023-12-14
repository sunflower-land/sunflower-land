import { expansionRequirements } from "./revealLand";
import { TEST_FARM } from "features/game/lib/constants";

describe("expansionRequirements", () => {
  it("returns normal expansion requirements", () => {
    const requirements = expansionRequirements({ level: 6, game: TEST_FARM });

    expect(requirements.resources).toEqual({
      Stone: 3,
      Wood: 5,
    });
  });
  it("returns discounted expansion requirements with Grinx Hammer", () => {
    const requirements = expansionRequirements({
      game: {
        ...TEST_FARM,
        collectibles: {
          "Grinx's Hammer": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: Date.now(),
              id: "123",
              readyAt: Date.now(),
            },
          ],
        },
      },
      level: 6,
    });

    expect(requirements.resources).toEqual({
      Stone: 1.5,
      Wood: 2.5,
    });
  });
});
