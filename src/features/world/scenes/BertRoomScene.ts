import { SQUARE_WIDTH } from "features/game/lib/constants";
import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

const BUMPKINS: NPCBumpkin[] = [];

export class BertScene extends BaseScene {
  roomId: RoomId = "bert_home";

  spawn: Coordinates = {
    x: 75,
    y: 75,
  };
  constructor() {
    super("bert_home");
  }

  async create() {
    console.log("Create decoration shop");
    this.map = this.make.tilemap({
      key: "bert-home",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);

    const camera = this.cameras.main;

    camera.setBounds(0, 0, 20 * SQUARE_WIDTH, 20 * SQUARE_WIDTH);
    camera.setZoom(4);

    this.physics.world.setBounds(0, 0, 20 * SQUARE_WIDTH, 20 * SQUARE_WIDTH);
  }
}
