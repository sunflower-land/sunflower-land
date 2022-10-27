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
        action: { type: "bumpkin.feed", food: "Boiled Eggs" },
      })
    ).toThrow("You do not have a Bumpkin");
  });

  it("requires food is in inventory", () => {
    const state: GameState = { ...INITIAL_FARM, inventory: {} };
    expect(() =>
      feedBumpkin({
        state,
        action: { type: "bumpkin.feed", food: "Boiled Eggs" },
      })
    ).toThrow("You have none of this food type");
  });

  it("deducts one food from inventory", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      inventory: { "Boiled Eggs": new Decimal(2) },
    };

    const stateCopy = feedBumpkin({
      state,
      action: { type: "bumpkin.feed", food: "Boiled Eggs" },
    });

    expect(stateCopy.inventory["Boiled Eggs"]).toEqual(new Decimal(1));
  });

  it("adds experience", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      inventory: { "Boiled Eggs": new Decimal(2) },
    };

    const stateCopy = feedBumpkin({
      state,
      action: { type: "bumpkin.feed", food: "Boiled Eggs" },
    });

    expect(stateCopy.bumpkin?.experience).toBe(
      (state.bumpkin?.experience as number) +
        CONSUMABLES["Boiled Eggs"].experience
    );
  });

  it("adds stamina", () => {
    const now = Date.now();

    const state: GameState = {
      ...INITIAL_FARM,
      inventory: { "Boiled Eggs": new Decimal(2) },
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
      action: { type: "bumpkin.feed", food: "Boiled Eggs" },
      createdAt: now,
    });

    expect(stateCopy.bumpkin?.stamina.value).toBe(
      (state.bumpkin?.stamina.value as number) +
        CONSUMABLES["Boiled Eggs"].stamina
    );
  });

  it("prevents stamina from going over max", () => {
    const now = Date.now();
    const maxStamina = MAX_STAMINA[getBumpkinLevel(INITIAL_BUMPKIN.experience)];

    const state: GameState = {
      ...INITIAL_FARM,
      inventory: { "Boiled Eggs": new Decimal(2) },
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
      action: { type: "bumpkin.feed", food: "Boiled Eggs" },
      createdAt: now,
    });

    expect(stateCopy.bumpkin?.stamina.value).toBe(maxStamina);
  });

  it("replenishes stamina before before eating", () => {
    const now = Date.now();

    const state: GameState = {
      ...INITIAL_FARM,
      inventory: { "Boiled Eggs": new Decimal(2) },
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
      action: { type: "bumpkin.feed", food: "Boiled Eggs" },
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
          "Boiled Eggs": new Decimal(2),
        },
      },
      action: {
        type: "bumpkin.feed",
        food: "Boiled Eggs",
      },
    });

    expect(result.bumpkin?.experience).toBe(1.1);
  });
});
