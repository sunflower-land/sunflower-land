import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [
  {
    x: 144,
    y: 134,
    npc: "stella",
  },
];

export class ClothesShopScene extends BaseScene {
  roomId: RoomId = "clothes_shop";

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
  }
}
