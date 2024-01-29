import "lib/__mocks__/configMock";

import { SEASONS } from "features/game/types/seasons";
import { FLOWER_PAGES_COUNT, discoverFlowerPage } from "./discoverFlowerPage";
import { TEST_FARM } from "features/game/lib/constants";

describe("discoverFlowerPage", () => {
  it("throws if before Spring Blossom season", () => {
    expect(() =>
      discoverFlowerPage({
        state: TEST_FARM,
        action: { type: "flowerPage.discovered", id: 1 },
        createdAt: SEASONS["Spring Blossom"].startDate.getTime() - 1,
      })
    ).toThrow("Spring Blossom season has not started");
  });

  it("throws if after Spring Blossom season", () => {
    expect(() =>
      discoverFlowerPage({
        state: TEST_FARM,
        action: { type: "flowerPage.discovered", id: 1 },
        createdAt: SEASONS["Spring Blossom"].endDate.getTime() + 1,
      })
    ).toThrow("Spring Blossom season has ended");
  });

  it("throws if the collected page is greater than the number of pages for the week", () => {
    expect(() =>
      discoverFlowerPage({
        state: TEST_FARM,
        action: { type: "flowerPage.discovered", id: FLOWER_PAGES_COUNT + 1 },
        createdAt: SEASONS["Spring Blossom"].startDate.getTime() + 1,
      })
    ).toThrow("Page does not exist");
  });

  it("throws if the collected page is less than one", () => {
    expect(() =>
      discoverFlowerPage({
        state: TEST_FARM,
        action: { type: "flowerPage.discovered", id: 0 },
        createdAt: SEASONS["Spring Blossom"].startDate.getTime() + 1,
      })
    ).toThrow("Page does not exist");
  });

  it("marks the page as collected", () => {
    const state = discoverFlowerPage({
      state: {
        ...TEST_FARM,
        springBlossom: {
          1: { collectedFlowerPages: [], weeklyFlower: "Red Pansy" },
        },
      },
      action: { type: "flowerPage.discovered", id: 1 },
      createdAt: SEASONS["Spring Blossom"].startDate.getTime() + 1,
    });

    expect(state.springBlossom).toEqual({
      1: { collectedFlowerPages: [1], weeklyFlower: "Red Pansy" },
    });
  });

  it("marks multiple pages as collected", () => {
    const firstState = discoverFlowerPage({
      state: {
        ...TEST_FARM,
        springBlossom: {
          1: { collectedFlowerPages: [], weeklyFlower: "Red Pansy" },
        },
      },
      action: { type: "flowerPage.discovered", id: 1 },
      createdAt: SEASONS["Spring Blossom"].startDate.getTime() + 1,
    });

    const secondState = discoverFlowerPage({
      state: firstState,
      action: { type: "flowerPage.discovered", id: 2 },
      createdAt: SEASONS["Spring Blossom"].startDate.getTime() + 1,
    });

    expect(secondState.springBlossom).toEqual({
      1: { collectedFlowerPages: [1, 2], weeklyFlower: "Red Pansy" },
    });
  });
});
