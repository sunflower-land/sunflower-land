import mapJSON from "assets/map/beach.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [];

export class BeachScene extends BaseScene {
  sceneId: SceneId = "beach";

  constructor() {
    super({ name: "beach", map: { json: mapJSON } });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "beach",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
