import windmillFloorJSON from "assets/map/windmill_floor.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [];

export class WindmillFloorScene extends BaseScene {
  sceneId: SceneId = "windmill_floor";

  constructor() {
    super({ name: "windmill_floor", map: { json: windmillFloorJSON } });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "windmill-floor",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
