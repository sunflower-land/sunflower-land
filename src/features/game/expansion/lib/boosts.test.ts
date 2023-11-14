import "lib/__mocks__/configMock";
import Decimal from "decimal.js-light";
import { CAKES } from "../../types/craftables";
import { getSellPrice } from "./boosts";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { marketRate } from "features/game/lib/halvening";
import { SellableItem } from "features/game/events/landExpansion/sellCrop";
import { Bumpkin } from "features/game/types/game";

describe("boosts", () => {
  describe("getSellPrice", () => {
    it("applies chef apron boost to cakes if equipped on the bumpkin", () => {
      const bumpkin: Bumpkin = {
        ...INITIAL_BUMPKIN,
        equipped: { ...INITIAL_BUMPKIN.equipped, coat: "Chef Apron" },
      };
      const amount = getSellPrice({
        item: CAKES()["Beetroot Cake"] as SellableItem,
        game: {
          ...TEST_FARM,
          bumpkin,
        },
      });
      expect(amount).toEqual(new Decimal(marketRate(672)));
    });

    it("does not apply chef apron boost if not equipped on the bumpkin", () => {
      const bumpkin = INITIAL_BUMPKIN;
      const amount = getSellPrice({
        item: CAKES()["Beetroot Cake"] as SellableItem,
        game: {
          ...TEST_FARM,
          bumpkin,
        },
      });
      expect(amount).toEqual(new Decimal(marketRate(560)));
    });
  });
});
