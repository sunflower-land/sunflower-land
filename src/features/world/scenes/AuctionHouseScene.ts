import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [
  {
    x: 167,
    y: 126,
    npc: "hammerin' harry",
  },
];

export class AuctionScene extends BaseScene {
  roomId: RoomId = "auction_house";

  constructor() {
    super("auction_house");
  }

  preload() {
    super.preload();
  }

  async create() {
    console.log("Create auction");
    this.map = this.make.tilemap({
      key: "auction-map",
    });
    console.log("Created auction");

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
