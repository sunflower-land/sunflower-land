import { BUMPKIN_WITHDRAWABLES, WITHDRAWABLES } from "./withdrawables";

describe("withdrawables", () => {
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

      const enabled = BUMPKIN_WITHDRAWABLES["Whale Hat"]();
      expect(enabled).toBeFalsy();
    });

    it("prevents a seasonal non timebased item from being withdrawn before season has ended", () => {
      const timers = jest.useFakeTimers();
      timers.setSystemTime(new Date("Thu July 7 2023 10:01:00 GMT+1000"));

      const enabled = WITHDRAWABLES["Dinosaur Bone"]();
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

    it("prevents users to withdraw easter eggs", () => {
      const enabled = WITHDRAWABLES["Red Egg"]();
      expect(enabled).toBeFalsy();
    });

    it("enables users to withdraw observatory", () => {
      const enabled = WITHDRAWABLES["Observatory"]();
      expect(enabled).toBeTruthy();
    });
  });

  it("prevents users from withdrawing trees", () => {
    const enabled = WITHDRAWABLES["Tree"]();
    expect(enabled).toBeFalsy();
  });

  it("prevents users from withdrawing basic bear", () => {
    const enabled = WITHDRAWABLES["Basic Bear"]();
    expect(enabled).toBeFalsy();
  });

  it("allows users from withdrawing bears other than basic bear", () => {
    const enabled = WITHDRAWABLES["Chef Bear"]();
    expect(enabled).toBeTruthy();
  });

  it("enables a time based item to be withdrawn when the time has passed", () => {
    const timers = jest.useFakeTimers();
    timers.setSystemTime(new Date("Thu August 9 2023 10:01:00 GMT+1000"));

    const enabled = BUMPKIN_WITHDRAWABLES["Whale Hat"]();
    expect(enabled).toBeTruthy();
  });

  it("prevents a seasonal non timebased item from being withdrawn before season has ended", () => {
    const timers = jest.useFakeTimers();
    timers.setSystemTime(new Date("Thu August 7 2023 10:01:00 GMT+1000"));

    const enabled = WITHDRAWABLES["Dinosaur Bone"]();
    expect(enabled).toBeTruthy();
  });
});
