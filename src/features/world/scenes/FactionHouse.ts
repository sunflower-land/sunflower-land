import mapJSON from "assets/map/faction_house.json";

import { SceneId } from "../mmoMachine";
import { BaseScene } from "./BaseScene";

export class FactionHouseScene extends BaseScene {
  sceneId: SceneId = "faction_house";

  constructor() {
    super({
      name: "faction_house",
      map: { json: mapJSON },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    super.preload();
  }

  create() {
    this.map = this.make.tilemap({
      key: "faction_house",
    });

    super.create();
  }
}
