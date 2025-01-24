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
    super.preload();
  }

  create() {
    this.map = this.make.tilemap({
      key: "volcaro",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
