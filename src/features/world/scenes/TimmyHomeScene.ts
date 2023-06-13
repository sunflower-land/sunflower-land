import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [];

export class TimmyHomeScene extends BaseScene {
  roomId: RoomId = "timmy_home";

  constructor() {
    super("timmy_home");
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
