import { INITIAL_FARM } from "features/game/lib/constants";
import type { CropPlot, GameState } from "features/game/types/game";
import {
  getSnakeOrder,
  getTotalCropsHarvested,
  getTutorialHarvestPlot,
  TUTORIAL_PLOT_COUNT,
} from "./tutorialPlots";

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
