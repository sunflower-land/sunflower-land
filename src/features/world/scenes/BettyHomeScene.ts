import bettyHomeJSON from "assets/map/betty_home.json";

import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [];

export class BettyHomeScene extends BaseScene {
  roomId: RoomId = "betty_home";
  constructor() {
    super({ name: "betty_home", map: { json: bettyHomeJSON } });
  }

  async create() {
    console.log("Create decoration shop");
    this.map = this.make.tilemap({
      key: "betty-home",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
