import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { CHAPTERS } from "features/game/types/chapters";
import { openRewardBox } from "./openRewardBox";

jest.mock("lib/config", () => ({
  CONFIG: {
    NETWORK: "mainnet",
    API_URL: "",
  },
}));

describe("openRewardBox", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("swaps Fermented Fish for Surimi Rice Bowl after Crabs and Traps (bronze)", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.81);
    const now = CHAPTERS["Crabs and Traps"].startDate.getTime() + 1000;

    const result = openRewardBox({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Bronze Food Box": new Decimal(1),
        },
      },
      action: { type: "rewardBox.opened", name: "Bronze Food Box" },
      createdAt: now,
    });

    expect(result.rewardBoxes?.["Bronze Food Box"]?.reward?.items).toEqual({
      "Surimi Rice Bowl": 1,
    });
  });

  it("swaps Fermented Fish for Surimi Rice Bowl after Crabs and Traps (silver)", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.6);
    const now = CHAPTERS["Crabs and Traps"].startDate.getTime() + 1000;

    const result = openRewardBox({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Silver Food Box": new Decimal(1),
        },
      },
      action: { type: "rewardBox.opened", name: "Silver Food Box" },
      createdAt: now,
    });

    expect(result.rewardBoxes?.["Silver Food Box"]?.reward?.items).toEqual({
      "Surimi Rice Bowl": 1,
    });
  });
});
