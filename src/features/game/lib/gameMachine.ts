import {
  createMachine,
  assign,
  fromPromise,
  fromCallback,
  sendTo,
  raise,
  ActorRefFrom,
  SnapshotFrom,
} from "xstate";
import {
  PLAYING_EVENTS,
  PlacementEvent,
  PLACEMENT_EVENTS,
  GameEvent,
  PlayingEvent,
  GameEventName,
  VISITING_EVENTS,
  VisitingEvent,
  LOCAL_VISITING_EVENTS,
} from "../events";

import {
  ART_MODE,
  Context as AuthContext,
} from "features/auth/lib/authMachine";
import { wallet } from "../../../lib/blockchain/wallet";

import {
  GameState,
  Inventory,
  InventoryItemName,
  PlacedLamp,
  Purchase,
} from "../types/game";
import { loadSession } from "../actions/loadSession";
import { EMPTY } from "./constants";
import { autosave } from "../actions/autosave";
import { ErrorCode, ERRORS } from "lib/errors";
import { makeGame } from "./transforms";
import { reset } from "features/farming/hud/actions/reset";
import { checkProgress, processEvent } from "./processEvent";
import {
  landscapingMachine,
  LandscapingPlaceableType,
  SaveEvent,
} from "../expansion/placeable/landscapingMachine";
import { isSwarming } from "../events/detectBot";
import { generateTestLand } from "../expansion/actions/generateLand";

import { loadGameStateForVisit } from "../actions/loadGameStateForVisit";
import { randomID } from "lib/utils/random";

import { buySFL } from "../actions/buySFL";
import { PlaceableLocation } from "../types/collectibles";
import {
  getIntroductionRead,
  getVipRead,
} from "features/announcements/announcementsStorage";
import { depositToFarm } from "lib/blockchain/Deposit";
import Decimal from "decimal.js-light";
import { setOnboardingComplete } from "features/auth/actions/onboardingComplete";
import { Announcements } from "../types/announcements";
import {
  Currency,
  buyBlockBucks,
  buyBlockBucksMATIC,
} from "../actions/buyGems";
import { getSessionId } from "lib/blockchain/Session";
import { BumpkinItem } from "../types/bumpkin";
import { getAuctionResults } from "../actions/getAuctionResults";
import { AuctionResults } from "./auctionMachine";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { gameAnalytics } from "lib/gameAnalytics";
import { portal } from "features/world/ui/community/actions/portal";

import { CONFIG } from "lib/config";
import {
  TradeableName,
  sellMarketResourceRequest,
} from "../actions/sellMarketResource";
import { setCachedMarketPrices } from "features/world/ui/market/lib/marketCache";
import { MinigameName } from "../types/minigames";
import { OFFLINE_FARM } from "./landData";
import { isValidRedirect } from "features/portal/lib/portalUtil";
import {
  Effect,
  STATE_MACHINE_EFFECTS,
  postEffect,
  StateMachineStateName,
  StateNameWithStatus,
  STATE_MACHINE_VISIT_EFFECTS,
  StateMachineVisitStateName,
  StateMachineVisitEffectName,
} from "../actions/effect";
import { TRANSACTION_SIGNATURES, TransactionName } from "../types/transactions";
import { getKeys } from "../types/decorations";
import { preloadHotNow } from "features/marketplace/components/MarketplaceHotNow";
import { getLastTemperateSeasonStartedAt } from "./temperateSeason";
import { hasVipAccess } from "./vipAccess";
import { getActiveCalendarEvent, SeasonalEventName } from "../types/calendar";
import { getConnection, getChainId } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { depositFlower } from "lib/blockchain/DepositFlower";
import { NetworkOption } from "features/island/hud/components/deposit/DepositFlower";
import { blessingIsReady } from "./blessings";
import { depositSFL } from "lib/blockchain/DepositSFL";
import { hasFeatureAccess } from "lib/flags";
import { isDailyRewardReady } from "../events/landExpansion/claimDailyReward";
import { getDailyRewardLastAcknowledged } from "../components/DailyReward";
import { LanguageCode } from "lib/i18n/dictionaries/language";

// Run at startup in case removed from query params
const portalName = new URLSearchParams(window.location.search).get("portal");

const getRedirect = () => {
  const code = new URLSearchParams(window.location.search).get("redirect");

  return code;
};

const getError = () => {
  const error = new URLSearchParams(window.location.search).get("error");

  return error;
};

const shouldShowLeagueResults = ({ context }: { context: Context }) => {
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

export type PastAction = GameEvent & {
  createdAt: Date;
};

export type MaxedItem = InventoryItemName | BumpkinItem | "SFL";

export interface Context {
  farmId: number;
  state: GameState;
  farmAddress?: string;
  actions: PastAction[];
  sessionId?: string;
  errorCode?: ErrorCode;
  transactionId?: string;
  fingerprint?: string;
  maxedItem?: MaxedItem;
  goblinSwarm?: Date;
  deviceTrackerId?: string;
  revealed?: {
    coins: number;
    balance: string;
    inventory: Record<InventoryItemName, string>;
    wardrobe: Record<BumpkinItem, number>;
  };
  announcements: Announcements;
  prices: {
    sfl: {
      usd: number;
      timestamp: number;
    } | null;
  };
  auctionResults?: AuctionResults;
  moderation: Moderation;
  saveQueued: boolean;
  linkedWallet?: string;
  wallet?: string;
  nftId?: number;
  paused?: boolean;
  verified?: boolean;
  purchases: Purchase[];
  discordId?: string;
  fslId?: string;
  oauthNonce: string;
  data: Partial<Record<StateMachineStateName, any>>;
  rawToken?: string;
  visitorId?: number;
  visitorState?: GameState;
  visitorNftId?: number;
  hasHelpedPlayerToday?: boolean;
  totalHelpedToday?: number;
  apiKey?: string;
  method?: "google" | "wallet" | "wechat" | "fsl";
  accountTradedAt?: string;
}

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

export function isAccountTradedWithin90Days(context: Context): boolean {
  const tradedAt = context?.accountTradedAt;
  if (!tradedAt) return false;
  const tradedAtMs = new Date(tradedAt).getTime();
  return Date.now() - tradedAtMs < NINETY_DAYS_MS;
}

export function getAccountTradedRestrictionSecondsLeft(
  context: Context,
): number {
  const tradedAt = context.accountTradedAt;
  if (!tradedAt) return 0;
  const tradedAtMs = new Date(tradedAt).getTime();
  const endMs = tradedAtMs + NINETY_DAYS_MS;
  const leftMs = endMs - Date.now();
  return Math.max(0, leftMs / 1000);
}

export type Moderation = {
  muted: {
    mutedAt: number;
    mutedBy: number;
    reason: string;
    mutedUntil: number;
  }[];
  kicked: {
    kickedAt: number;
    kickedBy: number;
    reason: string;
  }[];
};

type CommunityEvent = {
  type: "COMMUNITY_UPDATE";
  game: GameState;
};

type BuyBlockBucksEvent = {
  type: "BUY_GEMS";
  currency: Currency;
  amount: number;
};

type UpdateBlockBucksEvent = {
  type: "UPDATE_GEMS";
  amount: number;
};

type LandscapeEvent = {
  placeable?: LandscapingPlaceableType;
  action?: GameEventName<PlacementEvent>;
  type: "LANDSCAPE";
  requirements?: {
    sfl: Decimal;
    ingredients: Inventory;
  };
  multiple?: boolean;
  maximum?: number;
  location: PlaceableLocation;
};

type VisitEvent = {
  type: "VISIT";
  landId: number;
};

type BuySFLEvent = {
  type: "BUY_SFL";
  maticAmount: string;
  amountOutMin: string;
};

type DepositEvent = {
  type: "DEPOSIT";
  itemIds: number[];
  itemAmounts: string[];
  wearableIds: number[];
  wearableAmounts: number[];
  budIds: number[];
  petIds: number[];
};

type DepositFlowerFromLinkedWalletEvent = {
  type: "DEPOSIT_FLOWER_FROM_LINKED_WALLET";
  amount: bigint;
  depositAddress: `0x${string}`;
  selectedNetwork: NetworkOption;
};

type DepositSFLFromLinkedWalletEvent = {
  type: "DEPOSIT_SFL_FROM_LINKED_WALLET";
  amount: bigint;
  depositAddress: `0x${string}`;
  selectedNetwork: NetworkOption;
};

type UpdateEvent = {
  type: "UPDATE";
  state: GameState;
};

type SellMarketResourceEvent = {
  type: "SELL_MARKET_RESOURCE";
  item: TradeableName;
  pricePerUnit: number;
};

export type UpdateUsernameEvent = {
  type: "UPDATE_USERNAME";
  username: string;
};

type PostEffectEvent = {
  type: "POST_EFFECT";
  effect: Effect;
  authToken: string;
};

type TransactEvent = {
  type: "TRANSACT";
  transaction: TransactionName;
  request: any;
};

export type BlockchainEvent =
  | { type: "SAVE" }
  | TransactEvent
  | CommunityEvent
  | SellMarketResourceEvent
  | { type: "REFRESH" }
  | { type: "ACKNOWLEDGE" }
  | { type: "EXPIRED" }
  | { type: "CONTINUE"; id?: string }
  | { type: "RESET" }
  | { type: "DEPOSIT" }
  | { type: "PAUSE" }
  | { type: "PLAY" }
  | { type: "REVEAL" }
  | { type: "SKIP_MIGRATION" }
  | { type: "END_VISIT" }
  | { type: "PERSONHOOD_FINISHED"; verified: boolean }
  | { type: "PERSONHOOD_CANCELLED" }
  | GameEvent
  | LandscapeEvent
  | VisitEvent
  | BuySFLEvent
  | BuyBlockBucksEvent
  | UpdateBlockBucksEvent
  | DepositEvent
  | UpdateEvent
  | UpdateUsernameEvent
  | PostEffectEvent
  | { type: "EXPAND" }
  | { type: "SAVE_SUCCESS" }
  | { type: "SAVE_ERROR" }
  | { type: "UPGRADE" }
  | { type: "CLOSE" }
  | { type: "RANDOMISE" }
  | DepositFlowerFromLinkedWalletEvent
  | DepositSFLFromLinkedWalletEvent
  | { type: StateMachineVisitEffectName }
  | Effect; // Test only

type GuardArgs = { context: Context; event: BlockchainEvent };

const playingEventHandler = (eventName: string) => {
  return {
    [eventName]: [
      {
        target: "hoarding",
        guard: ({
          context,
          event,
        }: {
          context: Context;
          event: PlayingEvent | VisitingEvent;
        }) => {
          const { valid } = checkProgress({
            state: context.state as GameState,
            action: event,
            farmId: context.farmId,
            createdAt: Date.now(),
          });

          return !valid;
        },
        actions: assign(
          ({
            context,
            event,
          }: {
            context: Context;
            event: PlayingEvent | VisitingEvent;
          }) => {
            const { maxedItem } = checkProgress({
              state: context.state as GameState,
              action: event,
              farmId: context.farmId,
              createdAt: Date.now(),
            });

            return { maxedItem };
          },
        ),
      },
      {
        actions: assign(
          ({
            context,
            event,
          }: {
            context: Context;
            event: PlayingEvent | VisitingEvent;
          }) => {
            const createdAt = new Date();

            const result = processEvent({
              state: context.state,
              action: event,
              announcements: context.announcements,
              farmId: context.farmId,
              visitorState: context.visitorState,
              createdAt: createdAt.getTime(),
            });

            let actions = [
              ...context.actions,
              {
                ...event,
                createdAt,
              },
            ];

            // Filter out any local only actions so we don't persist them
            actions = actions.filter(
              (action) =>
                !Object.keys(LOCAL_VISITING_EVENTS).includes(action.type),
            );

            if (Array.isArray(result)) {
              const [state, visitorState] = result;
              return {
                state,
                actions,
                visitorState,
              };
            }

            return {
              state: result,
              actions,
            };
          },
        ),
      },
    ],
  };
};

// // For each game event, convert it to an XState event + handler
const GAME_EVENT_HANDLERS = Object.keys(PLAYING_EVENTS).reduce(
  (events, eventName) => ({
    ...events,
    ...playingEventHandler(eventName),
  }),
  {},
);

const VISITING_EVENT_HANDLERS = Object.keys(VISITING_EVENTS).reduce(
  (events, eventName) => ({
    ...events,
    ...playingEventHandler(eventName),
  }),
  {},
);

const PLACEMENT_EVENT_HANDLERS = [
  ...Object.keys(PLACEMENT_EVENTS),
  "biome.bought",
  "biome.applied",
].reduce(
  (events, eventName) => ({
    ...events,
    [eventName]: {
      actions: assign(
        ({ context, event }: { context: Context; event: PlacementEvent }) => {
          const createdAt = new Date();

          return {
            state: processEvent({
              state: context.state as GameState,
              action: event,
              farmId: context.farmId,
              createdAt: createdAt.getTime(),
            }) as GameState,
            actions: [
              ...context.actions,
              {
                ...event,
                createdAt,
              },
            ],
          };
        },
      ),
    },
  }),
  {},
);

const EFFECT_EVENT_HANDLERS = getKeys(STATE_MACHINE_EFFECTS).reduce(
  (events, eventName) => ({
    ...events,
    [eventName]: {
      target: STATE_MACHINE_EFFECTS[eventName],
    },
  }),
  {},
);

const EFFECT_STATES = Object.values(STATE_MACHINE_EFFECTS).reduce(
  (states, stateName) => ({
    ...states,
    [`${stateName}Success`]: {
      on: {
        CONTINUE: [
          {
            target: "visiting",
            guard: ({ context }: GuardArgs) => !!context.visitorId,
          },
          { target: "notifying" },
        ],
      },
    },
    [`${stateName}Failed`]: {
      on: {
        CONTINUE: [
          {
            target: "visiting",
            guard: ({ context }: GuardArgs) => !!context.visitorId,
          },
          { target: "notifying" },
        ],
        REFRESH: [
          {
            target: "visiting",
            guard: ({ context }: GuardArgs) => !!context.visitorId,
          },
          { target: "notifying" },
        ],
      },
    },
    [stateName]: {
      entry: "setTransactionId",
      invoke: {
        src: fromPromise(
          async ({
            input,
          }: {
            input: { context: Context; event: PostEffectEvent };
          }) => {
            const { context, event } = input;
            const { effect, authToken } = event;

            if (context.actions.length > 0) {
              await autosave({
                farmId: Number(context.farmId),
                sessionId: context.sessionId as string,
                actions: context.actions,
                token: authToken ?? context.rawToken,
                fingerprint: context.fingerprint as string,
                deviceTrackerId: context.deviceTrackerId as string,
                transactionId: context.transactionId as string,
                state: context.state,
              });
            }

            const { gameState, data } = await postEffect({
              farmId: Number(context.farmId),
              effect,
              token: authToken ?? context.rawToken,
              transactionId: context.transactionId as string,
              state: context.state,
            });

            if (context.visitorId) {
              return {
                state: makeGame(data.visitedFarmState),
                data,
              };
            }

            return { state: gameState, data };
          },
        ),
        input: ({ context, event }: GuardArgs) => ({
          context,
          event: event as PostEffectEvent,
        }),
        onDone: [
          {
            target: `${stateName}Success`,
            guard: ({
              event,
            }: {
              event: { output: { state: { transaction?: unknown } } };
            }) => !event.output.state.transaction,
            actions: [
              assign(({ context, event }) => {
                const output = (
                  event as unknown as {
                    output: {
                      state: GameState;
                      data?: Record<string, unknown>;
                    };
                  }
                ).output;
                return {
                  actions: [] as PastAction[],
                  state: output.state,
                  linkedWallet:
                    (output.data as Record<string, string | undefined>)
                      ?.linkedWallet ?? context.linkedWallet,
                  nftId:
                    (output.data as Record<string, number | undefined>)
                      ?.nftId ?? context.nftId,
                  farmAddress:
                    (output.data as Record<string, string | undefined>)
                      ?.farmAddress ?? context.farmAddress,
                  data: { ...context.data, [stateName]: output.data },
                };
              }),
            ],
          },
          {
            target: `notifying`,
            actions: [
              assign(
                ({ event }: { event: { output: { state: GameState } } }) => ({
                  actions: [] as PastAction[],
                  state: event.output.state,
                }),
              ),
            ],
          },
        ],
        onError: {
          target: `${stateName}Failed`,
          actions: "assignErrorMessage",
        },
      },
    },
  }),
  {},
);

const VISIT_EFFECT_EVENT_HANDLERS = getKeys(STATE_MACHINE_VISIT_EFFECTS).reduce(
  (events, eventName) => ({
    ...events,
    [eventName]: {
      target: STATE_MACHINE_VISIT_EFFECTS[eventName],
    },
  }),
  {},
);

const VISIT_EFFECT_STATES = Object.values(STATE_MACHINE_VISIT_EFFECTS).reduce(
  (states, stateName) => ({
    ...states,
    [`${stateName}Success`]: {
      on: {
        CONTINUE: [{ target: "visiting" }],
      },
    },
    [`${stateName}Failed`]: {
      on: {
        CONTINUE: [{ target: "visiting" }],
        REFRESH: [{ target: "visiting" }],
      },
    },
    [stateName]: {
      entry: "setTransactionId",
      invoke: {
        src: fromPromise(
          async ({
            input,
          }: {
            input: { context: Context; event: PostEffectEvent };
          }) => {
            const { context, event } = input;
            const { effect, authToken } = event;

            if (!context.visitorState || !context.visitorId) {
              throw new Error("Visitor state and/or visitor id are required");
            }

            if (context.actions.length > 0) {
              await autosave({
                farmId: Number(context.visitorId),
                sessionId: context.sessionId as string,
                actions: context.actions,
                token: authToken ?? context.rawToken,
                fingerprint: context.fingerprint as string,
                deviceTrackerId: context.deviceTrackerId as string,
                transactionId: context.transactionId as string,
                state: context.visitorState,
              });
            }

            const { gameState, data } = await postEffect({
              farmId: Number(context.visitorId),
              effect,
              token: authToken ?? context.rawToken,
              transactionId: context.transactionId as string,
              state: context.visitorState,
            });

            if (event.effect.type === "farm.followed") {
              return {
                state: context.state,
                data,
                visitorState: gameState,
              };
            }

            const { visitedFarmState, ...rest } = data;

            return {
              state: makeGame(visitedFarmState),
              data: rest,
              visitorState: gameState,
            };
          },
        ),
        input: ({ context, event }: GuardArgs) => ({
          context,
          event: event as PostEffectEvent,
        }),
        onDone: [
          {
            target: `${stateName}Success`,
            guard: ({
              event,
            }: {
              event: { output: { state: { transaction?: unknown } } };
            }) => !event.output.state.transaction,
            actions: [
              assign(({ context, event }) => {
                const output = (
                  event as unknown as {
                    output: {
                      state: GameState;
                      data: Record<string, unknown>;
                      visitorState?: GameState;
                    };
                  }
                ).output;
                const { hasHelpedPlayerToday, totalHelpedToday, ...rest } =
                  output.data;

                return {
                  actions: [] as PastAction[],
                  state: output.state,
                  linkedWallet:
                    (output.data as Record<string, string | undefined>)
                      ?.linkedWallet ?? context.linkedWallet,
                  nftId:
                    (output.data as Record<string, number | undefined>)
                      ?.nftId ?? context.nftId,
                  farmAddress:
                    (output.data as Record<string, string | undefined>)
                      ?.farmAddress ?? context.farmAddress,
                  data: { ...context.data, [stateName]: rest },
                  visitorState: output.visitorState,
                  hasHelpedPlayerToday,
                  totalHelpedToday,
                };
              }),
            ],
          },
          {
            target: "visiting",
            actions: [
              assign(({ context, event }) => {
                const output = (
                  event as unknown as {
                    output: {
                      state: GameState;
                      visitorState?: GameState;
                      data?: Record<string, unknown>;
                    };
                  }
                ).output;
                return {
                  actions: [] as PastAction[],
                  state: output.state,
                  visitorState: output.visitorState,
                  hasHelpedPlayerToday:
                    (output.data as Record<string, boolean | undefined>)
                      ?.hasHelpedPlayerToday ?? context.hasHelpedPlayerToday,
                  totalHelpedToday:
                    (output.data as Record<string, number | undefined>)
                      ?.totalHelpedToday ?? context.totalHelpedToday,
                };
              }),
            ],
          },
        ],
        onError: {
          target: `${stateName}Failed`,
          actions: "assignErrorMessage",
        },
      },
    },
  }),
  {},
);

export type BlockchainState = {
  value:
    | "loading"
    | "loadLandToVisit"
    | "landToVisitNotFound"
    | "visiting"
    | "gameRules"
    | "blessing"
    | "portalling"
    | "introduction"
    | "welcome"
    | "investigating"
    | "gems"
    | "communityCoin"
    | "referralRewards"
    | "dailyReward"
    | "playing"
    | "autosaving"
    | "buyingSFL"
    | "calendarEvent"
    | "revealing"
    | "revealed"
    | "genieRevealed"
    | "beanRevealed"
    | "error"
    | "refreshing"
    | "swarming"
    | "hoarding"
    | "mailbox"
    | "transacting"
    | "depositing"
    | "landscaping"
    | "vip"
    | "promo"
    | "sellMarketResource"
    | "priceChanged"
    | "buds"
    | "airdrop"
    | "offers"
    | "marketplaceSale"
    | "tradesCleared"
    | "coolingDown"
    | "buyingBlockBucks"
    | "auctionResults"
    | "claimAuction"
    | "refundAuction"
    | "blacklisted"
    | "somethingArrived"
    | "seasonChanged"
    | "randomising"
    | "competition"
    | "jinAirdrop"
    | "leagueResults"
    | "linkWallet"
    | StateMachineStateName
    | StateMachineVisitStateName
    | StateNameWithStatus; // TEST ONLY
  context: Context;
};

export type StateKeys = keyof Omit<BlockchainState, "context">;
export type StateValues = BlockchainState[StateKeys];

export type MachineState = SnapshotFrom<ReturnType<typeof startGame>>;

export type MachineInterpreter = ActorRefFrom<ReturnType<typeof startGame>>;

export const saveGame = async (
  context: Context,
  event: any,
  farmId: number,
  rawToken: string,
) => {
  const saveAt = new Date();

  // Skip autosave when no actions were produced or if playing ART_MODE
  if (context.actions.length === 0 || ART_MODE) {
    return {
      verified: true,
      saveAt,
      farm: context.state,
      announcements: context.announcements,
    };
  }

  const { verified, farm, announcements } = await autosave({
    farmId,
    sessionId: context.sessionId as string,
    actions: context.actions,
    token: rawToken,
    fingerprint: context.fingerprint as string,
    deviceTrackerId: context.deviceTrackerId as string,
    transactionId: context.transactionId as string,
    state: context.state,
  });

  // This gives the UI time to indicate that a save is taking place both when clicking save
  // and when autosaving
  await new Promise((res) => setTimeout(res, 500));

  return {
    saveAt,
    verified,
    farm,
    announcements,
  };
};

const handleSuccessfulSave = (
  context: Context,
  output: { saveAt: Date; farm: GameState; announcements: Announcements },
) => {
  const isVisiting = !!context.visitorId;
  const recentActions = context.actions.filter(
    (action) => action.createdAt.getTime() > output.saveAt.getTime(),
  );

  if (recentActions.length === 0) {
    return {
      state: isVisiting ? context.state : output.farm,
      visitorState: context.visitorState,
      saveQueued: false,
      actions: [] as PastAction[],
      announcements: output.announcements,
    };
  }

  const updatedState = recentActions.reduce<GameState | [GameState, GameState]>(
    (state, action) => {
      return processEvent({
        state: Array.isArray(state) ? state[0] : state,
        action,
        announcements: context.announcements,
        farmId: context.farmId,
        visitorState: context.visitorState,
        createdAt: action.createdAt.getTime(),
      });
    },
    output.farm,
  );

  if (Array.isArray(updatedState)) {
    const [state, visitorState] = updatedState;
    return {
      state,
      actions: recentActions,
      visitorState,
      saveQueued: false,
      announcements: output.announcements,
    };
  }

  return {
    actions: recentActions,
    state: updatedState,
    visitorState: context.visitorState,
    saveQueued: false,
    announcements: output.announcements,
  };
};

// Hashed eth 0 value
export const INITIAL_SESSION = "0x0";

export function startGame(authContext: AuthContext) {
  const assignGame = assign(({ event }) => {
    const output = (event as unknown as { output: Record<string, unknown> })
      .output;
    return {
      farmId: output.farmId as number,
      state: output.state as GameState,
      sessionId: output.sessionId as string,
      fingerprint: output.fingerprint as string,
      deviceTrackerId: output.deviceTrackerId as string,
      announcements: output.announcements as Announcements,
      moderation: output.moderation as Moderation,
      farmAddress: output.farmAddress as string,
      linkedWallet: output.linkedWallet as string,
      wallet: output.wallet as string,
      nftId: output.nftId as number,
      verified: output.verified as boolean,
      purchases: output.purchases as Purchase[],
      discordId: output.discordId as string,
      fslId: output.fslId as string,
      oauthNonce: output.oauthNonce as string,
      prices: output.prices as Context["prices"],
      apiKey: output.apiKey as string,
      method: output.method as string,
      accountTradedAt: output.accountTradedAt as string,
    };
  });

  const initialiseAnalytics = ({
    context,
    event,
  }: {
    context: Context;
    event: BlockchainEvent;
  }) => {
    if (!ART_MODE) {
      const output = (event as unknown as { output: { analyticsId: number } })
        .output;
      gameAnalytics.initialise({ id: output.analyticsId });
      onboardingAnalytics.initialise({ id: context.farmId });
      onboardingAnalytics.logEvent("login");
    }
  };

  const assignUrl = () => {
    if (window.location.hash.includes("retreat")) return;
    if (window.location.hash.includes("world")) return;
  };

  return createMachine(
    {
      types: {} as {
        context: Context;
        events: BlockchainEvent;
      },
      id: "gameMachine",
      initial: "loading",
      context: {
        fslId: "123",
        discordId: "123",
        farmId:
          CONFIG.NETWORK === "mainnet"
            ? (authContext.user.token?.farmId ?? 0)
            : Math.floor(Math.random() * 1000),
        rawToken: authContext.user.rawToken,
        actions: [],
        state: EMPTY,
        linkedWallet: "0x123",
        sessionId: INITIAL_SESSION,
        announcements: {
          test: {
            content: [
              {
                text: "Test",
              },
            ],
            headline: "Test",
            from: "poppy",
          },
        },
        prices: {
          sfl: {
            timestamp: Date.now(),
            usd: 1.23,
          },
        },
        moderation: {
          muted: [],
          kicked: [],
        },
        saveQueued: false,
        verified: !CONFIG.API_URL,
        purchases: [],
        oauthNonce: "",
        data: {},
        accountTradedAt: "2026-02-15T12:00:00Z",
      },
      states: {
        ...EFFECT_STATES,
        ...VISIT_EFFECT_STATES,
        loading: {
          id: "loading",
          always: [
            {
              target: "error",
              guard: () => !!getError(),
              actions: assign({
                errorCode: () => getError() as ErrorCode,
              }),
            },
            {
              target: "notifying",
              guard: () => ART_MODE,
              actions: assign({
                state: (_context) => OFFLINE_FARM,
              }),
            },
          ],
          entry: () => {
            if (CONFIG.API_URL)
              preloadHotNow(authContext.user.rawToken as string);
          },
          // @ts-expect-error XState v5 type inference limitation with large event unions and dynamically spread states
          invoke: {
            src: fromPromise(async ({ input: context }: { input: Context }) => {
              const fingerprint = "X";

              const { connector } = getConnection(config);
              const language: LanguageCode =
                (localStorage.getItem("language") as LanguageCode) || "en";

              const response = await loadSession({
                token: authContext.user.rawToken as string,
                transactionId: context.transactionId as string,
                wallet: connector?.name,
                language,
              });

              // If no farm go no farms route

              setOnboardingComplete();

              return {
                farmId: Number(response.farmId),
                state: response.game,
                sessionId: response.sessionId,
                fingerprint,
                deviceTrackerId: response.deviceTrackerId,
                announcements: response.announcements,
                moderation: response.moderation,
                farmAddress: response.farmAddress,
                analyticsId: response.analyticsId,
                linkedWallet: response.linkedWallet,
                nftId: response.nftId,
                wallet: response.wallet,
                verified: response.verified,
                purchases: response.purchases,
                discordId: response.discordId,
                fslId: response.fslId,
                oauthNonce: response.oauthNonce,
                prices: response.prices,
                apiKey: response.apiKey,
                accountTradedAt: response.accountTradedAt,
              };
            }),
            input: ({ context }) => context,
            onDone: [
              {
                target: "loadLandToVisit",
                guard: () => window.location.href.includes("visit"),
                actions: [assignGame],
              },
              {
                target: "blacklisted",
                guard: ({ event }) => {
                  const output = (
                    event as unknown as { output: { state: GameState } }
                  ).output;
                  return output.state.ban.status === "permanent";
                },
              },
              {
                target: "portalling",
                guard: () => !!portalName,
                actions: [assignGame],
              },

              {
                target: "notifying",
                actions: [assignGame, assignUrl, initialiseAnalytics],
              },
            ],
            onError: [
              {
                target: "error",
                actions: "assignErrorMessage",
              },
            ],
          },
        },
        blacklisted: {},
        portalling: {
          id: "portalling",
          invoke: {
            src: fromPromise(async ({ input: context }) => {
              const portalId = portalName as MinigameName;
              const { token } = await portal({
                portalId,
                token: authContext.user.rawToken as string,
                farmId: context.farmId,
              });

              const redirect = getRedirect() as string;

              if (!isValidRedirect(redirect)) {
                throw new Error("Invalid redirect");
              }

              window.location.href = `${redirect}?jwt=${token}`;
            }),
            input: ({ context }) => context,
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        loadLandToVisit: {
          invoke: {
            src: fromPromise(
              async ({
                input,
              }: {
                input: { context: Context; event: BlockchainEvent };
              }) => {
                const { context, event } = input;
                // Autosave just in case
                if (context.actions.length > 0) {
                  await autosave({
                    farmId: Number(context.farmId),
                    sessionId: context.sessionId as string,
                    actions: context.actions,
                    token: authContext.user.rawToken as string,
                    fingerprint: context.fingerprint as string,
                    deviceTrackerId: context.deviceTrackerId as string,
                    transactionId: context.transactionId as string,
                    state: context.state,
                  });
                }

                let farmId: number;

                // We can enter this state two ways
                // 1. Directly on load if the url has a visit path (/visit)
                // 2. From a VISIT event passed back to the machine which will include a farmId in the payload

                if (!(event as VisitEvent).landId) {
                  farmId = Number(window.location.href.split("/").pop());
                } else {
                  farmId = (event as VisitEvent).landId;
                }

                const {
                  visitedFarmState, // Their gameState
                  visitorFarmState, // Your gameState
                  hasHelpedPlayerToday,
                  totalHelpedToday,
                  visitorId,
                  visitedFarmNftId,
                } = await loadGameStateForVisit(
                  Number(farmId),
                  authContext.user.rawToken as string,
                );

                return {
                  state: visitedFarmState,
                  farmId,
                  hasHelpedPlayerToday,
                  totalHelpedToday,
                  visitorId,
                  visitorState: visitorFarmState,
                  visitedFarmNftId,
                };
              },
            ),
            input: ({ context, event }) => ({ context, event }),
            onDone: {
              target: "visiting",
              actions: assign({
                state: ({ event }) => event.output.state,
                farmId: ({ event }) => event.output.farmId,
                visitorId: ({ event }) => event.output.visitorId,
                visitorState: ({ event }) => event.output.visitorState,
                nftId: ({ event }) => event.output.visitedFarmNftId,
                visitorNftId: ({ context }) => context.nftId,
                hasHelpedPlayerToday: ({ event }) =>
                  event.output.hasHelpedPlayerToday,
                totalHelpedToday: ({ event }) => event.output.totalHelpedToday,
                actions: () => [],
              }),
            },
            onError: {
              target: "landToVisitNotFound",
            },
          },
        },
        landToVisitNotFound: {
          entry: assign({
            state: () => EMPTY,
          }),
          on: {
            VISIT: {
              target: "loadLandToVisit",
            },
          },
        },
        visiting: {
          on: {
            ...VISIT_EFFECT_EVENT_HANDLERS,
            ...VISITING_EVENT_HANDLERS,
            SAVE: {
              target: "autosaving",
            },
            VISIT: {
              target: "loadLandToVisit",
            },
            END_VISIT: {
              target: "playing",
              actions: assign(({ context }) => ({
                visitorId: undefined,
                visitorState: undefined,
                visitorNftId: undefined,
                hasHelpedPlayerToday: undefined,
                totalHelpedToday: undefined,
                state: context.visitorState,
                farmId: context.visitorId,
                nftId: context.visitorNftId,
                actions: [],
              })),
            },
          },
        },
        notifying: {
          always: [
            {
              target: "welcome",
              guard: ({ context }) => {
                const isNew =
                  context.state.createdAt > new Date("2026-01-28").getTime();
                return (
                  isNew && !context.state.farmActivity["welcome Bonus Claimed"]
                );
              },
            },
            {
              target: "introduction",
              guard: ({ context }) => {
                return (
                  context.state.bumpkin?.experience === 0 &&
                  !getIntroductionRead()
                );
              },
            },

            {
              target: "investigating",
              guard: ({ context }) => {
                return context.state.ban.status === "investigating";
              },
            },

            {
              target: "gems",
              guard: ({ context }) => {
                return !!context.state.inventory["Block Buck"]?.gte(1);
              },
            },

            {
              target: "communityCoin",
              guard: ({ context }) => {
                return !!context.state.inventory["Community Coin"]?.gte(1);
              },
            },

            // TODO - FIX
            // {
            //   target: "mailbox",
            //   guard: ({ context }) =>
            //     hasUnreadMail(context.announcements, context.state.mailbox),
            // },
            {
              target: "swarming",
              guard: () => isSwarming(),
            },
            {
              target: "blessing",
              guard: ({ context }) => {
                const { offered, reward } = context.state.blessing;

                if (reward) return true;

                if (!offered) return false;

                return blessingIsReady({ game: context.state });
              },
            },
            {
              target: "vip",
              guard: ({ context }) => {
                const isNew = context.state.bumpkin.experience < 100;

                // Don't show for new players
                if (isNew) return false;

                // Wow, they haven't seen the VIP promo in 1 month
                const readAt = getVipRead();
                if (
                  !hasVipAccess({ game: context.state }) &&
                  (!readAt ||
                    readAt.getTime() <
                      Date.now() - 1 * 31 * 24 * 60 * 60 * 1000)
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
                  (readAt?.getTime() ?? 0) <
                    vip.expiresAt - 3 * 24 * 60 * 60 * 1000;

                if (isExpiring) return true;

                const hasExpired =
                  vip &&
                  vip.expiresAt &&
                  vip.expiresAt < Date.now() &&
                  // Hasn't read since expired
                  (readAt?.getTime() ?? 0) < vip.expiresAt;

                if (hasExpired) return true;

                return false;
              },
            },

            {
              target: "referralRewards",
              guard: ({ context }) => {
                return !!context.state.referrals?.rewards;
              },
            },

            {
              target: "somethingArrived",
              guard: ({ context }) => !!context.revealed,
            },

            {
              target: "seasonChanged",
              guard: ({ context }) => {
                return (
                  context.state.island.type !== "basic" &&
                  (context.state.island.upgradedAt ?? 0) <
                    context.state.season.startedAt &&
                  context.state.season.startedAt !==
                    getLastTemperateSeasonStartedAt()
                );
              },
            },

            {
              target: "calendarEvent",
              guard: ({ context }) => {
                const game = context.state;

                const activeEvent = getActiveCalendarEvent({
                  calendar: game.calendar,
                });

                if (!activeEvent) return false;

                const isAcknowledged =
                  game?.calendar[activeEvent as SeasonalEventName]
                    ?.acknowledgedAt;

                return !isAcknowledged;
              },
            },

            {
              target: "competition",
              guard: () => false,
            },

            {
              target: "linkWallet",
              guard: ({ context }) => {
                return (
                  (context.method === "fsl" || context.method === "wechat") &&
                  !context.linkedWallet
                );
              },
            },

            {
              target: "dailyReward",
              guard: ({ context }) => {
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
              },
            },

            // EVENTS THAT TARGET NOTIFYING OR LOADING MUST GO ABOVE THIS LINE

            // EVENTS THAT TARGET PLAYING MUST GO BELOW THIS LINE
            // {
            //   target: "promo",
            //   guard: ({ context }) => {
            //     return (
            //       context.state.bumpkin?.experience === 0 &&
            //       getPromoCode() === "crypto-com"
            //     );
            //   },
            // },
            {
              target: "airdrop",
              guard: ({ context }) => {
                const airdrop = context.state.airdrops?.find(
                  (airdrop) => !airdrop.coordinates,
                );

                return !!airdrop;
              },
            },

            {
              // auctionResults needs to be the last check as it transitions directly
              // to playing. It does not target notifying.
              target: "auctionResults",
              guard: ({ context }: { context: Context }) =>
                !!context.state.auctioneer.bid,
            },
            {
              target: "offers",
              guard: ({ context }: { context: Context }) =>
                getKeys(context.state.trades.offers ?? {}).some(
                  (id) => !!context.state.trades.offers![id].fulfilledAt,
                ),
            },
            {
              target: "marketplaceSale",
              guard: ({ context }: { context: Context }) =>
                getKeys(context.state.trades.listings ?? {}).some(
                  (id) => !!context.state.trades.listings![id].fulfilledAt,
                ),
            },
            {
              target: "tradesCleared",
              guard: ({ context }: { context: Context }) => {
                return (
                  getKeys(context.state.trades.listings ?? {}).some(
                    (id) => !!context.state.trades.listings![id].clearedAt,
                  ) ||
                  getKeys(context.state.trades.offers ?? {}).some(
                    (id) => !!context.state.trades.offers![id].clearedAt,
                  )
                );
              },
            },

            {
              target: "jinAirdrop",
              guard: ({ context }) =>
                !!context.state.nfts?.ronin?.acknowledgedAt &&
                (context.state.inventory["Jin"] ?? new Decimal(0)).lt(1),
            },
            {
              target: "leagueResults",
              guard: shouldShowLeagueResults,
            },
            {
              target: "playing",
            },
          ],
        },

        vip: {
          on: {
            ACKNOWLEDGE: {
              target: "notifying",
            },
          },
        },
        somethingArrived: {
          on: {
            ACKNOWLEDGE: {
              target: "notifying",
              actions: assign(() => ({
                revealed: undefined,
              })),
            },
          },
        },
        seasonChanged: {
          on: {
            ACKNOWLEDGE: {
              target: "notifying",
            },
          },
        },
        calendarEvent: {
          on: {
            "daily.reset": (GAME_EVENT_HANDLERS as any)["daily.reset"],
            "calendarEvent.acknowledged": (GAME_EVENT_HANDLERS as any)[
              "calendarEvent.acknowledged"
            ],
            ACKNOWLEDGE: {
              target: "notifying",
            },
            CONTINUE: {
              target: "autosaving",
            },
          },
        },
        promo: {
          on: {
            ACKNOWLEDGE: {
              target: "playing",
            },
          },
        },
        buds: {
          on: {
            ACKNOWLEDGE: {
              target: "playing",
            },
          },
        },

        blessing: {
          on: {
            "blessing.claimed": (GAME_EVENT_HANDLERS as any)[
              "blessing.claimed"
            ],
            "blessing.seeked": {
              target: STATE_MACHINE_EFFECTS["blessing.seeked"],
            },
            ACKNOWLEDGE: {
              target: "notifying",
            },
          },
        },
        mailbox: {
          on: {
            "message.read": (GAME_EVENT_HANDLERS as any)["message.read"],
            ACKNOWLEDGE: {
              target: "notifying",
            },
          },
        },
        airdrop: {
          on: {
            "airdrop.claimed": (GAME_EVENT_HANDLERS as any)["airdrop.claimed"],
            CLOSE: {
              target: "playing",
            },
          },
        },
        offers: {
          on: {
            "offer.claimed": (GAME_EVENT_HANDLERS as any)["offer.claimed"],
            RESET: {
              target: "refreshing",
            },
            CLOSE: {
              target: "playing",
            },
          },
        },
        marketplaceSale: {
          on: {
            "purchase.claimed": (GAME_EVENT_HANDLERS as any)[
              "purchase.claimed"
            ],
            RESET: {
              target: "refreshing",
            },
            CLOSE: {
              target: "playing",
            },
          },
        },
        tradesCleared: {
          on: {
            "trades.cleared": (GAME_EVENT_HANDLERS as any)["trades.cleared"],

            CLOSE: {
              target: "playing",
            },
          },
        },
        auctionResults: {
          entry: "setTransactionId",
          invoke: {
            src: fromPromise(async ({ input: context }: { input: Context }) => {
              const {
                user: { rawToken },
              } = authContext;

              const auctionResults = await getAuctionResults({
                farmId: Number(context.farmId),
                token: rawToken as string,
                auctionId: context.state.auctioneer.bid?.auctionId as string,
                transactionId: context.transactionId as string,
              });

              return { auctionResults };
            }),
            input: ({ context }) => context,
            onDone: [
              {
                target: "claimAuction",
                guard: ({ event }) =>
                  event.output.auctionResults.status === "winner",
                actions: assign(({ event }) => ({
                  auctionResults: event.output.auctionResults,
                })),
              },
              {
                target: "refundAuction",
                guard: ({ event }) =>
                  event.output.auctionResults.status === "loser" ||
                  event.output.auctionResults.status === "tiebreaker",
                actions: assign(({ event }) => ({
                  auctionResults: event.output.auctionResults,
                })),
              },
              {
                target: "playing",
              },
            ],
            onError: {
              target: "playing",
            },
          },
        },
        claimAuction: {
          on: {
            "auction.claimed": {
              target: STATE_MACHINE_EFFECTS["auction.claimed"],
            },
            "wallet.linked": {
              target: STATE_MACHINE_EFFECTS["wallet.linked"],
            },
            "nft.assigned": {
              target: STATE_MACHINE_EFFECTS["nft.assigned"],
            },
            "admin.NFTAssigned": {
              target: STATE_MACHINE_EFFECTS["admin.NFTAssigned"],
            },
            TRANSACT: {
              target: "transacting",
            },
            CLOSE: {
              target: "playing",
            },
          },
        },
        refundAuction: {
          on: {
            "bid.refunded": (GAME_EVENT_HANDLERS as any)["bid.refunded"],
            CLOSE: {
              target: "autosaving",
            },
          },
        },

        jinAirdrop: {
          on: {
            "specialEvent.taskCompleted": (GAME_EVENT_HANDLERS as any)[
              "specialEvent.taskCompleted"
            ],
            CLOSE: {
              target: "playing",
            },
          },
        },
        leagueResults: {
          on: {
            "leagues.updated": {
              target: STATE_MACHINE_EFFECTS["leagues.updated"],
            },
            CLOSE: {
              target: "playing",
            },
          },
        },
        playing: {
          id: "playing",
          entry: "clearTransactionId",
          invoke: {
            /**
             * An in game loop that checks if Blockchain becomes out of sync
             * It is a rare event but it saves a user from making too much progress that would not be synced
             */
            src: fromCallback(({ sendBack, input: context }) => {
              const interval = setInterval(
                async () => {
                  if (!context.farmAddress) return;

                  const sessionID = await getSessionId(
                    context.farmId as number,
                  );

                  if (sessionID !== context.sessionId) {
                    sendBack({ type: "EXPIRED" });
                  }
                },
                1000 * 60 * 2,
              );

              return () => {
                clearInterval(interval);
              };
            }),
            input: ({ context }) => context,
            onError: [
              {
                target: "error",
                actions: "assignErrorMessage",
              },
            ],
          },
          on: {
            ...EFFECT_EVENT_HANDLERS,
            ...GAME_EVENT_HANDLERS,
            ...PLACEMENT_EVENT_HANDLERS,
            UPDATE_USERNAME: {
              actions: assign(({ context, event }) => ({
                state: {
                  ...context.state,
                  username: event.username,
                },
              })),
            },
            SAVE: {
              target: "autosaving",
            },
            TRANSACT: {
              target: "transacting",
            },
            BUY_GEMS: {
              target: "buyingBlockBucks",
            },
            REVEAL: {
              target: "revealing",
            },
            EXPIRED: {
              target: "error",
              actions: assign(() => ({
                errorCode: ERRORS.SESSION_EXPIRED as ErrorCode,
              })),
            },
            RESET: {
              target: "refreshing",
            },
            DEPOSIT: {
              target: "depositing",
            },
            DEPOSIT_FLOWER_FROM_LINKED_WALLET: {
              target: "depositingFlowerFromLinkedWallet",
            },
            DEPOSIT_SFL_FROM_LINKED_WALLET: {
              target: "depositingSFLFromLinkedWallet",
            },
            REFRESH: {
              target: "loading",
            },
            LANDSCAPE: {
              target: "landscaping",
            },
            RANDOMISE: {
              target: "randomising",
            },
            BUY_SFL: {
              target: "buyingSFL",
            },
            SELL_MARKET_RESOURCE: { target: "sellMarketResource" },
            UPDATE_GEMS: {
              actions: assign(({ context, event }) => ({
                state: {
                  ...context.state,
                  inventory: {
                    ...context.state.inventory,
                    Gem: (context.state.inventory["Gem"] ?? new Decimal(0)).add(
                      event.amount,
                    ),
                  },
                },
                purchases: [
                  ...context.purchases,
                  {
                    id: "Gem",
                    method: "XSOLLA",
                    purchasedAt: Date.now(),
                    usd: 1, // Placeholder
                  } as Purchase,
                ],
              })),
            },
            UPDATE: {
              actions: assign(({ event }) => ({
                state: event.state,
              })),
            },
            VISIT: {
              target: "loadLandToVisit",
            },
          },
        },
        buyingSFL: {
          entry: "setTransactionId",
          invoke: {
            src: fromPromise(
              async ({
                input,
              }: {
                input: { context: Context; event: BlockchainEvent };
              }) => {
                const { context, event } = input;
                await buySFL({
                  farmId: Number(context.farmId),
                  token: authContext.user.rawToken as string,
                  transactionId: context.transactionId as string,
                  matic: (event as BuySFLEvent).maticAmount,
                  amountOutMin: (event as BuySFLEvent).amountOutMin,
                });
              },
            ),
            input: ({ context, event }) => ({ context, event }),
            onDone: {
              target: "refreshing",
            },
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        autosaving: {
          entry: "setTransactionId",
          id: "autosaving",
          on: {
            ...GAME_EVENT_HANDLERS,
            SAVE: {
              actions: assign({
                saveQueued: ({ context }) => context.actions.length > 0,
              }),
            },
          },
          invoke: {
            src: fromPromise(
              async ({
                input,
              }: {
                input: { context: Context; event: BlockchainEvent };
              }) => {
                const { context, event } = input;
                const farmId = context.visitorId ?? context.farmId;
                const data = await saveGame(
                  context,
                  event,
                  farmId,
                  authContext.user.rawToken as string,
                );

                return data;
              },
            ),
            input: ({ context, event }) => ({ context, event }),
            onDone: [
              {
                target: "autosaving",
                // If a SAVE was queued up, go back into saving
                guard: ({ context }) => context.saveQueued,
                actions: assign(({ context, event }) =>
                  handleSuccessfulSave(context, event.output),
                ),
              },
              {
                target: "seasonChanged",
                guard: ({ context, event }) => {
                  return (
                    context.state.island.type !== "basic" &&
                    (context.state.island.upgradedAt ?? 0) <
                      event.output.farm.seasonStartedAt &&
                    event.output.farm.season.startedAt !==
                      getLastTemperateSeasonStartedAt()
                  );
                },
                actions: assign(({ context, event }) =>
                  handleSuccessfulSave(context, event.output),
                ),
              },
              {
                target: "calendarEvent",
                guard: ({ context, event }) => {
                  if (context.visitorState) return false;

                  const game = event.output.farm;

                  const activeEvent = getActiveCalendarEvent({
                    calendar: game.calendar,
                  });

                  if (!activeEvent) return false;

                  const isAcknowledged =
                    game.calendar[activeEvent].acknowledgedAt;

                  return !isAcknowledged;
                },
                actions: assign(({ context, event }) =>
                  handleSuccessfulSave(context, event.output),
                ),
              },
              {
                target: "leagueResults",
                guard: shouldShowLeagueResults,
                actions: assign(({ context, event }) =>
                  handleSuccessfulSave(context, event.output),
                ),
              },
              {
                target: "visiting",
                guard: ({ context }) => !!context.visitorId,
                actions: assign(({ context, event }) =>
                  handleSuccessfulSave(context, event.output),
                ),
              },
              {
                target: "playing",
                actions: assign(({ context, event }) =>
                  handleSuccessfulSave(context, event.output),
                ),
              },
            ],
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        transacting: {
          entry: "setTransactionId",
          invoke: {
            src: fromPromise(
              async ({
                input,
              }: {
                input: { context: Context; event: BlockchainEvent };
              }) => {
                const { context, event } = input;
                // Autosave just in case
                if (context.actions.length > 0) {
                  await autosave({
                    farmId: Number(context.farmId),
                    sessionId: context.sessionId as string,
                    actions: context.actions,
                    token: authContext.user.rawToken as string,
                    fingerprint: context.fingerprint as string,
                    deviceTrackerId: context.deviceTrackerId as string,
                    transactionId: context.transactionId as string,
                    state: context.state,
                  });
                }

                const { transaction, request } = event as TransactEvent;

                const { gameState } = await TRANSACTION_SIGNATURES[transaction](
                  {
                    ...request,
                    farmId: Number(context.farmId),
                    token: authContext.user.rawToken as string,
                    transactionId: context.transactionId as string,
                  },
                );

                return {
                  // sessionId: sessionId,
                  farm: gameState,
                };
              },
            ),
            input: ({ context, event }) => ({ context, event }),
            onDone: {
              target: "playing",
              actions: [
                assign(({ event }) => ({
                  state: event.output.farm,
                  actions: [],
                })),
              ],
            },
            onError: [
              {
                target: "playing",
                guard: ({ event }) =>
                  (event as unknown as { error?: { message?: string } }).error
                    ?.message === ERRORS.REJECTED_TRANSACTION,
                actions: assign(() => ({
                  actions: [],
                })),
              },
              {
                target: "error",
                actions: "assignErrorMessage",
              },
            ],
          },
        },
        buyingBlockBucks: {
          entry: "setTransactionId",
          invoke: {
            src: fromPromise(
              async ({
                input,
              }: {
                input: { context: Context; event: BlockchainEvent };
              }) => {
                const { context, event } = input;
                const transaction = await buyBlockBucks({
                  farmId: Number(context.farmId),
                  type: (event as BuyBlockBucksEvent).currency,
                  amount: (event as BuyBlockBucksEvent).amount,
                  token: authContext.user.rawToken as string,
                  transactionId: context.transactionId as string,
                });

                const response = await buyBlockBucksMATIC(transaction);

                return {
                  ...response,
                  amount: transaction.amount,
                };
              },
            ),
            input: ({ context, event }) => ({ context, event }),
            onDone: {
              target: "playing",
              actions: assign(({ context, event }) => ({
                state: {
                  ...context.state,
                  inventory: {
                    ...context.state.inventory,
                    Gem: (context.state.inventory["Gem"] ?? new Decimal(0)).add(
                      event.output.amount,
                    ),
                  },
                },
                purchases: [
                  ...context.purchases,
                  {
                    id: `${event.output.amount} Gem`,
                    method: "MATIC",
                    purchasedAt: Date.now(),
                    usd: 1, // Placeholder
                  },
                ],
              })),
            },
            onError: [
              {
                target: "playing",
                guard: ({ event }) =>
                  (event as unknown as { error?: { message?: string } }).error
                    ?.message === ERRORS.REJECTED_TRANSACTION,
                actions: assign(() => ({
                  actions: [],
                })),
              },
              {
                target: "#error",
                actions: "assignErrorMessage",
              },
            ],
          },
        },

        // Similar to autosaving, but for events that are only processed server side
        revealing: {
          entry: "setTransactionId",
          invoke: {
            src: fromPromise(
              async ({
                input,
              }: {
                input: { context: Context; event: BlockchainEvent };
              }) => {
                const { context, event: e } = input;
                // Grab the server side event to fire
                const { event } = e as { event: any; type: "REVEAL" };

                if (context.actions.length > 0) {
                  await autosave({
                    farmId: Number(context.farmId),
                    sessionId: context.sessionId as string,
                    actions: context.actions,
                    token: authContext.user.rawToken as string,
                    fingerprint: context.fingerprint as string,
                    deviceTrackerId: context.deviceTrackerId as string,
                    transactionId: context.transactionId as string,
                    state: context.state,
                  });
                }

                const { farm, changeset } = await autosave({
                  farmId: Number(context.farmId),
                  sessionId: context.sessionId as string,
                  actions: [event],
                  token: authContext.user.rawToken as string,
                  fingerprint: context.fingerprint as string,
                  deviceTrackerId: context.deviceTrackerId as string,
                  transactionId: context.transactionId as string,
                  state: context.state,
                });

                return {
                  event,
                  farm,
                  changeset,
                };
              },
            ),
            input: ({ context, event }) => ({ context, event }),
            onDone: [
              {
                target: "beanRevealed",
                guard: ({ event }) =>
                  event.output.event.type === "bean.harvested",
                actions: assign(({ context, event }) => {
                  return {
                    // Remove events
                    actions: [],
                    // Update immediately with state from server except for collectibles
                    state: {
                      ...event.output.farm,
                      collectibles: {
                        ...event.output.farm.collectibles,
                        "Magic Bean": context.state.collectibles["Magic Bean"],
                      },
                    },
                    revealed: event.output.changeset,
                  };
                }),
              },
              {
                target: "genieRevealed",
                guard: ({ event }) =>
                  event.output.event.type === "genieLamp.rubbed",
                actions: assign(({ context, event }) => {
                  const lamps = context.state.collectibles["Genie Lamp"]?.map(
                    (lamp) => {
                      if (lamp.id === event.output.event.id) {
                        return {
                          ...lamp,
                          rubbedCount: (lamp.rubbedCount ?? 0) + 1,
                        };
                      }

                      return lamp;
                    },
                  );

                  return {
                    // Remove events
                    actions: [],
                    // Update immediately with state from server except for collectibles
                    state: {
                      ...event.output.farm,
                      collectibles: {
                        ...event.output.farm.collectibles,
                        "Genie Lamp": lamps,
                      },
                    },
                    revealed: event.output.changeset,
                  };
                }),
              },
              {
                target: "revealed",
                actions: assign(({ event }) => ({
                  // Remove events
                  actions: [],
                  // Update immediately with state from server
                  state: event.output.farm,
                  revealed: event.output.changeset,
                })),
              },
            ],
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        revealed: {
          on: {
            CONTINUE: {
              target: "playing",
              actions: assign(({ event }) => ({
                revealed: undefined,
              })),
            },
          },
        },

        genieRevealed: {
          on: {
            CONTINUE: {
              target: "playing",
              actions: assign(({ context, event }) => {
                const shouldRemoveLamp = (lamp: PlacedLamp) =>
                  lamp.id === event.id && (lamp.rubbedCount ?? 0) >= 3;

                // Delete the Lamp from the collectibles after it's been rubbed 3 times
                const lamps = context.state.collectibles["Genie Lamp"];
                const newLamps = lamps?.filter(
                  (lamp) => !shouldRemoveLamp(lamp),
                );

                return {
                  state: {
                    ...context.state,
                    collectibles: {
                      ...context.state.collectibles,
                      "Genie Lamp": newLamps,
                    },
                  },
                  revealed: undefined,
                };
              }),
            },
          },
        },
        beanRevealed: {
          on: {
            CONTINUE: {
              target: "playing",
              actions: assign(({ context, event }) => {
                // Delete the Bean from the collectibles
                const beans = context.state.collectibles["Magic Bean"];
                const newBeans = beans?.filter(
                  (bean) => !(bean.id === event.id),
                );

                return {
                  state: {
                    ...context.state,
                    collectibles: {
                      ...context.state.collectibles,
                      "Magic Bean": newBeans,
                    },
                  },
                  revealed: undefined,
                };
              }),
            },
          },
        },
        sellMarketResource: {
          entry: "setTransactionId",
          invoke: {
            src: fromPromise(
              async ({
                input,
              }: {
                input: { context: Context; event: BlockchainEvent };
              }) => {
                const { context, event } = input;
                const { item, pricePerUnit } = event as SellMarketResourceEvent;

                if (context.actions.length > 0) {
                  await autosave({
                    farmId: Number(context.farmId),
                    sessionId: context.sessionId as string,
                    actions: context.actions,
                    token: authContext.user.rawToken as string,
                    fingerprint: context.fingerprint as string,
                    deviceTrackerId: context.deviceTrackerId as string,
                    transactionId: context.transactionId as string,
                    state: context.state,
                  });
                }

                const { farm, prices, error } = await sellMarketResourceRequest(
                  {
                    farmId: Number(context.farmId),
                    token: authContext.user.rawToken as string,
                    soldAt: new Date().toISOString(),
                    item,
                    pricePerUnit,
                  },
                );

                return {
                  farm,
                  error,
                  prices,
                };
              },
            ),
            input: ({ context, event }) => ({ context, event }),
            onDone: [
              {
                target: "priceChanged",
                guard: ({ event }) => event.output.error === "PRICE_CHANGED",
              },
              {
                target: "playing",
                actions: [
                  ({ event }) => {
                    setCachedMarketPrices(event.output.prices);
                  },
                  assign(({ event }) => ({
                    actions: [],
                    state: event.output.farm,
                  })),
                ],
              },
            ],
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        priceChanged: {
          on: {
            CONTINUE: "playing",
          },
        },
        depositingFlowerFromLinkedWallet: {
          invoke: {
            src: fromPromise(
              async ({
                input,
              }: {
                input: { context: Context; event: BlockchainEvent };
              }) => {
                const { context, event } = input;
                if (!wallet.getConnection()) throw new Error("No account");

                const { amount, depositAddress, selectedNetwork } =
                  event as DepositFlowerFromLinkedWalletEvent;

                await depositFlower({
                  account: wallet.getConnection() as `0x${string}`,
                  depositAddress,
                  amount,
                  selectedNetwork,
                });
              },
            ),
            input: ({ context, event }) => ({ context, event }),
            onDone: {
              target: "playing",
              actions: raise(() => ({
                type: "flower.depositStarted",
                effect: {
                  type: "flower.depositStarted",
                  chainId: getChainId(config),
                },
                authToken: authContext.user.rawToken as string,
              })),
            },
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        depositingSFLFromLinkedWallet: {
          invoke: {
            src: fromPromise(
              async ({
                input,
              }: {
                input: { context: Context; event: BlockchainEvent };
              }) => {
                const { context, event } = input;
                const address = wallet.getConnection();
                if (!address) throw new Error("No account");

                const { amount, depositAddress, selectedNetwork } =
                  event as DepositSFLFromLinkedWalletEvent;

                await depositSFL({
                  account: address,
                  depositAddress,
                  amount,
                  selectedNetwork,
                });
              },
            ),
            input: ({ context, event }) => ({ context, event }),
            onDone: {
              target: "playing",
              actions: raise(() => ({
                type: "sfl.depositStarted",
                effect: {
                  type: "sfl.depositStarted",
                  chainId: getChainId(config),
                },
                authToken: authContext.user.rawToken as string,
              })),
            },
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        depositing: {
          invoke: {
            src: fromPromise(
              async ({
                input,
              }: {
                input: { context: Context; event: BlockchainEvent };
              }) => {
                const { context, event } = input;
                const account = wallet.getConnection();
                if (!account) throw new Error("No account");

                const {
                  itemAmounts,
                  itemIds,
                  petIds,
                  wearableIds,
                  wearableAmounts,
                  budIds,
                } = event as DepositEvent;

                await depositToFarm({
                  account,
                  farmId: context.nftId as number,
                  itemIds: itemIds,
                  itemAmounts: itemAmounts,
                  wearableAmounts,
                  wearableIds,
                  budIds,
                  petIds,
                });
              },
            ),
            input: ({ context, event }) => ({ context, event }),
            onDone: {
              target: "refreshing",
            },
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        refreshing: {
          entry: "setTransactionId",
          invoke: {
            src: fromPromise(
              async ({
                input,
              }: {
                input: { context: Context; event: BlockchainEvent };
              }) => {
                const { context, event: e } = input;
                if (context.actions.length > 0) {
                  await autosave({
                    farmId: Number(context.farmId),
                    sessionId: context.sessionId as string,
                    actions: context.actions,
                    token: authContext.user.rawToken as string,
                    fingerprint: context.fingerprint as string,
                    deviceTrackerId: context.deviceTrackerId as string,
                    transactionId: context.transactionId as string,
                    state: context.state,
                  });
                }

                const { success, changeset } = await reset({
                  farmId: context.farmId,
                  token: authContext.user.rawToken as string,
                  fingerprint: context.fingerprint as string,
                  transactionId: context.transactionId as string,
                });

                return { success, changeset };
              },
            ),
            input: ({ context, event }) => ({ context, event }),
            onDone: [
              {
                target: "loading",
                actions: assign({
                  revealed: ({ event }) => event.output.changeset,
                  actions: () => [],
                }),
              },
            ],
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        error: {
          id: "error",
          on: {
            CONTINUE: "playing",
            REFRESH: {
              target: "loading",
            },
          },
        },
        hoarding: {
          on: {
            TRANSACT: {
              target: "transacting",
            },
            ACKNOWLEDGE: {
              target: "playing",
            },
          },
        },
        introduction: {
          on: {
            ACKNOWLEDGE: {
              target: "notifying",
            },
          },
        },

        welcome: {
          on: {
            "bonus.claimed": (GAME_EVENT_HANDLERS as any)["bonus.claimed"],
            ACKNOWLEDGE: {
              target: "notifying",
            },
          },
        },

        investigating: {
          on: {
            "faceRecognition.started": {
              target: STATE_MACHINE_EFFECTS["faceRecognition.started"],
            },
            "faceRecognition.completed": {
              target: STATE_MACHINE_EFFECTS["faceRecognition.completed"],
            },
            "telegram.linked": {
              target: STATE_MACHINE_EFFECTS["telegram.linked"],
            },
          },
        },

        competition: {
          on: {
            "competition.started": (GAME_EVENT_HANDLERS as any)[
              "competition.started"
            ],
            ACKNOWLEDGE: {
              target: "notifying",
            },
          },
        },

        linkWallet: {
          on: {
            ACKNOWLEDGE: {
              target: "notifying",
            },
          },
        },
        gems: {
          on: {
            ACKNOWLEDGE: {
              target: "notifying",
            },
            "garbage.sold": (GAME_EVENT_HANDLERS as any)["garbage.sold"],
          },
        },

        communityCoin: {
          on: {
            ACKNOWLEDGE: {
              target: "notifying",
            },
            "garbage.sold": (GAME_EVENT_HANDLERS as any)["garbage.sold"],
          },
        },

        referralRewards: {
          on: {
            ACKNOWLEDGE: {
              target: "notifying",
            },
            "referral.rewardsClaimed": (GAME_EVENT_HANDLERS as any)[
              "referral.rewardsClaimed"
            ],
          },
        },

        dailyReward: {
          on: {
            CONTINUE: {
              target: "notifying",
            },
            "dailyReward.claimed": (GAME_EVENT_HANDLERS as any)[
              "dailyReward.claimed"
            ],
          },
        },

        swarming: {
          on: {
            REFRESH: {
              target: "loading",
            },
          },
        },
        landscaping: {
          invoke: {
            id: "landscaping",
            src: landscapingMachine,
            input: ({ event }) => ({
              placeable: (event as LandscapeEvent).placeable,
              action: (event as LandscapeEvent).action,
              requirements: (event as LandscapeEvent).requirements,
              coordinates: { x: 0, y: 0 },
              collisionDetected: true,
              multiple: (event as LandscapeEvent).multiple,
              maximum: (event as LandscapeEvent).maximum,
              location: (event as LandscapeEvent).location,
            }),
            onDone: {
              target: "autosaving",
            },
            onError: [
              {
                target: "playing",
                guard: ({ event }) =>
                  (event as unknown as { error?: { message?: string } }).error
                    ?.message === ERRORS.REJECTED_TRANSACTION,
              },
              {
                target: "error",
                actions: "assignErrorMessage",
              },
            ],
          },
          on: {
            ...PLACEMENT_EVENT_HANDLERS,
            SAVE: {
              actions: sendTo(
                "landscaping",
                ({ context }) =>
                  ({
                    type: "SAVE",
                    gameMachineContext: context,
                    rawToken: authContext.user.rawToken as string,
                    farmId: context.farmId,
                  }) as SaveEvent,
              ),
            },
            SAVE_SUCCESS: {
              actions: assign(({ context, event }) =>
                handleSuccessfulSave(
                  context,
                  event as unknown as {
                    saveAt: Date;
                    farm: GameState;
                    announcements: Announcements;
                  },
                ),
              ),
            },
            SAVE_ERROR: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        randomising: {
          invoke: {
            src: fromPromise(async () => {
              const { game } = await generateTestLand();

              return { game };
            }),
            onDone: {
              target: "playing",
              actions: assign({
                state: ({ context, event }) => ({
                  ...context.state,
                  ...makeGame(event.output.game),
                }),
              }),
            },
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
      },
      on: {
        PAUSE: {
          actions: assign({
            paused: () => true,
          }),
        },
        PLAY: {
          actions: assign({
            paused: () => false,
          }),
        },
        COMMUNITY_UPDATE: {
          actions: assign({
            state: ({ event }) => event.game,
          }),
        },
      },
    },
    {
      actions: {
        setTransactionId: assign({ transactionId: () => randomID() }),
        clearTransactionId: assign({
          transactionId: () => undefined as string | undefined,
        }),
        assignErrorMessage: assign(({ event }) => ({
          errorCode: (event as { error?: { message?: string } }).error
            ?.message as ErrorCode,
          actions: [] as PastAction[],
        })),
      },
    },
  );
}
