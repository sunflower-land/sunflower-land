import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { GameState } from "../../types/game";
import {
  BANNERS,
  SEASONS,
  SeasonalBanner,
  getSeasonByBanner,
} from "features/game/types/seasons";
import { translate } from "lib/i18n/translate";

export type PurchaseBannerAction = {
  type: "banner.purchased";
  name: SeasonalBanner;
};

type Options = {
  state: Readonly<GameState>;
  action: PurchaseBannerAction;
  createdAt?: number;
};

export function purchaseBanner({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { bumpkin, inventory } = stateCopy;

  if (bumpkin === undefined) {
    throw new Error(translate("no.have.bumpkin"));
  }

  if (!(action.name in BANNERS)) {
    throw new Error("Invalid banner");
  }

  if (inventory[action.name] !== undefined) {
    throw new Error("You already have this banner");
  }

  const season = getSeasonByBanner(action.name);
  const seasonStartDate = SEASONS[season].startDate;

  const isPreSeason = createdAt < seasonStartDate.getTime();

  let price = new Decimal(65);
  const hasPreviousBanner = !!inventory["Catch the Kraken Banner"];

  if (isPreSeason) {
    if (hasPreviousBanner) {
      price = new Decimal(35);
    } else {
      price = new Decimal(50);
    }
  }

  const currentBlockBucks = inventory["Block Buck"] || new Decimal(0);

  if (currentBlockBucks.lessThan(price)) {
    throw new Error("Insufficient Block Bucks");
  }

  return {
    ...stateCopy,
    inventory: {
      ...stateCopy.inventory,
      "Block Buck": currentBlockBucks.sub(price),
      [action.name]: new Decimal(1),
    },
  };
}
