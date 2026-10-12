import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import { INITIAL_FARM } from "features/game/lib/constants";
import { MUD_PER_APPLICATION } from "features/game/lib/animals";
import type { Animal, GameState } from "features/game/types/game";
import { applyMud, APPLY_MUD_ERRORS } from "./applyMud";

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

const farm = (
  animals: Record<string, Animal> = { "1": pig("1") },
  mud = 10,
): GameState => ({
  ...INITIAL_FARM,
  inventory: { ...INITIAL_FARM.inventory, Mud: new Decimal(mud) },
  buildings: {
    ...INITIAL_FARM.buildings,
    Pigpen: [
      { coordinates: { x: 0, y: 0 }, createdAt: 0, id: "0", readyAt: 0 },
    ],
  },
  pigpen: { level: 1, animals },
});

const apply = (state: GameState, id = "1") =>
  applyMud({
    state,
    action: { type: "animal.mudApplied", id },
    createdAt: Date.now(),
  });

describe("applyMud", () => {
  it("consumes ten Mud and grants three muddy harvests, like a treat", () => {
    const state = apply(farm(undefined, 12));

    expect(MUD_PER_APPLICATION).toEqual(10);
    expect(state.inventory.Mud).toEqual(new Decimal(2));
    expect(state.pigpen.animals["1"].mud).toEqual({ harvestsRemaining: 3 });
  });

  it("can be applied while the Pig sleeps", () => {
    const now = Date.now();
    const state = apply(
      farm({ "1": pig("1", { asleepAt: now, awakeAt: now + 60_000 }) }),
    );

    expect(state.pigpen.animals["1"].mud).toEqual({ harvestsRemaining: 3 });
  });

  it("sits alongside a spice-rack treat without touching it", () => {
    const feedBuff = { name: "Salt Lick" as const, harvestsRemaining: 2 };
    const state = apply(farm({ "1": pig("1", { feedBuff }) }));

    expect(state.pigpen.animals["1"].feedBuff).toEqual(feedBuff);
    expect(state.pigpen.animals["1"].mud).toEqual({ harvestsRemaining: 3 });
  });

  it("throws when the Pigpen is not placed", () => {
    expect(() =>
      apply({ ...farm(), buildings: { ...INITIAL_FARM.buildings } }),
    ).toThrow("Building does not exist");
  });

  it("throws when the Pig does not exist", () => {
    expect(() => apply(farm(), "missing")).toThrow("not found");
  });

  it("throws for a sick Pig", () => {
    expect(() => apply(farm({ "1": pig("1", { state: "sick" }) }))).toThrow(
      APPLY_MUD_ERRORS.SICK,
    );
  });

  it("rejects a Pig that still has Mud charges left, keeping the Mud", () => {
    expect(() =>
      apply(farm({ "1": pig("1", { mud: { harvestsRemaining: 1 } }) })),
    ).toThrow(APPLY_MUD_ERRORS.ALREADY_MUDDY);
  });

  it("muds a Pig over the pen's capacity, like a treat", () => {
    // A level-1 Pigpen houses 3 Pigs; the oldest beyond that is locked.
    const animals = {
      a: pig("a", { createdAt: 0 }),
      b: pig("b", { createdAt: 1 }),
      c: pig("c", { createdAt: 2 }),
      d: pig("d", { createdAt: 3 }),
    };

    expect(apply(farm(animals), "a").pigpen.animals.a.mud).toEqual({
      harvestsRemaining: 3,
    });
  });

  it("doubles the charges to 6 with a placed Vibraphone", () => {
    const state = apply({
      ...farm(),
      collectibles: {
        Vibraphone: [{ id: "1", createdAt: 0, coordinates: { x: 0, y: 0 } }],
      },
    });

    expect(state.pigpen.animals["1"].mud).toEqual({ harvestsRemaining: 6 });
    expect(state.boostsUsedAt?.Vibraphone).toBeDefined();
  });

  it("rejects an asleep Pig that needs love first, like a treat", () => {
    const asleepAt = 1_000;
    const awakeAt = asleepAt + 3_600_000;

    expect(() =>
      applyMud({
        state: farm({ "1": pig("1", { asleepAt, awakeAt, lovedAt: 1_000 }) }),
        action: { type: "animal.mudApplied", id: "1" },
        createdAt: 2_000_000,
      }),
    ).toThrow(APPLY_MUD_ERRORS.NEEDS_LOVE);
  });

  it("re-coats a Pig whose Mud was stored the old per-feed way", () => {
    const old = { feedsRemaining: 3 } as unknown as Animal["mud"];

    expect(
      apply(farm({ "1": pig("1", { mud: old }) })).pigpen.animals["1"].mud,
    ).toEqual({ harvestsRemaining: 3 });
  });

  it("throws without Mud", () => {
    expect(() => apply(farm(undefined, 0))).toThrow(
      APPLY_MUD_ERRORS.NOT_ENOUGH,
    );
  });

  it("throws with less than one application of Mud", () => {
    expect(() => apply(farm(undefined, 9))).toThrow(
      APPLY_MUD_ERRORS.NOT_ENOUGH,
    );
  });

  describe("off testnet", () => {
    // jest runs on amoy, so the flag-off path is only reachable by pretending
    // to be mainnet.
    let previousNetwork: (typeof CONFIG)["NETWORK"];

    beforeEach(() => {
      previousNetwork = CONFIG.NETWORK;
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
    });

    afterEach(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = previousNetwork;
    });

    it("throws without the PIGPEN feature flag", () => {
      expect(() => apply(farm())).toThrow(APPLY_MUD_ERRORS.NO_FEATURE_ACCESS);
    });
  });
});
