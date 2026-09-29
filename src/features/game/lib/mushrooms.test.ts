import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import type { Bud } from "features/game/types/buds";
import { getMushroomYield } from "./mushrooms";

const BASE = TEST_FARM;

const PLACED = [
  { id: "1", createdAt: 0, coordinates: { x: 0, y: 0 }, readyAt: 0 },
];

const bud = (overrides: Partial<Bud> = {}): Bud => ({
  type: "Plaza",
  colour: "Blue",
  ears: "No Ears",
  aura: "No Aura",
  stem: "Mushroom",
  coordinates: { x: 0, y: 0 },
  ...overrides,
});

const farm = ({
  collectibles = {},
  hat = false,
  buds = {},
}: {
  collectibles?: GameState["collectibles"];
  hat?: boolean;
  buds?: GameState["buds"];
} = {}): GameState => ({
  ...BASE,
  collectibles,
  buds,
  bumpkin: {
    ...BASE.bumpkin,
    equipped: {
      ...BASE.bumpkin.equipped,
      ...(hat ? { hat: "Mushroom Hat" as const } : {}),
    },
  },
});

describe("getMushroomYield", () => {
  it("is 1 without boosts", () => {
    expect(
      getMushroomYield({ name: "Wild Mushroom", game: farm() }).amount,
    ).toBe(1);
  });

  it.each([
    ["Mushroom House", 1.2],
    ["Fairy Circle", 1.2],
  ] as const)("adds a placed %s's bonus to Wild Mushrooms", (name, amount) => {
    expect(
      getMushroomYield({
        name: "Wild Mushroom",
        game: farm({ collectibles: { [name]: PLACED } }),
      }).amount,
    ).toBe(amount);
  });

  it("adds the Mushroom Hat's bonus to Wild Mushrooms", () => {
    expect(
      getMushroomYield({ name: "Wild Mushroom", game: farm({ hat: true }) })
        .amount,
    ).toBe(1.1);
  });

  it("adds the best placed Bud's bonus", () => {
    expect(
      getMushroomYield({
        name: "Wild Mushroom",
        game: farm({ buds: { 1: bud() } }),
      }).amount,
    ).toBe(1.3);
  });

  it("adds boosts exactly, without float drift", () => {
    // Plain float addition gives 1.4000000000000001 and 1.7149999999999999.
    expect(
      getMushroomYield({
        name: "Wild Mushroom",
        game: farm({ hat: true, buds: { 1: bud() } }),
      }).amount,
    ).toBe(1.4);
    expect(
      getMushroomYield({
        name: "Wild Mushroom",
        game: farm({
          collectibles: { "Mushroom House": PLACED, "Fairy Circle": PLACED },
          buds: { 1: bud({ aura: "Basic" }) },
        }),
      }).amount,
    ).toBe(1.715);
  });

  it("only applies Bud boosts to Magic Mushrooms", () => {
    const game = farm({
      collectibles: { "Mushroom House": PLACED, "Fairy Circle": PLACED },
      hat: true,
    });
    expect(getMushroomYield({ name: "Magic Mushroom", game }).amount).toBe(1);
    expect(
      getMushroomYield({
        name: "Magic Mushroom",
        game: { ...game, buds: { 1: bud({ stem: "Magic Mushroom" }) } },
      }).amount,
    ).toBe(1.2);
  });
});
