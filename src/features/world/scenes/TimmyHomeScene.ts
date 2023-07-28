import timmyHomeJSON from "assets/map/timmy_home.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [];

export class TimmyHomeScene extends BaseScene {
  sceneId: SceneId = "timmy_home";

  constructor() {
    super({ name: "timmy_home", map: { json: timmyHomeJSON } });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "timmy-home",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
