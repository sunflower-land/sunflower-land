import { createMachine, assign, State, Interpreter } from "xstate";
import eventBus from "./eventBus";

// Define the events for the machine
type CornMazeEvent =
  | { type: "COLLECT_CROW" }
  | { type: "HIT" }
  | { type: "SHOW_TIPS" }
  | { type: "SCENE_LOADED" }
  | { type: "PORTAL_HIT" }
  | { type: "START_GAME" }
  | { type: "RESUME_GAME" }
  | { type: "PAUSE_GAME" }
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
  pausedAt: number;
  gameService?: MachineInterpreter;
}

export type CornMazeState = {
  value:
    | "loading"
    | "playing"
    | "showingTips"
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

export const TIME_LIMIT_SECONDS = 60 * 3;

// Define the state machine
export const cornMazeMachine = createMachine<
  CornMazeContext,
  CornMazeEvent,
  CornMazeState
>({
  id: "cornMazeMachine",
  initial: "loading",
  states: {
    loading: {
      on: {
        SCENE_LOADED: {
          target: "showingTips",
          actions: assign({
            sceneLoaded: (_) => true,
          }),
        },
      },
    },
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
            context.health <= 0 || context.timeElapsed >= TIME_LIMIT_SECONDS,
          actions: () => eventBus.emit("corn_maze:pauseScene"),
        },
        {
          target: "wonGame",
          cond: (context) => context.score === context.totalLostCrows,
          actions: () => eventBus.emit("corn_maze:pauseScene"),
        },
      ],
      on: {
        TICK: {
          actions: assign<CornMazeContext, any>({
            timeElapsed: (context) => {
              const now = Date.now();

              return Math.floor((+now - context.startedAt) / 1000);
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
          }),
        },
        PORTAL_HIT: {
          target: "paused",
          actions: assign({
            pausedAt: (_) => Date.now(),
          }),
        },
        PAUSE_GAME: {
          target: "paused",
          actions: [
            assign({
              pausedAt: (_) => Date.now(),
            }),
            () => {
              eventBus.emit("corn_maze:pauseScene");
            },
          ],
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
          actions: assign({
            startedAt: (_) => Date.now(),
          }),
        },
        RESUME_GAME: {
          target: "playing",
          actions: [
            assign({
              startedAt: (context) => {
                const timeDiff = Date.now() - context.pausedAt;

                return context.startedAt + timeDiff;
              },
              pausedAt: (_) => 0,
            }),
            () => {
              eventBus.emit("corn_maze:resumeScene");
            },
          ],
        },
      },
    },
    paused: {
      on: {
        RESUME_GAME: {
          target: "playing",
          actions: [
            assign({
              startedAt: (context) => {
                const timeDiff = Date.now() - context.pausedAt;

                return context.startedAt + timeDiff;
              },
            }),
            () => {
              eventBus.emit("corn_maze:resumeScene");
            },
          ],
        },
      },
    },
    wonGame: {},
    lostGame: {},
  },
});
