import { createMachine, assign, State, Interpreter } from "xstate";
import eventBus from "./eventBus";
import { MAZE_TIME_LIMIT_SECONDS } from "features/game/events/landExpansion/startMaze";
import { MazeAttempt } from "features/game/types/game";

// Define the events for the machine
type CornMazeEvent =
  | { type: "COLLECT_CROW" }
  | { type: "HIT" }
  | { type: "SHOW_TIPS" }
  | { type: "SCENE_LOADED" }
  | { type: "PORTAL_HIT" }
  | { type: "START_GAME" }
  | { type: "RESUME_GAME" }
  | { type: "END_GAME" }
  | { type: "TICK" };

// Define the context for the machine
interface CornMazeContext {
  score: number;
  health: number;
  totalLostCrows: number;
  gameOver: "wonGame" | "lostGame" | undefined;
  sceneLoaded: boolean;
  startedAt: number;
  timeElapsed: number;
  previousTimElapsed: number;
  pausedAt: number;
  activeAttempt?: MazeAttempt;
  hasSavedProgress: boolean;
  attemptCompletedAt?: number;
}

export type CornMazeState = {
  value:
    | "loading"
    | "noActiveAttempt"
    | "playing"
    | "showingTips"
    | "hasPreviousAttempt"
    | "paused"
    | "wonGame"
    | "lostGame";
  context: CornMazeContext;
};

export type MachineState = State<CornMazeContext, CornMazeEvent, CornMazeState>;

export type MachineInterpreter = Interpreter<
  CornMazeContext,
  any,
  CornMazeEvent,
  CornMazeState
>;

const HIT_PENALTY_SECONDS = 5;

// Define the state machine
export const cornMazeMachine = createMachine<
  CornMazeContext,
  CornMazeEvent,
  CornMazeState
>({
  id: "cornMazeMachine",
  initial: "loading",
  preserveActionOrder: true,
  states: {
    loading: {
      on: {
        SCENE_LOADED: [
          {
            target: "showingTips",
            actions: assign({
              sceneLoaded: (_) => true,
            }),
            cond: (context) => !!context.activeAttempt,
          },
          {
            target: "noActiveAttempt",
            actions: assign({
              sceneLoaded: (_) => true,
            }),
          },
        ],
      },
    },
    noActiveAttempt: {},
    playing: {
      invoke: {
        src: () => (cb) => {
          const interval = setInterval(() => {
            cb("TICK");
          }, 1000);

          return () => {
            clearInterval(interval);
          };
        },
      },
      always: [
        {
          target: "lostGame",
          cond: (context) =>
            context.health <= 0 ||
            context.timeElapsed >= MAZE_TIME_LIMIT_SECONDS,
          actions: [
            () => eventBus.emit("corn_maze:pauseScene"),
            assign({
              attemptCompletedAt: (_) => Date.now(),
            }),
          ],
        },
        {
          target: "wonGame",
          cond: (context) => context.score === context.totalLostCrows,
          actions: [
            () => eventBus.emit("corn_maze:pauseScene"),
            assign({
              attemptCompletedAt: (_) => Date.now(),
            }),
          ],
        },
      ],
      on: {
        TICK: {
          actions: assign<CornMazeContext, any>({
            timeElapsed: (context) => {
              const now = Date.now();

              const elapsed = Math.floor((+now - context.startedAt) / 1000);

              return Math.max(0, context.previousTimElapsed + elapsed);
            },
          }),
        },
        COLLECT_CROW: {
          cond: (context) => !context.gameOver,
          actions: assign({
            score: (context) => context.score + 1,
          }),
        },
        HIT: {
          cond: (context) => !context.gameOver,
          actions: assign({
            health: (context) => (context.health > 0 ? context.health - 1 : 0),
            startedAt: (context) =>
              context.startedAt - HIT_PENALTY_SECONDS * 1000,
          }),
        },
        PORTAL_HIT: {
          target: "paused",
          actions: assign({
            pausedAt: (_) => Date.now(),
          }),
        },
        SHOW_TIPS: {
          target: "showingTips",
          actions: [
            assign({
              pausedAt: (_) => Date.now(),
            }),
            () => {
              eventBus.emit("corn_maze:pauseScene");
            },
          ],
        },
      },
    },
    showingTips: {
      on: {
        START_GAME: {
          target: "playing",
          actions: [
            () => {
              eventBus.emit("corn_maze:startScene");
            },
            assign({
              startedAt: (_) => Date.now(),
            }),
          ],
        },
        RESUME_GAME: {
          target: "playing",
          actions: [
            () => {
              eventBus.emit("corn_maze:resumeScene");
            },
            assign({
              startedAt: (context) => {
                const timeDiff = Date.now() - context.pausedAt;

                return context.startedAt + timeDiff;
              },
              pausedAt: (_) => {
                return 0;
              },
            }),
          ],
        },
      },
    },
    paused: {
      on: {
        RESUME_GAME: {
          target: "playing",
          actions: [
            () => {
              eventBus.emit("corn_maze:resumeScene");
            },
            assign({
              startedAt: (context) => {
                const timeDiff = Date.now() - context.pausedAt;

                return context.startedAt + timeDiff;
              },
              pausedAt: (_) => 0,
            }),
          ],
        },
      },
    },
    wonGame: {},
    lostGame: {},
  },
});
