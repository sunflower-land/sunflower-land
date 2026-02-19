import {
  createMachine,
  Interpreter,
  assign,
  TransitionsConfig,
  State,
  send,
  DoneInvokeEvent,
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

const shouldShowLeagueResults = (context: Context) => {
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

const playingEventHandler = (eventName: string) => {
  return {
    [eventName]: [
      {
        target: "hoarding",
        cond: (context: Context, event: PlayingEvent | VisitingEvent) => {
          const { valid } = checkProgress({
            state: context.state as GameState,
            action: event,
            farmId: context.farmId,
            createdAt: Date.now(),
          });

          return !valid;
        },
        actions: assign(
          (context: Context, event: PlayingEvent | VisitingEvent) => {
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
          (context: Context, event: PlayingEvent | VisitingEvent) => {
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
const GAME_EVENT_HANDLERS: TransitionsConfig<Context, BlockchainEvent> =
  Object.keys(PLAYING_EVENTS).reduce(
    (events, eventName) => ({
      ...events,
      ...playingEventHandler(eventName),
    }),
    {},
  );

const VISITING_EVENT_HANDLERS: TransitionsConfig<Context, BlockchainEvent> =
  Object.keys(VISITING_EVENTS).reduce(
    (events, eventName) => ({
      ...events,
      ...playingEventHandler(eventName),
    }),
    {},
  );

const PLACEMENT_EVENT_HANDLERS: TransitionsConfig<Context, BlockchainEvent> = [
  ...Object.keys(PLACEMENT_EVENTS),
  "biome.bought",
  "biome.applied",
].reduce(
  (events, eventName) => ({
    ...events,
    [eventName]: {
      actions: assign((context: Context, event: PlacementEvent) => {
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
      }),
    },
  }),
  {},
);

const EFFECT_EVENT_HANDLERS: TransitionsConfig<Context, BlockchainEvent> =
  getKeys(STATE_MACHINE_EFFECTS).reduce(
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
            cond: (context: Context, event: DoneInvokeEvent<any>) =>
              !!context.visitorId,
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
            cond: (context: Context, event: DoneInvokeEvent<any>) =>
              !!context.visitorId,
          },
          { target: "notifying" },
        ],
        REFRESH: [
          {
            target: "visiting",
            cond: (context: Context, event: DoneInvokeEvent<any>) =>
              !!context.visitorId,
          },
          { target: "notifying" },
        ],
      },
    },
    [stateName]: {
      entry: "setTransactionId",
      invoke: {
        src: async (context: Context, event: PostEffectEvent) => {
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
        onDone: [
          {
            target: `${stateName}Success`,
            cond: (_: Context, event: DoneInvokeEvent<any>) =>
              !event.data.state.transaction,
            actions: [
              assign((context: Context, event: DoneInvokeEvent<any>) => {
                return {
                  actions: [],
                  state: event.data.state,
                  linkedWallet:
                    event.data.data?.linkedWallet ?? context.linkedWallet,
                  nftId: event.data.data?.nftId ?? context.nftId,
                  farmAddress:
                    event.data.data?.farmAddress ?? context.farmAddress,
                  data: { ...context.data, [stateName]: event.data.data },
                };
              }),
            ],
          },
          // If there is a transaction on the gameState move into playing so that
          // the transaction flow can handle the rest of the flow
          {
            target: `notifying`,
            actions: [
              assign((_, event: DoneInvokeEvent<any>) => ({
                actions: [],
                state: event.data.state,
              })),
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

const VISIT_EFFECT_EVENT_HANDLERS: TransitionsConfig<Context, BlockchainEvent> =
  getKeys(STATE_MACHINE_VISIT_EFFECTS).reduce(
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
        src: async (context: Context, event: PostEffectEvent) => {
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
        onDone: [
          {
            target: `${stateName}Success`,
            cond: (_: Context, event: DoneInvokeEvent<any>) =>
              !event.data.state.transaction,
            actions: [
              assign((context: Context, event: DoneInvokeEvent<any>) => {
                const { hasHelpedPlayerToday, totalHelpedToday, ...rest } =
                  event.data.data;

                return {
                  actions: [],
                  state: event.data.state,
                  linkedWallet:
                    event.data.data?.linkedWallet ?? context.linkedWallet,
                  nftId: event.data.data?.nftId ?? context.nftId,
                  farmAddress:
                    event.data.data?.farmAddress ?? context.farmAddress,
                  data: { ...context.data, [stateName]: rest },
                  visitorState: event.data.visitorState,
                  hasHelpedPlayerToday,
                  totalHelpedToday,
                };
              }),
            ],
          },
          {
            target: "visiting",
            actions: [
              assign((context: Context, event: DoneInvokeEvent<any>) => ({
                actions: [],
                state: event.data.state,
                visitorState: event.data.visitorState,
                hasHelpedPlayerToday:
                  event.data.data?.hasHelpedPlayerToday ??
                  context.hasHelpedPlayerToday,
                totalHelpedToday:
                  event.data.data?.totalHelpedToday ?? context.totalHelpedToday,
              })),
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

export type MachineState = State<Context, BlockchainEvent, BlockchainState>;

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  BlockchainState
>;

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

const handleSuccessfulSave = (context: Context, event: any) => {
  const isVisiting = !!context.visitorId;
  // Actions that occurred since the server request
  const recentActions = context.actions.filter(
    (action) => action.createdAt.getTime() > event.data.saveAt.getTime(),
  );

  if (recentActions.length === 0) {
    return {
      state: isVisiting ? context.state : event.data.farm,
      visitorState: context.visitorState,
      saveQueued: false,
      actions: [],
      announcements: event.data.announcements,
    };
  }

  const updatedState = recentActions.reduce((state, action) => {
    return processEvent({
      state,
      action,
      announcements: context.announcements,
      farmId: context.farmId,
      visitorState: context.visitorState,
      createdAt: action.createdAt.getTime(),
    });
  }, event.data.farm);

  if (Array.isArray(updatedState)) {
    const [state, visitorState] = updatedState;
    return {
      state,
      actions: recentActions,
      visitorState,
      saveQueued: false,
      announcements: event.data.announcements,
    };
  }

  return {
    actions: recentActions,
    state: updatedState,
    visitorState: context.visitorState,
    saveQueued: false,
    announcements: event.data.announcements,
  };
};

// Hashed eth 0 value
export const INITIAL_SESSION = "0x0";

export function startGame(authContext: AuthContext) {
  return createMachine<Context, BlockchainEvent, BlockchainState>(
    {
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
              cond: () => !!getError(),
              actions: assign({
                errorCode: (_) => getError() as ErrorCode,
              }),
            },
            {
              target: "notifying",
              cond: () => ART_MODE,
              actions: assign({
                state: (_context) => OFFLINE_FARM,
              }),
            },
          ],
          entry: () => {
            if (CONFIG.API_URL)
              preloadHotNow(authContext.user.rawToken as string);
          },
          invoke: {
            src: async (context) => {
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
            },
            onDone: [
              {
                target: "loadLandToVisit",
                cond: () => window.location.href.includes("visit"),
                actions: ["assignGame"],
              },
              {
                target: "blacklisted",
                cond: (_, event) => {
                  return event.data.state.ban.status === "permanent";
                },
              },
              {
                target: "portalling",
                cond: () => !!portalName,
                actions: ["assignGame"],
              },

              {
                target: "notifying",
                actions: ["assignGame", "assignUrl", "initialiseAnalytics"],
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
            src: async (context) => {
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
            },
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        loadLandToVisit: {
          invoke: {
            src: async (context, event) => {
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
              };
            },
            onDone: {
              target: "visiting",
              actions: assign({
                state: (_, event) => event.data.state,
                farmId: (_, event) => event.data.farmId,
                visitorId: (_, event) => event.data.visitorId,
                visitorState: (_, event) => event.data.visitorState,
                hasHelpedPlayerToday: (_, event) =>
                  event.data.hasHelpedPlayerToday,
                totalHelpedToday: (_, event) => event.data.totalHelpedToday,
                actions: (_, event) => [],
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
              actions: assign((context) => ({
                visitorId: undefined,
                visitorState: undefined,
                hasHelpedPlayerToday: undefined,
                totalHelpedToday: undefined,
                state: context.visitorState,
                farmId: context.visitorId,
                actions: [],
              })),
            },
          },
        },
        notifying: {
          always: [
            {
              target: "welcome",
              cond: (context) => {
                const isNew =
                  context.state.createdAt > new Date("2026-01-28").getTime();
                return (
                  isNew && !context.state.farmActivity["welcome Bonus Claimed"]
                );
              },
            },
            {
              target: "introduction",
              cond: (context) => {
                return (
                  context.state.bumpkin?.experience === 0 &&
                  !getIntroductionRead()
                );
              },
            },

            {
              target: "investigating",
              cond: (context) => {
                return context.state.ban.status === "investigating";
              },
            },

            {
              target: "gems",
              cond: (context) => {
                return !!context.state.inventory["Block Buck"]?.gte(1);
              },
            },

            {
              target: "communityCoin",
              cond: (context) => {
                return !!context.state.inventory["Community Coin"]?.gte(1);
              },
            },

            // TODO - FIX
            // {
            //   target: "mailbox",
            //   cond: (context) =>
            //     hasUnreadMail(context.announcements, context.state.mailbox),
            // },
            {
              target: "swarming",
              cond: () => isSwarming(),
            },
            {
              target: "blessing",
              cond: (context) => {
                const { offered, reward } = context.state.blessing;

                if (reward) return true;

                if (!offered) return false;

                return blessingIsReady({ game: context.state });
              },
            },
            {
              target: "vip",
              cond: (context) => {
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
              cond: (context) => {
                return !!context.state.referrals?.rewards;
              },
            },

            {
              target: "somethingArrived",
              cond: (context) => !!context.revealed,
            },

            {
              target: "seasonChanged",
              cond: (context) => {
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
              cond: (context) => {
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
              cond: () => false,
            },

            {
              target: "linkWallet",
              cond: (context) => {
                return (
                  (context.method === "fsl" || context.method === "wechat") &&
                  !context.linkedWallet
                );
              },
            },

            {
              target: "dailyReward",
              cond: (context) => {
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
            //   cond: (context) => {
            //     return (
            //       context.state.bumpkin?.experience === 0 &&
            //       getPromoCode() === "crypto-com"
            //     );
            //   },
            // },
            {
              target: "airdrop",
              cond: (context) => {
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
              cond: (context: Context) => !!context.state.auctioneer.bid,
            },
            {
              target: "offers",
              cond: (context: Context) =>
                getKeys(context.state.trades.offers ?? {}).some(
                  (id) => !!context.state.trades.offers![id].fulfilledAt,
                ),
            },
            {
              target: "marketplaceSale",
              cond: (context: Context) =>
                getKeys(context.state.trades.listings ?? {}).some(
                  (id) => !!context.state.trades.listings![id].fulfilledAt,
                ),
            },
            {
              target: "tradesCleared",
              cond: (context: Context) => {
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
              cond: (context) =>
                !!context.state.nfts?.ronin?.acknowledgedAt &&
                (context.state.inventory["Jin"] ?? new Decimal(0)).lt(1),
            },
            {
              target: "leagueResults",
              cond: shouldShowLeagueResults,
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
              actions: assign((_) => ({
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
            src: async (context: Context) => {
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
            },
            onDone: [
              {
                target: "claimAuction",
                cond: (_, event) =>
                  event.data.auctionResults.status === "winner",
                actions: assign((_, event) => ({
                  auctionResults: event.data.auctionResults,
                })),
              },
              {
                target: "refundAuction",
                cond: (_, event) =>
                  event.data.auctionResults.status === "loser" ||
                  event.data.auctionResults.status === "tiebreaker",
                actions: assign((_, event) => ({
                  auctionResults: event.data.auctionResults,
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
            src: (context) => (cb) => {
              const interval = setInterval(
                async () => {
                  if (!context.farmAddress) return;

                  const sessionID = await getSessionId(
                    context.farmId as number,
                  );

                  if (sessionID !== context.sessionId) {
                    cb("EXPIRED");
                  }
                },
                1000 * 60 * 2,
              );

              return () => {
                clearInterval(interval);
              };
            },
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
              actions: assign((context, event) => ({
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
              actions: assign((_) => ({
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
              actions: assign((context, event) => ({
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
              actions: assign((_, event) => ({
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
            src: async (context, event) => {
              await buySFL({
                farmId: Number(context.farmId),
                token: authContext.user.rawToken as string,
                transactionId: context.transactionId as string,
                matic: (event as BuySFLEvent).maticAmount,
                amountOutMin: (event as BuySFLEvent).amountOutMin,
              });
            },
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
                saveQueued: (c) => c.actions.length > 0,
              }),
            },
          },
          invoke: {
            src: async (context, event) => {
              const farmId = context.visitorId ?? context.farmId;
              const data = await saveGame(
                context,
                event,
                farmId,
                authContext.user.rawToken as string,
              );

              return data;
            },
            onDone: [
              {
                target: "autosaving",
                // If a SAVE was queued up, go back into saving
                cond: (c) => c.saveQueued,
                actions: assign((context: Context, event) =>
                  handleSuccessfulSave(context, event),
                ),
              },
              {
                target: "seasonChanged",
                cond: (context, event) => {
                  return (
                    context.state.island.type !== "basic" &&
                    (context.state.island.upgradedAt ?? 0) <
                      event.data.farm.seasonStartedAt &&
                    event.data.farm.season.startedAt !==
                      getLastTemperateSeasonStartedAt()
                  );
                },
                actions: assign((context: Context, event) =>
                  handleSuccessfulSave(context, event),
                ),
              },
              {
                target: "calendarEvent",
                cond: (context, event) => {
                  if (context.visitorState) return false;

                  const game = event.data.farm;

                  const activeEvent = getActiveCalendarEvent({
                    calendar: game.calendar,
                  });

                  if (!activeEvent) return false;

                  const isAcknowledged =
                    game.calendar[activeEvent].acknowledgedAt;

                  return !isAcknowledged;
                },
                actions: assign((context: Context, event) =>
                  handleSuccessfulSave(context, event),
                ),
              },
              {
                target: "leagueResults",
                cond: shouldShowLeagueResults,
                actions: assign((context: Context, event) =>
                  handleSuccessfulSave(context, event),
                ),
              },
              {
                target: "visiting",
                cond: (context, _) => !!context.visitorId,
                actions: assign((context: Context, event) =>
                  handleSuccessfulSave(context, event),
                ),
              },
              {
                target: "playing",
                actions: assign((context: Context, event) =>
                  handleSuccessfulSave(context, event),
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
            src: async (context, event) => {
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

              const { gameState } = await TRANSACTION_SIGNATURES[transaction]({
                ...request,
                farmId: Number(context.farmId),
                token: authContext.user.rawToken as string,
                transactionId: context.transactionId as string,
              });

              return {
                // sessionId: sessionId,
                farm: gameState,
              };
            },
            onDone: {
              target: "playing",
              actions: [
                assign((_, event) => ({
                  state: event.data.farm,
                  actions: [],
                })),
              ],
            },
            onError: [
              {
                target: "playing",
                cond: (_, event: any) =>
                  event.data.message === ERRORS.REJECTED_TRANSACTION,
                actions: assign((_) => ({
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
            src: async (context, event) => {
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
            onDone: {
              target: "playing",
              actions: assign((context, event) => ({
                state: {
                  ...context.state,
                  inventory: {
                    ...context.state.inventory,
                    Gem: (context.state.inventory["Gem"] ?? new Decimal(0)).add(
                      event.data.amount,
                    ),
                  },
                },
                purchases: [
                  ...context.purchases,
                  {
                    id: `${event.data.amount} Gem`,
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
                cond: (_, event: any) =>
                  event.data.message === ERRORS.REJECTED_TRANSACTION,
                actions: assign((_) => ({
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
            src: async (context, e) => {
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
            onDone: [
              {
                target: "beanRevealed",
                cond: (_, event) => event.data.event.type === "bean.harvested",
                actions: assign((context, event) => {
                  return {
                    // Remove events
                    actions: [],
                    // Update immediately with state from server except for collectibles
                    state: {
                      ...event.data.farm,
                      collectibles: {
                        ...event.data.farm.collectibles,
                        "Magic Bean": context.state.collectibles["Magic Bean"],
                      },
                    },
                    revealed: event.data.changeset,
                  };
                }),
              },
              {
                target: "genieRevealed",
                cond: (_, event) =>
                  event.data.event.type === "genieLamp.rubbed",
                actions: assign((context, event) => {
                  const lamps = context.state.collectibles["Genie Lamp"]?.map(
                    (lamp) => {
                      if (lamp.id === event.data.event.id) {
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
                      ...event.data.farm,
                      collectibles: {
                        ...event.data.farm.collectibles,
                        "Genie Lamp": lamps,
                      },
                    },
                    revealed: event.data.changeset,
                  };
                }),
              },
              {
                target: "revealed",
                actions: assign((_, event) => ({
                  // Remove events
                  actions: [],
                  // Update immediately with state from server
                  state: event.data.farm,
                  revealed: event.data.changeset,
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
              actions: assign((_, event) => ({
                revealed: undefined,
              })),
            },
          },
        },

        genieRevealed: {
          on: {
            CONTINUE: {
              target: "playing",
              actions: assign((context, event) => {
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
              actions: assign((context, event) => {
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
            src: async (context, event) => {
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

              const { farm, prices, error } = await sellMarketResourceRequest({
                farmId: Number(context.farmId),
                token: authContext.user.rawToken as string,
                soldAt: new Date().toISOString(),
                item,
                pricePerUnit,
              });

              return {
                farm,
                error,
                prices,
              };
            },
            onDone: [
              {
                target: "priceChanged",
                cond: (_, event) => event.data.error === "PRICE_CHANGED",
              },
              {
                target: "playing",
                actions: [
                  (_context, event) => {
                    setCachedMarketPrices(event.data.prices);
                  },
                  assign((_, event) => ({
                    actions: [],
                    state: event.data.farm,
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
            src: async (context, event) => {
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
            onDone: {
              target: "playing",
              actions: send(() => ({
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
            src: async (context, event) => {
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
            onDone: {
              target: "playing",
              actions: send(() => ({
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
            src: async (context, event) => {
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
            src: async (context, e) => {
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
            onDone: [
              {
                target: "loading",
                actions: assign({
                  revealed: (_, event) => event.data.changeset,
                  actions: (_) => [],
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
            data: {
              placeable: (_: Context, event: LandscapeEvent) => event.placeable,
              action: (_: Context, event: LandscapeEvent) => event.action,
              requirements: (_: Context, event: LandscapeEvent) =>
                event.requirements,
              coordinates: { x: 0, y: 0 },
              collisionDetected: true,
              multiple: (_: Context, event: LandscapeEvent) => event.multiple,
              maximum: (_: Context, event: LandscapeEvent) => event.maximum,
              location: (_: Context, event: LandscapeEvent) => event.location,
            },
            onDone: {
              target: "autosaving",
            },
            onError: [
              {
                target: "playing",
                cond: (_, event: any) =>
                  event.data.message === ERRORS.REJECTED_TRANSACTION,
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
              actions: send(
                (context) =>
                  ({
                    type: "SAVE",
                    gameMachineContext: context,
                    rawToken: authContext.user.rawToken as string,
                    farmId: context.farmId,
                  }) as SaveEvent,
                { to: "landscaping" },
              ),
            },
            SAVE_SUCCESS: {
              actions: assign((context: Context, event: any) =>
                handleSuccessfulSave(context, event),
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
            src: async () => {
              const { game } = await generateTestLand();

              return { game };
            },
            onDone: {
              target: "playing",
              actions: assign<Context, any>({
                state: (context, event) => ({
                  ...context.state,
                  ...makeGame(event.data.game),
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
            paused: (_) => true,
          }),
        },
        PLAY: {
          actions: assign({
            paused: (_) => false,
          }),
        },
        COMMUNITY_UPDATE: {
          actions: assign({
            state: (_, event) => event.game,
          }),
        },
      },
    },
    {
      actions: {
        initialiseAnalytics: (context, event: any) => {
          if (!ART_MODE) {
            gameAnalytics.initialise({
              id: event.data.analyticsId,
              experiments: context.state?.experiments ?? [],
            });
            onboardingAnalytics.initialise({
              id: context.farmId,
            });
            onboardingAnalytics.logEvent("login");
          }
        },
        assignUrl: (context) => {
          if (window.location.hash.includes("retreat")) return;
          if (window.location.hash.includes("world")) return;

          // if (!ART_MODE) {
          //   window.history.replaceState(
          //     null,
          //     "",
          //     `${window.location.pathname}#/land/${context.farmId}`
          //   );
          // }
        },
        assignErrorMessage: assign<Context, any>({
          errorCode: (_context, event) => event.data.message,
          actions: [],
        }),
        assignGame: assign<Context, any>({
          farmId: (_, event) => event.data.farmId,
          state: (_, event) => event.data.state,
          sessionId: (_, event) => event.data.sessionId,
          fingerprint: (_, event) => event.data.fingerprint,
          deviceTrackerId: (_, event) => event.data.deviceTrackerId,
          announcements: (_, event) => event.data.announcements,
          moderation: (_, event) => event.data.moderation,
          farmAddress: (_, event) => event.data.farmAddress,
          linkedWallet: (_, event) => event.data.linkedWallet,
          wallet: (_, event) => event.data.wallet,
          nftId: (_, event) => event.data.nftId,
          verified: (_, event) => event.data.verified,
          purchases: (_, event) => event.data.purchases,
          discordId: (_, event) => event.data.discordId,
          fslId: (_, event) => event.data.fslId,
          oauthNonce: (_, event) => event.data.oauthNonce,
          prices: (_, event) => event.data.prices,
          apiKey: (_, event) => event.data.apiKey,
          method: (_, event) => event.data.method,
          accountTradedAt: (_, event) => event.data.accountTradedAt,
        }),
        setTransactionId: assign<Context, any>({
          transactionId: () => randomID(),
        }),
        clearTransactionId: assign<Context, any>({
          transactionId: () => undefined,
        }),
      },
    },
  );
}
