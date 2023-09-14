import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { startAdvancedComposter } from "./startAdvancedComposter";

const GAME_STATE: GameState = TEST_FARM;

describe("start AdvancedComposter", () => {
  const dateNow = Date.now();

  it("throws an error if Composter does not exist", () => {
    expect(() =>
      startAdvancedComposter({
        state: GAME_STATE,
        action: { type: "advancedComposter.started" },
      })
    ).toThrow("Composter does not exist");
  });

  it("throws an error if Advanced Composter is already started", () => {
    expect(() =>
      startAdvancedComposter({
        state: {
          ...GAME_STATE,
          buildings: {
            "Advanced Composter": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                id: "0",
                producing: {
                  name: "Grub",
                  startedAt: dateNow - 10000,
                  readyAt: dateNow + 1000,
                },
              },
            ],
          },
        },
        action: { type: "advancedComposter.started" },
      })
    ).toThrow("Composter is already composting");
  });

  it("throws an error if the user does not have the requirements", () => {
    expect(() =>
      startAdvancedComposter({
        state: {
          ...GAME_STATE,
          buildings: {
            "Advanced Composter": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                id: "0",
                producing: {
                  name: "Grub",
                  startedAt: dateNow - 10000,
                  readyAt: dateNow - 1000,
                },
              },
            ],
          },
        },
        action: { type: "advancedComposter.started" },
      })
    ).toThrow("Missing requirements");
  });

  it("removes ingredients from inventory", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Kale: new Decimal(5),
        Egg: new Decimal(1),
      },
      buildings: {
        "Advanced Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
    };

    const newState = startAdvancedComposter({
      state,
      action: { type: "advancedComposter.started" },
    });

    expect(newState.inventory.Kale).toStrictEqual(new Decimal(0));
    expect(newState.inventory.Egg).toStrictEqual(new Decimal(0));
  });

  it("starts AdvancedComposters", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Kale: new Decimal(5),
        Egg: new Decimal(1),
      },
      buildings: {
        "Advanced Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
    };

    const newState = startAdvancedComposter({
      createdAt: dateNow,
      state,
      action: { type: "advancedComposter.started" },
    });

    expect(
      newState.buildings["Advanced Composter"]?.[0].producing?.startedAt
    ).toBe(dateNow);
    expect(
      newState.buildings["Advanced Composter"]?.[0].producing?.readyAt
    ).toBe(dateNow + 8 * 60 * 60 * 1000);
  });
});
