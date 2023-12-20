import bertHomeJSON from "assets/map/bert_home.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [];

export class BertScene extends BaseScene {
  sceneId: SceneId = "bert_home";

  constructor() {
    super({ name: "bert_home", map: { json: bertHomeJSON } });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "bert-home",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
