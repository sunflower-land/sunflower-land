import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { isPetExcludedByMissingPetHouse } from "./petShared";

describe("isPetExcludedByMissingPetHouse", () => {
  it("excludes a pet only placed in the pet house when the Pet House building is not placed", () => {
    const game: GameState = {
      ...TEST_FARM,
      inventory: {
        Barkley: new Decimal(1),
      },
      petHouse: {
        level: 1,
        pets: {
          Barkley: [{ id: "1", createdAt: 0, coordinates: { x: 0, y: 0 } }],
        },
      },
    };

    expect(isPetExcludedByMissingPetHouse({ pet: "Barkley", game })).toBe(true);
  });

  it("does not exclude a pet that is also placed in the interior", () => {
    const game: GameState = {
      ...TEST_FARM,
      inventory: {
        Barkley: new Decimal(2),
      },
      petHouse: {
        level: 1,
        pets: {
          Barkley: [{ id: "1", createdAt: 0, coordinates: { x: 0, y: 0 } }],
        },
      },
      interior: {
        ground: {
          collectibles: {
            Barkley: [
              {
                id: "2",
                createdAt: 0,
                readyAt: 0,
                coordinates: { x: 1, y: 1 },
              },
            ],
          },
        },
      },
    };

    expect(isPetExcludedByMissingPetHouse({ pet: "Barkley", game })).toBe(
      false,
    );
  });
});
