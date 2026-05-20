import { TEST_FARM } from "features/game/lib/constants";
import { getPetLevel } from "features/game/types/pets";

import { getTradeableDisplay } from "./tradeables";

const makePet = (experience: number) => ({
  id: 1307,
  name: "Pet #1307" as const,
  energy: 0,
  experience,
  pettedAt: 0,
  requests: {
    food: [],
    fedAt: 0,
  },
});

describe("getTradeableDisplay", () => {
  it("uses owned pet experience when pet marketplace display has no explicit experience", () => {
    const experience = 13_600;
    const display = getTradeableDisplay({
      id: 1307,
      type: "pets",
      state: {
        ...TEST_FARM,
        pets: {
          ...TEST_FARM.pets,
          nfts: {
            1307: makePet(experience),
          },
        },
      },
    });

    expect(display.experience).toBe(experience);
    expect(getPetLevel(display.experience ?? 0).level).toBe(
      getPetLevel(experience).level,
    );
  });

  it("prefers explicit marketplace pet experience over owned pet experience", () => {
    const display = getTradeableDisplay({
      id: 1307,
      type: "pets",
      experience: 0,
      state: {
        ...TEST_FARM,
        pets: {
          ...TEST_FARM.pets,
          nfts: {
            1307: makePet(13_600),
          },
        },
      },
    });

    expect(display.experience).toBe(0);
  });
});
