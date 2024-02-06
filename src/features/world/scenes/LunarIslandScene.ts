import mapJSON from "assets/map/lunar_island.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { CONFIG } from "lib/config";

export class LunarIslandScene extends BaseScene {
  sceneId: SceneId = "lunar_island";

  constructor() {
    super({
      name: "lunar_island",
      map: {
        json: mapJSON,
        defaultTilesetConfig: mapJSON.tilesets,
        imageKey: "lunar-tileset",
      },
    });
  }

  preload() {
    this.load.image(
      "lunar-tileset",
      `${CONFIG.PROTECTED_IMAGE_URL}/world/lunar-map-extruded.png`
    );

    super.preload();
  }

  async create() {
    this.map = this.make.tilemap({
      key: "lunar_island",
    });

    super.create();
  }
}
