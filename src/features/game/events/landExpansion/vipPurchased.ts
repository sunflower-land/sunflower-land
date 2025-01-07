import Decimal from "decimal.js-light";
import { BB_TO_GEM_RATIO, GameState } from "../../types/game";
import {
  SEASONAL_BANNERS,
  SEASONS,
  SeasonalBanner,
  getPreviousSeasonalBanner,
  getSeasonByBanner,
  getSeasonalBanner,
} from "features/game/types/seasons";
import { produce } from "immer";

export type PurchaseVIPAction = {
  type: "vip.purchased";
};

type Options = {
  state: Readonly<GameState>;
  action: PurchaseBannerAction;
  createdAt?: number;
  farmId?: number;
};

export function getBannerPrice(
  banner: SeasonalBanner | "Lifetime Farmer Banner",
  hasPreviousBanner: boolean,
  hasLifetimeBanner: boolean,
  createdAt: number,
  farmId?: number,
): Decimal {
  const lifeTimePrice = 740 * BB_TO_GEM_RATIO;

  if (banner === "Lifetime Farmer Banner") {
    return new Decimal(lifeTimePrice);
  }

  if (hasLifetimeBanner) return new Decimal(0);

  const season = getSeasonByBanner(banner);
  const seasonStartDate = SEASONS[season].startDate;

  const WEEK = 1000 * 60 * 60 * 24 * 7;

  const weeksElapsed = Math.floor(
    (createdAt - seasonStartDate.getTime()) / WEEK,
  );

  if (weeksElapsed < 1) {
    const previousBannerDiscount = hasPreviousBanner ? 15 * BB_TO_GEM_RATIO : 0;
    return new Decimal(75 * BB_TO_GEM_RATIO).sub(previousBannerDiscount);
  }
  if (weeksElapsed < 4) {
    return new Decimal(100 * BB_TO_GEM_RATIO);
  }
  if (weeksElapsed < 8) {
    return new Decimal(80 * BB_TO_GEM_RATIO);
  }
  return new Decimal(60 * BB_TO_GEM_RATIO);
}

export function purchaseBanner({
  state,
  action,
  createdAt = Date.now(),
  farmId,
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { bumpkin, inventory } = stateCopy;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    const currentBlockBucks = inventory["Gem"] ?? new Decimal(0);

    if (action.name === "Lifetime Farmer Banner") {
      if (inventory["Lifetime Farmer Banner"] !== undefined) {
        throw new Error("You already have this banner");
      }

      const lifeTimePrice = 740 * BB_TO_GEM_RATIO;

      if (currentBlockBucks.lessThan(lifeTimePrice)) {
        throw new Error("Insufficient Gems");
      }

      stateCopy.inventory["Gem"] = currentBlockBucks.sub(lifeTimePrice);
      stateCopy.inventory[action.name] = new Decimal(1);

      return stateCopy;
    }

    if (!(action.name in SEASONAL_BANNERS)) {
      throw new Error("Invalid banner");
    }

    if (inventory[action.name]) {
      throw new Error("You already have this banner");
    }

    const seasonBanner = getSeasonalBanner(new Date(createdAt));
    if (action.name !== seasonBanner) {
      throw new Error(
        `Attempt to purchase ${action.name} in ${seasonBanner} Season`,
      );
    }

    const previousBanner = getPreviousSeasonalBanner(new Date(createdAt));
    const hasPreviousBanner = (inventory[previousBanner] ?? new Decimal(0)).gt(
      0,
    );
    const hasLifetimeBanner = (
      inventory["Lifetime Farmer Banner"] ?? new Decimal(0)
    ).gt(0);

    const price = getBannerPrice(
      action.name,
      hasPreviousBanner,
      hasLifetimeBanner,
      createdAt,
      farmId,
    );

    if (currentBlockBucks.lessThan(price)) {
      throw new Error("Insufficient Gems");
    }

    stateCopy.inventory["Gem"] = currentBlockBucks.sub(price);
    stateCopy.inventory[action.name] = new Decimal(1);

    return stateCopy;
  });
}
