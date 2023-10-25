import mapJSON from "assets/map/beach.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { SUNNYSIDE } from "assets/sunnyside";

const BUMPKINS: NPCBumpkin[] = [
  {
    npc: "shelly",
    x: 326,
    y: 631,
  },
  {
    npc: "finn",
    x: 84,
    y: 518,
  },
  {
    npc: "finley",
    x: 122,
    y: 390,
    direction: "left",
  },
  {
    npc: "tango",
    x: 416,
    y: 351,
  },
  {
    npc: "goldtooth",
    x: 304,
    y: 255,
  },
  {
    npc: "corale",
    x: 149,
    y: 670,
  },
  {
    x: 338,
    y: 407,
    npc: "miranda",
  },
];

export class BeachScene extends BaseScene {
  sceneId: SceneId = "beach";

  constructor() {
    super({ name: "beach", map: { json: mapJSON } });
  }

  preload() {
    super.preload();

    this.load.spritesheet("turtle_bud", "world/turtle.png", {
      frameWidth: 15,
      frameHeight: 17,
    });

    this.load.image("kraken", "world/kraken.png");

    this.load.image("fish_label", "world/fish_label.png");

    this.load.spritesheet("bird", SUNNYSIDE.animals.bird, {
      frameWidth: 16,
      frameHeight: 17,
    });

    this.load.spritesheet("blinking", SUNNYSIDE.vfx.blinking, {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("fisher", SUNNYSIDE.npcs.fishing_sheet, {
      frameWidth: 58,
      frameHeight: 50,
    });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "beach",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);

    this.add.sprite(308, 755, "kraken");

    this.add.sprite(348, 740, "fish_label");

    const turtle = this.add.sprite(328, 520, "turtle_bud");
    turtle.setScale(-1, 1);
    this.anims.create({
      key: "turtle_bud_anim",
      frames: this.anims.generateFrameNumbers("turtle_bud", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    turtle.play("turtle_bud_anim", true);

    const blinking = this.add.sprite(319, 36, "blinking");
    this.anims.create({
      key: "blinking_anim",
      frames: this.anims.generateFrameNumbers("blinking", {
        start: 0,
        end: 12,
      }),
      repeat: -1,
      frameRate: 5,
    });
    blinking.play("blinking_anim", true);

    const bird = this.add.sprite(318, 460, "bird");
    this.anims.create({
      key: "bird_anim",
      frames: this.anims.generateFrameNumbers("bird", {
        start: 0,
        end: 4,
      }),
      repeat: -1,
      frameRate: 5,
    });
    bird.play("bird_anim", true);

    const fisher = this.add.sprite(316, 710, "fisher");
    this.anims.create({
      key: "fisher_waiting",
      frames: this.anims.generateFrameNumbers("fisher", {
        start: 24,
        end: 32,
      }),
      repeat: -1,
      frameRate: 10,
    });
    this.anims.create({
      key: "fisher_reel",
      frames: this.anims.generateFrameNumbers("fisher", {
        start: 33,
        end: 45,
      }),
      repeat: -1,
      frameRate: 16,
    });
    fisher.play("fisher_waiting", true);

    beachEvents.subscribe("reel", () => {
      fisher.play("fisher_reel", true);

      fisher.on(
        Phaser.Animations.Events.ANIMATION_UPDATE,
        (_: any, frame: any) => {
          if (frame.textureFrame === 45) {
            fisher.play("fisher_waiting", true);
          }
        }
      );

      fisher.on("animationcomplete-fisher_reel", () => {
        fisher.play("fisher_waiting", true);
      });
    });
  }
}

// PubSub.ts

type Callback = (...args: any[]) => void;

class BeachPubSub {
  private events: Record<string, Callback[]> = {};

  subscribe(event: string, callback: Callback): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);
  }

  publish(event: string, ...args: any[]): void {
    if (this.events[event]) {
      this.events[event].forEach((callback) => {
        callback(...args);
      });
    }
  }

  unsubscribe(event: string, callback: Callback): void {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }
  }
}

export const beachEvents = new BeachPubSub();
