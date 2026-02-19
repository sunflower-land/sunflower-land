import Decimal from "decimal.js-light";
import {
  TEST_FARM,
  INITIAL_BUMPKIN,
  CRIMSTONE_RECOVERY_TIME,
} from "../../lib/constants";
import { GameState } from "../../types/game";
import {
  MineCrimstoneAction,
  getMinedAt,
  mineCrimstone,
} from "./mineCrimstone";
import { KNOWN_IDS } from "features/game/types";
import { prngChance } from "lib/prng";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  crimstones: {
    0: {
      stone: {
        minedAt: 0,
      },
      x: 1,
      y: 1,
      minesLeft: 5,
    },
    1: {
      stone: {
        minedAt: 0,
      },
      x: 4,
      y: 1,
      minesLeft: 5,
    },
  },
};
const FARM_ID = 1;

describe("mineCrimstone", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("throws an error if no gold pickaxes are left", () => {
    expect(() =>
      mineCrimstone({
        state: {
          ...GAME_STATE,
          inventory: {
            "Gold Pickaxe": new Decimal(0),
          },
        },
        action: {
          type: "crimstoneRock.mined",
          index: 0,
        },
        farmId: FARM_ID,
      }),
    ).toThrow("No gold pickaxes left");
  });

  it("mines crimstone for free with Crimstone Spikes Hair", () => {
    const game = mineCrimstone({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hair: "Crimstone Spikes Hair",
          },
        },
        inventory: {
          "Gold Pickaxe": new Decimal(0),
        },
      },
      action: {
        type: "crimstoneRock.mined",
        index: 0,
      },
      farmId: FARM_ID,
    });

    expect(game.inventory["Gold Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Crimstone).toEqual(new Decimal(1));
  });

  it("throws an error if crimstone does not exist", () => {
    expect(() =>
      mineCrimstone({
        state: {
          ...GAME_STATE,
          inventory: {
            "Gold Pickaxe": new Decimal(2),
          },
        },
        action: {
          type: "crimstoneRock.mined",
          index: 3,
        },
        farmId: FARM_ID,
      }),
    ).toThrow("Crimstone does not exist");
  });

  it("throws an error if crimstone is not placed", () => {
    expect(() =>
      mineCrimstone({
        state: {
          ...GAME_STATE,
          bumpkin: GAME_STATE.bumpkin,
          crimstones: {
            0: { ...GAME_STATE.crimstones[0], x: undefined, y: undefined },
          },
        },
        action: { type: "crimstoneRock.mined", index: 0 },
        farmId: FARM_ID,
      }),
    ).toThrow("Crimstone rock is not placed");
  });

  it("throws an error if crimstone is not ready", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Gold Pickaxe": new Decimal(2),
        },
      },
      action: {
        type: "crimstoneRock.mined",
        expansionIndex: 0,
        index: 0,
      } as MineCrimstoneAction,
      farmId: FARM_ID,
    };
    const game = mineCrimstone(payload);

    // Try same payload
    expect(() =>
      mineCrimstone({
        state: game,
        action: payload.action,
        farmId: FARM_ID,
      }),
    ).toThrow("Rock is still recovering");
  });

  it("mines crimstone", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Gold Pickaxe": new Decimal(1),
        },
      },
      action: {
        type: "crimstoneRock.mined",
        expansionIndex: 0,
        index: 0,
      } as MineCrimstoneAction,
      farmId: FARM_ID,
    };

    const game = mineCrimstone(payload);

    expect(game.inventory["Gold Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Crimstone).toEqual(new Decimal(1));
  });

  it("mines multiple crimstones", () => {
    let game = mineCrimstone({
      state: {
        ...GAME_STATE,
        inventory: {
          "Gold Pickaxe": new Decimal(3),
        },
      },
      action: {
        type: "crimstoneRock.mined",
        expansionIndex: 0,
        index: 0,
      } as MineCrimstoneAction,
      farmId: FARM_ID,
    });

    game = mineCrimstone({
      state: game,
      action: {
        type: "crimstoneRock.mined",
        expansionIndex: 0,
        index: 1,
      } as MineCrimstoneAction,
      farmId: FARM_ID,
    });

    expect(game.inventory["Gold Pickaxe"]).toEqual(new Decimal(1));
    expect(game.inventory.Crimstone).toEqual(new Decimal(2));
  });

  it("mines crimstone after waiting", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Gold Pickaxe": new Decimal(2),
        },
      },
      action: {
        type: "crimstoneRock.mined",
        expansionIndex: 0,
        index: 0,
      } as MineCrimstoneAction,
      farmId: FARM_ID,
    };

    let game = mineCrimstone(payload);

    // 24 hours + 100 milliseconds
    game = mineCrimstone({
      createdAt: Date.now() + 1 * 24 * 60 * 60 * 1000 + 100,
      ...payload,
      state: game,
    });

    expect(game.inventory["Gold Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Crimstone?.toNumber()).toEqual(2);
  });

  it("resets minesLeft after 24 hours", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Gold Pickaxe": new Decimal(2),
        },
      },
      action: {
        type: "crimstoneRock.mined",
        expansionIndex: 0,
        index: 1,
      } as MineCrimstoneAction,
      farmId: FARM_ID,
    };

    let game = mineCrimstone(payload);

    // 48 hours + 100 milliseconds
    game = mineCrimstone({
      createdAt: Date.now() + 2 * 24 * 60 * 60 * 1000 + 100,
      ...payload,
      state: game,
    });

    expect(game.crimstones[1].minesLeft).toEqual(4);
  });

  describe("getMinedAt", () => {
    it("crimstone replenishes faster with Crimstone Amulet", () => {
      const now = Date.now();

      const { time } = getMinedAt({
        game: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            equipped: {
              ...INITIAL_BUMPKIN.equipped,
              necklace: "Crimstone Amulet",
            },
          },
        },
        createdAt: now,
        prngArgs: {
          farmId: FARM_ID,
          itemId: KNOWN_IDS["Crimstone Rock"],
          counter: 0,
        },
      });

      expect(time).toEqual(now - CRIMSTONE_RECOVERY_TIME * 0.2 * 1000);
    });
    it("crimstone replenishes faster with Fireside Alchemist", () => {
      const now = Date.now();

      const { time } = getMinedAt({
        game: {
          ...GAME_STATE,
          bumpkin: {
            ...GAME_STATE.bumpkin,
            skills: {
              "Fireside Alchemist": 1,
            },
          },
        },
        createdAt: now,
        prngArgs: {
          farmId: FARM_ID,
          itemId: KNOWN_IDS["Crimstone Rock"],
          counter: 0,
        },
      });

      expect(time).toEqual(now - CRIMSTONE_RECOVERY_TIME * 0.15 * 1000);
    });

    it("crimstone replenishes faster with Fireside Alchemist, Crimstone Amulet and Mole Shrine", () => {
      const now = Date.now();

      const { time } = getMinedAt({
        game: {
          ...GAME_STATE,
          bumpkin: {
            ...GAME_STATE.bumpkin,
            skills: {
              "Fireside Alchemist": 1,
            },
            equipped: {
              ...GAME_STATE.bumpkin.equipped,
              necklace: "Crimstone Amulet",
            },
          },
          collectibles: {
            "Mole Shrine": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: now,
                id: "12",
                readyAt: now,
              },
            ],
          },
        },
        createdAt: now,
        prngArgs: {
          farmId: FARM_ID,
          itemId: KNOWN_IDS["Crimstone Rock"],
          counter: 0,
        },
      });

      const expectedCooldownTime =
        CRIMSTONE_RECOVERY_TIME - CRIMSTONE_RECOVERY_TIME * 0.8 * 0.85 * 0.75;

      expect(time).toEqual(now - expectedCooldownTime * 1000);
    });

    it("crimstone replenishes faster with Crimstone Clam", () => {
      const now = Date.now();

      const { time } = getMinedAt({
        game: {
          ...TEST_FARM,
          collectibles: {
            "Crimstone Clam": [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: now,
                id: "clam",
                readyAt: now,
              },
            ],
          },
        },
        createdAt: now,
        prngArgs: {
          farmId: FARM_ID,
          itemId: KNOWN_IDS["Crimstone Rock"],
          counter: 0,
        },
      });

      expect(time).toEqual(now - CRIMSTONE_RECOVERY_TIME * 0.1 * 1000);
    });

    it("instantly respawns with Crimstone Clam", () => {
      const now = Date.now();

      function getCounter() {
        let counter = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
          if (
            prngChance({
              farmId: FARM_ID,
              itemId: KNOWN_IDS["Crimstone Rock"],
              counter,
              chance: 10,
              criticalHitName: "Crimstone Clam",
            })
          ) {
            return counter;
          }
          counter++;
        }
      }

      const counter = getCounter();

      const { time } = getMinedAt({
        game: {
          ...TEST_FARM,
          collectibles: {
            "Crimstone Clam": [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: now,
                id: "clam",
                readyAt: now,
              },
            ],
          },
        },
        createdAt: now,
        prngArgs: {
          farmId: FARM_ID,
          itemId: KNOWN_IDS["Crimstone Rock"],
          counter,
        },
      });

      expect(time).toEqual(now - CRIMSTONE_RECOVERY_TIME * 1000);
    });
  });
});
