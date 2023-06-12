import { SQUARE_WIDTH } from "features/game/lib/constants";
import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

const BUMPKINS: NPCBumpkin[] = [
  {
    x: 112,
    y: 60,
    npc: "frankie",
  },
];

export class DecorationShopScene extends BaseScene {
  roomId: RoomId = "decorations_shop";

  spawn: Coordinates = {
    x: 55,
    y: 157,
  };
  constructor() {
    super("decorations_shop");
  }

  async create() {
    console.log("Create decoration shop");
    this.map = this.make.tilemap({
      key: "decorations-shop",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);

    const camera = this.cameras.main;

    camera.setBounds(0, 0, 20 * SQUARE_WIDTH, 20 * SQUARE_WIDTH);
    camera.setZoom(4);

    this.physics.world.setBounds(0, 0, 20 * SQUARE_WIDTH, 20 * SQUARE_WIDTH);
  }
}
