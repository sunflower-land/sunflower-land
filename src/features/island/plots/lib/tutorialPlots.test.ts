import { INITIAL_FARM } from "features/game/lib/constants";
import type { CropPlot, GameState } from "features/game/types/game";
import {
  getSnakeOrder,
  getTotalCropsHarvested,
  getTutorialHarvestPlot,
  getTutorialPlantPlot,
  isTutorialHarvestPhase,
  isTutorialPlantPhase,
  TUTORIAL_PLOT_COUNT,
} from "./tutorialPlots";
import Decimal from "decimal.js-light";

const now = Date.now();

const readySunflower = (x: number, y: number): CropPlot => ({
  createdAt: now,
  x,
  y,
  crop: { name: "Sunflower", plantedAt: 0 },
});

const emptyPlot = (x: number, y: number): CropPlot => ({
  createdAt: now,
  x,
  y,
});

/**
 * The first expansion's 3 x 3 grid, offset the way revealLand offsets it.
 * Ids are deliberately shuffled strings: real plot ids are random, so nothing
 * may depend on their order.
 *
 *   tl tm tr      y = 7
 *   ml mm mr      y = 6
 *   bl bm br      y = 5
 */
const GRID: Record<string, [number, number]> = {
  mm: [0, 6],
  br: [1, 5],
  tl: [-1, 7],
  ml: [-1, 6],
  tr: [1, 7],
  bm: [0, 5],
  tm: [0, 7],
  mr: [1, 6],
  bl: [-1, 5],
};

const SNAKE = ["br", "bm", "bl", "ml", "mm", "mr", "tr", "tm", "tl"];

const makeGame = (
  harvested: string[] = [],
  overrides: Partial<GameState> = {},
): GameState => ({
  ...INITIAL_FARM,
  island: { type: "basic" },
  crops: Object.fromEntries(
    Object.entries(GRID).map(([id, [x, y]]) => [
      id,
      harvested.includes(id) ? emptyPlot(x, y) : readySunflower(x, y),
    ]),
  ),
  farmActivity: harvested.length
    ? { "Sunflower Harvested": harvested.length }
    : {},
  ...overrides,
});

describe("getSnakeOrder", () => {
  it("walks the bottom row right to left, then snakes back along each row above", () => {
    expect(getSnakeOrder(makeGame().crops)).toEqual(SNAKE);
  });

  it("ignores plots that are not placed", () => {
    const game = makeGame();
    const crops = {
      ...game.crops,
      lifted: { createdAt: now, crop: { name: "Sunflower", plantedAt: 0 } },
    } as GameState["crops"];

    expect(getSnakeOrder(crops)).toEqual(SNAKE);
  });
});

describe("getTotalCropsHarvested", () => {
  it("sums harvests across every crop", () => {
    expect(
      getTotalCropsHarvested({
        ...INITIAL_FARM,
        farmActivity: { "Sunflower Harvested": 4, "Rhubarb Harvested": 2 },
      }),
    ).toBe(6);
  });
});

/**
 * The first plots as revealLand leaves them - empty - with the given plots
 * planted (and ready) and the rest still waiting for a seed.
 */
const makePlantingGame = (
  planted: string[] = [],
  seeds = TUTORIAL_PLOT_COUNT + 1 - planted.length,
): GameState => ({
  ...INITIAL_FARM,
  island: { type: "basic" },
  crops: Object.fromEntries(
    Object.entries(GRID).map(([id, [x, y]]) => [
      id,
      planted.includes(id) ? readySunflower(x, y) : emptyPlot(x, y),
    ]),
  ),
  inventory: {
    ...INITIAL_FARM.inventory,
    "Sunflower Seed": new Decimal(seeds),
  },
  farmActivity: planted.length ? { "Sunflower Planted": planted.length } : {},
});

describe("isTutorialPlantPhase", () => {
  it("is active while the first plots are planted from the free seeds", () => {
    expect(isTutorialPlantPhase(makePlantingGame())).toBe(true);
  });

  it("ends once the first field is planted, even with a seed to spare", () => {
    expect(isTutorialPlantPhase(makePlantingGame(SNAKE))).toBe(false);
  });

  it("needs seeds in hand", () => {
    expect(isTutorialPlantPhase(makePlantingGame([], 0))).toBe(false);
  });

  it("needs an empty plot, so preloaded crops stay on the harvest walk", () => {
    const game = makeGame([], {
      inventory: {
        ...INITIAL_FARM.inventory,
        "Sunflower Seed": new Decimal(10),
      },
    });

    expect(isTutorialPlantPhase(game)).toBe(false);
  });
});

describe("getTutorialPlantPlot", () => {
  it("starts on the bottom right plot", () => {
    expect(getTutorialPlantPlot({ game: makePlantingGame() })).toBe("br");
  });

  it("keeps walking the empty plots while the first plantings ripen", () => {
    const game = makePlantingGame(SNAKE.slice(0, 2));

    expect(getTutorialHarvestPlot({ game, now })).toBe("br");
    expect(getTutorialPlantPlot({ game })).toBe("bl");
  });
});

describe("isTutorialHarvestPhase", () => {
  it("waits for the first plots to be planted", () => {
    expect(isTutorialHarvestPhase(makePlantingGame())).toBe(false);
  });

  it("is active while the first planted Sunflowers grow", () => {
    expect(isTutorialHarvestPhase(makePlantingGame(SNAKE))).toBe(true);
  });

  it("is active while the first Sunflowers are being harvested", () => {
    expect(isTutorialHarvestPhase(makeGame(SNAKE.slice(0, 5)))).toBe(true);
  });

  it("ends with the ninth Sunflower so the first-delivery nudge can take over", () => {
    expect(isTutorialHarvestPhase(makeGame(SNAKE))).toBe(false);
  });

  it("resumes once the expansion reveals the preloaded Rhubarb", () => {
    const game = makeGame(SNAKE);
    game.crops.rhubarb1 = {
      createdAt: now,
      x: 3,
      y: 5,
      crop: { name: "Rhubarb", plantedAt: 0 },
    };

    expect(isTutorialHarvestPhase(game)).toBe(true);
  });

  it("stays off for a Bumpkin with experience", () => {
    const game = makeGame(SNAKE);
    game.crops.rhubarb1 = {
      createdAt: now,
      x: 3,
      y: 5,
      crop: { name: "Rhubarb", plantedAt: 0 },
    };
    game.bumpkin = { ...game.bumpkin, experience: 5 };

    expect(isTutorialHarvestPhase(game)).toBe(false);
  });
});

describe("getTutorialHarvestPlot", () => {
  it("starts on the bottom right plot", () => {
    expect(getTutorialHarvestPlot({ game: makeGame(), now })).toBe("br");
  });

  it("moves to the next plot in the snake as each one is harvested", () => {
    SNAKE.forEach((expected, index) => {
      const game = makeGame(SNAKE.slice(0, index));
      expect(getTutorialHarvestPlot({ game, now })).toBe(expected);
    });
  });

  it("points at the earliest ready plot when the player harvests out of order", () => {
    const game = makeGame(["br", "mm", "tl"]);
    expect(getTutorialHarvestPlot({ game, now })).toBe("bm");
  });

  it("skips plots whose crop is still growing", () => {
    const game = makeGame();
    game.crops.br = {
      ...game.crops.br,
      crop: { name: "Sunflower", plantedAt: now },
    };

    expect(getTutorialHarvestPlot({ game, now })).toBe("bm");
  });

  it("stops once the tutorial plots have all been harvested", () => {
    const game = makeGame([], {
      farmActivity: { "Sunflower Harvested": TUTORIAL_PLOT_COUNT },
    });

    expect(getTutorialHarvestPlot({ game, now })).toBeUndefined();
  });

  it("never shows off the tutorial island", () => {
    const game = makeGame([], { island: { type: "spring" } });
    expect(getTutorialHarvestPlot({ game, now })).toBeUndefined();
  });

  it("returns nothing when no crop is ready", () => {
    const game = makeGame(SNAKE.slice(0, 5));
    SNAKE.slice(5).forEach((id) => {
      game.crops[id] = emptyPlot(game.crops[id].x!, game.crops[id].y!);
    });

    expect(getTutorialHarvestPlot({ game, now })).toBeUndefined();
  });
});
