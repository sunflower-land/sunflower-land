import { SQUARE_WIDTH } from "features/game/lib/constants";
import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

const BUMPKINS: NPCBumpkin[] = [];

export class WoodlandsScene extends BaseScene {
  roomId: RoomId = "woodlands";

  spawn: Coordinates = {
    x: 75,
    y: 75,
  };
  constructor() {
    super("woodlands");
  }

  async create() {
    console.log("Create woodlands shop");
    this.map = this.make.tilemap({
      key: "woodlands",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);

    const camera = this.cameras.main;

    camera.setBounds(0, 0, 49 * SQUARE_WIDTH, 25 * SQUARE_WIDTH);
    camera.setZoom(4);

    this.physics.world.setBounds(0, 0, 49 * SQUARE_WIDTH, 25 * SQUARE_WIDTH);
  }
}
