import {
  createMachine,
  Interpreter,
  assign,
  TransitionsConfig,
  State,
  send,
} from "xstate";
import {
  PLAYING_EVENTS,
  PlacementEvent,
  PLACEMENT_EVENTS,
  GameEvent,
  PlayingEvent,
  GameEventName,
} from "../events";

import { Context as AuthContext } from "features/auth/lib/authMachine";
import { wallet } from "../../../lib/blockchain/wallet";

import { GameState, InventoryItemName, PlacedItem } from "../types/game";
import { loadSession, MintedAt } from "../actions/loadSession";
import { EMPTY } from "./constants";
import { autosave } from "../actions/autosave";
import { CollectibleName } from "../types/craftables";
import { sync } from "../actions/sync";
import { getGameOnChainState } from "../actions/onchain";
import { ErrorCode, ERRORS } from "lib/errors";
import { makeGame } from "./transforms";
import { reset } from "features/farming/hud/actions/reset";
// import { getGameRulesLastRead } from "features/announcements/announcementsStorage";
import { OnChainEvent, unseenEvents } from "../actions/onChainEvents";
import { expand } from "../expansion/actions/expand";
import { checkProgress, processEvent } from "./processEvent";
import { editingMachine } from "../expansion/placeable/editingMachine";
import { BuildingName } from "../types/buildings";
import { Context } from "../GameProvider";
import { isSwarming } from "../events/detectBot";
import { generateTestLand } from "../expansion/actions/generateLand";

import { loadGameStateForVisit } from "../actions/loadGameStateForVisit";
import { OFFLINE_FARM } from "./landData";
import { randomID } from "lib/utils/random";
import { CONFIG } from "lib/config";

import { getSessionId } from "lib/blockchain/Sessions";
import { loadBumpkins } from "lib/blockchain/BumpkinDetails";

const API_URL = CONFIG.API_URL;
import { buySFL } from "../actions/buySFL";
import { GoblinBlacksmithItemName } from "../types/collectibles";
import { getGameRulesLastRead } from "features/announcements/announcementsStorage";
import { depositToFarm } from "lib/blockchain/Deposit";

export type PastAction = GameEvent & {
  createdAt: Date;
};

export interface Context {
  state: GameState;
  onChain: GameState;
  actions: PastAction[];
  sessionId?: string;
  errorCode?: ErrorCode;
  transactionId?: string;
  fingerprint?: string;
  itemsMintedAt?: MintedAt;
  notifications?: OnChainEvent[];
  maxedItem?: InventoryItemName | "SFL";
  goblinSwarm?: Date;
  deviceTrackerId?: string;
  status?: "COOL_DOWN";
  revealed?: {
    balance: string;
    inventory: Record<InventoryItemName, string>;
  };
}

type MintEvent = {
  type: "MINT";
  item: GoblinBlacksmithItemName;
  captcha: string;
};

type WithdrawEvent = {
  type: "WITHDRAW";
  sfl: number;
  ids: number[];
  amounts: string[];
  captcha: string;
};

type SyncEvent = {
  captcha: string;
  type: "SYNC";
  blockBucks: number;
};

type EditEvent = {
  placeable?: BuildingName | CollectibleName;
  action?: GameEventName<PlacementEvent>;
  type: "EDIT";
};

export type SelectPlaceableEvent = {
  type: "SELECT_PLACEABLE";
  placeable: BuildingName | CollectibleName;
  placeableType: "BUILDING" | "COLLECTIBLE";
  id: string;
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
  sfl: string;
  itemIds: number[];
  itemAmounts: string[];
};

export type BlockchainEvent =
  | {
      type: "SAVE";
    }
  | SyncEvent
  | {
      type: "REFRESH";
    }
  | {
      type: "ACKNOWLEDGE";
    }
  | {
      type: "EXPIRED";
    }
  | {
      type: "CONTINUE";
    }
  | {
      type: "RESET";
    }
  | {
      type: "DEPOSIT";
    }
  | {
      type: "REVEAL";
    }
  | {
      type: "SKIP_MIGRATION";
    }
  | { type: "END_VISIT" }
  | WithdrawEvent
  | GameEvent
  | MintEvent
  | EditEvent
  | VisitEvent
  | BuySFLEvent
  | DepositEvent
  | SelectPlaceableEvent
  | { type: "EXPAND" }
  | { type: "RANDOMISE" }; // Test only

// // For each game event, convert it to an XState event + handler
const GAME_EVENT_HANDLERS: TransitionsConfig<Context, BlockchainEvent> =
  Object.keys(PLAYING_EVENTS).reduce(
    (events, eventName) => ({
      ...events,
      [eventName]: [
        {
          target: "hoarding",
          cond: (context: Context, event: PlayingEvent) => {
            const { valid } = checkProgress({
              state: context.state as GameState,
              action: event,
              onChain: context.onChain as GameState,
            });

            return !valid;
          },
          actions: assign((context: Context, event: PlayingEvent) => {
            const { maxedItem } = checkProgress({
              state: context.state as GameState,
              action: event,
              onChain: context.onChain as GameState,
            });

            return { maxedItem };
          }),
        },
        {
          actions: assign((context: Context, event: PlayingEvent) => ({
            state: processEvent({
              state: context.state as GameState,
              action: event,
            }) as GameState,
            actions: [
              ...context.actions,
              {
                ...event,
                createdAt: new Date(),
              },
            ],
          })),
        },
      ],
    }),
    {}
  );

const PLACEMENT_EVENT_HANDLERS: TransitionsConfig<Context, BlockchainEvent> =
  Object.keys(PLACEMENT_EVENTS).reduce(
    (events, eventName) => ({
      ...events,
      [eventName]: {
        actions: assign((context: Context, event: PlacementEvent) => ({
          state: processEvent({
            state: context.state as GameState,
            action: event,
          }) as GameState,
          actions: [
            ...context.actions,
            {
              ...event,
              createdAt: new Date(),
            },
          ],
        })),
      },
    }),
    {}
  );

export type BlockchainState = {
  value:
    | "checkIsVisiting"
    | "loadLandToVisit"
    | "landToVisitNotFound"
    | "loading"
    | "deposited"
    | "visiting"
    // | "gameRules"
    | "gameRules"
    | "playing"
    | "autosaving"
    | "syncing"
    | "synced"
    | "buyingSFL"
    | "expanding"
    | "expanded"
    | "revealing"
    | "revealed"
    | "error"
    | "refreshing"
    | "swarming"
    | "hoarding"
    | "depositing"
    | "editing"
    | "noBumpkinFound"
    | "coolingDown"
    | "randomising"; // TEST ONLY
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

type Options = AuthContext & { isNoob: boolean };

// Hashed eth 0 value
export const INITIAL_SESSION =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export function startGame(authContext: Options) {
  return createMachine<Context, BlockchainEvent, BlockchainState>(
    {
      id: "gameMachine",
      initial: "checkIsVisiting",
      context: {
        actions: [],
        state: EMPTY,
        onChain: EMPTY,
        sessionId: INITIAL_SESSION,
      },
      states: {
        checkIsVisiting: {
          always: [
            {
              target: "loadLandToVisit",
              cond: () => window.location.href.includes("visit"),
            },
            { target: "loading" },
          ],
        },
        loading: {
          entry: "setTransactionId",
          invoke: {
            src: async (context) => {
              const farmAddress = authContext.address as string;
              const farmId = authContext.farmId as number;

              const { game: onChain, bumpkin } = await getGameOnChainState({
                farmAddress,
                id: farmId,
              });

              const onChainEvents = await unseenEvents({
                farmAddress,
                farmId,
              });

              // Get sessionId
              const sessionId =
                farmId &&
                (await getSessionId(
                  wallet.web3Provider,
                  wallet.myAccount,
                  farmId
                ));

              // Load the farm session
              if (sessionId) {
                const fingerprint = "X";

                const response = await loadSession({
                  farmId,
                  bumpkinTokenUri: bumpkin?.tokenURI,
                  sessionId,
                  token: authContext.rawToken as string,
                  wallet: authContext.wallet as string,
                  transactionId: context.transactionId as string,
                });

                if (!response) {
                  throw new Error("NO_FARM");
                }

                const {
                  game,
                  whitelistedAt,
                  itemsMintedAt,
                  deviceTrackerId,
                  status,
                } = response;

                return {
                  state: {
                    ...game,
                    farmAddress,
                    id: farmId,
                  },
                  sessionId,
                  whitelistedAt,
                  fingerprint,
                  itemsMintedAt,
                  onChain,
                  notifications: onChainEvents,
                  deviceTrackerId,
                  status,
                };
              }

              return { state: OFFLINE_FARM, onChain };
            },
            onDone: {
              target: "notifying",
              actions: "assignGame",
            },
            onError: [
              {
                target: "loading",
                cond: () => !wallet.isAlchemy,
                actions: () => {
                  wallet.overrideProvider();
                },
              },
              {
                target: "error",
                actions: "assignErrorMessage",
              },
            ],
          },
        },
        loadLandToVisit: {
          invoke: {
            src: async (_, event) => {
              let landId: number;

              // We can enter this state two ways
              // 1. Directly on load if the url has a visit path (/visit)
              // 2. From a VISIT event passed back to the machine which will include a farmId in the payload

              if (!(event as VisitEvent).landId) {
                landId = Number(window.location.href.split("/").pop());
              } else {
                landId = (event as VisitEvent).landId;
              }

              const { state } = await loadGameStateForVisit(Number(landId));

              return {
                state: {
                  ...makeGame(state),
                  id: landId,
                },
              };
            },
            onDone: {
              target: "visiting",
              actions: assign({
                state: (_context, event) => event.data.state,
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
            VISIT: {
              target: "loadLandToVisit",
            },
            END_VISIT: {
              target: "loading",
            },
          },
        },
        notifying: {
          always: [
            {
              target: "coolingDown",
              cond: (context: Context) => context.status === "COOL_DOWN",
            },
            {
              target: "deposited",
              cond: (context: Context) =>
                !!context.notifications && context.notifications?.length > 0,
            },
            {
              target: "gameRules",
              cond: () => {
                const lastRead = getGameRulesLastRead();
                return (
                  !lastRead ||
                  Date.now() - lastRead.getTime() > 7 * 24 * 60 * 60 * 1000
                );
              },
            },
            {
              target: "swarming",
              cond: () => isSwarming(),
            },
            {
              target: "noBumpkinFound",
              cond: (context: Context, event: any) =>
                !event.data?.state.bumpkin &&
                !context.state.bumpkin &&
                window.location.hash.includes("/land"),
            },

            {
              target: "playing",
            },
          ],
        },
        noBumpkinFound: {},
        deposited: {
          on: {
            ACKNOWLEDGE: {
              target: "refreshing",
            },
          },
        },
        gameRules: {
          on: {
            ACKNOWLEDGE: {
              target: "notifying",
            },
          },
        },

        playing: {
          entry: "clearTransactionId",
          invoke: {
            /**
             * An in game loop that checks if Blockchain becomes out of sync
             * It is a rare event but it saves a user from making too much progress that would not be synced
             */
            src: (context) => (cb) => {
              const interval = setInterval(async () => {
                const sessionID = await getSessionId(
                  wallet.web3Provider,
                  wallet.myAccount,
                  authContext?.farmId as number
                );

                if (sessionID !== context.sessionId) {
                  cb("EXPIRED");
                }

                const bumpkins =
                  (await loadBumpkins(wallet.web3Provider, wallet.myAccount)) ??
                  [];
                const tokenURI = bumpkins[0]?.tokenURI;

                if (tokenURI !== context.state.bumpkin?.tokenUri) {
                  cb("EXPIRED");
                }
              }, 1000 * 60 * 2);

              return () => {
                clearInterval(interval);
              };
            },
            onError: [
              {
                target: "playing",
                cond: () => !wallet.isAlchemy,
                actions: () => {
                  wallet.overrideProvider();
                },
              },
              {
                target: "error",
                actions: "assignErrorMessage",
              },
            ],
          },
          on: {
            ...GAME_EVENT_HANDLERS,
            SAVE: {
              target: "autosaving",
            },
            SYNC: {
              target: "syncing",
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
            REFRESH: {
              target: "loading",
            },
            EXPAND: {
              target: "expanding",
            },
            EDIT: {
              target: "editing",
            },
            RANDOMISE: {
              target: "randomising",
            },
            BUY_SFL: {
              target: "buyingSFL",
            },
          },
        },
        buyingSFL: {
          entry: "setTransactionId",
          invoke: {
            src: async (context, event) => {
              await buySFL({
                farmId: Number(authContext.farmId),
                token: authContext.rawToken as string,
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
          on: {
            ...GAME_EVENT_HANDLERS,
          },
          invoke: {
            src: async (context, event) => {
              const saveAt = (event as any)?.data?.saveAt || new Date();

              // Skip autosave when no actions were produced and if there is no API_URL
              if (context.actions.length === 0 || !API_URL) {
                return { verified: true, saveAt, farm: context.state };
              }

              const { verified, farm } = await autosave({
                farmId: Number(authContext.farmId),
                sessionId: context.sessionId as string,
                actions: context.actions,
                token: authContext.rawToken as string,
                fingerprint: context.fingerprint as string,
                deviceTrackerId: context.deviceTrackerId as string,
                transactionId: context.transactionId as string,
              });

              // This gives the UI time to indicate that a save is taking place both when clicking save
              // and when autosaving
              await new Promise((res) => setTimeout(res, 1000));

              return {
                saveAt,
                verified,
                farm,
              };
            },
            onDone: [
              {
                target: "playing",
                actions: assign((context: Context, event) => {
                  // Actions that occured since the server request
                  const recentActions = context.actions.filter(
                    (action) =>
                      action.createdAt.getTime() > event.data.saveAt.getTime()
                  );

                  const updatedState = recentActions.reduce((state, action) => {
                    return processEvent({ state, action });
                  }, event.data.farm);

                  return {
                    actions: recentActions,
                    state: updatedState,
                  };
                }),
              },
            ],
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        syncing: {
          entry: "setTransactionId",
          invoke: {
            src: async (context, event) => {
              // Autosave just in case
              if (context.actions.length > 0) {
                await autosave({
                  farmId: Number(authContext.farmId),
                  sessionId: context.sessionId as string,
                  actions: context.actions,
                  token: authContext.rawToken as string,
                  fingerprint: context.fingerprint as string,
                  deviceTrackerId: context.deviceTrackerId as string,
                  transactionId: context.transactionId as string,
                });
              }

              const { sessionId } = await sync({
                farmId: Number(authContext.farmId),
                sessionId: context.sessionId as string,
                token: authContext.rawToken as string,
                captcha: (event as SyncEvent).captcha,
                transactionId: context.transactionId as string,
                blockBucks: (event as SyncEvent).blockBucks,
              });

              return {
                sessionId: sessionId,
              };
            },
            onDone: {
              target: "synced",
              actions: assign((_, event) => ({
                sessionId: event.data.sessionId,
                actions: [],
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
                target: "error",
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
                  farmId: Number(authContext.farmId),
                  sessionId: context.sessionId as string,
                  actions: context.actions,
                  token: authContext.rawToken as string,
                  fingerprint: context.fingerprint as string,
                  deviceTrackerId: context.deviceTrackerId as string,
                  transactionId: context.transactionId as string,
                });
              }

              const { farm, changeset } = await autosave({
                farmId: Number(authContext.farmId),
                sessionId: context.sessionId as string,
                actions: [event],
                token: authContext.rawToken as string,
                fingerprint: context.fingerprint as string,
                deviceTrackerId: context.deviceTrackerId as string,
                transactionId: context.transactionId as string,
              });

              return {
                farm,
                changeset,
              };
            },
            onDone: [
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
            },
          },
        },
        depositing: {
          invoke: {
            src: async (context, event) => {
              await depositToFarm({
                web3: wallet.web3Provider,
                account: wallet.myAccount,
                farmId: context.state.id as number,
                sfl: (event as DepositEvent).sfl,
                itemIds: (event as DepositEvent).itemIds,
                itemAmounts: (event as DepositEvent).itemAmounts,
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
              const { success } = await reset({
                farmId: Number(authContext.farmId),
                token: authContext.rawToken as string,
                fingerprint: context.fingerprint as string,
                transactionId: context.transactionId as string,
              });

              return {
                success,
              };
            },
            onDone: [
              {
                target: "loading",
              },
            ],
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        error: {
          on: {
            CONTINUE: "playing",
            REFRESH: {
              target: "loading",
            },
          },
        },
        synced: {
          on: {
            REFRESH: {
              target: "loading",
            },
          },
        },
        //  withdrawn
        expanding: {
          entry: "setTransactionId",
          invoke: {
            src: async (context) => {
              // Autosave just in case
              if (context.actions.length > 0) {
                await autosave({
                  farmId: Number(authContext.farmId),
                  sessionId: context.sessionId as string,
                  actions: context.actions,
                  token: authContext.rawToken as string,
                  fingerprint: context.fingerprint as string,
                  deviceTrackerId: context.deviceTrackerId as string,
                  transactionId: context.transactionId as string,
                });
              }

              const sessionId = await expand({
                farmId: Number(authContext.farmId),
                token: authContext.rawToken as string,
                transactionId: context.transactionId as string,
              });

              return {
                sessionId: sessionId,
              };
            },
            onDone: {
              target: "expanded",
              actions: assign((_, event) => ({
                sessionId: event.data.sessionId,
                actions: [],
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
                // Kick them back to loading game again
                target: "loading",
                cond: () => !wallet.isAlchemy,
                actions: () => {
                  wallet.overrideProvider();
                },
              },
              {
                target: "error",
                actions: "assignErrorMessage",
              },
            ],
          },
        },
        expanded: {
          on: {
            REFRESH: {
              target: "loading",
            },
          },
        },
        hoarding: {
          on: {
            SYNC: {
              target: "syncing",
            },
            ACKNOWLEDGE: {
              target: "playing",
            },
          },
        },
        swarming: {
          on: {
            REFRESH: {
              target: "loading",
            },
          },
        },
        editing: {
          invoke: {
            id: "editing",
            autoForward: true,
            src: editingMachine,
            data: {
              placeable: (_: Context, event: EditEvent) => event.placeable,
              action: (_: Context, event: EditEvent) => event.action,
              coordinates: { x: 0, y: 0 },
              collisionDetected: true,
            },
            onDone: {
              target: "playing",
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
            SELECT_PLACEABLE: {
              actions: [
                assign({
                  state: (context, event) => {
                    const { placeable, id, placeableType } =
                      event as SelectPlaceableEvent;

                    if (placeableType === "BUILDING") {
                      const buildingId = context.state.buildings[
                        placeable as BuildingName
                      ]?.findIndex((building) => building.id === id);

                      if (buildingId === undefined) return context.state;

                      const buildingsOfType = context.state.buildings[
                        placeable as BuildingName
                      ] as PlacedItem[];

                      buildingsOfType[buildingId].selected = true;

                      return {
                        ...context.state,
                        buildings: {
                          ...context.state.buildings,
                          [placeable]: buildingsOfType,
                        },
                      };
                    }

                    if (placeableType === "COLLECTIBLE") {
                      const itemId = context.state.collectibles[
                        placeable as CollectibleName
                      ]?.findIndex((item) => item.id === id);

                      if (itemId === undefined) return context.state;

                      const itemsOfType = context.state.collectibles[
                        placeable as CollectibleName
                      ] as PlacedItem[];

                      itemsOfType[itemId].selected = true;

                      return {
                        ...context.state,
                        items: {
                          ...context.state.collectibles,
                          [placeable]: itemsOfType,
                        },
                      };
                    }

                    return context.state;
                  },
                }),
                send(
                  (context, event) => {
                    const { placeable, id, placeableType } =
                      event as SelectPlaceableEvent;

                    if (placeableType === "BUILDING") {
                      const building = context.state.buildings[
                        placeable as BuildingName
                      ]?.find((building) => building.id === id);

                      const { coordinates } = building as PlacedItem;
                      return {
                        type: "READY_TO_MOVE",
                        placeable,
                        id,
                        coordinates,
                      };
                    }

                    const collectible = context.state.collectibles[
                      placeable as CollectibleName
                    ]?.find((collectible) => collectible.id === id);

                    const { coordinates } = collectible as PlacedItem;

                    return {
                      type: "READY_TO_MOVE",
                      placeable,
                      id,
                      coordinates,
                    };
                  },
                  {
                    to: "editing",
                  }
                ),
              ],
            },
          },
        },
        coolingDown: {},
        randomising: {
          invoke: {
            src: async () => {
              const { expansions } = await generateTestLand();

              return { expansions };
            },
            onDone: {
              target: "playing",
              actions: assign<Context, any>({
                state: (context, event) => ({
                  ...context.state,
                  expansions: event.data.expansions,
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
    },
    {
      actions: {
        assignErrorMessage: assign<Context, any>({
          errorCode: (_context, event) => event.data.message,
          actions: [],
        }),
        assignGame: assign<Context, any>({
          state: (_, event) => event.data.state,
          onChain: (_, event) => event.data.onChain,
          sessionId: (_, event) => event.data.sessionId,
          fingerprint: (_, event) => event.data.fingerprint,
          itemsMintedAt: (_, event) => event.data.itemsMintedAt,
          notifications: (_, event) => event.data.notifications,
          deviceTrackerId: (_, event) => event.data.deviceTrackerId,
          status: (_, event) => event.data.status,
        }),
        setTransactionId: assign<Context, any>({
          transactionId: () => randomID(),
        }),
        clearTransactionId: assign<Context, any>({
          transactionId: () => undefined,
        }),
      },
    }
  );
}
