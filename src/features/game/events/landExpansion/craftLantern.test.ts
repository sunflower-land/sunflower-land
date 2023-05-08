import Decimal from "decimal.js-light";
import {
  LanternOffering,
  LanternsCraftedByWeek,
} from "features/game/types/game";
import { craftLantern } from "./craftLantern";
import { TEST_FARM } from "features/game/lib/constants";

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
            answeredRiddleIds: [],
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
            answeredRiddleIds: [],
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
          answeredRiddleIds: [],
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

  it("requires 2x the requirements for the second lantern crafted during a week", () => {
    // Requirements x2
    // sfl: new Decimal(100),
    // Carrot: new Decimal(400),
    // Cauliflower: new Decimal(80),
    // Beetroot: new Decimal(60),
    // Cabbage: new Decimal(200),
    // Wood: new Decimal(20),
    const state = craftLantern({
      state: {
        ...TEST_FARM,
        dawnBreaker: {
          currentWeek,
          availableLantern,
          lanternsCraftedByWeek: {
            [currentWeek]: 1,
          } as LanternsCraftedByWeek,
          answeredRiddleIds: [],
        },
        balance: new Decimal(200),
        inventory: {
          Carrot: new Decimal(500),
          Cauliflower: new Decimal(100),
          Beetroot: new Decimal(100),
          Cabbage: new Decimal(300),
          Wood: new Decimal(50),
          "Radiance Lantern": new Decimal(4),
        },
      },
      action: {
        type: "lantern.crafted",
        name: "Radiance Lantern",
      },
    });

    expect(state.inventory["Radiance Lantern"]).toEqual(new Decimal(5));
    expect(state.balance).toEqual(new Decimal(100));
    expect(state.inventory.Carrot).toEqual(new Decimal(100));
    expect(state.inventory.Cauliflower).toEqual(new Decimal(20));
    expect(state.inventory.Beetroot).toEqual(new Decimal(40));
    expect(state.inventory.Cabbage).toEqual(new Decimal(100));
    expect(state.inventory.Wood).toEqual(new Decimal(30));
  });

  it("requires 3x the requirements for the third lantern crafted during a week", () => {
    // Requirements x3
    // sfl: new Decimal(150),
    // Carrot: new Decimal(600),
    // Cauliflower: new Decimal(120),
    // Beetroot: new Decimal(90),
    // Cabbage: new Decimal(300),
    // Wood: new Decimal(30),
    const state = craftLantern({
      state: {
        ...TEST_FARM,
        dawnBreaker: {
          currentWeek,
          availableLantern,
          lanternsCraftedByWeek: {
            [currentWeek]: 2,
          } as LanternsCraftedByWeek,
          answeredRiddleIds: [],
        },
        balance: new Decimal(200),
        inventory: {
          Carrot: new Decimal(601),
          Cauliflower: new Decimal(150),
          Beetroot: new Decimal(100),
          Cabbage: new Decimal(301),
          Wood: new Decimal(50),
          "Radiance Lantern": new Decimal(4),
        },
      },
      action: {
        type: "lantern.crafted",
        name: "Radiance Lantern",
      },
    });

    expect(state.inventory["Radiance Lantern"]).toEqual(new Decimal(5));
    expect(state.balance).toEqual(new Decimal(50));
    expect(state.inventory.Carrot).toEqual(new Decimal(1));
    expect(state.inventory.Cauliflower).toEqual(new Decimal(30));
    expect(state.inventory.Beetroot).toEqual(new Decimal(10));
    expect(state.inventory.Cabbage).toEqual(new Decimal(1));
    expect(state.inventory.Wood).toEqual(new Decimal(20));
  });

  it("halves sfl cost if player has a Dawn Breaker Banner (Season Pass)", () => {
    const state = craftLantern({
      state: {
        ...TEST_FARM,
        dawnBreaker: {
          currentWeek,
          availableLantern,
          lanternsCraftedByWeek: {} as LanternsCraftedByWeek,
          answeredRiddleIds: [],
        },
        balance: new Decimal(200),
        inventory: {
          "Dawn Breaker Banner": new Decimal(1),
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
    expect(state.balance).toEqual(new Decimal(162.5));
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
          answeredRiddleIds: [],
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
          answeredRiddleIds: [],
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
          answeredRiddleIds: [],
        },
        balance: new Decimal(100),
        inventory: {
          Carrot: new Decimal(500),
          Cauliflower: new Decimal(100),
          Beetroot: new Decimal(100),
          Cabbage: new Decimal(300),
          Wood: new Decimal(50),
          "Radiance Lantern": new Decimal(4),
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
