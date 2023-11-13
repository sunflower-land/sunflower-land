import igorHomeJSON from "assets/map/blacksmith_home.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [];

export class IgorHomeScene extends BaseScene {
  sceneId: SceneId = "igor_home";

  constructor() {
    super({ name: "igor_home", map: { json: igorHomeJSON } });
  }

  async create() {
    // eslint-disable-next-line no-console
    console.log("Create igor_home shop");
    this.map = this.make.tilemap({
      key: "igor-home",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
