import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { Animal, GameState } from "features/game/types/game";
import { APPLY_MUD_ERRORS } from "./applyMud";
import { bulkApplyMud } from "./bulkApplyMud";

const pig = (id: string, overrides: Partial<Animal> = {}): Animal => ({
  id,
  type: "Pig",
  state: "idle",
  createdAt: 0,
  experience: 0,
  asleepAt: 0,
  awakeAt: 0,
  lovedAt: 0,
  item: "Petting Hand",
  ...overrides,
});

const farm = (animals: Record<string, Animal>, mud: number): GameState => ({
  ...INITIAL_FARM,
  inventory: { ...INITIAL_FARM.inventory, Mud: new Decimal(mud) },
  buildings: {
    ...INITIAL_FARM.buildings,
    Pigpen: [
      { coordinates: { x: 0, y: 0 }, createdAt: 0, id: "0", readyAt: 0 },
    ],
  },
  // Level 3 houses 9 Pigs, so none of these is over capacity.
  pigpen: { level: 3, animals },
});

const bulk = (state: GameState) =>
  bulkApplyMud({
    state,
    action: { type: "pigs.bulkMudApplied" },
    createdAt: Date.now(),
  });

describe("bulkApplyMud", () => {
  it("muds every Pig without Mud, one Mud each", () => {
    const state = bulk(farm({ a: pig("a"), b: pig("b"), c: pig("c") }, 5));

    expect(state.inventory.Mud).toEqual(new Decimal(2));
    ["a", "b", "c"].forEach((id) =>
      expect(state.pigpen.animals[id].mud).toEqual({ feedsRemaining: 3 }),
    );
  });

  it("skips Pigs that are already muddy or sick", () => {
    const state = bulk(
      farm(
        {
          a: pig("a", { mud: { feedsRemaining: 1 } }),
          b: pig("b", { state: "sick" }),
          c: pig("c"),
        },
        5,
      ),
    );

    expect(state.inventory.Mud).toEqual(new Decimal(4));
    expect(state.pigpen.animals.a.mud).toEqual({ feedsRemaining: 1 });
    expect(state.pigpen.animals.b.mud).toBeUndefined();
    expect(state.pigpen.animals.c.mud).toEqual({ feedsRemaining: 3 });
  });

  it("muds as many Pigs as the Mud covers, lowest id first", () => {
    const state = bulk(farm({ c: pig("c"), a: pig("a"), b: pig("b") }, 2));

    expect(state.inventory.Mud).toEqual(new Decimal(0));
    expect(state.pigpen.animals.a.mud).toEqual({ feedsRemaining: 3 });
    expect(state.pigpen.animals.b.mud).toEqual({ feedsRemaining: 3 });
    expect(state.pigpen.animals.c.mud).toBeUndefined();
  });

  it("skips Pigs over the pen's capacity, which cannot be fed", () => {
    // A level-1 Pigpen houses 3 Pigs, and the OLDEST beyond that is locked.
    const animals = {
      a: pig("a", { createdAt: 0 }),
      b: pig("b", { createdAt: 1 }),
      c: pig("c", { createdAt: 2 }),
      d: pig("d", { createdAt: 3 }),
    };
    const state = bulk({ ...farm(animals, 5), pigpen: { level: 1, animals } });

    expect(state.inventory.Mud).toEqual(new Decimal(2));
    expect(state.pigpen.animals.a.mud).toBeUndefined();
    expect(state.pigpen.animals.d.mud).toEqual({ feedsRemaining: 3 });
  });

  it("throws when no Pig needs Mud", () => {
    expect(() =>
      bulk(farm({ a: pig("a", { mud: { feedsRemaining: 2 } }) }, 5)),
    ).toThrow(APPLY_MUD_ERRORS.NO_PIGS);
  });

  it("throws without Mud", () => {
    expect(() => bulk(farm({ a: pig("a") }, 0))).toThrow(
      APPLY_MUD_ERRORS.NOT_ENOUGH,
    );
  });

  it("throws when the Pigpen is not placed", () => {
    expect(() =>
      bulk({
        ...farm({ a: pig("a") }, 5),
        buildings: { ...INITIAL_FARM.buildings },
      }),
    ).toThrow("Building does not exist");
  });

  describe("off testnet", () => {
    let previousNetwork: (typeof CONFIG)["NETWORK"];

    beforeEach(() => {
      previousNetwork = CONFIG.NETWORK;
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
    });

    afterEach(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = previousNetwork;
    });

    it("throws without the PIGPEN feature flag", () => {
      expect(() => bulk(farm({ a: pig("a") }, 5))).toThrow(
        APPLY_MUD_ERRORS.NO_FEATURE_ACCESS,
      );
    });
  });
});
