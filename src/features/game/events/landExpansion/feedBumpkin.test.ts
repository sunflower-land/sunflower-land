import Decimal from "decimal.js-light";
import {
  INITIAL_BUMPKIN,
  INITIAL_FARM,
  MAX_STAMINA,
} from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { CONSUMABLES } from "features/game/types/consumables";
import { feedBumpkin } from "./feedBumpkin";
import { getBumpkinLevel } from "features/game/lib/level";

describe("feedBumpkin", () => {
  it("requires a bumpkin", () => {
    const state: GameState = { ...INITIAL_FARM, bumpkin: undefined };
    expect(() =>
      feedBumpkin({
        state,
        action: { type: "bumpkin.feed", food: "Boiled Egg" },
      })
    ).toThrow("You do not have a Bumpkin");
  });

  it("requires food is in inventory", () => {
    const state: GameState = { ...INITIAL_FARM, inventory: {} };
    expect(() =>
      feedBumpkin({
        state,
        action: { type: "bumpkin.feed", food: "Boiled Egg" },
      })
    ).toThrow("You have none of this food type");
  });

  it("deducts one food from inventory", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      inventory: { "Boiled Egg": new Decimal(2) },
    };

    const stateCopy = feedBumpkin({
      state,
      action: { type: "bumpkin.feed", food: "Boiled Egg" },
    });

    expect(stateCopy.inventory["Boiled Egg"]).toEqual(new Decimal(1));
  });

  it("adds experience", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      inventory: { "Boiled Egg": new Decimal(2) },
    };

    const stateCopy = feedBumpkin({
      state,
      action: { type: "bumpkin.feed", food: "Boiled Egg" },
    });

    expect(stateCopy.bumpkin?.experience).toBe(
      (state.bumpkin?.experience as number) +
        CONSUMABLES["Boiled Egg"].experience
    );
  });

  it("adds stamina", () => {
    const now = Date.now();

    const state: GameState = {
      ...INITIAL_FARM,
      inventory: { "Boiled Egg": new Decimal(2) },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        stamina: {
          value: 0,
          replenishedAt: now,
        },
      },
    };

    const stateCopy = feedBumpkin({
      state,
      action: { type: "bumpkin.feed", food: "Boiled Egg" },
      createdAt: now,
    });

    expect(stateCopy.bumpkin?.stamina.value).toBe(
      (state.bumpkin?.stamina.value as number) +
        CONSUMABLES["Boiled Egg"].stamina
    );
  });

  it("prevents stamina from going over max", () => {
    const now = Date.now();
    const maxStamina = MAX_STAMINA[getBumpkinLevel(INITIAL_BUMPKIN.experience)];

    const state: GameState = {
      ...INITIAL_FARM,
      inventory: { "Boiled Egg": new Decimal(2) },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        stamina: {
          value: maxStamina,
          replenishedAt: 0,
        },
      },
    };

    const stateCopy = feedBumpkin({
      state,
      action: { type: "bumpkin.feed", food: "Boiled Egg" },
      createdAt: now,
    });

    expect(stateCopy.bumpkin?.stamina.value).toBe(maxStamina);
  });

  it("replenishes stamina before before eating", () => {
    const now = Date.now();

    const state: GameState = {
      ...INITIAL_FARM,
      inventory: { "Boiled Egg": new Decimal(2) },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        stamina: {
          value: 0,
          replenishedAt: 0,
        },
      },
    };

    const stateCopy = feedBumpkin({
      state,
      action: { type: "bumpkin.feed", food: "Boiled Egg" },
      createdAt: now,
    });

    expect(stateCopy.bumpkin?.stamina.replenishedAt).toBe(now);
    expect(stateCopy.bumpkin?.stamina.value).toBe(
      MAX_STAMINA[getBumpkinLevel(INITIAL_BUMPKIN.experience)]
    );
  });

  it("provides 10% more experience with Kitchen Hand skill", () => {
    const result = feedBumpkin({
      state: {
        ...INITIAL_FARM,
        bumpkin: { ...INITIAL_BUMPKIN, skills: { "Kitchen Hand": 1 } },
        inventory: {
          "Boiled Egg": new Decimal(2),
        },
      },
      action: {
        type: "bumpkin.feed",
        food: "Boiled Egg",
      },
    });

    expect(result.bumpkin?.experience).toBe(1.1);
  });
});
