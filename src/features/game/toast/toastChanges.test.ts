import Decimal from "decimal.js-light";
import { getKeys } from "lib/object";
import { INITIAL_FARM } from "../lib/constants";
import { KNOWN_IDS } from "../types";
import { ITEM_IDS } from "../types/bumpkin";
import type { GameState } from "../types/game";
import {
  addToasts,
  getToastChanges,
  getToastState,
  removeToasts,
  type Toast,
  type ToastChange,
  type ToastState,
} from "./toastChanges";

/**
 * Writes toasts the way the panel shows them, e.g. "Wood +3".
 */
const display = (toasts: ToastChange[]) =>
  toasts.map(
    ({ item, difference }) =>
      `${item} ${difference.greaterThan(0) ? "+" : ""}${difference.toString()}`,
  );

const toast = (item: Toast["item"], difference: number, id: string): Toast => ({
  item,
  difference: new Decimal(difference),
  id,
});

const STATE: ToastState = {
  inventory: { Wood: new Decimal(20), "Sunflower Seed": new Decimal(5) },
  balance: new Decimal(10),
  coins: 100,
  experience: 50,
  factionPoints: 0,
  wardrobe: { "Farmer Pants": 1 },
  buds: {},
  petNFTs: {},
};

/**
 * Plays a session the way the toast provider does: each state is one player
 * action, and `expire` is the hide timer of an earlier action going off.
 */
const playSession = (initial: ToastState) => {
  let previous = initial;
  let toasts: Toast[] = [];
  let actions = 0;

  return {
    act: (next: ToastState) => {
      const action = ++actions;
      const incoming = getToastChanges(previous, next).map((change) => ({
        ...change,
        id: `${action}-${change.item}`,
      }));
      previous = next;
      toasts = addToasts(toasts, incoming);

      return {
        shows: display(toasts),
        expire: () => {
          toasts = removeToasts(
            toasts,
            incoming.map(({ id }) => id),
          );
          return display(toasts);
        },
      };
    },
  };
};

describe("getToastChanges", () => {
  describe("inventory", () => {
    it("returns nothing when nothing changed", () => {
      expect(getToastChanges(STATE, STATE)).toEqual([]);
    });

    it("returns nothing when the inventory is a new object with the same amounts", () => {
      const next = {
        ...STATE,
        inventory: { Wood: new Decimal(20), "Sunflower Seed": new Decimal(5) },
      };

      expect(getToastChanges(STATE, next)).toEqual([]);
    });

    it("returns the amount gained", () => {
      const next = {
        ...STATE,
        inventory: { ...STATE.inventory, Wood: new Decimal(21) },
      };

      expect(display(getToastChanges(STATE, next))).toEqual(["Wood +1"]);
    });

    it("returns the amount used as a negative", () => {
      const next = {
        ...STATE,
        inventory: { ...STATE.inventory, Wood: new Decimal(10) },
      };

      expect(display(getToastChanges(STATE, next))).toEqual(["Wood -10"]);
    });

    it("returns the full amount of an item the player did not have", () => {
      const next = {
        ...STATE,
        inventory: { ...STATE.inventory, Axe: new Decimal(3) },
      };

      expect(display(getToastChanges(STATE, next))).toEqual(["Axe +3"]);
    });

    it("returns the full amount lost when an item leaves the inventory", () => {
      const next = { ...STATE, inventory: { Wood: new Decimal(20) } };

      expect(display(getToastChanges(STATE, next))).toEqual([
        "Sunflower Seed -5",
      ]);
    });

    it("ignores an item that appears with a zero amount", () => {
      const next = {
        ...STATE,
        inventory: { ...STATE.inventory, Axe: new Decimal(0) },
      };

      expect(getToastChanges(STATE, next)).toEqual([]);
    });

    it("ignores a zero-amount item that leaves the inventory", () => {
      const previous = {
        ...STATE,
        inventory: { ...STATE.inventory, Axe: new Decimal(0) },
      };

      expect(getToastChanges(previous, STATE)).toEqual([]);
    });

    it("returns one change per item that changed", () => {
      const next = {
        ...STATE,
        inventory: {
          Wood: new Decimal(15),
          "Sunflower Seed": new Decimal(5),
          Axe: new Decimal(1),
        },
      };

      expect(display(getToastChanges(STATE, next))).toEqual([
        "Wood -5",
        "Axe +1",
      ]);
    });

    it("keeps fractional amounts exact", () => {
      const previous = { ...STATE, inventory: { Wood: new Decimal(0.1) } };
      const next = { ...STATE, inventory: { Wood: new Decimal(0.3) } };

      // 0.3 - 0.1 is 0.19999999999999998 in floating point
      expect(display(getToastChanges(previous, next))).toEqual(["Wood +0.2"]);
    });

    it("returns nothing until there is an inventory to compare against", () => {
      const previous = { ...STATE, inventory: undefined };

      expect(getToastChanges(previous, STATE)).toEqual([]);
    });

    it("returns nothing when the inventory is missing from the new state", () => {
      const next = { ...STATE, inventory: undefined };

      expect(getToastChanges(STATE, next)).toEqual([]);
    });
  });

  describe("FLOWER balance", () => {
    it("returns the amount gained", () => {
      const next = { ...STATE, balance: new Decimal(12.5) };

      expect(display(getToastChanges(STATE, next))).toEqual(["SFL +2.5"]);
    });

    it("returns the amount spent as a negative", () => {
      const next = { ...STATE, balance: new Decimal(0) };

      expect(display(getToastChanges(STATE, next))).toEqual(["SFL -10"]);
    });

    it("keeps small amounts exact", () => {
      const previous = { ...STATE, balance: new Decimal("0.0001") };
      const next = { ...STATE, balance: new Decimal("0.0003") };

      expect(display(getToastChanges(previous, next))).toEqual(["SFL +0.0002"]);
    });

    it("returns nothing when the balance is a new object with the same amount", () => {
      const next = { ...STATE, balance: new Decimal(10) };

      expect(getToastChanges(STATE, next)).toEqual([]);
    });

    it("returns nothing until there is a balance to compare against", () => {
      const previous = { ...STATE, balance: undefined };

      expect(getToastChanges(previous, STATE)).toEqual([]);
    });
  });

  describe("coins", () => {
    it("returns the amount gained", () => {
      const next = { ...STATE, coins: 150 };

      expect(display(getToastChanges(STATE, next))).toEqual(["coins +50"]);
    });

    it("returns the amount spent as a negative", () => {
      const next = { ...STATE, coins: 80 };

      expect(display(getToastChanges(STATE, next))).toEqual(["coins -20"]);
    });

    it("returns the amount spent when the player spends every coin", () => {
      const next = { ...STATE, coins: 0 };

      expect(display(getToastChanges(STATE, next))).toEqual(["coins -100"]);
    });

    it("returns the amount gained when the player had no coins", () => {
      const previous = { ...STATE, coins: 0 };
      const next = { ...STATE, coins: 50 };

      expect(display(getToastChanges(previous, next))).toEqual(["coins +50"]);
    });

    it("keeps fractional amounts exact", () => {
      const previous = { ...STATE, coins: 0.1 };
      const next = { ...STATE, coins: 0.3 };

      expect(display(getToastChanges(previous, next))).toEqual(["coins +0.2"]);
    });

    it("returns nothing until there are coins to compare against", () => {
      const previous = { ...STATE, coins: undefined };

      expect(getToastChanges(previous, STATE)).toEqual([]);
    });
  });

  describe("experience", () => {
    it("returns the experience gained", () => {
      const next = { ...STATE, experience: 62.5 };

      expect(display(getToastChanges(STATE, next))).toEqual(["XP +12.5"]);
    });

    it("returns the experience gained by a Bumpkin with no experience", () => {
      const previous = { ...STATE, experience: 0 };
      const next = { ...STATE, experience: 10 };

      expect(display(getToastChanges(previous, next))).toEqual(["XP +10"]);
    });

    it("returns nothing until there is experience to compare against", () => {
      const previous = { ...STATE, experience: undefined };

      expect(getToastChanges(previous, STATE)).toEqual([]);
    });
  });

  describe("faction points", () => {
    it("returns the points gained", () => {
      const previous = { ...STATE, factionPoints: 100 };
      const next = { ...STATE, factionPoints: 125 };

      expect(display(getToastChanges(previous, next))).toEqual([
        "faction_points +25",
      ]);
    });

    it("returns the first points a faction member earns", () => {
      const next = { ...STATE, factionPoints: 25 };

      expect(display(getToastChanges(STATE, next))).toEqual([
        "faction_points +25",
      ]);
    });

    it("ignores points going down", () => {
      const previous = { ...STATE, factionPoints: 100 };
      const next = { ...STATE, factionPoints: 0 };

      expect(getToastChanges(previous, next)).toEqual([]);
    });

    it("ignores the points a player has when they join a faction", () => {
      const previous = { ...STATE, factionPoints: undefined };
      const next = { ...STATE, factionPoints: 0 };

      expect(getToastChanges(previous, next)).toEqual([]);
    });

    it("ignores the points a player loses when they leave a faction", () => {
      const previous = { ...STATE, factionPoints: 100 };
      const next = { ...STATE, factionPoints: undefined };

      expect(getToastChanges(previous, next)).toEqual([]);
    });
  });

  describe("wardrobe", () => {
    it("returns a wearable the player did not have", () => {
      const next = {
        ...STATE,
        wardrobe: { ...STATE.wardrobe, "Red Farmer Shirt": 1 },
      };

      expect(display(getToastChanges(STATE, next))).toEqual([
        "Red Farmer Shirt +1",
      ]);
    });

    it("returns another copy of a wearable", () => {
      const next = { ...STATE, wardrobe: { "Farmer Pants": 3 } };

      expect(display(getToastChanges(STATE, next))).toEqual([
        "Farmer Pants +2",
      ]);
    });

    it("returns a wearable that leaves the wardrobe as a negative", () => {
      const next = { ...STATE, wardrobe: {} };

      expect(display(getToastChanges(STATE, next))).toEqual([
        "Farmer Pants -1",
      ]);
    });

    it("returns nothing when the wardrobe is a new object with the same amounts", () => {
      const next = { ...STATE, wardrobe: { "Farmer Pants": 1 } };

      expect(getToastChanges(STATE, next)).toEqual([]);
    });

    it("returns nothing until there is a wardrobe to compare against", () => {
      const previous = { ...STATE, wardrobe: undefined };

      expect(getToastChanges(previous, STATE)).toEqual([]);
    });
  });

  describe("buds", () => {
    it("returns a bud that arrives", () => {
      const next = { ...STATE, buds: { 42: {} } };

      expect(display(getToastChanges(STATE, next))).toEqual(["Bud #42 +1"]);
    });

    it("returns a bud that leaves as a negative", () => {
      const previous = { ...STATE, buds: { 42: {}, 7: {} } };
      const next = { ...STATE, buds: { 7: {} } };

      expect(display(getToastChanges(previous, next))).toEqual(["Bud #42 -1"]);
    });

    it("returns nothing when a bud's details change", () => {
      const previous = { ...STATE, buds: { 42: { coordinates: undefined } } };
      const next = { ...STATE, buds: { 42: { coordinates: { x: 1, y: 1 } } } };

      expect(getToastChanges(previous, next)).toEqual([]);
    });

    it("returns nothing until there are buds to compare against", () => {
      const previous = { ...STATE, buds: undefined };
      const next = { ...STATE, buds: { 42: {} } };

      expect(getToastChanges(previous, next)).toEqual([]);
    });
  });

  describe("pet NFTs", () => {
    it("returns a pet that arrives", () => {
      const next = { ...STATE, petNFTs: { 3: {} } };

      expect(display(getToastChanges(STATE, next))).toEqual(["Pet #3 +1"]);
    });

    it("returns a pet that leaves as a negative", () => {
      const previous = { ...STATE, petNFTs: { 3: {} } };

      expect(display(getToastChanges(previous, STATE))).toEqual(["Pet #3 -1"]);
    });

    it("returns nothing when a pet's details change", () => {
      const previous = { ...STATE, petNFTs: { 3: { energy: 1 } } };
      const next = { ...STATE, petNFTs: { 3: { energy: 2 } } };

      expect(getToastChanges(previous, next)).toEqual([]);
    });
  });

  it("returns every change an action makes, inventory first", () => {
    // Crafting an axe, eating and earning in one step
    const next: ToastState = {
      inventory: {
        Wood: new Decimal(15),
        "Sunflower Seed": new Decimal(5),
        Axe: new Decimal(1),
      },
      balance: new Decimal(11),
      coins: 80,
      experience: 60,
      factionPoints: 5,
      wardrobe: { "Farmer Pants": 2 },
      buds: { 1: {} },
      petNFTs: { 2: {} },
    };

    expect(display(getToastChanges(STATE, next))).toEqual([
      "Wood -5",
      "Axe +1",
      "SFL +1",
      "coins -20",
      "XP +10",
      "faction_points +5",
      "Farmer Pants +1",
      "Bud #1 +1",
      "Pet #2 +1",
    ]);
  });

  it("does not modify the states it compares", () => {
    const previous = { ...STATE, inventory: { Wood: new Decimal(20) } };
    const next = { ...STATE, inventory: { Wood: new Decimal(21) } };

    getToastChanges(previous, next);

    expect(previous.inventory).toEqual({ Wood: new Decimal(20) });
    expect(next.inventory).toEqual({ Wood: new Decimal(21) });
  });
});

describe("addToasts", () => {
  it("shows the toast of a first action", () => {
    const toasts = addToasts([], [toast("Wood", 1, "a")]);

    expect(display(toasts)).toEqual(["Wood +1"]);
  });

  it("returns the same list when an action changed nothing", () => {
    const toasts = [toast("Wood", 1, "a")];

    expect(addToasts(toasts, [])).toBe(toasts);
  });

  describe("actions in the same direction", () => {
    it("adds a gain to a gain", () => {
      const toasts = addToasts(
        [toast("Wood", 1, "a")],
        [toast("Wood", 1, "b")],
      );

      expect(display(toasts)).toEqual(["Wood +2"]);
    });

    it("adds a loss to a loss", () => {
      const toasts = addToasts(
        [toast("Sunflower Seed", -1, "a")],
        [toast("Sunflower Seed", -1, "b")],
      );

      expect(display(toasts)).toEqual(["Sunflower Seed -2"]);
    });

    it("adds gains of different sizes", () => {
      const toasts = addToasts(
        [toast("Wood", 3, "a")],
        [toast("Wood", 10, "b")],
      );

      expect(display(toasts)).toEqual(["Wood +13"]);
    });

    it("keeps fractional totals exact", () => {
      const toasts = addToasts(
        [toast("Wood", 0.1, "a")],
        [toast("Wood", 0.2, "b")],
      );

      // 0.1 + 0.2 is 0.30000000000000004 in floating point
      expect(display(toasts)).toEqual(["Wood +0.3"]);
    });
  });

  describe("actions in opposite directions", () => {
    it("starts counting from the gain when a gain follows a loss", () => {
      const toasts = addToasts(
        [toast("Wood", -10, "a")],
        [toast("Wood", 1, "b")],
      );

      expect(display(toasts)).toEqual(["Wood +1"]);
    });

    it("starts counting from the loss when a loss follows a gain", () => {
      const toasts = addToasts(
        [toast("Wood", 10, "a")],
        [toast("Wood", -1, "b")],
      );

      expect(display(toasts)).toEqual(["Wood -1"]);
    });

    it("shows the gain when it is the same size as the loss before it", () => {
      const toasts = addToasts(
        [toast("Wood", -10, "a")],
        [toast("Wood", 10, "b")],
      );

      expect(display(toasts)).toEqual(["Wood +10"]);
    });

    it("shows the gain when it is smaller than the loss before it", () => {
      const toasts = addToasts(
        [toast("Lemon", -40, "a")],
        [toast("Lemon", 1, "b")],
      );

      expect(display(toasts)).toEqual(["Lemon +1"]);
    });

    it("shows the loss when it is smaller than the gain before it", () => {
      const toasts = addToasts(
        [toast("coins", 500, "a")],
        [toast("coins", -20, "b")],
      );

      expect(display(toasts)).toEqual(["coins -20"]);
    });
  });

  describe("toasts for other items", () => {
    it("leaves the toasts of other items as they were", () => {
      const toasts = addToasts(
        [toast("Wood", -10, "a"), toast("Axe", 1, "a2")],
        [toast("Stone", 1, "b")],
      );

      expect(display(toasts)).toEqual(["Stone +1", "Wood -10", "Axe +1"]);
    });

    it("moves an updated toast to the top", () => {
      const toasts = addToasts(
        [toast("Stone", 1, "a"), toast("Wood", 1, "b")],
        [toast("Wood", 1, "c")],
      );

      expect(display(toasts)).toEqual(["Wood +2", "Stone +1"]);
    });

    it("never shows an item twice", () => {
      const toasts = addToasts(
        [toast("Wood", -10, "a"), toast("Stone", 1, "b")],
        [toast("Wood", 1, "c")],
      );

      expect(display(toasts)).toEqual(["Wood +1", "Stone +1"]);
    });

    it("puts the last change of an action at the top", () => {
      const toasts = addToasts(
        [],
        [toast("Axe", -1, "a"), toast("Wood", 1, "b"), toast("XP", 5, "c")],
      );

      expect(display(toasts)).toEqual(["XP +5", "Wood +1", "Axe -1"]);
    });

    it("applies each change of an action to its own item", () => {
      const toasts = addToasts(
        [
          toast("Wood", 2, "a"),
          toast("Axe", -2, "b"),
          toast("coins", -50, "c"),
        ],
        [toast("Axe", -1, "d"), toast("Wood", 1, "e")],
      );

      expect(display(toasts)).toEqual(["Wood +3", "Axe -3", "coins -50"]);
    });
  });

  describe("toast ids", () => {
    it("gives an updated toast the id of the latest action", () => {
      const toasts = addToasts(
        [toast("Wood", 1, "a")],
        [toast("Wood", 1, "b")],
      );

      expect(toasts.map(({ id }) => id)).toEqual(["b"]);
    });

    it("gives a restarted toast the id of the latest action", () => {
      const toasts = addToasts(
        [toast("Wood", -10, "a")],
        [toast("Wood", 1, "b")],
      );

      expect(toasts.map(({ id }) => id)).toEqual(["b"]);
    });
  });

  it("does not modify the list or the toasts it is given", () => {
    const existing = toast("Wood", 1, "a");
    const toasts = [existing];

    addToasts(toasts, [toast("Wood", 1, "b")]);

    expect(toasts).toEqual([toast("Wood", 1, "a")]);
    expect(existing.difference.toNumber()).toEqual(1);
  });
});

describe("removeToasts", () => {
  it("removes the toast with the id", () => {
    const toasts = removeToasts(
      [toast("Wood", 1, "a"), toast("Stone", 1, "b")],
      ["a"],
    );

    expect(display(toasts)).toEqual(["Stone +1"]);
  });

  it("removes every toast of an action", () => {
    const toasts = removeToasts(
      [toast("Wood", 1, "a"), toast("Stone", 1, "b"), toast("Axe", -1, "c")],
      ["a", "c"],
    );

    expect(display(toasts)).toEqual(["Stone +1"]);
  });

  it("keeps a toast that a later action has updated", () => {
    const updated = addToasts([toast("Wood", 1, "a")], [toast("Wood", 1, "b")]);

    expect(display(removeToasts(updated, ["a"]))).toEqual(["Wood +2"]);
  });

  it("returns the same list when there is nothing to remove", () => {
    const toasts = [toast("Wood", 1, "a")];

    expect(removeToasts(toasts, ["gone"])).toBe(toasts);
    expect(removeToasts(toasts, [])).toBe(toasts);
  });

  it("does not modify the list it is given", () => {
    const toasts = [toast("Wood", 1, "a"), toast("Stone", 1, "b")];

    removeToasts(toasts, ["a"]);

    expect(display(toasts)).toEqual(["Wood +1", "Stone +1"]);
  });
});

describe("a play session", () => {
  const wood = (amount: number, state: ToastState = STATE): ToastState => ({
    ...state,
    inventory: { ...state.inventory, Wood: new Decimal(amount) },
  });

  const seeds = (amount: number, state: ToastState = STATE): ToastState => ({
    ...state,
    inventory: { ...state.inventory, "Sunflower Seed": new Decimal(amount) },
  });

  it("counts up while the player chops trees", () => {
    const session = playSession(wood(20));

    expect(session.act(wood(21)).shows).toEqual(["Wood +1"]);
    expect(session.act(wood(22)).shows).toEqual(["Wood +2"]);
    expect(session.act(wood(23)).shows).toEqual(["Wood +3"]);
  });

  it("counts down while the player plants seeds", () => {
    const session = playSession(seeds(5));

    expect(session.act(seeds(4)).shows).toEqual(["Sunflower Seed -1"]);
    expect(session.act(seeds(3)).shows).toEqual(["Sunflower Seed -2"]);
    expect(session.act(seeds(2)).shows).toEqual(["Sunflower Seed -3"]);
    expect(session.act(seeds(1)).shows).toEqual(["Sunflower Seed -4"]);
    expect(session.act(seeds(0)).shows).toEqual(["Sunflower Seed -5"]);
  });

  it("shows the wood chopped after a craft, not the craft's cost counting back", () => {
    const session = playSession(wood(20));

    // Craft a tool for 10 Wood, then chop three trees
    expect(session.act(wood(10)).shows).toEqual(["Wood -10"]);
    expect(session.act(wood(11)).shows).toEqual(["Wood +1"]);
    expect(session.act(wood(12)).shows).toEqual(["Wood +2"]);
    expect(session.act(wood(13)).shows).toEqual(["Wood +3"]);
  });

  it("shows the lemons picked after cooking, not what the recipes used", () => {
    const lemons = (amount: number): ToastState => ({
      ...STATE,
      inventory: { Lemon: new Decimal(amount) },
    });
    const session = playSession(lemons(60));

    // Four Lemon Cakes at 10 Lemons each, then harvest a lemon tree
    expect(session.act(lemons(50)).shows).toEqual(["Lemon -10"]);
    expect(session.act(lemons(40)).shows).toEqual(["Lemon -20"]);
    expect(session.act(lemons(30)).shows).toEqual(["Lemon -30"]);
    expect(session.act(lemons(20)).shows).toEqual(["Lemon -40"]);
    expect(session.act(lemons(21)).shows).toEqual(["Lemon +1"]);
    expect(session.act(lemons(22)).shows).toEqual(["Lemon +2"]);
  });

  it("shows a new cost in full after gains, not net of them", () => {
    const session = playSession(wood(20));

    expect(session.act(wood(21)).shows).toEqual(["Wood +1"]);
    expect(session.act(wood(22)).shows).toEqual(["Wood +2"]);
    expect(session.act(wood(12)).shows).toEqual(["Wood -10"]);
  });

  it("starts each run from zero as the player switches back and forth", () => {
    const session = playSession(wood(20));

    expect(session.act(wood(10)).shows).toEqual(["Wood -10"]);
    expect(session.act(wood(11)).shows).toEqual(["Wood +1"]);
    expect(session.act(wood(1)).shows).toEqual(["Wood -10"]);
    expect(session.act(wood(0)).shows).toEqual(["Wood -11"]);
    expect(session.act(wood(5)).shows).toEqual(["Wood +5"]);
  });

  it("shows the coins earned after a purchase, not net of the price", () => {
    const coins = (amount: number): ToastState => ({ ...STATE, coins: amount });
    const session = playSession(coins(100));

    expect(session.act(coins(0)).shows).toEqual(["coins -100"]);
    expect(session.act(coins(50)).shows).toEqual(["coins +50"]);
    expect(session.act(coins(75)).shows).toEqual(["coins +75"]);
  });

  it("counts each item of an action on its own", () => {
    const chop = (axes: number, woodAmount: number): ToastState => ({
      ...STATE,
      inventory: { Axe: new Decimal(axes), Wood: new Decimal(woodAmount) },
    });
    const session = playSession(chop(0, 20));

    // Craft 3 axes for 5 Wood each, then chop two trees
    expect(session.act(chop(3, 5)).shows).toEqual(["Wood -15", "Axe +3"]);
    expect(session.act(chop(2, 6)).shows).toEqual(["Wood +1", "Axe -1"]);
    expect(session.act(chop(1, 7)).shows).toEqual(["Wood +2", "Axe -2"]);
  });

  it("starts from zero once a toast has timed out", () => {
    const session = playSession(wood(20));

    const first = session.act(wood(21));
    expect(first.shows).toEqual(["Wood +1"]);
    expect(first.expire()).toEqual([]);

    expect(session.act(wood(22)).shows).toEqual(["Wood +1"]);
  });

  it("keeps a toast on screen when a later action updates it before the timeout", () => {
    const session = playSession(wood(20));

    const first = session.act(wood(21));
    const second = session.act(wood(22));

    expect(first.expire()).toEqual(["Wood +2"]);
    expect(second.expire()).toEqual([]);
  });

  it("times out one item while the player is still busy with another", () => {
    const state = (woodAmount: number, seedAmount: number): ToastState => ({
      ...STATE,
      inventory: {
        Wood: new Decimal(woodAmount),
        "Sunflower Seed": new Decimal(seedAmount),
      },
    });
    const session = playSession(state(20, 5));

    const chopped = session.act(state(21, 5));
    expect(session.act(state(21, 4)).shows).toEqual([
      "Sunflower Seed -1",
      "Wood +1",
    ]);
    expect(session.act(state(21, 3)).shows).toEqual([
      "Sunflower Seed -2",
      "Wood +1",
    ]);

    // The wood toast times out while seeds are still being planted
    expect(chopped.expire()).toEqual(["Sunflower Seed -2"]);
    expect(session.act(state(21, 2)).shows).toEqual(["Sunflower Seed -3"]);

    // Chopping again is a fresh +1, not +2
    expect(session.act(state(22, 2)).shows).toEqual([
      "Wood +1",
      "Sunflower Seed -3",
    ]);
  });

  it("shows nothing for a state update that changes no amounts", () => {
    const session = playSession(wood(20));

    expect(session.act(wood(21)).shows).toEqual(["Wood +1"]);
    expect(session.act(wood(21)).shows).toEqual(["Wood +1"]);
    expect(session.act({ ...wood(21) }).shows).toEqual(["Wood +1"]);
  });

  it("shows only gains for faction points between other actions", () => {
    const points = (amount: number): ToastState => ({
      ...STATE,
      factionPoints: amount,
    });
    const session = playSession(points(10));

    expect(session.act(points(15)).shows).toEqual(["faction_points +5"]);
    expect(session.act(points(0)).shows).toEqual(["faction_points +5"]);
    expect(session.act(points(20)).shows).toEqual(["faction_points +25"]);
  });
});

describe("getToastState", () => {
  const GAME: GameState = {
    ...INITIAL_FARM,
    inventory: { Wood: new Decimal(3) },
    balance: new Decimal(7),
    coins: 250,
    bumpkin: { ...INITIAL_FARM.bumpkin, experience: 1234 },
    wardrobe: { "Farmer Pants": 2 },
  };

  it("reads the amounts the toast tracks from the game", () => {
    const state = getToastState(GAME);

    expect(state.inventory).toBe(GAME.inventory);
    expect(state.balance).toBe(GAME.balance);
    expect(state.coins).toEqual(250);
    expect(state.experience).toEqual(1234);
    expect(state.wardrobe).toBe(GAME.wardrobe);
  });

  it("reads the points of a faction member", () => {
    const state = getToastState({
      ...GAME,
      faction: {
        name: "goblins",
        pledgedAt: 0,
        points: 40,
        history: {},
      },
    });

    expect(state.factionPoints).toEqual(40);
  });

  it("has no faction points for a player outside a faction", () => {
    const state = getToastState({ ...GAME, faction: undefined });

    expect(state.factionPoints).toBeUndefined();
  });

  it("treats a game with no pet NFTs as having none", () => {
    const state = getToastState({ ...GAME, pets: undefined });

    expect(state.petNFTs).toEqual({});
  });

  it("shows a toast for the first coins of a game that had none", () => {
    const changes = getToastChanges(
      getToastState({ ...GAME, coins: 0 }),
      getToastState({ ...GAME, coins: 5 }),
    );

    expect(display(changes)).toEqual(["coins +5"]);
  });
});

describe("amounts the toast cannot read", () => {
  const corrupt = (amount: unknown) => amount as number;

  it.each([
    ["NaN", NaN],
    ["Infinity", Infinity],
    ["null", null],
    ["a string", "100"],
  ])("returns nothing when the new coins are %s", (_, coins) => {
    const next = { ...STATE, coins: corrupt(coins) };

    expect(getToastChanges(STATE, next)).toEqual([]);
  });

  it.each([
    ["NaN", NaN],
    ["Infinity", Infinity],
    ["null", null],
  ])("returns nothing when the coins before were %s", (_, coins) => {
    const previous = { ...STATE, coins: corrupt(coins) };

    expect(getToastChanges(previous, STATE)).toEqual([]);
  });

  it("returns nothing when the experience is not a number", () => {
    const next = { ...STATE, experience: corrupt(NaN) };

    expect(getToastChanges(STATE, next)).toEqual([]);
  });

  it("returns nothing when the faction points are not a number", () => {
    const next = { ...STATE, factionPoints: corrupt(null) };

    expect(getToastChanges(STATE, next)).toEqual([]);
  });

  it("returns nothing when the balance is not a Decimal", () => {
    const next = { ...STATE, balance: null as unknown as Decimal };

    expect(getToastChanges(STATE, next)).toEqual([]);
  });

  it("skips an inventory amount it cannot read and keeps the rest", () => {
    const next = {
      ...STATE,
      inventory: {
        Wood: new Decimal(21),
        "Sunflower Seed": "4" as unknown as Decimal,
      },
    };

    expect(display(getToastChanges(STATE, next))).toEqual(["Wood +1"]);
  });

  it("counts an inventory item with no amount as none of it", () => {
    const next = {
      ...STATE,
      inventory: { Wood: new Decimal(20), "Sunflower Seed": undefined },
    };

    expect(display(getToastChanges(STATE, next))).toEqual([
      "Sunflower Seed -5",
    ]);
  });

  it("skips a wardrobe amount it cannot read", () => {
    const next = { ...STATE, wardrobe: { "Farmer Pants": corrupt(NaN) } };

    expect(getToastChanges(STATE, next)).toEqual([]);
  });

  it("still returns the other changes of the action", () => {
    const next = {
      ...STATE,
      coins: corrupt(NaN),
      inventory: { ...STATE.inventory, Wood: new Decimal(25) },
    };

    expect(display(getToastChanges(STATE, next))).toEqual(["Wood +5"]);
  });
});

describe("a wearable with the same name as an inventory item", () => {
  const SHARED_NAMES = getKeys(ITEM_IDS).filter((name) => name in KNOWN_IDS);

  it("covers names such as the Axe and the Chef Hat", () => {
    expect(SHARED_NAMES).toEqual(expect.arrayContaining(["Axe", "Chef Hat"]));
  });

  it.each(SHARED_NAMES)("has no toast for the %s wearable", (name) => {
    const next = { ...STATE, wardrobe: { ...STATE.wardrobe, [name]: 1 } };

    expect(getToastChanges(STATE, next)).toEqual([]);
  });

  it("counts only the item when the item and the wearable change together", () => {
    const next = {
      ...STATE,
      inventory: { ...STATE.inventory, Axe: new Decimal(3) },
      wardrobe: { ...STATE.wardrobe, Axe: 1 },
    };

    expect(display(getToastChanges(STATE, next))).toEqual(["Axe +3"]);
  });

  it("does not hide the item's loss behind the wearable's gain", () => {
    const previous = {
      ...STATE,
      inventory: { ...STATE.inventory, Axe: new Decimal(3) },
    };
    const next = {
      ...STATE,
      inventory: { ...STATE.inventory, Axe: new Decimal(2) },
      wardrobe: { ...STATE.wardrobe, Axe: 1 },
    };

    expect(display(getToastChanges(previous, next))).toEqual(["Axe -1"]);
  });
});

describe("zero and very large amounts", () => {
  it("returns the amount gained by a player with no FLOWER", () => {
    const previous = { ...STATE, balance: new Decimal(0) };
    const next = { ...STATE, balance: new Decimal(5) };

    expect(display(getToastChanges(previous, next))).toEqual(["SFL +5"]);
  });

  it("reads zero experience and a zero balance from the game as amounts", () => {
    const state = getToastState({
      ...INITIAL_FARM,
      balance: new Decimal(0),
      coins: 0,
      bumpkin: { ...INITIAL_FARM.bumpkin, experience: 0 },
    });

    expect(state.experience).toEqual(0);
    expect(state.coins).toEqual(0);
    expect(state.balance?.toNumber()).toEqual(0);
  });

  it("reads the buds and pet NFTs from the game", () => {
    const buds = { 7: {} } as unknown as GameState["buds"];
    const nfts = { 3: {} } as unknown as NonNullable<GameState["pets"]>["nfts"];
    const state = getToastState({
      ...INITIAL_FARM,
      buds,
      pets: { ...INITIAL_FARM.pets, nfts } as GameState["pets"],
    });

    expect(state.buds).toBe(buds);
    expect(state.petNFTs).toBe(nfts);
  });

  it("starts counting from a small gain after a very large loss", () => {
    const toasts = addToasts(
      [toast("coins", -5000000, "a")],
      [toast("coins", 0.5, "b")],
    );

    expect(display(toasts)).toEqual(["coins +0.5"]);
  });

  it("starts counting from a small loss after a very large gain", () => {
    const toasts = addToasts(
      [toast("coins", 5000000, "a")],
      [toast("coins", -0.5, "b")],
    );

    expect(display(toasts)).toEqual(["coins -0.5"]);
  });
});
