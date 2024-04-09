import "lib/__mocks__/configMock";
import { getSellPrice } from "./boosts";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { SellableItem } from "features/game/events/landExpansion/sellCrop";
import { CROPS } from "features/game/types/crops";

describe("boosts", () => {
  describe("getSellPrice", () => {
    it("applies crop shortage boost", () => {
      const bumpkin = INITIAL_BUMPKIN;
      const amount = getSellPrice({
        item: CROPS()["Sunflower"] as SellableItem,
        game: {
          ...TEST_FARM,
          bumpkin,
        },
      });

      expect(amount).toEqual(CROPS()["Sunflower"].sellPrice * 2);
    });
  });
});
