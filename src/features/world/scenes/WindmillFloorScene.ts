import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [];

export class WindmillFloorScene extends BaseScene {
  roomId: RoomId = "windmill_floor";

  constructor() {
    super("windmill_floor");
  }

  async create() {
    console.log("Create decoration shop");
    this.map = this.make.tilemap({
      key: "windmill-floor",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
