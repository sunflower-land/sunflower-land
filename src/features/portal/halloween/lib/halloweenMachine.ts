import { OFFLINE_FARM } from "features/game/lib/landData";
import { assign, createMachine, Interpreter, State } from "xstate";
import { CONFIG } from "lib/config";
import { decodeToken } from "features/auth/actions/login";
import {
  RESTOCK_ATTEMPTS_SFL,
  UNLIMITED_ATTEMPTS_SFL,
  DAILY_ATTEMPTS,
} from "../HalloweenConstants";
import { GameState } from "features/game/types/game";
import { purchaseMinigameItem } from "features/game/events/minigames/purchaseMinigameItem";
import { startMinigameAttempt } from "features/game/events/minigames/startMinigameAttempt";
import { submitMinigameScore } from "features/game/events/minigames/submitMinigameScore";
import {
  achievementsUnlocked,
  submitScore,
  startAttempt,
} from "features/portal/lib/portalUtil";
import { getUrl, loadPortal } from "features/portal/actions/loadPortal";
import { getAttemptsLeft } from "./HalloweenUtils";
import { unlockMinigameAchievements } from "features/game/events/minigames/unlockMinigameAchievements";
import { HalloweenAchievementsName } from "../HalloweenAchievements";

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
  lamps: number;
  startedAt: number;
  attemptsLeft: number;
}

type GainPointsEvent = {
  type: "GAIN_POINTS";
  points: number;
};

type UnlockAchievementsEvent = {
  type: "UNLOCKED_ACHIEVEMENTS";
  achievementNames: HalloweenAchievementsName[];
};

type SetJoystickActiveEvent = {
  type: "SET_JOYSTICK_ACTIVE";
  isJoystickActive: boolean;
};

type DeadLampEvent = {
  type: "DEAD_LAMP";
  lamps: number;
};

export type PortalEvent =
  | SetJoystickActiveEvent
  | { type: "START" }
  | { type: "CLAIM" }
  | { type: "CANCEL_PURCHASE" }
  | { type: "PURCHASED_RESTOCK" }
  | { type: "PURCHASED_UNLIMITED" }
  | { type: "RETRY" }
  | { type: "CONTINUE" }
  | { type: "END_GAME_EARLY" }
  | { type: "GAME_OVER" }
  | GainPointsEvent
  | { type: "COLLECT_LAMP" }
  | DeadLampEvent
  | UnlockAchievementsEvent;

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

const resetGameTransition = {
  RETRY: {
    target: "starting",
    actions: assign({
      score: () => 0,
      lamps: () => 0,
      startedAt: () => 0,
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
    lamps: 0,
    attemptsLeft: 0,
    startedAt: 0,
  },
  on: {
    SET_JOYSTICK_ACTIVE: {
      actions: assign<Context, any>({
        isJoystickActive: (_: Context, event: SetJoystickActiveEvent) => {
          return event.isJoystickActive;
        },
      }),
    },
    UNLOCKED_ACHIEVEMENTS: {
      actions: assign<Context, any>({
        state: (context: Context, event: UnlockAchievementsEvent) => {
          achievementsUnlocked({ achievementNames: event.achievementNames });
          return unlockMinigameAchievements({
            state: context.state!,
            action: {
              type: "minigame.achievementsUnlocked",
              id: "halloween",
              achievementNames: event.achievementNames,
            },
          });
        },
      }) as any,
    },
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
            return { game: OFFLINE_FARM, attemptsLeft: DAILY_ATTEMPTS };
          }

          const { farmId } = decodeToken(context.jwt as string);

          // Load the game data
          const { game } = await loadPortal({
            portalId: CONFIG.PORTAL_APP,
            token: context.jwt as string,
          });

          const minigame = game.minigames.games["halloween"];
          const attemptsLeft = getAttemptsLeft(minigame);

          return { game, farmId, attemptsLeft };
        },
        onDone: [
          {
            target: "introduction",
            actions: assign({
              state: (_: any, event) => event.data.game,
              id: (_: any, event) => event.data.farmId,
              attemptsLeft: (_: any, event) => event.data.attemptsLeft,
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
          actions: assign<Context>({
            state: (context: Context) =>
              purchaseMinigameItem({
                state: context.state!,
                action: {
                  id: "halloween",
                  sfl: RESTOCK_ATTEMPTS_SFL,
                  type: "minigame.itemPurchased",
                  items: {},
                },
              }),
          }) as any,
        },
        PURCHASED_UNLIMITED: {
          target: "introduction",
          actions: assign<Context>({
            state: (context: Context) =>
              purchaseMinigameItem({
                state: context.state!,
                action: {
                  id: "halloween",
                  sfl: UNLIMITED_ATTEMPTS_SFL,
                  type: "minigame.itemPurchased",
                  items: {},
                },
              }),
          }) as any,
        },
      },
    },

    starting: {
      always: [
        {
          target: "noAttempts",
          cond: (context) => {
            const minigame = context.state?.minigames.games["halloween"];
            const attemptsLeft = getAttemptsLeft(minigame);
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
        },
      },
    },

    ready: {
      on: {
        START: {
          target: "playing",
          actions: assign<Context>({
            startedAt: () => Date.now(),
            score: 0,
            lamps: 3,
            state: (context: any) => {
              startAttempt();
              return startMinigameAttempt({
                state: context.state,
                action: {
                  type: "minigame.attemptStarted",
                  id: "halloween",
                },
              });
            },
            attemptsLeft: (context: Context) => context.attemptsLeft - 1,
          }) as any,
        },
      },
    },

    playing: {
      on: {
        GAIN_POINTS: {
          actions: assign<Context, any>({
            score: (context: Context) => {
              const secondsPassed = !context.startedAt
                ? 0
                : Math.max(Date.now() - context.startedAt, 0);
              return secondsPassed;
            },
          }),
        },
        COLLECT_LAMP: {
          actions: assign<Context, any>({
            lamps: (context: Context) => {
              return context.lamps + 1;
            },
          }),
        },
        DEAD_LAMP: {
          actions: assign<Context, any>({
            lamps: (context: Context, event: DeadLampEvent) => {
              return context.lamps - event.lamps;
            },
          }),
        },
        END_GAME_EARLY: {
          actions: assign<Context, any>({
            startedAt: () => 0,
            lastScore: (context: Context) => {
              return context.score;
            },
            state: (context: Context) => {
              submitScore({ score: Math.round(context.score) });
              return submitMinigameScore({
                state: context.state as any,
                action: {
                  type: "minigame.scoreSubmitted",
                  score: Math.round(context.score),
                  id: "halloween",
                },
              });
            },
          }),
          target: "introduction",
        },
        GAME_OVER: {
          target: "gameOver",
          actions: assign({
            lastScore: (context: any) => {
              return context.score;
            },
            state: (context: any) => {
              submitScore({ score: context.score });
              return submitMinigameScore({
                state: context.state,
                action: {
                  type: "minigame.scoreSubmitted",
                  score: Math.round(context.score),
                  id: "halloween",
                },
              });
            },
          }) as any,
        },
      },
    },

    gameOver: {
      always: [
        {
          // they have already completed the mission before
          target: "complete",
          cond: (context) => {
            const dateKey = new Date().toISOString().slice(0, 10);

            const minigame = context.state?.minigames.games["halloween"];
            const history = minigame?.history ?? {};

            return !!history[dateKey]?.prizeClaimedAt;
          },
        },

        {
          target: "winner",
          cond: (context) => {
            const prize = context.state?.minigames.prizes["halloween"];
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
