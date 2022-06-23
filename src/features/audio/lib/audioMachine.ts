import { createMachine, Interpreter } from "xstate";
import { CAVE_SONGS, FARMING_SONGS, GOBLIN_SONGS, Song } from "./songs";

interface Context {
  songVolume: number;
  songIndex: number;
  song: Song;

  soundEffectsMuted: boolean;
}

type PlayEvent = { type: "PLAY" };
type PauseEvent = { type: "PAUSE" };
type DecrementVolumeEvent = { type: "DECREMENT_VOLUME" };
type IncrementVolumeEvent = { type: "INCREMENT_VOLUME" };
type MuteSoundEffectsEvent = { type: "MUTE_SOUND_EFFECTS" };
type UnmuteSoundEffectsEvent = { type: "UNMUTE_SOUND_EFFECTS" };

type NextSongEvent = { type: "NEXT_SONG" };
type VisitGoblinsEvent = { type: "VISIT_GOBLINS" };
type VisitFarmEvent = { type: "VISIT_FARM" };
type VisitCaveEvent = { type: "VISIT_CAVE" };

type BlockchainEvent =
  | PlayEvent
  | PauseEvent
  | IncrementVolumeEvent
  | DecrementVolumeEvent
  | MuteSoundEffectsEvent
  | UnmuteSoundEffectsEvent
  | NextSongEvent
  | VisitGoblinsEvent
  | VisitFarmEvent
  | VisitCaveEvent;

export type BlockchainState = {
  value:
    | "farmAudio"
    | { farmAudio: "playing" }
    | { farmAudio: "paused" }
    | "goblinAudio"
    | { goblinAudio: "playing" }
    | { goblinAudio: "paused" }
    | "caveAudio"
    | { caveAudio: "playing" };
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  BlockchainState
>;

const PAUSE_KEY = "settings.audioPaused";
const VOLUME_KEY = "settings.audioVolume";
const MUTE_KEY = "settings.audioSoundEffectMuted";

export const audioMachine = createMachine<
  Context,
  BlockchainEvent,
  BlockchainState
>(
  {
    initial: "farmAudio",
    context: {
      songVolume: JSON.parse(localStorage.getItem(VOLUME_KEY) ?? "0.1"),
      songIndex: 0,
      song: FARMING_SONGS[0],

      soundEffectsMuted: false,
    },
    on: {
      INCREMENT_VOLUME: {
        actions: ["incrementVolume"],
      },
      DECREMENT_VOLUME: {
        actions: ["decrementVolume"],
      },
      MUTE_SOUND_EFFECTS: {
        actions: ["muteSoundEffects"],
      },
      UNMUTE_SOUND_EFFECTS: {
        actions: ["unmuteSoundEffects"],
      },
    },
    states: {
      farmAudio: {
        entry: "initialiseFarmingSong",
        exit: "stop",
        initial: "loading",
        on: {
          NEXT_SONG: {
            actions: ["rotateFarmingSong"],
          },
          VISIT_GOBLINS: {
            target: "goblinAudio",
          },
        },
        states: {
          loading: {
            always: [
              { target: "paused", cond: "isPaused" },
              { target: "playing" },
            ],
          },
          playing: {
            entry: ["play"],
            on: {
              PAUSE: { target: "paused" },
            },
          },
          paused: {
            entry: ["pause"],
            on: {
              PLAY: { target: "playing" },
            },
          },
        },
      },
      goblinAudio: {
        entry: "initialiseGoblinSong",
        exit: "stop",
        initial: "loading",
        on: {
          NEXT_SONG: {
            actions: ["rotateGoblinSong"],
          },
          VISIT_CAVE: {
            target: "caveAudio",
          },
          VISIT_FARM: {
            target: "farmAudio",
          },
        },
        states: {
          loading: {
            always: [
              { target: "paused", cond: "isPaused" },
              { target: "playing" },
            ],
          },
          playing: {
            entry: ["play"],
            on: {
              PAUSE: { target: "paused" },
            },
          },
          paused: {
            entry: ["pause"],
            on: {
              PLAY: { target: "playing" },
            },
          },
        },
      },
      caveAudio: {
        entry: "initialiseCaveSong",
        exit: "stop",
        initial: "playing",
        on: {
          VISIT_GOBLINS: {
            target: "goblinAudio",
          },
        },
        states: {
          playing: {
            entry: ["play"],
          },
        },
      },
    },
  },
  {
    actions: {
      play: (context, event, send) => {
        context.song.audio.volume(context.songVolume);
        context.song.audio.play();
        context.song.audio.on("end", () => send("ROTATE_SONG"));

        localStorage.setItem(PAUSE_KEY, JSON.stringify(false));
      },

      pause: (context) => {
        context.song.audio.volume(context.songVolume);
        context.song.audio.pause();

        localStorage.setItem(PAUSE_KEY, JSON.stringify(true));
      },

      stop: (context) => {
        context.song.audio.stop();
      },

      incrementVolume: (context) => {
        context.songVolume = Math.min(context.songVolume + 0.1, 1);
        context.song.audio.volume(context.songVolume);

        localStorage.setItem(VOLUME_KEY, JSON.stringify(context.songVolume));
      },

      decrementVolume: (context) => {
        context.songVolume = Math.max(context.songVolume - 0.1, 0);
        context.song.audio.volume(context.songVolume);

        localStorage.setItem(VOLUME_KEY, JSON.stringify(context.songVolume));
      },

      muteSoundEffects: () => {
        Howler.mute(true);
        FARMING_SONGS.forEach((song) => song.audio.mute(false));
        GOBLIN_SONGS.forEach((song) => song.audio.mute(false));
        CAVE_SONGS.forEach((song) => song.audio.mute(false));
      },

      unmuteSoundEffects: () => {
        Howler.mute(false);
      },

      initialiseFarmingSong: (context) => (context.song = FARMING_SONGS[0]),

      initialiseGoblinSong: (context) => (context.song = GOBLIN_SONGS[0]),

      initialiseCaveSong: (context) => (context.song = CAVE_SONGS[0]),

      rotateFarmingSong: (context) => {
        const isPlaying = context.song.audio.playing();

        context.song.audio.stop();

        context.songIndex = (context.songIndex + 1) % FARMING_SONGS.length;
        context.song = FARMING_SONGS[context.songIndex];

        if (isPlaying) {
          context.song.audio.volume(context.songVolume);
          context.song.audio.play();
        }
      },

      rotateGoblinSong: (context) => {
        const isPlaying = context.song.audio.playing();

        context.song.audio.stop();

        context.songIndex = (context.songIndex + 1) % GOBLIN_SONGS.length;
        context.song = GOBLIN_SONGS[context.songIndex];

        if (isPlaying) {
          context.song.audio.volume(context.songVolume);
          context.song.audio.play();
        }
      },
    },
    guards: {
      isPaused: () => JSON.parse(localStorage.getItem(PAUSE_KEY) ?? "false"),
    },
  }
);
