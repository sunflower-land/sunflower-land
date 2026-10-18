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
  it("muds every Pig without Mud, ten Mud each", () => {
    const state = bulk(farm({ a: pig("a"), b: pig("b"), c: pig("c") }, 50));

    expect(state.inventory.Mud).toEqual(new Decimal(20));
    ["a", "b", "c"].forEach((id) =>
      expect(state.pigpen.animals[id].mud).toEqual({ harvestsRemaining: 3 }),
    );
  });

  it("skips Pigs that are already muddy or sick", () => {
    const state = bulk(
      farm(
        {
          a: pig("a", { mud: { harvestsRemaining: 1 } }),
          b: pig("b", { state: "sick" }),
          c: pig("c"),
        },
        50,
      ),
    );

    expect(state.inventory.Mud).toEqual(new Decimal(40));
    expect(state.pigpen.animals.a.mud).toEqual({ harvestsRemaining: 1 });
    expect(state.pigpen.animals.b.mud).toBeUndefined();
    expect(state.pigpen.animals.c.mud).toEqual({ harvestsRemaining: 3 });
  });

  it("muds as many Pigs as the Mud covers, oldest first", () => {
    const state = bulk(
      farm(
        {
          c: pig("c", { createdAt: 3 }),
          a: pig("a", { createdAt: 1 }),
          b: pig("b", { createdAt: 2 }),
        },
        29,
      ),
    );

    expect(state.inventory.Mud).toEqual(new Decimal(9));
    expect(state.pigpen.animals.a.mud).toEqual({ harvestsRemaining: 3 });
    expect(state.pigpen.animals.b.mud).toEqual({ harvestsRemaining: 3 });
    expect(state.pigpen.animals.c.mud).toBeUndefined();
  });

  it("muds the oldest Pigs first, whatever their ids look like", () => {
    // Starter Pigs carry index ids ("0".."2"); bought ones carry uuid
    // prefixes — so the order follows `createdAt`, not the id string.
    const state = bulk(
      farm(
        {
          "2": pig("2", { createdAt: 300 }),
          "10": pig("10", { createdAt: 100 }),
          a1b2c3d4: pig("a1b2c3d4", { createdAt: 200 }),
        },
        29,
      ),
    );

    expect(state.inventory.Mud).toEqual(new Decimal(9));
    expect(state.pigpen.animals["10"].mud).toEqual({ harvestsRemaining: 3 });
    expect(state.pigpen.animals.a1b2c3d4.mud).toEqual({ harvestsRemaining: 3 });
    expect(state.pigpen.animals["2"].mud).toBeUndefined();
  });

  it("muds Pigs over the pen's capacity too, like a treat", () => {
    // A level-1 Pigpen houses 3 Pigs, and the OLDEST beyond that is locked.
    const animals = {
      a: pig("a", { createdAt: 0 }),
      b: pig("b", { createdAt: 1 }),
      c: pig("c", { createdAt: 2 }),
      d: pig("d", { createdAt: 3 }),
    };
    const state = bulk({ ...farm(animals, 50), pigpen: { level: 1, animals } });

    expect(state.inventory.Mud).toEqual(new Decimal(10));
    expect(state.pigpen.animals.a.mud).toEqual({ harvestsRemaining: 3 });
  });

  it("skips an asleep Pig that needs love first", () => {
    const now = Date.now();
    const asleepAt = now - 2_000_000;
    const state = bulk(
      farm(
        {
          a: pig("a", {
            asleepAt,
            awakeAt: now + 1_600_000,
            lovedAt: asleepAt,
          }),
          b: pig("b"),
        },
        50,
      ),
    );

    expect(state.pigpen.animals.a.mud).toBeUndefined();
    expect(state.pigpen.animals.b.mud).toEqual({ harvestsRemaining: 3 });
  });

  it("throws when no Pig needs Mud", () => {
    expect(() =>
      bulk(farm({ a: pig("a", { mud: { harvestsRemaining: 2 } }) }, 50)),
    ).toThrow(APPLY_MUD_ERRORS.NO_PIGS);
  });

  it("throws with less than one application of Mud", () => {
    expect(() => bulk(farm({ a: pig("a") }, 9))).toThrow(
      APPLY_MUD_ERRORS.NOT_ENOUGH,
    );
  });

  it("throws without Mud", () => {
    expect(() => bulk(farm({ a: pig("a") }, 0))).toThrow(
      APPLY_MUD_ERRORS.NOT_ENOUGH,
    );
  });

  it("throws when the Pigpen is not placed", () => {
    expect(() =>
      bulk({
        ...farm({ a: pig("a") }, 50),
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
      expect(() => bulk(farm({ a: pig("a") }, 50))).toThrow(
        APPLY_MUD_ERRORS.NO_FEATURE_ACCESS,
      );
    });
  });
});
