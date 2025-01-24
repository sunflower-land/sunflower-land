import json from "assets/map/volcaro.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { CONFIG } from "lib/config";

const BUMPKINS: NPCBumpkin[] = [];

export class VolcaroScene extends BaseScene {
  sceneId: SceneId = "volcaro";

  constructor() {
    super({
      name: "volcaro",
      map: {
        json: json,
        imageKey: "volcaro-tileset",
      },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    this.load.image(
      "volcaro-tileset",
      `${CONFIG.PROTECTED_IMAGE_URL}/world/volcano-map-extruded.png`,
    );

    // Load sprite sheet for smoke
    this.load.spritesheet(
      "small_smoke",
      `${CONFIG.PROTECTED_IMAGE_URL}/vfx/smoke_1.png`,
      { frameWidth: 10, frameHeight: 30 },
    );

    this.load.spritesheet(
      "large_smoke",
      `${CONFIG.PROTECTED_IMAGE_URL}/vfx/smoke_3.png`,
      { frameWidth: 18, frameHeight: 21 },
    );

    console.log("Preloaded");

    super.preload();
  }

  create() {
    this.map = this.make.tilemap({
      key: "volcaro",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);

    // Place smoke, create animation and play
    const smoke = this.add.sprite(256, 301, "small_smoke");
    // Create animation
    this.anims.create({
      key: "smoke",
      frames: this.anims.generateFrameNumbers("small_smoke", {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });
    smoke.play("smoke");
  }
}
