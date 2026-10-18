import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { getTutorialNudge } from "./tutorialNudge";

/**
 * The moment the tutorial island's ninth Sunflower is harvested: trees
 * chopped, first expansion done, nothing delivered yet.
 */
const sunflowersHarvested = (
  overrides: Partial<GameState> = {},
): GameState => ({
  ...INITIAL_FARM,
  island: { type: "basic" },
  crops: {},
  farmActivity: {
    "Tree Chopped": 3,
    "Sunflower Harvested": 9,
  },
  inventory: {
    ...INITIAL_FARM.inventory,
    "Basic Land": new Decimal(4),
  },
  delivery: { ...INITIAL_FARM.delivery, fulfilledCount: 0 },
  ...overrides,
});

const delivered = (overrides: Partial<GameState> = {}): GameState =>
  sunflowersHarvested({
    delivery: { ...INITIAL_FARM.delivery, fulfilledCount: 1 },
    ...overrides,
  });

describe("getTutorialNudge", () => {
  it("hands the pointer to the travel button once the Sunflowers are in", () => {
    expect(getTutorialNudge(sunflowersHarvested())).toBe(
      "travel-first-delivery",
    );
  });

  it("points at the trees after the delivery when the expansion's Wood is missing", () => {
    const game = delivered();
    game.inventory.Axe = new Decimal(3);

    expect(getTutorialNudge(game)).toBe("chop-trees");
  });

  it("points at the Workbench instead when there is no Axe to chop with", () => {
    const game = delivered();
    delete game.inventory.Axe;

    expect(getTutorialNudge(game)).toBe("workbench-axes");
  });

  it("points at the expansion once the Wood is gathered", () => {
    const game = delivered();
    game.inventory.Wood = new Decimal(5);

    expect(getTutorialNudge(game)).toBe("expand-land");
  });

  it("drops the expansion pointer while the land is under construction", () => {
    const game = delivered({
      expansionConstruction: { createdAt: 1, readyAt: 1 },
    });
    game.inventory.Wood = new Decimal(5);

    expect(getTutorialNudge(game)).toBeUndefined();
  });

  it("resumes the harvest walk once the expansion reveals the Rhubarb", () => {
    const game = delivered();
    game.inventory["Basic Land"] = new Decimal(5);
    game.crops = {
      "1": {
        createdAt: 0,
        x: 3,
        y: 5,
        crop: { name: "Rhubarb", plantedAt: 0 },
      },
    };

    expect(getTutorialNudge(game)).toBe("harvest-plot");
  });
});
