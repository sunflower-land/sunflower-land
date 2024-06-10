import "lib/__mocks__/configMock";

import { TEST_FARM } from "../lib/constants";
import { BUMPKIN_WITHDRAWABLES, WITHDRAWABLES } from "./withdrawables";
import { GameState } from "./game";

describe("withdrawables", () => {
  const dateNow = Date.now();

  describe("prevents", () => {
    beforeEach(() => {
      jest.useRealTimers();
    });

    it("prevents users from withdrawing seeds", () => {
      const enabled = WITHDRAWABLES["Sunflower Seed"]();
      expect(enabled).toBeFalsy();
    });

    it("prevents users from withdrawing tools", () => {
      const enabled = WITHDRAWABLES["Axe"]();
      expect(enabled).toBeFalsy();
    });

    it("prevents users from withdrawing skills", () => {
      const enabled = WITHDRAWABLES["Green Thumb"]();
      expect(enabled).toBeFalsy();
    });

    it("prevents users from withdrawing food items", () => {
      const enabled = WITHDRAWABLES["Pumpkin Soup"]();
      expect(enabled).toBeFalsy();
    });

    it("prevents a quest item being withdrawn", () => {
      const enabled = WITHDRAWABLES["Ancient Goblin Sword"]();
      expect(enabled).toBeFalsy();
    });

    it("prevents shovels from being withdrawn", () => {
      const enabled = WITHDRAWABLES["Rusty Shovel"]();
      expect(enabled).toBeFalsy();
    });

    it("prevent a user to withdraw a human war banner", () => {
      const enabled = WITHDRAWABLES["Human War Banner"]();
      expect(enabled).toBeFalsy();
    });

    it("prevent a user to withdraw a goblin war banner", () => {
      const enabled = WITHDRAWABLES["Goblin War Banner"]();
      expect(enabled).toBeFalsy();
    });

    it("prevent a user to withdraw a building", () => {
      const enabled = WITHDRAWABLES["Fire Pit"]();
      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing chickens", () => {
      const enabled = WITHDRAWABLES["Chicken"]();
      expect(enabled).toBeFalsy();
    });

    it("prevents a time based item from being withdrawn when before the available time", () => {
      const timers = jest.useFakeTimers();
      timers.setSystemTime(new Date("Thu August 7 2023 10:01:00 GMT+1000"));

      const enabled = BUMPKIN_WITHDRAWABLES["Pan"]();
      expect(enabled).toBeFalsy();
    });

    it("prevents a seasonal non timebased item from being withdrawn before season has ended", () => {
      const timers = jest.useFakeTimers();
      timers.setSystemTime(new Date("Thu July 7 2023 10:01:00 GMT+1000"));

      const enabled = WITHDRAWABLES["Turbo Sprout"]();
      expect(enabled).toBeFalsy();
    });

    it("prevents withdrawal of Fruit Picker Apron when fruit trees are planted", () => {
      const state: GameState = {
        ...TEST_FARM,
        fruitPatches: {
          1: {
            width: 2,
            x: -12,
            y: 12,
            fruit: {
              name: "Apple",
              harvestsLeft: 2,
              amount: 1.35,
              harvestedAt: dateNow,
              plantedAt: 0,
            },
            height: 2,
          },
        },
      };

      const enabled = BUMPKIN_WITHDRAWABLES["Fruit Picker Apron"](state);
      expect(enabled).toBeFalsy();
    });

    it("prevents withdrawal of Eggplant Onesie when eggplants are planted", () => {
      const state: GameState = {
        ...TEST_FARM,
        crops: {
          "1": {
            x: 14,
            width: 1,
            createdAt: 1680494833651,
            y: 8,
            crop: {
              name: "Eggplant",
              amount: 1,
              id: "1",
              plantedAt: dateNow,
            },
            height: 1,
          },
        },
      };

      const enabled = BUMPKIN_WITHDRAWABLES["Eggplant Onesie"](state);
      expect(enabled).toBeFalsy();
    });

    it("prevents withdrawal of Parsnip when parsnips are planted", () => {
      const state: GameState = {
        ...TEST_FARM,
        crops: {
          "1": {
            x: 14,
            width: 1,
            createdAt: 1680494833651,
            y: 8,
            crop: {
              name: "Parsnip",
              amount: 1,
              id: "1",
              plantedAt: dateNow,
            },
            height: 1,
          },
        },
      };

      const enabled = BUMPKIN_WITHDRAWABLES["Parsnip"](state);
      expect(enabled).toBeFalsy();
    });

    it("prevents withdrawal of Sunflower Amulet when Sunflowers are planted", () => {
      const state: GameState = {
        ...TEST_FARM,
        crops: {
          "1": {
            x: 14,
            width: 1,
            createdAt: 1680494833651,
            y: 8,
            crop: {
              name: "Sunflower",
              amount: 1,
              id: "1",
              plantedAt: dateNow,
            },
            height: 1,
          },
        },
      };

      const enabled = BUMPKIN_WITHDRAWABLES["Sunflower Amulet"](state);
      expect(enabled).toBeFalsy();
    });

    it("prevents withdrawal of Carrot Amulet when Carrots are planted", () => {
      const state: GameState = {
        ...TEST_FARM,
        crops: {
          "1": {
            x: 14,
            width: 1,
            createdAt: 1680494833651,
            y: 8,
            crop: {
              name: "Carrot",
              amount: 1,
              id: "1",
              plantedAt: dateNow,
            },
            height: 1,
          },
        },
      };

      const enabled = BUMPKIN_WITHDRAWABLES["Carrot Amulet"](state);
      expect(enabled).toBeFalsy();
    });

    it("prevents withdrawal of Beetroot Amulet when Beetroots are planted", () => {
      const state: GameState = {
        ...TEST_FARM,
        crops: {
          "1": {
            x: 14,
            width: 1,
            createdAt: 1680494833651,
            y: 8,
            crop: {
              name: "Beetroot",
              amount: 1,
              id: "1",
              plantedAt: dateNow,
            },
            height: 1,
          },
        },
      };

      const enabled = BUMPKIN_WITHDRAWABLES["Beetroot Amulet"](state);
      expect(enabled).toBeFalsy();
    });

    it("prevents withdrawal of Green Amulet when any crops are planted", () => {
      const state: GameState = {
        ...TEST_FARM,
        crops: {
          "1": {
            x: 14,
            width: 1,
            createdAt: 1680494833651,
            y: 8,
            crop: {
              name: "Beetroot",
              amount: 1,
              id: "1",
              plantedAt: dateNow,
            },
            height: 1,
          },
        },
      };

      const enabled = BUMPKIN_WITHDRAWABLES["Green Amulet"](state);
      expect(enabled).toBeFalsy();
    });

    it("prevents users from withdrawing trees", () => {
      const enabled = WITHDRAWABLES["Tree"]();
      expect(enabled).toBeFalsy();
    });

    it("prevents users to withdraw easter eggs", () => {
      const enabled = WITHDRAWABLES["Red Egg"]();
      expect(enabled).toBeFalsy();
    });

    it("prevents users from withdrawing basic bear", () => {
      const enabled = WITHDRAWABLES["Basic Bear"]();
      expect(enabled).toBeFalsy();
    });

    it("prevents withdrawal of Cattlegrim when no chickens are fed", () => {
      // Item is time restriction is over
      const timers = jest.useFakeTimers();
      timers.setSystemTime(new Date("Thu October 7 2023 10:01:00 GMT+1000"));

      const state: GameState = {
        ...TEST_FARM,
        chickens: {
          1: {
            coordinates: {
              x: 5,
              y: 10,
            },
            fedAt: Date.now(),
            multiplier: 1,
          },
        },
      };

      const enabled = BUMPKIN_WITHDRAWABLES["Cattlegrim"](state);
      expect(enabled).toBeFalsy();
    });

    it("prevents withdrawal of Infernal Pitchfork when any crops are planted", () => {
      const timers = jest.useFakeTimers();
      timers.setSystemTime(new Date("Thu October 30 2023 10:01:00 GMT+1000"));

      const state: GameState = {
        ...TEST_FARM,
        crops: {
          "1": {
            x: 14,
            width: 1,
            createdAt: 1680494833651,
            y: 8,
            height: 1,
            crop: {
              name: "Beetroot",
              amount: 1,
              id: "1",
              plantedAt: dateNow,
            },
          },
        },
      };

      const enabled = BUMPKIN_WITHDRAWABLES["Infernal Pitchfork"](state);
      expect(enabled).toBeFalsy();
    });
  });

  describe("enables", () => {
    beforeEach(() => {
      jest.useRealTimers();
    });

    it("enables users to withdraw crops", () => {
      const enabled = WITHDRAWABLES["Sunflower"]();
      expect(enabled).toBeTruthy();
    });

    it("enables users to withdraw resources", () => {
      const enabled = WITHDRAWABLES["Wood"]();
      expect(enabled).toBeTruthy();
    });

    it("enables users to withdraw flags", () => {
      const enabled = WITHDRAWABLES["Goblin Flag"]();
      expect(enabled).toBeTruthy();
    });

    it("enables users to withdraw observatory", () => {
      const enabled = WITHDRAWABLES["Observatory"]();
      expect(enabled).toBeTruthy();
    });
  });

  it("enables withdrawal of Fruit Picker Apron when fruit trees are planted", () => {
    const state: GameState = {
      ...TEST_FARM,
      fruitPatches: {
        1: {
          width: 2,
          x: -12,
          y: 12,
          height: 2,
        },
      },
    };

    const enabled = BUMPKIN_WITHDRAWABLES["Fruit Picker Apron"](state);
    expect(enabled).toBeTruthy();
  });

  it("enables withdrawal of Eggplant Onesie when eggplants are planted", () => {
    const state: GameState = {
      ...TEST_FARM,
      crops: {
        "1": {
          x: 14,
          width: 1,
          createdAt: 1680494833651,
          y: 8,
          crop: {
            name: "Parsnip",
            amount: 1,
            id: "1",
            plantedAt: 1680606097421,
          },
          height: 1,
        },
      },
    };

    const enabled = BUMPKIN_WITHDRAWABLES["Eggplant Onesie"](state);
    expect(enabled).toBeTruthy();
  });

  it("enables withdrawal of Parsnip when parsnips are planted", () => {
    const state: GameState = {
      ...TEST_FARM,
      crops: {},
    };

    const enabled = BUMPKIN_WITHDRAWABLES["Parsnip"](state);
    expect(enabled).toBeTruthy();
  });

  it("enables withdrawal of Sunflower Amulet when Sunflowers are planted", () => {
    const state: GameState = {
      ...TEST_FARM,
      crops: {
        "1": {
          x: 14,
          width: 1,
          createdAt: 1680494833651,
          y: 8,
          crop: {
            name: "Potato",
            amount: 1,
            id: "1",
            plantedAt: 1680606097421,
          },
          height: 1,
        },
      },
    };

    const enabled = BUMPKIN_WITHDRAWABLES["Sunflower Amulet"](state);
    expect(enabled).toBeTruthy();
  });

  it("allows users from withdrawing bears other than basic bear", () => {
    const enabled = WITHDRAWABLES["Chef Bear"]();
    expect(enabled).toBeTruthy();
  });

  it("enables a seasonal non timebased item to be withdrawn after season has ended", () => {
    const timers = jest.useFakeTimers();
    timers.setSystemTime(new Date("Thu August 7 2023 10:01:00 GMT+1000"));

    const enabled = WITHDRAWABLES["Dinosaur Bone"]();
    expect(enabled).toBeTruthy();
  });

  it("enables a time based item to be withdrawn when the time has passed", () => {
    const timers = jest.useFakeTimers();
    timers.setSystemTime(new Date("Thu August 9 2023 10:01:00 GMT+1000"));

    const enabled = BUMPKIN_WITHDRAWABLES["Whale Hat"]();
    expect(enabled).toBeTruthy();
  });

  it("enables withdrawal of Carrot Amulet when Carrots are planted", () => {
    const state: GameState = {
      ...TEST_FARM,
      crops: {
        "1": {
          x: 14,
          width: 1,
          createdAt: 1680494833651,
          y: 8,
          crop: {
            name: "Potato",
            amount: 1,
            id: "1",
            plantedAt: 1680606097421,
          },
          height: 1,
        },
      },
    };

    const enabled = BUMPKIN_WITHDRAWABLES["Carrot Amulet"](state);
    expect(enabled).toBeTruthy();
  });

  it("enables withdrawal of Beetroot Amulet when Beetroots are planted", () => {
    const state: GameState = {
      ...TEST_FARM,
      crops: {
        "1": {
          x: 14,
          width: 1,
          createdAt: 1680494833651,
          y: 8,
          crop: {
            name: "Potato",
            amount: 1,
            id: "1",
            plantedAt: 1680606097421,
          },
          height: 1,
        },
      },
    };

    const enabled = BUMPKIN_WITHDRAWABLES["Beetroot Amulet"](state);
    expect(enabled).toBeTruthy();
  });

  it("enables withdrawal of Green Amulet when no crops are planted", () => {
    const state: GameState = {
      ...TEST_FARM,
      crops: {
        "1": {
          x: 14,
          width: 1,
          createdAt: 1680494833651,
          y: 8,
          height: 1,
        },
      },
    };

    const enabled = BUMPKIN_WITHDRAWABLES["Green Amulet"](state);
    expect(enabled).toBeTruthy();
  });

  it("enables withdrawal of Cattlegrim when no chickens are fed", () => {
    const timers = jest.useFakeTimers();
    timers.setSystemTime(new Date("Thu October 7 2023 10:01:00 GMT+1000"));

    const state: GameState = {
      ...TEST_FARM,
      chickens: {
        1: {
          coordinates: {
            x: 5,
            y: 10,
          },
          multiplier: 1,
        },
      },
    };

    const enabled = BUMPKIN_WITHDRAWABLES["Cattlegrim"](state);
    expect(enabled).toBeTruthy();
  });

  it("enables withdrawal of Infernal Pitchfork when no crops are planted", () => {
    const timers = jest.useFakeTimers();
    timers.setSystemTime(new Date("Thu October 30 2023 10:01:00 GMT+1000"));

    const state: GameState = {
      ...TEST_FARM,
      crops: {
        "1": {
          x: 14,
          width: 1,
          createdAt: 1680494833651,
          y: 8,
          height: 1,
        },
      },
    };

    const enabled = BUMPKIN_WITHDRAWABLES["Infernal Pitchfork"](state);
    expect(enabled).toBeTruthy();
  });
});
