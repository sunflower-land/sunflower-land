import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "../lib/constants";
import { GameState } from "../types/game";
import { chopShrub, ChopShrubAction } from "./chopShrub";

const GAME_STATE: GameState = INITIAL_FARM;

describe("chop shrub", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  it("throws an error if shrub does not exist", () => {
    expect(() =>
      chopShrub({
        state: {
          ...GAME_STATE,
        },
        action: {
          type: "shrub.chopped",
          index: 1,
        } as ChopShrubAction,
      })
    ).toThrow("No shrub");
  });

  it("throws an error if shrub is not ready", () => {
    const payload = {
      state: {
        ...GAME_STATE,
      },
      action: {
        type: "shrub.chopped",
        index: 0,
      } as ChopShrubAction,
    };
    const game = chopShrub(payload);

    // Try same payload
    expect(() =>
      chopShrub({
        state: game,
        action: payload.action,
      })
    ).toThrow("Shrub is still growing");
  });

  it("chops a shrub", () => {
    const payload = {
      state: {
        ...GAME_STATE,
      },
      action: {
        type: "shrub.chopped",
        index: 0,
      } as ChopShrubAction,
    };
    const game = chopShrub(payload);

    expect(game.inventory.Wood).toEqual(new Decimal(0.1));
    expect(game.shrubs["0"].wood?.amount).toEqual(0.1);
  });

  it("mines shrub after waiting", () => {
    const payload = {
      state: {
        ...GAME_STATE,
      },
      action: {
        type: "shrub.chopped",
        index: 0,
      } as ChopShrubAction,
    };
    let game = chopShrub(payload);

    // 11 minutes
    jest.advanceTimersByTime(11 * 60 * 1000);

    game = chopShrub({
      ...payload,
      state: game,
    });

    expect(game.inventory.Wood?.toNumber()).toBe(0.2);
  });

  it("shrub replenishes normally", () => {
    const game = chopShrub({
      state: {
        ...GAME_STATE,
      },
      action: {
        type: "shrub.chopped",
        index: 0,
      } as ChopShrubAction,
    });

    // Should be set to now - add 5 ms to account for any CPU clock speed
    expect(game.shrubs[0].wood?.choppedAt).toBeGreaterThan(Date.now() - 5);
  });
});
