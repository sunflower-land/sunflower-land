import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [];

export class IgorHomeScene extends BaseScene {
  roomId: RoomId = "igor_home";

  constructor() {
    super("igor_home");
  }

  async create() {
    console.log("Create igor_home shop");
    this.map = this.make.tilemap({
      key: "igor-home",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
