import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import {
  LanternOffering,
  LanternsCraftedByWeek,
} from "features/game/types/game";
import { craftLantern } from "./craftLantern";

const availableLantern: LanternOffering = {
  name: "Radiance Lantern",
  startAt: "2023-05-08T00:00:00.000Z",
  endAt: "2023-05-15T00:00:00.000Z",
  sfl: new Decimal(50),
  ingredients: {
    Carrot: new Decimal(200),
    Cauliflower: new Decimal(40),
    Beetroot: new Decimal(30),
    Cabbage: new Decimal(100),
    Wood: new Decimal(10),
  },
};

const currentWeek = 1;

describe("craftLantern", () => {
  it("throws an error if no bumpkin", () => {
    expect(() =>
      craftLantern({
        state: { ...TEST_FARM, bumpkin: undefined },
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
        state: TEST_FARM,
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
          ...TEST_FARM,
          dawnBreaker: {
            currentWeek,
            availableLantern,
            lanternsCraftedByWeek: {} as LanternsCraftedByWeek,
          },
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
          ...TEST_FARM,
          dawnBreaker: {
            currentWeek,
            availableLantern,
            lanternsCraftedByWeek: {} as LanternsCraftedByWeek,
          },
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
        ...TEST_FARM,
        dawnBreaker: {
          currentWeek,
          availableLantern,
          lanternsCraftedByWeek: {} as LanternsCraftedByWeek,
        },
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
        ...TEST_FARM,
        dawnBreaker: {
          currentWeek,
          availableLantern,
          lanternsCraftedByWeek: {} as LanternsCraftedByWeek,
        },
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

  it("adds lantern to lanternsCraftedByWeek", () => {
    const state = craftLantern({
      state: {
        ...TEST_FARM,
        dawnBreaker: {
          currentWeek,
          availableLantern,
          lanternsCraftedByWeek: {} as LanternsCraftedByWeek,
        },
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

    expect(state.dawnBreaker?.lanternsCraftedByWeek[currentWeek]).toBeDefined();
    expect(state.dawnBreaker?.lanternsCraftedByWeek[currentWeek]).toEqual(1);
  });

  it("increments lanternsCraftedByWeek", () => {
    const state = craftLantern({
      state: {
        ...TEST_FARM,
        dawnBreaker: {
          currentWeek,
          availableLantern,
          lanternsCraftedByWeek: {
            [currentWeek]: 1,
          } as LanternsCraftedByWeek,
        },
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

    expect(state.dawnBreaker?.lanternsCraftedByWeek[currentWeek]).toBeDefined();
    expect(state.dawnBreaker?.lanternsCraftedByWeek[currentWeek]).toEqual(2);
  });
});
