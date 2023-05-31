import { SQUARE_WIDTH } from "features/game/lib/constants";
import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [
  {
    x: 167,
    y: 126,
    npc: "alice",
  },
];

export class AuctionScene extends BaseScene {
  roomId: RoomId = "auction_house";

  constructor() {
    super("auction_house");
  }

  preload() {
    super.preload();

    this.load.image("pig", "public/world/pig.png");
  }

  async create() {
    console.log("Create auction");
    this.map = this.make.tilemap({
      key: "auction-map",
    });
    console.log("Created auction");

    super.create();

    this.initialiseNPCs(BUMPKINS);

    const camera = this.cameras.main;

    camera.setBounds(0, 0, 21 * SQUARE_WIDTH, 20 * SQUARE_WIDTH);
    camera.setZoom(4);

    this.physics.world.setBounds(0, 0, 21 * SQUARE_WIDTH, 20 * SQUARE_WIDTH);

    this.add.sprite(167, 167, "pig").setSize(21, 29);
  }
}
