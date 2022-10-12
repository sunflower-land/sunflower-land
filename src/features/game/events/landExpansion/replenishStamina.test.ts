import {
  INITIAL_BUMPKIN,
  INITIAL_FARM,
  MAX_STAMINA,
} from "features/game/lib/constants";
import { LEVEL_BRACKETS } from "features/game/lib/level";
import { PlacedItem } from "features/game/types/game";
import { replenishStamina } from "./replenishStamina";

describe("replenishStamina", () => {
  const dateNow = Date.now();

  it("updates the replenished timestamp to the current time", () => {
    const initialState = { ...INITIAL_FARM, bumpkin: INITIAL_BUMPKIN };

    const state = replenishStamina({
      state: initialState,
      action: {
        type: "bumpkin.replenishStamina",
      },
      createdAt: dateNow,
    });

    expect(initialState.bumpkin.stamina.replenishedAt).toBe(0);
    expect(state.bumpkin?.stamina.replenishedAt).toBe(dateNow);
  });

  it("throws an error if the bumpkin doesn't exist", () => {
    expect(() =>
      replenishStamina({
        state: { ...INITIAL_FARM, bumpkin: undefined },
        action: {
          type: "bumpkin.replenishStamina",
        },
        createdAt: dateNow,
      })
    ).toThrow("You do not have a Bumpkin");
  });

  it("does not increase the stamina if already max", () => {
    const bumpkinLevel = 2;
    const levelTwoExperience = LEVEL_BRACKETS[bumpkinLevel];
    const levelTwoStamina = MAX_STAMINA[bumpkinLevel];

    const initialState = {
      ...INITIAL_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        experience: levelTwoExperience,
        stamina: {
          value: levelTwoStamina,
          replenishedAt: 0,
        },
      },
    };

    const state = replenishStamina({
      state: initialState,
      action: {
        type: "bumpkin.replenishStamina",
      },
      createdAt: dateNow,
    });

    expect(state.bumpkin?.stamina.value).toBe(levelTwoStamina);
  });

  it("sets stamina to max when last replenished at is epoch", () => {
    const bumpkinLevel = 2;
    const levelTwoExperience = LEVEL_BRACKETS[2];

    const initialState = {
      ...INITIAL_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        experience: levelTwoExperience,
        stamina: {
          value: 0,
          replenishedAt: 0,
        },
      },
    };

    const state = replenishStamina({
      state: initialState,
      action: {
        type: "bumpkin.replenishStamina",
      },
      createdAt: dateNow,
    });

    expect(state.bumpkin?.stamina.value).toBe(MAX_STAMINA[bumpkinLevel]);
  });

  it("does not increase stamina if time has not elapsed", () => {
    const initialState = {
      ...INITIAL_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        stamina: {
          value: 0,
          replenishedAt: dateNow,
        },
      },
    };

    const state = replenishStamina({
      state: initialState,
      action: {
        type: "bumpkin.replenishStamina",
      },
      createdAt: dateNow,
    });

    expect(state.bumpkin?.stamina.value).toBe(0);
  });

  it("restores 50% of stamina in 30 minutes for a level 1 player", () => {
    const thirtyMinutes = 30 * 60 * 1000;

    const initialState = {
      ...INITIAL_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        stamina: {
          value: 0,
          replenishedAt: dateNow - thirtyMinutes,
        },
      },
    };

    const state = replenishStamina({
      state: initialState,
      action: {
        type: "bumpkin.replenishStamina",
      },
      createdAt: dateNow,
    });

    expect(state.bumpkin?.stamina.value).toBe(MAX_STAMINA[1] / 2);
  });

  it("restores 100% of stamina in 1 hour for a level 1 player", () => {
    const oneHour = 1 * 60 * 60 * 1000;

    const initialState = {
      ...INITIAL_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        stamina: {
          value: 0,
          replenishedAt: dateNow - oneHour,
        },
      },
    };

    const state = replenishStamina({
      state: initialState,
      action: {
        type: "bumpkin.replenishStamina",
      },
      createdAt: dateNow,
    });

    expect(state.bumpkin?.stamina.value).toBe(MAX_STAMINA[1]);
  });

  it("restores more total stamina to a level 2 bumpkin in 30 minutes than level 1 bumpkin", () => {
    const thirtyMinutes = 30 * 60 * 1000;
    const bumpkin1Level = 1;
    const bumpkin2Level = 2;

    const farm1InitialState = {
      ...INITIAL_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        experience: LEVEL_BRACKETS[bumpkin1Level],
        stamina: {
          value: 0,
          replenishedAt: dateNow - thirtyMinutes,
        },
      },
    };

    const farm2InitialState = {
      ...INITIAL_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        experience: LEVEL_BRACKETS[bumpkin2Level],
        stamina: {
          value: 0,
          replenishedAt: dateNow - thirtyMinutes,
        },
      },
    };

    const farm1State = replenishStamina({
      state: farm1InitialState,
      action: {
        type: "bumpkin.replenishStamina",
      },
      createdAt: dateNow,
    });
    const farm2State = replenishStamina({
      state: farm2InitialState,
      action: {
        type: "bumpkin.replenishStamina",
      },
      createdAt: dateNow,
    });

    expect(farm2State.bumpkin?.stamina.value).toBeGreaterThan(
      farm1State.bumpkin?.stamina.value as number
    );
  });

  it("takes longer to reach full staminal for a level 2 bumpkin than to a level 1 bumpkin", () => {
    const thirtyMinutes = 30 * 60 * 1000;
    const bumpkin1Level = 1;
    const bumpkin2Level = 2;

    const farm1InitialState = {
      ...INITIAL_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        experience: LEVEL_BRACKETS[bumpkin1Level],
        stamina: {
          value: 0,
          replenishedAt: dateNow - thirtyMinutes,
        },
      },
    };

    const farm2InitialState = {
      ...INITIAL_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        experience: LEVEL_BRACKETS[bumpkin2Level],
        stamina: {
          value: 0,
          replenishedAt: dateNow - thirtyMinutes,
        },
      },
    };
    const farm1State = replenishStamina({
      state: farm1InitialState,
      action: {
        type: "bumpkin.replenishStamina",
      },
      createdAt: dateNow,
    });
    const farm2State = replenishStamina({
      state: farm2InitialState,
      action: {
        type: "bumpkin.replenishStamina",
      },
      createdAt: dateNow,
    });

    expect(
      (farm2State.bumpkin?.stamina.value as number) / MAX_STAMINA[bumpkin2Level]
    ).toBeLessThan(
      (farm1State.bumpkin?.stamina.value as number) / MAX_STAMINA[bumpkin1Level]
    );
  });

  it("prevents createdAt to be after replenishedAt", () => {
    const oneHour = 1 * 60 * 60 * 1000;

    const initialState = {
      ...INITIAL_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        stamina: {
          value: 0,
          replenishedAt: dateNow,
        },
      },
    };

    expect(() =>
      replenishStamina({
        state: initialState,
        action: {
          type: "bumpkin.replenishStamina",
        },
        createdAt: dateNow - oneHour,
      })
    ).toThrow("Actions cannot go back in time");
  });

  it("restores 100% of stamina in under 55 minutes for a level 1 player", () => {
    const oneHour = 54.6 * 60 * 1000;

    const tent: PlacedItem = {
      coordinates: {
        x: 0,
        y: 0,
      },
      createdAt: 0,
      id: "123",
      readyAt: 0,
    };

    const initialState = {
      ...INITIAL_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        stamina: {
          value: 0,
          replenishedAt: dateNow - oneHour,
        },
      },
      buildings: { Tent: [tent] },
    };

    const state = replenishStamina({
      state: initialState,
      action: {
        type: "bumpkin.replenishStamina",
      },
      createdAt: dateNow,
    });

    expect(state.bumpkin?.stamina.value).toBe(MAX_STAMINA[1]);
  });

  it("restores 10% more stamina with tent in 30 minutes", () => {
    const thirtyMinutes = 30 * 60 * 1000;
    const bumpkinLevel = 1;

    const tent: PlacedItem = {
      coordinates: {
        x: 0,
        y: 0,
      },
      createdAt: 0,
      id: "123",
      readyAt: 0,
    };

    const farm1InitialState = {
      ...INITIAL_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        experience: LEVEL_BRACKETS[bumpkinLevel],
        stamina: {
          value: 0,
          replenishedAt: dateNow - thirtyMinutes,
        },
      },
      buildings: { Tent: [tent] },
    };

    const farm2InitialState = {
      ...INITIAL_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        experience: LEVEL_BRACKETS[bumpkinLevel],
        stamina: {
          value: 0,
          replenishedAt: dateNow - thirtyMinutes,
        },
      },
    };

    const farm1State = replenishStamina({
      state: farm1InitialState,
      action: {
        type: "bumpkin.replenishStamina",
      },
      createdAt: dateNow,
    });
    const farm2State = replenishStamina({
      state: farm2InitialState,
      action: {
        type: "bumpkin.replenishStamina",
      },
      createdAt: dateNow,
    });

    // only one decimal
    const oneDecimalStamina = Number(
      farm1State.bumpkin?.stamina.value.toFixed(1)
    );

    expect(oneDecimalStamina).toBe(5.5);
    expect(farm2State.bumpkin?.stamina.value).toBe(5);
  });
});
