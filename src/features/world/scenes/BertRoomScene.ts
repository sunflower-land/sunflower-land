import bertHomeJSON from "assets/map/bert_home.json";

import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [];

export class BertScene extends BaseScene {
  roomId: RoomId = "bert_home";

  constructor() {
    super({ name: "bert_home", map: { json: bertHomeJSON } });
  }

  async create() {
    console.log("Create decoration shop");
    this.map = this.make.tilemap({
      key: "bert-home",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
