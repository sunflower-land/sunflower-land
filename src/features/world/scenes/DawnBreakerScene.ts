import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [];

export class DawnBreakerScene extends BaseScene {
  roomId: RoomId = "dawn_breaker";

  constructor() {
    super("dawn_breaker");
  }

  async create() {
    console.log("Create decoration shop");
    this.map = this.make.tilemap({
      key: "dawn-breaker",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);

    const camera = this.cameras.main;
  }
}
