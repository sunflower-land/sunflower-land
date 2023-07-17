import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { mixPotion } from "./mixPotion";
import Decimal from "decimal.js-light";
import { POTIONS } from "features/game/expansion/components/potions/lib/potions";

describe("mixPotion", () => {
  const GAME_STATE = {
    ...TEST_FARM,
    bumpkin: INITIAL_BUMPKIN,
    inventory: {
      ...TEST_FARM,
      Sunflower: new Decimal(1000),
      Potato: new Decimal(1000),
      Carrot: new Decimal(1000),
      Cauliflower: new Decimal(1000),
      Wheat: new Decimal(1000),
      Wood: new Decimal(1000),
      Stone: new Decimal(1000),
      Gold: new Decimal(1000),
    },
  };

  it("starts the first game", () => {
    const newState = mixPotion({
      state: GAME_STATE,
      action: {
        type: "potion.mixed",
        attemptNumber: 1,
        potions: ["Happy Hooch", "Happy Hooch", "Happy Hooch", "Happy Hooch"],
      },
    });

    expect(newState.potionHouse?.game.status).toEqual("in_progress");
  });

  it("prevents the same row being attempted twice", () => {
    const firstState = mixPotion({
      state: GAME_STATE,
      action: {
        type: "potion.mixed",
        attemptNumber: 1,
        potions: ["Happy Hooch", "Happy Hooch", "Happy Hooch", "Happy Hooch"],
      },
    });

    expect(() =>
      mixPotion({
        state: firstState,

        action: {
          type: "potion.mixed",
          attemptNumber: 1,
          potions: ["Happy Hooch", "Happy Hooch", "Happy Hooch", "Happy Hooch"],
        },
      })
    ).toThrowError("Attempt 1 has already been made");
  });

  it("prevents the second attempt being made before the first", () => {
    expect(() =>
      mixPotion({
        state: GAME_STATE,

        action: {
          type: "potion.mixed",
          attemptNumber: 2,
          potions: ["Happy Hooch", "Happy Hooch", "Happy Hooch", "Happy Hooch"],
        },
      })
    ).toThrowError("Attempt 1 has not been made yet");
  });

  it("allows a second attempt to be made", () => {
    const firstState = mixPotion({
      state: GAME_STATE,

      action: {
        type: "potion.mixed",
        attemptNumber: 1,
        potions: ["Happy Hooch", "Happy Hooch", "Happy Hooch", "Happy Hooch"],
      },
    });

    const secondState = mixPotion({
      state: firstState,

      action: {
        type: "potion.mixed",
        attemptNumber: 2,
        potions: ["Happy Hooch", "Happy Hooch", "Happy Hooch", "Happy Hooch"],
      },
    });

    expect(secondState.potionHouse?.game.attempts).toEqual([
      [
        { potion: "Happy Hooch", status: "pending" },
        { potion: "Happy Hooch", status: "pending" },
        { potion: "Happy Hooch", status: "pending" },
        { potion: "Happy Hooch", status: "pending" },
      ],
      [
        { potion: "Happy Hooch", status: "pending" },
        { potion: "Happy Hooch", status: "pending" },
        { potion: "Happy Hooch", status: "pending" },
        { potion: "Happy Hooch", status: "pending" },
      ],
    ]);
  });

  it("prevents a fourth attempt being made", () => {
    const firstState = mixPotion({
      state: GAME_STATE,

      action: {
        type: "potion.mixed",
        attemptNumber: 1,
        potions: ["Happy Hooch", "Happy Hooch", "Happy Hooch", "Happy Hooch"],
      },
    });

    const secondState = mixPotion({
      state: firstState,

      action: {
        type: "potion.mixed",
        attemptNumber: 2,
        potions: ["Happy Hooch", "Happy Hooch", "Happy Hooch", "Happy Hooch"],
      },
    });

    expect(() =>
      mixPotion({
        state: secondState,

        action: {
          type: "potion.mixed",
          attemptNumber: 4 as any,
          potions: ["Happy Hooch", "Happy Hooch", "Happy Hooch", "Happy Hooch"],
        },
      })
    ).toThrowError("Attempt 3 is the last attempt");
  });

  it("resets the attempts when starting the second game", () => {
    const state = mixPotion({
      state: {
        ...GAME_STATE,
        potionHouse: {
          game: {
            status: "finished",
            attempts: [
              [
                { potion: "Happy Hooch", status: "pending" },
                { potion: "Happy Hooch", status: "pending" },
                { potion: "Happy Hooch", status: "pending" },
                { potion: "Happy Hooch", status: "pending" },
              ],
              [
                { potion: "Happy Hooch", status: "pending" },
                { potion: "Happy Hooch", status: "pending" },
                { potion: "Happy Hooch", status: "pending" },
                { potion: "Happy Hooch", status: "pending" },
              ],
              [
                { potion: "Happy Hooch", status: "pending" },
                { potion: "Happy Hooch", status: "pending" },
                { potion: "Happy Hooch", status: "pending" },
                { potion: "Happy Hooch", status: "pending" },
              ],
            ],
          },
          history: {},
        },
      },

      action: {
        type: "potion.mixed",
        attemptNumber: 1,
        potions: ["Happy Hooch", "Happy Hooch", "Happy Hooch", "Happy Hooch"],
      },
    });

    expect(state.potionHouse?.game.attempts).toStrictEqual([
      [
        { potion: "Happy Hooch", status: "pending" },
        { potion: "Happy Hooch", status: "pending" },
        { potion: "Happy Hooch", status: "pending" },
        { potion: "Happy Hooch", status: "pending" },
      ],
    ]);
  });

  it("prevents third guess on a finished game", () => {
    expect(() =>
      mixPotion({
        state: {
          ...GAME_STATE,
          potionHouse: {
            game: {
              status: "finished",
              attempts: [
                [
                  { potion: "Happy Hooch", status: "pending" },
                  { potion: "Happy Hooch", status: "pending" },
                  { potion: "Happy Hooch", status: "pending" },
                  { potion: "Happy Hooch", status: "pending" },
                ],
                [
                  { potion: "Happy Hooch", status: "pending" },
                  { potion: "Happy Hooch", status: "pending" },
                  { potion: "Happy Hooch", status: "pending" },
                  { potion: "Happy Hooch", status: "pending" },
                ],
              ],
            },
            history: {},
          },
        },

        action: {
          type: "potion.mixed",
          attemptNumber: 3,
          potions: ["Happy Hooch", "Happy Hooch", "Flower Power", "Dream Drip"],
        },
      })
    ).toThrowError("Cannot mix potion on a finished game");
  });

  it("deducts Flower Power ingredients from inventory", () => {
    const state = mixPotion({
      state: {
        ...GAME_STATE,
        inventory: {
          Sunflower: new Decimal(100),
          Cauliflower: new Decimal(50),
        },
        potionHouse: {
          game: {
            status: "in_progress",
            attempts: [],
          },
          history: {},
        },
      },

      action: {
        type: "potion.mixed",
        attemptNumber: 1,
        potions: [
          "Flower Power",
          "Flower Power",
          "Flower Power",
          "Flower Power",
        ],
      },
    });

    const potionIngredients = {
      sunflowers: POTIONS["Flower Power"].ingredients.Sunflower,
      cauliflowers: POTIONS["Flower Power"].ingredients.Cauliflower,
    };

    expect(state.inventory.Sunflower?.toNumber()).toBe(
      new Decimal(state.inventory.Sunflower?.toNumber() ?? 0)
        .sub(potionIngredients.sunflowers!.mul(4))
        .toNumber()
    );
    expect(state.inventory.Cauliflower?.toNumber()).toBe(
      new Decimal(50).sub(potionIngredients.cauliflowers!.mul(4)).toNumber()
    );
  });

  it("deducts Flower Power ingredients from inventory", () => {
    const state = mixPotion({
      state: {
        ...GAME_STATE,
        inventory: {
          Sunflower: new Decimal(100),
          Cauliflower: new Decimal(50),
          Potato: new Decimal(100),
        },
        potionHouse: {
          game: {
            status: "in_progress",
            attempts: [],
          },
          history: {},
        },
      },

      action: {
        type: "potion.mixed",
        attemptNumber: 1,
        potions: ["Bloom Boost", "Bloom Boost", "Flower Power", "Flower Power"],
      },
    });

    const sunflowerRequirements = POTIONS[
      "Flower Power"
    ].ingredients.Sunflower!.add(POTIONS["Bloom Boost"].ingredients.Sunflower!);

    expect(state.inventory.Sunflower?.toNumber()).toBe(
      new Decimal(100).sub(sunflowerRequirements.mul(2)).toNumber()
    );
    expect(state.inventory.Cauliflower?.toNumber()).toBe(
      new Decimal(50)
        .sub(POTIONS["Flower Power"].ingredients.Cauliflower!.mul(2))
        .toNumber()
    );
    expect(state.inventory.Potato?.toNumber()).toBe(
      new Decimal(100)
        .sub(POTIONS["Bloom Boost"].ingredients.Potato!.mul(2))
        .toNumber()
    );
  });
});
