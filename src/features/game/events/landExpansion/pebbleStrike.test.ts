import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import { PebbleStrikeAction, strikePebble } from "./pebbleStrike";

const GAME_STATE: GameState = INITIAL_FARM;

describe("strikePebble", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("throws an error if the expansion does not exist", () => {
    expect(() =>
      strikePebble({
        state: {
          ...GAME_STATE,
        },
        action: {
          type: "pebble.struck",
          expansionIndex: -1,
          index: 2,
        },
      })
    ).toThrow("Expansion does not exist");
  });

  it("throws an error if the expansion has no pebbles", () => {
    expect(() =>
      strikePebble({
        state: {
          ...GAME_STATE,
          expansions: [{ createdAt: 0, readyAt: 0 }],
        },
        action: {
          type: "pebble.struck",
          expansionIndex: 0,
          index: 0,
        },
      })
    ).toThrow("Expansion does not have pebbles");
  });

  it("throws an error if pebble does not exist", () => {
    expect(() =>
      strikePebble({
        state: {
          ...GAME_STATE,
        },
        action: {
          type: "pebble.struck",
          expansionIndex: 0,
          index: 2,
        },
      })
    ).toThrow("No pebble");
  });

  it("throws an error if pebble is not ready", () => {
    const payload = {
      state: {
        ...GAME_STATE,
      },
      action: {
        type: "pebble.struck",
        expansionIndex: 0,
        index: 0,
      } as PebbleStrikeAction,
    };

    const game = strikePebble(payload);

    // Try same payload
    expect(() =>
      strikePebble({
        state: game,
        action: payload.action,
      })
    ).toThrow("Pebble is still recovering");
  });

  it("mines pebble", () => {
    const payload = {
      state: {
        ...GAME_STATE,
      },
      action: {
        type: "pebble.struck",
        expansionIndex: 0,
        index: 0,
      } as PebbleStrikeAction,
    };

    const game = strikePebble(payload);

    expect(game.inventory.Stone).toEqual(new Decimal(0.1));
  });

  it("mines pebble after waiting", () => {
    const payload = {
      state: {
        ...GAME_STATE,
      },
      action: {
        type: "pebble.struck",
        expansionIndex: 0,
        index: 0,
      } as PebbleStrikeAction,
    };

    let game = strikePebble(payload);
    // 31 minutes
    jest.advanceTimersByTime(31 * 60 * 1000);
    game = strikePebble({
      ...payload,
      state: game,
    });

    expect(game.inventory.Stone?.toNumber()).toBe(0.2);
  });
});
