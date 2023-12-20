import bettyHomeJSON from "assets/map/betty_home.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [];

export class BettyHomeScene extends BaseScene {
  sceneId: SceneId = "betty_home";
  constructor() {
    super({ name: "betty_home", map: { json: bettyHomeJSON } });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "betty-home",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
