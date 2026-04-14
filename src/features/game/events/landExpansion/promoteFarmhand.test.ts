import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { promoteFarmhand } from "./promoteFarmhand";

const FARMHAND_EQUIPPED = {
  background: "Farm Background" as const,
  body: "Beige Farmer Potion" as const,
  hair: "Basic Hair" as const,
  shoes: "Black Farmer Boots" as const,
  pants: "Farmer Pants" as const,
  shirt: "Yellow Farmer Shirt" as const,
  tool: "Farmer Pitchfork" as const,
};

const GAME_STATE: GameState = {
  ...TEST_FARM,
  farmHands: {
    bumpkins: {
      "fh-1": {
        equipped: FARMHAND_EQUIPPED,
      },
    },
  },
};

describe("promoteFarmhand", () => {
  it("throws if farmhand does not exist", () => {
    expect(() =>
      promoteFarmhand({
        state: GAME_STATE,
        action: {
          type: "farmhand.promoted",
          id: "nonexistent",
        },
      }),
    ).toThrow("Farm hand does not exist");
  });

  it("throws if no bumpkin", () => {
    expect(() =>
      promoteFarmhand({
        state: { ...GAME_STATE, bumpkin: undefined as never },
        action: {
          type: "farmhand.promoted",
          id: "fh-1",
        },
      }),
    ).toThrow("No bumpkin");
  });

  it("swaps equipped wearables", () => {
    const bumpkinEquipped = { ...GAME_STATE.bumpkin!.equipped };
    const result = promoteFarmhand({
      state: GAME_STATE,
      action: {
        type: "farmhand.promoted",
        id: "fh-1",
      },
    });

    expect(result.bumpkin?.equipped).toEqual(FARMHAND_EQUIPPED);
    expect(result.farmHands.bumpkins["fh-1"].equipped).toEqual(bumpkinEquipped);
  });

  it("swaps coordinates/location when both are placed", () => {
    const state: GameState = {
      ...GAME_STATE,
      bumpkin: {
        ...GAME_STATE.bumpkin!,
        coordinates: { x: 1, y: 1 },
        location: "farm" as const,
      },
      farmHands: {
        bumpkins: {
          "fh-1": {
            equipped: FARMHAND_EQUIPPED,
            coordinates: { x: 5, y: 5 },
            location: "farm" as const,
          },
        },
      },
    };

    const result = promoteFarmhand({
      state,
      action: { type: "farmhand.promoted", id: "fh-1" },
    });

    expect(result.bumpkin?.coordinates).toEqual({ x: 5, y: 5 });
    expect(result.bumpkin?.location).toBe("farm");
    expect(result.farmHands.bumpkins["fh-1"].coordinates).toEqual({
      x: 1,
      y: 1,
    });
    expect(result.farmHands.bumpkins["fh-1"].location).toBe("farm");
  });

  it("handles bumpkin placed but farmhand not placed", () => {
    const state: GameState = {
      ...GAME_STATE,
      bumpkin: {
        ...GAME_STATE.bumpkin!,
        coordinates: { x: 1, y: 1 },
        location: "farm" as const,
      },
    };

    const result = promoteFarmhand({
      state,
      action: { type: "farmhand.promoted", id: "fh-1" },
    });

    expect(result.bumpkin?.coordinates).toBeUndefined();
    expect(result.bumpkin?.location).toBeUndefined();
    expect(result.farmHands.bumpkins["fh-1"].coordinates).toEqual({
      x: 1,
      y: 1,
    });
    expect(result.farmHands.bumpkins["fh-1"].location).toBe("farm");
  });

  it("handles farmhand placed but bumpkin not placed", () => {
    const state: GameState = {
      ...GAME_STATE,
      farmHands: {
        bumpkins: {
          "fh-1": {
            equipped: FARMHAND_EQUIPPED,
            coordinates: { x: 5, y: 5 },
            location: "farm" as const,
          },
        },
      },
    };

    const result = promoteFarmhand({
      state,
      action: { type: "farmhand.promoted", id: "fh-1" },
    });

    expect(result.bumpkin?.coordinates).toEqual({ x: 5, y: 5 });
    expect(result.bumpkin?.location).toBe("farm");
    expect(result.farmHands.bumpkins["fh-1"].coordinates).toBeUndefined();
    expect(result.farmHands.bumpkins["fh-1"].location).toBeUndefined();
  });

  it("does not swap experience or skills", () => {
    const bumpkinExp = GAME_STATE.bumpkin!.experience;
    const bumpkinSkills = { ...GAME_STATE.bumpkin!.skills };

    const result = promoteFarmhand({
      state: GAME_STATE,
      action: { type: "farmhand.promoted", id: "fh-1" },
    });

    expect(result.bumpkin?.experience).toBe(bumpkinExp);
    expect(result.bumpkin?.skills).toEqual(bumpkinSkills);
  });
});
