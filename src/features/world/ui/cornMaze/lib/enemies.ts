import { SeasonWeek } from "features/game/types/game";
import { NPCBumpkin } from "features/world/scenes/BaseScene";

export type Enemy = NPCBumpkin & {
  target: {
    x: number;
    y: number;
    direction: "vertical" | "horizontal";
    duration: number;
    hold?: boolean;
    startFacingLeft?: boolean;
  };
};

export const ENEMIES: Record<SeasonWeek, Enemy[]> = {
  1: [
    {
      x: 104,
      y: 328,
      npc: "dreadhorn",
      target: {
        x: 104,
        y: 471,
        direction: "vertical",
        duration: 2000,
      },
    },
    {
      x: 57,
      y: 63,
      npc: "dreadhorn",
      target: {
        x: 294,
        y: 60,
        direction: "horizontal",
        duration: 3500,
      },
    },
    {
      x: 355,
      y: 458,
      npc: "dreadhorn",
      target: {
        x: 260,
        y: 458,
        direction: "horizontal",
        duration: 1800,
        hold: true,
        startFacingLeft: true,
      },
    },
    {
      x: 585,
      y: 506,
      npc: "dreadhorn",
      target: {
        x: 585,
        y: 217,
        direction: "vertical",
        duration: 3500,
      },
    },
    {
      x: 89,
      y: 500,
      npc: "phantom face",
      target: {
        x: 46,
        y: 500,
        direction: "horizontal",
        duration: 1200,
        hold: true,
        startFacingLeft: true,
      },
    },
    {
      x: 518,
      y: 583,
      npc: "phantom face",
      target: {
        x: 483,
        y: 590,
        direction: "horizontal",
        duration: 900,
        hold: true,
        startFacingLeft: true,
      },
    },
    {
      x: 130,
      y: 137,
      npc: "phantom face",
      target: {
        x: 185,
        y: 137,
        direction: "horizontal",
        duration: 1200,
        hold: true,
      },
    },
    {
      x: 342,
      y: 72,
      npc: "phantom face",
      target: {
        x: 440,
        y: 72,
        direction: "horizontal",
        duration: 1800,
        hold: true,
      },
    },
    {
      x: 412,
      y: 545,
      npc: "dreadhorn",
      target: {
        x: 435,
        y: 545,
        direction: "horizontal",
        duration: 800,
        hold: true,
      },
    },
  ],
  2: [
    {
      x: 89,
      y: 500,
      npc: "phantom face",
      target: {
        x: 46,
        y: 500,
        direction: "horizontal",
        duration: 1200,
        hold: true,
        startFacingLeft: true,
      },
    },
    {
      x: 56,
      y: 298,
      npc: "dreadhorn",
      target: {
        x: 56,
        y: 474,
        direction: "vertical",
        duration: 2400,
      },
    },
    {
      x: 139,
      y: 119,
      npc: "dreadhorn",
      target: {
        x: 296,
        y: 119,
        direction: "horizontal",
        duration: 2200,
      },
    },
    {
      x: 472,
      y: 56,
      npc: "phantom face",
      target: {
        x: 360,
        y: 81,
        direction: "horizontal",
        duration: 2000,
        hold: true,
        startFacingLeft: true,
      },
    },
    {
      x: 167,
      y: 567,
      npc: "phantom face",
      target: {
        x: 167,
        y: 600,
        direction: "vertical",
        duration: 1200,
        startFacingLeft: true,
        hold: true,
      },
    },
    {
      x: 230,
      y: 566,
      npc: "dreadhorn",
      target: {
        x: 312,
        y: 566,
        direction: "horizontal",
        duration: 1800,
        hold: true,
      },
    },
    {
      x: 423,
      y: 328,
      npc: "dreadhorn",
      target: {
        x: 423,
        y: 517,
        direction: "vertical",
        duration: 2500,
        startFacingLeft: true,
      },
    },
    {
      x: 263,
      y: 183,
      npc: "phantom face",
      target: {
        x: 360,
        y: 183,
        direction: "horizontal",
        duration: 2000,
        hold: true,
      },
    },
  ],
  3: [
    {
      x: 279,
      y: 72,
      npc: "dreadhorn",
      target: {
        x: 279,
        y: 150,
        direction: "vertical",
        duration: 2500,
      },
    },
    {
      x: 470,
      y: 328,
      npc: "phantom face",
      target: {
        x: 375,
        y: 328,
        direction: "horizontal",
        duration: 3000,
        hold: true,
        startFacingLeft: true,
      },
    },
    {
      x: 535,
      y: 262,
      npc: "farmer flesh",
      target: {
        x: 535,
        y: 230,
        direction: "vertical",
        duration: 1500,
        hold: true,
      },
    },
    {
      x: 54,
      y: 201,
      npc: "phantom face",
      target: {
        x: 362,
        y: 201,
        direction: "horizontal",
        duration: 4500,
        hold: true,
      },
    },
    {
      x: 583,
      y: 70,
      npc: "boneyard betty",
      target: {
        x: 583,
        y: 233,
        direction: "vertical",
        duration: 3800,
        hold: true,
        startFacingLeft: true,
      },
    },
    {
      x: 184,
      y: 519,
      npc: "dreadhorn",
      target: {
        x: 56,
        y: 535,
        direction: "horizontal",
        duration: 3000,
        hold: true,
        startFacingLeft: true,
      },
    },
    {
      x: 278,
      y: 469,
      npc: "farmer flesh",
      target: {
        x: 278,
        y: 518,
        direction: "horizontal",
        duration: 2000,
        startFacingLeft: true,
      },
    },
    {
      x: 479,
      y: 486,
      npc: "phantom face",
      target: {
        x: 520,
        y: 456,
        direction: "horizontal",
        duration: 2500,
        hold: true,
      },
    },
    {
      x: 218,
      y: 599,
      npc: "boneyard betty",
      target: {
        x: 312,
        y: 599,
        direction: "horizontal",
        duration: 2500,
        hold: true,
      },
    },
    {
      x: 487,
      y: 359,
      npc: "dreadhorn",
      target: {
        x: 487,
        y: 328,
        direction: "vertical",
        duration: 1500,
        hold: true,
        startFacingLeft: true,
      },
    },
    {
      x: 62,
      y: 426,
      npc: "farmer flesh",
      target: {
        x: 44,
        y: 426,
        direction: "horizontal",
        duration: 1000,
        hold: true,
        startFacingLeft: true,
      },
    },
  ],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
  10: [],
  11: [],
  12: [],
};
