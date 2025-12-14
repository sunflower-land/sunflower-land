import { assign, StateNodeConfig } from "xstate";
import { Context } from "../gameMachine";
import { STATE_MACHINE_EFFECTS } from "../../actions/effect";
import {
  shouldShowGameRules,
  shouldShowIntroduction,
  shouldShowInvestigating,
  shouldShowGems,
  shouldShowCommunityCoin,
  shouldShowSwarming,
  shouldShowBlessing,
  shouldShowVip,
  shouldShowReferralRewards,
  shouldShowSomethingArrived,
  shouldShowSeasonChanged,
  shouldShowCalendarEvent,
  shouldShowCompetition,
  shouldShowNews,
  shouldShowCheers,
  shouldShowLinkWallet,
  shouldShowDailyReward,
  shouldShowAirdrop,
  shouldShowAuctionResults,
  shouldShowOffers,
  shouldShowMarketplaceSale,
  shouldShowTradesCleared,
  shouldShowJinAirdrop,
  shouldShowLeagueResults,
} from "./notificationGuards";

type GameEventHandlers = Record<string, any>;

/**
 * Creates the notifying state transitions.
 * This is the entry point that checks various conditions and routes to the appropriate notification state.
 */
export const createNotifyingTransitions = () => ({
  always: [
    { target: "gameRules", cond: shouldShowGameRules },
    { target: "introduction", cond: shouldShowIntroduction },
    { target: "investigating", cond: shouldShowInvestigating },
    { target: "gems", cond: shouldShowGems },
    { target: "communityCoin", cond: shouldShowCommunityCoin },
    { target: "swarming", cond: shouldShowSwarming },
    { target: "blessing", cond: shouldShowBlessing },
    { target: "vip", cond: shouldShowVip },
    { target: "referralRewards", cond: shouldShowReferralRewards },
    { target: "somethingArrived", cond: shouldShowSomethingArrived },
    { target: "seasonChanged", cond: shouldShowSeasonChanged },
    { target: "calendarEvent", cond: shouldShowCalendarEvent },
    { target: "competition", cond: shouldShowCompetition },
    { target: "news", cond: shouldShowNews },
    { target: "cheers", cond: shouldShowCheers },
    { target: "linkWallet", cond: shouldShowLinkWallet },
    { target: "dailyReward", cond: shouldShowDailyReward },
    // EVENTS THAT TARGET PLAYING MUST GO BELOW THIS LINE
    { target: "airdrop", cond: shouldShowAirdrop },
    { target: "auctionResults", cond: shouldShowAuctionResults },
    { target: "offers", cond: shouldShowOffers },
    { target: "marketplaceSale", cond: shouldShowMarketplaceSale },
    { target: "tradesCleared", cond: shouldShowTradesCleared },
    { target: "jinAirdrop", cond: shouldShowJinAirdrop },
    { target: "leagueResults", cond: shouldShowLeagueResults },
    { target: "playing" },
  ],
});

/**
 * Simple notification states that just acknowledge and return to notifying or playing.
 */
export const createSimpleNotificationStates = (): Record<
  string,
  StateNodeConfig<Context, any, any>
> => ({
  vip: {
    on: {
      ACKNOWLEDGE: { target: "notifying" },
    },
  },

  seasonChanged: {
    on: {
      ACKNOWLEDGE: { target: "notifying" },
    },
  },

  promo: {
    on: {
      ACKNOWLEDGE: { target: "playing" },
    },
  },

  buds: {
    on: {
      ACKNOWLEDGE: { target: "playing" },
    },
  },

  gameRules: {
    on: {
      ACKNOWLEDGE: { target: "notifying" },
    },
  },

  FLOWERTeaser: {
    on: {
      ACKNOWLEDGE: { target: "notifying" },
    },
  },

  linkWallet: {
    on: {
      ACKNOWLEDGE: { target: "notifying" },
    },
  },

  news: {
    on: {
      ACKNOWLEDGE: { target: "notifying" },
    },
  },

  somethingArrived: {
    on: {
      ACKNOWLEDGE: {
        target: "notifying",
        actions: assign((_) => ({
          revealed: undefined,
        })),
      },
    },
  },

  swarming: {
    on: {
      REFRESH: { target: "loading" },
    },
  },
});

/**
 * Notification states that handle game events in addition to acknowledgement.
 */
export const createEventNotificationStates = (
  GAME_EVENT_HANDLERS: GameEventHandlers,
): Record<string, StateNodeConfig<Context, any, any>> => ({
  calendarEvent: {
    on: {
      "daily.reset": (GAME_EVENT_HANDLERS as any)["daily.reset"],
      "calendarEvent.acknowledged": (GAME_EVENT_HANDLERS as any)[
        "calendarEvent.acknowledged"
      ],
      ACKNOWLEDGE: { target: "notifying" },
      CONTINUE: { target: "autosaving" },
    },
  },

  blessing: {
    on: {
      "blessing.claimed": (GAME_EVENT_HANDLERS as any)["blessing.claimed"],
      "blessing.seeked": {
        target: STATE_MACHINE_EFFECTS["blessing.seeked"],
      },
      ACKNOWLEDGE: { target: "notifying" },
    },
  },

  mailbox: {
    on: {
      "message.read": (GAME_EVENT_HANDLERS as any)["message.read"],
      ACKNOWLEDGE: { target: "notifying" },
    },
  },

  airdrop: {
    on: {
      "airdrop.claimed": (GAME_EVENT_HANDLERS as any)["airdrop.claimed"],
      CLOSE: { target: "playing" },
    },
  },

  offers: {
    on: {
      "offer.claimed": (GAME_EVENT_HANDLERS as any)["offer.claimed"],
      RESET: { target: "refreshing" },
      CLOSE: { target: "playing" },
    },
  },

  marketplaceSale: {
    on: {
      "purchase.claimed": (GAME_EVENT_HANDLERS as any)["purchase.claimed"],
      RESET: { target: "refreshing" },
      CLOSE: { target: "playing" },
    },
  },

  tradesCleared: {
    on: {
      "trades.cleared": (GAME_EVENT_HANDLERS as any)["trades.cleared"],
      CLOSE: { target: "playing" },
    },
  },

  refundAuction: {
    on: {
      "bid.refunded": (GAME_EVENT_HANDLERS as any)["bid.refunded"],
      CLOSE: { target: "autosaving" },
    },
  },

  jinAirdrop: {
    on: {
      "specialEvent.taskCompleted": (GAME_EVENT_HANDLERS as any)[
        "specialEvent.taskCompleted"
      ],
      CLOSE: { target: "playing" },
    },
  },

  leagueResults: {
    on: {
      "leagues.updated": {
        target: STATE_MACHINE_EFFECTS["leagues.updated"],
      },
      CLOSE: { target: "playing" },
    },
  },

  competition: {
    on: {
      "competition.started": (GAME_EVENT_HANDLERS as any)[
        "competition.started"
      ],
      ACKNOWLEDGE: { target: "notifying" },
    },
  },

  cheers: {
    on: {
      "cheers.claimed": (GAME_EVENT_HANDLERS as any)["cheers.claimed"],
      ACKNOWLEDGE: { target: "notifying" },
    },
  },

  gems: {
    on: {
      ACKNOWLEDGE: { target: "notifying" },
      "garbage.sold": (GAME_EVENT_HANDLERS as any)["garbage.sold"],
    },
  },

  communityCoin: {
    on: {
      ACKNOWLEDGE: { target: "notifying" },
      "garbage.sold": (GAME_EVENT_HANDLERS as any)["garbage.sold"],
    },
  },

  referralRewards: {
    on: {
      ACKNOWLEDGE: { target: "notifying" },
      "referral.rewardsClaimed": (GAME_EVENT_HANDLERS as any)[
        "referral.rewardsClaimed"
      ],
    },
  },

  dailyReward: {
    on: {
      CONTINUE: { target: "notifying" },
      "dailyReward.claimed": (GAME_EVENT_HANDLERS as any)[
        "dailyReward.claimed"
      ],
    },
  },
});
