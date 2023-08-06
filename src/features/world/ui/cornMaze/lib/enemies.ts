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
  3: [],
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
