import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { GameState } from "../../types/game";
import {
  BANNERS,
  SEASONS,
  SeasonalBanner,
  getPreviousSeasonalBanner,
  getSeasonByBanner,
  getSeasonalBanner,
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
  hasLifetimeBanner: boolean,
  hasGoldPass: boolean,
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

  const goldPassDiscount = hasGoldPass ? 15 : 0;

  if (weeksElapsed < 2) {
    const previousBannerDiscount = hasPreviousBanner ? 15 : 0;
    return new Decimal(65).sub(previousBannerDiscount).sub(goldPassDiscount);
  }
  if (weeksElapsed < 4) {
    return new Decimal(90).sub(goldPassDiscount);
  }
  if (weeksElapsed < 8) {
    return new Decimal(70).sub(goldPassDiscount);
  }
  return new Decimal(50).sub(goldPassDiscount);
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

  if (inventory["Lifetime Farmer Banner"] !== undefined) {
    throw new Error("You already have the Lifetime Farmer Banner");
  }

  const seasonBanner = getSeasonalBanner();
  if (action.name !== seasonBanner) {
    throw new Error(
      `Attempt to purchase ${action.name} in ${seasonBanner} Season`
    );
  }

  const previousBanner = getPreviousSeasonalBanner();
  const hasPreviousBanner = (inventory[previousBanner] ?? new Decimal(0)).gt(0);
  const hasLifetimeBanner = (
    inventory["Lifetime Farmer Banner"] ?? new Decimal(0)
  ).gt(0);
  const hasGoldPass = (inventory["Gold Pass"] ?? new Decimal(0)).gt(0);

  const price = getBannerPrice(
    action.name,
    hasPreviousBanner,
    hasLifetimeBanner,
    hasGoldPass,
    createdAt
  );

  if (currentBlockBucks.lessThan(price)) {
    throw new Error("Insufficient Block Bucks");
  }

  stateCopy.inventory["Block Buck"] = currentBlockBucks.sub(price);
  stateCopy.inventory[action.name] = new Decimal(1);

  return stateCopy;
}
