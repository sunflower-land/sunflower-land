import woodlandsJSON from "assets/map/woodlands.json";

import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [];

export class WoodlandsScene extends BaseScene {
  roomId: RoomId = "woodlands";

  constructor() {
    super({ name: "woodlands", map: { json: woodlandsJSON } });
  }

  async create() {
    console.log("Create woodlands shop");
    this.map = this.make.tilemap({
      key: "woodlands",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
