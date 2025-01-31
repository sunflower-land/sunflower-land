import json from "assets/map/volcaro.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { CONFIG } from "lib/config";

const BUMPKINS: NPCBumpkin[] = [
  {
    npc: "gilda",
    x: 431,
    y: 272,
    direction: "left",
  },
  {
    npc: "gunter",
    x: 188,
    y: 298,
  },
  {
    npc: "gorga",

    x: 395,
    y: 165,
  },
];

export class InfernosScene extends BaseScene {
  sceneId: SceneId = "infernos";

  constructor() {
    super({
      name: "infernos",
      map: {
        json: json,
        imageKey: "infernos-tileset",
      },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    this.load.image(
      "infernos-tileset",
      `${CONFIG.PROTECTED_IMAGE_URL}/world/volcano-map-extruded.png`,
    );

    // Load sprite sheet for smoke
    this.load.spritesheet(
      "small_smoke",
      `${CONFIG.PROTECTED_IMAGE_URL}/vfx/smoke_2.png`,
      { frameWidth: 10, frameHeight: 30 },
    );

    this.load.spritesheet(
      "large_smoke",
      `${CONFIG.PROTECTED_IMAGE_URL}/vfx/smoke_3.png`,
      { frameWidth: 18, frameHeight: 21 },
    );

    super.preload();
  }

  create() {
    this.map = this.make.tilemap({
      key: "infernos",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);

    // Place smoke, create animation and play
    const smoke = this.add.sprite(256, 286, "small_smoke").setDepth(100000);
    const smoke2 = this.add.sprite(352, 270, "small_smoke").setDepth(100000);
    const smoke3 = this.add.sprite(352, 270, "small_smoke").setDepth(100000);
    const smoke4 = this.add.sprite(480, 44, "small_smoke").setDepth(100000);

    const forgeSmoke = this.add.sprite(160, 284, "large_smoke");

    // Create animation
    this.anims.create({
      key: "smoke",
      frames: this.anims.generateFrameNumbers("small_smoke", {
        start: 0,
        end: 29,
      }),
      // 100ms frame rate
      frameRate: 8,
      repeat: -1,
    });

    // Create animation
    this.anims.create({
      key: "large_smoke",
      frames: this.anims.generateFrameNumbers("large_smoke", {
        start: 0,
        end: 29,
      }),
      // 100ms frame rate
      frameRate: 8,
      repeat: -1,
    });

    smoke.play("smoke");

    smoke2.play({
      delay: 1500,
      key: "smoke",
    });

    smoke3.play({
      delay: 3000,
      key: "smoke",
    });

    smoke4.play({
      delay: 4500,
      key: "smoke",
    });

    forgeSmoke.play("large_smoke");
  }
}
