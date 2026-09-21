import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import { INITIAL_FARM } from "features/game/lib/constants";
import { MUD_FEEDS } from "features/game/lib/animals";
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
  mud = 1,
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
  it("consumes one Mud and grants three muddy feeds", () => {
    const state = apply(farm());

    expect(state.inventory.Mud).toEqual(new Decimal(0));
    expect(MUD_FEEDS).toEqual(3);
    expect(state.pigpen.animals["1"].mud).toEqual({ feedsRemaining: 3 });
  });

  it("can be applied while the Pig sleeps", () => {
    const now = Date.now();
    const state = apply(
      farm({ "1": pig("1", { asleepAt: now, awakeAt: now + 60_000 }) }),
    );

    expect(state.pigpen.animals["1"].mud).toEqual({ feedsRemaining: 3 });
  });

  it("sits alongside a spice-rack treat without touching it", () => {
    const feedBuff = { name: "Salt Lick" as const, harvestsRemaining: 2 };
    const state = apply(farm({ "1": pig("1", { feedBuff }) }));

    expect(state.pigpen.animals["1"].feedBuff).toEqual(feedBuff);
    expect(state.pigpen.animals["1"].mud).toEqual({ feedsRemaining: 3 });
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

  it("rejects a Pig that still has muddy feeds left, keeping the Mud", () => {
    expect(() =>
      apply(farm({ "1": pig("1", { mud: { feedsRemaining: 1 } }) })),
    ).toThrow(APPLY_MUD_ERRORS.ALREADY_MUDDY);
  });

  it("throws without Mud", () => {
    expect(() => apply(farm(undefined, 0))).toThrow(
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
