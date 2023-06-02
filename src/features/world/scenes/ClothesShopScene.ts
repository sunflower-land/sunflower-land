import { SQUARE_WIDTH } from "features/game/lib/constants";
import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

const BUMPKINS: NPCBumpkin[] = [
  {
    x: 144,
    y: 162,
    npc: "stella",
  },
];

export class ClothesShopScene extends BaseScene {
  roomId: RoomId = "clothes_shop";

  spawn: Coordinates = {
    x: 144,
    y: 212,
  };
  constructor() {
    super("clothes_shop");
  }

  async create() {
    console.log("Create clothes shop");
    this.map = this.make.tilemap({
      key: "clothes-shop",
    });
    console.log("Created auction");

    super.create();

    this.initialiseNPCs(BUMPKINS);

    const camera = this.cameras.main;

    camera.setBounds(0, 0, 20 * SQUARE_WIDTH, 20 * SQUARE_WIDTH);
    camera.setZoom(4);

    this.physics.world.setBounds(0, 0, 20 * SQUARE_WIDTH, 20 * SQUARE_WIDTH);
  }
}
