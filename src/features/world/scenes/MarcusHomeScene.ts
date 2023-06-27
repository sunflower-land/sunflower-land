import { SUNNYSIDE } from "assets/sunnyside";
import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [];

export class MarcusHomeScene extends BaseScene {
  roomId: RoomId = "marcus_home";

  constructor() {
    super("marcus_home");
  }

  preload() {
    super.preload();

    this.load.image("alert", SUNNYSIDE.icons.expression_alerted);
  }

  async create() {
    this.map = this.make.tilemap({
      key: "marcus-home",
    });

    super.create();

    this.add.sprite(56.5, 15.5, "alert");

    this.initialiseNPCs(BUMPKINS);
  }
}
