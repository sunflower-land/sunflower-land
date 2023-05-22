import { INITIAL_BUMPKIN, SQUARE_WIDTH } from "features/game/lib/constants";
import { npcModalManager } from "./NPCModals";
import { BumpkinContainer } from "./BumpkinContainer";
import { BaseScene } from "./BaseScene";

export class AuctionScene extends BaseScene {
  constructor() {
    super("auction_house");
  }

  async create() {
    console.log("Create auction");
    this.map = this.make.tilemap({
      key: "auction-map",
    });
    console.log("Created auction");

    super.create();
    console.log("super auction");

    this.betty = new BumpkinContainer(
      this,
      400,
      400,
      {
        ...INITIAL_BUMPKIN,
        id: 234,
        equipped: {
          ...INITIAL_BUMPKIN.equipped,
          hair: "Buzz Cut",
          shirt: "Blue Farmer Shirt",
        },
      },
      () => npcModalManager.open("betty")
    );
    this.betty.body.width = 16;
    this.betty.body.height = 20;
    this.betty.body.setOffset(0, 0);
    this.physics.world.enable(this.betty);
    this.betty.body.setImmovable(true);

    this.betty.body.setCollideWorldBounds(true);

    const camera = this.cameras.main;

    camera.setBounds(0, 0, 21 * SQUARE_WIDTH, 20 * SQUARE_WIDTH);
    camera.setZoom(4);

    this.physics.world.setBounds(0, 0, 21 * SQUARE_WIDTH, 20 * SQUARE_WIDTH);
  }
}
