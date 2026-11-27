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

/**
 * The moment the first expansion reveals the tutorial island's empty plots:
 * trees chopped, nothing planted, no seeds yet.
 */
const firstPlots = ({
  planted = 0,
  seeds = 0,
  harvested = 0,
}: {
  planted?: number;
  seeds?: number;
  harvested?: number;
} = {}): GameState => {
  // Plots 0..8 along one row; the first `planted - harvested` hold a ready
  // Sunflower, the rest are empty.
  const growing = planted - harvested;

  return {
    ...INITIAL_FARM,
    island: { type: "basic" },
    crops: Object.fromEntries(
      Array.from({ length: 9 }, (_, i) => [
        `plot${i}`,
        {
          createdAt: 0,
          x: i,
          y: 5,
          ...(i < growing && {
            crop: { name: "Sunflower" as const, plantedAt: 0 },
          }),
        },
      ]),
    ),
    farmActivity: {
      "Tree Chopped": 3,
      ...(planted && { "Sunflower Planted": planted }),
      ...(harvested && { "Sunflower Harvested": harvested }),
      ...((planted || seeds) && { "Sunflower Seed Bought": 10 }),
    },
    inventory: {
      ...INITIAL_FARM.inventory,
      "Basic Land": new Decimal(4),
      "Crop Plot": new Decimal(9),
      ...(seeds && { "Sunflower Seed": new Decimal(seeds) }),
    },
    delivery: { ...INITIAL_FARM.delivery, fulfilledCount: 0 },
  };
};

describe("getTutorialNudge", () => {
  it("points at Betty's market for the free seeds once the first plots are revealed", () => {
    expect(getTutorialNudge(firstPlots())).toBe("market-seeds");
  });

  it("points at the plots once the seeds are in hand", () => {
    expect(getTutorialNudge(firstPlots({ seeds: 10 }))).toBe("plant-plot");
  });

  it("keeps pointing at the plots while the first plantings ripen", () => {
    expect(getTutorialNudge(firstPlots({ planted: 3, seeds: 7 }))).toBe(
      "plant-plot",
    );
  });

  it("points at the Workbench for the scarecrow once the first field is planted", () => {
    const game = firstPlots({ planted: 9, seeds: 1 });
    game.inventory.Wood = new Decimal(2);

    expect(getTutorialNudge(game)).toBe("workbench-scarecrow");
  });

  it("points at the trees first when the scarecrow's Wood is missing", () => {
    const game = firstPlots({ planted: 9, seeds: 1 });
    game.inventory.Wood = new Decimal(1);
    game.inventory.Axe = new Decimal(3);

    expect(getTutorialNudge(game)).toBe("chop-trees");
  });

  it("points at the Workbench for Axes when there is nothing to chop the scarecrow's Wood with", () => {
    const game = firstPlots({ planted: 9, seeds: 1 });
    delete game.inventory.Wood;
    delete game.inventory.Axe;

    expect(getTutorialNudge(game)).toBe("workbench-axes");
  });

  it("walks the harvest once the scarecrow is crafted", () => {
    const game = firstPlots({ planted: 9, seeds: 1 });
    game.inventory["Basic Scarecrow"] = new Decimal(1);

    expect(getTutorialNudge(game)).toBe("harvest-plot");
  });

  it("sends the player back to Betty if they run out of seeds part-way", () => {
    expect(getTutorialNudge(firstPlots({ planted: 4, harvested: 4 }))).toBe(
      "market-seeds",
    );
  });

  it("keeps a farm with preloaded Sunflowers on the harvest walk", () => {
    const game = firstPlots();
    Object.values(game.crops).forEach((plot) => {
      plot.crop = { name: "Sunflower", plantedAt: 0 };
    });

    expect(getTutorialNudge(game)).toBe("harvest-plot");
  });

  it("has nothing to point at before the first plots are revealed", () => {
    const game = firstPlots();
    game.crops = {};
    game.inventory["Basic Land"] = new Decimal(3);

    expect(getTutorialNudge(game)).toBeUndefined();
  });

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
