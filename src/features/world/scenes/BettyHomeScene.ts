import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [];

export class BettyHomeScene extends BaseScene {
  roomId: RoomId = "betty_home";
  constructor() {
    super("betty_home");
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
