import Decimal from "decimal.js-light";
import { Context } from "../gameMachine";
import {
  getGameRulesLastRead,
  getIntroductionRead,
  getVipRead,
} from "features/announcements/announcementsStorage";
import { isSwarming } from "../../events/detectBot";
import { blessingIsReady } from "../blessings";
import { hasVipAccess } from "../vipAccess";
import { getLastTemperateSeasonStartedAt } from "../temperateSeason";
import {
  getActiveCalendarEvent,
  SeasonalEventName,
} from "../../types/calendar";
import { getBumpkinLevel } from "../level";
import { hasReadNews } from "features/farming/mail/components/News";
import { hasFeatureAccess } from "lib/flags";
import { getDailyRewardLastAcknowledged } from "../../components/DailyReward";
import { isDailyRewardReady } from "../../events/landExpansion/claimDailyReward";
import { getKeys } from "../../types/decorations";

/**
 * Guards for notification state transitions in gameMachine.
 * These determine which notification modal to show after loading.
 */

export const shouldShowGameRules = (): boolean => {
  const lastRead = getGameRulesLastRead();
  // Don't show game rules if they have been read in the last 7 days
  return !lastRead || Date.now() - lastRead.getTime() > 7 * 24 * 60 * 60 * 1000;
};

export const shouldShowIntroduction = (context: Context): boolean => {
  return context.state.bumpkin?.experience === 0 && !getIntroductionRead();
};

export const shouldShowInvestigating = (context: Context): boolean => {
  return context.state.ban.status === "investigating";
};

export const shouldShowGems = (context: Context): boolean => {
  return !!context.state.inventory["Block Buck"]?.gte(1);
};

export const shouldShowCommunityCoin = (context: Context): boolean => {
  return !!context.state.inventory["Community Coin"]?.gte(1);
};

export const shouldShowSwarming = (): boolean => {
  return isSwarming();
};

export const shouldShowBlessing = (context: Context): boolean => {
  const { offered, reward } = context.state.blessing;

  if (reward) return true;
  if (!offered) return false;

  return blessingIsReady({ game: context.state });
};

export const shouldShowVip = (context: Context): boolean => {
  const isNew = context.state.bumpkin.experience < 100;

  // Don't show for new players
  if (isNew) return false;

  // Wow, they haven't seen the VIP promo in 1 month
  const readAt = getVipRead();
  if (
    !hasVipAccess({ game: context.state }) &&
    (!readAt || readAt.getTime() < Date.now() - 1 * 31 * 24 * 60 * 60 * 1000)
  ) {
    return true;
  }

  const vip = context.state.vip;

  // Show them a reminder if it is expiring in 3 days
  const isExpiring =
    vip &&
    vip.expiresAt &&
    vip.expiresAt < Date.now() + 3 * 24 * 60 * 60 * 1000 &&
    // Haven't read since expiry approached
    (readAt?.getTime() ?? 0) < vip.expiresAt - 3 * 24 * 60 * 60 * 1000;

  if (isExpiring) return true;

  const hasExpired =
    vip &&
    vip.expiresAt &&
    vip.expiresAt < Date.now() &&
    // Hasn't read since expired
    (readAt?.getTime() ?? 0) < vip.expiresAt;

  if (hasExpired) return true;

  return false;
};

export const shouldShowReferralRewards = (context: Context): boolean => {
  return !!context.state.referrals?.rewards;
};

export const shouldShowSomethingArrived = (context: Context): boolean => {
  return !!context.revealed;
};

export const shouldShowSeasonChanged = (context: Context): boolean => {
  return (
    context.state.island.type !== "basic" &&
    (context.state.island.upgradedAt ?? 0) < context.state.season.startedAt &&
    context.state.season.startedAt !== getLastTemperateSeasonStartedAt()
  );
};

export const shouldShowCalendarEvent = (context: Context): boolean => {
  const game = context.state;

  const activeEvent = getActiveCalendarEvent({
    calendar: game.calendar,
  });

  if (!activeEvent) return false;

  const isAcknowledged =
    game?.calendar[activeEvent as SeasonalEventName]?.acknowledgedAt;

  return !isAcknowledged;
};

export const shouldShowCompetition = (): boolean => {
  return false; // Currently disabled
};

export const shouldShowNews = (context: Context): boolean => {
  // Do not show if they are under level 5
  const level = getBumpkinLevel(context.state.bumpkin?.experience ?? 0);
  if (level < 5) return false;
  return !hasReadNews();
};

export const shouldShowCheers = (context: Context): boolean => {
  // Players now receive cheers in daily rewards
  if (hasFeatureAccess(context.state, "DAILY_BOXES")) return false;

  // Do not show if they are under level 5
  const level = getBumpkinLevel(context.state.bumpkin?.experience ?? 0);
  if (level < 5) return false;

  const now = Date.now();
  const today = new Date(now).toISOString().split("T")[0];

  return (
    context.state.socialFarming.cheers?.freeCheersClaimedAt <
    new Date(today).getTime()
  );
};

export const shouldShowLinkWallet = (context: Context): boolean => {
  return (
    (context.method === "fsl" || context.method === "wechat") &&
    !context.linkedWallet
  );
};

export const shouldShowDailyReward = (context: Context): boolean => {
  if (!hasFeatureAccess(context.state, "DAILY_BOXES")) return false;

  // If already acknowledged in last 24 hours, don't show
  const lastAcknowledged = getDailyRewardLastAcknowledged();
  if (
    lastAcknowledged &&
    lastAcknowledged.toISOString().slice(0, 10) ===
      new Date().toISOString().slice(0, 10)
  ) {
    return false;
  }

  return isDailyRewardReady({
    bumpkinExperience: context.state.bumpkin?.experience ?? 0,
    dailyRewards: context.state.dailyRewards,
    now: Date.now(),
  });
};

export const shouldShowAirdrop = (context: Context): boolean => {
  const airdrop = context.state.airdrops?.find(
    (airdrop) => !airdrop.coordinates,
  );
  return !!airdrop;
};

export const shouldShowAuctionResults = (context: Context): boolean => {
  return !!context.state.auctioneer.bid;
};

export const shouldShowOffers = (context: Context): boolean => {
  return getKeys(context.state.trades.offers ?? {}).some(
    (id) => !!context.state.trades.offers![id].fulfilledAt,
  );
};

export const shouldShowMarketplaceSale = (context: Context): boolean => {
  return getKeys(context.state.trades.listings ?? {}).some(
    (id) => !!context.state.trades.listings![id].fulfilledAt,
  );
};

export const shouldShowTradesCleared = (context: Context): boolean => {
  return (
    getKeys(context.state.trades.listings ?? {}).some(
      (id) => !!context.state.trades.listings![id].clearedAt,
    ) ||
    getKeys(context.state.trades.offers ?? {}).some(
      (id) => !!context.state.trades.offers![id].clearedAt,
    )
  );
};

export const shouldShowJinAirdrop = (context: Context): boolean => {
  return (
    !!context.state.nfts?.ronin?.acknowledgedAt &&
    (context.state.inventory["Jin"] ?? new Decimal(0)).lt(1)
  );
};

export const shouldShowLeagueResults = (context: Context): boolean => {
  // Don't show league results for visitors
  if (context.visitorId !== undefined) {
    return false;
  }

  const hasLeaguesAccess = hasFeatureAccess(context.state, "LEAGUES");
  const currentLeagueStartDate =
    context.state.prototypes?.leagues?.currentLeagueStartDate;

  return (
    hasLeaguesAccess &&
    currentLeagueStartDate !== new Date().toISOString().split("T")[0]
  );
};
