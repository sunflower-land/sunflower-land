import { OFFLINE_FARM } from "features/game/lib/landData";
import { assign, createMachine, Interpreter, State } from "xstate";
import { CONFIG } from "lib/config";
import { decodeToken } from "features/auth/actions/login";
import {
  UNLIMITED_ATTEMPTS_SFL,
  FREE_DAILY_ATTEMPTS,
  GAME_SECONDS,
  GAME_LIVES,
  PORTAL_NAME,
} from "../Constants";
import { GameState } from "features/game/types/game";
import { purchaseMinigameItem } from "features/game/events/minigames/purchaseMinigameItem";
import { startMinigameAttempt } from "features/game/events/minigames/startMinigameAttempt";
import { submitMinigameScore } from "features/game/events/minigames/submitMinigameScore";
import { submitScore, startAttempt } from "features/portal/lib/portalUtil";
import { getUrl, loadPortal } from "features/portal/actions/loadPortal";
import { getAttemptsLeft } from "./Utils";

const getJWT = () => {
  const code = new URLSearchParams(window.location.search).get("jwt");
  return code;
};

export interface Context {
  id: number;
  jwt: string | null;
  isJoystickActive: boolean;
  state: GameState | undefined;
  score: number;
  lastScore: number;
  endAt: number;
  attemptsLeft: number;
  lives: number;
  validations: Record<string, boolean>;
  isTraining: boolean;
  riceBunsCollected: number;
  hasError: boolean;
}

// type UnlockAchievementsEvent = {
//   type: "UNLOCKED_ACHIEVEMENTS";
//   achievementNames: AchievementsName[];
// };

type SetJoystickActiveEvent = {
  type: "SET_JOYSTICK_ACTIVE";
  isJoystickActive: boolean;
};

type PurchaseRestockEvent = {
  type: "PURCHASED_RESTOCK";
  sfl: number;
};

type GainPointsEvent = {
  type: "GAIN_POINTS";
  points: number;
};

type LoseLifeEvent = {
  type: "LOSE_LIFE";
};

type SetValidationsEvent = {
  type: "SET_VALIDATIONS";
  validation: string;
};

type SimulateErrorEvent = {
  type: "SIMULATE_ERROR";
  hasError: boolean;
};

export type PortalEvent =
  | SetJoystickActiveEvent
  | { type: "START" }
  | { type: "CLAIM" }
  | { type: "CANCEL_PURCHASE" }
  | PurchaseRestockEvent
  | { type: "PURCHASED_UNLIMITED" }
  | { type: "RETRY" }
  | { type: "CONTINUE" }
  | { type: "CONTINUE_TRAINING" }
  | { type: "END_GAME_EARLY" }
  | { type: "GAME_OVER" }
  | GainPointsEvent
  | LoseLifeEvent
  | SetValidationsEvent
  | { type: "COLLECT_RICE_BUN" }
  | SimulateErrorEvent;

export type PortalState = {
  value:
  | "initialising"
  | "error"
  | "ready"
  | "unauthorised"
  | "loading"
  | "introduction"
  | "playing"
  | "gameOver"
  | "winner"
  | "loser"
  | "complete"
  | "starting"
  | "noAttempts";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  PortalEvent,
  PortalState
>;

export type PortalMachineState = State<Context, PortalEvent, PortalState>;

const VALIDATIONS = {};

const resetGameTransition = {
  RETRY: {
    target: "starting",
    actions: assign({
      score: () => 0,
      lives: () => GAME_LIVES,
      riceBunsCollected: () => 0,
      hasError: () => false,
      endAt: () => 0,
      validations: () => structuredClone(VALIDATIONS),
    }) as any,
  },
};

export const portalMachine = createMachine<Context, PortalEvent, PortalState>({
  id: "portalMachine",
  initial: "initialising",
  context: {
    id: 0,
    jwt: getJWT(),

    isJoystickActive: false,

    state: CONFIG.API_URL ? undefined : OFFLINE_FARM,

    score: 0,
    lastScore: 0,
    lives: GAME_LIVES,
    attemptsLeft: 0,
    endAt: 0,
    isTraining: false,
    validations: structuredClone(VALIDATIONS),
    riceBunsCollected: 0,
    hasError: false,

    // Portal minigame
  },
  on: {
    SET_JOYSTICK_ACTIVE: {
      actions: assign({
        isJoystickActive: (_: Context, event: SetJoystickActiveEvent) => {
          return event.isJoystickActive;
        },
      }),
    },
    // UNLOCKED_ACHIEVEMENTS: {
    //   actions: assign({
    //     state: (context: Context, event: UnlockAchievementsEvent) => {
    //       achievementsUnlocked({ achievementNames: event.achievementNames });
    //       return unlockMinigameAchievements({
    //         state: context.state as GameState,
    //         action: {
    //           type: "minigame.achievementsUnlocked",
    //           id: PORTAL_NAME,
    //           achievementNames: event.achievementNames,
    //         },
    //       });
    //     },
    //   }),
    // },
  },
  states: {
    initialising: {
      always: [
        {
          target: "unauthorised",
          // TODO: Also validate token
          cond: (context) => !!CONFIG.API_URL && !context.jwt,
        },
        {
          target: "loading",
        },
      ],
    },
    loading: {
      id: "loading",
      invoke: {
        src: async (context) => {
          if (!getUrl()) {
            return { game: OFFLINE_FARM, attemptsLeft: FREE_DAILY_ATTEMPTS };
          }

          const { farmId } = decodeToken(context.jwt as string);

          // Load the game data
          const { game } = await loadPortal({
            portalId: CONFIG.PORTAL_APP,
            token: context.jwt as string,
          });

          const minigame = game.minigames.games[PORTAL_NAME];
          const attemptsLeft = getAttemptsLeft(minigame, farmId);

          return { game, farmId, attemptsLeft };
        },
        onDone: [
          {
            target: "introduction",
            actions: assign({
              state: (_: Context, event) => event.data.game,
              id: (_: Context, event) => event.data.farmId,
              attemptsLeft: (_: Context, event) => event.data.attemptsLeft,
            }),
          },
        ],
        onError: {
          target: "error",
        },
      },
    },

    noAttempts: {
      on: {
        CANCEL_PURCHASE: {
          target: "introduction",
        },
        PURCHASED_RESTOCK: {
          target: "introduction",
          actions: assign({
            state: (context: Context, event: PurchaseRestockEvent) =>
              purchaseMinigameItem({
                state: context.state as GameState,
                action: {
                  id: PORTAL_NAME,
                  sfl: event.sfl,
                  type: "minigame.itemPurchased",
                  items: {},
                },
              }),
          }),
        },
        PURCHASED_UNLIMITED: {
          target: "introduction",
          actions: assign({
            state: (context: Context) =>
              purchaseMinigameItem({
                state: context.state as GameState,
                action: {
                  id: PORTAL_NAME,
                  sfl: UNLIMITED_ATTEMPTS_SFL,
                  type: "minigame.itemPurchased",
                  items: {},
                },
              }),
          }),
        },
      },
    },

    starting: {
      always: [
        {
          target: "noAttempts",
          cond: (context) => {
            if (context.isTraining) return false;
            const farmId = !getUrl()
              ? 0
              : decodeToken(context.jwt as string).farmId;
            const minigame = context.state?.minigames.games[PORTAL_NAME];
            const attemptsLeft = getAttemptsLeft(minigame, farmId);
            return attemptsLeft <= 0;
          },
        },
        {
          target: "ready",
        },
      ],
    },

    introduction: {
      on: {
        CONTINUE: {
          target: "starting",
          actions: assign({
            isTraining: false,
            state: (context: Context) => context.state,
          }),
        },
        CONTINUE_TRAINING: {
          target: "starting",
          actions: assign({
            isTraining: true,
            state: (context: Context) => context.state,
          }),
        },
      },
    },

    ready: {
      on: {
        START: {
          target: "playing",
          actions: assign({
            endAt: () => Date.now() + GAME_SECONDS * 1000,
            score: 0,
            lives: GAME_LIVES,
            validations: structuredClone(VALIDATIONS),
            riceBunsCollected: 0,
            hasError: false,
            state: (context: Context) => {
              if (context.isTraining) return context.state;
              startAttempt();
              return startMinigameAttempt({
                state: context.state as GameState,
                action: {
                  type: "minigame.attemptStarted",
                  id: PORTAL_NAME,
                },
              });
            },
            attemptsLeft: (context: Context) => {
              if (context.isTraining) return context.attemptsLeft;
              return context.attemptsLeft - 1;
            },
          }),
        },
      },
    },

    playing: {
      on: {
        GAIN_POINTS: {
          actions: assign({
            score: (context: Context, event: GainPointsEvent) => {
              const { points = 1 } = event;
              return context.score + points;
            },
          }),
        },
        COLLECT_RICE_BUN: {
          actions: assign({
            riceBunsCollected: (context: Context) => {
              return context.riceBunsCollected + 1;
            },
          }),
        },
        LOSE_LIFE: {
          actions: assign({
            lives: (context: Context) => {
              return context.lives - 1;
            },
          }),
        },
        SIMULATE_ERROR: {
          actions: assign({
            hasError: (_: Context, event: SimulateErrorEvent) => {
              return event.hasError;
            },
          }),
        },
        SET_VALIDATIONS: {
          actions: assign({
            validations: (context: Context, event: SetValidationsEvent) => {
              return {
                ...context.validations,
                [event.validation]: true,
              };
            },
          }),
        },
        END_GAME_EARLY: {
          actions: assign({
            endAt: () => Date.now(),
            lastScore: (context: Context) => {
              if (context.isTraining) return context.lastScore;
              return context.score;
            },
            state: (context: Context) => {
              if (context.isTraining) return context.state;
              submitScore({ score: context.score });
              return submitMinigameScore({
                state: context.state as GameState,
                action: {
                  type: "minigame.scoreSubmitted",
                  score: Math.round(context.score),
                  id: PORTAL_NAME,
                },
              });
            },
          }),
          target: "introduction",
        },
        GAME_OVER: {
          target: "gameOver",
          actions: assign({
            lastScore: (context: Context) => {
              if (context.isTraining) return context.lastScore;
              return context.score;
            },
            state: (context: Context) => {
              if (context.isTraining) return context.state;
              submitScore({ score: context.score });
              return submitMinigameScore({
                state: context.state as GameState,
                action: {
                  type: "minigame.scoreSubmitted",
                  score: Math.round(context.score),
                  id: PORTAL_NAME,
                },
              });
            },
          }),
        }
      },
    },

    gameOver: {
      always: [
        {
          target: "introduction",
          cond: (context) => {
            return context.isTraining;
          },
        },
        {
          // they have already completed the mission before
          target: "complete",
          cond: () => {
            // const dateKey = new Date().toISOString().slice(0, 10);

            // const minigame = context.state?.minigames.games[PORTAL_NAME];
            // const history = minigame?.history ?? {};

            // return !!history[dateKey]?.prizeClaimedAt;
            return false;
          },
        },
        {
          target: "winner",
          cond: (context) => {
            const prize = context.state?.minigames.prizes[PORTAL_NAME];
            if (!prize) {
              return false;
            }

            return context.score >= prize.score;
          },
        },
        {
          target: "loser",
        },
      ],
    },

    winner: {
      on: resetGameTransition,
    },

    loser: {
      on: resetGameTransition,
    },

    complete: {
      on: resetGameTransition,
    },

    error: {
      on: {
        RETRY: {
          target: "initialising",
        },
      },
    },

    unauthorised: {},
  },
});
