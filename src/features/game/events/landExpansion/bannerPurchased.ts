import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { GameState } from "../../types/game";
import {
  BANNERS,
  SEASONS,
  SeasonalBanner,
  getPreviousSeasonalBanner,
  getSeasonByBanner,
} from "features/game/types/seasons";
import { translate } from "lib/i18n/translate";

export type PurchaseBannerAction = {
  type: "banner.purchased";
  name: SeasonalBanner | "Lifetime Farmer Banner";
};

type Options = {
  state: Readonly<GameState>;
  action: PurchaseBannerAction;
  createdAt?: number;
};

export function getBannerPrice(
  banner: SeasonalBanner | "Lifetime Farmer Banner",
  hasPreviousBanner: boolean,
  hasLifetimeBanner?: boolean,
  createdAt: number = Date.now()
): Decimal {
  if (banner === "Lifetime Farmer Banner") {
    return new Decimal(540);
  }

  if (hasLifetimeBanner) return new Decimal(0);

  const season = getSeasonByBanner(banner);
  const seasonStartDate = SEASONS[season].startDate;

  const WEEK = 1000 * 60 * 60 * 24 * 7;

  const weeksElapsed = Math.floor(
    (createdAt - seasonStartDate.getTime()) / WEEK
  );

  if (weeksElapsed < 2) return new Decimal(hasPreviousBanner ? 50 : 65);

  if (weeksElapsed < 4) return new Decimal(90);

  if (weeksElapsed < 8) return new Decimal(70);

  return new Decimal(50);
}

export function purchaseBanner({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { bumpkin, inventory } = stateCopy;

  if (!bumpkin) {
    throw new Error(translate("no.have.bumpkin"));
  }

  const currentBlockBucks = inventory["Block Buck"] ?? new Decimal(0);

  if (action.name === "Lifetime Farmer Banner") {
    if (inventory["Lifetime Farmer Banner"] !== undefined) {
      throw new Error("You already have this banner");
    }

    if (currentBlockBucks.lessThan(540)) {
      throw new Error("Insufficient Block Bucks");
    }

    stateCopy.inventory["Block Buck"] = currentBlockBucks.sub(540);
    stateCopy.inventory[action.name] = new Decimal(1);

    return stateCopy;
  }

  if (!(action.name in BANNERS)) {
    throw new Error("Invalid banner");
  }

  if (inventory[action.name]) {
    throw new Error("You already have this banner");
  }

  const previousBanner = getPreviousSeasonalBanner();
  const hasPreviousBanner = !!inventory[previousBanner];
  const hasLifetimeBanner = !!inventory["Lifetime Farmer Banner"];

  const price = getBannerPrice(
    action.name,
    hasPreviousBanner,
    hasLifetimeBanner,
    createdAt
  );

  if (currentBlockBucks.lessThan(price)) {
    throw new Error("Insufficient Block Bucks");
  }

  stateCopy.inventory["Block Buck"] = currentBlockBucks.sub(price);
  stateCopy.inventory[action.name] = new Decimal(1);

  return stateCopy;
}
