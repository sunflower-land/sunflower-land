import mapJSON from "assets/map/retreat.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { CONFIG } from "lib/config";

const BUMPKINS: NPCBumpkin[] = [];

export class RetreatScene extends BaseScene {
  sceneId: SceneId = "retreat";

  constructor() {
    super({
      name: "retreat",
      map: { json: mapJSON, tilesetName: "goblin-tileset" },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    super.preload();

    // Phaser assets must be served from an URL
    this.load.image(
      "goblin-tileset",
      `${CONFIG.PROTECTED_IMAGE_URL}/world/goblin_map-extruded.png`
    );
  }

  create() {
    this.map = this.make.tilemap({
      key: "retreat",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
