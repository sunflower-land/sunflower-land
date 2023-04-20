import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState, LanternOffering } from "features/game/types/game";
import { craftLantern } from "./craftLantern";

const GAME_STATE: GameState = TEST_FARM;

const lantern: LanternOffering = {
  name: "Radiance Lantern",
  startAt: "2023-05-08T00:00:00.000Z",
  endAt: "2023-05-15T00:00:00.000Z",
  sfl: new Decimal(50),
  ingredients: [
    {
      name: "Carrot",
      amount: new Decimal(200),
    },
    {
      name: "Cauliflower",
      amount: new Decimal(40),
    },
    {
      name: "Beetroot",
      amount: new Decimal(30),
    },
    {
      name: "Cabbage",
      amount: new Decimal(100),
    },
    {
      name: "Wood",
      amount: new Decimal(10),
    },
  ],
};

describe("craftLantern", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("throws an error if no bumpkin", () => {
    const { bumpkin, ...noBumpkinState } = TEST_FARM;

    expect(() =>
      craftLantern({
        state: noBumpkinState,
        action: {
          type: "lantern.crafted",
          name: "Luminous Lantern",
        },
      })
    ).toThrow("You do not have a Bumpkin");
  });

  it("throws an error if lantern is not currently available", () => {
    expect(() =>
      craftLantern({
        state: GAME_STATE,
        action: {
          type: "lantern.crafted",
          name: "Luminous Lantern",
        },
      })
    ).toThrow("Luminous Lantern is not currently available");
  });

  it("does not craft lantern if there is insufficient sfl", () => {
    expect(() =>
      craftLantern({
        state: {
          ...GAME_STATE,
          lantern,
          balance: new Decimal(10),
          inventory: {},
        },
        action: {
          type: "lantern.crafted",
          name: "Radiance Lantern",
        },
      })
    ).toThrow("Insufficient SFL balance");
  });

  it("does not craft lantern if there is insufficient ingredients", () => {
    expect(() =>
      craftLantern({
        state: {
          ...GAME_STATE,
          lantern,
          balance: new Decimal(50),
          inventory: {
            Carrot: new Decimal(200),
          },
        },
        action: {
          type: "lantern.crafted",
          name: "Radiance Lantern",
        },
      })
    ).toThrow("Insufficient ingredient: Cauliflower");
  });

  it("crafts a lantern", () => {
    const state = craftLantern({
      state: {
        ...GAME_STATE,
        lantern,
        balance: new Decimal(51),
        inventory: {
          Carrot: new Decimal(201),
          Cauliflower: new Decimal(41),
          Beetroot: new Decimal(31),
          Cabbage: new Decimal(101),
          Wood: new Decimal(10),
        },
      },
      action: {
        type: "lantern.crafted",
        name: "Radiance Lantern",
      },
    });

    expect(state.inventory["Radiance Lantern"]).toEqual(new Decimal(1));
    expect(state.balance).toEqual(new Decimal(1));
    expect(state.inventory.Carrot).toEqual(new Decimal(1));
    expect(state.inventory.Cauliflower).toEqual(new Decimal(1));
    expect(state.inventory.Beetroot).toEqual(new Decimal(1));
    expect(state.inventory.Cabbage).toEqual(new Decimal(1));
    expect(state.inventory.Wood).toEqual(new Decimal(0));
  });

  it("adds activity to bumpkin", () => {
    const state = craftLantern({
      state: {
        ...GAME_STATE,
        lantern,
        balance: new Decimal(51),
        inventory: {
          Carrot: new Decimal(201),
          Cauliflower: new Decimal(41),
          Beetroot: new Decimal(31),
          Cabbage: new Decimal(101),
          Wood: new Decimal(10),
        },
      },
      action: {
        type: "lantern.crafted",
        name: "Radiance Lantern",
      },
    });

    expect(state.bumpkin?.activity?.["Radiance Lantern Crafted"]).toEqual(1);
  });
});
