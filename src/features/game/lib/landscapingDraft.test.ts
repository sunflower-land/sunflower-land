import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import {
  applyDraftEvent,
  applyLiveEvent,
  beginDraft,
  compactDraftActions,
  discardDraft,
  isDraftDirty,
  isDraftEvent,
  rebaseDraft,
  rekeyDraft,
  replayDraft,
  commitDraft,
  settleLandscapingSave,
  type PastAction,
} from "./landscapingDraft";

const farmId = 1;
const at = new Date(1_700_000_000_000);

const farm: GameState = {
  ...TEST_FARM,
  inventory: {
    ...TEST_FARM.inventory,
    "Basic Land": new Decimal(3),
    "Basic Bear": new Decimal(3),
  },
  collectibles: {
    "Basic Bear": [
      { id: "a", coordinates: { x: 0, y: 0 } },
      { id: "b", coordinates: { x: 2, y: 2 } },
    ],
  },
};

const move = (id: string, x: number, y: number) =>
  ({
    type: "collectible.moved",
    name: "Basic Bear",
    id,
    coordinates: { x, y },
    location: "farm",
  }) as const;

const bearAt = (state: GameState, id: string) =>
  state.collectibles["Basic Bear"]!.find((c) => c.id === id)!.coordinates;

describe("landscapingDraft", () => {
  describe("isDraftEvent", () => {
    it("drafts placement edits on the farm", () => {
      expect(isDraftEvent("collectible.moved", "farm")).toBe(true);
      expect(isDraftEvent("items.removed", "farm")).toBe(true);
      expect(isDraftEvent("farmHand.moved", "farm")).toBe(true);
      expect(isDraftEvent("bumpkin.flipped", "farm")).toBe(true);
    });

    it("keeps purchases live", () => {
      expect(isDraftEvent("collectible.crafted", "farm")).toBe(false);
      expect(isDraftEvent("decoration.bought", "farm")).toBe(false);
      expect(isDraftEvent("monument.bought", "farm")).toBe(false);
      expect(isDraftEvent("building.constructed", "farm")).toBe(false);
      expect(isDraftEvent("biome.applied", "farm")).toBe(false);
    });

    it("drafts placement edits on every placeable surface", () => {
      expect(isDraftEvent("collectible.moved", "home")).toBe(true);
      expect(isDraftEvent("collectible.moved", "interior")).toBe(true);
      expect(isDraftEvent("collectible.moved", "level_one")).toBe(true);
      expect(isDraftEvent("collectible.moved", "petHouse")).toBe(true);
    });

    it("drafts nothing when not landscaping", () => {
      expect(isDraftEvent("collectible.moved", undefined)).toBe(false);
    });

    it("keeps purchases live indoors too", () => {
      expect(isDraftEvent("decoration.bought", "home")).toBe(false);
    });
  });

  it("begins a clean draft over the current farm", () => {
    const draft = beginDraft(farm, "farm");

    expect(draft.baseState).toBe(farm);
    expect(draft.draftActions).toEqual([]);
    expect(draft.landscapingLocation).toBe("farm");
    expect(isDraftDirty(draft)).toBe(false);
  });

  it("applies a draft edit to the draft only", () => {
    const context = {
      state: farm,
      actions: [] as PastAction[],
      ...beginDraft(farm, "farm"),
    };

    const next = applyDraftEvent(context, move("a", 1, 1), farmId, at);

    expect(bearAt(next.state, "a")).toEqual({ x: 1, y: 1 });
    expect(next.draftActions).toEqual([{ ...move("a", 1, 1), createdAt: at }]);
    expect(context.actions).toEqual([]);
    expect(bearAt(context.baseState!, "a")).toEqual({ x: 0, y: 0 });
    expect(isDraftDirty(next)).toBe(true);
  });

  it("clears the last rejection's conflicts on the next edit", () => {
    const context = {
      state: farm,
      draftActions: [],
      arrangementConflicts: [
        { code: "COLLISION" as const, name: "Basic Bear", id: "a" },
      ],
    };

    const next = applyDraftEvent(context, move("a", 1, 1), farmId, at);

    expect(next.arrangementConflicts).toBeUndefined();
  });

  it("applies a live event to both states and queues it for autosave", () => {
    const context = { state: farm, baseState: farm, actions: [] };

    const next = applyLiveEvent(context, move("b", 3, 3), farmId, at);

    expect(bearAt(next.state, "b")).toEqual({ x: 3, y: 3 });
    expect(bearAt(next.baseState!, "b")).toEqual({ x: 3, y: 3 });
    expect(next.actions).toEqual([{ ...move("b", 3, 3), createdAt: at }]);
  });

  describe("compactDraftActions", () => {
    const a1 = { ...move("a", 1, 1), createdAt: at };
    const a2 = { ...move("a", 2, 2), createdAt: at };
    const b1 = { ...move("b", 1, 1), createdAt: at };

    it("collapses successive moves of the same instance", () => {
      expect(compactDraftActions([a1], a2)).toEqual([a2]);
    });

    it("keeps moves of different instances", () => {
      expect(compactDraftActions([a1], b1)).toEqual([a1, b1]);
    });

    it("never collapses across other event types", () => {
      const flip = {
        type: "collectible.flipped" as const,
        name: "Basic Bear" as const,
        id: "a",
        location: "farm" as const,
        createdAt: at,
      };
      expect(compactDraftActions([a1], flip)).toEqual([a1, flip]);
      expect(compactDraftActions([a1, flip], a2)).toEqual([a1, flip, a2]);
    });
  });

  describe("replay / rebase", () => {
    it("replays the draft over a fresh base", () => {
      const draftActions: PastAction[] = [
        { ...move("a", 1, 1), createdAt: at },
      ];

      const replayed = replayDraft(farm, draftActions, farmId);

      expect(bearAt(replayed.state, "a")).toEqual({ x: 1, y: 1 });
      expect(replayed.draftActions).toEqual(draftActions);
    });

    it("drops an edit the changed farm no longer accepts", () => {
      // The draft placed a bear from the chest at (1, 1)...
      const draftActions: PastAction[] = [
        {
          type: "collectible.placed",
          name: "Basic Bear",
          id: "c",
          coordinates: { x: 1, y: 1 },
          location: "farm",
          createdAt: at,
        },
      ];
      // ...but the server's farm now has one there already.
      const serverFarm: GameState = {
        ...farm,
        collectibles: {
          "Basic Bear": [
            ...farm.collectibles["Basic Bear"]!,
            { id: "z", coordinates: { x: 1, y: 1 } },
          ],
        },
      };

      const rebased = rebaseDraft(
        { state: serverFarm },
        { draftActions },
        farmId,
      );

      expect(rebased.baseState).toBe(serverFarm);
      expect(rebased.draftActions).toEqual([]);
      expect(rebased.state.collectibles["Basic Bear"]).toHaveLength(3);
    });
  });

  describe("switching surfaces mid-session", () => {
    it("re-keys a clean draft to the new surface without a round trip", () => {
      const context = {
        state: farm,
        ...beginDraft(farm, "interior"),
      };

      const next = rekeyDraft(context.state, "level_one");

      expect(next.landscapingLocation).toBe("level_one");
      expect(next.baseState).toBe(farm);
      expect(next.draftActions).toEqual([]);
      expect(next.arrangementConflicts).toBeUndefined();
    });

    it("commit with a next surface keeps landscaping keyed to that surface", () => {
      // The floor you are leaving was just committed; `serverState` is the
      // server's reply and becomes the base for the floor you are entering.
      const serverState = { ...farm };

      const next = commitDraft(serverState, "level_one");

      expect(next.state).toBe(serverState);
      expect(next.baseState).toBe(serverState);
      expect(next.landscapingLocation).toBe("level_one");
      expect(next.draftActions).toEqual([]);
    });

    it("commit without a next surface leaves landscaping", () => {
      const next = commitDraft(farm);

      expect(next.landscapingLocation).toBeUndefined();
      expect(next.baseState).toBeUndefined();
    });
  });

  describe("settleLandscapingSave", () => {
    // A SAVE with nothing queued short-circuits and hands back the DRAFT as
    // "the farm". Treating that as the server's truth would bake the draft
    // into baseState, and Cancel could no longer revert - the bug players
    // reported as "the X button doesn't revert my changes".
    it("ignores a skipped save entirely", () => {
      let context = {
        state: farm,
        actions: [] as PastAction[],
        ...beginDraft(farm, "farm"),
      };
      context = {
        ...context,
        ...applyDraftEvent(context, move("a", 1, 1), farmId, at),
      };

      const patch = settleLandscapingSave(
        context,
        { state: context.state, skipped: true },
        farmId,
      );

      expect(patch).toEqual({});
      // The base still reverts the draft.
      expect(bearAt(context.baseState!, "a")).toEqual({ x: 0, y: 0 });
    });

    it("rebases the draft onto a real save", () => {
      let context = {
        state: farm,
        actions: [] as PastAction[],
        ...beginDraft(farm, "farm"),
      };
      context = {
        ...context,
        ...applyDraftEvent(context, move("a", 1, 1), farmId, at),
      };
      // The server moved bear b meanwhile.
      const serverFarm: GameState = {
        ...farm,
        collectibles: {
          "Basic Bear": [
            { id: "a", coordinates: { x: 0, y: 0 } },
            { id: "b", coordinates: { x: 3, y: 3 } },
          ],
        },
      };

      const patch = settleLandscapingSave(
        context,
        { state: serverFarm },
        farmId,
      );

      expect(patch.baseState).toBe(serverFarm);
      expect(bearAt(patch.state!, "a")).toEqual({ x: 1, y: 1 });
      expect(bearAt(patch.state!, "b")).toEqual({ x: 3, y: 3 });
    });
  });

  it("discard restores the base, including live changes made meanwhile", () => {
    let context = {
      state: farm,
      actions: [] as PastAction[],
      ...beginDraft(farm, "farm"),
    };
    context = {
      ...context,
      ...applyDraftEvent(context, move("a", 1, 1), farmId, at),
    };
    context = {
      ...context,
      ...applyLiveEvent(context, move("b", 3, 3), farmId, at),
    };

    const discarded = discardDraft(context);

    expect(bearAt(discarded.state, "a")).toEqual({ x: 0, y: 0 });
    expect(bearAt(discarded.state, "b")).toEqual({ x: 3, y: 3 });
    expect(discarded.baseState).toBeUndefined();
    expect(discarded.draftActions).toEqual([]);
    expect(discarded.landscapingLocation).toBeUndefined();
  });
});
