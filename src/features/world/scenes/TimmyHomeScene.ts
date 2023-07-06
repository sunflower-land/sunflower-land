import timmyHomeJSON from "assets/map/timmy_home.json";

import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [];

export class TimmyHomeScene extends BaseScene {
  roomId: RoomId = "timmy_home";

  constructor() {
    super({ name: "timmy_home", map: { json: timmyHomeJSON } });
  }

  async create() {
    console.log("Create decoration shop");
    this.map = this.make.tilemap({
      key: "timmy-home",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
